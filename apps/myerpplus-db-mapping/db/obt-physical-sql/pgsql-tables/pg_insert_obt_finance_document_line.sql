-- Canonical finance document OBT at line grain.
-- Current baseline covers CR, CD, and RM document families through the finance line-flow OBTs.

INSERT INTO public.obt_finance_document_line (
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
    'obt_finance_document_line' AS obt_name,
    source_module,
    source_doc_type,
    source_header_id::text,
    source_detail_id::text,
    NULL::text AS source_allocation_id,
    doc_no,
    doc_date AT TIME ZONE 'UTC' AS doc_date,
    doc_status_code::text,
    NULL::text AS doc_status_name,
    branch_code,
    branch_name,
    location_code,
    location_name,
    contact_id::text,
    contact_code,
    contact_name,
    NULL::text AS item_id,
    NULL::text AS item_code,
    NULL::text AS item_name,
    NULL::text AS uom_code,
    NULL::text AS upstream_doc_no,
    NULL::text AS downstream_doc_no,
    source_doc_type AS lineage_path,
    NULL::numeric(20,6) AS qty,
    amount,
    currency_code,
    exchange_rate,
    NULL::text AS input_user_id,
    NULL::text AS input_user_name,
    NULL::text AS modified_user_id,
    NULL::text AS modified_user_name,
    NULL::jsonb AS source_payload,
    'baseline-finance-line-v1' AS etl_batch_id,
    clock_timestamp() AS etl_loaded_at,
    clock_timestamp() AS etl_updated_at
FROM (
    SELECT
        source_module,
        source_doc_type,
        source_header_id,
        source_detail_id,
        doc_no,
        doc_date,
        doc_status_code,
        branch_code,
        branch_name,
        location_code,
        location_name,
        contact_id,
        contact_code,
        contact_name,
        amount,
        currency_code,
        exchange_rate
    FROM public.obt_cash_receipt_line_flow

    UNION ALL

    SELECT
        source_module,
        source_doc_type,
        source_header_id,
        source_detail_id,
        doc_no,
        doc_date,
        doc_status_code,
        branch_code,
        branch_name,
        location_code,
        location_name,
        contact_id,
        contact_code,
        contact_name,
        amount,
        currency_code,
        exchange_rate
    FROM public.obt_cash_disbursement_line_flow

    UNION ALL

    SELECT
        source_module,
        source_doc_type,
        source_header_id,
        source_detail_id,
        doc_no,
        doc_date,
        doc_status_code,
        branch_code,
        branch_name,
        location_code,
        location_name,
        contact_id,
        contact_code,
        contact_name,
        amount,
        currency_code,
        exchange_rate
    FROM public.obt_receipt_money_line_flow

    UNION ALL

    SELECT
        'm2' AS source_module,
        'SM_LINE' AS source_doc_type,
        sm.smid AS source_header_id,
        smd.idsmdetail AS source_detail_id,
        sm.smnotransaksi AS doc_no,
        sm.smtgl::timestamp without time zone AS doc_date,
        NULLIF(sm.smstatus, '')::bigint AS doc_status_code,
        sm.smcabang AS branch_code,
        br.bnama AS branch_name,
        sm.smlokasi AS location_code,
        lc.lnama AS location_name,
        NULLIF(sm.smkontak, '')::bigint AS contact_id,
        ct.kkode AS contact_code,
        ct.knama AS contact_name,
        NULLIF(smd.jumlah::text, '')::numeric(20,6) AS amount,
        COALESCE(NULLIF(smd.matauang, ''), sm.smmatauang) AS currency_code,
        smd.kurs AS exchange_rate
    FROM myerpplus_landing.m2_sm_detail smd
    JOIN myerpplus_landing.m2_sm sm ON sm.smid = smd.idsm
    LEFT JOIN myerpplus_landing.m1_branch br ON br.bkode = sm.smcabang
    LEFT JOIN myerpplus_landing.m1_location lc ON lc.lkode = sm.smlokasi
    LEFT JOIN myerpplus_landing.m1_contact ct ON ct.kid = NULLIF(sm.smkontak, '')::bigint
    WHERE COALESCE(sm._cdc_deleted, false) = false
      AND COALESCE(smd._cdc_deleted, false) = false

    UNION ALL

    SELECT
        'm2',
        'CB_LINE',
        cb.cbid,
        cbd.idcbdetail,
        cb.cbnotransaksi,
        cb.cbtgl::timestamp without time zone,
        NULLIF(cb.cbstatus, '')::bigint,
        cb.cbcabang,
        br.bnama,
        cb.cblokasi,
        lc.lnama,
        NULLIF(cb.cbkontak, '')::bigint,
        ct.kkode,
        ct.knama,
        (
            COALESCE(NULLIF(cbd.debit::text, '')::numeric(20,6), 0::numeric(20,6))
            - COALESCE(NULLIF(cbd.kredit::text, '')::numeric(20,6), 0::numeric(20,6))
        ) AS amount,
        COALESCE(NULLIF(cbd.matauang, ''), cb.cbmatauang),
        cbd.kurs
    FROM myerpplus_landing.m2_cb_detail cbd
    JOIN myerpplus_landing.m2_cb cb ON cb.cbid = cbd.idcb
    LEFT JOIN myerpplus_landing.m1_branch br ON br.bkode = cb.cbcabang
    LEFT JOIN myerpplus_landing.m1_location lc ON lc.lkode = cb.cblokasi
    LEFT JOIN myerpplus_landing.m1_contact ct ON ct.kid = NULLIF(cb.cbkontak, '')::bigint
    WHERE COALESCE(cb._cdc_deleted, false) = false
      AND COALESCE(cbd._cdc_deleted, false) = false

    UNION ALL

    SELECT
        'm2',
        'GJ_LINE',
        gj.gjid,
        gjd.idgjdetail,
        gj.gjnotransaksi,
        gj.gjtgl::timestamp without time zone,
        NULLIF(gj.gjstatus, '')::bigint,
        gj.gjcabang,
        br.bnama,
        gj.gjlokasi,
        lc.lnama,
        NULLIF(gj.gjkontak, '')::bigint,
        ct.kkode,
        ct.knama,
        (
            COALESCE(NULLIF(gjd.debit::text, '')::numeric(20,6), 0::numeric(20,6))
            - COALESCE(NULLIF(gjd.kredit::text, '')::numeric(20,6), 0::numeric(20,6))
        ) AS amount,
        COALESCE(NULLIF(gjd.matauang, ''), gj.gjmatauang),
        gjd.kurs
    FROM myerpplus_landing.m2_gj_detail gjd
    JOIN myerpplus_landing.m2_gj gj ON gj.gjid = gjd.idgj
    LEFT JOIN myerpplus_landing.m1_branch br ON br.bkode = gj.gjcabang
    LEFT JOIN myerpplus_landing.m1_location lc ON lc.lkode = gj.gjlokasi
    LEFT JOIN myerpplus_landing.m1_contact ct ON ct.kid = NULLIF(gj.gjkontak, '')::bigint
    WHERE COALESCE(gj._cdc_deleted, false) = false
      AND COALESCE(gjd._cdc_deleted, false) = false

) AS q;
