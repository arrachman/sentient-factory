INSERT INTO public.dim_item_type (item_type_code, item_type_name, is_active, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT itkode, itnama, itaktif, itcatatan, _cdc_payload, 'baseline-dim-item-type-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_item_type
WHERE COALESCE(_cdc_deleted, false) = false;

