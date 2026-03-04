-- audit_profile_roles_myerpplus.sql
-- Read-only audit for profile/role consistency in myerpplus (MySQL)

-- 1) Users present in both tables but with different numeric IDs
SELECT u.UserId AS users_id, u.Username, m.userid AS m0_userid
FROM users u
JOIN m0_user m ON m.ukode = u.Username
WHERE u.UserId <> m.userid
ORDER BY u.UserId;

SELECT COUNT(*) AS mismatch_id_count
FROM users u
JOIN m0_user m ON m.ukode = u.Username
WHERE u.UserId <> m.userid;

-- 2) Users missing on either side when matched by username
SELECT u.UserId, u.Username
FROM users u
LEFT JOIN m0_user m ON m.ukode = u.Username
WHERE m.userid IS NULL
ORDER BY u.UserId;

SELECT m.userid, m.ukode
FROM m0_user m
LEFT JOIN users u ON u.Username = m.ukode
WHERE u.UserId IS NULL
ORDER BY m.userid;

SELECT COUNT(*) AS users_without_m0
FROM users u
LEFT JOIN m0_user m ON m.ukode = u.Username
WHERE m.userid IS NULL;

SELECT COUNT(*) AS m0_without_users
FROM m0_user m
LEFT JOIN users u ON u.Username = m.ukode
WHERE u.UserId IS NULL;

-- 3) Profile field mismatch by username
SELECT
  u.Username,
  u.DisplayName AS users_display_name,
  m.unama AS m0_display_name,
  u.IsActive AS users_active,
  m.uaktif AS m0_active,
  COALESCE(u.UserImage, '') AS users_image,
  COALESCE(m.ugambar, '') AS m0_image
FROM users u
JOIN m0_user m ON m.ukode = u.Username
WHERE COALESCE(u.DisplayName, '') <> COALESCE(m.unama, '')
   OR COALESCE(u.IsActive, 0) <> COALESCE(m.uaktif, 0)
   OR COALESCE(u.UserImage, '') <> COALESCE(m.ugambar, '')
ORDER BY u.Username;

-- 4) Duplicate role names
SELECT RoleName, COUNT(*) cnt, GROUP_CONCAT(RoleId ORDER BY RoleId) role_ids
FROM roles
GROUP BY RoleName
HAVING COUNT(*) > 1;

-- 5) Orphaned userroles
SELECT ur.*
FROM userroles ur
LEFT JOIN users u ON u.UserId = ur.UserId
WHERE u.UserId IS NULL;

SELECT ur.*
FROM userroles ur
LEFT JOIN roles r ON r.RoleId = ur.RoleId
WHERE r.RoleId IS NULL;

SELECT COUNT(*) AS orphan_userroles_user
FROM userroles ur
LEFT JOIN users u ON u.UserId = ur.UserId
WHERE u.UserId IS NULL;

SELECT COUNT(*) AS orphan_userroles_role
FROM userroles ur
LEFT JOIN roles r ON r.RoleId = ur.RoleId
WHERE r.RoleId IS NULL;

-- 6) Duplicate user-role pairs
SELECT UserId, RoleId, COUNT(*) cnt
FROM userroles
GROUP BY UserId, RoleId
HAVING COUNT(*) > 1;

-- 7) m0 roles that cannot be mapped into users by username
SELECT mur.userid, mu.ukode, mur.role
FROM m0_user_role mur
JOIN m0_user mu ON mu.userid = mur.userid
LEFT JOIN users u ON u.Username = mu.ukode
WHERE u.UserId IS NULL
ORDER BY mur.userid, mur.role;

SELECT COUNT(*) AS m0_role_not_mapped_to_users
FROM m0_user_role mur
JOIN m0_user mu ON mu.userid = mur.userid
LEFT JOIN users u ON u.Username = mu.ukode
WHERE u.UserId IS NULL;

-- 8) Master-data coverage for profile references in m0_user
SELECT COUNT(*) AS missing_m1_branch
FROM (
  SELECT DISTINCT ucabang kode
  FROM m0_user
  WHERE ucabang IS NOT NULL AND ucabang <> ''
) u
LEFT JOIN m1_branch b ON b.bkode = u.kode
WHERE b.bkode IS NULL;

SELECT COUNT(*) AS missing_m1_location
FROM (
  SELECT DISTINCT ulokasi kode
  FROM m0_user
  WHERE ulokasi IS NOT NULL AND ulokasi <> ''
) u
LEFT JOIN m1_location l ON l.lkode = u.kode
WHERE l.lkode IS NULL;

SELECT COUNT(*) AS missing_m1_warehouse
FROM (
  SELECT DISTINCT ugudang kode
  FROM m0_user
  WHERE ugudang IS NOT NULL AND ugudang <> ''
) u
LEFT JOIN m1_warehouse w ON w.wkode = u.kode
WHERE w.wkode IS NULL;

SELECT COUNT(*) AS missing_m1_city
FROM (
  SELECT DISTINCT ukota kode
  FROM m0_user
  WHERE ukota IS NOT NULL AND ukota <> ''
) u
LEFT JOIN m1_city c ON c.ckode = u.kode
WHERE c.ckode IS NULL;

-- 9) Missing per-user mapping tables
SELECT COUNT(*) AS missing_branch_mapping
FROM m0_user u
LEFT JOIN m0_user_branch b ON b.userid = u.userid AND b.cabang = u.ucabang
WHERE u.ucabang IS NOT NULL AND u.ucabang <> '' AND b.userid IS NULL;

SELECT COUNT(*) AS missing_location_mapping
FROM m0_user u
LEFT JOIN m0_user_location l ON l.userid = u.userid AND l.lokasi = u.ulokasi
WHERE u.ulokasi IS NOT NULL AND u.ulokasi <> '' AND l.userid IS NULL;

SELECT COUNT(*) AS missing_warehouse_mapping
FROM m0_user u
LEFT JOIN m0_user_warehouse w ON w.userid = u.userid AND w.gudang = u.ugudang
WHERE u.ugudang IS NOT NULL AND u.ugudang <> '' AND w.userid IS NULL;
