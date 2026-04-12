INSERT INTO public.dim_subdepartment (subdepartment_code, subdepartment_name, department_code, division_code, subdivision_code, is_active, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT sdpkode, sdpnama, sdpdepartemen, sdpdivisi, sdpsubdivisi, sdpaktif, sdpcatatan, _cdc_payload, 'baseline-dim-subdepartment-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_subdepartment
WHERE COALESCE(_cdc_deleted, false) = false;

