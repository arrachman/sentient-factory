-- Receipt-money line-level OBT.
-- One row per m2_rm_detail so each receipt-money posting line is visible immediately.

INSERT INTO obt_receipt_money_line_flow
SELECT
    'm2' AS source_module,
    'obt_receipt_money_line_flow' AS obt_name,
    'RM_LINE' AS source_doc_type,
    NULLIF(rm.rmid::text, '')::bigint AS source_header_id,
    NULLIF(rmd.idrmdetail::text, '')::bigint AS source_detail_id,
    rm.rmnotransaksi AS doc_no,
    rm.rmtgl::timestamp without time zone AS doc_date,
    rm.rmsumber AS doc_source,
    rm.rmcarabayar AS payment_method_code,
    NULLIF(rm.rmstatus::text, '')::bigint AS doc_status_code,
    rm.rmcabang AS branch_code,
    br.bnama AS branch_name,
    rm.rmlokasi AS location_code,
    lc.lnama AS location_name,
    NULLIF(rm.rmkontak::text, '')::bigint AS contact_id,
    ct.kkode AS contact_code,
    ct.knama AS contact_name,
    rm.rmkontakperson AS contact_person,
    rm.rmnorek AS cash_account_code,
    cash_coa.cnama AS cash_account_name,
    rmd.norek AS line_account_code,
    line_coa.cnama AS line_account_name,
    COALESCE(NULLIF(rmd.matauang, ''), rm.rmmatauang) AS currency_code,
    rmd.kurs AS exchange_rate,
    NULLIF(rmd.urutan::text, '')::bigint AS line_no,
    NULLIF(rmd.jumlah, '')::numeric(20,6) AS amount,
    NULLIF(rmd.jumlahvalas, '')::numeric(20,6) AS amount_foreign,
    NULLIF(rm.rmjumlah, '')::numeric(20,6) AS total_amount,
    NULLIF(rm.rmjumlahvalas, '')::numeric(20,6) AS total_amount_foreign,
    NULLIF(rmd.divisi, '') AS division_code,
    divi.dnama AS division_name,
    NULLIF(rmd.subdivisi, '') AS subdivision_code,
    subd.sdnama AS subdivision_name,
    NULLIF(rmd.costcenter, '') AS cost_center_code,
    cc.ccnama AS cost_center_name,
    NULLIF(rmd.proyek, '') AS project_code,
    prj.pnama AS project_name,
    rmd.catatan AS notes,
    rm.rmcatatan AS header_notes,
    clock_timestamp() AS etl_loaded_at
FROM m2_rm_detail rmd
JOIN m2_rm rm
    ON NULLIF(rm.rmid::text, '')::bigint = NULLIF(rmd.idrm::text, '')::bigint
LEFT JOIN m1_branch br
    ON br.bkode = rm.rmcabang
LEFT JOIN m1_location lc
    ON lc.lkode = rm.rmlokasi
LEFT JOIN m1_contact ct
    ON ct.kid = NULLIF(rm.rmkontak::text, '')::bigint
LEFT JOIN m1_coa cash_coa
    ON cash_coa.cnomor = rm.rmnorek
LEFT JOIN m1_coa line_coa
    ON line_coa.cnomor = rmd.norek
LEFT JOIN m1_division divi
    ON divi.dkode = NULLIF(rmd.divisi, '')
LEFT JOIN m1_subdivision subd
    ON subd.sdkode = NULLIF(rmd.subdivisi, '')
LEFT JOIN m1_cost_center cc
    ON cc.cckode = NULLIF(rmd.costcenter, '')
LEFT JOIN m1_project prj
    ON prj.pkode = NULLIF(rmd.proyek, '')
WHERE COALESCE(rm._cdc_deleted, false) = false
  AND COALESCE(rmd._cdc_deleted, false) = false;
