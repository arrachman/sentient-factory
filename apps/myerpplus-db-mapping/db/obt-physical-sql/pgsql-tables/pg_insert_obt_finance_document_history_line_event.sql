INSERT INTO public.obt_finance_document_history_line_event (
    history_line_event_key,
    obt_name,
    source_module,
    source_doc_type,
    source_history_id,
    source_header_id,
    source_detail_id,
    doc_no,
    doc_date,
    doc_status_code,
    previous_status_code,
    branch_code,
    branch_name,
    location_code,
    location_name,
    contact_id,
    contact_code,
    contact_name,
    account_code,
    account_name,
    currency_code,
    exchange_rate,
    amount,
    amount_foreign,
    debit_amount,
    debit_amount_foreign,
    credit_amount,
    credit_amount_foreign,
    notes,
    cost_center_code,
    cost_center_name,
    division_code,
    division_name,
    subdivision_code,
    project_code,
    project_name,
    line_order,
    is_closed,
    source_payload,
    etl_batch_id,
    etl_loaded_at,
    etl_updated_at
)
SELECT
    q.history_line_event_key,
    'obt_finance_document_history_line_event',
    'm2',
    q.source_doc_type,
    q.source_history_id,
    q.source_header_id,
    q.source_detail_id,
    q.doc_no,
    q.doc_date,
    q.doc_status_code,
    q.previous_status_code,
    q.branch_code,
    q.branch_name,
    q.location_code,
    q.location_name,
    q.contact_id,
    q.contact_code,
    q.contact_name,
    q.account_code,
    coa.cnama AS account_name,
    q.currency_code,
    q.exchange_rate,
    q.amount,
    q.amount_foreign,
    q.debit_amount,
    q.debit_amount_foreign,
    q.credit_amount,
    q.credit_amount_foreign,
    q.notes,
    q.cost_center_code,
    cc.ccnama AS cost_center_name,
    q.division_code,
    dv.dnama AS division_name,
    q.subdivision_code,
    q.project_code,
    pj.pnama AS project_name,
    q.line_order,
    q.is_closed,
    q.source_payload,
    'baseline-finance-history-line-v1',
    clock_timestamp(),
    clock_timestamp()
FROM (
    SELECT
        'CR_LINE'::text AS source_doc_type,
        'CR:' || d.idhistorydetail::text AS history_line_event_key,
        d.idhistory::text AS source_history_id,
        d.idcr::text AS source_header_id,
        d.idcrdetail::text AS source_detail_id,
        h.crnotransaksi AS doc_no,
        h.crtgl::timestamp AT TIME ZONE 'UTC' AS doc_date,
        h.crstatus::text AS doc_status_code,
        h.crstatussebelumnya::text AS previous_status_code,
        h.crcabang AS branch_code,
        br.bnama AS branch_name,
        h.crlokasi AS location_code,
        lc.lnama AS location_name,
        h.crkontak::text AS contact_id,
        ct.kkode AS contact_code,
        ct.knama AS contact_name,
        d.norek AS account_code,
        d.matauang AS currency_code,
        d.kurs::numeric(20,6) AS exchange_rate,
        d.jumlah::numeric(20,6) AS amount,
        d.jumlahvalas::numeric(20,6) AS amount_foreign,
        NULL::numeric(20,6) AS debit_amount,
        NULL::numeric(20,6) AS debit_amount_foreign,
        NULL::numeric(20,6) AS credit_amount,
        NULL::numeric(20,6) AS credit_amount_foreign,
        d.catatan AS notes,
        d.costcenter AS cost_center_code,
        d.divisi AS division_code,
        d.subdivisi AS subdivision_code,
        d.proyek AS project_code,
        d.urutan::bigint AS line_order,
        COALESCE(d.isclose, 0) <> 0 AS is_closed,
        d._cdc_payload AS source_payload
    FROM m2_cr_detail_history d
    JOIN m2_cr_history h ON h.cridhistory = d.idhistory
    LEFT JOIN m1_branch br ON br.bkode = h.crcabang
    LEFT JOIN m1_location lc ON lc.lkode = h.crlokasi
    LEFT JOIN m1_contact ct ON ct.kid = NULLIF(h.crkontak, '')::bigint
    WHERE COALESCE(d._cdc_deleted, false) = false
      AND COALESCE(h._cdc_deleted, false) = false

    UNION ALL

    SELECT
        'CD_LINE',
        'CD:' || d.idhistorydetail::text,
        d.idhistory::text,
        d.idcd::text,
        d.idcddetail::text,
        h.cdnotransaksi,
        h.cdtgl::timestamp AT TIME ZONE 'UTC',
        h.cdstatus::text,
        h.cdstatussebelumnya::text,
        h.cdcabang,
        br.bnama,
        h.cdlokasi,
        lc.lnama,
        h.cdkontak::text,
        ct.kkode,
        ct.knama,
        d.norek,
        d.matauang,
        d.kurs::numeric(20,6),
        d.jumlah::numeric(20,6),
        d.jumlahvalas::numeric(20,6),
        NULL::numeric(20,6),
        NULL::numeric(20,6),
        NULL::numeric(20,6),
        NULL::numeric(20,6),
        d.catatan,
        d.costcenter,
        d.divisi,
        d.subdivisi,
        d.proyek,
        d.urutan::bigint,
        COALESCE(d.isclose, 0) <> 0,
        d._cdc_payload
    FROM m2_cd_detail_history d
    JOIN m2_cd_history h ON h.cdidhistory = d.idhistory
    LEFT JOIN m1_branch br ON br.bkode = h.cdcabang
    LEFT JOIN m1_location lc ON lc.lkode = h.cdlokasi
    LEFT JOIN m1_contact ct ON ct.kid = NULLIF(h.cdkontak, '')::bigint
    WHERE COALESCE(d._cdc_deleted, false) = false
      AND COALESCE(h._cdc_deleted, false) = false

    UNION ALL

    SELECT
        'RM_LINE',
        'RM:' || d.idhistorydetail::text,
        d.idhistory::text,
        d.idrm::text,
        d.idrmdetail::text,
        h.rmnotransaksi,
        h.rmtgl::timestamp AT TIME ZONE 'UTC',
        h.rmstatus::text,
        h.rmstatussebelumnya::text,
        h.rmcabang,
        br.bnama,
        h.rmlokasi,
        lc.lnama,
        h.rmkontak::text,
        ct.kkode,
        ct.knama,
        d.norek,
        d.matauang,
        d.kurs::numeric(20,6),
        d.jumlah::numeric(20,6),
        d.jumlahvalas::numeric(20,6),
        NULL::numeric(20,6),
        NULL::numeric(20,6),
        NULL::numeric(20,6),
        NULL::numeric(20,6),
        d.catatan,
        d.costcenter,
        d.divisi,
        d.subdivisi,
        d.proyek,
        d.urutan::bigint,
        COALESCE(d.isclose, 0) <> 0,
        d._cdc_payload
    FROM m2_rm_detail_history d
    JOIN m2_rm_history h ON h.rmidhistory = d.idhistory
    LEFT JOIN m1_branch br ON br.bkode = h.rmcabang
    LEFT JOIN m1_location lc ON lc.lkode = h.rmlokasi
    LEFT JOIN m1_contact ct ON ct.kid = NULLIF(h.rmkontak, '')::bigint
    WHERE COALESCE(d._cdc_deleted, false) = false
      AND COALESCE(h._cdc_deleted, false) = false

    UNION ALL

    SELECT
        'SM_LINE',
        'SM:' || d.idhistorydetail::text,
        d.idhistory::text,
        d.idsm::text,
        d.idsmdetail::text,
        h.smnotransaksi,
        h.smtgl::timestamp AT TIME ZONE 'UTC',
        h.smstatus::text,
        h.smstatussebelumnya::text,
        h.smcabang,
        br.bnama,
        h.smlokasi,
        lc.lnama,
        h.smkontak::text,
        ct.kkode,
        ct.knama,
        d.norek,
        d.matauang,
        d.kurs::numeric(20,6),
        d.jumlah::numeric(20,6),
        d.jumlahvalas::numeric(20,6),
        NULL::numeric(20,6),
        NULL::numeric(20,6),
        NULL::numeric(20,6),
        NULL::numeric(20,6),
        d.catatan,
        d.costcenter,
        d.divisi,
        d.subdivisi,
        d.proyek,
        d.urutan::bigint,
        COALESCE(d.isclose, 0) <> 0,
        d._cdc_payload
    FROM m2_sm_detail_history d
    JOIN m2_sm_history h ON h.smidhistory = d.idhistory
    LEFT JOIN m1_branch br ON br.bkode = h.smcabang
    LEFT JOIN m1_location lc ON lc.lkode = h.smlokasi
    LEFT JOIN m1_contact ct ON ct.kid = NULLIF(h.smkontak, '')::bigint
    WHERE COALESCE(d._cdc_deleted, false) = false
      AND COALESCE(h._cdc_deleted, false) = false

    UNION ALL

    SELECT
        'CB_LINE',
        'CB:' || d.idhistorydetail::text,
        d.idhistory::text,
        d.idcb::text,
        d.idcbdetail::text,
        h.cbnotransaksi,
        h.cbtgl::timestamp AT TIME ZONE 'UTC',
        h.cbstatus::text,
        h.cbstatussebelumnya::text,
        h.cbcabang,
        br.bnama,
        h.cblokasi,
        lc.lnama,
        h.cbkontak::text,
        ct.kkode,
        ct.knama,
        d.norek,
        d.matauang,
        d.kurs::numeric(20,6),
        (
            COALESCE(NULLIF(d.debit::text, '')::numeric(20,6), 0::numeric(20,6))
            - COALESCE(NULLIF(d.kredit::text, '')::numeric(20,6), 0::numeric(20,6))
        ),
        (
            COALESCE(NULLIF(d.debitvalas::text, '')::numeric(20,6), 0::numeric(20,6))
            - COALESCE(NULLIF(d.kreditvalas::text, '')::numeric(20,6), 0::numeric(20,6))
        ),
        NULLIF(d.debit::text, '')::numeric(20,6),
        NULLIF(d.debitvalas::text, '')::numeric(20,6),
        NULLIF(d.kredit::text, '')::numeric(20,6),
        NULLIF(d.kreditvalas::text, '')::numeric(20,6),
        d.catatan,
        d.costcenter,
        d.divisi,
        d.subdivisi,
        d.proyek,
        d.urutan::bigint,
        COALESCE(d.isclose, 0) <> 0,
        d._cdc_payload
    FROM m2_cb_detail_history d
    JOIN m2_cb_history h ON h.cbidhistory = d.idhistory
    LEFT JOIN m1_branch br ON br.bkode = h.cbcabang
    LEFT JOIN m1_location lc ON lc.lkode = h.cblokasi
    LEFT JOIN m1_contact ct ON ct.kid = NULLIF(h.cbkontak, '')::bigint
    WHERE COALESCE(d._cdc_deleted, false) = false
      AND COALESCE(h._cdc_deleted, false) = false

    UNION ALL

    SELECT
        'GJ_LINE',
        'GJ:' || d.idhistorydetail::text,
        d.idhistory::text,
        d.idgj::text,
        d.idgjdetail::text,
        h.gjnotransaksi,
        h.gjtgl::timestamp AT TIME ZONE 'UTC',
        h.gjstatus::text,
        h.gjstatussebelumnya::text,
        h.gjcabang,
        br.bnama,
        h.gjlokasi,
        lc.lnama,
        h.gjkontak::text,
        ct.kkode,
        ct.knama,
        d.norek,
        d.matauang,
        d.kurs::numeric(20,6),
        (
            COALESCE(NULLIF(d.debit::text, '')::numeric(20,6), 0::numeric(20,6))
            - COALESCE(NULLIF(d.kredit::text, '')::numeric(20,6), 0::numeric(20,6))
        ),
        (
            COALESCE(NULLIF(d.debitvalas::text, '')::numeric(20,6), 0::numeric(20,6))
            - COALESCE(NULLIF(d.kreditvalas::text, '')::numeric(20,6), 0::numeric(20,6))
        ),
        NULLIF(d.debit::text, '')::numeric(20,6),
        NULLIF(d.debitvalas::text, '')::numeric(20,6),
        NULLIF(d.kredit::text, '')::numeric(20,6),
        NULLIF(d.kreditvalas::text, '')::numeric(20,6),
        d.catatan,
        d.costcenter,
        d.divisi,
        d.subdivisi,
        d.proyek,
        d.urutan::bigint,
        COALESCE(d.isclose, 0) <> 0,
        d._cdc_payload
    FROM m2_gj_detail_history d
    JOIN m2_gj_history h ON h.gjidhistory = d.idhistory
    LEFT JOIN m1_branch br ON br.bkode = h.gjcabang
    LEFT JOIN m1_location lc ON lc.lkode = h.gjlokasi
    LEFT JOIN m1_contact ct ON ct.kid = NULLIF(h.gjkontak, '')::bigint
    WHERE COALESCE(d._cdc_deleted, false) = false
      AND COALESCE(h._cdc_deleted, false) = false
) AS q
LEFT JOIN m1_coa coa ON coa.cnomor = q.account_code
LEFT JOIN m1_cost_center cc ON cc.cckode = q.cost_center_code
LEFT JOIN m1_division dv ON dv.dkode = q.division_code
LEFT JOIN m1_project pj ON pj.pkode = q.project_code;
