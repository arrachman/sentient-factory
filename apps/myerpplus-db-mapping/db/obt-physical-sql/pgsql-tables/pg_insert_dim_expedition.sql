INSERT INTO public.dim_expedition (expedition_code, expedition_name, city, contact_person, email, is_active, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT ekode, enama, ekota, ekontakperson, eemail, eaktif, ecatatan, _cdc_payload, 'baseline-dim-expedition-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_expedition
WHERE COALESCE(_cdc_deleted, false) = false;

