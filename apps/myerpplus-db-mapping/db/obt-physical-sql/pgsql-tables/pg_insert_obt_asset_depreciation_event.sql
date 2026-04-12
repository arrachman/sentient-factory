TRUNCATE TABLE public.obt_asset_depreciation_event;

INSERT INTO public.obt_asset_depreciation_event (
    obt_name, source_module, source_doc_type, source_header_id, source_detail_id, doc_no, doc_date,
    branch_code, location_code, item_id, qty, amount, currency_code, input_user_id, source_payload,
    etl_batch_id, etl_loaded_at, etl_updated_at
)
SELECT
    'obt_asset_depreciation_event','m7','DA',da.daid::text,dad.iddadetail::text,
    COALESCE(da.danotransaksi, da.daautonotransaksi), da.datgl, da.dacabang, da.dalokasi,
    dad.idaset::text, dad.penyusutanke, dad.nilaipenyusutan, dad.matauang, da.dainputuser,
    COALESCE(dad._cdc_payload, da._cdc_payload), 'baseline-m7-asset-depr-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m7_da da
JOIN myerpplus_landing.m7_da_detail dad ON da.daid = dad.idda
WHERE COALESCE(da._cdc_deleted, false) = false AND COALESCE(dad._cdc_deleted, false) = false;
