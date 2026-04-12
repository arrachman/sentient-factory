TRUNCATE TABLE public.obt_sales_forecast_event RESTART IDENTITY;

INSERT INTO public.obt_sales_forecast_event (
    obt_name, source_module, source_doc_type, source_header_id, source_detail_id, source_allocation_id,
    doc_no, doc_date, doc_status_code, doc_status_name, branch_code, branch_name, location_code, location_name,
    contact_id, contact_code, contact_name, item_id, item_code, item_name, uom_code, upstream_doc_no, downstream_doc_no,
    lineage_path, qty, amount, currency_code, exchange_rate, input_user_id, input_user_name, modified_user_id,
    modified_user_name, source_payload, etl_batch_id
)
SELECT
    'obt_sales_forecast_event',
    'm5',
    'SF_DETAIL',
    sf.sfid::text,
    d.idsfdetail::text,
    NULL,
    sf.sfnotransaksi::text,
    sf.sftgl::timestamptz,
    NULL,
    NULL,
    sf.sfcabang::text,
    b.bnama::text,
    sf.sflokasi::text,
    l.lnama::text,
    sf.sfcustomer::text,
    c.kkode::text,
    c.knama::text,
    d.idbarang::text,
    i.bkode::text,
    COALESCE(NULLIF(d.namabarang, ''), i.bnama)::text,
    i.bsatuan::text,
    NULL, NULL,
    'SF',
    COALESCE(NULLIF(d.jml::text, '')::numeric(20,6), 0::numeric(20,6)),
    COALESCE(
        NULLIF(d.harga::text, '')::numeric(20,6) * COALESCE(NULLIF(d.jml::text, '')::numeric(20,6), 0::numeric(20,6)),
        NULL
    ),
    NULL,
    NULL,
    NULLIF(BTRIM(sf.sfinputuser::text), ''),
    iu.unama,
    NULL,
    NULL,
    jsonb_build_object('sf', to_jsonb(sf), 'sf_detail', to_jsonb(d), 'item', to_jsonb(i)),
    'baseline-obt-sales-forecast-event-v1'
FROM myerpplus_landing.m5_sf sf
JOIN myerpplus_landing.m5_sf_detail d
  ON d.idsf::text = sf.sfid::text
LEFT JOIN myerpplus_landing.m1_branch b ON b.bkode = sf.sfcabang
LEFT JOIN myerpplus_landing.m1_location l ON l.lkode = sf.sflokasi
LEFT JOIN myerpplus_landing.m1_contact c ON c.kid::text = sf.sfcustomer::text
LEFT JOIN myerpplus_landing.m1_item i ON i.bid::text = d.idbarang::text
LEFT JOIN myerpplus_landing.m0_user iu ON iu.userid = NULLIF(BTRIM(sf.sfinputuser::text), '')::bigint
WHERE COALESCE(sf._cdc_deleted, false) = false
  AND COALESCE(d._cdc_deleted, false) = false;
