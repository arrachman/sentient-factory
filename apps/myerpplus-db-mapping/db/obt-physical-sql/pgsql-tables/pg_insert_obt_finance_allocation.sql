-- Canonical finance allocation OBT at payment-distribution grain.
-- Current baseline covers RM_PAY, SM_PAY, and CB_PAY families.

INSERT INTO public.obt_finance_allocation (
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
WITH rm_pay_rows AS (
    SELECT
        'obt_finance_allocation'::text AS obt_name,
        'm2'::text AS source_module,
        'RM_PAY'::text AS source_doc_type,
        rm.rmid::text AS source_header_id,
        pay.idrmcarabayar::text AS source_detail_id,
        pay.idrmcarabayar::text AS source_allocation_id,
        rm.rmnotransaksi::text AS doc_no,
        rm.rmtgl::timestamptz AS doc_date,
        rm.rmstatus::text AS doc_status_code,
        NULL::text AS doc_status_name,
        rm.rmcabang::text AS branch_code,
        br.bnama::text AS branch_name,
        rm.rmlokasi::text AS location_code,
        lc.lnama::text AS location_name,
        rm.rmkontak::text AS contact_id,
        ct.kkode::text AS contact_code,
        ct.knama::text AS contact_name,
        NULL::text AS item_id,
        NULL::text AS item_code,
        NULL::text AS item_name,
        NULL::text AS uom_code,
        rm.rmsumber::text AS upstream_doc_no,
        NULL::text AS downstream_doc_no,
        CONCAT_WS('>', 'FINANCE', 'RM', 'RM_PAY')::text AS lineage_path,
        NULL::numeric(20,6) AS qty,
        COALESCE(
            NULLIF(pay.jumlah::text, '')::numeric(20,6),
            NULLIF(pay.jumlahvalas::text, '')::numeric(20,6),
            0::numeric(20,6)
        ) AS amount,
        COALESCE(NULLIF(pay.matauang, ''), NULLIF(rm.rmmatauang, ''))::text AS currency_code,
        COALESCE(
            NULLIF(pay.kurs::text, '')::numeric(20,6),
            NULLIF(rm.rmkurs::text, '')::numeric(20,6)
        ) AS exchange_rate,
        NULL::text AS input_user_id,
        NULL::text AS input_user_name,
        NULL::text AS modified_user_id,
        NULL::text AS modified_user_name,
        jsonb_build_object(
            'rm', to_jsonb(rm),
            'rm_pay', to_jsonb(pay)
        ) AS source_payload,
        'baseline-finance-allocation-v1'::text AS etl_batch_id,
        clock_timestamp() AS etl_loaded_at,
        clock_timestamp() AS etl_updated_at
    FROM myerpplus_landing.m2_rm_pay pay
    JOIN myerpplus_landing.m2_rm rm
      ON rm.rmid = pay.idrm
    LEFT JOIN myerpplus_landing.m1_branch br
      ON br.bkode = rm.rmcabang
    LEFT JOIN myerpplus_landing.m1_location lc
      ON lc.lkode = rm.rmlokasi
    LEFT JOIN myerpplus_landing.m1_contact ct
      ON ct.kid::text = rm.rmkontak::text
    WHERE COALESCE(pay._cdc_deleted, false) = false
      AND COALESCE(rm._cdc_deleted, false) = false
),
sm_pay_rows AS (
    SELECT
        'obt_finance_allocation'::text AS obt_name,
        'm2'::text AS source_module,
        'SM_PAY'::text AS source_doc_type,
        sm.smid::text AS source_header_id,
        pay.idsmcarabayar::text AS source_detail_id,
        pay.idsmcarabayar::text AS source_allocation_id,
        sm.smnotransaksi::text AS doc_no,
        sm.smtgl::timestamptz AS doc_date,
        sm.smstatus::text AS doc_status_code,
        NULL::text AS doc_status_name,
        sm.smcabang::text AS branch_code,
        br.bnama::text AS branch_name,
        sm.smlokasi::text AS location_code,
        lc.lnama::text AS location_name,
        sm.smkontak::text AS contact_id,
        ct.kkode::text AS contact_code,
        ct.knama::text AS contact_name,
        NULL::text AS item_id,
        NULL::text AS item_code,
        NULL::text AS item_name,
        NULL::text AS uom_code,
        sm.smsumber::text AS upstream_doc_no,
        NULL::text AS downstream_doc_no,
        CONCAT_WS('>', 'FINANCE', 'SM', 'SM_PAY')::text AS lineage_path,
        NULL::numeric(20,6) AS qty,
        COALESCE(
            NULLIF(pay.jumlah::text, '')::numeric(20,6),
            NULLIF(pay.jumlahvalas::text, '')::numeric(20,6),
            0::numeric(20,6)
        ) AS amount,
        COALESCE(NULLIF(pay.matauang, ''), NULLIF(sm.smmatauang, ''))::text AS currency_code,
        COALESCE(
            NULLIF(pay.kurs::text, '')::numeric(20,6),
            NULLIF(sm.smkurs::text, '')::numeric(20,6)
        ) AS exchange_rate,
        NULL::text AS input_user_id,
        NULL::text AS input_user_name,
        NULL::text AS modified_user_id,
        NULL::text AS modified_user_name,
        jsonb_build_object(
            'sm', to_jsonb(sm),
            'sm_pay', to_jsonb(pay)
        ) AS source_payload,
        'baseline-finance-allocation-v1'::text AS etl_batch_id,
        clock_timestamp() AS etl_loaded_at,
        clock_timestamp() AS etl_updated_at
    FROM myerpplus_landing.m2_sm_pay pay
    JOIN myerpplus_landing.m2_sm sm
      ON sm.smid = pay.idsm
    LEFT JOIN myerpplus_landing.m1_branch br
      ON br.bkode = sm.smcabang
    LEFT JOIN myerpplus_landing.m1_location lc
      ON lc.lkode = sm.smlokasi
    LEFT JOIN myerpplus_landing.m1_contact ct
      ON ct.kid::text = sm.smkontak::text
    WHERE COALESCE(pay._cdc_deleted, false) = false
      AND COALESCE(sm._cdc_deleted, false) = false
),
cb_pay_rows AS (
    SELECT
        'obt_finance_allocation'::text AS obt_name,
        'm2'::text AS source_module,
        'CB_PAY'::text AS source_doc_type,
        cb.cbid::text AS source_header_id,
        pay.idcbcarabayar::text AS source_detail_id,
        pay.idcbcarabayar::text AS source_allocation_id,
        cb.cbnotransaksi::text AS doc_no,
        cb.cbtgl::timestamptz AS doc_date,
        cb.cbstatus::text AS doc_status_code,
        NULL::text AS doc_status_name,
        cb.cbcabang::text AS branch_code,
        br.bnama::text AS branch_name,
        cb.cblokasi::text AS location_code,
        lc.lnama::text AS location_name,
        cb.cbkontak::text AS contact_id,
        ct.kkode::text AS contact_code,
        ct.knama::text AS contact_name,
        NULL::text AS item_id,
        NULL::text AS item_code,
        NULL::text AS item_name,
        NULL::text AS uom_code,
        cb.cbsumber::text AS upstream_doc_no,
        NULL::text AS downstream_doc_no,
        CONCAT_WS('>', 'FINANCE', 'CB', 'CB_PAY')::text AS lineage_path,
        NULL::numeric(20,6) AS qty,
        COALESCE(
            NULLIF(pay.jumlah::text, '')::numeric(20,6),
            NULLIF(pay.jumlahvalas::text, '')::numeric(20,6),
            0::numeric(20,6)
        ) AS amount,
        COALESCE(NULLIF(pay.matauang, ''), NULLIF(cb.cbmatauang, ''))::text AS currency_code,
        COALESCE(
            NULLIF(pay.kurs::text, '')::numeric(20,6),
            NULLIF(cb.cbkurs::text, '')::numeric(20,6)
        ) AS exchange_rate,
        NULL::text AS input_user_id,
        NULL::text AS input_user_name,
        NULL::text AS modified_user_id,
        NULL::text AS modified_user_name,
        jsonb_build_object(
            'cb', to_jsonb(cb),
            'cb_pay', to_jsonb(pay)
        ) AS source_payload,
        'baseline-finance-allocation-v1'::text AS etl_batch_id,
        clock_timestamp() AS etl_loaded_at,
        clock_timestamp() AS etl_updated_at
    FROM myerpplus_landing.m2_cb_pay pay
    JOIN myerpplus_landing.m2_cb cb
      ON cb.cbid = pay.idcb
    LEFT JOIN myerpplus_landing.m1_branch br
      ON br.bkode = cb.cbcabang
    LEFT JOIN myerpplus_landing.m1_location lc
      ON lc.lkode = cb.cblokasi
    LEFT JOIN myerpplus_landing.m1_contact ct
      ON ct.kid::text = cb.cbkontak::text
    WHERE COALESCE(pay._cdc_deleted, false) = false
      AND COALESCE(cb._cdc_deleted, false) = false
)
SELECT * FROM rm_pay_rows
UNION ALL
SELECT * FROM sm_pay_rows
UNION ALL
SELECT * FROM cb_pay_rows;
