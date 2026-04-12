INSERT INTO public.dim_item_category (category_code, category_name, division_code, subdivision_code, inventory_account_code, cogs_account_code, sales_account_code, is_active, notes, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at)
SELECT ickode, icnama, icdivisi, icsubdivisi, icrekpersediaan, icrekhargapokok, icrekpenjualan, icaktif, iccatatan, _cdc_payload, 'baseline-dim-item-category-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m1_item_category
WHERE COALESCE(_cdc_deleted, false) = false;

