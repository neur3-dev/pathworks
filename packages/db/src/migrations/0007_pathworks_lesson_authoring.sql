-- Preserve previously seeded PathWorks lessons as visible while keeping newly authored lessons draft-first.
UPDATE lesson
SET public = TRUE
WHERE public IS DISTINCT FROM TRUE;

ALTER TABLE lesson
ALTER COLUMN public SET DEFAULT FALSE;
