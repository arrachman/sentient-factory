BEGIN;

WITH parent_upsert AS (
  INSERT INTO public.m0_menu (
    key,
    title,
    path,
    icon,
    type,
    parent_id,
    sort_order,
    is_visible,
    is_active,
    permission_name,
    created_at
  )
  VALUES (
    'hr',
    'HR',
    '',
    'Users',
    'group',
    NULL,
    3,
    true,
    true,
    'menu.hr',
    now()
  )
  ON CONFLICT (key) DO UPDATE
    SET title = EXCLUDED.title,
        path = EXCLUDED.path,
        icon = EXCLUDED.icon,
        type = EXCLUDED.type,
        sort_order = EXCLUDED.sort_order,
        is_visible = EXCLUDED.is_visible,
        is_active = EXCLUDED.is_active,
        permission_name = EXCLUDED.permission_name,
        updated_at = now()
  RETURNING id
),
parent_id_source AS (
  SELECT id FROM parent_upsert
  UNION ALL
  SELECT id FROM public.m0_menu WHERE key = 'hr'
  LIMIT 1
)
INSERT INTO public.m0_menu (
  key,
  title,
  path,
  icon,
  type,
  parent_id,
  sort_order,
  is_visible,
  is_active,
  permission_name,
  created_at
)
SELECT *
FROM (
  SELECT
    'hr-attendance'::text,
    'Attendance'::text,
    '/app/hr/attendance'::text,
    'Clock3'::text,
    'item'::text,
    (SELECT id FROM parent_id_source),
    1,
    true,
    true,
    'menu.hr.attendance'::text,
    now()
  UNION ALL
  SELECT
    'hr-face-enrollments',
    'Face Enrollment Management',
    '/app/hr/face-enrollments',
    'ScanFace',
    'item',
    (SELECT id FROM parent_id_source),
    2,
    true,
    true,
    'menu.hr.face_enrollments',
    now()
  UNION ALL
  SELECT
    'hr-attendance-history',
    'Attendance History',
    '/app/hr/attendance-history',
    'History',
    'item',
    (SELECT id FROM parent_id_source),
    3,
    true,
    true,
    'menu.hr.attendance_history',
    now()
  UNION ALL
  SELECT
    'hr-attendance-dashboard',
    'Attendance Dashboard',
    '/app/hr/attendance-dashboard',
    'LayoutDashboard',
    'item',
    (SELECT id FROM parent_id_source),
    4,
    true,
    true,
    'menu.hr.attendance_dashboard',
    now()
  UNION ALL
  SELECT
    'hr-attendance-reviews',
    'Review Absensi',
    '/app/hr/attendance-reviews',
    'ClipboardList',
    'item',
    (SELECT id FROM parent_id_source),
    5,
    true,
    true,
    'menu.hr.attendance_reviews',
    now()
  UNION ALL
  SELECT
    'hr-worksites',
    'Worksites & Geofences',
    '/app/hr/worksites',
    'MapPinned',
    'item',
    (SELECT id FROM parent_id_source),
    6,
    true,
    true,
    'menu.hr.worksites',
    now()
  UNION ALL
  SELECT
    'hr-settings',
    'Settings',
    '/app/hr/settings',
    'Settings',
    'item',
    (SELECT id FROM parent_id_source),
    7,
    false,
    true,
    'menu.hr.settings',
    now()
) AS seed_data (
  key,
  title,
  path,
  icon,
  type,
  parent_id,
  sort_order,
  is_visible,
  is_active,
  permission_name,
  created_at
)
ON CONFLICT (key) DO UPDATE
  SET title = EXCLUDED.title,
      path = EXCLUDED.path,
      icon = EXCLUDED.icon,
      type = EXCLUDED.type,
      parent_id = EXCLUDED.parent_id,
      sort_order = EXCLUDED.sort_order,
      is_visible = EXCLUDED.is_visible,
      is_active = EXCLUDED.is_active,
      permission_name = EXCLUDED.permission_name,
      updated_at = now();

INSERT INTO public.m0_role_menu (
  role_id,
  menu_id,
  can_view,
  assigned_at,
  created_at
)
SELECT
  r.id,
  m.id,
  true,
  now(),
  now()
FROM public.m0_role r
CROSS JOIN public.m0_menu m
WHERE r.deleted_at IS NULL
  AND r.name IN ('admin', 'manager', 'user')
  AND m.deleted_at IS NULL
  AND m.key IN (
    'hr',
    'hr-attendance',
    'hr-face-enrollments',
    'hr-attendance-history',
    'hr-attendance-dashboard',
    'hr-attendance-reviews',
    'hr-worksites',
    'hr-settings'
  )
  AND NOT EXISTS (
    SELECT 1
    FROM public.m0_role_menu rm
    WHERE rm.role_id = r.id
      AND rm.menu_id = m.id
      AND rm.deleted_at IS NULL
  );

COMMIT;
