-- sync_profile_roles_myerpplus.sql
-- Purpose:
-- 1) Audit m0_user vs users mapping consistency
-- 2) Sync profile fields from m0_user -> users by username
-- 3) Sync roles from m0_user_role -> roles/userroles
-- 4) Deduplicate role names and user-role pairs
--
-- Target DB: myerpplus (MySQL)

-- ========== A) AUDIT ==========
SELECT u.UserId AS users_id, u.Username, m.userid AS m0_userid
FROM users u
JOIN m0_user m ON m.ukode = u.Username
WHERE u.UserId <> m.userid
ORDER BY u.UserId;

SELECT COUNT(*) AS mismatch_id_count
FROM users u
JOIN m0_user m ON m.ukode = u.Username
WHERE u.UserId <> m.userid;

SELECT RoleName, COUNT(*) cnt, GROUP_CONCAT(RoleId ORDER BY RoleId) role_ids
FROM roles
GROUP BY RoleName
HAVING COUNT(*) > 1;

-- ========== B) SYNC (SAFE BY USERNAME) ==========
START TRANSACTION;

-- Sync profile-compatible fields only (do not touch password hash/salt)
UPDATE users u
JOIN m0_user m ON m.ukode = u.Username
SET
  u.DisplayName = m.unama,
  u.IsActive = m.uaktif,
  u.UserImage = NULLIF(m.ugambar, ''),
  u.UpdateDate = NOW(),
  u.UpdateUserId = 1;

-- Ensure all role names from m0_user_role exist in roles
INSERT INTO roles (RoleName, RoleKey)
SELECT src.role, src.role
FROM (SELECT DISTINCT role FROM m0_user_role) src
LEFT JOIN roles r ON r.RoleName = src.role
WHERE r.RoleId IS NULL;

-- Rebuild userroles from authoritative m0_user_role
DELETE FROM userroles;

INSERT INTO userroles (UserId, RoleId)
SELECT u.UserId, rm.RoleId
FROM m0_user_role mur
JOIN m0_user mu ON mu.userid = mur.userid
JOIN users u ON u.Username = mu.ukode
JOIN (
  SELECT RoleName, MIN(RoleId) AS RoleId
  FROM roles
  GROUP BY RoleName
) rm ON rm.RoleName = mur.role;

-- Deduplicate role names: keep smallest RoleId per RoleName
UPDATE userroles ur
JOIN roles r ON r.RoleId = ur.RoleId
JOIN (
  SELECT RoleName, MIN(RoleId) AS canonical_id
  FROM roles
  GROUP BY RoleName
) k ON k.RoleName = r.RoleName
SET ur.RoleId = k.canonical_id
WHERE ur.RoleId <> k.canonical_id;

-- Remove duplicate user-role rows if any
DELETE ur1
FROM userroles ur1
JOIN userroles ur2
  ON ur1.UserId = ur2.UserId
 AND ur1.RoleId = ur2.RoleId
 AND ur1.UserRoleId > ur2.UserRoleId;

-- Drop non-canonical duplicated roles
DELETE r
FROM roles r
JOIN (
  SELECT RoleName, MIN(RoleId) AS canonical_id
  FROM roles
  GROUP BY RoleName
) k ON k.RoleName = r.RoleName
WHERE r.RoleId <> k.canonical_id;

COMMIT;

-- ========== C) POST-CHECK ==========
SELECT COUNT(*) AS orphan_userroles_user
FROM userroles ur
LEFT JOIN users u ON u.UserId = ur.UserId
WHERE u.UserId IS NULL;

SELECT COUNT(*) AS orphan_userroles_role
FROM userroles ur
LEFT JOIN roles r ON r.RoleId = ur.RoleId
WHERE r.RoleId IS NULL;

SELECT COUNT(*) AS duplicate_user_role_pairs
FROM (
  SELECT UserId, RoleId, COUNT(*) c
  FROM userroles
  GROUP BY UserId, RoleId
  HAVING COUNT(*) > 1
) d;
