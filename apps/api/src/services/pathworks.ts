import { db, sql } from '@cio/db/drizzle';

type StarterPath = {
  title: string;
  description: string;
  preEtsDomain: 'job_exploration' | 'workplace_readiness' | 'self_advocacy';
  estimatedHours: number;
  courses: string[];
};

export const STARTER_LEARNING_PATHS: StarterPath[] = [
  {
    title: 'Work Readiness Foundations',
    description: 'Build everyday workplace habits, communication, reliability, and conflict navigation skills.',
    preEtsDomain: 'workplace_readiness',
    estimatedHours: 6,
    courses: [
      'Professional Communication',
      'Workplace Norms and Expectations',
      'Time Management and Reliability',
      'Conflict Navigation'
    ]
  },
  {
    title: 'Digital Literacy for Work',
    description: 'Practice the digital basics used in modern job searches and daily work.',
    preEtsDomain: 'workplace_readiness',
    estimatedHours: 5.5,
    courses: [
      'Computer Basics and Internet Safety',
      'Email for Work',
      'Online Job Applications',
      'Microsoft Office Basics'
    ]
  },
  {
    title: 'Job Search Skills',
    description: 'Clarify strengths, prepare application materials, and build confidence for interviews.',
    preEtsDomain: 'job_exploration',
    estimatedHours: 5,
    courses: ['Knowing Your Strengths', 'Resume Basics', 'Interview Preparation', 'LinkedIn and Online Presence']
  },
  {
    title: 'Self-Advocacy and Rights',
    description: 'Learn how to understand rights, request accommodations, and speak up at work.',
    preEtsDomain: 'self_advocacy',
    estimatedHours: 5,
    courses: [
      'Understanding Your Disability Rights (ADA)',
      'How and When to Disclose',
      'Requesting Accommodations',
      'Navigating Workplace Situations'
    ]
  }
];

export async function seedStarterLearningPathsForOrg(orgId: string) {
  for (const path of STARTER_LEARNING_PATHS) {
    const inserted = (await db.execute(sql`
      INSERT INTO learning_paths (org_id, title, description, pre_ets_domain, estimated_hours)
      SELECT ${orgId}, ${path.title}, ${path.description}, ${path.preEtsDomain}::"PRE_ETS_DOMAIN", ${path.estimatedHours}
      WHERE NOT EXISTS (
        SELECT 1 FROM learning_paths WHERE org_id = ${orgId} AND title = ${path.title}
      )
      RETURNING id
    `)) as unknown as Array<{ id: string }>;

    const existing = inserted[0]
      ? inserted
      : ((await db.execute(sql`
          SELECT id FROM learning_paths WHERE org_id = ${orgId} AND title = ${path.title} LIMIT 1
        `)) as unknown as Array<{ id: string }>);

    const pathId = existing[0]?.id;
    if (!pathId) continue;

    let position = 1;
    for (const title of path.courses) {
      const course = (await db.execute(sql`
        INSERT INTO course (title, description, overview, is_template, is_published, status, type, metadata)
        SELECT
          ${title},
          'PathWorks starter module for vocational readiness.',
          'Preview this module, move at your own pace, and come back anytime.',
          false,
          true,
          'ACTIVE',
          'SELF_PACED',
          '{"goals":"Work readiness practice","description":"PathWorks starter module","requirements":"","allowNewStudent":true}'::jsonb
        WHERE NOT EXISTS (
          SELECT 1
          FROM learning_path_courses lpc
          JOIN course c ON c.id = lpc.course_id
          WHERE lpc.path_id = ${pathId} AND c.title = ${title}
        )
        RETURNING id
      `)) as unknown as Array<{ id: string }>;

      const existingCourse = course[0]
        ? course
        : ((await db.execute(sql`
            SELECT c.id
            FROM learning_path_courses lpc
            JOIN course c ON c.id = lpc.course_id
            WHERE lpc.path_id = ${pathId} AND c.title = ${title}
            LIMIT 1
          `)) as unknown as Array<{ id: string }>);

      if (existingCourse[0]?.id) {
        await db.execute(sql`
          INSERT INTO learning_path_courses (path_id, course_id, position)
          VALUES (${pathId}, ${existingCourse[0].id}, ${position})
          ON CONFLICT DO NOTHING
        `);
      }

      position += 1;
    }
  }
}

export async function resolveParticipantOrgId(userId: string, requestedOrgId?: string | null) {
  if (requestedOrgId) return requestedOrgId;

  const rows = (await db.execute(sql`
    SELECT organization_id AS "orgId"
    FROM organizationmember
    WHERE profile_id = ${userId}
    ORDER BY role_id ASC
    LIMIT 1
  `)) as unknown as Array<{ orgId: string }>;

  return rows[0]?.orgId ?? null;
}
