INSERT INTO public.dim_bank (bank_code, bank_name, city, is_active, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT bkode, bnama, bkota, baktif, bcatatan, _cdc_payload, 'baseline-dim-bank-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_bank
WHERE COALESCE(_cdc_deleted, false) = false;

