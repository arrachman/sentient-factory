INSERT INTO public.obt_finance_payment_history_event (
    payment_history_event_key,
    obt_name,
    source_module,
    source_doc_type,
    source_history_id,
    source_header_id,
    source_payment_id,
    doc_no,
    doc_date,
    doc_status_code,
    previous_status_code,
    payment_method_code,
    payment_method_name,
    branch_code,
    branch_name,
    location_code,
    location_name,
    contact_id,
    contact_code,
    contact_name,
    giro_type_code,
    giro_no,
    giro_due_date,
    bank_code,
    bank_name,
    bank_account_no,
    bank_account_name,
    giro_account_no,
    notes,
    currency_code,
    exchange_rate,
    amount,
    amount_foreign,
    line_order,
    source_payload,
    etl_batch_id,
    etl_loaded_at,
    etl_updated_at
)
SELECT
    q.payment_history_event_key,
    'obt_finance_payment_history_event',
    'm2',
    q.source_doc_type,
    q.source_history_id,
    q.source_header_id,
    q.source_payment_id,
    q.doc_no,
    q.doc_date,
    q.doc_status_code,
    q.previous_status_code,
    q.payment_method_code,
    q.payment_method_name,
    q.branch_code,
    q.branch_name,
    q.location_code,
    q.location_name,
    q.contact_id,
    q.contact_code,
    q.contact_name,
    q.giro_type_code,
    q.giro_no,
    q.giro_due_date,
    q.bank_code,
    bk.bnama AS bank_name,
    q.bank_account_no,
    q.bank_account_name,
    q.giro_account_no,
    q.notes,
    q.currency_code,
    q.exchange_rate,
    q.amount,
    q.amount_foreign,
    q.line_order,
    q.source_payload,
    'baseline-finance-payment-history-v1',
    clock_timestamp(),
    clock_timestamp()
FROM (
    SELECT
        'RM_PAY'::text AS source_doc_type,
        'RM_PAY:' || p.idrmcarabayarhistory::text AS payment_history_event_key,
        p.idrmhistory::text AS source_history_id,
        p.idrm::text AS source_header_id,
        p.idrmcarabayar::text AS source_payment_id,
        h.rmnotransaksi AS doc_no,
        h.rmtgl::timestamp AT TIME ZONE 'UTC' AS doc_date,
        h.rmstatus::text AS doc_status_code,
        h.rmstatussebelumnya::text AS previous_status_code,
        p.carabayar AS payment_method_code,
        NULL::text AS payment_method_name,
        h.rmcabang AS branch_code,
        br.bnama AS branch_name,
        h.rmlokasi AS location_code,
        lc.lnama AS location_name,
        h.rmkontak::text AS contact_id,
        ct.kkode AS contact_code,
        ct.knama AS contact_name,
        NULL::text AS giro_type_code,
        p.nogiro AS giro_no,
        p.tgljt AS giro_due_date,
        p.bank AS bank_code,
        p.noacbank AS bank_account_no,
        p.rekbank AS bank_account_name,
        p.rekgiro AS giro_account_no,
        p.catatan AS notes,
        p.matauang AS currency_code,
        p.kurs::numeric(20,6) AS exchange_rate,
        NULLIF(p.jumlah::text, '')::numeric(20,6) AS amount,
        NULLIF(p.jumlahvalas::text, '')::numeric(20,6) AS amount_foreign,
        NULLIF(p.urutan::text, '')::bigint AS line_order,
        p._cdc_payload AS source_payload
    FROM m2_rm_pay_history p
    JOIN m2_rm_history h ON h.rmidhistory = p.idrmhistory
    LEFT JOIN m1_branch br ON br.bkode = h.rmcabang
    LEFT JOIN m1_location lc ON lc.lkode = h.rmlokasi
    LEFT JOIN m1_contact ct ON ct.kid = NULLIF(h.rmkontak, '')::bigint
    WHERE COALESCE(p._cdc_deleted, false) = false
      AND COALESCE(h._cdc_deleted, false) = false

    UNION ALL

    SELECT
        'SM_PAY',
        'SM_PAY:' || p.idsmcarabayarhistory::text,
        p.idsmhistory::text,
        p.idsm::text,
        p.idsmcarabayar::text,
        h.smnotransaksi,
        h.smtgl::timestamp AT TIME ZONE 'UTC',
        h.smstatus::text,
        h.smstatussebelumnya::text,
        p.carabayar,
        NULL::text,
        h.smcabang,
        br.bnama,
        h.smlokasi,
        lc.lnama,
        h.smkontak::text,
        ct.kkode,
        ct.knama,
        NULL::text,
        p.nogiro,
        p.tgljt,
        p.bank,
        p.noacbank,
        p.rekbank,
        p.rekgiro,
        p.catatan,
        p.matauang,
        p.kurs::numeric(20,6),
        NULLIF(p.jumlah::text, '')::numeric(20,6),
        NULLIF(p.jumlahvalas::text, '')::numeric(20,6),
        NULLIF(p.urutan::text, '')::bigint,
        p._cdc_payload
    FROM m2_sm_pay_history p
    JOIN m2_sm_history h ON h.smidhistory = p.idsmhistory
    LEFT JOIN m1_branch br ON br.bkode = h.smcabang
    LEFT JOIN m1_location lc ON lc.lkode = h.smlokasi
    LEFT JOIN m1_contact ct ON ct.kid = NULLIF(h.smkontak, '')::bigint
    WHERE COALESCE(p._cdc_deleted, false) = false
      AND COALESCE(h._cdc_deleted, false) = false

    UNION ALL

    SELECT
        'CB_PAY',
        'CB_PAY:' || p.idcarabayarhistory::text,
        p.idhistory::text,
        p.idcb::text,
        p.idcbcarabayar::text,
        h.cbnotransaksi,
        h.cbtgl::timestamp AT TIME ZONE 'UTC',
        h.cbstatus::text,
        h.cbstatussebelumnya::text,
        NULL::text,
        NULL::text,
        h.cbcabang,
        br.bnama,
        h.cblokasi,
        lc.lnama,
        h.cbkontak::text,
        ct.kkode,
        ct.knama,
        p.jenisgiro AS giro_type_code,
        p.nogiro,
        p.tgljt,
        p.bank,
        p.noacbank,
        p.rekbank,
        p.rekgiro,
        p.catatan,
        p.matauang,
        p.kurs::numeric(20,6),
        NULLIF(p.jumlah::text, '')::numeric(20,6),
        NULLIF(p.jumlahvalas::text, '')::numeric(20,6),
        NULLIF(p.urutan::text, '')::bigint,
        p._cdc_payload
    FROM m2_cb_pay_history p
    JOIN m2_cb_history h ON h.cbidhistory = p.idhistory
    LEFT JOIN m1_branch br ON br.bkode = h.cbcabang
    LEFT JOIN m1_location lc ON lc.lkode = h.cblokasi
    LEFT JOIN m1_contact ct ON ct.kid = NULLIF(h.cbkontak, '')::bigint
    WHERE COALESCE(p._cdc_deleted, false) = false
      AND COALESCE(h._cdc_deleted, false) = false
) AS q
LEFT JOIN m1_bank bk ON bk.bkode = q.bank_code;
