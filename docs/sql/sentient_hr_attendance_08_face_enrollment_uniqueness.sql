BEGIN;

CREATE UNIQUE INDEX IF NOT EXISTS hr_face_enrollments_one_active_user_idx
  ON public.hr_face_enrollments (user_id)
  WHERE deleted_at IS NULL AND is_active = true;

COMMIT;
