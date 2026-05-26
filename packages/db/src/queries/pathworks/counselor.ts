import { db, sql } from '@db/drizzle';

import type { DbOrTxClient } from '@db/drizzle';

export type CounselorNote = {
  id: string;
  participantUserId: string;
  counselorEmail: string;
  note: string;
  createdAt: string;
};

export type CounselorProgressExportRow = {
  courseTitle: string | null;
  lessonTitle: string | null;
  status: string | null;
  score: string | null;
  completedAt: string | null;
  updatedAt: string | null;
};

export async function counselorCanAccessParticipant(
  counselorEmail: string,
  participantId: string,
  dbClient: DbOrTxClient = db
) {
  const rows = (await dbClient.execute(sql`
    SELECT 1
    FROM vr_participants
    WHERE user_id = ${participantId}
      AND lower(counselor_email) = ${counselorEmail}
    LIMIT 1
  `)) as unknown as Array<{ '?column?': number }>;

  return rows.length > 0;
}

export async function createCounselorNote(
  input: { counselorEmail: string; participantId: string; note: string },
  dbClient: DbOrTxClient = db
) {
  const rows = (await dbClient.execute(sql`
    INSERT INTO pathworks_counselor_notes (participant_user_id, counselor_email, note)
    VALUES (${input.participantId}, ${input.counselorEmail}, ${input.note})
    RETURNING
      id,
      participant_user_id AS "participantUserId",
      counselor_email AS "counselorEmail",
      note,
      created_at AS "createdAt"
  `)) as unknown as CounselorNote[];

  return rows[0] ?? null;
}

export async function listCounselorNotes(
  input: { counselorEmail: string; participantId: string },
  dbClient: DbOrTxClient = db
) {
  return (await dbClient.execute(sql`
    SELECT
      id,
      participant_user_id AS "participantUserId",
      counselor_email AS "counselorEmail",
      note,
      created_at AS "createdAt"
    FROM pathworks_counselor_notes
    WHERE participant_user_id = ${input.participantId}
      AND lower(counselor_email) = ${input.counselorEmail}
    ORDER BY created_at DESC
  `)) as unknown as CounselorNote[];
}

export async function listCounselorCompletedProgressRows(
  input: { counselorEmail: string; participantId: string },
  dbClient: DbOrTxClient = db
) {
  return (await dbClient.execute(sql`
    SELECT
      c.title AS "courseTitle",
      l.title AS "lessonTitle",
      pp.status,
      pp.score,
      pp.completed_at AS "completedAt",
      pp.updated_at AS "updatedAt"
    FROM participant_progress pp
    JOIN course c ON c.id = pp.course_id
    LEFT JOIN lesson l ON l.id = pp.lesson_id
    JOIN vr_participants vp ON vp.user_id = pp.user_id
    WHERE pp.user_id = ${input.participantId}
      AND lower(vp.counselor_email) = ${input.counselorEmail}
      AND pp.status = 'completed'
    ORDER BY pp.completed_at DESC NULLS LAST, pp.updated_at DESC NULLS LAST, c.title ASC, l.title ASC
  `)) as unknown as CounselorProgressExportRow[];
}
