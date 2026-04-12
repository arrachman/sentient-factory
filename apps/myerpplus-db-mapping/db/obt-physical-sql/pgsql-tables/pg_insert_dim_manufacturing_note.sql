TRUNCATE TABLE public.dim_manufacturing_note;

INSERT INTO public.dim_manufacturing_note (
    note_key, source_doc_type, source_header_id, note_text, note_date, input_user_id, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at
)
SELECT
    nid::text,
    nsumber,
    nidtransaksi::text,
    ncatatan,
    ninputtgl,
    ninputuser,
    _cdc_payload,
    'baseline-m6-note-v1',
    clock_timestamp(),
    clock_timestamp()
FROM myerpplus_landing.m6_notes
WHERE COALESCE(_cdc_deleted, false) = false;
