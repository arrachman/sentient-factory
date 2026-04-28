BEGIN;

WITH demo_users AS (
  SELECT *
  FROM (
    VALUES
      ('pegawai.demo1@example.com', 'pegawai_demo1', 'Pegawai Demo 1', 'EMP-DEMO-001'),
      ('pegawai.demo2@example.com', 'pegawai_demo2', 'Pegawai Demo 2', 'EMP-DEMO-002'),
      ('pegawai.demo3@example.com', 'pegawai_demo3', 'Pegawai Demo 3', 'EMP-DEMO-003'),
      ('pegawai.demo4@example.com', 'pegawai_demo4', 'Pegawai Demo 4', 'EMP-DEMO-004'),
      ('pegawai.demo5@example.com', 'pegawai_demo5', 'Pegawai Demo 5', 'EMP-DEMO-005')
  ) AS t(email, username, full_name, employee_code)
),
upserted_users AS (
  INSERT INTO public.m0_users (
    email,
    username,
    password_hash,
    full_name,
    is_active,
    warehouse_id,
    created_at,
    updated_at
  )
  SELECT
    d.email,
    d.username,
    'pbkdf2$v1$sha512$210000$uIIVjQQGF31K+R3PdaLN4A==$phMf7bNsHUN8yuzVP6A9OmpEX+GoH/eRoPT2Vc+J+JZ9i8pU4CAOqADk8JuJazh3i7KDAIXOMvJ5uBgoqhaGQg==',
    d.full_name,
    true,
    1,
    now(),
    now()
  FROM demo_users d
  ON CONFLICT (email) DO UPDATE
  SET
    username = EXCLUDED.username,
    full_name = EXCLUDED.full_name,
    password_hash = EXCLUDED.password_hash,
    is_active = true,
    warehouse_id = EXCLUDED.warehouse_id,
    deleted_at = NULL,
    deleted_by = NULL,
    updated_at = now()
  RETURNING id, email, username, full_name
)
INSERT INTO public.m0_user_role (
  user_id,
  role_id,
  assigned_at,
  created_at,
  updated_at
)
SELECT
  u.id,
  3,
  now(),
  now(),
  now()
FROM upserted_users u
ON CONFLICT (user_id, role_id) DO UPDATE
SET
  deleted_at = NULL,
  deleted_by = NULL,
  updated_at = now();

WITH resolved_users AS (
  SELECT
    u.id AS user_id,
    d.employee_code
  FROM public.m0_users u
  JOIN (
    VALUES
      ('pegawai.demo1@example.com', 'EMP-DEMO-001'),
      ('pegawai.demo2@example.com', 'EMP-DEMO-002'),
      ('pegawai.demo3@example.com', 'EMP-DEMO-003'),
      ('pegawai.demo4@example.com', 'EMP-DEMO-004'),
      ('pegawai.demo5@example.com', 'EMP-DEMO-005')
  ) AS d(email, employee_code)
    ON d.email = u.email
)
INSERT INTO public.m0_user_department (
  user_id,
  department_id,
  joined_at,
  created_at,
  updated_at
)
SELECT
  ru.user_id,
  3,
  now(),
  now(),
  now()
FROM resolved_users ru
ON CONFLICT (user_id, department_id) DO UPDATE
SET
  deleted_at = NULL,
  deleted_by = NULL,
  updated_at = now();

WITH resolved_users AS (
  SELECT
    u.id AS user_id,
    d.employee_code
  FROM public.m0_users u
  JOIN (
    VALUES
      ('pegawai.demo1@example.com', 'EMP-DEMO-001'),
      ('pegawai.demo2@example.com', 'EMP-DEMO-002'),
      ('pegawai.demo3@example.com', 'EMP-DEMO-003'),
      ('pegawai.demo4@example.com', 'EMP-DEMO-004'),
      ('pegawai.demo5@example.com', 'EMP-DEMO-005')
  ) AS d(email, employee_code)
    ON d.email = u.email
)
INSERT INTO public.hr_users (
  user_id,
  employee_code,
  employee_role_type,
  face_enrollment_status,
  default_worksite_id,
  is_active,
  created_at,
  updated_at
)
  SELECT
    ru.user_id,
    ru.employee_code,
    'employee',
    'not_enrolled',
    1,
    true,
    now(),
    now()
FROM resolved_users ru
ON CONFLICT (user_id) DO UPDATE
  SET
    employee_code = EXCLUDED.employee_code,
    employee_role_type = EXCLUDED.employee_role_type,
    face_enrollment_status = EXCLUDED.face_enrollment_status,
  default_worksite_id = EXCLUDED.default_worksite_id,
  is_active = true,
  deleted_at = NULL,
  deleted_by = NULL,
  updated_at = now();

COMMIT;
