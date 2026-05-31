-- PathWorks workforce-readiness expansion: purchaser_type, parent_user_id,
-- counselor_user_id, agency_name, birth_year on the user table.
--
-- See Products/PathWorks/MARKETING_EXPANSION_PLAN.md section 3 for the
-- buyer-type model (parent / adult / counselor / advisor / participant).

DO $$ BEGIN
  CREATE TYPE "public"."PURCHASER_TYPE" AS ENUM ('parent', 'adult', 'counselor', 'advisor', 'participant');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "purchaser_type" "PURCHASER_TYPE";
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "parent_user_id" uuid;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "counselor_user_id" uuid;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "agency_name" text;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "birth_year" integer;

DO $$ BEGIN
  ALTER TABLE "user"
    ADD CONSTRAINT "user_parent_user_id_user_id_fk"
    FOREIGN KEY ("parent_user_id") REFERENCES "public"."user"("id")
    ON DELETE set null ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "user"
    ADD CONSTRAINT "user_counselor_user_id_user_id_fk"
    FOREIGN KEY ("counselor_user_id") REFERENCES "public"."user"("id")
    ON DELETE set null ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS "idx_user_purchaser_type" ON "user" USING btree ("purchaser_type");
CREATE INDEX IF NOT EXISTS "idx_user_parent_user_id" ON "user" USING btree ("parent_user_id");
CREATE INDEX IF NOT EXISTS "idx_user_counselor_user_id" ON "user" USING btree ("counselor_user_id");

-- Backfill existing rows: assume self-signed-up users are adults.
-- Counselors and parents who pre-date this migration will need a one-off
-- manual reclassification once they're identified.
UPDATE "user" SET "purchaser_type" = 'adult' WHERE "purchaser_type" IS NULL;
