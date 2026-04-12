INSERT INTO public.dim_contact_price (contact_id, item_id, uom_code, buy_price, sell_price, effective_from, effective_to, notes, etl_batch_id, etl_loaded_at, etl_updated_at, source_payload)
SELECT khidkontak, khidbarang, khsatuan,
       NULLIF(BTRIM(CAST(khhargabeli AS text)), '')::numeric(30,6),
       NULLIF(BTRIM(CAST(khhargajual AS text)), '')::numeric(30,6),
       khberlakudari, khberlakusampai, khcatatan,
       'baseline-dim-contact-price-v1', clock_timestamp(), clock_timestamp(), _cdc_payload
FROM myerpplus_landing.m1_contact_price
WHERE COALESCE(_cdc_deleted, false) = false;

