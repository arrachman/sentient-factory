INSERT INTO public.obt_inventory_request_event (
    request_event_key, source_doc_type, source_header_id, doc_no, doc_date, branch_code, location_code, warehouse_from_code, warehouse_to_code, description, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at
)
SELECT 'MR:' || mrid::text, 'MR', mrid::text, mrnotransaksi, mrtgl, mrcabang, mrlokasi, mrgudangasal, mrgudangtujuan, mruraian, mrcatatan, _cdc_payload, 'baseline-inventory-request-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m3_mr WHERE COALESCE(_cdc_deleted, false) = false
UNION ALL
SELECT 'RS:' || rsid::text, 'RS', rsid::text, rsnotransaksi, rstgl, rscabang, rslokasi, rsgudangasal, rsgudangtujuan, rsuraian, rscatatan, _cdc_payload, 'baseline-inventory-request-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m3_rs WHERE COALESCE(_cdc_deleted, false) = false;
