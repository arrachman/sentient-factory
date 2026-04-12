INSERT INTO public.obt_inventory_document_event (
    inventory_event_key,
    source_module,
    source_doc_type,
    source_header_id,
    doc_no,
    doc_date,
    doc_status_code,
    previous_status_code,
    branch_code,
    branch_name,
    location_code,
    location_name,
    warehouse_from_code,
    warehouse_from_name,
    warehouse_transit_code,
    warehouse_transit_name,
    warehouse_to_code,
    warehouse_to_name,
    description,
    notes,
    reference_doc_no,
    reference_doc_date,
    source_payload,
    etl_batch_id,
    etl_loaded_at,
    etl_updated_at
)
SELECT
    q.inventory_event_key,
    'm3',
    q.source_doc_type,
    q.source_header_id,
    q.doc_no,
    q.doc_date,
    q.doc_status_code,
    q.previous_status_code,
    q.branch_code,
    q.branch_name,
    q.location_code,
    q.location_name,
    q.warehouse_from_code,
    wf.wnama AS warehouse_from_name,
    q.warehouse_transit_code,
    wt.wnama AS warehouse_transit_name,
    q.warehouse_to_code,
    wto.wnama AS warehouse_to_name,
    q.description,
    q.notes,
    q.reference_doc_no,
    q.reference_doc_date,
    q.source_payload,
    'baseline-inventory-header-v1',
    clock_timestamp(),
    clock_timestamp()
FROM (
    SELECT 'TS:' || tsid::text AS inventory_event_key, 'TS'::text AS source_doc_type, tsid::text AS source_header_id, tsnotransaksi AS doc_no, tstgl AS doc_date, tsstatus AS doc_status_code, tsstatussebelumnya AS previous_status_code, tscabang AS branch_code, br.bnama AS branch_name, tslokasi AS location_code, lc.lnama AS location_name, tsgudangasal AS warehouse_from_code, tsgudangtransit AS warehouse_transit_code, tsgudangtujuan AS warehouse_to_code, tsuraian AS description, tscatatan AS notes, tsnoref AS reference_doc_no, tstglnoref AS reference_doc_date, ts._cdc_payload AS source_payload
    FROM m3_ts ts
    LEFT JOIN m1_branch br ON br.bkode = ts.tscabang
    LEFT JOIN m1_location lc ON lc.lkode = ts.tslokasi
    WHERE COALESCE(ts._cdc_deleted, false) = false
    UNION ALL
    SELECT 'SA:' || said::text, 'SA', said::text, sanotransaksi, satgl, sastatus, sastatussebelumnya, sacabang, br.bnama, salokasi, lc.lnama, sagudang, NULL::text, sagudang, sauraian, sacatatan, sanoref, satglnoref, sa._cdc_payload
    FROM m3_sa sa
    LEFT JOIN m1_branch br ON br.bkode = sa.sacabang
    LEFT JOIN m1_location lc ON lc.lkode = sa.salokasi
    WHERE COALESCE(sa._cdc_deleted, false) = false
    UNION ALL
    SELECT 'SP:' || spid::text, 'SP', spid::text, spnotransaksi, sptgl, spstatus, spstatussebelumnya, spcabang, br.bnama, splokasi, lc.lnama, spgudang, NULL::text, spgudang, spuraian, spcatatan, spnoref, sptglnoref, sp._cdc_payload
    FROM m3_sp sp
    LEFT JOIN m1_branch br ON br.bkode = sp.spcabang
    LEFT JOIN m1_location lc ON lc.lkode = sp.splokasi
    WHERE COALESCE(sp._cdc_deleted, false) = false
    UNION ALL
    SELECT 'IB:' || ibid::text, 'IB', ibid::text, ibnotransaksi, ibtgl, ibstatus, ibstatussebelumnya, ibcabang, br.bnama, iblokasi, lc.lnama, ibgudang, NULL::text, ibgudang, iburaian, ibcatatan, ibnoref, ibtglnoref, ib._cdc_payload
    FROM m3_ib ib
    LEFT JOIN m1_branch br ON br.bkode = ib.ibcabang
    LEFT JOIN m1_location lc ON lc.lkode = ib.iblokasi
    WHERE COALESCE(ib._cdc_deleted, false) = false
) q
LEFT JOIN m1_warehouse wf ON wf.wkode = q.warehouse_from_code
LEFT JOIN m1_warehouse wt ON wt.wkode = q.warehouse_transit_code
LEFT JOIN m1_warehouse wto ON wto.wkode = q.warehouse_to_code;
