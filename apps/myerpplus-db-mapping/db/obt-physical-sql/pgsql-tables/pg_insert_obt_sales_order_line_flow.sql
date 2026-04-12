-- OBT for MyERPPlus sales order line flow.
-- Grain:
--   one row per m5_so_detail.idsodetail
-- Goal:
--   make SO-entered transactions visible immediately while still carrying
--   downstream PI, PL, DO, SI, DR, RNR, and SR rollups

INSERT INTO obt_sales_order_line_flow (
    source_module,
    obt_name,
    source_doc_type,
    source_header_id,
    source_detail_id,
    doc_no,
    doc_date,
    doc_status_code,
    doc_status_name,
    doc_notes,
    branch_code,
    branch_name,
    location_code,
    location_name,
    contact_id,
    contact_code,
    contact_name,
    sales_contact_id,
    sales_contact_code,
    sales_contact_name,
    item_id,
    item_code,
    item_name,
    line_no,
    uom_code,
    qty,
    qty_base,
    qty_realized,
    unit_price,
    discount_percent,
    discount_amount,
    amount,
    currency_code,
    exchange_rate,
    input_user_id,
    input_user_name,
    modified_user_id,
    modified_user_name,
    sq_header_id,
    sq_detail_id,
    sq_no,
    sq_date,
    sq_status_code,
    sq_status_name,
    qty_sq,
    qty_sq_base,
    qty_realized_sq,
    pi_doc_count,
    pi_doc_nos,
    first_pi_date,
    last_pi_date,
    qty_pi,
    qty_pi_base,
    qty_realized_pi,
    pl_doc_count,
    pl_doc_nos,
    first_pl_date,
    last_pl_date,
    qty_pl,
    qty_pl_base,
    qty_realized_pl,
    do_doc_count,
    do_doc_nos,
    first_do_date,
    last_do_date,
    qty_do,
    qty_do_base,
    qty_realized_do,
    si_doc_count,
    si_doc_nos,
    first_si_date,
    last_si_date,
    qty_si,
    qty_si_base,
    amount_si,
    dr_doc_count,
    dr_doc_nos,
    first_dr_date,
    last_dr_date,
    qty_dr,
    qty_dr_base,
    qty_returned_dr,
    rnr_doc_count,
    rnr_doc_nos,
    first_rnr_date,
    last_rnr_date,
    qty_rnr,
    qty_rnr_base,
    sr_doc_count,
    sr_doc_nos,
    first_sr_date,
    last_sr_date,
    qty_sr,
    qty_sr_base,
    upstream_doc_no,
    downstream_doc_no,
    lineage_path,
    etl_loaded_at
)
SELECT
    q.*,
    clock_timestamp() AS etl_loaded_at
FROM (
WITH so_anchor AS (
    SELECT
        'm5' AS source_module,
        'SO_LINE' AS source_doc_type,
        so.soid AS source_header_id,
        sod.idsodetail AS source_detail_id,
        so.sonotransaksi AS doc_no,
        so.sotgl AS doc_date,
        NULLIF(so.sostatus, '')::bigint AS doc_status_code,
        NULL::text AS doc_status_name,
        NULLIF(so.socatatan, '') AS doc_notes,
        so.socabang AS branch_code,
        br.bnama AS branch_name,
        so.solokasi AS location_code,
        lc.lnama AS location_name,
        NULLIF(so.socustomer, '')::bigint AS contact_id,
        cust.kkode AS contact_code,
        cust.knama AS contact_name,
        NULLIF(so.sobagianpenjualan, '')::bigint AS sales_contact_id,
        sales.kkode AS sales_contact_code,
        sales.knama AS sales_contact_name,
        sod.idbarang AS item_id,
        itm.bkode AS item_code,
        COALESCE(itm.bnama, sod.namabarang) AS item_name,
        NULLIF(sod.urutan, '')::bigint AS line_no,
        sod.satuan AS uom_code,
        sod.jml AS qty,
        sod.jmlbarang AS qty_base,
        sod.jmlrealisasi AS qty_realized,
        sod.harga AS unit_price,
        sod.diskon AS discount_percent,
        sod.jmldiskon AS discount_amount,
        ((sod.jml * sod.harga) - sod.jmldiskon) AS amount,
        so.somatauang AS currency_code,
        so.sokurs AS exchange_rate,
        NULL::bigint AS input_user_id,
        NULL::text AS input_user_name,
        NULLIF(so.somodifikasiuser, '')::bigint AS modified_user_id,
        user_mod.unama AS modified_user_name,
        NULLIF(sod.idsqdetail, 0) AS idsqdetail
    FROM m5_so_detail sod
    JOIN m5_so so
        ON so.soid = sod.idso
    LEFT JOIN m1_branch br
        ON br.bkode = so.socabang
    LEFT JOIN m1_location lc
        ON lc.lkode = so.solokasi
    LEFT JOIN m1_contact cust
        ON cust.kid = NULLIF(so.socustomer, '')::bigint
    LEFT JOIN m1_contact sales
        ON sales.kid = NULLIF(so.sobagianpenjualan, '')::bigint
    LEFT JOIN m1_item itm
        ON itm.bid = sod.idbarang
    LEFT JOIN m0_user user_mod
        ON user_mod.userid = NULLIF(so.somodifikasiuser, '')::bigint
),
sq_line AS (
    SELECT
        sqd.idsqdetail,
        sq.sqid AS sq_header_id,
        sqd.idsqdetail AS sq_detail_id,
        sq.sqnotransaksi AS sq_no,
        sq.sqtgl AS sq_date,
        NULLIF(sq.sqstatus::text, '')::bigint AS sq_status_code,
        NULL::text AS sq_status_name,
        sqd.jml AS qty_sq,
        sqd.jmlbarang AS qty_sq_base,
        sqd.jmlrealisasi AS qty_realized_sq
    FROM m5_sq_detail sqd
    JOIN m5_sq sq
        ON sq.sqid = sqd.idsq
),
pi_rollup AS (
    SELECT
        pid.idsodetail,
        COUNT(DISTINCT pi.piid) AS pi_doc_count,
        STRING_AGG(DISTINCT pi.pinotransaksi, ', ' ORDER BY pi.pinotransaksi) AS pi_doc_nos,
        MIN(pi.pitgl) AS first_pi_date,
        MAX(pi.pitgl) AS last_pi_date,
        SUM(pid.jml) AS qty_pi,
        SUM(pid.jmlbarang) AS qty_pi_base,
        SUM(pid.jmlrealisasi) AS qty_realized_pi
    FROM m5_pi_detail pid
    JOIN m5_pi pi
        ON pi.piid = pid.idpi
    WHERE pid.idsodetail IS NOT NULL
      AND pid.idsodetail <> 0
    GROUP BY pid.idsodetail
),
pl_rollup AS (
    SELECT
        pld.idsodetail,
        COUNT(DISTINCT pl.plid) AS pl_doc_count,
        STRING_AGG(DISTINCT pl.plnotransaksi, ', ' ORDER BY pl.plnotransaksi) AS pl_doc_nos,
        MIN(pl.pltgl) AS first_pl_date,
        MAX(pl.pltgl) AS last_pl_date,
        SUM(pld.jml) AS qty_pl,
        SUM(pld.jmlbarang) AS qty_pl_base,
        SUM(pld.jmlrealisasi) AS qty_realized_pl
    FROM m5_pl_detail pld
    JOIN m5_pl pl
        ON pl.plid = pld.idpl
    WHERE pld.idsodetail IS NOT NULL
      AND pld.idsodetail <> 0
    GROUP BY pld.idsodetail
),
do_rollup AS (
    SELECT
        dod.idsodetail,
        COUNT(DISTINCT dox.doid) AS do_doc_count,
        STRING_AGG(DISTINCT dox.donotransaksi, ', ' ORDER BY dox.donotransaksi) AS do_doc_nos,
        MIN(dox.dotgl) AS first_do_date,
        MAX(dox.dotgl) AS last_do_date,
        SUM(dod.jml) AS qty_do,
        SUM(dod.jmlbarang) AS qty_do_base,
        SUM(dod.jmlrealisasi) AS qty_realized_do
    FROM m5_do_detail dod
    JOIN m5_do dox
        ON dox.doid = dod.iddo
    WHERE dod.idsodetail IS NOT NULL
      AND dod.idsodetail <> 0
    GROUP BY dod.idsodetail
),
si_rollup AS (
    SELECT
        sid.idsodetail,
        COUNT(DISTINCT si.siid) AS si_doc_count,
        STRING_AGG(DISTINCT si.sinotransaksi, ', ' ORDER BY si.sinotransaksi) AS si_doc_nos,
        MIN(si.sitgl) AS first_si_date,
        MAX(si.sitgl) AS last_si_date,
        SUM(sid.jml) AS qty_si,
        SUM(sid.jmlbarang) AS qty_si_base,
        SUM((sid.jml * sid.harga) - sid.jmldiskon) AS amount_si
    FROM m5_si_detail sid
    JOIN m5_si si
        ON si.siid = sid.idsi
    WHERE sid.idsodetail IS NOT NULL
      AND sid.idsodetail <> 0
    GROUP BY sid.idsodetail
),
dr_rollup AS (
    SELECT
        COALESCE(dod.idsodetail, pid.idsodetail) AS idsodetail,
        COUNT(DISTINCT dr.drid) AS dr_doc_count,
        STRING_AGG(DISTINCT dr.drnotransaksi, ', ' ORDER BY dr.drnotransaksi) AS dr_doc_nos,
        MIN(dr.drtgl) AS first_dr_date,
        MAX(dr.drtgl) AS last_dr_date,
        SUM(drd.jml) AS qty_dr,
        SUM(drd.jmlbarang) AS qty_dr_base,
        SUM(drd.jmlbarangkembali) AS qty_returned_dr
    FROM m5_dr_detail drd
    JOIN m5_dr dr
        ON dr.drid = drd.iddr
    LEFT JOIN m5_do_detail dod
        ON dod.iddodetail = drd.iddodetail
    LEFT JOIN m5_pi_detail pid
        ON pid.idpidetail = drd.idpidetail
    WHERE COALESCE(dod.idsodetail, pid.idsodetail) IS NOT NULL
      AND COALESCE(dod.idsodetail, pid.idsodetail) <> 0
    GROUP BY COALESCE(dod.idsodetail, pid.idsodetail)
),
rnr_rollup AS (
    SELECT
        sid.idsodetail,
        COUNT(DISTINCT rnr.rnrid) AS rnr_doc_count,
        STRING_AGG(DISTINCT rnr.rnrnotransaksi, ', ' ORDER BY rnr.rnrnotransaksi) AS rnr_doc_nos,
        MIN(rnr.rnrtgl) AS first_rnr_date,
        MAX(rnr.rnrtgl) AS last_rnr_date,
        SUM(rnrd.jml) AS qty_rnr,
        SUM(rnrd.jmlbarang) AS qty_rnr_base
    FROM m5_rnr_detail rnrd
    JOIN m5_rnr rnr
        ON rnr.rnrid = rnrd.idrnr
    JOIN m5_si_detail sid
        ON sid.idsidetail = rnrd.idsidetail
    WHERE sid.idsodetail IS NOT NULL
      AND sid.idsodetail <> 0
    GROUP BY sid.idsodetail
),
sr_rollup AS (
    SELECT
        sid.idsodetail,
        COUNT(DISTINCT sr.srid) AS sr_doc_count,
        STRING_AGG(DISTINCT sr.srnotransaksi, ', ' ORDER BY sr.srnotransaksi) AS sr_doc_nos,
        MIN(sr.srtgl) AS first_sr_date,
        MAX(sr.srtgl) AS last_sr_date,
        SUM(srd.jml) AS qty_sr,
        SUM(srd.jmlbarang) AS qty_sr_base
    FROM m5_sr_detail srd
    JOIN m5_sr sr
        ON sr.srid = srd.idsr
    JOIN m5_si_detail sid
        ON sid.idsidetail = srd.idsidetail
    WHERE sid.idsodetail IS NOT NULL
      AND sid.idsodetail <> 0
    GROUP BY sid.idsodetail
)
SELECT
    a.source_module,
    'obt_sales_order_line_flow' AS obt_name,
    a.source_doc_type,
    a.source_header_id,
    a.source_detail_id,
    a.doc_no,
    a.doc_date,
    a.doc_status_code,
    a.doc_status_name,
    a.doc_notes,
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
    a.qty_realized,
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
    pi.pi_doc_count,
    pi.pi_doc_nos,
    pi.first_pi_date,
    pi.last_pi_date,
    pi.qty_pi,
    pi.qty_pi_base,
    pi.qty_realized_pi,
    pl.pl_doc_count,
    pl.pl_doc_nos,
    pl.first_pl_date,
    pl.last_pl_date,
    pl.qty_pl,
    pl.qty_pl_base,
    pl.qty_realized_pl,
    dox.do_doc_count,
    dox.do_doc_nos,
    dox.first_do_date,
    dox.last_do_date,
    dox.qty_do,
    dox.qty_do_base,
    dox.qty_realized_do,
    si.si_doc_count,
    si.si_doc_nos,
    si.first_si_date,
    si.last_si_date,
    si.qty_si,
    si.qty_si_base,
    si.amount_si,
    dr.dr_doc_count,
    dr.dr_doc_nos,
    dr.first_dr_date,
    dr.last_dr_date,
    dr.qty_dr,
    dr.qty_dr_base,
    dr.qty_returned_dr,
    rnr.rnr_doc_count,
    rnr.rnr_doc_nos,
    rnr.first_rnr_date,
    rnr.last_rnr_date,
    rnr.qty_rnr,
    rnr.qty_rnr_base,
    sr.sr_doc_count,
    sr.sr_doc_nos,
    sr.first_sr_date,
    sr.last_sr_date,
    sr.qty_sr,
    sr.qty_sr_base,
    sq.sq_no AS upstream_doc_no,
    COALESCE(si.si_doc_nos, dox.do_doc_nos, pl.pl_doc_nos, pi.pi_doc_nos) AS downstream_doc_no,
    'SQ>SO>[PI|PL|DO|SI|DR|RNR|SR]' AS lineage_path
FROM so_anchor a
LEFT JOIN sq_line sq
    ON sq.idsqdetail = a.idsqdetail
LEFT JOIN pi_rollup pi
    ON pi.idsodetail = a.source_detail_id
LEFT JOIN pl_rollup pl
    ON pl.idsodetail = a.source_detail_id
LEFT JOIN do_rollup dox
    ON dox.idsodetail = a.source_detail_id
LEFT JOIN si_rollup si
    ON si.idsodetail = a.source_detail_id
LEFT JOIN dr_rollup dr
    ON dr.idsodetail = a.source_detail_id
LEFT JOIN rnr_rollup rnr
    ON rnr.idsodetail = a.source_detail_id
LEFT JOIN sr_rollup sr
    ON sr.idsodetail = a.source_detail_id
) AS q;
