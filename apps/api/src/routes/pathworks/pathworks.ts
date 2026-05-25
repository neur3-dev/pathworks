import { Hono } from '@api/utils/hono';
import { authMiddleware } from '@api/middlewares/auth';
import { db, sql } from '@cio/db/drizzle';
import { handleError } from '@api/utils/errors';
import { resolveParticipantOrgId, seedStarterLearningPathsForOrg } from '@api/services/pathworks';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const ZLearningPathsQuery = z.object({
  orgId: z.string().uuid().optional()
});

const ZParticipantProfile = z.object({
  fullname: z.string().min(1).max(120).optional(),
  ipeVocationalGoal: z.string().max(500).optional().nullable(),
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

export const pathworksRouter = new Hono()
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
          pref_extended_time,
          pref_no_autoplay,
          pref_content_warnings,
          pref_microlearning,
          ipe_vocational_goal,
          updated_at
        )
        VALUES (
          ${user.id},
          ${data.prefExtendedTime},
          ${data.prefNoAutoplay},
          ${data.prefContentWarnings},
          ${data.prefMicrolearning},
          ${data.ipeVocationalGoal ?? null},
          now()
        )
        ON CONFLICT (user_id) DO UPDATE SET
          pref_extended_time = excluded.pref_extended_time,
          pref_no_autoplay = excluded.pref_no_autoplay,
          pref_content_warnings = excluded.pref_content_warnings,
          pref_microlearning = excluded.pref_microlearning,
          ipe_vocational_goal = excluded.ipe_vocational_goal,
          updated_at = now()
        RETURNING *
      `)) as unknown as Array<Record<string, unknown>>;

      return c.json({ success: true, data: rows[0] ?? null }, 200);
    } catch (error) {
      return handleError(c, error, 'Failed to save participant profile');
    }
  })
  .post('/participant-progress', authMiddleware, zValidator('json', ZParticipantProgress), async (c) => {
    try {
      const user = c.get('user')!;
      const data = c.req.valid('json');

      const rows = (await db.execute(sql`
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
      `)) as unknown as Array<Record<string, unknown>>;

      return c.json({ success: true, data: rows[0] ?? null }, 200);
    } catch (error) {
      return handleError(c, error, 'Failed to save participant progress');
    }
  });
