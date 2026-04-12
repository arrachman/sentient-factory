INSERT INTO public.dim_other_cost (other_cost_code, other_cost_name, debit_account_code, credit_account_code, contact_id, include_in_cogs, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT ockode, ocnama, ocrekdebit, ocrekkredit, ockontak, NULLIF(BTRIM(CAST(octermasukhpp AS text)), '')::numeric(30,6)::bigint, occatatan, _cdc_payload, 'baseline-dim-other-cost-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_other_cost
WHERE COALESCE(_cdc_deleted, false) = false;

