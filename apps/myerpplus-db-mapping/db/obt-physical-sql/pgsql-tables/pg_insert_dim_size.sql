INSERT INTO public.dim_size (size_code, size_name, is_active, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT skode, snama, saktif, scatatan, _cdc_payload, 'baseline-dim-size-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_size
WHERE COALESCE(_cdc_deleted, false) = false;

