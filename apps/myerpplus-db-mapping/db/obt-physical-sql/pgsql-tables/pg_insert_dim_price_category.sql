INSERT INTO public.dim_price_category (price_category_code, price_category_name, is_active, notes, etl_batch_id, etl_loaded_at, etl_updated_at, source_payload)
SELECT pckode, pcnama, pcaktif, pccatatan, 'baseline-dim-price-category-v1', clock_timestamp(), clock_timestamp(), _cdc_payload
FROM myerpplus_landing.m1_price_category
WHERE COALESCE(_cdc_deleted, false) = false;

