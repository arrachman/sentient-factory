INSERT INTO public.obt_finance_document_history_event (
    history_event_key,
    obt_name,
    source_module,
    source_doc_type,
    source_history_id,
    source_header_id,
    source_detail_id,
    source_allocation_id,
    doc_no,
    doc_date,
    doc_status_code,
    previous_status_code,
    payment_status_code,
    branch_code,
    branch_name,
    location_code,
    location_name,
    contact_id,
    contact_code,
    contact_name,
    account_code,
    account_name,
    description,
    notes,
    currency_code,
    exchange_rate,
    amount,
    amount_foreign,
    paid_amount,
    paid_amount_foreign,
    debit_amount,
    debit_amount_foreign,
    credit_amount,
    credit_amount_foreign,
    input_user_id,
    modified_user_id,
    revision_count,
    print_count,
    is_closed,
    source_recorded_at,
    source_modified_at,
    source_posted_at,
    source_payload,
    etl_batch_id,
    etl_loaded_at,
    etl_updated_at
)
SELECT
    q.history_event_key,
    'obt_finance_document_history_event',
    'm2',
    q.source_doc_type,
    q.source_history_id,
    q.source_header_id,
    NULL::text,
    NULL::text,
    q.doc_no,
    q.doc_date,
    q.doc_status_code,
    q.previous_status_code,
    q.payment_status_code,
    q.branch_code,
    q.branch_name,
    q.location_code,
    q.location_name,
    q.contact_id,
    q.contact_code,
    q.contact_name,
    q.account_code,
    coa.cnama AS account_name,
    q.description,
    q.notes,
    q.currency_code,
    q.exchange_rate,
    q.amount,
    q.amount_foreign,
    q.paid_amount,
    q.paid_amount_foreign,
    q.debit_amount,
    q.debit_amount_foreign,
    q.credit_amount,
    q.credit_amount_foreign,
    q.input_user_id,
    q.modified_user_id,
    q.revision_count,
    q.print_count,
    q.is_closed,
    q.source_recorded_at,
    q.source_modified_at,
    q.source_posted_at,
    q.source_payload,
    'baseline-finance-history-header-v1',
    clock_timestamp(),
    clock_timestamp()
FROM (
    SELECT
        'CR'::text AS source_doc_type,
        'CR:' || h.cridhistory::text AS history_event_key,
        h.cridhistory::text AS source_history_id,
        h.crid::text AS source_header_id,
        h.crnotransaksi AS doc_no,
        h.crtgl::timestamp AT TIME ZONE 'UTC' AS doc_date,
        h.crstatus::text AS doc_status_code,
        h.crstatussebelumnya::text AS previous_status_code,
        h.crstatusbayar::text AS payment_status_code,
        h.crcabang AS branch_code,
        br.bnama AS branch_name,
        h.crlokasi AS location_code,
        lc.lnama AS location_name,
        h.crkontak::text AS contact_id,
        ct.kkode AS contact_code,
        ct.knama AS contact_name,
        h.crnorek AS account_code,
        h.cruraian AS description,
        h.crcatatan AS notes,
        h.crmatauang AS currency_code,
        h.crkurs::numeric(20,6) AS exchange_rate,
        h.crjumlah::numeric(20,6) AS amount,
        h.crjumlahvalas::numeric(20,6) AS amount_foreign,
        h.crjumlahbayar::numeric(20,6) AS paid_amount,
        h.crjumlahbayarvalas::numeric(20,6) AS paid_amount_foreign,
        NULL::numeric(20,6) AS debit_amount,
        NULL::numeric(20,6) AS debit_amount_foreign,
        NULL::numeric(20,6) AS credit_amount,
        NULL::numeric(20,6) AS credit_amount_foreign,
        NULL::text AS input_user_id,
        NULL::text AS modified_user_id,
        h.crjmlrevisi::bigint AS revision_count,
        h.crcetakanke::bigint AS print_count,
        COALESCE(h.crisclose, 0) <> 0 AS is_closed,
        NULL::timestamptz AS source_recorded_at,
        NULL::timestamptz AS source_modified_at,
        h.crpostingtgl AS source_posted_at,
        h._cdc_payload AS source_payload
    FROM m2_cr_history h
    LEFT JOIN m1_branch br ON br.bkode = h.crcabang
    LEFT JOIN m1_location lc ON lc.lkode = h.crlokasi
    LEFT JOIN m1_contact ct ON ct.kid = NULLIF(h.crkontak, '')::bigint
    WHERE COALESCE(h._cdc_deleted, false) = false

    UNION ALL

    SELECT
        'CD',
        'CD:' || h.cdidhistory::text,
        h.cdidhistory::text,
        h.cdid::text,
        h.cdnotransaksi,
        h.cdtgl::timestamp AT TIME ZONE 'UTC',
        h.cdstatus::text,
        h.cdstatussebelumnya::text,
        h.cdstatusbayar::text,
        h.cdcabang,
        br.bnama,
        h.cdlokasi,
        lc.lnama,
        h.cdkontak::text,
        ct.kkode,
        ct.knama,
        h.cdnorek,
        h.cduraian,
        h.cdcatatan,
        h.cdmatauang,
        h.cdkurs::numeric(20,6),
        h.cdjumlah::numeric(20,6),
        h.cdjumlahvalas::numeric(20,6),
        h.cdjumlahbayar::numeric(20,6),
        h.cdjumlahbayarvalas::numeric(20,6),
        NULL::numeric(20,6),
        NULL::numeric(20,6),
        NULL::numeric(20,6),
        NULL::numeric(20,6),
        NULL::text,
        NULL::text,
        h.cdjmlrevisi::bigint,
        h.cdcetakanke::bigint,
        COALESCE(h.cdisclose, 0) <> 0,
        NULL::timestamptz,
        NULL::timestamptz,
        h.cdpostingtgl,
        h._cdc_payload
    FROM m2_cd_history h
    LEFT JOIN m1_branch br ON br.bkode = h.cdcabang
    LEFT JOIN m1_location lc ON lc.lkode = h.cdlokasi
    LEFT JOIN m1_contact ct ON ct.kid = NULLIF(h.cdkontak, '')::bigint
    WHERE COALESCE(h._cdc_deleted, false) = false

    UNION ALL

    SELECT
        'RM',
        'RM:' || h.rmidhistory::text,
        h.rmidhistory::text,
        h.rmid::text,
        h.rmnotransaksi,
        h.rmtgl::timestamp AT TIME ZONE 'UTC',
        h.rmstatus::text,
        h.rmstatussebelumnya::text,
        h.rmstatusbayar::text,
        h.rmcabang,
        br.bnama,
        h.rmlokasi,
        lc.lnama,
        h.rmkontak::text,
        ct.kkode,
        ct.knama,
        h.rmnorek,
        h.rmuraian,
        h.rmcatatan,
        h.rmmatauang,
        h.rmkurs::numeric(20,6),
        h.rmjumlah::numeric(20,6),
        h.rmjumlahvalas::numeric(20,6),
        h.rmjumlahbayar::numeric(20,6),
        h.rmjumlahbayarvalas::numeric(20,6),
        NULL::numeric(20,6),
        NULL::numeric(20,6),
        NULL::numeric(20,6),
        NULL::numeric(20,6),
        NULL::text,
        NULL::text,
        h.rmjmlrevisi::bigint,
        h.rmcetakanke::bigint,
        COALESCE(h.rmisclose, 0) <> 0,
        NULL::timestamptz,
        NULL::timestamptz,
        h.rmpostingtgl,
        h._cdc_payload
    FROM m2_rm_history h
    LEFT JOIN m1_branch br ON br.bkode = h.rmcabang
    LEFT JOIN m1_location lc ON lc.lkode = h.rmlokasi
    LEFT JOIN m1_contact ct ON ct.kid = NULLIF(h.rmkontak, '')::bigint
    WHERE COALESCE(h._cdc_deleted, false) = false

    UNION ALL

    SELECT
        'SM',
        'SM:' || h.smidhistory::text,
        h.smidhistory::text,
        h.smid::text,
        h.smnotransaksi,
        h.smtgl::timestamp AT TIME ZONE 'UTC',
        h.smstatus::text,
        h.smstatussebelumnya::text,
        h.smstatusbayar::text,
        h.smcabang,
        br.bnama,
        h.smlokasi,
        lc.lnama,
        h.smkontak::text,
        ct.kkode,
        ct.knama,
        h.smnorek,
        h.smuraian,
        h.smcatatan,
        h.smmatauang,
        h.smkurs::numeric(20,6),
        h.smjumlah::numeric(20,6),
        h.smjumlahvalas::numeric(20,6),
        h.smjumlahbayar::numeric(20,6),
        h.smjumlahbayarvalas::numeric(20,6),
        NULL::numeric(20,6),
        NULL::numeric(20,6),
        NULL::numeric(20,6),
        NULL::numeric(20,6),
        NULL::text,
        NULL::text,
        h.smjmlrevisi::bigint,
        h.smcetakanke::bigint,
        COALESCE(h.smisclose, 0) <> 0,
        NULL::timestamptz,
        NULL::timestamptz,
        h.smpostingtgl,
        h._cdc_payload
    FROM m2_sm_history h
    LEFT JOIN m1_branch br ON br.bkode = h.smcabang
    LEFT JOIN m1_location lc ON lc.lkode = h.smlokasi
    LEFT JOIN m1_contact ct ON ct.kid = NULLIF(h.smkontak, '')::bigint
    WHERE COALESCE(h._cdc_deleted, false) = false

    UNION ALL

    SELECT
        'CB',
        'CB:' || h.cbidhistory::text,
        h.cbidhistory::text,
        h.cbid::text,
        h.cbnotransaksi,
        h.cbtgl::timestamp AT TIME ZONE 'UTC',
        h.cbstatus::text,
        h.cbstatussebelumnya::text,
        h.cbstatusbayar::text,
        h.cbcabang,
        br.bnama,
        h.cblokasi,
        lc.lnama,
        h.cbkontak::text,
        ct.kkode,
        ct.knama,
        NULL::text,
        h.cburaian,
        h.cbcatatan,
        h.cbmatauang,
        h.cbkurs::numeric(20,6),
        (
            COALESCE(NULLIF(h.cbdebit::text, '')::numeric(20,6), 0::numeric(20,6))
            - COALESCE(NULLIF(h.cbkredit::text, '')::numeric(20,6), 0::numeric(20,6))
        ),
        (
            COALESCE(NULLIF(h.cbdebitvalas::text, '')::numeric(20,6), 0::numeric(20,6))
            - COALESCE(NULLIF(h.cbkreditvalas::text, '')::numeric(20,6), 0::numeric(20,6))
        ),
        NULLIF(h.cbjumlahbayar::text, '')::numeric(20,6),
        NULLIF(h.cbjumlahbayarvalas::text, '')::numeric(20,6),
        NULLIF(h.cbdebit::text, '')::numeric(20,6),
        NULLIF(h.cbdebitvalas::text, '')::numeric(20,6),
        NULLIF(h.cbkredit::text, '')::numeric(20,6),
        NULLIF(h.cbkreditvalas::text, '')::numeric(20,6),
        NULL::text,
        NULL::text,
        h.cbjmlrevisi::bigint,
        h.cbcetakanke::bigint,
        COALESCE(h.cbisclose, 0) <> 0,
        NULL::timestamptz,
        NULL::timestamptz,
        h.cbpostingtgl,
        h._cdc_payload
    FROM m2_cb_history h
    LEFT JOIN m1_branch br ON br.bkode = h.cbcabang
    LEFT JOIN m1_location lc ON lc.lkode = h.cblokasi
    LEFT JOIN m1_contact ct ON ct.kid = NULLIF(h.cbkontak, '')::bigint
    WHERE COALESCE(h._cdc_deleted, false) = false

    UNION ALL

    SELECT
        'GJ',
        'GJ:' || h.gjidhistory::text,
        h.gjidhistory::text,
        h.gjid::text,
        h.gjnotransaksi,
        h.gjtgl::timestamp AT TIME ZONE 'UTC',
        h.gjstatus::text,
        h.gjstatussebelumnya::text,
        h.gjstatusbayar::text,
        h.gjcabang,
        br.bnama,
        h.gjlokasi,
        lc.lnama,
        h.gjkontak::text,
        ct.kkode,
        ct.knama,
        NULL::text,
        h.gjuraian,
        h.gjcatatan,
        h.gjmatauang,
        h.gjkurs::numeric(20,6),
        (
            COALESCE(NULLIF(h.gjdebit::text, '')::numeric(20,6), 0::numeric(20,6))
            - COALESCE(NULLIF(h.gjkredit::text, '')::numeric(20,6), 0::numeric(20,6))
        ),
        (
            COALESCE(NULLIF(h.gjdebitvalas::text, '')::numeric(20,6), 0::numeric(20,6))
            - COALESCE(NULLIF(h.gjkreditvalas::text, '')::numeric(20,6), 0::numeric(20,6))
        ),
        NULLIF(h.gjjumlahbayar::text, '')::numeric(20,6),
        NULLIF(h.gjjumlahbayarvalas::text, '')::numeric(20,6),
        NULLIF(h.gjdebit::text, '')::numeric(20,6),
        NULLIF(h.gjdebitvalas::text, '')::numeric(20,6),
        NULLIF(h.gjkredit::text, '')::numeric(20,6),
        NULLIF(h.gjkreditvalas::text, '')::numeric(20,6),
        NULL::text,
        NULL::text,
        h.gjjmlrevisi::bigint,
        h.gjcetakanke::bigint,
        COALESCE(h.gjisclose, 0) <> 0,
        NULL::timestamptz,
        NULL::timestamptz,
        h.gjpostingtgl,
        h._cdc_payload
    FROM m2_gj_history h
    LEFT JOIN m1_branch br ON br.bkode = h.gjcabang
    LEFT JOIN m1_location lc ON lc.lkode = h.gjlokasi
    LEFT JOIN m1_contact ct ON ct.kid = NULLIF(h.gjkontak, '')::bigint
    WHERE COALESCE(h._cdc_deleted, false) = false
) AS q
LEFT JOIN m1_coa coa ON coa.cnomor = q.account_code;
