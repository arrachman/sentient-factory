-- Canonical administrator access OBT.
-- Mixes access-matrix rows and activity-event rows from the m0 administrator domain.

INSERT INTO public.obt_admin_access (
    obt_name,
    source_module,
    source_doc_type,
    source_header_id,
    source_detail_id,
    source_allocation_id,
    doc_no,
    doc_date,
    doc_status_code,
    doc_status_name,
    branch_code,
    branch_name,
    location_code,
    location_name,
    contact_id,
    contact_code,
    contact_name,
    item_id,
    item_code,
    item_name,
    uom_code,
    upstream_doc_no,
    downstream_doc_no,
    lineage_path,
    qty,
    amount,
    currency_code,
    exchange_rate,
    input_user_id,
    input_user_name,
    modified_user_id,
    modified_user_name,
    source_payload,
    etl_batch_id,
    etl_loaded_at,
    etl_updated_at
)
SELECT
    'obt_admin_access' AS obt_name,
    q.source_module,
    q.source_doc_type,
    q.source_header_id,
    q.source_detail_id,
    NULL::text AS source_allocation_id,
    q.doc_no,
    q.doc_date,
    q.doc_status_code,
    q.doc_status_name,
    q.branch_code,
    q.branch_name,
    q.location_code,
    q.location_name,
    NULL::text AS contact_id,
    q.contact_code,
    q.contact_name,
    NULL::text AS item_id,
    q.item_code,
    q.item_name,
    NULL::text AS uom_code,
    q.upstream_doc_no,
    q.downstream_doc_no,
    q.lineage_path,
    NULL::numeric(20,6) AS qty,
    NULL::numeric(20,6) AS amount,
    NULL::text AS currency_code,
    NULL::numeric(20,6) AS exchange_rate,
    q.input_user_id,
    q.input_user_name,
    NULL::text AS modified_user_id,
    NULL::text AS modified_user_name,
    q.source_payload,
    'baseline-m0-admin-access-v1' AS etl_batch_id,
    clock_timestamp() AS etl_loaded_at,
    clock_timestamp() AS etl_updated_at
FROM (
    SELECT
        'm0'::text AS source_module,
        'ROLE_MENU_ACCESS'::text AS source_doc_type,
        rm.rmrole::text AS source_header_id,
        (rm.rmmoduleid::text || ':' || rm.rmmenuid::text) AS source_detail_id,
        mn.mnname AS doc_no,
        NULL::timestamptz AS doc_date,
        rm.rmakses AS doc_status_code,
        CASE WHEN rm.rmfavourite = 1 THEN 'favourite' ELSE 'standard' END AS doc_status_name,
        u.ucabang AS branch_code,
        br.bnama AS branch_name,
        u.ulokasi AS location_code,
        lc.lnama AS location_name,
        ur.role AS contact_code,
        r.rnama AS contact_name,
        mn.mnid::text AS item_code,
        mn.mnurl AS item_name,
        NULL::text AS upstream_doc_no,
        NULL::text AS downstream_doc_no,
        'ADMIN>ROLE>MENU'::text AS lineage_path,
        u.userid::text AS input_user_id,
        u.unama AS input_user_name,
        rm._cdc_payload AS source_payload
    FROM m0_user_role ur
    JOIN m0_user u
      ON u.userid = ur.userid
    JOIN m0_role r
      ON r.rkode = ur.role
    JOIN m0_role_menu rm
      ON rm.rmrole = ur.role
    JOIN m0_menu mn
      ON mn.mnmoduleid = rm.rmmoduleid
     AND mn.mnid = rm.rmmenuid
    LEFT JOIN m1_branch br
      ON br.bkode = u.ucabang
    LEFT JOIN m1_location lc
      ON lc.lkode = u.ulokasi
    WHERE COALESCE(u._cdc_deleted, false) = false
      AND COALESCE(r._cdc_deleted, false) = false
      AND COALESCE(ur._cdc_deleted, false) = false
      AND COALESCE(rm._cdc_deleted, false) = false
      AND COALESCE(mn._cdc_deleted, false) = false

    UNION ALL

    SELECT
        'm0',
        'USER_ACTIVITY',
        log.uluserid::text AS source_header_id,
        (
            log.uluserid::text || ':' ||
            log.ultgl::text || ':' ||
            log.ulidmodule::text || ':' ||
            log.ulidmenu::text || ':' ||
            log.uljenisaktivitas::text || ':' ||
            COALESCE(log.ulaktivitas, '')
        ) AS source_detail_id,
        COALESCE(log.ulaktivitas, mn.mnname) AS doc_no,
        log.ultgl AS doc_date,
        log.uljenisaktivitas::text AS doc_status_code,
        mn.mnname AS doc_status_name,
        u.ucabang,
        br.bnama,
        u.ulokasi,
        lc.lnama,
        NULL::text AS contact_code,
        NULL::text AS contact_name,
        log.ulidmenu::text AS item_code,
        mn.mnurl AS item_name,
        log.ulidmodule::text AS upstream_doc_no,
        log.ulidmenu::text AS downstream_doc_no,
        'ADMIN>USERLOG'::text AS lineage_path,
        u.userid::text AS input_user_id,
        u.unama AS input_user_name,
        log._cdc_payload AS source_payload
    FROM m0_userlog log
    LEFT JOIN m0_user u
      ON u.userid = log.uluserid
    LEFT JOIN m0_menu mn
      ON mn.mnmoduleid = log.ulidmodule
     AND mn.mnid = log.ulidmenu
    LEFT JOIN m1_branch br
      ON br.bkode = u.ucabang
    LEFT JOIN m1_location lc
      ON lc.lkode = u.ulokasi
    WHERE COALESCE(log._cdc_deleted, false) = false
) AS q;
