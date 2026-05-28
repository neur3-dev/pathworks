import { activateSeat, getBuyerById, getSeatByToken, linkParticipantToBuyer } from '@cio/db/queries';
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

    if (buyer.purchaserType !== 'parent' && buyer.purchaserType !== 'counselor' && buyer.purchaserType !== 'advisor') {
      return fail(500, { error: 'Buyer has an unexpected purchaser type' });
    }
    const buyerKind = buyer.purchaserType as 'parent' | 'counselor' | 'advisor';

    const apiBase = env.PUBLIC_SERVER_URL || '';
    if (!apiBase) {
      console.error('[accept-invite] PUBLIC_SERVER_URL is not set');
      return fail(500, { error: 'Server is not configured for signups' });
    }

    // Better-Auth's signup will only accept the input:true fields. The
    // parent_user_id / counselor_user_id link is intentionally NOT
    // accepted at signup (input:false in auth.ts) to prevent arbitrary
    // claim. We attach the link via a server-side UPDATE after signup.
    const signupBody: Record<string, unknown> = {
      email: row.participantEmail,
      password,
      name,
      purchaserType: 'participant'
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

    // Attach the participant to their buyer (parent_user_id or
    // counselor_user_id) now that we have a participant user_id.
    try {
      await linkParticipantToBuyer(participantId, buyer.id, buyerKind);
    } catch (err) {
      console.error('[accept-invite] linkParticipantToBuyer failed', err);
    }

    const updated = await activateSeat(row.id, participantId);
    if (updated === 0) {
      console.warn('[accept-invite] race: seat already non-pending', { seatId: row.id });
    } else {
      console.log('[accept-invite] activated seat', {
        seatId: row.id,
        participantId,
        buyerKind,
        buyerId: buyer.id
      });
    }

    // Redirect to login since we couldn't forward the session cookie cleanly
    throw redirect(303, '/login?invite_accepted=1');
  }
};
