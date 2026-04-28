BEGIN;

CREATE TABLE IF NOT EXISTS public.hr_worksites (
  id              serial PRIMARY KEY,
  name            text NOT NULL,
  code            text NOT NULL UNIQUE,
  latitude        numeric(10,7) NOT NULL,
  longitude       numeric(10,7) NOT NULL,
  radius_meters   integer NOT NULL CHECK (radius_meters > 0),
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamp without time zone NOT NULL DEFAULT now(),
  created_by      integer,
  updated_at      timestamp without time zone,
  updated_by      integer,
  deleted_at      timestamp without time zone,
  deleted_by      integer
);

CREATE INDEX IF NOT EXISTS hr_worksites_is_active_idx
  ON public.hr_worksites (is_active);

CREATE TABLE IF NOT EXISTS public.hr_users (
  id                      serial PRIMARY KEY,
  user_id                 integer NOT NULL UNIQUE,
  employee_code           text,
  face_enrollment_status  text NOT NULL DEFAULT 'not_enrolled',
  face_template_version   integer NOT NULL DEFAULT 1,
  default_worksite_id     integer,
  is_active               boolean NOT NULL DEFAULT true,
  employee_role_type      text NOT NULL DEFAULT 'employee',
  created_at              timestamp without time zone NOT NULL DEFAULT now(),
  created_by              integer,
  updated_at              timestamp without time zone,
  updated_by              integer,
  deleted_at              timestamp without time zone,
  deleted_by              integer,
  CONSTRAINT hr_users_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.m0_users(id) ON DELETE CASCADE,
  CONSTRAINT hr_users_default_worksite_id_fkey
    FOREIGN KEY (default_worksite_id) REFERENCES public.hr_worksites(id) ON DELETE SET NULL,
  CONSTRAINT hr_users_face_enrollment_status_chk
    CHECK (face_enrollment_status IN ('not_enrolled', 'enrolled', 'disabled')),
  CONSTRAINT hr_users_employee_role_type_chk
    CHECK (employee_role_type IN ('employee', 'manager', 'admin'))
);

CREATE INDEX IF NOT EXISTS hr_users_default_worksite_id_idx
  ON public.hr_users (default_worksite_id);

CREATE INDEX IF NOT EXISTS hr_users_employee_role_type_idx
  ON public.hr_users (employee_role_type);

CREATE TABLE IF NOT EXISTS public.hr_face_enrollments (
  id              serial PRIMARY KEY,
  user_id         integer NOT NULL,
  template_ref    text NOT NULL,
  quality_score   numeric(5,2),
  snapshot_url    text,
  enrolled_at     timestamp without time zone NOT NULL DEFAULT now(),
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamp without time zone NOT NULL DEFAULT now(),
  created_by      integer,
  updated_at      timestamp without time zone,
  updated_by      integer,
  deleted_at      timestamp without time zone,
  deleted_by      integer,
  CONSTRAINT hr_face_enrollments_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.hr_users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS hr_face_enrollments_user_id_idx
  ON public.hr_face_enrollments (user_id);

CREATE INDEX IF NOT EXISTS hr_face_enrollments_is_active_idx
  ON public.hr_face_enrollments (is_active);

CREATE TABLE IF NOT EXISTS public.hr_attendance_sessions (
  id                        serial PRIMARY KEY,
  user_id                   integer NOT NULL,
  work_date                 date NOT NULL,
  clock_in_at               timestamp without time zone,
  clock_out_at              timestamp without time zone,
  clock_in_latitude         numeric(10,7),
  clock_in_longitude        numeric(10,7),
  clock_out_latitude        numeric(10,7),
  clock_out_longitude       numeric(10,7),
  clock_in_worksite_id      integer,
  clock_out_worksite_id     integer,
  clock_in_status           text,
  clock_out_status          text,
  clock_in_face_score       numeric(5,2),
  clock_out_face_score      numeric(5,2),
  clock_in_liveness_score   numeric(5,2),
  clock_out_liveness_score  numeric(5,2),
  total_work_minutes        integer,
  created_at                timestamp without time zone NOT NULL DEFAULT now(),
  created_by                integer,
  updated_at                timestamp without time zone,
  updated_by                integer,
  deleted_at                timestamp without time zone,
  deleted_by                integer,
  CONSTRAINT hr_attendance_sessions_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.hr_users(id) ON DELETE CASCADE,
  CONSTRAINT hr_attendance_sessions_clock_in_worksite_id_fkey
    FOREIGN KEY (clock_in_worksite_id) REFERENCES public.hr_worksites(id) ON DELETE SET NULL,
  CONSTRAINT hr_attendance_sessions_clock_out_worksite_id_fkey
    FOREIGN KEY (clock_out_worksite_id) REFERENCES public.hr_worksites(id) ON DELETE SET NULL,
  CONSTRAINT hr_attendance_sessions_clock_in_status_chk
    CHECK (clock_in_status IS NULL OR clock_in_status IN ('success', 'warning', 'rejected', 'manual_review')),
  CONSTRAINT hr_attendance_sessions_clock_out_status_chk
    CHECK (clock_out_status IS NULL OR clock_out_status IN ('success', 'warning', 'rejected', 'manual_review'))
);

CREATE INDEX IF NOT EXISTS hr_attendance_sessions_user_id_work_date_idx
  ON public.hr_attendance_sessions (user_id, work_date);

CREATE INDEX IF NOT EXISTS hr_attendance_sessions_work_date_idx
  ON public.hr_attendance_sessions (work_date);

CREATE TABLE IF NOT EXISTS public.hr_attendance_events (
  id              serial PRIMARY KEY,
  user_id         integer NOT NULL,
  session_id      integer,
  event_type      text NOT NULL,
  event_at        timestamp without time zone NOT NULL DEFAULT now(),
  result          text NOT NULL,
  reason_code     text,
  latitude        numeric(10,7),
  longitude       numeric(10,7),
  face_score      numeric(5,2),
  liveness_score  numeric(5,2),
  device_info     jsonb,
  snapshot_url    text,
  metadata_json   jsonb,
  created_at      timestamp without time zone NOT NULL DEFAULT now(),
  created_by      integer,
  updated_at      timestamp without time zone,
  updated_by      integer,
  deleted_at      timestamp without time zone,
  deleted_by      integer,
  CONSTRAINT hr_attendance_events_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.hr_users(id) ON DELETE CASCADE,
  CONSTRAINT hr_attendance_events_session_id_fkey
    FOREIGN KEY (session_id) REFERENCES public.hr_attendance_sessions(id) ON DELETE SET NULL,
  CONSTRAINT hr_attendance_events_result_chk
    CHECK (result IN ('success', 'warning', 'rejected', 'manual_review'))
);

CREATE INDEX IF NOT EXISTS hr_attendance_events_user_id_event_at_idx
  ON public.hr_attendance_events (user_id, event_at);

CREATE INDEX IF NOT EXISTS hr_attendance_events_event_type_idx
  ON public.hr_attendance_events (event_type);

CREATE INDEX IF NOT EXISTS hr_attendance_events_result_idx
  ON public.hr_attendance_events (result);

CREATE TABLE IF NOT EXISTS public.hr_settings (
  id            serial PRIMARY KEY,
  setting_key   text NOT NULL UNIQUE,
  setting_value text,
  setting_group text NOT NULL DEFAULT 'attendance',
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamp without time zone NOT NULL DEFAULT now(),
  created_by    integer,
  updated_at    timestamp without time zone,
  updated_by    integer,
  deleted_at    timestamp without time zone,
  deleted_by    integer
);

CREATE INDEX IF NOT EXISTS hr_settings_setting_group_idx
  ON public.hr_settings (setting_group);

COMMIT;
