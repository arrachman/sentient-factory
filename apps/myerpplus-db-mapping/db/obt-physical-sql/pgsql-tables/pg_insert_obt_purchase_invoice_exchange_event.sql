TRUNCATE TABLE public.obt_purchase_invoice_exchange_event RESTART IDENTITY;

INSERT INTO public.obt_purchase_invoice_exchange_event (
    obt_name, source_module, source_doc_type, source_header_id, source_detail_id, source_allocation_id,
    doc_no, doc_date, doc_status_code, doc_status_name, branch_code, branch_name, location_code, location_name,
    contact_id, contact_code, contact_name, item_id, item_code, item_name, uom_code, upstream_doc_no, downstream_doc_no,
    lineage_path, qty, amount, currency_code, exchange_rate, input_user_id, input_user_name, modified_user_id,
    modified_user_name, source_payload, etl_batch_id
)
SELECT
    'obt_purchase_invoice_exchange_event',
    'm4',
    'PIE_DETAIL',
    pie.pieid::text,
    d.idpiedetail::text,
    d.idtransaksi::text,
    pie.pienotransaksi::text,
    pie.pietgl::timestamptz,
    pie.piestatus::text,
    NULL,
    pie.piecabang::text,
    b.bnama::text,
    pie.pielokasi::text,
    l.lnama::text,
    pie.piekontak::text,
    c.kkode::text,
    c.knama::text,
    NULL,
    NULL,
    NULL,
    NULL,
    d.idtransaksi::text,
    NULL,
    CONCAT_WS(' -> ', d.sumber, 'PIE'),
    NULL,
    NULL,
    NULL,
    NULL,
    NULLIF(BTRIM(pie.pieinputuser::text), ''),
    iu.unama,
    NULLIF(BTRIM(pie.piemodifikasiuser::text), ''),
    mu.unama,
    jsonb_build_object('pie', to_jsonb(pie), 'pie_detail', to_jsonb(d)),
    'baseline-obt-purchase-invoice-exchange-event-v1'
FROM myerpplus_landing.m4_pie pie
JOIN myerpplus_landing.m4_pie_detail d
  ON d.idpie::text = pie.pieid::text
LEFT JOIN myerpplus_landing.m1_branch b ON b.bkode = pie.piecabang
LEFT JOIN myerpplus_landing.m1_location l ON l.lkode = pie.pielokasi
LEFT JOIN myerpplus_landing.m1_contact c ON c.kid::text = pie.piekontak::text
LEFT JOIN myerpplus_landing.m0_user iu ON iu.userid = NULLIF(BTRIM(pie.pieinputuser::text), '')::bigint
LEFT JOIN myerpplus_landing.m0_user mu ON mu.userid = NULLIF(BTRIM(pie.piemodifikasiuser::text), '')::bigint
WHERE COALESCE(pie._cdc_deleted, false) = false
  AND COALESCE(d._cdc_deleted, false) = false;
