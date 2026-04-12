INSERT INTO public.dim_country (country_code, country_name, is_active, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT ckode, cnama, caktif, ccatatan, _cdc_payload, 'baseline-dim-country-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_country
WHERE COALESCE(_cdc_deleted, false) = false;

