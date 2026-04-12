INSERT INTO public.dim_inventory_price_setup (
    price_setup_key, doc_no, doc_date, valid_to, category_code, branch_code, location_code, warehouse_code, item_id, contact_id, uom_code, currency_code, price_1, price_2, price_3, price_4, price_5, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at
)
SELECT
    pa.paid::text || ':' || pad.idpadetail::text,
    pa.panotransaksi,
    pa.patgl,
    pa.patglberlakusampai,
    pa.pakategoriharga,
    pa.pacabang,
    pa.palokasi,
    pa.pagudang,
    pad.idbarang::text,
    pad.kontak::text,
    COALESCE(pad.satuanbarang, pad.satuan),
    pad.matauang,
    pad.hargajual1,
    pad.hargajual2,
    pad.hargajual3,
    pad.hargajual4,
    pad.hargajual5,
    pad._cdc_payload,
    'baseline-inventory-price-setup-v1',
    clock_timestamp(),
    clock_timestamp()
FROM myerpplus_landing.m3_pa pa
JOIN myerpplus_landing.m3_pa_detail pad ON pa.paid = pad.idpa
WHERE COALESCE(pa._cdc_deleted, false) = false AND COALESCE(pad._cdc_deleted, false) = false;
