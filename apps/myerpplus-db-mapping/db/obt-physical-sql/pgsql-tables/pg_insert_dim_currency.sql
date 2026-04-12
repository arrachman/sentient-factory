INSERT INTO public.dim_currency (currency_code, currency_name, symbol, exchange_rate, is_active, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT ckode, cnama, csimbol, NULLIF(BTRIM(CAST(ckurs AS text)), '')::numeric(30,6), caktif, ccatatan, _cdc_payload, 'baseline-dim-currency-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_currency
WHERE COALESCE(_cdc_deleted, false) = false;

