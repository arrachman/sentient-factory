INSERT INTO public.dim_cost_center (
    cost_center_code,
    cost_center_name,
    division_code,
    account_code,
    is_active,
    notes,
    source_payload,
    etl_batch_id,
    etl_loaded_at,
    etl_updated_at
)
SELECT
    cckode,
    ccnama,
    ccdivisi,
    ccakun,
    ccaktif,
    cccatatan,
    _cdc_payload,
    'baseline-dim-cost-center-v1',
    clock_timestamp(),
    clock_timestamp()
FROM myerpplus_landing.m1_cost_center
WHERE COALESCE(_cdc_deleted, false) = false;
