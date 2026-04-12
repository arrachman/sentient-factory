INSERT INTO public.dim_transaction_note_detail (source_code, note_code, note_detail, is_active, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT tndsumber, tndkode, tndcatatan, tndaktif, _cdc_payload, 'baseline-dim-transaction-note-detail-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_transaction_note_detail
WHERE COALESCE(_cdc_deleted, false) = false
ON CONFLICT (source_code, note_code) DO UPDATE SET
    note_detail = EXCLUDED.note_detail,
    is_active = EXCLUDED.is_active,
    source_payload = EXCLUDED.source_payload,
    etl_batch_id = EXCLUDED.etl_batch_id,
    etl_updated_at = clock_timestamp();
