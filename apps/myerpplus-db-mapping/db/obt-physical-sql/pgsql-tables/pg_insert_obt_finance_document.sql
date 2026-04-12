-- Canonical finance document OBT at header grain.
-- Current baseline covers CR, CD, and RM document families that are already landed.

INSERT INTO public.obt_finance_document (
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
    'obt_finance_document' AS obt_name,
    q.source_module,
    q.source_doc_type,
    q.source_header_id,
    NULL::text AS source_detail_id,
    NULL::text AS source_allocation_id,
    q.doc_no,
    q.doc_date,
    q.doc_status_code,
    NULL::text AS doc_status_name,
    q.branch_code,
    q.branch_name,
    q.location_code,
    q.location_name,
    q.contact_id,
    q.contact_code,
    q.contact_name,
    NULL::text AS item_id,
    NULL::text AS item_code,
    NULL::text AS item_name,
    NULL::text AS uom_code,
    NULL::text AS upstream_doc_no,
    NULL::text AS downstream_doc_no,
    q.lineage_path,
    NULL::numeric(20,6) AS qty,
    q.amount,
    q.currency_code,
    q.exchange_rate,
    NULL::text AS input_user_id,
    NULL::text AS input_user_name,
    NULL::text AS modified_user_id,
    NULL::text AS modified_user_name,
    q.source_payload,
    'baseline-finance-header-v1' AS etl_batch_id,
    clock_timestamp() AS etl_loaded_at,
    clock_timestamp() AS etl_updated_at
FROM (
    SELECT
        'm2'::text AS source_module,
        'CR'::text AS source_doc_type,
        cr.crid::text AS source_header_id,
        cr.crnotransaksi AS doc_no,
        cr.crtgl AS doc_date,
        cr.crstatus AS doc_status_code,
        cr.crcabang AS branch_code,
        br.bnama AS branch_name,
        cr.crlokasi AS location_code,
        lc.lnama AS location_name,
        cr.crkontak AS contact_id,
        ct.kkode AS contact_code,
        ct.knama AS contact_name,
        'FINANCE>CR'::text AS lineage_path,
        NULLIF(cr.crjumlah, '')::numeric(20,6) AS amount,
        cr.crmatauang AS currency_code,
        cr.crkurs AS exchange_rate,
        cr._cdc_payload AS source_payload
    FROM m2_cr cr
    LEFT JOIN m1_branch br ON br.bkode = cr.crcabang
    LEFT JOIN m1_location lc ON lc.lkode = cr.crlokasi
    LEFT JOIN m1_contact ct ON ct.kid = NULLIF(cr.crkontak, '')::bigint
    WHERE COALESCE(cr._cdc_deleted, false) = false

    UNION ALL

    SELECT
        'm2',
        'CD',
        cd.cdid::text,
        cd.cdnotransaksi,
        cd.cdtgl,
        cd.cdstatus,
        cd.cdcabang,
        br.bnama,
        cd.cdlokasi,
        lc.lnama,
        cd.cdkontak,
        ct.kkode,
        ct.knama,
        'FINANCE>CD',
        NULLIF(cd.cdjumlah, '')::numeric(20,6),
        cd.cdmatauang,
        cd.cdkurs,
        cd._cdc_payload
    FROM m2_cd cd
    LEFT JOIN m1_branch br ON br.bkode = cd.cdcabang
    LEFT JOIN m1_location lc ON lc.lkode = cd.cdlokasi
    LEFT JOIN m1_contact ct ON ct.kid = NULLIF(cd.cdkontak, '')::bigint
    WHERE COALESCE(cd._cdc_deleted, false) = false

    UNION ALL

    SELECT
        'm2',
        'RM',
        rm.rmid::text,
        rm.rmnotransaksi,
        rm.rmtgl,
        rm.rmstatus,
        rm.rmcabang,
        br.bnama,
        rm.rmlokasi,
        lc.lnama,
        rm.rmkontak,
        ct.kkode,
        ct.knama,
        'FINANCE>RM',
        NULLIF(rm.rmjumlah, '')::numeric(20,6),
        rm.rmmatauang,
        rm.rmkurs,
        rm._cdc_payload
    FROM m2_rm rm
    LEFT JOIN m1_branch br ON br.bkode = rm.rmcabang
    LEFT JOIN m1_location lc ON lc.lkode = rm.rmlokasi
    LEFT JOIN m1_contact ct ON ct.kid = NULLIF(rm.rmkontak, '')::bigint
    WHERE COALESCE(rm._cdc_deleted, false) = false

    UNION ALL

    SELECT
        'm2',
        'SM',
        sm.smid::text,
        sm.smnotransaksi,
        sm.smtgl,
        sm.smstatus,
        sm.smcabang,
        br.bnama,
        sm.smlokasi,
        lc.lnama,
        sm.smkontak,
        ct.kkode,
        ct.knama,
        'FINANCE>SM',
        NULLIF(sm.smjumlah::text, '')::numeric(20,6),
        sm.smmatauang,
        sm.smkurs,
        sm._cdc_payload
    FROM m2_sm sm
    LEFT JOIN m1_branch br ON br.bkode = sm.smcabang
    LEFT JOIN m1_location lc ON lc.lkode = sm.smlokasi
    LEFT JOIN m1_contact ct ON ct.kid = NULLIF(sm.smkontak, '')::bigint
    WHERE COALESCE(sm._cdc_deleted, false) = false

    UNION ALL

    SELECT
        'm2',
        'CB',
        cb.cbid::text,
        cb.cbnotransaksi,
        cb.cbtgl,
        cb.cbstatus,
        cb.cbcabang,
        br.bnama,
        cb.cblokasi,
        lc.lnama,
        cb.cbkontak,
        ct.kkode,
        ct.knama,
        'FINANCE>CB',
        COALESCE(NULLIF(cb.cbdebit::text, '')::numeric(20,6), 0::numeric(20,6))
        - COALESCE(NULLIF(cb.cbkredit::text, '')::numeric(20,6), 0::numeric(20,6)),
        cb.cbmatauang,
        cb.cbkurs,
        cb._cdc_payload
    FROM m2_cb cb
    LEFT JOIN m1_branch br ON br.bkode = cb.cbcabang
    LEFT JOIN m1_location lc ON lc.lkode = cb.cblokasi
    LEFT JOIN m1_contact ct ON ct.kid = NULLIF(cb.cbkontak, '')::bigint
    WHERE COALESCE(cb._cdc_deleted, false) = false

    UNION ALL

    SELECT
        'm2',
        'GJ',
        gj.gjid::text,
        gj.gjnotransaksi,
        gj.gjtgl,
        gj.gjstatus,
        gj.gjcabang,
        br.bnama,
        gj.gjlokasi,
        lc.lnama,
        gj.gjkontak,
        ct.kkode,
        ct.knama,
        'FINANCE>GJ',
        COALESCE(NULLIF(gj.gjdebit::text, '')::numeric(20,6), 0::numeric(20,6))
        - COALESCE(NULLIF(gj.gjkredit::text, '')::numeric(20,6), 0::numeric(20,6)),
        gj.gjmatauang,
        gj.gjkurs,
        gj._cdc_payload
    FROM m2_gj gj
    LEFT JOIN m1_branch br ON br.bkode = gj.gjcabang
    LEFT JOIN m1_location lc ON lc.lkode = gj.gjlokasi
    LEFT JOIN m1_contact ct ON ct.kid = NULLIF(gj.gjkontak, '')::bigint
    WHERE COALESCE(gj._cdc_deleted, false) = false

) AS q;
