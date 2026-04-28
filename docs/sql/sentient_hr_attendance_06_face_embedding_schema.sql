BEGIN;

ALTER TABLE public.hr_face_enrollments
  ADD COLUMN IF NOT EXISTS embedding_json jsonb,
  ADD COLUMN IF NOT EXISTS detector_metadata jsonb;

COMMIT;
