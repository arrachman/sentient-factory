INSERT INTO public.dim_branch (
    branch_code,
    branch_name,
    is_active,
    notes,
    source_payload,
    etl_batch_id,
    etl_loaded_at,
    etl_updated_at
)
SELECT
    bkode,
    bnama,
    baktif,
    bcatatan,
    _cdc_payload,
    'baseline-dim-branch-v1',
    clock_timestamp(),
    clock_timestamp()
FROM myerpplus_landing.m1_branch
WHERE COALESCE(_cdc_deleted, false) = false;

