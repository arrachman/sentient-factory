-- Cash receipt line-level OBT.
-- One row per m2_cr_detail so each cash receipt posting line is visible immediately.

INSERT INTO obt_cash_receipt_line_flow
SELECT
    'm2' AS source_module,
    'obt_cash_receipt_line_flow' AS obt_name,
    'CR_LINE' AS source_doc_type,
    NULLIF(cr.crid::text, '')::bigint AS source_header_id,
    NULLIF(crd.idcrdetail::text, '')::bigint AS source_detail_id,
    cr.crnotransaksi AS doc_no,
    cr.crtgl::timestamp without time zone AS doc_date,
    cr.crsumber AS doc_source,
    NULLIF(cr.crstatus::text, '')::bigint AS doc_status_code,
    cr.crcabang AS branch_code,
    br.bnama AS branch_name,
    cr.crlokasi AS location_code,
    lc.lnama AS location_name,
    NULLIF(cr.crkontak::text, '')::bigint AS contact_id,
    ct.kkode AS contact_code,
    ct.knama AS contact_name,
    cr.crkontakperson AS contact_person,
    cr.crnorek AS cash_account_code,
    cash_coa.cnama AS cash_account_name,
    crd.norek AS line_account_code,
    line_coa.cnama AS line_account_name,
    COALESCE(NULLIF(crd.matauang, ''), cr.crmatauang) AS currency_code,
    crd.kurs AS exchange_rate,
    NULLIF(crd.urutan::text, '')::bigint AS line_no,
    NULLIF(crd.jumlah, '')::numeric(20,6) AS amount,
    NULLIF(crd.jumlahvalas, '')::numeric(20,6) AS amount_foreign,
    NULLIF(cr.crjumlah, '')::numeric(20,6) AS total_amount,
    NULLIF(cr.crjumlahvalas, '')::numeric(20,6) AS total_amount_foreign,
    NULLIF(crd.divisi, '') AS division_code,
    divi.dnama AS division_name,
    NULLIF(crd.subdivisi, '') AS subdivision_code,
    subd.sdnama AS subdivision_name,
    NULLIF(crd.costcenter, '') AS cost_center_code,
    cc.ccnama AS cost_center_name,
    NULLIF(crd.proyek, '') AS project_code,
    prj.pnama AS project_name,
    crd.catatan AS notes,
    cr.crcatatan AS header_notes,
    clock_timestamp() AS etl_loaded_at
FROM m2_cr_detail crd
JOIN m2_cr cr
    ON NULLIF(cr.crid::text, '')::bigint = NULLIF(crd.idcr::text, '')::bigint
LEFT JOIN m1_branch br
    ON br.bkode = cr.crcabang
LEFT JOIN m1_location lc
    ON lc.lkode = cr.crlokasi
LEFT JOIN m1_contact ct
    ON ct.kid = NULLIF(cr.crkontak::text, '')::bigint
LEFT JOIN m1_coa cash_coa
    ON cash_coa.cnomor = cr.crnorek
LEFT JOIN m1_coa line_coa
    ON line_coa.cnomor = crd.norek
LEFT JOIN m1_division divi
    ON divi.dkode = NULLIF(crd.divisi, '')
LEFT JOIN m1_subdivision subd
    ON subd.sdkode = NULLIF(crd.subdivisi, '')
LEFT JOIN m1_cost_center cc
    ON cc.cckode = NULLIF(crd.costcenter, '')
LEFT JOIN m1_project prj
    ON prj.pkode = NULLIF(crd.proyek, '')
WHERE COALESCE(cr._cdc_deleted, false) = false
  AND COALESCE(crd._cdc_deleted, false) = false;
