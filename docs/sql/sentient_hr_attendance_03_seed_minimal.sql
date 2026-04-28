BEGIN;

INSERT INTO public.hr_worksites (
  name,
  code,
  latitude,
  longitude,
  radius_meters,
  is_active,
  created_at
)
VALUES (
  'Head Office',
  'HQ',
  -6.2000000,
  106.8166000,
  100,
  true,
  now()
)
ON CONFLICT (code) DO UPDATE
  SET name = EXCLUDED.name,
      latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude,
      radius_meters = EXCLUDED.radius_meters,
      is_active = EXCLUDED.is_active,
      updated_at = now();

INSERT INTO public.hr_settings (
  setting_key,
  setting_value,
  setting_group,
  is_active,
  created_at
)
VALUES
  ('attendance.gps_required', 'true', 'attendance', true, now()),
  ('attendance.liveness_required', 'true', 'attendance', true, now()),
  ('attendance.outside_geofence_policy', 'manual_review', 'attendance', true, now()),
  ('attendance.face_detector', 'mediapipe-tensorflowjs', 'attendance', true, now()),
  ('attendance.snapshot_storage_mode', 'local_path', 'attendance', true, now()),
  ('attendance.snapshot_storage_base_path', '/storage/hr/attendance', 'attendance', true, now())
ON CONFLICT (setting_key) DO UPDATE
  SET setting_value = EXCLUDED.setting_value,
      setting_group = EXCLUDED.setting_group,
      is_active = EXCLUDED.is_active,
      updated_at = now();

WITH user_roles AS (
  SELECT
    ur.user_id,
    CASE
      WHEN bool_or(r.name = 'admin') THEN 'admin'
      WHEN bool_or(r.name = 'manager') THEN 'manager'
      ELSE 'employee'
    END AS employee_role_type
  FROM public.m0_user_role ur
  JOIN public.m0_role r
    ON r.id = ur.role_id
   AND r.deleted_at IS NULL
  WHERE ur.deleted_at IS NULL
  GROUP BY ur.user_id
),
default_worksite AS (
  SELECT id
  FROM public.hr_worksites
  WHERE code = 'HQ'
  LIMIT 1
)
INSERT INTO public.hr_users (
  user_id,
  employee_code,
  face_enrollment_status,
  face_template_version,
  default_worksite_id,
  is_active,
  employee_role_type,
  created_at
)
SELECT
  u.id,
  'EMP-' || lpad(u.id::text, 4, '0'),
  'not_enrolled',
  1,
  dw.id,
  u.is_active,
  coalesce(ur.employee_role_type, 'employee'),
  now()
FROM public.m0_users u
CROSS JOIN default_worksite dw
LEFT JOIN user_roles ur
  ON ur.user_id = u.id
WHERE u.deleted_at IS NULL
ON CONFLICT (user_id) DO UPDATE
  SET employee_code = EXCLUDED.employee_code,
      default_worksite_id = EXCLUDED.default_worksite_id,
      is_active = EXCLUDED.is_active,
      employee_role_type = EXCLUDED.employee_role_type,
      updated_at = now();

COMMIT;
