DO $$ BEGIN
 CREATE TYPE "public"."VR_DISABILITY_CATEGORY" AS ENUM('physical', 'sensory_visual', 'sensory_hearing', 'cognitive', 'psychiatric', 'tbi', 'substance_use', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."PRE_ETS_DOMAIN" AS ENUM('job_exploration', 'work_based_learning', 'postsecondary_counseling', 'workplace_readiness', 'self_advocacy', 'mixed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."PARTICIPANT_PROGRESS_STATUS" AS ENUM('not_started', 'in_progress', 'completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "public"."vr_participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"disability_category" "public"."VR_DISABILITY_CATEGORY",
	"pref_extended_time" boolean DEFAULT true NOT NULL,
	"pref_no_autoplay" boolean DEFAULT true NOT NULL,
	"pref_content_warnings" boolean DEFAULT true NOT NULL,
	"pref_microlearning" boolean DEFAULT true NOT NULL,
	"ipe_vocational_goal" text,
	"counselor_name" text,
	"counselor_email" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vr_participants_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "vr_participants_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "public"."learning_paths" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"pre_ets_domain" "public"."PRE_ETS_DOMAIN",
	"estimated_hours" numeric(5, 1),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "learning_paths_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "public"."learning_path_courses" (
	"path_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "learning_path_courses_pkey" PRIMARY KEY("path_id","course_id"),
	CONSTRAINT "learning_path_courses_path_position_unique" UNIQUE("path_id","position"),
	CONSTRAINT "learning_path_courses_path_id_learning_paths_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."learning_paths"("id") ON DELETE cascade ON UPDATE no action,
	CONSTRAINT "learning_path_courses_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "public"."participant_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"lesson_id" uuid,
	"status" "public"."PARTICIPANT_PROGRESS_STATUS" DEFAULT 'not_started' NOT NULL,
	"last_position" integer DEFAULT 0 NOT NULL,
	"score" numeric(5, 2),
	"attempts" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "participant_progress_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action,
	CONSTRAINT "participant_progress_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action,
	CONSTRAINT "participant_progress_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE set null ON UPDATE no action
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_learning_paths_org_id" ON "public"."learning_paths" USING btree ("org_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_learning_paths_pre_ets_domain" ON "public"."learning_paths" USING btree ("pre_ets_domain");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_learning_path_courses_course_id" ON "public"."learning_path_courses" USING btree ("course_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_participant_progress_user_id" ON "public"."participant_progress" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_participant_progress_course_id" ON "public"."participant_progress" USING btree ("course_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_participant_progress_lesson_id" ON "public"."participant_progress" USING btree ("lesson_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_participant_progress_status" ON "public"."participant_progress" USING btree ("status");
