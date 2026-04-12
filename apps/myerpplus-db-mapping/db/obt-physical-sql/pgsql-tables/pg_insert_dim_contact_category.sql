INSERT INTO public.dim_contact_category (category_code, category_name, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT cckode, ccnama, cccatatan, _cdc_payload, 'baseline-dim-contact-category-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_contact_category
WHERE COALESCE(_cdc_deleted, false) = false;

