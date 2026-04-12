-- Auto-generated from vw_obt_sales_line_flow.sql
-- Purpose:
--   bootstrap or append rows into the PostgreSQL OBT table
-- Note:
--   this is a plain INSERT for the first load
--   convert it to UPSERT or delta-based ETL for live sync

INSERT INTO obt_sales_line_flow
SELECT
    q.*,
    clock_timestamp() AS etl_loaded_at
FROM (
WITH si_anchor AS (
    SELECT
        'm5' AS source_module,
        'SI_LINE' AS source_doc_type,
        si.siid AS source_header_id,
        sid.idsidetail AS source_detail_id,
        si.sinotransaksi AS doc_no,
        si.sitgl AS doc_date,
        si.sistatus::bigint AS doc_status_code,
        NULL AS doc_status_name,
        si.sicabang AS branch_code,
        br.bnama AS branch_name,
        si.silokasi AS location_code,
        lc.lnama AS location_name,
        si.sicustomer::bigint AS contact_id,
        cust.kkode AS contact_code,
        cust.knama AS contact_name,
        si.sibagianpenjualan::bigint AS sales_contact_id,
        sales.kkode AS sales_contact_code,
        sales.knama AS sales_contact_name,
        sid.idbarang AS item_id,
        itm.bkode AS item_code,
        COALESCE(itm.bnama, sid.namabarang) AS item_name,
        sid.urutan::bigint AS line_no,
        sid.satuan AS uom_code,
        sid.jml AS qty,
        sid.jmlbarang AS qty_base,
        sid.harga AS unit_price,
        sid.diskon AS discount_percent,
        sid.jmldiskon AS discount_amount,
        ((sid.jml * sid.harga) - sid.jmldiskon) AS amount,
        si.simatauang AS currency_code,
        si.sikurs AS exchange_rate,
        NULL::bigint AS input_user_id,
        NULL AS input_user_name,
        si.simodifikasiuser::bigint AS modified_user_id,
        user_mod.unama AS modified_user_name,
        NULLIF(sid.idsodetail, 0) AS idsodetail,
        NULLIF(sid.idpidetail, 0) AS idpidetail,
        NULLIF(sid.idpldetail, 0) AS idpldetail,
        NULLIF(sid.iddodetail, 0) AS iddodetail,
        NULLIF(sid.iddrdetail, 0) AS iddrdetail
    FROM m5_si_detail sid
    JOIN m5_si si
        ON si.siid = sid.idsi
    LEFT JOIN m1_branch br
        ON br.bkode = si.sicabang
    LEFT JOIN m1_location lc
        ON lc.lkode = si.silokasi
    LEFT JOIN m1_contact cust
        ON cust.kid = si.sicustomer
    LEFT JOIN m1_contact sales
        ON sales.kid = si.sibagianpenjualan
    LEFT JOIN m1_item itm
        ON itm.bid = sid.idbarang
    LEFT JOIN m0_user user_mod
        ON user_mod.userid = si.simodifikasiuser
),
so_line AS (
    SELECT
        sod.idsodetail,
        NULLIF(sod.idsqdetail, 0) AS idsqdetail,
        so.soid AS so_header_id,
        sod.idsodetail AS so_detail_id,
        so.sonotransaksi AS so_no,
        so.sotgl AS so_date,
        so.sostatus::bigint AS so_status_code,
        NULL AS so_status_name,
        sod.jml AS qty_so,
        sod.jmlbarang AS qty_so_base,
        sod.jmlrealisasi AS qty_realized_so
    FROM m5_so_detail sod
    JOIN m5_so so
        ON so.soid = sod.idso
),
sq_line AS (
    SELECT
        sqd.idsqdetail,
        sq.sqid AS sq_header_id,
        sqd.idsqdetail AS sq_detail_id,
        sq.sqnotransaksi AS sq_no,
        sq.sqtgl AS sq_date,
        sq.sqstatus::bigint AS sq_status_code,
        NULL AS sq_status_name,
        sqd.jml AS qty_sq,
        sqd.jmlbarang AS qty_sq_base,
        sqd.jmlrealisasi AS qty_realized_sq
    FROM m5_sq_detail sqd
    JOIN m5_sq sq
        ON sq.sqid = sqd.idsq
),
pi_line AS (
    SELECT
        pid.idpidetail,
        NULLIF(pid.idsqdetail, 0) AS idsqdetail,
        NULLIF(pid.idsodetail, 0) AS idsodetail,
        pi.piid AS pi_header_id,
        pid.idpidetail AS pi_detail_id,
        pi.pinotransaksi AS pi_no,
        pi.pitgl AS pi_date,
        pi.pistatus::bigint AS pi_status_code,
        NULL AS pi_status_name,
        pid.jml AS qty_pi,
        pid.jmlbarang AS qty_pi_base,
        pid.jmlrealisasi AS qty_realized_pi
    FROM m5_pi_detail pid
    JOIN m5_pi pi
        ON pi.piid = pid.idpi
),
pl_line AS (
    SELECT
        pld.idpldetail,
        NULLIF(pld.idsodetail, 0) AS idsodetail,
        NULLIF(pld.idpidetail, 0) AS idpidetail,
        pl.plid AS pl_header_id,
        pld.idpldetail AS pl_detail_id,
        pl.plnotransaksi AS pl_no,
        pl.pltgl AS pl_date,
        pl.plstatus::bigint AS pl_status_code,
        NULL AS pl_status_name,
        pld.jml AS qty_pl,
        pld.jmlbarang AS qty_pl_base,
        pld.jmlrealisasi AS qty_realized_pl
    FROM m5_pl_detail pld
    JOIN m5_pl pl
        ON pl.plid = pld.idpl
),
do_line AS (
    SELECT
        dod.iddodetail,
        NULLIF(dod.idsodetail, 0) AS idsodetail,
        NULLIF(dod.idpidetail, 0) AS idpidetail,
        NULLIF(dod.idpldetail, 0) AS idpldetail,
        dox.doid AS do_header_id,
        dod.iddodetail AS do_detail_id,
        dox.donotransaksi AS do_no,
        dox.dotgl AS do_date,
        dox.dostatus::bigint AS do_status_code,
        NULL AS do_status_name,
        dod.jml AS qty_do,
        dod.jmlbarang AS qty_do_base,
        dod.jmlrealisasi AS qty_realized_do
    FROM m5_do_detail dod
    JOIN m5_do dox
        ON dox.doid = dod.iddo
),
dr_line AS (
    SELECT
        drd.iddrdetail,
        NULLIF(drd.iddodetail, 0) AS iddodetail,
        NULLIF(drd.idpidetail, 0) AS idpidetail,
        dr.drid AS dr_header_id,
        drd.iddrdetail AS dr_detail_id,
        dr.drnotransaksi AS dr_no,
        dr.drtgl AS dr_date,
        dr.drstatus::bigint AS dr_status_code,
        NULL AS dr_status_name,
        drd.jml AS qty_dr,
        drd.jmlbarang AS qty_dr_base,
        drd.jmlbarangkembali AS qty_returned_dr
    FROM m5_dr_detail drd
    JOIN m5_dr dr
        ON dr.drid = drd.iddr
),
rnr_rollup AS (
    SELECT
        rnrd.idsidetail,
        COUNT(DISTINCT rnr.rnrid) AS rnr_doc_count,
        STRING_AGG(DISTINCT rnr.rnrnotransaksi, ', ' ORDER BY rnr.rnrnotransaksi) AS rnr_doc_nos,
        MIN(rnr.rnrtgl) AS first_rnr_date,
        MAX(rnr.rnrtgl) AS last_rnr_date,
        SUM(rnrd.jml) AS qty_rnr,
        SUM(rnrd.jmlbarang) AS qty_rnr_base,
        SUM(rnrd.jmlrealisasi) AS qty_realized_rnr
    FROM m5_rnr_detail rnrd
    JOIN m5_rnr rnr
        ON rnr.rnrid = rnrd.idrnr
    WHERE rnrd.idsidetail <> 0
    GROUP BY rnrd.idsidetail
),
sr_rollup AS (
    SELECT
        srd.idsidetail,
        COUNT(DISTINCT sr.srid) AS sr_doc_count,
        STRING_AGG(DISTINCT sr.srnotransaksi, ', ' ORDER BY sr.srnotransaksi) AS sr_doc_nos,
        MIN(sr.srtgl) AS first_sr_date,
        MAX(sr.srtgl) AS last_sr_date,
        STRING_AGG(DISTINCT rnr.rnrnotransaksi, ', ' ORDER BY rnr.rnrnotransaksi) AS source_rnr_doc_nos,
        SUM(srd.jml) AS qty_sr,
        SUM(srd.jmlbarang) AS qty_sr_base
    FROM m5_sr_detail srd
    JOIN m5_sr sr
        ON sr.srid = srd.idsr
    LEFT JOIN m5_rnr_detail rnrd
        ON rnrd.idrnrdetail = srd.idrnrdetail
    LEFT JOIN m5_rnr rnr
        ON rnr.rnrid = rnrd.idrnr
    WHERE srd.idsidetail <> 0
    GROUP BY srd.idsidetail
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
    a.doc_status_name,
    a.branch_code,
    a.branch_name,
    a.location_code,
    a.location_name,
    a.contact_id,
    a.contact_code,
    a.contact_name,
    a.sales_contact_id,
    a.sales_contact_code,
    a.sales_contact_name,
    a.item_id,
    a.item_code,
    a.item_name,
    a.line_no,
    a.uom_code,
    a.qty,
    a.qty_base,
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
    sq.sq_header_id,
    sq.sq_detail_id,
    sq.sq_no,
    sq.sq_date,
    sq.sq_status_code,
    sq.sq_status_name,
    sq.qty_sq,
    sq.qty_sq_base,
    sq.qty_realized_sq,
    so.so_header_id,
    so.so_detail_id,
    so.so_no,
    so.so_date,
    so.so_status_code,
    so.so_status_name,
    so.qty_so,
    so.qty_so_base,
    so.qty_realized_so,
    pi.pi_header_id,
    pi.pi_detail_id,
    pi.pi_no,
    pi.pi_date,
    pi.pi_status_code,
    pi.pi_status_name,
    pi.qty_pi,
    pi.qty_pi_base,
    pi.qty_realized_pi,
    pl.pl_header_id,
    pl.pl_detail_id,
    pl.pl_no,
    pl.pl_date,
    pl.pl_status_code,
    pl.pl_status_name,
    pl.qty_pl,
    pl.qty_pl_base,
    pl.qty_realized_pl,
    dox.do_header_id,
    dox.do_detail_id,
    dox.do_no,
    dox.do_date,
    dox.do_status_code,
    dox.do_status_name,
    dox.qty_do,
    dox.qty_do_base,
    dox.qty_realized_do,
    dr.dr_header_id,
    dr.dr_detail_id,
    dr.dr_no,
    dr.dr_date,
    dr.dr_status_code,
    dr.dr_status_name,
    dr.qty_dr,
    dr.qty_dr_base,
    dr.qty_returned_dr,
    rnr.rnr_doc_count,
    rnr.rnr_doc_nos,
    rnr.first_rnr_date,
    rnr.last_rnr_date,
    rnr.qty_rnr,
    rnr.qty_rnr_base,
    rnr.qty_realized_rnr,
    sr.sr_doc_count,
    sr.sr_doc_nos,
    sr.first_sr_date,
    sr.last_sr_date,
    sr.source_rnr_doc_nos,
    sr.qty_sr,
    sr.qty_sr_base,
    COALESCE(dr.dr_no, dox.do_no, pl.pl_no, pi.pi_no, so.so_no, sq.sq_no) AS upstream_doc_no,
    COALESCE(sr.sr_doc_nos, rnr.rnr_doc_nos) AS downstream_doc_no,
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
LEFT JOIN rnr_rollup rnr
    ON rnr.idsidetail = a.source_detail_id
LEFT JOIN sr_rollup sr
    ON sr.idsidetail = a.source_detail_id
) AS q;
