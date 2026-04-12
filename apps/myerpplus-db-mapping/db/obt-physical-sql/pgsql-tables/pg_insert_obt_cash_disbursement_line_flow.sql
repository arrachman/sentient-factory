-- Cash disbursement line-level OBT.
-- One row per m2_cd_detail so each cash disbursement posting line is visible immediately.

INSERT INTO obt_cash_disbursement_line_flow
SELECT
    'm2' AS source_module,
    'obt_cash_disbursement_line_flow' AS obt_name,
    'CD_LINE' AS source_doc_type,
    NULLIF(cd.cdid::text, '')::bigint AS source_header_id,
    NULLIF(cdd.idcddetail::text, '')::bigint AS source_detail_id,
    cd.cdnotransaksi AS doc_no,
    cd.cdtgl::timestamp without time zone AS doc_date,
    cd.cdsumber AS doc_source,
    NULLIF(cd.cdstatus::text, '')::bigint AS doc_status_code,
    cd.cdcabang AS branch_code,
    br.bnama AS branch_name,
    cd.cdlokasi AS location_code,
    lc.lnama AS location_name,
    NULLIF(cd.cdkontak::text, '')::bigint AS contact_id,
    ct.kkode AS contact_code,
    ct.knama AS contact_name,
    cd.cdkontakperson AS contact_person,
    cd.cdnorek AS cash_account_code,
    cash_coa.cnama AS cash_account_name,
    cdd.norek AS line_account_code,
    line_coa.cnama AS line_account_name,
    COALESCE(NULLIF(cdd.matauang, ''), cd.cdmatauang) AS currency_code,
    cdd.kurs AS exchange_rate,
    NULLIF(cdd.urutan::text, '')::bigint AS line_no,
    NULLIF(cdd.jumlah, '')::numeric(20,6) AS amount,
    NULLIF(cdd.jumlahvalas, '')::numeric(20,6) AS amount_foreign,
    NULLIF(cd.cdjumlah, '')::numeric(20,6) AS total_amount,
    NULLIF(cd.cdjumlahvalas, '')::numeric(20,6) AS total_amount_foreign,
    NULLIF(cdd.divisi, '') AS division_code,
    divi.dnama AS division_name,
    NULLIF(cdd.subdivisi, '') AS subdivision_code,
    subd.sdnama AS subdivision_name,
    NULLIF(cdd.costcenter, '') AS cost_center_code,
    cc.ccnama AS cost_center_name,
    NULLIF(cdd.proyek, '') AS project_code,
    prj.pnama AS project_name,
    cdd.catatan AS notes,
    cd.cdcatatan AS header_notes,
    clock_timestamp() AS etl_loaded_at
FROM m2_cd_detail cdd
JOIN m2_cd cd
    ON NULLIF(cd.cdid::text, '')::bigint = NULLIF(cdd.idcd::text, '')::bigint
LEFT JOIN m1_branch br
    ON br.bkode = cd.cdcabang
LEFT JOIN m1_location lc
    ON lc.lkode = cd.cdlokasi
LEFT JOIN m1_contact ct
    ON ct.kid = NULLIF(cd.cdkontak::text, '')::bigint
LEFT JOIN m1_coa cash_coa
    ON cash_coa.cnomor = cd.cdnorek
LEFT JOIN m1_coa line_coa
    ON line_coa.cnomor = cdd.norek
LEFT JOIN m1_division divi
    ON divi.dkode = NULLIF(cdd.divisi, '')
LEFT JOIN m1_subdivision subd
    ON subd.sdkode = NULLIF(cdd.subdivisi, '')
LEFT JOIN m1_cost_center cc
    ON cc.cckode = NULLIF(cdd.costcenter, '')
LEFT JOIN m1_project prj
    ON prj.pkode = NULLIF(cdd.proyek, '')
WHERE COALESCE(cd._cdc_deleted, false) = false
  AND COALESCE(cdd._cdc_deleted, false) = false;
