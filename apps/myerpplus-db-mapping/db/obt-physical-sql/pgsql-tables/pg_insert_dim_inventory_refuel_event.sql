INSERT INTO public.dim_inventory_refuel_event (
    refuel_event_key, doc_no, doc_date, branch_code, location_code, warehouse_from_code, warehouse_to_code, item_id, item_name, qty, amount, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at
)
SELECT
    rf.rfid::text || ':' || rfd.idrfdetail::text,
    rf.rfnotransaksi,
    rf.rftgl,
    rf.rfcabang,
    rf.rflokasi,
    rf.rfgudangasal,
    rf.rfgudangtujuan,
    rfd.idbarang::text,
    rfd.namabarang,
    COALESCE(rfd.jmlbarang, rfd.jml),
    COALESCE(rfd.jmlbarang, rfd.jml) * COALESCE(rfd.nilaisatuan, 0),
    rfd.catatan,
    rfd._cdc_payload,
    'baseline-inventory-refuel-v1',
    clock_timestamp(),
    clock_timestamp()
FROM myerpplus_landing.m3_rf rf
JOIN myerpplus_landing.m3_rf_detail rfd ON rf.rfid = rfd.idrf
WHERE COALESCE(rf._cdc_deleted, false) = false AND COALESCE(rfd._cdc_deleted, false) = false;
