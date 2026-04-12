TRUNCATE TABLE public.dim_asset_attachment;

INSERT INTO public.dim_asset_attachment (
    attachment_key, source_doc_type, source_header_id, file_name, file_date, note_text, input_user_id, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at
)
SELECT
    COALESCE(fsumber, '') || ':' || COALESCE(fidtransaksi::text, '') || ':' || COALESCE(fnamafile, ''),
    fsumber,
    fidtransaksi::text,
    fnamafile,
    COALESCE(ftanggal, finputtgl),
    fcatatan,
    finputuser,
    _cdc_payload,
    'baseline-m7-file-v1',
    clock_timestamp(),
    clock_timestamp()
FROM myerpplus_landing.m7_files
WHERE COALESCE(_cdc_deleted, false) = false;
