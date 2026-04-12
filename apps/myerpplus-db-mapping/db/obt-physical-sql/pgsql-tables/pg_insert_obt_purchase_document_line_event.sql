-- Direct purchase document-line event OBT.
-- One row per detail row so every purchase-side document is immediately visible.

INSERT INTO obt_purchase_document_line_event
SELECT
    q.*,
    clock_timestamp() AS etl_loaded_at
FROM (
SELECT
    'm4' AS source_module,
    'obt_purchase_document_line_event' AS obt_name,
    'PO_LINE' AS source_doc_type,
    NULLIF(po.poid::text, '')::bigint AS source_header_id,
    NULLIF(pod.idpodetail::text, '')::bigint AS source_detail_id,
    po.ponotransaksi AS doc_no,
    po.potgl AS doc_date,
    NULLIF(po.postatus::text, '')::bigint AS doc_status_code,
    NULL::text AS doc_status_name,
    po.pocabang AS branch_code,
    br.bnama AS branch_name,
    po.polokasi AS location_code,
    lc.lnama AS location_name,
    NULLIF(po.posupplier::text, '')::bigint AS contact_id,
    sup.kkode AS contact_code,
    sup.knama AS contact_name,
    NULLIF(po.pobagianpembelian::text, '')::bigint AS buyer_contact_id,
    buyer.kkode AS buyer_contact_code,
    buyer.knama AS buyer_contact_name,
    NULLIF(pod.idbarang::text, '')::bigint AS item_id,
    itm.bkode AS item_code,
    COALESCE(itm.bnama, pod.namabarang) AS item_name,
    NULLIF(pod.urutan::text, '')::bigint AS line_no,
    pod.satuan AS uom_code,
    pod.jml AS qty,
    pod.jmlbarang AS qty_base,
    pod.jmlrealisasi AS qty_realized,
    pod.harga AS unit_price,
    pod.diskon AS discount_percent,
    pod.jmldiskon AS discount_amount,
    ((pod.jml * pod.harga) - pod.jmldiskon) AS amount,
    po.pomatauang AS currency_code,
    po.pokurs AS exchange_rate,
    NULL::bigint AS input_user_id,
    NULL::text AS input_user_name,
    NULL::bigint AS modified_user_id,
    NULL::text AS modified_user_name,
    NULL::bigint AS upstream_header_id,
    NULL::bigint AS upstream_detail_id,
    NULL::text AS upstream_doc_no,
    NULL::text AS upstream_doc_type,
    NULL::text AS downstream_doc_no,
    'PO' AS lineage_path
FROM m4_po_detail pod
JOIN m4_po po
    ON po.poid = NULLIF(pod.idpo::text, '')::bigint
LEFT JOIN m1_branch br
    ON br.bkode = po.pocabang
LEFT JOIN m1_location lc
    ON lc.lkode = po.polokasi
LEFT JOIN m1_contact sup
    ON sup.kid = NULLIF(po.posupplier::text, '')::bigint
LEFT JOIN m1_contact buyer
    ON buyer.kid = NULLIF(po.pobagianpembelian::text, '')::bigint
LEFT JOIN m1_item itm
    ON itm.bid = NULLIF(pod.idbarang::text, '')::bigint

UNION ALL

SELECT
    'm4',
    'obt_purchase_document_line_event',
    'GRN_LINE',
    NULLIF(grn.grnid::text, '')::bigint,
    NULLIF(grnd.idgrndetail::text, '')::bigint,
    grn.grnnotransaksi,
    grn.grntgl,
    NULLIF(grn.grnstatus::text, '')::bigint,
    NULL::text,
    grn.grncabang,
    br.bnama,
    grn.grnlokasi,
    lc.lnama,
    NULLIF(grn.grnsupplier::text, '')::bigint,
    sup.kkode,
    sup.knama,
    NULLIF(grn.grnbagianpembelian::text, '')::bigint,
    buyer.kkode,
    buyer.knama,
    NULLIF(grnd.idbarang::text, '')::bigint,
    itm.bkode,
    COALESCE(itm.bnama, grnd.namabarang),
    NULLIF(grnd.urutan::text, '')::bigint,
    grnd.satuan,
    grnd.jml,
    grnd.jmlbarang,
    grnd.jmlrealisasi,
    grnd.harga,
    grnd.diskon,
    grnd.jmldiskon,
    ((grnd.jml * grnd.harga) - grnd.jmldiskon),
    grn.grnmatauang,
    grn.grnkurs,
    NULL::bigint,
    NULL::text,
    NULL::bigint,
    NULL::text,
    NULLIF(po.poid::text, '')::bigint,
    NULLIF(grnd.idpodetail::text, '')::bigint,
    po.ponotransaksi,
    'PO_LINE',
    NULL::text,
    'PO>GRN'
FROM m4_grn_detail grnd
JOIN m4_grn grn
    ON grn.grnid = grnd.idgrn
LEFT JOIN m4_po_detail pod
    ON pod.idpodetail = grnd.idpodetail
LEFT JOIN m4_po po
    ON po.poid = pod.idpo
LEFT JOIN m1_branch br
    ON br.bkode = grn.grncabang
LEFT JOIN m1_location lc
    ON lc.lkode = grn.grnlokasi
LEFT JOIN m1_contact sup
    ON sup.kid = NULLIF(grn.grnsupplier::text, '')::bigint
LEFT JOIN m1_contact buyer
    ON buyer.kid = NULLIF(grn.grnbagianpembelian::text, '')::bigint
LEFT JOIN m1_item itm
    ON itm.bid = grnd.idbarang

UNION ALL

SELECT
    'm4',
    'obt_purchase_document_line_event',
    'RI_LINE',
    NULLIF(ri.riid::text, '')::bigint,
    NULLIF(rid.idridetail::text, '')::bigint,
    ri.rinotransaksi,
    ri.ritgl,
    NULLIF(ri.ristatus::text, '')::bigint,
    NULL::text,
    ri.ricabang,
    br.bnama,
    ri.rilokasi,
    lc.lnama,
    NULLIF(ri.risupplier::text, '')::bigint,
    sup.kkode,
    sup.knama,
    NULLIF(ri.ribagianpembelian::text, '')::bigint,
    buyer.kkode,
    buyer.knama,
    NULLIF(rid.idbarang::text, '')::bigint,
    itm.bkode,
    COALESCE(itm.bnama, rid.namabarang),
    NULLIF(rid.urutan::text, '')::bigint,
    rid.satuan,
    rid.jml,
    rid.jmlbarang,
    rid.jmlrealisasi,
    rid.harga,
    rid.diskon,
    rid.jmldiskon,
    ((rid.jml * rid.harga) - rid.jmldiskon),
    ri.rimatauang,
    ri.rikurs,
    NULL::bigint,
    NULL::text,
    NULL::bigint,
    NULL::text,
    NULLIF(grn.grnid::text, '')::bigint,
    NULLIF(rid.idgrndetail::text, '')::bigint,
    grn.grnnotransaksi,
    'GRN_LINE',
    NULL::text,
    'PO>GRN>RI'
FROM m4_ri_detail rid
JOIN m4_ri ri
    ON ri.riid = rid.idri
LEFT JOIN m4_grn_detail grnd
    ON grnd.idgrndetail = rid.idgrndetail
LEFT JOIN m4_grn grn
    ON grn.grnid = grnd.idgrn
LEFT JOIN m1_branch br
    ON br.bkode = ri.ricabang
LEFT JOIN m1_location lc
    ON lc.lkode = ri.rilokasi
LEFT JOIN m1_contact sup
    ON sup.kid = ri.risupplier
LEFT JOIN m1_contact buyer
    ON buyer.kid = ri.ribagianpembelian
LEFT JOIN m1_item itm
    ON itm.bid = rid.idbarang

UNION ALL

SELECT
    'm4',
    'obt_purchase_document_line_event',
    'DNR_LINE',
    NULLIF(dnr.dnrid::text, '')::bigint,
    NULLIF(dnrd.iddnrdetail::text, '')::bigint,
    dnr.dnrnotransaksi,
    dnr.dnrtgl,
    NULLIF(dnr.dnrstatus::text, '')::bigint,
    NULL::text,
    dnr.dnrcabang,
    br.bnama,
    dnr.dnrlokasi,
    lc.lnama,
    NULLIF(dnr.dnrsupplier::text, '')::bigint,
    sup.kkode,
    sup.knama,
    NULLIF(dnr.dnrbagianpembelian::text, '')::bigint,
    buyer.kkode,
    buyer.knama,
    NULLIF(dnrd.idbarang::text, '')::bigint,
    itm.bkode,
    COALESCE(itm.bnama, dnrd.namabarang),
    NULLIF(dnrd.urutan::text, '')::bigint,
    dnrd.satuan,
    dnrd.jml,
    dnrd.jmlbarang,
    dnrd.jmlrealisasi,
    dnrd.harga,
    dnrd.diskon,
    dnrd.jmldiskon,
    ((dnrd.jml * dnrd.harga) - dnrd.jmldiskon),
    dnr.dnrmatauang,
    dnr.dnrkurs,
    NULL::bigint,
    NULL::text,
    NULL::bigint,
    NULL::text,
    NULLIF(ri.riid::text, '')::bigint,
    NULLIF(dnrd.idridetail::text, '')::bigint,
    ri.rinotransaksi,
    'RI_LINE',
    NULL::text,
    'PO>GRN>RI>DNR'
FROM m4_dnr_detail dnrd
JOIN m4_dnr dnr
    ON dnr.dnrid = dnrd.iddnr
LEFT JOIN m4_ri_detail rid
    ON rid.idridetail = dnrd.idridetail
LEFT JOIN m4_ri ri
    ON ri.riid = rid.idri
LEFT JOIN m1_branch br
    ON br.bkode = dnr.dnrcabang
LEFT JOIN m1_location lc
    ON lc.lkode = dnr.dnrlokasi
LEFT JOIN m1_contact sup
    ON sup.kid = NULLIF(dnr.dnrsupplier::text, '')::bigint
LEFT JOIN m1_contact buyer
    ON buyer.kid = NULLIF(dnr.dnrbagianpembelian::text, '')::bigint
LEFT JOIN m1_item itm
    ON itm.bid = dnrd.idbarang

UNION ALL

SELECT
    'm4',
    'obt_purchase_document_line_event',
    'PRT_LINE',
    NULLIF(prt.prtid::text, '')::bigint,
    NULLIF(prtd.idprtdetail::text, '')::bigint,
    prt.prtnotransaksi,
    prt.prttgl,
    NULLIF(prt.prtstatus::text, '')::bigint,
    NULL::text,
    prt.prtcabang,
    br.bnama,
    prt.prtlokasi,
    lc.lnama,
    NULLIF(prt.prtsupplier::text, '')::bigint,
    sup.kkode,
    sup.knama,
    NULLIF(prt.prtbagianpembelian::text, '')::bigint,
    buyer.kkode,
    buyer.knama,
    NULLIF(prtd.idbarang::text, '')::bigint,
    itm.bkode,
    COALESCE(itm.bnama, prtd.namabarang),
    NULLIF(prtd.urutan::text, '')::bigint,
    prtd.satuan,
    prtd.jml,
    prtd.jmlbarang,
    NULL::numeric,
    prtd.harga,
    prtd.diskon,
    prtd.jmldiskon,
    ((prtd.jml * prtd.harga) - prtd.jmldiskon),
    prt.prtmatauang,
    prt.prtkurs,
    NULL::bigint,
    NULL::text,
    NULL::bigint,
    NULL::text,
    NULLIF(dnr.dnrid::text, '')::bigint,
    NULLIF(prtd.iddnrdetail::text, '')::bigint,
    dnr.dnrnotransaksi,
    'DNR_LINE',
    NULL::text,
    'PO>GRN>RI>DNR>PRT'
FROM m4_prt_detail prtd
JOIN m4_prt prt
    ON prt.prtid = prtd.idprt
LEFT JOIN m4_dnr_detail dnrd
    ON dnrd.iddnrdetail = prtd.iddnrdetail
LEFT JOIN m4_dnr dnr
    ON dnr.dnrid = dnrd.iddnr
LEFT JOIN m1_branch br
    ON br.bkode = prt.prtcabang
LEFT JOIN m1_location lc
    ON lc.lkode = prt.prtlokasi
LEFT JOIN m1_contact sup
    ON sup.kid = NULLIF(prt.prtsupplier::text, '')::bigint
LEFT JOIN m1_contact buyer
    ON buyer.kid = NULLIF(prt.prtbagianpembelian::text, '')::bigint
LEFT JOIN m1_item itm
    ON itm.bid = prtd.idbarang
) AS q;
