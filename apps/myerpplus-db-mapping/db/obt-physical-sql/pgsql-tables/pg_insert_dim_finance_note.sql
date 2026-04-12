INSERT INTO public.dim_finance_note (
    note_id,
    source_code,
    source_header_id,
    notes,
    input_user_id,
    input_user_name,
    input_at,
    modified_user_id,
    modified_user_name,
    modified_at,
    source_payload,
    etl_batch_id,
    etl_loaded_at,
    etl_updated_at
)
SELECT
    n.nid::text AS note_id,
    n.nsumber AS source_code,
    n.nidtransaksi::text AS source_header_id,
    n.ncatatan AS notes,
    NULLIF(BTRIM(n.ninputuser::text), '') AS input_user_id,
    iu.unama AS input_user_name,
    n.ninputtgl::timestamp without time zone AS input_at,
    NULLIF(BTRIM(n.nmodifikasiuser::text), '') AS modified_user_id,
    mu.unama AS modified_user_name,
    n.nmodifikasitgl::timestamp without time zone AS modified_at,
    n._cdc_payload AS source_payload,
    'baseline-dim-finance-note-v1' AS etl_batch_id,
    clock_timestamp() AS etl_loaded_at,
    clock_timestamp() AS etl_updated_at
FROM myerpplus_landing.m2_notes n
LEFT JOIN myerpplus_landing.m0_user iu
    ON iu.userid = NULLIF(BTRIM(n.ninputuser::text), '')::bigint
LEFT JOIN myerpplus_landing.m0_user mu
    ON mu.userid = NULLIF(BTRIM(n.nmodifikasiuser::text), '')::bigint
WHERE COALESCE(n._cdc_deleted, false) = false
ON CONFLICT (note_id) DO UPDATE SET
    source_code = EXCLUDED.source_code,
    source_header_id = EXCLUDED.source_header_id,
    notes = EXCLUDED.notes,
    input_user_id = EXCLUDED.input_user_id,
    input_user_name = EXCLUDED.input_user_name,
    input_at = EXCLUDED.input_at,
    modified_user_id = EXCLUDED.modified_user_id,
    modified_user_name = EXCLUDED.modified_user_name,
    modified_at = EXCLUDED.modified_at,
    source_payload = EXCLUDED.source_payload,
    etl_batch_id = EXCLUDED.etl_batch_id,
    etl_updated_at = clock_timestamp();
