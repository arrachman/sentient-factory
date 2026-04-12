INSERT INTO public.dim_inventory_rw (
    rw_key, doc_no, doc_date, branch_code, location_code, vehicle_no, driver_name, gross_weight, tare_weight, net_weight, price, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at
)
SELECT
    rwid::text,
    rwnotransaksi,
    rwtgl,
    rwcabang,
    rwlokasi,
    rwnopol,
    rwsopir,
    NULL,
    NULL,
    NULL,
    NULL,
    COALESCE(rwcatatan, rwuraian),
    _cdc_payload,
    'baseline-inventory-rw-v1',
    clock_timestamp(),
    clock_timestamp()
FROM myerpplus_landing.m3_rw
WHERE COALESCE(_cdc_deleted, false) = false;
