INSERT INTO public.dim_inventory_attachment (
    attachment_key, source_code, source_transaction_id, file_name, input_at, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at
)
SELECT
    fsumber || ':' || fidtransaksi || ':' || fnamafile || ':' || COALESCE(finputtgl::text, ''),
    fsumber,
    fidtransaksi,
    fnamafile,
    finputtgl,
    _cdc_payload,
    'baseline-inventory-attachment-v1',
    clock_timestamp(),
    clock_timestamp()
FROM myerpplus_landing.m3_files
WHERE COALESCE(_cdc_deleted, false) = false;
