INSERT INTO public.dim_item_warehouse_stock (
    item_id,
    warehouse_code,
    item_code,
    item_name,
    item_type,
    item_category_code,
    default_uom_code,
    sales_uom_code,
    branch_code,
    branch_name,
    location_code,
    location_name,
    warehouse_name,
    supplier_id,
    is_active,
    active_at,
    current_stock,
    average_cost,
    source_payload,
    etl_batch_id,
    etl_loaded_at,
    etl_updated_at
)
SELECT
    isw.idbarang,
    isw.kgudang,
    i.bkode,
    i.bnama,
    i.btipe,
    i.bkategori,
    i.bsatuandefault,
    i.bsatuan,
    COALESCE(l.lcabang, i.bcabang),
    b.bnama,
    COALESCE(w.wlokasi, i.blokasi),
    l.lnama,
    w.wnama,
    i.bsuplier,
    i.baktif,
    i.baktiftgl,
    NULLIF(isw.stok, '')::numeric(30,6),
    NULLIF(i.bhppaverage, '')::numeric(30,6),
    jsonb_build_object(
        'item_stock_warehouse', isw._cdc_payload,
        'item', i._cdc_payload,
        'warehouse', w._cdc_payload,
        'location', l._cdc_payload,
        'branch', b._cdc_payload
    ),
    'baseline-dim-item-warehouse-stock-v1',
    clock_timestamp(),
    clock_timestamp()
FROM myerpplus_landing.m1_item_stock_warehouse isw
JOIN myerpplus_landing.m1_item i
    ON isw.idbarang = i.bid
LEFT JOIN myerpplus_landing.m1_warehouse w
    ON isw.kgudang = w.wkode
LEFT JOIN myerpplus_landing.m1_location l
    ON COALESCE(NULLIF(w.wlokasi, ''), NULLIF(i.blokasi, '')) = l.lkode
LEFT JOIN myerpplus_landing.m1_branch b
    ON COALESCE(NULLIF(l.lcabang, ''), NULLIF(i.bcabang, '')) = b.bkode
WHERE COALESCE(isw._cdc_deleted, false) = false
  AND COALESCE(i._cdc_deleted, false) = false;
