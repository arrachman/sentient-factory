INSERT INTO public.dim_supplier_category (category_code, category_name, is_active, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT sckode, scnama, scaktif, sccatatan, _cdc_payload, 'baseline-dim-supplier-category-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_supplier_category
WHERE COALESCE(_cdc_deleted, false) = false;

