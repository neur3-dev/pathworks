import * as schema from '@db/schema';
import { db } from '@db/drizzle';
import { and, eq } from 'drizzle-orm';
import { ROLE } from '@cio/utils/constants';

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

/**
 * Link a participant user to their parent or counselor after they accept
 * an invite. Server-side only because parent_user_id and counselor_user_id
 * are not accepted by Better-Auth's signup endpoint (input:false in the
 * auth additionalFields config) to prevent arbitrary claim of linkage.
 */
export async function linkParticipantToBuyer(
  participantUserId: string,
  buyerUserId: string,
  buyerPurchaserType: 'parent' | 'counselor' | 'advisor'
): Promise<void> {
  const updates: Partial<typeof schema.user.$inferInsert> =
    buyerPurchaserType === 'parent' ? { parentUserId: buyerUserId } : { counselorUserId: buyerUserId };

  await db.update(schema.user).set(updates).where(eq(schema.user.id, participantUserId));
}

export type BuyerLookup = {
  id: string;
  email: string;
  name: string;
  purchaserType: 'parent' | 'adult' | 'counselor' | 'advisor' | 'participant' | null;
};

export async function getBuyerById(id: string): Promise<BuyerLookup | null> {
  const [row] = await db
    .select({
      id: schema.user.id,
      email: schema.user.email,
      name: schema.user.name,
      purchaserType: schema.user.purchaserType
    })
    .from(schema.user)
    .where(eq(schema.user.id, id))
    .limit(1);

  return row ?? null;
}

/**
 * Returns the first org the buyer belongs to, used to place a newly-accepted
 * participant in the same org.
 */
export async function getBuyerOrgId(buyerUserId: string): Promise<string | null> {
  const [row] = await db
    .select({ organizationId: schema.organizationmember.organizationId })
    .from(schema.organizationmember)
    .where(eq(schema.organizationmember.profileId, buyerUserId))
    .orderBy(schema.organizationmember.roleId)
    .limit(1);

  return row?.organizationId ?? null;
}

/**
 * Add an accepted-invite participant to an org as a student. No-ops if
 * already a member so the call is safe to repeat.
 */
export async function addParticipantToOrg(
  orgId: string,
  participantUserId: string,
  participantEmail: string
): Promise<void> {
  const [existing] = await db
    .select({ id: schema.organizationmember.id })
    .from(schema.organizationmember)
    .where(
      and(
        eq(schema.organizationmember.organizationId, orgId),
        eq(schema.organizationmember.profileId, participantUserId)
      )
    )
    .limit(1);

  if (existing) return;

  await db.insert(schema.organizationmember).values({
    organizationId: orgId,
    profileId: participantUserId,
    email: participantEmail,
    roleId: ROLE.STUDENT,
    verified: true
  });
}

/**
 * Fallback org resolution for participants who were accepted before the
 * org-membership step was added. Looks up the org via the seat → buyer path.
 */
export async function getParticipantOrgIdViaSeat(participantUserId: string): Promise<string | null> {
  const [row] = await db
    .select({ organizationId: schema.organizationmember.organizationId })
    .from(schema.seat)
    .innerJoin(schema.organizationmember, eq(schema.organizationmember.profileId, schema.seat.buyerUserId))
    .where(and(eq(schema.seat.participantUserId, participantUserId), eq(schema.seat.status, 'active')))
    .orderBy(schema.organizationmember.roleId)
    .limit(1);

  return row?.organizationId ?? null;
}
