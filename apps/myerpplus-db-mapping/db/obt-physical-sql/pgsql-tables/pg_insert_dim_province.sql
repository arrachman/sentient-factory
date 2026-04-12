INSERT INTO public.dim_province (province_code, province_name, country_code, is_active, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT pkode, pnama, pnegara, paktif, pcatatan, _cdc_payload, 'baseline-dim-province-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_province
WHERE COALESCE(_cdc_deleted, false) = false;

