import { activateSeat, getBuyerById, getSeatByToken } from '@cio/db/queries';
import { env } from '$env/dynamic/public';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

/**
 * GET /accept-invite/[token]
 *
 * Loads a seat by invite token. Renders friendly error blocks for
 * not_found / already_accepted / cancelled / expired.
 */
export const load: PageServerLoad = async ({ params }) => {
  const row = await getSeatByToken(params.token);

  if (!row) {
    return { invite: null, reason: 'not_found' as const };
  }

  if (row.status === 'active') {
    return { invite: null, reason: 'already_accepted' as const };
  }

  if (row.status === 'cancelled') {
    return { invite: null, reason: 'cancelled' as const };
  }

  if (new Date(row.inviteExpiresAt).getTime() < Date.now()) {
    return { invite: null, reason: 'expired' as const };
  }

  return {
    invite: {
      seatId: row.id,
      participantEmail: row.participantEmail,
      participantName: row.participantName,
      planName: row.planName
    }
  };
};

/**
 * POST /accept-invite/[token]
 *
 * Participant accepts the seat. POSTs to the API container's Better-Auth
 * /api/auth/sign-up/email endpoint to create the participant user with
 * purchaserType='participant' and parentUserId or counselorUserId linked
 * based on the buyer's purchaser_type. Then marks the seat active.
 *
 * The API call goes to PUBLIC_SERVER_URL rather than importing the auth
 * instance directly, because importing @cio/db/auth pulls Better-Auth's
 * entire runtime into the dashboard bundle and breaks the SvelteKit build
 * (__dirname undefined in ES module scope).
 */
export const actions: Actions = {
  default: async ({ params, request, fetch: localFetch, cookies }) => {
    const data = await request.formData();
    const name = String(data.get('name') ?? '').trim();
    const password = String(data.get('password') ?? '');
    const confirmPassword = String(data.get('confirmPassword') ?? '');

    if (!name) return fail(400, { fieldError: { name: 'Name is required' } });
    if (password.length < 8) {
      return fail(400, { fieldError: { password: 'Password must be at least 8 characters' } });
    }
    if (password !== confirmPassword) {
      return fail(400, { fieldError: { confirmPassword: 'Passwords do not match' } });
    }

    const row = await getSeatByToken(params.token);
    if (!row) return fail(404, { error: 'Invite not found' });
    if (row.status !== 'pending') return fail(409, { error: 'Invite is no longer valid' });
    if (new Date(row.inviteExpiresAt).getTime() < Date.now()) {
      return fail(410, { error: 'Invite has expired. Ask whoever invited you to send a new one.' });
    }

    const buyer = await getBuyerById(row.buyerUserId);
    if (!buyer) return fail(500, { error: 'The buyer account is no longer accessible' });

    const linkField = buyer.purchaserType === 'parent' ? 'parentUserId' : 'counselorUserId';

    const apiBase = env.PUBLIC_SERVER_URL || '';
    if (!apiBase) {
      console.error('[accept-invite] PUBLIC_SERVER_URL is not set');
      return fail(500, { error: 'Server is not configured for signups' });
    }

    const signupBody: Record<string, unknown> = {
      email: row.participantEmail,
      password,
      name,
      purchaserType: 'participant',
      [linkField]: buyer.id
    };

    let signupRes: Response;
    try {
      signupRes = await localFetch(`${apiBase}/api/auth/sign-up/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupBody)
      });
    } catch (err) {
      console.error('[accept-invite] signup fetch failed', err);
      return fail(502, { error: 'Could not reach the signup service' });
    }

    if (!signupRes.ok) {
      const text = await signupRes.text().catch(() => '');
      console.error('[accept-invite] signup returned non-ok', signupRes.status, text);
      let parsed: { message?: string } = {};
      try {
        parsed = JSON.parse(text);
      } catch {
        // not JSON
      }
      return fail(signupRes.status, { error: parsed.message ?? 'Could not create account' });
    }

    const signupPayload = (await signupRes.json()) as { user?: { id: string } };
    const participantId = signupPayload.user?.id;
    if (!participantId) {
      return fail(500, { error: 'Account creation returned no user id' });
    }

    // Forward any Set-Cookie headers from the signup response so the
    // participant is logged in on this dashboard origin too
    const setCookie = signupRes.headers.get('set-cookie');
    if (setCookie) {
      // Note: SvelteKit's cookies API expects parsed key/value pairs, not
      // a raw header string. For now, log and rely on the participant
      // logging in via the standard flow. This is a follow-up.
      console.log('[accept-invite] signup set-cookie present (not forwarded yet)', setCookie.length, 'bytes');
    }

    const updated = await activateSeat(row.id, participantId);
    if (updated === 0) {
      console.warn('[accept-invite] race: seat already non-pending', { seatId: row.id });
    } else {
      console.log('[accept-invite] activated seat', {
        seatId: row.id,
        participantId,
        linkField,
        buyerId: buyer.id
      });
    }

    // Redirect to login since we couldn't forward the session cookie cleanly
    throw redirect(303, '/login?invite_accepted=1');
  }
};
