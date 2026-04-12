INSERT INTO public.dim_transaction_note (source_code, note_code, notes, is_active, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT tnsumber, tnkode, tncatatan, tnaktif, _cdc_payload, 'baseline-dim-transaction-note-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_transaction_note
WHERE COALESCE(_cdc_deleted, false) = false
ON CONFLICT (source_code, note_code) DO UPDATE SET
    notes = EXCLUDED.notes,
    is_active = EXCLUDED.is_active,
    source_payload = EXCLUDED.source_payload,
    etl_batch_id = EXCLUDED.etl_batch_id,
    etl_updated_at = clock_timestamp();
