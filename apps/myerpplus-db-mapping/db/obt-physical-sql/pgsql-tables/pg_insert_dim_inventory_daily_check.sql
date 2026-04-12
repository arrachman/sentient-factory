INSERT INTO public.dim_inventory_daily_check (
    daily_check_key, doc_no, doc_date, branch_code, location_code, shift_code, item_id, item_name, check_category_id, check_status, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at
)
SELECT
    dc.dcid::text || ':' || COALESCE(ch.iddccheck::text, '') || ':' || COALESCE(dd.iddcdetail::text, ''),
    dc.dcnotransaksi,
    dc.dctgl,
    dc.dccabang,
    dc.dclokasi,
    dc.dcshift::text,
    NULL,
    dc.dcnamabarang,
    ch.idkategoricheck::text,
    ch.status::text,
    COALESCE(ch.catatan, dd.catatan),
    COALESCE(ch._cdc_payload, dd._cdc_payload, dc._cdc_payload),
    'baseline-inventory-daily-check-v1',
    clock_timestamp(),
    clock_timestamp()
FROM myerpplus_landing.m3_dc dc
LEFT JOIN myerpplus_landing.m3_dc_check ch ON dc.dcid = ch.iddc
LEFT JOIN myerpplus_landing.m3_dc_detail dd ON dc.dcid = dd.iddc
WHERE COALESCE(dc._cdc_deleted, false) = false;
