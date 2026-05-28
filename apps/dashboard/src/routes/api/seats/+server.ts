import { db } from '@cio/db/drizzle';
import { seat, user } from '@cio/db/schema';
import { eq } from 'drizzle-orm';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSessionData } from '$lib/utils/services/auth/session';

/**
 * POST /api/seats
 *
 * Provisions a pending seat owned by the calling user for a named participant
 * email. The participant later accepts via /accept-invite/[token].
 *
 * Auth: caller must be logged in and have purchaser_type in ('parent', 'counselor', 'advisor').
 * Adults do not call this endpoint; their seat is provisioned by the Polar
 * webhook at subscription.created (or in dev, by signup flow directly).
 *
 * Body:
 *   participantEmail: string (required)
 *   participantName: string (optional)
 *   planName: 'BASIC' | 'EARLY_ADOPTER' | 'ENTERPRISE' (optional, defaults to BASIC for parents and EARLY_ADOPTER otherwise)
 *
 * Returns:
 *   { seat: { id, inviteToken, inviteUrl, participantEmail, status, inviteExpiresAt } }
 *
 * Note on email send: this MVP does NOT send an email. The invite URL is
 * returned in the response so the parent or counselor UI can copy or share it.
 * Email sending is a follow-up that wires into packages/email's existing
 * invite templates (student-org-invite.ts pattern).
 */
export const POST: RequestHandler = async ({ request, cookies, url }) => {
  const session = await getSessionData(cookies);
  if (!session?.user?.id) {
    error(401, 'Sign in required');
  }

  const callerId = session.user.id;
  const buyer = await db
    .select({
      id: user.id,
      purchaserType: user.purchaserType
    })
    .from(user)
    .where(eq(user.id, callerId))
    .limit(1)
    .then((rows) => rows[0]);

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

  const inviteToken = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
  const inviteExpiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

  const inserted = await db
    .insert(seat)
    .values({
      buyerUserId: buyer.id,
      participantEmail,
      participantName,
      status: 'pending',
      inviteToken,
      inviteExpiresAt,
      planName
    })
    .returning({
      id: seat.id,
      inviteToken: seat.inviteToken,
      participantEmail: seat.participantEmail,
      status: seat.status,
      inviteExpiresAt: seat.inviteExpiresAt
    });

  const createdSeat = inserted[0];
  const inviteUrl = `${url.origin}/accept-invite/${createdSeat.inviteToken}`;

  console.log('[seat] created seat', { id: createdSeat.id, participantEmail, buyerId: buyer.id, inviteUrl });

  return json({
    seat: {
      ...createdSeat,
      inviteUrl
    }
  });
};
