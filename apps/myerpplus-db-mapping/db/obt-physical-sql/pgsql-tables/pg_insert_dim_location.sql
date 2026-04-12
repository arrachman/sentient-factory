INSERT INTO public.dim_location (
    location_code,
    location_name,
    branch_code,
    branch_name,
    pos_category_code,
    is_active,
    notes,
    source_payload,
    etl_batch_id,
    etl_loaded_at,
    etl_updated_at
)
SELECT
    l.lkode,
    l.lnama,
    l.lcabang,
    b.bnama,
    l.lkategoripos,
    l.laktif,
    l.lcatatan,
    jsonb_build_object('location', l._cdc_payload, 'branch', b._cdc_payload),
    'baseline-dim-location-v1',
    clock_timestamp(),
    clock_timestamp()
FROM myerpplus_landing.m1_location l
LEFT JOIN myerpplus_landing.m1_branch b
    ON l.lcabang = b.bkode
WHERE COALESCE(l._cdc_deleted, false) = false;

