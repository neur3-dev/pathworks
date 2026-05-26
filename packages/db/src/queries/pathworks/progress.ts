import * as schema from '@db/schema';

import { and, db, eq, isNull } from '@db/drizzle';

import type { DbOrTxClient } from '@db/drizzle';

export type ParticipantProgressStatus = 'not_started' | 'in_progress' | 'completed';

export type UpsertParticipantProgressInput = {
  profileId: string;
  courseId: string;
  lessonId?: string | null;
  status: ParticipantProgressStatus;
  lastPosition?: number;
  score?: number | null;
};

export async function upsertParticipantProgress(input: UpsertParticipantProgressInput, dbClient: DbOrTxClient = db) {
  const lessonCondition = input.lessonId
    ? eq(schema.participantProgress.lessonId, input.lessonId)
    : isNull(schema.participantProgress.lessonId);

  const [existing] = await dbClient
    .select()
    .from(schema.participantProgress)
    .where(
      and(
        eq(schema.participantProgress.userId, input.profileId),
        eq(schema.participantProgress.courseId, input.courseId),
        lessonCondition
      )
    )
    .orderBy(schema.participantProgress.updatedAt)
    .limit(1);

  const completedAt = input.status === 'completed' ? new Date().toISOString() : null;

  if (existing) {
    const [updated] = await dbClient
      .update(schema.participantProgress)
      .set({
        status: input.status,
        lastPosition: input.lastPosition ?? existing.lastPosition ?? 0,
        score: input.score == null ? existing.score : String(input.score),
        attempts: Number(existing.attempts ?? 0) + 1,
        completedAt: completedAt ?? existing.completedAt,
        updatedAt: new Date().toISOString()
      })
      .where(eq(schema.participantProgress.id, existing.id))
      .returning();

    return updated;
  }

  const [created] = await dbClient
    .insert(schema.participantProgress)
    .values({
      userId: input.profileId,
      courseId: input.courseId,
      lessonId: input.lessonId ?? null,
      status: input.status,
      lastPosition: input.lastPosition ?? 0,
      score: input.score == null ? null : String(input.score),
      attempts: 1,
      completedAt
    })
    .returning();

  return created;
}
