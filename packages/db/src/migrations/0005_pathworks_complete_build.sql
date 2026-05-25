ALTER TABLE "public"."lesson" ADD COLUMN IF NOT EXISTS "content_warning" text;
--> statement-breakpoint
DO $$
DECLARE
  org_record record;
  path_id uuid;
  course_id uuid;
  course_titles text[];
  course_title text;
  path_position integer;
BEGIN
  FOR org_record IN SELECT "id" FROM "public"."organization" LOOP
    FOR path_id, course_titles IN
      SELECT inserted_path.id, inserted_path.course_titles
      FROM (
        VALUES
          ('Work Readiness Foundations', 'Build everyday workplace habits, communication, reliability, and conflict navigation skills.', 'workplace_readiness'::"public"."PRE_ETS_DOMAIN", 6.0::numeric, ARRAY[
            'Professional Communication',
            'Workplace Norms and Expectations',
            'Time Management and Reliability',
            'Conflict Navigation'
          ]::text[]),
          ('Digital Literacy for Work', 'Practice the digital basics used in modern job searches and daily work.', 'workplace_readiness'::"public"."PRE_ETS_DOMAIN", 5.5::numeric, ARRAY[
            'Computer Basics and Internet Safety',
            'Email for Work',
            'Online Job Applications',
            'Microsoft Office Basics'
          ]::text[]),
          ('Job Search Skills', 'Clarify strengths, prepare application materials, and build confidence for interviews.', 'job_exploration'::"public"."PRE_ETS_DOMAIN", 5.0::numeric, ARRAY[
            'Knowing Your Strengths',
            'Resume Basics',
            'Interview Preparation',
            'LinkedIn and Online Presence'
          ]::text[]),
          ('Self-Advocacy and Rights', 'Learn how to understand rights, request accommodations, and speak up at work.', 'self_advocacy'::"public"."PRE_ETS_DOMAIN", 5.0::numeric, ARRAY[
            'Understanding Your Disability Rights (ADA)',
            'How and When to Disclose',
            'Requesting Accommodations',
            'Navigating Workplace Situations'
          ]::text[])
      ) AS seed(title, description, pre_ets_domain, estimated_hours, course_titles)
      CROSS JOIN LATERAL (
        INSERT INTO "public"."learning_paths" ("org_id", "title", "description", "pre_ets_domain", "estimated_hours")
        SELECT org_record.id, seed.title, seed.description, seed.pre_ets_domain, seed.estimated_hours
        WHERE NOT EXISTS (
          SELECT 1 FROM "public"."learning_paths"
          WHERE "org_id" = org_record.id AND "title" = seed.title
        )
        RETURNING id, seed.course_titles
      ) AS inserted_path
    LOOP
      path_position := 1;
      FOREACH course_title IN ARRAY course_titles LOOP
        INSERT INTO "public"."course" ("title", "description", "overview", "is_template", "is_published", "status", "type", "metadata")
        VALUES (
          course_title,
          'PathWorks starter module for vocational readiness.',
          'Preview this module, move at your own pace, and come back anytime.',
          false,
          true,
          'ACTIVE',
          'SELF_PACED',
          '{"goals":"Work readiness practice","description":"PathWorks starter module","requirements":"","allowNewStudent":true}'::jsonb
        )
        RETURNING id INTO course_id;

        INSERT INTO "public"."learning_path_courses" ("path_id", "course_id", "position")
        VALUES (path_id, course_id, path_position)
        ON CONFLICT DO NOTHING;

        path_position := path_position + 1;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;
