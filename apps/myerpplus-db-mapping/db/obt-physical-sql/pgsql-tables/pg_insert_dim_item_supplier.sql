INSERT INTO public.dim_item_supplier (item_id, contact_id, supplier_order, notes, etl_batch_id, etl_loaded_at, etl_updated_at, source_payload)
SELECT isidbarang, isidkontak, NULLIF(BTRIM(CAST(isurutan AS text)), '')::numeric(30,6)::bigint, iscatatan,
       'baseline-dim-item-supplier-v1', clock_timestamp(), clock_timestamp(), _cdc_payload
FROM myerpplus_landing.m1_item_supplier
WHERE COALESCE(_cdc_deleted, false) = false;

