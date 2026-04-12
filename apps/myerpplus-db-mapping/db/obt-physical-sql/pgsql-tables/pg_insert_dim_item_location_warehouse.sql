INSERT INTO public.dim_item_location_warehouse (item_id, warehouse_code, item_location_id, item_code, location_code, location_name, etl_batch_id, etl_loaded_at, etl_updated_at, source_payload)
SELECT blgidbarang, blggudang, blgidlokasi, blgkodebarang, blgkodelokasi, blgnamalokasi,
       'baseline-dim-item-location-warehouse-v1', clock_timestamp(), clock_timestamp(), _cdc_payload
FROM myerpplus_landing.m1_item_location_warehouse
WHERE COALESCE(_cdc_deleted, false) = false;

