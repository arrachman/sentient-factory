INSERT INTO public.dim_customer_category (category_code, category_name, sales_level, is_active, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT cckode, ccnama, cctingkatjual, ccaktif, cccatatan, _cdc_payload, 'baseline-dim-customer-category-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_customer_category
WHERE COALESCE(_cdc_deleted, false) = false;

