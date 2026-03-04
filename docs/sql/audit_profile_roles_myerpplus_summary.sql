-- audit_profile_roles_myerpplus_summary.sql
-- Summary-only audit (single-row KPI output) for myerpplus (MySQL)

SELECT
  -- Identity consistency (username-based join)
  (
    SELECT COUNT(*)
    FROM users u
    JOIN m0_user m ON m.ukode = u.Username
    WHERE u.UserId <> m.userid
  ) AS mismatch_id_count,

  (
    SELECT COUNT(*)
    FROM users u
    LEFT JOIN m0_user m ON m.ukode = u.Username
    WHERE m.userid IS NULL
  ) AS users_without_m0,

  (
    SELECT COUNT(*)
    FROM m0_user m
    LEFT JOIN users u ON u.Username = m.ukode
    WHERE u.UserId IS NULL
  ) AS m0_without_users,

  -- Profile field mismatch (by username)
  (
    SELECT COUNT(*)
    FROM users u
    JOIN m0_user m ON m.ukode = u.Username
    WHERE COALESCE(u.DisplayName, '') <> COALESCE(m.unama, '')
       OR COALESCE(u.IsActive, 0) <> COALESCE(m.uaktif, 0)
       OR COALESCE(u.UserImage, '') <> COALESCE(m.ugambar, '')
  ) AS profile_mismatch_count,

  -- Role integrity
  (
    SELECT COUNT(*)
    FROM (
      SELECT RoleName
      FROM roles
      GROUP BY RoleName
      HAVING COUNT(*) > 1
    ) d
  ) AS duplicate_role_name_count,

  (
    SELECT COUNT(*)
    FROM userroles ur
    LEFT JOIN users u ON u.UserId = ur.UserId
    WHERE u.UserId IS NULL
  ) AS orphan_userroles_user,

  (
    SELECT COUNT(*)
    FROM userroles ur
    LEFT JOIN roles r ON r.RoleId = ur.RoleId
    WHERE r.RoleId IS NULL
  ) AS orphan_userroles_role,

  (
    SELECT COUNT(*)
    FROM (
      SELECT UserId, RoleId
      FROM userroles
      GROUP BY UserId, RoleId
      HAVING COUNT(*) > 1
    ) d
  ) AS duplicate_user_role_pairs,

  (
    SELECT COUNT(*)
    FROM m0_user_role mur
    JOIN m0_user mu ON mu.userid = mur.userid
    LEFT JOIN users u ON u.Username = mu.ukode
    WHERE u.UserId IS NULL
  ) AS m0_role_not_mapped_to_users,

  -- Master data coverage for m0_user refs
  (
    SELECT COUNT(*)
    FROM (
      SELECT DISTINCT ucabang kode
      FROM m0_user
      WHERE ucabang IS NOT NULL AND ucabang <> ''
    ) x
    LEFT JOIN m1_branch b ON b.bkode = x.kode
    WHERE b.bkode IS NULL
  ) AS missing_m1_branch,

  (
    SELECT COUNT(*)
    FROM (
      SELECT DISTINCT ulokasi kode
      FROM m0_user
      WHERE ulokasi IS NOT NULL AND ulokasi <> ''
    ) x
    LEFT JOIN m1_location l ON l.lkode = x.kode
    WHERE l.lkode IS NULL
  ) AS missing_m1_location,

  (
    SELECT COUNT(*)
    FROM (
      SELECT DISTINCT ugudang kode
      FROM m0_user
      WHERE ugudang IS NOT NULL AND ugudang <> ''
    ) x
    LEFT JOIN m1_warehouse w ON w.wkode = x.kode
    WHERE w.wkode IS NULL
  ) AS missing_m1_warehouse,

  (
    SELECT COUNT(*)
    FROM (
      SELECT DISTINCT ukota kode
      FROM m0_user
      WHERE ukota IS NOT NULL AND ukota <> ''
    ) x
    LEFT JOIN m1_city c ON c.ckode = x.kode
    WHERE c.ckode IS NULL
  ) AS missing_m1_city,

  -- Per-user mapping completeness
  (
    SELECT COUNT(*)
    FROM m0_user u
    LEFT JOIN m0_user_branch b ON b.userid = u.userid AND b.cabang = u.ucabang
    WHERE u.ucabang IS NOT NULL AND u.ucabang <> '' AND b.userid IS NULL
  ) AS missing_branch_mapping,

  (
    SELECT COUNT(*)
    FROM m0_user u
    LEFT JOIN m0_user_location l ON l.userid = u.userid AND l.lokasi = u.ulokasi
    WHERE u.ulokasi IS NOT NULL AND u.ulokasi <> '' AND l.userid IS NULL
  ) AS missing_location_mapping,

  (
    SELECT COUNT(*)
    FROM m0_user u
    LEFT JOIN m0_user_warehouse w ON w.userid = u.userid AND w.gudang = u.ugudang
    WHERE u.ugudang IS NOT NULL AND u.ugudang <> '' AND w.userid IS NULL
  ) AS missing_warehouse_mapping;
