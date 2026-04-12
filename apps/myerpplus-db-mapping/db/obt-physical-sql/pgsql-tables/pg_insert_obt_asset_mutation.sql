TRUNCATE TABLE public.obt_asset_mutation;

INSERT INTO public.obt_asset_mutation (
    obt_name, source_module, source_doc_type, source_header_id, source_detail_id, doc_no, doc_date,
    branch_code, location_code, item_id, item_name, qty, amount, currency_code, input_user_id, source_payload,
    etl_batch_id, etl_loaded_at, etl_updated_at
)
SELECT
    'obt_asset_mutation','m7','AT',at.atid::text,atd.idatdetail::text,
    COALESCE(at.atnotransaksi, at.atautonotransaksi), at.attgl, at.atcabang, at.atlokasi,
    atd.idtransaksi::text, NULL, 1, COALESCE(atd.jmlbayar,0), atd.matauang, at.atinputuser,
    COALESCE(atd._cdc_payload, at._cdc_payload), 'baseline-m7-asset-mutation-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m7_at at
JOIN myerpplus_landing.m7_at_detail atd ON at.atid = atd.idat
WHERE COALESCE(at._cdc_deleted, false) = false AND COALESCE(atd._cdc_deleted, false) = false
UNION ALL
SELECT
    'obt_asset_mutation','m7','AG',ag.agid::text,agd.idagdetail::text,
    COALESCE(ag.agnotransaksi, ag.agautonotransaksi), ag.agtgl, COALESCE(agd.cabang, ag.agcabang), ag.aglokasi,
    agd.idasset::text, agd.namaasset, agd.jml, COALESCE(agd.hargabeli,0) * COALESCE(agd.jml,0), agd.matauang, ag.aginputuser,
    COALESCE(agd._cdc_payload, ag._cdc_payload), 'baseline-m7-asset-mutation-v1', clock_timestamp(), clock_timestamp()
FROM myerpplus_landing.m7_ag ag
JOIN myerpplus_landing.m7_ag_detail agd ON ag.agid = agd.idag
WHERE COALESCE(ag._cdc_deleted, false) = false AND COALESCE(agd._cdc_deleted, false) = false;
