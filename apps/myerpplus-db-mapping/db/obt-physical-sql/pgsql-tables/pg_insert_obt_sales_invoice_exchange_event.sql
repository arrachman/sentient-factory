TRUNCATE TABLE public.obt_sales_invoice_exchange_event RESTART IDENTITY;

INSERT INTO public.obt_sales_invoice_exchange_event (
    obt_name, source_module, source_doc_type, source_header_id, source_detail_id, source_allocation_id,
    doc_no, doc_date, doc_status_code, doc_status_name, branch_code, branch_name, location_code, location_name,
    contact_id, contact_code, contact_name, item_id, item_code, item_name, uom_code, upstream_doc_no, downstream_doc_no,
    lineage_path, qty, amount, currency_code, exchange_rate, input_user_id, input_user_name, modified_user_id,
    modified_user_name, source_payload, etl_batch_id
)
SELECT
    'obt_sales_invoice_exchange_event',
    'm5',
    'SIE_DETAIL',
    sie.sieid::text,
    d.idsiedetail::text,
    d.idtransaksi::text,
    sie.sienotransaksi::text,
    sie.sietgl::timestamptz,
    sie.siestatus::text,
    NULL,
    sie.siecabang::text,
    b.bnama::text,
    sie.sielokasi::text,
    l.lnama::text,
    sie.siekontak::text,
    c.kkode::text,
    c.knama::text,
    NULL, NULL, NULL, NULL,
    d.idtransaksi::text,
    NULL,
    CONCAT_WS(' -> ', d.sumber, 'SIE'),
    NULL,
    NULL,
    NULL,
    NULL,
    NULLIF(BTRIM(sie.sieinputuser::text), ''),
    iu.unama,
    NULLIF(BTRIM(sie.siemodifikasiuser::text), ''),
    mu.unama,
    jsonb_build_object('sie', to_jsonb(sie), 'sie_detail', to_jsonb(d)),
    'baseline-obt-sales-invoice-exchange-event-v1'
FROM myerpplus_landing.m5_sie sie
JOIN myerpplus_landing.m5_sie_detail d
  ON d.idsie::text = sie.sieid::text
LEFT JOIN myerpplus_landing.m1_branch b ON b.bkode = sie.siecabang
LEFT JOIN myerpplus_landing.m1_location l ON l.lkode = sie.sielokasi
LEFT JOIN myerpplus_landing.m1_contact c ON c.kid::text = sie.siekontak::text
LEFT JOIN myerpplus_landing.m0_user iu ON iu.userid = NULLIF(BTRIM(sie.sieinputuser::text), '')::bigint
LEFT JOIN myerpplus_landing.m0_user mu ON mu.userid = NULLIF(BTRIM(sie.siemodifikasiuser::text), '')::bigint
WHERE COALESCE(sie._cdc_deleted, false) = false
  AND COALESCE(d._cdc_deleted, false) = false;
