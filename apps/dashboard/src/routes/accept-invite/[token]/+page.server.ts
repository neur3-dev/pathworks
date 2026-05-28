import { db } from '@cio/db/drizzle';
import { seat, user } from '@cio/db/schema';
import { auth } from '@cio/db/auth';
import { and, eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

/**
 * GET /accept-invite/[token]
 *
 * Loads a seat by invite token. If the seat exists, is pending, and the
 * invite has not expired, the participant signup form is rendered.
 */
export const load: PageServerLoad = async ({ params }) => {
  const token = params.token;
  const row = await db
    .select({
      id: seat.id,
      participantEmail: seat.participantEmail,
      participantName: seat.participantName,
      status: seat.status,
      inviteExpiresAt: seat.inviteExpiresAt,
      buyerUserId: seat.buyerUserId,
      planName: seat.planName
    })
    .from(seat)
    .where(eq(seat.inviteToken, token))
    .limit(1)
    .then((rows) => rows[0]);

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
 *
 * Body (form-data):
 *   name: string
 *   password: string
 *   confirmPassword: string
 */
export const actions: Actions = {
  default: async ({ params, request, fetch: localFetch }) => {
    const token = params.token;
    const data = await request.formData();
    const name = String(data.get('name') ?? '').trim();
    const password = String(data.get('password') ?? '');
    const confirmPassword = String(data.get('confirmPassword') ?? '');

    if (!name) return fail(400, { fieldError: { name: 'Name is required' } });
    if (password.length < 8) return fail(400, { fieldError: { password: 'Password must be at least 8 characters' } });
    if (password !== confirmPassword) return fail(400, { fieldError: { confirmPassword: 'Passwords do not match' } });

    const row = await db
      .select({
        id: seat.id,
        participantEmail: seat.participantEmail,
        status: seat.status,
        inviteExpiresAt: seat.inviteExpiresAt,
        buyerUserId: seat.buyerUserId
      })
      .from(seat)
      .where(eq(seat.inviteToken, token))
      .limit(1)
      .then((rows) => rows[0]);

    if (!row) return fail(404, { error: 'Invite not found' });
    if (row.status !== 'pending') return fail(409, { error: 'Invite is no longer valid' });
    if (new Date(row.inviteExpiresAt).getTime() < Date.now()) {
      return fail(410, { error: 'Invite has expired. Ask whoever invited you to send a new one.' });
    }

    // Look up the buyer to decide which link field to set on the participant
    const buyer = await db
      .select({
        id: user.id,
        purchaserType: user.purchaserType
      })
      .from(user)
      .where(eq(user.id, row.buyerUserId))
      .limit(1)
      .then((rows) => rows[0]);

    if (!buyer) return fail(500, { error: 'The buyer account is no longer accessible' });

    const linkField = buyer.purchaserType === 'parent' ? 'parentUserId' : 'counselorUserId';

    // Create participant via Better-Auth so the password is hashed correctly
    // and the account record is set up the same as any signup
    type SignupExtras = { purchaserType?: string; parentUserId?: string; counselorUserId?: string };
    const signupBody: { email: string; password: string; name: string } & SignupExtras = {
      email: row.participantEmail,
      password,
      name,
      purchaserType: 'participant',
      [linkField]: buyer.id
    };

    let signupResponse: { user?: { id: string }; error?: { message?: string } };
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

    // Mark seat active and attach participant_user_id
    await db
      .update(seat)
      .set({
        status: 'active',
        participantUserId: participantId,
        acceptedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .where(and(eq(seat.id, row.id), eq(seat.status, 'pending')));

    console.log('[accept-invite] activated seat', { seatId: row.id, participantId, linkField, buyerId: buyer.id });

    // Better-Auth has already set the session cookie via signUpEmail; head into the dashboard
    throw redirect(303, '/');
  }
};
