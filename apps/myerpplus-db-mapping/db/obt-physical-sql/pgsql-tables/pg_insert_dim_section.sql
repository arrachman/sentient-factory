INSERT INTO public.dim_section (section_code, section_name, is_active, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT skode, snama, saktif, scatatan, _cdc_payload, 'baseline-dim-section-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_section
WHERE COALESCE(_cdc_deleted, false) = false;

