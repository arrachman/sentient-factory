INSERT INTO public.dim_warehouse (
    warehouse_code,
    warehouse_name,
    division_code,
    division_name,
    location_code,
    location_name,
    branch_code,
    branch_name,
    is_active,
    booking_stock_enabled,
    notes,
    source_payload,
    etl_batch_id,
    etl_loaded_at,
    etl_updated_at
)
SELECT
    w.wkode,
    w.wnama,
    w.wdivisi,
    d.dnama,
    w.wlokasi,
    l.lnama,
    l.lcabang,
    b.bnama,
    w.waktif,
    NULLIF(w.wbookingstok, '')::bigint,
    w.wketerangan,
    jsonb_build_object(
        'warehouse', w._cdc_payload,
        'division', d._cdc_payload,
        'location', l._cdc_payload,
        'branch', b._cdc_payload
    ),
    'baseline-dim-warehouse-v1',
    clock_timestamp(),
    clock_timestamp()
FROM myerpplus_landing.m1_warehouse w
LEFT JOIN myerpplus_landing.m1_division d
    ON w.wdivisi = d.dkode
LEFT JOIN myerpplus_landing.m1_location l
    ON w.wlokasi = l.lkode
LEFT JOIN myerpplus_landing.m1_branch b
    ON l.lcabang = b.bkode
WHERE COALESCE(w._cdc_deleted, false) = false;

