CREATE TABLE IF NOT EXISTS "pathworks_counselor_notes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "participant_user_id" uuid NOT NULL,
  "counselor_email" text NOT NULL,
  "note" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "pathworks_counselor_notes"
  ADD CONSTRAINT "pathworks_counselor_notes_participant_user_id_user_id_fk"
  FOREIGN KEY ("participant_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;

CREATE INDEX IF NOT EXISTS "idx_pathworks_counselor_notes_participant"
  ON "pathworks_counselor_notes" USING btree ("participant_user_id");

CREATE INDEX IF NOT EXISTS "idx_pathworks_counselor_notes_counselor"
  ON "pathworks_counselor_notes" USING btree ("counselor_email");

CREATE INDEX IF NOT EXISTS "idx_pathworks_counselor_notes_created_at"
  ON "pathworks_counselor_notes" USING btree ("created_at");
