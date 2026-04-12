INSERT INTO public.dim_finance_attachment (
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
    f.fsumber AS source_code,
    f.fidtransaksi::text AS source_header_id,
    f.fnamafile AS file_name,
    f.ftanggal::timestamp without time zone AS file_date,
    f.fcatatan AS notes,
    NULLIF(BTRIM(f.fukuranfile::text), '')::bigint AS file_size_bytes,
    NULLIF(BTRIM(f.finputuser::text), '') AS input_user_id,
    u.unama AS input_user_name,
    f.finputtgl::timestamp without time zone AS input_at,
    f._cdc_payload AS source_payload,
    'baseline-dim-finance-attachment-v1' AS etl_batch_id,
    clock_timestamp() AS etl_loaded_at,
    clock_timestamp() AS etl_updated_at
FROM myerpplus_landing.m2_files f
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
