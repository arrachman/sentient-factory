TRUNCATE TABLE public.obt_manufacturing_execution;

INSERT INTO public.obt_manufacturing_execution (
    obt_name, source_module, source_doc_type, source_header_id, source_detail_id,
    doc_no, doc_date, branch_code, location_code, item_id, qty, amount, currency_code,
    downstream_doc_no, input_user_id, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at
)
SELECT
    'obt_manufacturing_execution','m6','PD_IN',p.pdid::text,pdi.idpdin::text,
    COALESCE(p.pdnotransaksi, p.pdautonotransaksi), p.pdtgl, COALESCE(pdi.cabang, p.pdcabang), p.pdlokasi,
    pdi.idbarang::text, COALESCE(pdi.jmlbarang, pdi.jml),
    CASE
        WHEN ABS(COALESCE(pdi.hpp, pdi.harga, 0) * COALESCE(pdi.jmlbarang, pdi.jml, 0)) < 100000000000000
            THEN COALESCE(pdi.hpp, pdi.harga, 0) * COALESCE(pdi.jmlbarang, pdi.jml, 0)
        ELSE NULL
    END,
    p.pdmatauang,
    NULL, NULL, COALESCE(pdi._cdc_payload, p._cdc_payload), 'baseline-m6-execution-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m6_pd p
JOIN myerpplus_landing.m6_pd_in pdi ON p.pdid = pdi.idpd
WHERE COALESCE(p._cdc_deleted, false) = false AND COALESCE(pdi._cdc_deleted, false) = false
UNION ALL
SELECT
    'obt_manufacturing_execution','m6','PD_OUT',p.pdid::text,pdo.idpdout::text,
    COALESCE(p.pdnotransaksi, p.pdautonotransaksi), p.pdtgl, COALESCE(pdo.cabang, p.pdcabang), p.pdlokasi,
    pdo.idbarang::text, COALESCE(pdo.jmlbarang, pdo.jml),
    CASE
        WHEN ABS(COALESCE(pdo.hpp, pdo.harga, 0) * COALESCE(pdo.jmlbarang, pdo.jml, 0)) < 100000000000000
            THEN COALESCE(pdo.hpp, pdo.harga, 0) * COALESCE(pdo.jmlbarang, pdo.jml, 0)
        ELSE NULL
    END,
    p.pdmatauang,
    NULL, NULL, COALESCE(pdo._cdc_payload, p._cdc_payload), 'baseline-m6-execution-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m6_pd p
JOIN myerpplus_landing.m6_pd_out pdo ON p.pdid = pdo.idpd
WHERE COALESCE(p._cdc_deleted, false) = false AND COALESCE(pdo._cdc_deleted, false) = false
UNION ALL
SELECT
    'obt_manufacturing_execution','m6','WO_IN',w.woid::text,wi.idwoin::text,
    COALESCE(w.wonotransaksi, w.woautonotransaksi), w.wotgl, COALESCE(wi.cabang, w.wocabang), w.wolokasi,
    wi.idbarang::text, COALESCE(wi.jmlbarang, wi.jml),
    CASE
        WHEN ABS(COALESCE(wi.hpp, wi.harga, 0) * COALESCE(wi.jmlbarang, wi.jml, 0)) < 100000000000000
            THEN COALESCE(wi.hpp, wi.harga, 0) * COALESCE(wi.jmlbarang, wi.jml, 0)
        ELSE NULL
    END,
    w.womatauang,
    NULL, NULL, COALESCE(wi._cdc_payload, w._cdc_payload), 'baseline-m6-execution-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m6_wo w
JOIN myerpplus_landing.m6_wo_in wi ON w.woid = wi.idwo
WHERE COALESCE(w._cdc_deleted, false) = false AND COALESCE(wi._cdc_deleted, false) = false
UNION ALL
SELECT
    'obt_manufacturing_execution','m6','WO_OUT',w.woid::text,wo.idwoout::text,
    COALESCE(w.wonotransaksi, w.woautonotransaksi), w.wotgl, COALESCE(wo.cabang, w.wocabang), w.wolokasi,
    wo.idbarang::text, COALESCE(wo.jmlbarang, wo.jml),
    CASE
        WHEN ABS(COALESCE(wo.hpp, wo.harga, 0) * COALESCE(wo.jmlbarang, wo.jml, 0)) < 100000000000000
            THEN COALESCE(wo.hpp, wo.harga, 0) * COALESCE(wo.jmlbarang, wo.jml, 0)
        ELSE NULL
    END,
    w.womatauang,
    NULL, NULL, COALESCE(wo._cdc_payload, w._cdc_payload), 'baseline-m6-execution-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m6_wo w
JOIN myerpplus_landing.m6_wo_out wo ON w.woid = wo.idwo
WHERE COALESCE(w._cdc_deleted, false) = false AND COALESCE(wo._cdc_deleted, false) = false
UNION ALL
SELECT
    'obt_manufacturing_execution','m6','WO_ACTIVITY',w.woid::text,wa.idwoactivity::text,
    COALESCE(w.wonotransaksi, w.woautonotransaksi), w.wotgl, w.wocabang, w.wolokasi,
    NULL, NULL, NULL, w.womatauang,
    wa.namaaktivitas, NULL, COALESCE(wa._cdc_payload, w._cdc_payload), 'baseline-m6-execution-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m6_wo w
JOIN myerpplus_landing.m6_wo_activity wa ON w.woid = wa.idwo
WHERE COALESCE(w._cdc_deleted, false) = false AND COALESCE(wa._cdc_deleted, false) = false
UNION ALL
SELECT
    'obt_manufacturing_execution','m6','WO_ROUTE_CARD',w.woid::text,wrc.idworoutecard::text,
    COALESCE(w.wonotransaksi, w.woautonotransaksi), w.wotgl, w.wocabang, w.wolokasi,
    NULL, wrc.jml, NULL, w.womatauang,
    wrc.notransaksi, NULL, COALESCE(wrc._cdc_payload, w._cdc_payload), 'baseline-m6-execution-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m6_wo w
JOIN myerpplus_landing.m6_wo_route_card wrc ON w.woid = wrc.idwo
WHERE COALESCE(w._cdc_deleted, false) = false AND COALESCE(wrc._cdc_deleted, false) = false;
