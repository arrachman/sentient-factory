BEGIN;

ALTER TABLE public.hr_attendance_events
  ADD COLUMN IF NOT EXISTS review_status text,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamp without time zone,
  ADD COLUMN IF NOT EXISTS reviewed_by integer,
  ADD COLUMN IF NOT EXISTS review_note text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'hr_attendance_events_review_status_chk'
  ) THEN
    ALTER TABLE public.hr_attendance_events
      ADD CONSTRAINT hr_attendance_events_review_status_chk
      CHECK (
        review_status IS NULL
        OR review_status IN ('pending', 'approved', 'rejected', 'needs_clarification')
      );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS hr_attendance_events_review_status_idx
  ON public.hr_attendance_events (review_status);

CREATE INDEX IF NOT EXISTS hr_attendance_events_result_review_status_idx
  ON public.hr_attendance_events (result, review_status);

UPDATE public.hr_attendance_events
SET
  review_status = 'pending',
  updated_at = now()
WHERE deleted_at IS NULL
  AND result IN ('warning', 'manual_review', 'rejected')
  AND review_status IS NULL;

COMMIT;
