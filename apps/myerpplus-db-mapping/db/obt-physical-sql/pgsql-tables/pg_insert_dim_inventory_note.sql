INSERT INTO public.dim_inventory_note (
    note_id, source_code, source_transaction_id, note_code, note_text, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at
)
SELECT
    nid::text,
    sumber,
    idtransaksi,
    kode,
    catatan,
    _cdc_payload,
    'baseline-inventory-note-v1',
    clock_timestamp(),
    clock_timestamp()
FROM myerpplus_landing.m3_notes
WHERE COALESCE(_cdc_deleted, false) = false;
