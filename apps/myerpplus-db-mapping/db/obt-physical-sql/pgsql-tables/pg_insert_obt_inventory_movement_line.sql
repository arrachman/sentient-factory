-- Canonical inventory movement OBT at line grain.
-- Current baseline covers transfer stock, stock opname, and stock adjustment families.

INSERT INTO public.obt_inventory_movement_line (
    obt_name,
    source_module,
    source_doc_type,
    source_header_id,
    source_detail_id,
    source_allocation_id,
    doc_no,
    doc_date,
    doc_status_code,
    doc_status_name,
    branch_code,
    branch_name,
    location_code,
    location_name,
    contact_id,
    contact_code,
    contact_name,
    item_id,
    item_code,
    item_name,
    uom_code,
    upstream_doc_no,
    downstream_doc_no,
    lineage_path,
    qty,
    amount,
    currency_code,
    exchange_rate,
    input_user_id,
    input_user_name,
    modified_user_id,
    modified_user_name,
    source_payload,
    etl_batch_id,
    etl_loaded_at,
    etl_updated_at
)
SELECT
    'obt_inventory_movement_line' AS obt_name,
    source_module,
    source_doc_type,
    source_header_id,
    source_detail_id,
    NULL::text AS source_allocation_id,
    doc_no,
    doc_date,
    doc_status_code,
    NULL::text AS doc_status_name,
    branch_code,
    branch_name,
    location_code,
    location_name,
    NULL::text AS contact_id,
    NULL::text AS contact_code,
    NULL::text AS contact_name,
    item_id,
    item_code,
    item_name,
    uom_code,
    upstream_doc_no,
    downstream_doc_no,
    lineage_path,
    qty,
    amount,
    'IDR'::text AS currency_code,
    1::numeric(20,6) AS exchange_rate,
    NULL::text AS input_user_id,
    NULL::text AS input_user_name,
    NULL::text AS modified_user_id,
    NULL::text AS modified_user_name,
    source_payload,
    'baseline-inventory-line-v1' AS etl_batch_id,
    clock_timestamp() AS etl_loaded_at,
    clock_timestamp() AS etl_updated_at
FROM (
    SELECT
        'm3'::text AS source_module,
        'MR_LINE'::text AS source_doc_type,
        mr.mrid::text AS source_header_id,
        mrd.idmrdetail::text AS source_detail_id,
        mr.mrnotransaksi AS doc_no,
        mr.mrtgl AS doc_date,
        mr.mrstatus AS doc_status_code,
        mr.mrcabang AS branch_code,
        br.bnama AS branch_name,
        mr.mrlokasi AS location_code,
        lc.lnama AS location_name,
        mrd.idbarang::text AS item_id,
        itm.bkode AS item_code,
        COALESCE(itm.bnama, mrd.namabarang) AS item_name,
        COALESCE(NULLIF(mrd.satuanbarang, ''), mrd.satuan) AS uom_code,
        wh_from.wnama AS upstream_doc_no,
        wh_to.wnama AS downstream_doc_no,
        'INVENTORY>MR'::text AS lineage_path,
        COALESCE(NULLIF(mrd.jmlbarang::text, '')::numeric(20,6), NULLIF(mrd.jml::text, '')::numeric(20,6)) AS qty,
        (
            COALESCE(NULLIF(mrd.jmlbarang::text, '')::numeric(20,6), NULLIF(mrd.jml::text, '')::numeric(20,6)) *
            COALESCE(NULLIF(mrd.nilaisatuan::text, '')::numeric(20,6), 0::numeric(20,6))
        ) AS amount,
        mrd._cdc_payload AS source_payload
    FROM m3_mr_detail mrd
    JOIN m3_mr mr ON mr.mrid = mrd.idmr
    LEFT JOIN m1_branch br ON br.bkode = mr.mrcabang
    LEFT JOIN m1_location lc ON lc.lkode = mr.mrlokasi
    LEFT JOIN m1_item itm ON itm.bid = mrd.idbarang
    LEFT JOIN m1_warehouse wh_from ON wh_from.wkode = COALESCE(NULLIF(mrd.gudangasal, ''), mr.mrgudangasal)
    LEFT JOIN m1_warehouse wh_to ON wh_to.wkode = COALESCE(NULLIF(mrd.gudangtujuan, ''), mr.mrgudangtujuan)
    WHERE COALESCE(mr._cdc_deleted, false) = false
      AND COALESCE(mrd._cdc_deleted, false) = false

    UNION ALL

    SELECT
        'm3'::text AS source_module,
        'TS_LINE'::text AS source_doc_type,
        ts.tsid::text AS source_header_id,
        tsd.idtsdetail::text AS source_detail_id,
        ts.tsnotransaksi AS doc_no,
        ts.tstgl AS doc_date,
        ts.tsstatus AS doc_status_code,
        ts.tscabang AS branch_code,
        br.bnama AS branch_name,
        ts.tslokasi AS location_code,
        lc.lnama AS location_name,
        tsd.idbarang::text AS item_id,
        itm.bkode AS item_code,
        COALESCE(itm.bnama, tsd.namabarang) AS item_name,
        COALESCE(NULLIF(tsd.satuanbarang, ''), tsd.satuan) AS uom_code,
        wh_from.wnama AS upstream_doc_no,
        wh_to.wnama AS downstream_doc_no,
        'INVENTORY>TS'::text AS lineage_path,
        COALESCE(NULLIF(tsd.jmlbarang::text, '')::numeric(20,6), 0::numeric(20,6)) AS qty,
        (
            COALESCE(NULLIF(tsd.jmlbarang::text, '')::numeric(20,6), 0::numeric(20,6)) *
            COALESCE(NULLIF(tsd.nilaisatuan::text, '')::numeric(20,6), 0::numeric(20,6))
        ) AS amount,
        tsd._cdc_payload AS source_payload
    FROM m3_ts_detail tsd
    JOIN m3_ts ts ON ts.tsid = tsd.idts
    LEFT JOIN m1_branch br ON br.bkode = ts.tscabang
    LEFT JOIN m1_location lc ON lc.lkode = ts.tslokasi
    LEFT JOIN m1_item itm ON itm.bid = tsd.idbarang
    LEFT JOIN m1_warehouse wh_from ON wh_from.wkode = tsd.gudangasal
    LEFT JOIN m1_warehouse wh_to ON wh_to.wkode = tsd.gudangtujuan
    WHERE COALESCE(ts._cdc_deleted, false) = false
      AND COALESCE(tsd._cdc_deleted, false) = false

    UNION ALL

    SELECT
        'm3',
        'RS_LINE',
        rs.rsid::text,
        rsd.idrsdetail::text,
        rs.rsnotransaksi,
        rs.rstgl,
        rs.rsstatus,
        rs.rscabang,
        br.bnama,
        rs.rslokasi,
        lc.lnama,
        rsd.idbarang::text,
        itm.bkode,
        COALESCE(itm.bnama, rsd.namabarang),
        COALESCE(NULLIF(rsd.satuanbarang, ''), rsd.satuan),
        wh_from.wnama,
        wh_to.wnama,
        'INVENTORY>RS',
        COALESCE(NULLIF(rsd.jmlbarang::text, '')::numeric(20,6), NULLIF(rsd.jml::text, '')::numeric(20,6)),
        (
            COALESCE(NULLIF(rsd.jmlbarang::text, '')::numeric(20,6), NULLIF(rsd.jml::text, '')::numeric(20,6)) *
            COALESCE(NULLIF(rsd.nilaisatuan::text, '')::numeric(20,6), 0::numeric(20,6))
        ),
        rsd._cdc_payload
    FROM m3_rs_detail rsd
    JOIN m3_rs rs ON rs.rsid = rsd.idrs
    LEFT JOIN m1_branch br ON br.bkode = rs.rscabang
    LEFT JOIN m1_location lc ON lc.lkode = rs.rslokasi
    LEFT JOIN m1_item itm ON itm.bid = rsd.idbarang
    LEFT JOIN m1_warehouse wh_from ON wh_from.wkode = COALESCE(NULLIF(rsd.gudangasal, ''), rs.rsgudangasal)
    LEFT JOIN m1_warehouse wh_to ON wh_to.wkode = COALESCE(NULLIF(rsd.gudangtujuan, ''), rs.rsgudangtujuan)
    WHERE COALESCE(rs._cdc_deleted, false) = false
      AND COALESCE(rsd._cdc_deleted, false) = false

    UNION ALL

    SELECT
        'm3',
        'SP_LINE',
        sp.spid::text,
        spd.idspdetail::text,
        sp.spnotransaksi,
        sp.sptgl,
        sp.spstatus,
        sp.spcabang,
        br.bnama,
        sp.splokasi,
        lc.lnama,
        spd.idbarang::text,
        itm.bkode,
        COALESCE(itm.bnama, spd.namabarang),
        COALESCE(NULLIF(spd.satuanbarang, ''), spd.satuan),
        wh.wnama,
        NULL::text,
        'INVENTORY>SP',
        NULLIF(spd.selisihbarang::text, '')::numeric(20,6),
        (
            NULLIF(spd.selisihbarang::text, '')::numeric(20,6) *
            COALESCE(NULLIF(spd.nilaisatuan::text, '')::numeric(20,6), 0::numeric(20,6))
        ),
        spd._cdc_payload
    FROM m3_sp_detail spd
    JOIN m3_sp sp ON sp.spid = spd.idsp
    LEFT JOIN m1_branch br ON br.bkode = sp.spcabang
    LEFT JOIN m1_location lc ON lc.lkode = sp.splokasi
    LEFT JOIN m1_item itm ON itm.bid = spd.idbarang
    LEFT JOIN m1_warehouse wh ON wh.wkode = spd.gudang
    WHERE COALESCE(sp._cdc_deleted, false) = false
      AND COALESCE(spd._cdc_deleted, false) = false

    UNION ALL

    SELECT
        'm3',
        'SA_LINE',
        sa.said::text,
        sad.idsadetail::text,
        sa.sanotransaksi,
        sa.satgl,
        sa.sastatus,
        sa.sacabang,
        br.bnama,
        sa.salokasi,
        lc.lnama,
        sad.idbarang::text,
        itm.bkode,
        COALESCE(itm.bnama, sad.namabarang),
        COALESCE(NULLIF(sad.satuanbarang, ''), sad.satuan),
        NULL::text,
        wh.wnama,
        'INVENTORY>SA',
        (
            COALESCE(NULLIF(sad.jmlbarangmasuk::text, '')::numeric(20,6), 0::numeric(20,6)) -
            COALESCE(NULLIF(sad.jmlbarangkeluar::text, '')::numeric(20,6), 0::numeric(20,6))
        ),
        (
            (
                COALESCE(NULLIF(sad.jmlbarangmasuk::text, '')::numeric(20,6), 0::numeric(20,6)) -
                COALESCE(NULLIF(sad.jmlbarangkeluar::text, '')::numeric(20,6), 0::numeric(20,6))
            ) *
            COALESCE(
                NULLIF(sad.hpp::text, '')::numeric(20,6),
                NULLIF(sad.hpplama::text, '')::numeric(20,6),
                NULLIF(sad.nilaisatuan::text, '')::numeric(20,6),
                0::numeric(20,6)
            )
        ),
        sad._cdc_payload
    FROM m3_sa_detail sad
    JOIN m3_sa sa ON sa.said = sad.idsa
    LEFT JOIN m1_branch br ON br.bkode = sa.sacabang
    LEFT JOIN m1_location lc ON lc.lkode = sa.salokasi
    LEFT JOIN m1_item itm ON itm.bid = sad.idbarang
    LEFT JOIN m1_warehouse wh ON wh.wkode = sad.gudang
    WHERE COALESCE(sa._cdc_deleted, false) = false
      AND COALESCE(sad._cdc_deleted, false) = false
) AS q;
