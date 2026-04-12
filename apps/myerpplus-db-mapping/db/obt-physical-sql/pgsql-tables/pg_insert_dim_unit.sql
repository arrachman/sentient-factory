INSERT INTO public.dim_unit (unit_code, unit_name, conversion_value, is_active, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT ukode, unama, NULLIF(BTRIM(CAST(unilai AS text)), '')::numeric(30,6), uaktif, uketerangan, _cdc_payload, 'baseline-dim-unit-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_unit
WHERE COALESCE(_cdc_deleted, false) = false;

