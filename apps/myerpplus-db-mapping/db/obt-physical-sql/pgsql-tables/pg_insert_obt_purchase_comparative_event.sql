TRUNCATE TABLE public.obt_purchase_comparative_event RESTART IDENTITY;

INSERT INTO public.obt_purchase_comparative_event (
    obt_name, source_module, source_doc_type, source_header_id, source_detail_id, source_allocation_id,
    doc_no, doc_date, doc_status_code, doc_status_name, branch_code, branch_name, location_code, location_name,
    contact_id, contact_code, contact_name, item_id, item_code, item_name, uom_code, upstream_doc_no, downstream_doc_no,
    lineage_path, qty, amount, currency_code, exchange_rate, input_user_id, input_user_name, modified_user_id,
    modified_user_name, source_payload, etl_batch_id
)
SELECT
    'obt_purchase_comparative_event',
    'm4',
    'CS_DETAIL',
    cs.csid::text,
    d.idcsdetail::text,
    NULL,
    cs.csnotransaksi::text,
    cs.cstgl::timestamptz,
    cs.csstatus::text,
    NULL,
    cs.cscabang::text,
    b.bnama::text,
    cs.cslokasi::text,
    l.lnama::text,
    cs.cssupplier::text,
    c.kkode::text,
    c.knama::text,
    d.idbarang::text,
    i.bkode::text,
    COALESCE(NULLIF(d.namabarang, ''), i.bnama)::text,
    i.bsatuan::text,
    NULL,
    NULL,
    'CS',
    COALESCE(NULLIF(d.jml::text, '')::numeric(20,6), 0::numeric(20,6)),
    COALESCE(
        NULLIF(d.harga::text, '')::numeric(20,6) * COALESCE(NULLIF(d.jml::text, '')::numeric(20,6), 0::numeric(20,6)),
        NULL
    ),
    NULL,
    NULL,
    NULLIF(BTRIM(cs.csinputuser::text), ''),
    iu.unama,
    NULLIF(BTRIM(cs.csmodifikasiuser::text), ''),
    mu.unama,
    jsonb_build_object('cs', to_jsonb(cs), 'cs_detail', to_jsonb(d), 'item', to_jsonb(i)),
    'baseline-obt-purchase-comparative-event-v1'
FROM myerpplus_landing.m4_cs cs
JOIN myerpplus_landing.m4_cs_detail d
  ON d.idcs::text = cs.csid::text
LEFT JOIN myerpplus_landing.m1_branch b ON b.bkode = cs.cscabang
LEFT JOIN myerpplus_landing.m1_location l ON l.lkode = cs.cslokasi
LEFT JOIN myerpplus_landing.m1_contact c ON c.kid::text = cs.cssupplier::text
LEFT JOIN myerpplus_landing.m1_item i ON i.bid::text = d.idbarang::text
LEFT JOIN myerpplus_landing.m0_user iu ON iu.userid = NULLIF(BTRIM(cs.csinputuser::text), '')::bigint
LEFT JOIN myerpplus_landing.m0_user mu ON mu.userid = NULLIF(BTRIM(cs.csmodifikasiuser::text), '')::bigint
WHERE COALESCE(cs._cdc_deleted, false) = false
  AND COALESCE(d._cdc_deleted, false) = false;
