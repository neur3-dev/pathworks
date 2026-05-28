import * as schema from '@db/schema';
import { db } from '@db/drizzle';
import { and, eq } from 'drizzle-orm';

const INVITE_EXPIRY_DAYS = 14;

function newInviteToken(): string {
  // 64 hex chars: two UUIDs concatenated, dashes stripped
  return (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, '');
}

function expiresAtFromNow(days: number = INVITE_EXPIRY_DAYS): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

export type CreateSeatInput = {
  buyerUserId: string;
  participantEmail: string;
  participantName?: string | null;
  planName?: string | null;
  polarSubscriptionId?: string | null;
  polarProductId?: string | null;
};

export async function createPendingSeat(input: CreateSeatInput) {
  const inviteToken = newInviteToken();
  const inviteExpiresAt = expiresAtFromNow();

  const [row] = await db
    .insert(schema.seat)
    .values({
      buyerUserId: input.buyerUserId,
      participantEmail: input.participantEmail,
      participantName: input.participantName ?? null,
      status: 'pending',
      inviteToken,
      inviteExpiresAt,
      planName: input.planName ?? null,
      polarSubscriptionId: input.polarSubscriptionId ?? null,
      polarProductId: input.polarProductId ?? null
    })
    .returning({
      id: schema.seat.id,
      inviteToken: schema.seat.inviteToken,
      participantEmail: schema.seat.participantEmail,
      participantName: schema.seat.participantName,
      status: schema.seat.status,
      inviteExpiresAt: schema.seat.inviteExpiresAt,
      planName: schema.seat.planName
    });

  return row;
}

export type SeatLookup = {
  id: string;
  buyerUserId: string;
  participantEmail: string;
  participantName: string | null;
  status: 'pending' | 'active' | 'cancelled' | 'expired';
  inviteExpiresAt: string;
  planName: string | null;
};

export async function getSeatByToken(token: string): Promise<SeatLookup | null> {
  const [row] = await db
    .select({
      id: schema.seat.id,
      buyerUserId: schema.seat.buyerUserId,
      participantEmail: schema.seat.participantEmail,
      participantName: schema.seat.participantName,
      status: schema.seat.status,
      inviteExpiresAt: schema.seat.inviteExpiresAt,
      planName: schema.seat.planName
    })
    .from(schema.seat)
    .where(eq(schema.seat.inviteToken, token))
    .limit(1);

  return row ?? null;
}

/**
 * Mark a seat active and attach the participant_user_id. Idempotent on
 * status: only flips a pending seat. Returns the updated row count.
 */
export async function activateSeat(seatId: string, participantUserId: string): Promise<number> {
  const updated = await db
    .update(schema.seat)
    .set({
      status: 'active',
      participantUserId,
      acceptedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    .where(and(eq(schema.seat.id, seatId), eq(schema.seat.status, 'pending')))
    .returning({ id: schema.seat.id });

  return updated.length;
}

export type BuyerLookup = {
  id: string;
  email: string;
  purchaserType: 'parent' | 'adult' | 'counselor' | 'advisor' | 'participant' | null;
};

export async function getBuyerById(id: string): Promise<BuyerLookup | null> {
  const [row] = await db
    .select({
      id: schema.user.id,
      email: schema.user.email,
      purchaserType: schema.user.purchaserType
    })
    .from(schema.user)
    .where(eq(schema.user.id, id))
    .limit(1);

  return row ?? null;
}
