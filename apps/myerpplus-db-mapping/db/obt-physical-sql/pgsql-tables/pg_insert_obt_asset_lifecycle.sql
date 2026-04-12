TRUNCATE TABLE public.obt_asset_lifecycle;

INSERT INTO public.obt_asset_lifecycle (
    obt_name, source_module, source_doc_type, source_header_id, source_detail_id,
    doc_no, doc_date, branch_code, location_code, item_id, item_name, qty, amount,
    currency_code, input_user_id, source_payload, etl_batch_id, etl_loaded_at, etl_updated_at
)
SELECT
    'obt_asset_lifecycle','m7','ASSET',a.aid::text,a.aid::text,
    a.anomor,a.ainputtgl,a.acabang,a.alokasi,a.aid::text,NULL,1,COALESCE(a.aharga,a.ahargabeli),a.amatauang,a.ainputuser,a._cdc_payload,'baseline-m7-asset-lifecycle-v1',clock_timestamp(),clock_timestamp()
FROM myerpplus_landing.m7_asset a
WHERE COALESCE(a._cdc_deleted, false) = false
UNION ALL
SELECT
    'obt_asset_lifecycle','m7','AR',ar.arid::text,ard.idardetail::text,
    COALESCE(ar.arnotransaksi, ar.arautonotransaksi), ar.artgl, COALESCE(ard.cabang, ar.arcabang), ar.arlokasi, ard.idasset::text, ard.namaasset,
    ard.jml, COALESCE(ard.harga,0) * COALESCE(ard.jml,0), ard.matauang, ar.arinputuser, COALESCE(ard._cdc_payload, ar._cdc_payload), 'baseline-m7-asset-lifecycle-v1',clock_timestamp(),clock_timestamp()
FROM myerpplus_landing.m7_ar ar JOIN myerpplus_landing.m7_ar_detail ard ON ar.arid = ard.idar
WHERE COALESCE(ar._cdc_deleted, false) = false AND COALESCE(ard._cdc_deleted, false) = false
UNION ALL
SELECT
    'obt_asset_lifecycle','m7','AQ',aq.aqid::text,aqd.idaqdetail::text,
    COALESCE(aq.aqnotransaksi, aq.aqautonotransaksi), aq.aqtgl, COALESCE(aqd.cabang, aq.aqcabang), aq.aqlokasi, aqd.idasset::text, aqd.namaasset,
    aqd.jml, COALESCE(aqd.harga,0) * COALESCE(aqd.jml,0), aqd.matauang, aq.aqinputuser, COALESCE(aqd._cdc_payload, aq._cdc_payload), 'baseline-m7-asset-lifecycle-v1',clock_timestamp(),clock_timestamp()
FROM myerpplus_landing.m7_aq aq JOIN myerpplus_landing.m7_aq_detail aqd ON aq.aqid = aqd.idaq
WHERE COALESCE(aq._cdc_deleted, false) = false AND COALESCE(aqd._cdc_deleted, false) = false
UNION ALL
SELECT
    'obt_asset_lifecycle','m7','AO',ao.aoid::text,aod.idaodetail::text,
    COALESCE(ao.aonotransaksi, ao.aoautonotransaksi), ao.aotgl, COALESCE(aod.cabang, ao.aocabang), ao.aolokasi, aod.idasset::text, aod.namaasset,
    aod.jml, COALESCE(aod.harga,0) * COALESCE(aod.jml,0), aod.matauang, ao.aoinputuser, COALESCE(aod._cdc_payload, ao._cdc_payload), 'baseline-m7-asset-lifecycle-v1',clock_timestamp(),clock_timestamp()
FROM myerpplus_landing.m7_ao ao JOIN myerpplus_landing.m7_ao_detail aod ON ao.aoid = aod.idao
WHERE COALESCE(ao._cdc_deleted, false) = false AND COALESCE(aod._cdc_deleted, false) = false
UNION ALL
SELECT
    'obt_asset_lifecycle','m7','AE',ae.aeid::text,aed.idaedetail::text,
    COALESCE(ae.aenotransaksi, ae.aeautonotransaksi), ae.aetgl, COALESCE(aed.cabang, ae.aecabang), ae.aelokasi, aed.idasset::text, aed.namaasset,
    aed.jml, COALESCE(aed.harga,0) * COALESCE(aed.jml,0), aed.matauang, ae.aeinputuser, COALESCE(aed._cdc_payload, ae._cdc_payload), 'baseline-m7-asset-lifecycle-v1',clock_timestamp(),clock_timestamp()
FROM myerpplus_landing.m7_ae ae JOIN myerpplus_landing.m7_ae_detail aed ON ae.aeid = aed.idae
WHERE COALESCE(ae._cdc_deleted, false) = false AND COALESCE(aed._cdc_deleted, false) = false
UNION ALL
SELECT
    'obt_asset_lifecycle','m7','AT',at.atid::text,atd.idatdetail::text,
    COALESCE(at.atnotransaksi, at.atautonotransaksi), at.attgl, at.atcabang, at.atlokasi, atd.idtransaksi::text, NULL,
    1, COALESCE(atd.jmlbayar,0), atd.matauang, at.atinputuser, COALESCE(atd._cdc_payload, at._cdc_payload), 'baseline-m7-asset-lifecycle-v1',clock_timestamp(),clock_timestamp()
FROM myerpplus_landing.m7_at at JOIN myerpplus_landing.m7_at_detail atd ON at.atid = atd.idat
WHERE COALESCE(at._cdc_deleted, false) = false AND COALESCE(atd._cdc_deleted, false) = false
UNION ALL
SELECT
    'obt_asset_lifecycle','m7','AG',ag.agid::text,agd.idagdetail::text,
    COALESCE(ag.agnotransaksi, ag.agautonotransaksi), ag.agtgl, COALESCE(agd.cabang, ag.agcabang), ag.aglokasi, agd.idasset::text, agd.namaasset,
    agd.jml, COALESCE(agd.hargabeli,0) * COALESCE(agd.jml,0), agd.matauang, ag.aginputuser, COALESCE(agd._cdc_payload, ag._cdc_payload), 'baseline-m7-asset-lifecycle-v1',clock_timestamp(),clock_timestamp()
FROM myerpplus_landing.m7_ag ag JOIN myerpplus_landing.m7_ag_detail agd ON ag.agid = agd.idag
WHERE COALESCE(ag._cdc_deleted, false) = false AND COALESCE(agd._cdc_deleted, false) = false
UNION ALL
SELECT
    'obt_asset_lifecycle','m7','DA',da.daid::text,dad.iddadetail::text,
    COALESCE(da.danotransaksi, da.daautonotransaksi), da.datgl, da.dacabang, da.dalokasi, dad.idaset::text, NULL,
    NULL, dad.nilaipenyusutan, dad.matauang, da.dainputuser, COALESCE(dad._cdc_payload, da._cdc_payload), 'baseline-m7-asset-lifecycle-v1',clock_timestamp(),clock_timestamp()
FROM myerpplus_landing.m7_da da JOIN myerpplus_landing.m7_da_detail dad ON da.daid = dad.idda
WHERE COALESCE(da._cdc_deleted, false) = false AND COALESCE(dad._cdc_deleted, false) = false;
