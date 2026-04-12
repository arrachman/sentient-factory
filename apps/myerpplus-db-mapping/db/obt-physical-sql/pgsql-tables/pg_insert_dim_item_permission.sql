INSERT INTO public.dim_item_permission (permission_code, permission_name, can_sell, can_transfer_hq, can_transfer_request, can_branch_transfer, can_supplier_return, can_purchase_request, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT ipkode, ipnama,
       NULLIF(BTRIM(CAST(ipjual AS text)), '')::numeric(30,6)::bigint,
       NULLIF(BTRIM(CAST(ipmutasipusat AS text)), '')::numeric(30,6)::bigint,
       NULLIF(BTRIM(CAST(ippermintaanmutasi AS text)), '')::numeric(30,6)::bigint,
       NULLIF(BTRIM(CAST(ipmutasicabang AS text)), '')::numeric(30,6)::bigint,
       NULLIF(BTRIM(CAST(ipretursupplier AS text)), '')::numeric(30,6)::bigint,
       NULLIF(BTRIM(CAST(ippermintaanpembelian AS text)), '')::numeric(30,6)::bigint,
       ipcatatan, _cdc_payload, 'baseline-dim-item-permission-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_item_permission
WHERE COALESCE(_cdc_deleted, false) = false;

