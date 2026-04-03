-- Draft physical OBT skeleton for MyERPPlus purchasing flow.
-- Conservative default:
--   anchor on m4_po_detail because PO -> GRN -> RI detail lineage is explicit
--   keep BS/RQ/PR upstream as a separate extension unless local validation confirms line-level linkage
-- Target engine: MySQL 8+ style SQL

WITH po_anchor AS (
    SELECT
        'm4' AS source_module,
        'PO_LINE' AS source_doc_type,
        po.poid AS source_header_id,
        pod.idpodetail AS source_detail_id,
        po.ponotransaksi AS doc_no,
        po.potgl AS doc_date,
        po.postatus AS doc_status_code,
        po.posupplier AS contact_id,
        sup.kkode AS contact_code,
        sup.knama AS contact_name,
        po.potermin AS terms_code,
        tr.trnama AS terms_name,
        pod.idbarang AS item_id,
        itm.bkode AS item_code,
        itm.bnama AS item_name,
        pod.urutan AS line_no,
        pod.jml AS qty_doc,
        pod.satuan AS qty_uom,
        pod.jmlbarang AS qty_base,
        pod.jmlrealisasi AS qty_realized_po,
        pod.harga AS unit_price,
        pod.diskon AS discount_percent,
        pod.jmldiskon AS discount_amount,
        ((pod.jml * pod.harga) - pod.jmldiskon) AS line_amount
    FROM m4_po_detail pod
    JOIN m4_po po
        ON po.poid = pod.idpo
    LEFT JOIN m1_contact sup
        ON sup.kid = po.posupplier
    LEFT JOIN m1_terms tr
        ON tr.trkode = po.potermin
    LEFT JOIN m1_item itm
        ON itm.bid = pod.idbarang
),
grn_line AS (
    SELECT
        grnd.idpodetail,
        grnd.idgrndetail,
        grn.grnid,
        grn.grnnotransaksi AS grn_no,
        grn.grntgl AS grn_date,
        grnd.jmlbarang AS qty_grn,
        grnd.jmlrealisasi AS qty_realized_grn
    FROM m4_grn_detail grnd
    JOIN m4_grn grn
        ON grn.grnid = grnd.idgrn
),
ri_line AS (
    SELECT
        rid.idgrndetail,
        rid.idridetail,
        ri.riid,
        ri.rinotransaksi AS ri_no,
        ri.ritgl AS ri_date,
        rid.jmlbarang AS qty_ri,
        rid.jmlrealisasi AS qty_realized_ri,
        ((rid.jml * rid.harga) - rid.jmldiskon) AS amount_ri
    FROM m4_ri_detail rid
    JOIN m4_ri ri
        ON ri.riid = rid.idri
),
dnr_line AS (
    SELECT
        dnrd.idridetail,
        dnrd.iddnrdetail,
        dnr.dnrid,
        dnr.dnrnotransaksi AS dnr_no,
        dnr.dnrtgl AS dnr_date,
        dnrd.jmlbarang AS qty_dnr
    FROM m4_dnr_detail dnrd
    JOIN m4_dnr dnr
        ON dnr.dnrid = dnrd.iddnr
),
prt_line AS (
    SELECT
        prtd.iddnrdetail,
        prtd.idprtdetail,
        prt.prtid,
        prt.prtnotransaksi AS prt_no,
        prt.prttgl AS prt_date,
        prtd.jmlbarang AS qty_prt
    FROM m4_prt_detail prtd
    JOIN m4_prt prt
        ON prt.prtid = prtd.idprt
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
    st.nama AS doc_status_name,
    a.contact_id,
    a.contact_code,
    a.contact_name,
    a.terms_code,
    a.terms_name,
    a.item_id,
    a.item_code,
    a.item_name,
    a.line_no,
    a.qty_doc AS qty_po,
    a.qty_uom AS qty_po_uom,
    a.qty_base AS qty_po_base,
    a.qty_realized_po,
    a.unit_price,
    a.discount_percent,
    a.discount_amount,
    a.line_amount,
    g.grn_no,
    g.grn_date,
    g.qty_grn,
    g.qty_realized_grn,
    r.ri_no,
    r.ri_date,
    r.qty_ri,
    r.qty_realized_ri,
    r.amount_ri,
    d.dnr_no,
    d.dnr_date,
    d.qty_dnr,
    p.prt_no,
    p.prt_date,
    p.qty_prt,
    'PO>GRN>RI>DNR>PRT' AS lineage_path
FROM po_anchor a
LEFT JOIN grn_line g
    ON g.idpodetail = a.source_detail_id
LEFT JOIN ri_line r
    ON r.idgrndetail = g.idgrndetail
LEFT JOIN dnr_line d
    ON d.idridetail = r.idridetail
LEFT JOIN prt_line p
    ON p.iddnrdetail = d.iddnrdetail
LEFT JOIN m0_status st
    ON st.kode = a.doc_status_code;
