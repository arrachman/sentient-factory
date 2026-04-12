INSERT INTO public.dim_class_product (class_product_code, class_product_name, is_active, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT cpkode, cpnama, cpaktif, cpcatatan, _cdc_payload, 'baseline-dim-class-product-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_class_product
WHERE COALESCE(_cdc_deleted, false) = false;
