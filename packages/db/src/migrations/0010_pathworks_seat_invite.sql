-- PathWorks seat-and-invite data model. A seat is the unit of purchase: a
-- buyer (parent, counselor, advisor, or an adult buying for themselves) pays
-- for one or more seats, each of which is associated with a participant by
-- email. The participant accepts the seat by clicking the invite link, which
-- creates their user account and ties them to the seat.
--
-- For role=adult, the buyer and the participant are the same user; the seat
-- can be created in status='active' at signup time with participant_user_id
-- pointing at the buyer.
--
-- For role=parent, the parent signs up first, then creates a seat with their
-- child's email; the seat is status='pending' until the child accepts.
--
-- For role=counselor/advisor, the counselor signs up first, then enrolls
-- participants one at a time; each enrollment creates a pending seat. Polar
-- webhook integration creates the subscription record; the counselor UI then
-- consumes seats from that subscription as they enroll participants.

DO $$ BEGIN
  CREATE TYPE "public"."SEAT_STATUS" AS ENUM ('pending', 'active', 'cancelled', 'expired');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "seat" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "buyer_user_id" uuid NOT NULL,
  "participant_user_id" uuid,
  "participant_email" text NOT NULL,
  "participant_name" text,
  "status" "SEAT_STATUS" DEFAULT 'pending' NOT NULL,
  "invite_token" text NOT NULL,
  "invite_expires_at" timestamp with time zone NOT NULL,
  "accepted_at" timestamp with time zone,
  "polar_subscription_id" text,
  "polar_product_id" text,
  "plan_name" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

DO $$ BEGIN
  ALTER TABLE "seat"
    ADD CONSTRAINT "seat_buyer_user_id_user_id_fk"
    FOREIGN KEY ("buyer_user_id") REFERENCES "public"."user"("id")
    ON DELETE restrict ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "seat"
    ADD CONSTRAINT "seat_participant_user_id_user_id_fk"
    FOREIGN KEY ("participant_user_id") REFERENCES "public"."user"("id")
    ON DELETE set null ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "seat"
    ADD CONSTRAINT "seat_invite_token_unique" UNIQUE ("invite_token");
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS "idx_seat_buyer_user_id" ON "seat" USING btree ("buyer_user_id");
CREATE INDEX IF NOT EXISTS "idx_seat_participant_user_id" ON "seat" USING btree ("participant_user_id");
CREATE INDEX IF NOT EXISTS "idx_seat_status" ON "seat" USING btree ("status");
CREATE INDEX IF NOT EXISTS "idx_seat_polar_subscription_id" ON "seat" USING btree ("polar_subscription_id");
