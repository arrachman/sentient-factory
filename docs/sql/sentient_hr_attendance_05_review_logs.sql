BEGIN;

CREATE TABLE IF NOT EXISTS public.hr_attendance_review_logs (
  id bigserial PRIMARY KEY,
  event_id bigint NOT NULL,
  previous_status text,
  next_status text NOT NULL,
  note text,
  actor_user_id integer,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'hr_attendance_review_logs_next_status_chk'
  ) THEN
    ALTER TABLE public.hr_attendance_review_logs
      ADD CONSTRAINT hr_attendance_review_logs_next_status_chk
      CHECK (next_status IN ('pending', 'approved', 'rejected', 'needs_clarification'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'hr_attendance_review_logs_event_fk'
  ) THEN
    ALTER TABLE public.hr_attendance_review_logs
      ADD CONSTRAINT hr_attendance_review_logs_event_fk
      FOREIGN KEY (event_id) REFERENCES public.hr_attendance_events(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'hr_attendance_review_logs_actor_fk'
  ) THEN
    ALTER TABLE public.hr_attendance_review_logs
      ADD CONSTRAINT hr_attendance_review_logs_actor_fk
      FOREIGN KEY (actor_user_id) REFERENCES public.m0_users(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS hr_attendance_review_logs_event_created_idx
  ON public.hr_attendance_review_logs (event_id, created_at DESC);

COMMIT;
