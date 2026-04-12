INSERT INTO public.dim_division (
    division_code,
    division_name,
    is_active,
    notes,
    source_payload,
    etl_batch_id,
    etl_loaded_at,
    etl_updated_at
)
SELECT
    dkode,
    dnama,
    daktif,
    dcatatan,
    _cdc_payload,
    'baseline-dim-division-v1',
    clock_timestamp(),
    clock_timestamp()
FROM myerpplus_landing.m1_division
WHERE COALESCE(_cdc_deleted, false) = false;

