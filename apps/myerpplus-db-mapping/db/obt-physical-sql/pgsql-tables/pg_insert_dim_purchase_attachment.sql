INSERT INTO public.dim_purchase_attachment (
    source_code,
    source_header_id,
    file_name,
    file_date,
    notes,
    file_size_bytes,
    input_user_id,
    input_user_name,
    input_at,
    source_payload,
    etl_batch_id,
    etl_loaded_at,
    etl_updated_at
)
SELECT
    f.fsumber,
    f.fidtransaksi::text,
    f.fnamafile,
    f.ftanggal::timestamp without time zone,
    f.fcatatan,
    NULLIF(BTRIM(f.fukuranfile::text), '')::bigint,
    NULLIF(BTRIM(f.finputuser::text), ''),
    u.unama,
    f.finputtgl::timestamp without time zone,
    f._cdc_payload,
    'baseline-dim-purchase-attachment-v1',
    clock_timestamp(),
    clock_timestamp()
FROM myerpplus_landing.m4_files f
LEFT JOIN myerpplus_landing.m0_user u
    ON u.userid = NULLIF(BTRIM(f.finputuser::text), '')::bigint
WHERE COALESCE(f._cdc_deleted, false) = false
ON CONFLICT (source_code, source_header_id, file_name, file_date) DO UPDATE SET
    notes = EXCLUDED.notes,
    file_size_bytes = EXCLUDED.file_size_bytes,
    input_user_id = EXCLUDED.input_user_id,
    input_user_name = EXCLUDED.input_user_name,
    input_at = EXCLUDED.input_at,
    source_payload = EXCLUDED.source_payload,
    etl_batch_id = EXCLUDED.etl_batch_id,
    etl_updated_at = clock_timestamp();
