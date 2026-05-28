import { activateSeat, getBuyerById, getSeatByToken } from '@cio/db/queries';
import { auth } from '@cio/db/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

/**
 * GET /accept-invite/[token]
 *
 * Loads a seat by invite token. If the seat exists, is pending, and the
 * invite has not expired, the participant signup form is rendered.
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
 * Participant accepts the seat. Creates a user account with
 * purchaser_type='participant' linked to the buyer (parent_user_id or
 * counselor_user_id depending on buyer's purchaser_type), then marks the
 * seat as active.
 */
export const actions: Actions = {
  default: async ({ params, request }) => {
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

    type SignupExtras = { purchaserType?: string; parentUserId?: string; counselorUserId?: string };
    const signupBody: { email: string; password: string; name: string } & SignupExtras = {
      email: row.participantEmail,
      password,
      name,
      purchaserType: 'participant',
      [linkField]: buyer.id
    };

    let signupResponse: { user?: { id: string } };
    try {
      const res = await auth.api.signUpEmail({
        body: signupBody,
        asResponse: false
      });
      signupResponse = res as typeof signupResponse;
    } catch (err) {
      console.error('[accept-invite] Better-Auth signUpEmail failed', err);
      const message = (err as { message?: string })?.message ?? 'Could not create account';
      return fail(400, { error: message });
    }

    const participantId = signupResponse?.user?.id;
    if (!participantId) {
      return fail(500, { error: 'Account creation returned no user id' });
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

    throw redirect(303, '/');
  }
};
