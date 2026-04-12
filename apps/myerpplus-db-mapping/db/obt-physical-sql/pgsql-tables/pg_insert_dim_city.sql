INSERT INTO public.dim_city (city_code, city_name, province_code, country_code, is_active, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT ckode, cnama, cpropinsi, cnegara, caktif, ccatatan, _cdc_payload, 'baseline-dim-city-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_city
WHERE COALESCE(_cdc_deleted, false) = false;

