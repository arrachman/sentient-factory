BEGIN;

CREATE TABLE IF NOT EXISTS public.hr_user_worksites (
  id            serial PRIMARY KEY,
  user_id       integer NOT NULL,
  worksite_id   integer NOT NULL,
  assigned_at   timestamp without time zone NOT NULL DEFAULT now(),
  created_at    timestamp without time zone NOT NULL DEFAULT now(),
  created_by    integer,
  updated_at    timestamp without time zone,
  updated_by    integer,
  deleted_at    timestamp without time zone,
  deleted_by    integer,
  CONSTRAINT hr_user_worksites_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.hr_users(id) ON DELETE CASCADE,
  CONSTRAINT hr_user_worksites_worksite_id_fkey
    FOREIGN KEY (worksite_id) REFERENCES public.hr_worksites(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS hr_user_worksites_user_id_worksite_id_key
  ON public.hr_user_worksites (user_id, worksite_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS hr_user_worksites_user_id_idx
  ON public.hr_user_worksites (user_id);

CREATE INDEX IF NOT EXISTS hr_user_worksites_worksite_id_idx
  ON public.hr_user_worksites (worksite_id);

COMMIT;
