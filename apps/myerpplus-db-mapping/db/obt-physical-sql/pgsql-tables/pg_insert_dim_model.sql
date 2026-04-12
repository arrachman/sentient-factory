INSERT INTO public.dim_model (model_code, model_name, is_active, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT mkode, mnama, maktif, mcatatan, _cdc_payload, 'baseline-dim-model-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_model
WHERE COALESCE(_cdc_deleted, false) = false;

