INSERT INTO public.dim_sales_note (
    note_id, source_code, source_header_id, notes, input_user_id, input_user_name, input_at,
    modified_user_id, modified_user_name, modified_at, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at
)
SELECT
    n.nid::text,
    n.nsumber,
    n.nidtransaksi::text,
    n.ncatatan,
    NULLIF(BTRIM(n.ninputuser::text), ''),
    iu.unama,
    n.ninputtgl::timestamp without time zone,
    NULLIF(BTRIM(n.nmodifikasiuser::text), ''),
    mu.unama,
    n.nmodifikasitgl::timestamp without time zone,
    n._cdc_payload,
    'baseline-dim-sales-note-v1',
    clock_timestamp(),
    clock_timestamp()
FROM myerpplus_landing.m5_notes n
LEFT JOIN myerpplus_landing.m0_user iu ON iu.userid = NULLIF(BTRIM(n.ninputuser::text), '')::bigint
LEFT JOIN myerpplus_landing.m0_user mu ON mu.userid = NULLIF(BTRIM(n.nmodifikasiuser::text), '')::bigint
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
