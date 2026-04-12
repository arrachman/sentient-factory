INSERT INTO public.dim_tax (tax_code, tax_name, tax_rate, purchase_account_code, sales_account_code, is_active, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT tkode, tnama, NULLIF(BTRIM(CAST(tnilai AS text)), '')::numeric(30,6), takunbeli, takunjual, taktif, tcatatan, _cdc_payload, 'baseline-dim-tax-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_tax
WHERE COALESCE(_cdc_deleted, false) = false;

