TRUNCATE TABLE public.obt_sales_closing_snapshot RESTART IDENTITY;

INSERT INTO public.obt_sales_closing_snapshot (
    obt_name, source_module, source_doc_type, source_header_id, source_detail_id, source_allocation_id,
    doc_no, doc_date, doc_status_code, doc_status_name, branch_code, branch_name, location_code, location_name,
    contact_id, contact_code, contact_name, item_id, item_code, item_name, uom_code, upstream_doc_no, downstream_doc_no,
    lineage_path, qty, amount, currency_code, exchange_rate, input_user_id, input_user_name, modified_user_id,
    modified_user_name, source_payload, etl_batch_id
)
SELECT
    'obt_sales_closing_snapshot',
    'm5',
    'CL',
    cl.clid::text,
    NULL,
    NULL,
    cl.clnotransaksi::text,
    cl.cltgl::timestamptz,
    cl.clstatus::text,
    NULL,
    cl.clcabang::text,
    b.bnama::text,
    cl.cllokasi::text,
    l.lnama::text,
    cl.clcustomer::text,
    c.kkode::text,
    c.knama::text,
    NULL, NULL, NULL, NULL,
    NULL, NULL,
    'CL',
    NULL,
    NULL,
    NULL,
    NULL,
    NULLIF(BTRIM(cl.clinputuser::text), ''),
    iu.unama,
    NULLIF(BTRIM(cl.clmodifikasiuser::text), ''),
    mu.unama,
    jsonb_build_object('cl', to_jsonb(cl)),
    'baseline-obt-sales-closing-snapshot-v1'
FROM myerpplus_landing.m5_cl cl
LEFT JOIN myerpplus_landing.m1_branch b ON b.bkode = cl.clcabang
LEFT JOIN myerpplus_landing.m1_location l ON l.lkode = cl.cllokasi
LEFT JOIN myerpplus_landing.m1_contact c ON c.kid::text = cl.clcustomer::text
LEFT JOIN myerpplus_landing.m0_user iu ON iu.userid = NULLIF(BTRIM(cl.clinputuser::text), '')::bigint
LEFT JOIN myerpplus_landing.m0_user mu ON mu.userid = NULLIF(BTRIM(cl.clmodifikasiuser::text), '')::bigint
WHERE COALESCE(cl._cdc_deleted, false) = false;
