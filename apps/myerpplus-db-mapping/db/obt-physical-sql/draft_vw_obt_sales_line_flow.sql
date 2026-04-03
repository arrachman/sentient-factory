-- Draft physical OBT skeleton for MyERPPlus sales flow.
-- Conservative default:
--   anchor on m5_si_detail because invoice detail has the richest stable lineage to SO, DO, PL, PI, DR, RNR, and SR
--   quotation lineage is attached through SO or PI when available
-- Target engine: MySQL 8+ style SQL

WITH si_anchor AS (
    SELECT
        'm5' AS source_module,
        'SI_LINE' AS source_doc_type,
        si.siid AS source_header_id,
        sid.idsidetail AS source_detail_id,
        si.sinotransaksi AS doc_no,
        si.sitgl AS doc_date,
        si.sistatus AS doc_status_code,
        si.sicabang AS branch_code,
        si.silokasi AS location_code,
        si.sicustomer AS contact_id,
        cust.kkode AS contact_code,
        cust.knama AS contact_name,
        sid.idbarang AS item_id,
        itm.bkode AS item_code,
        itm.bnama AS item_name,
        sid.urutan AS line_no,
        sid.jml AS qty_doc,
        sid.satuan AS qty_uom,
        sid.jmlbarang AS qty_base,
        sid.harga AS unit_price,
        sid.diskon AS discount_percent,
        sid.jmldiskon AS discount_amount,
        ((sid.jml * sid.harga) - sid.jmldiskon) AS line_amount,
        sid.idsodetail,
        sid.idpidetail,
        sid.idpldetail,
        sid.iddodetail,
        sid.iddrdetail
    FROM m5_si_detail sid
    JOIN m5_si si
        ON si.siid = sid.idsi
    LEFT JOIN m1_contact cust
        ON cust.kid = si.sicustomer
    LEFT JOIN m1_item itm
        ON itm.bid = sid.idbarang
),
so_line AS (
    SELECT
        sod.idsodetail,
        sod.idsqdetail,
        so.soid,
        so.sonotransaksi AS so_no,
        so.sotgl AS so_date,
        sod.jmlbarang AS qty_so,
        sod.jmlrealisasi AS qty_realized_so
    FROM m5_so_detail sod
    JOIN m5_so so
        ON so.soid = sod.idso
),
sq_line AS (
    SELECT
        sqd.idsqdetail,
        sq.sqid,
        sq.sqnotransaksi AS sq_no,
        sq.sqtgl AS sq_date,
        sqd.jmlbarang AS qty_sq,
        sqd.jmlrealisasi AS qty_realized_sq
    FROM m5_sq_detail sqd
    JOIN m5_sq sq
        ON sq.sqid = sqd.idsq
),
pi_line AS (
    SELECT
        pid.idpidetail,
        pid.idsqdetail,
        pid.idsodetail,
        pi.piid,
        pi.pinotransaksi AS pi_no,
        pi.pitgl AS pi_date,
        pid.jmlbarang AS qty_pi,
        pid.jmlrealisasi AS qty_realized_pi
    FROM m5_pi_detail pid
    JOIN m5_pi pi
        ON pi.piid = pid.idpi
),
pl_line AS (
    SELECT
        pld.idpldetail,
        pld.idsodetail,
        pld.idpidetail,
        pl.plid,
        pl.plnotransaksi AS pl_no,
        pl.pltgl AS pl_date,
        pld.jmlbarang AS qty_pl,
        pld.jmlrealisasi AS qty_realized_pl
    FROM m5_pl_detail pld
    JOIN m5_pl pl
        ON pl.plid = pld.idpl
),
do_line AS (
    SELECT
        dod.iddodetail,
        dod.idsodetail,
        dod.idpidetail,
        dod.idpldetail,
        dox.doid,
        dox.donotransaksi AS do_no,
        dox.dotgl AS do_date,
        dod.jmlbarang AS qty_do,
        dod.jmlrealisasi AS qty_realized_do
    FROM m5_do_detail dod
    JOIN m5_do dox
        ON dox.doid = dod.iddo
),
dr_line AS (
    SELECT
        drd.iddrdetail,
        drd.iddodetail,
        drd.idpidetail,
        dr.drid,
        dr.drnotransaksi AS dr_no,
        dr.drtgl AS dr_date,
        drd.jmlbarang AS qty_dr,
        drd.jmlbarangkembali AS qty_returned_dr
    FROM m5_dr_detail drd
    JOIN m5_dr dr
        ON dr.drid = drd.iddr
),
rnr_line AS (
    SELECT
        rnrd.idrnrdetail,
        rnrd.idsidetail,
        rnr.rnrid,
        rnr.rnrnotransaksi AS rnr_no,
        rnr.rnrtgl AS rnr_date,
        rnrd.jmlbarang AS qty_rnr,
        rnrd.jmlrealisasi AS qty_realized_rnr
    FROM m5_rnr_detail rnrd
    JOIN m5_rnr rnr
        ON rnr.rnrid = rnrd.idrnr
),
sr_line AS (
    SELECT
        srd.idsrdetail,
        srd.idsidetail,
        srd.idrnrdetail,
        sr.srid,
        sr.srnotransaksi AS sr_no,
        sr.srtgl AS sr_date,
        srd.jmlbarang AS qty_sr
    FROM m5_sr_detail srd
    JOIN m5_sr sr
        ON sr.srid = srd.idsr
)
SELECT
    a.source_module,
    'obt_sales_line_flow' AS obt_name,
    a.source_doc_type,
    a.source_header_id,
    a.source_detail_id,
    a.doc_no,
    a.doc_date,
    a.doc_status_code,
    st.nama AS doc_status_name,
    a.branch_code,
    br.bnama AS branch_name,
    a.location_code,
    lc.lnama AS location_name,
    a.contact_id,
    a.contact_code,
    a.contact_name,
    a.item_id,
    a.item_code,
    a.item_name,
    a.line_no,
    a.qty_doc AS qty_si,
    a.qty_uom AS qty_si_uom,
    a.qty_base AS qty_si_base,
    a.unit_price,
    a.discount_percent,
    a.discount_amount,
    a.line_amount,
    sq.sq_no,
    sq.sq_date,
    sq.qty_sq,
    so.so_no,
    so.so_date,
    so.qty_so,
    pi.pi_no,
    pi.pi_date,
    pi.qty_pi,
    pl.pl_no,
    pl.pl_date,
    pl.qty_pl,
    dox.do_no,
    dox.do_date,
    dox.qty_do,
    dr.dr_no,
    dr.dr_date,
    dr.qty_dr,
    dr.qty_returned_dr,
    rnr.rnr_no,
    rnr.rnr_date,
    rnr.qty_rnr,
    sr.sr_no,
    sr.sr_date,
    sr.qty_sr,
    'SQ>SO>PI/PL/DO>DR>SI>RNR>SR' AS lineage_path
FROM si_anchor a
LEFT JOIN so_line so
    ON so.idsodetail = a.idsodetail
LEFT JOIN pi_line pi
    ON pi.idpidetail = a.idpidetail
LEFT JOIN pl_line pl
    ON pl.idpldetail = a.idpldetail
LEFT JOIN do_line dox
    ON dox.iddodetail = a.iddodetail
LEFT JOIN dr_line dr
    ON dr.iddrdetail = a.iddrdetail
LEFT JOIN sq_line sq
    ON sq.idsqdetail = COALESCE(so.idsqdetail, pi.idsqdetail)
LEFT JOIN rnr_line rnr
    ON rnr.idsidetail = a.source_detail_id
LEFT JOIN sr_line sr
    ON sr.idsidetail = a.source_detail_id
LEFT JOIN m0_status st
    ON st.kode = a.doc_status_code
LEFT JOIN m1_branch br
    ON br.bkode = a.branch_code
LEFT JOIN m1_location lc
    ON lc.lkode = a.location_code;
