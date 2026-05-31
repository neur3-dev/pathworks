import { createPendingSeat, getBuyerById } from '@cio/db/queries';
import { sendEmail } from '@cio/email';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSessionData } from '$lib/utils/services/auth/session';

/**
 * POST /api/seats
 *
 * Provisions a pending seat owned by the calling user for a named participant
 * email. The participant later accepts via /accept-invite/[token].
 *
 * Auth: caller must be logged in and have purchaser_type in
 * ('parent', 'counselor', 'advisor'). Adults do not call this endpoint;
 * their seat is provisioned by the Polar webhook at subscription.created
 * (deferred until Polar products are recreated at the new prices).
 *
 * Body:
 *   participantEmail: string (required)
 *   participantName: string (optional)
 *   planName: 'BASIC' | 'EARLY_ADOPTER' | 'ENTERPRISE' (optional)
 *
 * Returns: { seat: { id, inviteToken, inviteUrl, participantEmail, ... }, emailSent }
 *
 * Side effect: fires the participantSeatInvite email via @cio/email. The
 * send is awaited but failures do not fail the request — the inviteUrl is
 * still returned so the buyer UI can copy or share it as a fallback.
 */
export const POST: RequestHandler = async ({ request, cookies, url }) => {
  const session = await getSessionData(cookies);
  if (!session?.user?.id) {
    error(401, 'Sign in required');
  }

  const buyer = await getBuyerById(session.user.id);
  if (!buyer) {
    error(401, 'Account not found');
  }

  const allowedBuyerTypes = ['parent', 'counselor', 'advisor'] as const;
  if (!buyer.purchaserType || !allowedBuyerTypes.includes(buyer.purchaserType as (typeof allowedBuyerTypes)[number])) {
    error(403, 'Only parents, counselors, and advisors can create seats');
  }

  type Body = {
    participantEmail?: string;
    participantName?: string;
    planName?: string;
  };
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    error(400, 'Invalid JSON body');
  }

  const participantEmail = body.participantEmail?.trim().toLowerCase();
  if (!participantEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(participantEmail)) {
    error(400, 'Valid participantEmail required');
  }

  const participantName = body.participantName?.trim() || null;
  const planName = body.planName || (buyer.purchaserType === 'parent' ? 'BASIC' : 'EARLY_ADOPTER');

  const createdSeat = await createPendingSeat({
    buyerUserId: buyer.id,
    participantEmail,
    participantName,
    planName
  });

  const inviteUrl = `${url.origin}/accept-invite/${createdSeat.inviteToken}`;

  console.log('[seat] created seat', {
    id: createdSeat.id,
    participantEmail,
    buyerId: buyer.id,
    inviteUrl
  });

  const inviterRole = buyer.purchaserType as 'parent' | 'counselor' | 'advisor';
  const inviterName = buyer.name?.trim() || buyer.email;
  const expiresAtLabel = new Date(createdSeat.inviteExpiresAt).toISOString().slice(0, 10);

  let emailSent = false;
  try {
    await sendEmail('participantSeatInvite', {
      to: participantEmail,
      fields: {
        participantName: createdSeat.participantName ?? undefined,
        inviterName,
        inviterRole,
        inviteLink: inviteUrl,
        expiresAt: expiresAtLabel,
        planName: createdSeat.planName ?? undefined
      }
    });
    emailSent = true;
  } catch (err) {
    console.error('[seat] invite email send failed', {
      seatId: createdSeat.id,
      participantEmail,
      error: err instanceof Error ? err.message : String(err)
    });
  }

  return json({
    seat: {
      ...createdSeat,
      inviteUrl
    },
    emailSent
  });
};
