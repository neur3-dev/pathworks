import { Hono } from '@api/utils/hono';
import { authMiddleware } from '@api/middlewares/auth';
import { db, sql } from '@cio/db/drizzle';
import {
  counselorCanAccessParticipant,
  createCounselorNote,
  listCounselorCompletedProgressRows,
  listCounselorNotes
} from '@cio/db/queries/pathworks';
import { handleError } from '@api/utils/errors';
import { env } from '@api/config/env';
import { enqueueRawEmail } from '@api/services/jobs';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { resolveParticipantOrgId, seedStarterLearningPathsForOrg } from '@api/services/pathworks';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const ZLearningPathsQuery = z.object({
  orgId: z.string().uuid().optional()
});

const ZParticipantProfile = z.object({
  fullname: z.string().min(1).max(120).optional(),
  disabilityCategory: z
    .enum([
      'physical',
      'sensory_visual',
      'sensory_hearing',
      'cognitive',
      'psychiatric',
      'tbi',
      'substance_use',
      'other'
    ])
    .optional()
    .nullable(),
  ipeVocationalGoal: z.string().max(500).optional().nullable(),
  counselorName: z.string().max(120).optional().nullable(),
  counselorEmail: z.string().email().max(255).optional().nullable(),
  prefExtendedTime: z.boolean().default(true),
  prefNoAutoplay: z.boolean().default(true),
  prefContentWarnings: z.boolean().default(true),
  prefMicrolearning: z.boolean().default(true)
});

const ZParticipantProgress = z.object({
  courseId: z.string().uuid(),
  lessonId: z.string().uuid().optional().nullable(),
  status: z.enum(['not_started', 'in_progress', 'completed']).default('in_progress'),
  lastPosition: z.number().int().min(0).default(0),
  score: z.number().min(0).max(100).optional().nullable(),
  attempts: z.number().int().min(0).default(0)
});

const ZParticipantProgressQuery = z.object({
  courseId: z.string().uuid(),
  lessonId: z.string().uuid().optional()
});

const ZCounselorLogin = z.object({
  email: z.string().email().max(255)
});

const ZCounselorToken = z.object({
  token: z.string().min(10).max(2048)
});

const ZCounselorParticipantQuery = ZCounselorToken.extend({
  participantId: z.string().uuid()
});

const ZCounselorNote = ZCounselorParticipantQuery.extend({
  note: z.string().trim().min(1).max(2000)
});

function getCounselorSecret(): Uint8Array {
  const secret = process.env.BETTER_AUTH_SECRET?.trim() || env.PRIVATE_SERVER_KEY?.trim();

  if (!secret) {
    throw new Error('BETTER_AUTH_SECRET or PRIVATE_SERVER_KEY is required for counselor links');
  }

  return new TextEncoder().encode(secret);
}

function getDashboardOrigin(): string {
  return (
    env.DASHBOARD_ORIGIN?.trim() || env.PUBLIC_SERVER_URL?.trim()?.replace(/api./, 'app.') || 'http://localhost:3000'
  );
}

function encodeTokenPart(value: unknown): string {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function signTokenPart(value: string): string {
  return createHmac('sha256', getCounselorSecret()).update(value).digest('base64url');
}

async function signCounselorToken(email: string): Promise<string> {
  const payload = encodeTokenPart({
    email,
    type: 'pathworks-counselor',
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
  });
  return `${payload}.${signTokenPart(payload)}`;
}

function formatCsvValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function buildCounselorProgressCsv(
  rows: Array<{
    courseTitle: string | null;
    lessonTitle: string | null;
    status: string | null;
    score: string | null;
    completedAt: string | null;
    updatedAt: string | null;
  }>
): string {
  const header = ['Course', 'Lesson', 'Status', 'Score', 'Completed at', 'Updated at'];
  const lines = rows.map((row) =>
    [row.courseTitle, row.lessonTitle, row.status, row.score, row.completedAt, row.updatedAt]
      .map(formatCsvValue)
      .join(',')
  );

  return [header.join(','), ...lines].join('\n') + '\n';
}

async function verifyCounselorToken(token: string): Promise<string | null> {
  try {
    const [payloadPart, signature] = token.split('.');
    if (!payloadPart || !signature) return null;

    const expected = signTokenPart(payloadPart);
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

    const payload = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8')) as {
      email?: unknown;
      type?: unknown;
      exp?: unknown;
    };

    if (payload.type !== 'pathworks-counselor' || typeof payload.email !== 'string') return null;
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload.email.toLowerCase().trim();
  } catch {
    return null;
  }
}

export const pathworksRouter = new Hono()
  .post('/counselor-login', zValidator('json', ZCounselorLogin), async (c) => {
    try {
      const { email } = c.req.valid('json');
      const normalizedEmail = email.toLowerCase().trim();

      const participants = (await db.execute(sql`
        SELECT COUNT(*)::int AS count
        FROM vr_participants
        WHERE lower(counselor_email) = ${normalizedEmail}
      `)) as unknown as Array<{ count: number }>;

      const token = await signCounselorToken(normalizedEmail);
      const url = new URL('/counselor', getDashboardOrigin());
      url.searchParams.set('token', token);

      if ((participants[0]?.count ?? 0) > 0) {
        await enqueueRawEmail({
          to: normalizedEmail,
          subject: 'Your PathWorks counselor link',
          content: `Open your read-only PathWorks counselor dashboard: ${url.toString()}`,
          idempotencyKey: `pathworks-counselor-login:${normalizedEmail}:${Date.now()}`
        });
      }

      return c.json({ success: true, data: { sent: true, link: url.toString() } }, 200);
    } catch (error) {
      return handleError(c, error, 'Failed to send counselor login link');
    }
  })
  .get('/counselor-progress', zValidator('query', ZCounselorToken), async (c) => {
    try {
      const { token } = c.req.valid('query');
      const counselorEmail = await verifyCounselorToken(token);

      if (!counselorEmail) {
        return c.json({ success: false, error: 'Invalid or expired counselor link' }, 401);
      }

      const rows = (await db.execute(sql`
        WITH participant_courses AS (
          SELECT
            vp.user_id,
            p.fullname,
            p.email,
            c.id AS course_id,
            c.title AS course_title,
            COUNT(l.id)::int AS lesson_count,
            COUNT(pp.id) FILTER (WHERE pp.status = 'completed')::int AS completed_count,
            MAX(pp.updated_at) AS last_activity
          FROM vr_participants vp
          JOIN profile p ON p.id = vp.user_id
          LEFT JOIN participant_progress pp ON pp.user_id = vp.user_id
          LEFT JOIN course c ON c.id = pp.course_id
          LEFT JOIN lesson l ON l.course_id = c.id
          WHERE lower(vp.counselor_email) = ${counselorEmail}
          GROUP BY vp.user_id, p.fullname, p.email, c.id, c.title
        )
        SELECT
          user_id AS "participantId",
          fullname,
          email,
          course_id AS "courseId",
          course_title AS "currentModule",
          CASE WHEN lesson_count > 0 THEN ROUND((completed_count::numeric / lesson_count::numeric) * 100)::int ELSE 0 END AS "percentComplete",
          last_activity AS "lastActivity",
          ARRAY_REMOVE(
            ARRAY[
              CASE WHEN last_activity IS NULL OR last_activity < now() - interval '14 days' THEN 'No activity in last 14 days' END,
              CASE
                WHEN MAX(last_activity) FILTER (WHERE last_activity IS NOT NULL) OVER (PARTITION BY user_id) < now() - interval '7 days'
                  AND completed_count < lesson_count
                THEN 'Last lesson stuck more than 7 days'
              END
            ],
            NULL
          ) AS "attentionReasons",
          (last_activity IS NULL OR last_activity < now() - interval '14 days' OR (last_activity < now() - interval '7 days' AND completed_count < lesson_count)) AS "needsAttention"
        FROM participant_courses
        ORDER BY last_activity DESC NULLS LAST, fullname ASC
      `)) as unknown as Array<Record<string, unknown>>;

      const needsAttentionCount = new Set(
        rows.filter((row) => row.needsAttention).map((row) => row.participantId as string)
      ).size;

      return c.json(
        { success: true, data: { counselorEmail, summary: { needsAttentionCount }, participants: rows } },
        200
      );
    } catch (error) {
      return handleError(c, error, 'Failed to load counselor progress');
    }
  })
  .get('/counselor-participant', zValidator('query', ZCounselorParticipantQuery), async (c) => {
    try {
      const { token, participantId } = c.req.valid('query');
      const counselorEmail = await verifyCounselorToken(token);

      if (!counselorEmail) {
        return c.json({ success: false, error: 'Invalid or expired counselor link' }, 401);
      }

      const participants = (await db.execute(sql`
        SELECT
          vp.user_id AS "participantId",
          p.fullname,
          p.email,
          vp.disability_category AS "disabilityCategory",
          vp.pref_extended_time AS "prefExtendedTime",
          vp.pref_no_autoplay AS "prefNoAutoplay",
          vp.pref_content_warnings AS "prefContentWarnings",
          vp.pref_microlearning AS "prefMicrolearning",
          vp.ipe_vocational_goal AS "ipeVocationalGoal",
          vp.counselor_name AS "counselorName",
          vp.counselor_email AS "counselorEmail",
          vp.updated_at AS "updatedAt"
        FROM vr_participants vp
        JOIN profile p ON p.id = vp.user_id
        WHERE vp.user_id = ${participantId}
          AND lower(vp.counselor_email) = ${counselorEmail}
        LIMIT 1
      `)) as unknown as Array<Record<string, unknown>>;

      if (!participants[0]) {
        return c.json({ success: false, error: 'Participant not found for this counselor link' }, 404);
      }

      const courses = (await db.execute(sql`
        SELECT
          c.id AS "courseId",
          c.title AS "courseTitle",
          COUNT(l.id)::int AS "lessonCount",
          COUNT(pp.id) FILTER (WHERE pp.status = 'completed')::int AS "completedCount",
          MAX(pp.updated_at) AS "lastActivity",
          COALESCE(
            json_agg(
              json_build_object(
                'lessonId', l.id,
                'title', l.title,
                'status', pp.status,
                'lastPosition', pp.last_position,
                'updatedAt', pp.updated_at
              )
              ORDER BY l."order" ASC NULLS LAST, l.created_at ASC
            ) FILTER (WHERE l.id IS NOT NULL),
            '[]'::json
          ) AS lessons
        FROM participant_progress pp
        JOIN course c ON c.id = pp.course_id
        LEFT JOIN lesson l ON l.course_id = c.id
        WHERE pp.user_id = ${participantId}
        GROUP BY c.id, c.title
        ORDER BY MAX(pp.updated_at) DESC NULLS LAST, c.title ASC
      `)) as unknown as Array<Record<string, unknown>>;

      const notes = await listCounselorNotes({ counselorEmail, participantId });

      return c.json(
        {
          success: true,
          data: {
            counselorEmail,
            participant: participants[0],
            courses,
            notes
          }
        },
        200
      );
    } catch (error) {
      return handleError(c, error, 'Failed to load counselor participant detail');
    }
  })
  .post('/counselor-note', zValidator('json', ZCounselorNote), async (c) => {
    try {
      const { token, participantId, note } = c.req.valid('json');
      const counselorEmail = await verifyCounselorToken(token);

      if (!counselorEmail) {
        return c.json({ success: false, error: 'Invalid or expired counselor link' }, 401);
      }

      const canAccess = await counselorCanAccessParticipant(counselorEmail, participantId);
      if (!canAccess) {
        return c.json({ success: false, error: 'Participant not found for this counselor link' }, 404);
      }

      const created = await createCounselorNote({ counselorEmail, participantId, note });
      return c.json({ success: true, data: created }, 201);
    } catch (error) {
      return handleError(c, error, 'Failed to save counselor note');
    }
  })
  .get('/counselor-progress-export', zValidator('query', ZCounselorParticipantQuery), async (c) => {
    try {
      const { token, participantId } = c.req.valid('query');
      const counselorEmail = await verifyCounselorToken(token);

      if (!counselorEmail) {
        return c.json({ success: false, error: 'Invalid or expired counselor link' }, 401);
      }

      const rows = await listCounselorCompletedProgressRows({ counselorEmail, participantId });
      const csv = buildCounselorProgressCsv(rows);

      c.header('Content-Type', 'text/csv; charset=utf-8');
      c.header('Content-Disposition', `attachment; filename="pathworks-participant-${participantId}-progress.csv"`);
      return c.body(csv, 200);
    } catch (error) {
      return handleError(c, error, 'Failed to export counselor participant progress');
    }
  })
  .get('/participant-profile', authMiddleware, async (c) => {
    try {
      const user = c.get('user')!;

      const rows = (await db.execute(sql`
        SELECT
          id,
          user_id AS "userId",
          disability_category AS "disabilityCategory",
          pref_extended_time AS "prefExtendedTime",
          pref_no_autoplay AS "prefNoAutoplay",
          pref_content_warnings AS "prefContentWarnings",
          pref_microlearning AS "prefMicrolearning",
          ipe_vocational_goal AS "ipeVocationalGoal",
          counselor_name AS "counselorName",
          counselor_email AS "counselorEmail",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM vr_participants
        WHERE user_id = ${user.id}
        LIMIT 1
      `)) as unknown as Array<Record<string, unknown>>;

      return c.json(
        {
          success: true,
          data: rows[0] ?? {
            userId: user.id,
            prefExtendedTime: true,
            prefNoAutoplay: true,
            prefContentWarnings: true,
            prefMicrolearning: true
          }
        },
        200
      );
    } catch (error) {
      return handleError(c, error, 'Failed to load participant profile');
    }
  })
  .get('/learning-paths', authMiddleware, zValidator('query', ZLearningPathsQuery), async (c) => {
    try {
      const user = c.get('user')!;
      const { orgId: requestedOrgId } = c.req.valid('query');
      const orgId = await resolveParticipantOrgId(user.id, requestedOrgId);

      if (!orgId) {
        return c.json({ success: true, data: [] }, 200);
      }

      await seedStarterLearningPathsForOrg(orgId);

      const rows = (await db.execute(sql`
        SELECT
          lp.id,
          lp.title,
          lp.description,
          lp.pre_ets_domain AS "preEtsDomain",
          lp.estimated_hours AS "estimatedHours",
          COALESCE(
            json_agg(
              json_build_object(
                'id', c.id,
                'title', c.title,
                'position', lpc.position,
                'isComplete', COALESCE(ccr.status = 'completed', false)
              )
              ORDER BY lpc.position
            ) FILTER (WHERE c.id IS NOT NULL),
            '[]'::json
          ) AS courses
        FROM learning_paths lp
        LEFT JOIN learning_path_courses lpc ON lpc.path_id = lp.id
        LEFT JOIN course c ON c.id = lpc.course_id
        LEFT JOIN course_completion_record ccr ON ccr.course_id = c.id AND ccr.profile_id = ${user.id}
        WHERE lp.org_id = ${orgId}
        GROUP BY lp.id
        ORDER BY lp.created_at ASC, lp.title ASC
      `)) as unknown as Array<{
        id: string;
        title: string;
        description: string | null;
        preEtsDomain: string | null;
        estimatedHours: string | null;
        courses: Array<{ id: string; title: string; position: number; isComplete: boolean }>;
      }>;

      return c.json({ success: true, data: rows }, 200);
    } catch (error) {
      return handleError(c, error, 'Failed to load learning paths');
    }
  })
  .post('/participant-profile', authMiddleware, zValidator('json', ZParticipantProfile), async (c) => {
    try {
      const user = c.get('user')!;
      const data = c.req.valid('json');

      if (data.fullname) {
        await db.execute(sql`
          UPDATE profile
          SET fullname = ${data.fullname}, updated_at = now()
          WHERE id = ${user.id}
        `);
      }

      const rows = (await db.execute(sql`
        INSERT INTO vr_participants (
          user_id,
          disability_category,
          pref_extended_time,
          pref_no_autoplay,
          pref_content_warnings,
          pref_microlearning,
          ipe_vocational_goal,
          counselor_name,
          counselor_email,
          updated_at
        )
        VALUES (
          ${user.id},
          ${data.disabilityCategory ?? null}::"VR_DISABILITY_CATEGORY",
          ${data.prefExtendedTime},
          ${data.prefNoAutoplay},
          ${data.prefContentWarnings},
          ${data.prefMicrolearning},
          ${data.ipeVocationalGoal ?? null},
          ${data.counselorName ?? null},
          ${data.counselorEmail ?? null},
          now()
        )
        ON CONFLICT (user_id) DO UPDATE SET
          disability_category = excluded.disability_category,
          pref_extended_time = excluded.pref_extended_time,
          pref_no_autoplay = excluded.pref_no_autoplay,
          pref_content_warnings = excluded.pref_content_warnings,
          pref_microlearning = excluded.pref_microlearning,
          ipe_vocational_goal = excluded.ipe_vocational_goal,
          counselor_name = excluded.counselor_name,
          counselor_email = excluded.counselor_email,
          updated_at = now()
        RETURNING *
      `)) as unknown as Array<Record<string, unknown>>;

      return c.json({ success: true, data: rows[0] ?? null }, 200);
    } catch (error) {
      return handleError(c, error, 'Failed to save participant profile');
    }
  })
  .get('/participant-progress', authMiddleware, zValidator('query', ZParticipantProgressQuery), async (c) => {
    try {
      const user = c.get('user')!;
      const data = c.req.valid('query');

      const rows = (await db.execute(sql`
        SELECT
          id,
          user_id AS "userId",
          course_id AS "courseId",
          lesson_id AS "lessonId",
          status,
          last_position AS "lastPosition",
          score,
          attempts,
          completed_at AS "completedAt",
          updated_at AS "updatedAt"
        FROM participant_progress
        WHERE user_id = ${user.id}
          AND course_id = ${data.courseId}
          AND lesson_id IS NOT DISTINCT FROM ${data.lessonId ?? null}
        ORDER BY updated_at DESC
        LIMIT 1
      `)) as unknown as Array<Record<string, unknown>>;

      return c.json({ success: true, data: rows[0] ?? null }, 200);
    } catch (error) {
      return handleError(c, error, 'Failed to load participant progress');
    }
  })
  .post('/participant-progress', authMiddleware, zValidator('json', ZParticipantProgress), async (c) => {
    try {
      const user = c.get('user')!;
      const data = c.req.valid('json');

      const existing = (await db.execute(sql`
        SELECT id
        FROM participant_progress
        WHERE user_id = ${user.id}
          AND course_id = ${data.courseId}
          AND lesson_id IS NOT DISTINCT FROM ${data.lessonId ?? null}
        ORDER BY updated_at DESC
        LIMIT 1
      `)) as unknown as Array<{ id: string }>;

      const rows = existing[0]?.id
        ? ((await db.execute(sql`
            UPDATE participant_progress
            SET
              status = ${data.status}::"PARTICIPANT_PROGRESS_STATUS",
              last_position = ${data.lastPosition},
              score = ${data.score ?? null},
              attempts = ${data.attempts},
              completed_at = CASE WHEN ${data.status} = 'completed' THEN now() ELSE completed_at END,
              updated_at = now()
            WHERE id = ${existing[0].id}
            RETURNING *
          `)) as unknown as Array<Record<string, unknown>>)
        : ((await db.execute(sql`
            INSERT INTO participant_progress (
              user_id,
              course_id,
              lesson_id,
              status,
              last_position,
              score,
              attempts,
              completed_at,
              updated_at
            )
            VALUES (
              ${user.id},
              ${data.courseId},
              ${data.lessonId ?? null},
              ${data.status}::"PARTICIPANT_PROGRESS_STATUS",
              ${data.lastPosition},
              ${data.score ?? null},
              ${data.attempts},
              CASE WHEN ${data.status} = 'completed' THEN now() ELSE null END,
              now()
            )
            RETURNING *
          `)) as unknown as Array<Record<string, unknown>>);

      return c.json({ success: true, data: rows[0] ?? null }, 200);
    } catch (error) {
      return handleError(c, error, 'Failed to save participant progress');
    }
  });
