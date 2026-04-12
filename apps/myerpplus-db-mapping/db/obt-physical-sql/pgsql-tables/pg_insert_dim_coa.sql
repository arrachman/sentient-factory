INSERT INTO public.dim_coa (
    account_code,
    account_name,
    account_type,
    debit_credit_flag,
    parent_account_code,
    branch_code,
    location_code,
    division_code,
    is_active,
    source_payload,
    etl_batch_id,
    etl_loaded_at,
    etl_updated_at
)
SELECT
    cnomor,
    cnama,
    ctipe,
    cdc,
    cparent,
    ccabang,
    clokasi,
    cdivisi,
    caktif,
    _cdc_payload,
    'baseline-dim-coa-v1',
    clock_timestamp(),
    clock_timestamp()
FROM myerpplus_landing.m1_coa
WHERE COALESCE(_cdc_deleted, false) = false;

