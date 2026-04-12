INSERT INTO public.dim_type_sa (type_sa_code, type_sa_name, account_code, is_active, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT tsakode, tsanama, tsarek, tsaaktif, tsacatatan, _cdc_payload, 'baseline-dim-type-sa-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_type_sa
WHERE COALESCE(_cdc_deleted, false) = false;

