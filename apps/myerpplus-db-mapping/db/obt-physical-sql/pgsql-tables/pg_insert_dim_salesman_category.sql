INSERT INTO public.dim_salesman_category (category_code, category_name, area_code, is_active, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT sckode, scnama, scarea, scaktif, sccatatan, _cdc_payload, 'baseline-dim-salesman-category-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_salesman_category
WHERE COALESCE(_cdc_deleted, false) = false;

