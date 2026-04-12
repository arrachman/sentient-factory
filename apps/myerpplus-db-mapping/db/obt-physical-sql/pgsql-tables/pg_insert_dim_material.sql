INSERT INTO public.dim_material (material_code, material_name, is_active, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT mkode, mnama, maktif, mcatatan, _cdc_payload, 'baseline-dim-material-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_material
WHERE COALESCE(_cdc_deleted, false) = false;

