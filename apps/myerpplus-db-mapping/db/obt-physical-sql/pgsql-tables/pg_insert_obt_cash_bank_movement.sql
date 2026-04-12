INSERT INTO public.obt_cash_bank_movement (
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
    'obt_cash_bank_movement' AS obt_name,
    'm2' AS source_module,
    tj.tsumber AS source_doc_type,
    tj.tidtransaksi::text AS source_header_id,
    tj.tid::text AS source_detail_id,
    NULL::text AS source_allocation_id,
    tj.tnotransaksi AS doc_no,
    tj.ttgl::timestamp without time zone AS doc_date,
    tj.tstatus::text AS doc_status_code,
    CASE
        WHEN COALESCE(NULLIF(BTRIM(tj.tposting::text), '')::bigint, 0::bigint) = 1 THEN 'POSTED'
        WHEN COALESCE(NULLIF(BTRIM(tj.tstatus::text), '')::bigint, 0::bigint) = 2 THEN 'APPROVED'
        ELSE NULL::text
    END AS doc_status_name,
    tj.tcabang AS branch_code,
    br.bnama AS branch_name,
    tj.tlokasi AS location_code,
    lc.lnama AS location_name,
    NULLIF(BTRIM(tj.tkontak::text), '') AS contact_id,
    ct.kkode AS contact_code,
    ct.knama AS contact_name,
    NULL::text AS item_id,
    NULL::text AS item_code,
    NULL::text AS item_name,
    NULL::text AS uom_code,
    tj.tnohutangpiutang AS upstream_doc_no,
    NULL::text AS downstream_doc_no,
    tj.tsumber || '->JOURNAL' AS lineage_path,
    NULL::numeric(20,6) AS qty,
    (
        COALESCE(NULLIF(tj.tdebit::text, '')::numeric(20,6), 0::numeric(20,6))
        - COALESCE(NULLIF(tj.tkredit::text, '')::numeric(20,6), 0::numeric(20,6))
    ) AS amount,
    tj.tmatauang AS currency_code,
    NULLIF(tj.tkurs::text, '')::numeric(20,6) AS exchange_rate,
    NULL::text AS input_user_id,
    NULL::text AS input_user_name,
    NULL::text AS modified_user_id,
    NULL::text AS modified_user_name,
    tj._cdc_payload AS source_payload,
    'baseline-cash-bank-movement-v1' AS etl_batch_id,
    clock_timestamp() AS etl_loaded_at,
    clock_timestamp() AS etl_updated_at
FROM myerpplus_landing.m2_transaction_journal tj
LEFT JOIN myerpplus_landing.m1_branch br
    ON br.bkode = tj.tcabang
LEFT JOIN myerpplus_landing.m1_location lc
    ON lc.lkode = tj.tlokasi
LEFT JOIN myerpplus_landing.m1_contact ct
    ON ct.kid = NULLIF(BTRIM(tj.tkontak::text), '')::bigint
WHERE COALESCE(tj._cdc_deleted, false) = false;
