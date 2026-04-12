TRUNCATE TABLE public.obt_bom_route_snapshot;

INSERT INTO public.obt_bom_route_snapshot (
    obt_name, source_module, source_doc_type, source_header_id, source_detail_id,
    doc_no, doc_date, branch_code, location_code, item_id, qty, amount,
    currency_code, input_user_id, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at
)
SELECT
    'obt_bom_route_snapshot',
    'm6',
    'BOM_IN',
    b.bomid::text,
    bi.idbomin::text,
    COALESCE(b.bomnotransaksi, b.bomautonotransaksi),
    b.bomtgl,
    COALESCE(bi.cabang, b.bomcabang),
    b.bomlokasi,
    bi.idbarang::text,
    COALESCE(bi.jmlbarang, bi.jml),
    CASE
        WHEN ABS(COALESCE(bi.hpp, bi.harga, 0) * COALESCE(bi.jmlbarang, bi.jml, 0)) < 100000000000000
            THEN COALESCE(bi.hpp, bi.harga, 0) * COALESCE(bi.jmlbarang, bi.jml, 0)
        ELSE NULL
    END,
    b.bommatauang,
    NULL,
    COALESCE(bi._cdc_payload, b._cdc_payload),
    'baseline-m6-bom-route-v1',
    clock_timestamp(),
    clock_timestamp()
FROM myerpplus_landing.m6_bom b
JOIN myerpplus_landing.m6_bom_in bi ON b.bomid = bi.idbom
WHERE COALESCE(b._cdc_deleted, false) = false AND COALESCE(bi._cdc_deleted, false) = false
UNION ALL
SELECT
    'obt_bom_route_snapshot',
    'm6',
    'BOM_OUT',
    b.bomid::text,
    bo.idbomout::text,
    COALESCE(b.bomnotransaksi, b.bomautonotransaksi),
    b.bomtgl,
    COALESCE(bo.cabang, b.bomcabang),
    b.bomlokasi,
    bo.idbarang::text,
    COALESCE(bo.jmlbarang, bo.jml),
    CASE
        WHEN ABS(COALESCE(bo.hpp, bo.harga, 0) * COALESCE(bo.jmlbarang, bo.jml, 0)) < 100000000000000
            THEN COALESCE(bo.hpp, bo.harga, 0) * COALESCE(bo.jmlbarang, bo.jml, 0)
        ELSE NULL
    END,
    b.bommatauang,
    NULL,
    COALESCE(bo._cdc_payload, b._cdc_payload),
    'baseline-m6-bom-route-v1',
    clock_timestamp(),
    clock_timestamp()
FROM myerpplus_landing.m6_bom b
JOIN myerpplus_landing.m6_bom_out bo ON b.bomid = bo.idbom
WHERE COALESCE(b._cdc_deleted, false) = false AND COALESCE(bo._cdc_deleted, false) = false;
