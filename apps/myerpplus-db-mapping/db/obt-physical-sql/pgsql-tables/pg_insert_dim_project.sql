INSERT INTO public.dim_project (
    project_code,
    project_name,
    category_code,
    contact_id,
    project_manager_id,
    division_code,
    contract_no,
    contract_value,
    is_active,
    is_finished,
    notes,
    source_payload,
    etl_batch_id,
    etl_loaded_at,
    etl_updated_at
)
SELECT
    pkode,
    pnama,
    pkategori,
    pkontak,
    ppimpinanproyek,
    pdivisi,
    pnokontrak,
    NULLIF(BTRIM(CAST(pnilaikontrak AS text)), '')::numeric(30,6),
    paktif,
    NULLIF(BTRIM(CAST(pselesai AS text)), '')::numeric(30,6)::bigint,
    pketerangan,
    _cdc_payload,
    'baseline-dim-project-v1',
    clock_timestamp(),
    clock_timestamp()
FROM myerpplus_landing.m1_project
WHERE COALESCE(_cdc_deleted, false) = false;
