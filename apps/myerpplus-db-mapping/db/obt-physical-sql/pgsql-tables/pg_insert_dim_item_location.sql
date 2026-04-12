INSERT INTO public.dim_item_location (item_location_id, location_code, location_name, warehouse_code, etl_batch_id, etl_loaded_at, etl_updated_at, source_payload)
SELECT ilid, ilkode, ilnama, ilgudang, 'baseline-dim-item-location-v1', clock_timestamp(), clock_timestamp(), _cdc_payload
FROM myerpplus_landing.m1_item_location
WHERE COALESCE(_cdc_deleted, false) = false;

