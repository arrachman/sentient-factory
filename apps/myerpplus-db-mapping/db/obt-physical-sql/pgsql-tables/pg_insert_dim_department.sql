INSERT INTO public.dim_department (department_code, department_name, division_code, subdivision_code, is_active, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT dpkode, dpnama, dpdivisi, dpsubdivisi, dpaktif, dpcatatan, _cdc_payload, 'baseline-dim-department-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_department
WHERE COALESCE(_cdc_deleted, false) = false;

