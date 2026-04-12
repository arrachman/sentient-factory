-- Auto-generated from vw_obt_purchase_line_flow.sql
-- Purpose:
--   bootstrap or append rows into the PostgreSQL OBT table
-- Note:
--   this is a plain INSERT for the first load
--   convert it to UPSERT or delta-based ETL for live sync

INSERT INTO obt_purchase_line_flow
SELECT
    q.*,
    clock_timestamp() AS etl_loaded_at
FROM (
WITH po_anchor AS (
    SELECT
        'm4' AS source_module,
        'PO_LINE' AS source_doc_type,
        po.poid AS source_header_id,
        pod.idpodetail AS source_detail_id,
        po.ponotransaksi AS doc_no,
        po.potgl AS doc_date,
        po.postatus::bigint AS doc_status_code,
        NULL AS doc_status_name,
        po.pocabang AS branch_code,
        br.bnama AS branch_name,
        po.polokasi AS location_code,
        lc.lnama AS location_name,
        po.posupplier::bigint AS contact_id,
        sup.kkode AS contact_code,
        sup.knama AS contact_name,
        po.pobagianpembelian::bigint AS buyer_contact_id,
        buyer.kkode AS buyer_contact_code,
        buyer.knama AS buyer_contact_name,
        po.potermin AS terms_code,
        tr.trnama AS terms_name,
        pod.idbarang AS item_id,
        itm.bkode AS item_code,
        COALESCE(itm.bnama, pod.namabarang) AS item_name,
        pod.urutan::bigint AS line_no,
        pod.satuan AS uom_code,
        pod.jml AS qty,
        pod.jmlbarang AS qty_base,
        (pod.jmlrealisasi / NULLIF(pod.nilaisatuan, 0)) AS qty_realized,
        pod.jmlrealisasi AS qty_realized_base,
        pod.harga AS unit_price,
        pod.diskon AS discount_percent,
        pod.jmldiskon AS discount_amount,
        ((pod.jml * pod.harga) - pod.jmldiskon) AS amount,
        po.pomatauang AS currency_code,
        po.pokurs AS exchange_rate,
        NULL::bigint AS input_user_id,
        NULL AS input_user_name,
        NULL::bigint AS modified_user_id,
        NULL AS modified_user_name
    FROM m4_po_detail pod
    JOIN m4_po po
        ON po.poid = pod.idpo
    LEFT JOIN m1_branch br
        ON br.bkode = po.pocabang
    LEFT JOIN m1_location lc
        ON lc.lkode = po.polokasi
    LEFT JOIN m1_contact sup
        ON sup.kid = po.posupplier
    LEFT JOIN m1_contact buyer
        ON buyer.kid = po.pobagianpembelian
    LEFT JOIN m1_terms tr
        ON tr.trkode = po.potermin
    LEFT JOIN m1_item itm
        ON itm.bid = pod.idbarang
),
grn_rollup AS (
    SELECT
        grnd.idpodetail AS po_detail_id,
        COUNT(DISTINCT grn.grnid) AS grn_doc_count,
        STRING_AGG(DISTINCT grn.grnnotransaksi, ', ' ORDER BY grn.grnnotransaksi) AS grn_doc_nos,
        NULL AS grn_status_names,
        MIN(grn.grntgl) AS first_grn_date,
        MAX(grn.grntgl) AS last_grn_date,
        SUM(grnd.jml) AS qty_grn,
        SUM(grnd.jmlbarang) AS qty_grn_base,
        SUM(grnd.jmlrealisasi / NULLIF(grnd.nilaisatuan, 0)) AS qty_realized_grn,
        SUM(grnd.jmlrealisasi) AS qty_realized_grn_base,
        SUM((grnd.jml * grnd.harga) - grnd.jmldiskon) AS amount_grn
    FROM m4_grn_detail grnd
    JOIN m4_grn grn
        ON grn.grnid = grnd.idgrn
    WHERE grnd.idpodetail <> 0
    GROUP BY grnd.idpodetail
),
ri_base AS (
    SELECT
        COALESCE(NULLIF(grnd.idpodetail, 0), NULLIF(rid.idpodetail, 0)) AS po_detail_id,
        ri.riid,
        rid.idridetail,
        ri.rinotransaksi AS ri_no,
        ri.ritgl AS ri_date,
        NULL AS ri_status_name,
        grn.grnnotransaksi AS source_grn_no,
        rid.jml AS qty_ri,
        rid.jmlbarang AS qty_ri_base,
        (rid.jmlrealisasi / NULLIF(rid.nilaisatuan, 0)) AS qty_realized_ri,
        rid.jmlrealisasi AS qty_realized_ri_base,
        ((rid.jml * rid.harga) - rid.jmldiskon) AS amount_ri
    FROM m4_ri_detail rid
    JOIN m4_ri ri
        ON ri.riid = rid.idri
    LEFT JOIN m4_grn_detail grnd
        ON grnd.idgrndetail = rid.idgrndetail
    LEFT JOIN m4_grn grn
        ON grn.grnid = grnd.idgrn
    WHERE COALESCE(NULLIF(grnd.idpodetail, 0), NULLIF(rid.idpodetail, 0)) IS NOT NULL
),
ri_rollup AS (
    SELECT
        b.po_detail_id,
        COUNT(DISTINCT b.riid) AS ri_doc_count,
        STRING_AGG(DISTINCT b.ri_no, ', ' ORDER BY b.ri_no) AS ri_doc_nos,
        STRING_AGG(DISTINCT b.ri_status_name, ', ' ORDER BY b.ri_status_name) AS ri_status_names,
        STRING_AGG(DISTINCT b.source_grn_no, ', ' ORDER BY b.source_grn_no) AS source_grn_doc_nos,
        MIN(b.ri_date) AS first_ri_date,
        MAX(b.ri_date) AS last_ri_date,
        SUM(b.qty_ri) AS qty_ri,
        SUM(b.qty_ri_base) AS qty_ri_base,
        SUM(b.qty_realized_ri) AS qty_realized_ri,
        SUM(b.qty_realized_ri_base) AS qty_realized_ri_base,
        SUM(b.amount_ri) AS amount_ri
    FROM ri_base b
    GROUP BY b.po_detail_id
),
dnr_base AS (
    SELECT
        COALESCE(NULLIF(dnrd.idpodetail, 0), NULLIF(rid.idpodetail, 0), NULLIF(grnd.idpodetail, 0)) AS po_detail_id,
        dnr.dnrid,
        dnrd.iddnrdetail,
        dnr.dnrnotransaksi AS dnr_no,
        dnr.dnrtgl AS dnr_date,
        NULL AS dnr_status_name,
        ri.rinotransaksi AS source_ri_no,
        dnrd.jml AS qty_dnr,
        dnrd.jmlbarang AS qty_dnr_base,
        (dnrd.jmlrealisasi / NULLIF(dnrd.nilaisatuan, 0)) AS qty_realized_dnr,
        dnrd.jmlrealisasi AS qty_realized_dnr_base,
        ((dnrd.jml * dnrd.harga) - dnrd.jmldiskon) AS amount_dnr
    FROM m4_dnr_detail dnrd
    JOIN m4_dnr dnr
        ON dnr.dnrid = dnrd.iddnr
    LEFT JOIN m4_ri_detail rid
        ON rid.idridetail = dnrd.idridetail
    LEFT JOIN m4_ri ri
        ON ri.riid = rid.idri
    LEFT JOIN m4_grn_detail grnd
        ON grnd.idgrndetail = COALESCE(NULLIF(dnrd.idgrndetail, 0), NULLIF(rid.idgrndetail, 0))
    WHERE COALESCE(NULLIF(dnrd.idpodetail, 0), NULLIF(rid.idpodetail, 0), NULLIF(grnd.idpodetail, 0)) IS NOT NULL
),
dnr_rollup AS (
    SELECT
        b.po_detail_id,
        COUNT(DISTINCT b.dnrid) AS dnr_doc_count,
        STRING_AGG(DISTINCT b.dnr_no, ', ' ORDER BY b.dnr_no) AS dnr_doc_nos,
        STRING_AGG(DISTINCT b.dnr_status_name, ', ' ORDER BY b.dnr_status_name) AS dnr_status_names,
        STRING_AGG(DISTINCT b.source_ri_no, ', ' ORDER BY b.source_ri_no) AS source_ri_doc_nos,
        MIN(b.dnr_date) AS first_dnr_date,
        MAX(b.dnr_date) AS last_dnr_date,
        SUM(b.qty_dnr) AS qty_dnr,
        SUM(b.qty_dnr_base) AS qty_dnr_base,
        SUM(b.qty_realized_dnr) AS qty_realized_dnr,
        SUM(b.qty_realized_dnr_base) AS qty_realized_dnr_base,
        SUM(b.amount_dnr) AS amount_dnr
    FROM dnr_base b
    GROUP BY b.po_detail_id
),
prt_base AS (
    SELECT
        COALESCE(NULLIF(prtd.idpodetail, 0), NULLIF(dnrd.idpodetail, 0), NULLIF(rid.idpodetail, 0), NULLIF(grnd.idpodetail, 0)) AS po_detail_id,
        prt.prtid,
        prtd.idprtdetail,
        prt.prtnotransaksi AS prt_no,
        prt.prttgl AS prt_date,
        NULL AS prt_status_name,
        dnr.dnrnotransaksi AS source_dnr_no,
        prtd.jml AS qty_prt,
        prtd.jmlbarang AS qty_prt_base,
        ((prtd.jml * prtd.harga) - prtd.jmldiskon) AS amount_prt
    FROM m4_prt_detail prtd
    JOIN m4_prt prt
        ON prt.prtid = prtd.idprt
    LEFT JOIN m4_dnr_detail dnrd
        ON dnrd.iddnrdetail = prtd.iddnrdetail
    LEFT JOIN m4_dnr dnr
        ON dnr.dnrid = dnrd.iddnr
    LEFT JOIN m4_ri_detail rid
        ON rid.idridetail = COALESCE(NULLIF(prtd.idridetail, 0), NULLIF(dnrd.idridetail, 0))
    LEFT JOIN m4_grn_detail grnd
        ON grnd.idgrndetail = COALESCE(NULLIF(prtd.idgrndetail, 0), NULLIF(dnrd.idgrndetail, 0), NULLIF(rid.idgrndetail, 0))
    WHERE COALESCE(NULLIF(prtd.idpodetail, 0), NULLIF(dnrd.idpodetail, 0), NULLIF(rid.idpodetail, 0), NULLIF(grnd.idpodetail, 0)) IS NOT NULL
),
prt_rollup AS (
    SELECT
        b.po_detail_id,
        COUNT(DISTINCT b.prtid) AS prt_doc_count,
        STRING_AGG(DISTINCT b.prt_no, ', ' ORDER BY b.prt_no) AS prt_doc_nos,
        STRING_AGG(DISTINCT b.prt_status_name, ', ' ORDER BY b.prt_status_name) AS prt_status_names,
        STRING_AGG(DISTINCT b.source_dnr_no, ', ' ORDER BY b.source_dnr_no) AS source_dnr_doc_nos,
        MIN(b.prt_date) AS first_prt_date,
        MAX(b.prt_date) AS last_prt_date,
        SUM(b.qty_prt) AS qty_prt,
        SUM(b.qty_prt_base) AS qty_prt_base,
        SUM(b.amount_prt) AS amount_prt
    FROM prt_base b
    GROUP BY b.po_detail_id
)
SELECT
    a.source_module,
    'obt_purchase_line_flow' AS obt_name,
    a.source_doc_type,
    a.source_header_id,
    a.source_detail_id,
    a.doc_no,
    a.doc_date,
    a.doc_status_code,
    a.doc_status_name,
    a.branch_code,
    a.branch_name,
    a.location_code,
    a.location_name,
    a.contact_id,
    a.contact_code,
    a.contact_name,
    a.buyer_contact_id,
    a.buyer_contact_code,
    a.buyer_contact_name,
    a.terms_code,
    a.terms_name,
    a.item_id,
    a.item_code,
    a.item_name,
    a.line_no,
    a.uom_code,
    a.qty,
    a.qty_base,
    a.qty_realized,
    a.qty_realized_base,
    a.unit_price,
    a.discount_percent,
    a.discount_amount,
    a.amount,
    a.currency_code,
    a.exchange_rate,
    a.input_user_id,
    a.input_user_name,
    a.modified_user_id,
    a.modified_user_name,
    g.grn_doc_count,
    g.grn_doc_nos,
    g.grn_status_names,
    g.first_grn_date,
    g.last_grn_date,
    g.qty_grn,
    g.qty_grn_base,
    g.qty_realized_grn,
    g.qty_realized_grn_base,
    g.amount_grn,
    r.ri_doc_count,
    r.ri_doc_nos,
    r.ri_status_names,
    r.source_grn_doc_nos,
    r.first_ri_date,
    r.last_ri_date,
    r.qty_ri,
    r.qty_ri_base,
    r.qty_realized_ri,
    r.qty_realized_ri_base,
    r.amount_ri,
    d.dnr_doc_count,
    d.dnr_doc_nos,
    d.dnr_status_names,
    d.source_ri_doc_nos,
    d.first_dnr_date,
    d.last_dnr_date,
    d.qty_dnr,
    d.qty_dnr_base,
    d.qty_realized_dnr,
    d.qty_realized_dnr_base,
    d.amount_dnr,
    p.prt_doc_count,
    p.prt_doc_nos,
    p.prt_status_names,
    p.source_dnr_doc_nos,
    p.first_prt_date,
    p.last_prt_date,
    p.qty_prt,
    p.qty_prt_base,
    p.amount_prt,
    NULL AS upstream_doc_no,
    COALESCE(p.prt_doc_nos, d.dnr_doc_nos, r.ri_doc_nos, g.grn_doc_nos) AS downstream_doc_no,
    'PO>GRN>RI>DNR>PRT' AS lineage_path
FROM po_anchor a
LEFT JOIN grn_rollup g
    ON g.po_detail_id = a.source_detail_id
LEFT JOIN ri_rollup r
    ON r.po_detail_id = a.source_detail_id
LEFT JOIN dnr_rollup d
    ON d.po_detail_id = a.source_detail_id
LEFT JOIN prt_rollup p
    ON p.po_detail_id = a.source_detail_id
) AS q;
