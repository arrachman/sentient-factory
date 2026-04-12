TRUNCATE TABLE public.obt_sales_point_adjustment_event RESTART IDENTITY;

INSERT INTO public.obt_sales_point_adjustment_event (
    obt_name, source_module, source_doc_type, source_header_id, source_detail_id, source_allocation_id,
    doc_no, doc_date, doc_status_code, doc_status_name, branch_code, branch_name, location_code, location_name,
    contact_id, contact_code, contact_name, item_id, item_code, item_name, uom_code, upstream_doc_no, downstream_doc_no,
    lineage_path, qty, amount, currency_code, exchange_rate, input_user_id, input_user_name, modified_user_id,
    modified_user_name, source_payload, etl_batch_id
)
SELECT
    'obt_sales_point_adjustment_event',
    'm5',
    'SPA_DETAIL',
    spa.spaid::text,
    d.idspadetail::text,
    NULL,
    spa.spanotransaksi::text,
    spa.spatgl::timestamptz,
    spa.spastatus::text,
    NULL,
    spa.spacabang::text,
    b.bnama::text,
    spa.spalokasi::text,
    l.lnama::text,
    d.kontak::text,
    c.kkode::text,
    c.knama::text,
    NULL, NULL, NULL, NULL,
    NULL, NULL,
    'SPA',
    COALESCE(NULLIF(d.jmlpoint::text, '')::numeric(20,6), 0::numeric(20,6)),
    COALESCE(NULLIF(d.nilai::text, '')::numeric(20,6), 0::numeric(20,6)),
    NULL,
    NULL,
    NULLIF(BTRIM(spa.spainputuser::text), ''),
    iu.unama,
    NULLIF(BTRIM(spa.spamodifikasiuser::text), ''),
    mu.unama,
    jsonb_build_object('spa', to_jsonb(spa), 'spa_detail', to_jsonb(d)),
    'baseline-obt-sales-point-adjustment-event-v1'
FROM myerpplus_landing.m5_spa spa
JOIN myerpplus_landing.m5_spa_detail d
  ON d.idspa::text = spa.spaid::text
LEFT JOIN myerpplus_landing.m1_branch b ON b.bkode = spa.spacabang
LEFT JOIN myerpplus_landing.m1_location l ON l.lkode = spa.spalokasi
LEFT JOIN myerpplus_landing.m1_contact c ON c.kid::text = d.kontak::text
LEFT JOIN myerpplus_landing.m0_user iu ON iu.userid = NULLIF(BTRIM(spa.spainputuser::text), '')::bigint
LEFT JOIN myerpplus_landing.m0_user mu ON mu.userid = NULLIF(BTRIM(spa.spamodifikasiuser::text), '')::bigint
WHERE COALESCE(spa._cdc_deleted, false) = false
  AND COALESCE(d._cdc_deleted, false) = false;
