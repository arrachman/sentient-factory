CREATE SCHEMA IF NOT EXISTS myerpplus_landing;

CREATE TABLE IF NOT EXISTS myerpplus_landing.m6_bom (
    bomid bigint PRIMARY KEY,
    bomautonotransaksi text,
    bomnotransaksi text,
    bomtgl timestamptz,
    bomcabang text,
    bomlokasi text,
    bomgudangasal text,
    bomgudangproduksi text,
    bomgudangtujuan text,
    bommatauang text,
    bomkurs numeric(20,6),
    bomcatatan text,
    bomuraian text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m6_bom_in (
    idbomin bigint PRIMARY KEY,
    idbom bigint,
    idbarang bigint,
    cabang text,
    gudangasal text,
    gudangproduksi text,
    gudangtujuan text,
    jml numeric(20,6),
    jmlbarang numeric(20,6),
    harga numeric(20,6),
    hpp numeric(20,6),
    catatan text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m6_bom_out (
    idbomout bigint PRIMARY KEY,
    idbom bigint,
    idbarang bigint,
    cabang text,
    gudangasal text,
    gudangproduksi text,
    gudangtujuan text,
    jml numeric(20,6),
    jmlbarang numeric(20,6),
    harga numeric(20,6),
    hpp numeric(20,6),
    catatan text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m6_mrs (
    mrsid bigint PRIMARY KEY,
    mrsautonotransaksi text,
    mrsnotransaksi text,
    mrstgl timestamptz,
    mrscabang text,
    mrslokasi text,
    mrsgudangasal text,
    mrsgudangproduksi text,
    mrsgudangtujuan text,
    mrsmatauang text,
    mrskurs numeric(20,6),
    mrscatatan text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m6_mrs_out (
    idmrsout bigint PRIMARY KEY,
    idmrs bigint,
    idbarang bigint,
    cabang text,
    gudangasal text,
    gudangproduksi text,
    gudangtujuan text,
    jml numeric(20,6),
    jmlbarang numeric(20,6),
    harga numeric(20,6),
    hpp numeric(20,6),
    catatan text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m6_mrn (
    mrnid bigint PRIMARY KEY,
    mrnautonotransaksi text,
    mrnnotransaksi text,
    mrntgl timestamptz,
    mrncabang text,
    mrnlokasi text,
    mrngudangasal text,
    mrngudangproduksi text,
    mrngudangtujuan text,
    mrnmatauang text,
    mrnkurs numeric(20,6),
    mrncatatan text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m6_mrn_out (
    idmrnout bigint PRIMARY KEY,
    idmrn bigint,
    idmrsout bigint,
    idbarang bigint,
    cabang text,
    gudangasal text,
    gudangproduksi text,
    gudangtujuan text,
    jml numeric(20,6),
    jmlbarang numeric(20,6),
    harga numeric(20,6),
    hpp numeric(20,6),
    catatan text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m6_pd (
    pdid bigint PRIMARY KEY,
    pdautonotransaksi text,
    pdnotransaksi text,
    pdtgl timestamptz,
    pdcabang text,
    pdlokasi text,
    pdgudangasal text,
    pdgudangproduksi text,
    pdgudangtujuan text,
    pdmatauang text,
    pdkurs numeric(20,6),
    pdcatatan text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m6_pd_in (
    idpdin bigint PRIMARY KEY,
    idpd bigint,
    idbarang bigint,
    cabang text,
    gudangasal text,
    gudangproduksi text,
    gudangtujuan text,
    jml numeric(20,6),
    jmlbarang numeric(20,6),
    harga numeric(20,6),
    hpp numeric(20,6),
    catatan text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m6_pd_out (
    idpdout bigint PRIMARY KEY,
    idpd bigint,
    idbarang bigint,
    cabang text,
    gudangasal text,
    gudangproduksi text,
    gudangtujuan text,
    jml numeric(20,6),
    jmlbarang numeric(20,6),
    harga numeric(20,6),
    hpp numeric(20,6),
    catatan text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m6_pdr (
    pdrid bigint PRIMARY KEY,
    pdrautonotransaksi text,
    pdrnotransaksi text,
    pdrtgl timestamptz,
    pdrcabang text,
    pdrlokasi text,
    pdrgudangasal text,
    pdrgudangproduksi text,
    pdrgudangtujuan text,
    pdrmatauang text,
    pdrkurs numeric(20,6),
    pdrcatatan text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m6_pdr_in (
    idpdrin bigint PRIMARY KEY,
    idpdr bigint,
    idbarang bigint,
    cabang text,
    gudangasal text,
    gudangproduksi text,
    gudangtujuan text,
    jml numeric(20,6),
    harga numeric(20,6),
    hpp numeric(20,6),
    catatan text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m6_pdr_out (
    idpdrout bigint PRIMARY KEY,
    idpdr bigint,
    idbarang bigint,
    cabang text,
    gudangasal text,
    gudangproduksi text,
    gudangtujuan text,
    jml numeric(20,6),
    harga numeric(20,6),
    hpp numeric(20,6),
    catatan text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m6_wo (
    woid bigint PRIMARY KEY,
    woautonotransaksi text,
    wonotransaksi text,
    wotgl timestamptz,
    wocabang text,
    wolokasi text,
    wogudangasal text,
    wogudangproduksi text,
    wogudangtujuan text,
    womatauang text,
    wokurs numeric(20,6),
    wocatatan text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m6_wo_in (
    idwoin bigint PRIMARY KEY,
    idwo bigint,
    idbarang bigint,
    cabang text,
    gudangasal text,
    gudangproduksi text,
    gudangtujuan text,
    jml numeric(20,6),
    jmlbarang numeric(20,6),
    harga numeric(20,6),
    hpp numeric(20,6),
    catatan text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m6_wo_out (
    idwoout bigint PRIMARY KEY,
    idwo bigint,
    idbarang bigint,
    cabang text,
    gudangasal text,
    gudangproduksi text,
    gudangtujuan text,
    jml numeric(20,6),
    jmlbarang numeric(20,6),
    harga numeric(20,6),
    hpp numeric(20,6),
    catatan text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m6_wo_activity (
    idwoactivity bigint PRIMARY KEY,
    idwo bigint,
    kodemesin text,
    namaaktivitas text,
    urutan numeric(20,6),
    catatan text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m6_wo_route_card (
    idworoutecard bigint PRIMARY KEY,
    idwo bigint,
    notransaksi text,
    urutan numeric(20,6),
    satuan text,
    jml numeric(20,6),
    catatan text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m6_notes (
    nid bigint PRIMARY KEY,
    nsumber text,
    nidtransaksi bigint,
    ncatatan text,
    ninputtgl timestamptz,
    ninputuser text,
    nmodifikasitgl timestamptz,
    nmodifikasiuser text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m6_files (
    fsumber text,
    fidtransaksi bigint,
    fnamafile text,
    finputtgl timestamptz,
    fcatatan text,
    ftanggal timestamptz,
    fukuranfile numeric(20,6),
    finputuser text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m7_asset (
    aid bigint PRIMARY KEY,
    anomor text,
    acabang text,
    alokasi text,
    anama text,
    aharga numeric(20,6),
    ahargabeli numeric(20,6),
    amatauang text,
    acatatan text,
    ainputtgl timestamptz,
    ainputuser text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m7_ar (
    arid bigint PRIMARY KEY,
    arautonotransaksi text,
    arnotransaksi text,
    artgl timestamptz,
    arcabang text,
    arlokasi text,
    armatauang text,
    arkurs numeric(20,6),
    arcatatan text,
    arinputtgl timestamptz,
    arinputuser text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m7_ar_detail (
    idardetail bigint PRIMARY KEY,
    idar bigint,
    idasset bigint,
    cabang text,
    lokasi text,
    namaasset text,
    satuan text,
    jml numeric(20,6),
    harga numeric(20,6),
    matauang text,
    kurs numeric(20,6),
    catatan text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m7_aq (
    aqid bigint PRIMARY KEY,
    aqautonotransaksi text,
    aqnotransaksi text,
    aqtgl timestamptz,
    aqcabang text,
    aqlokasi text,
    aqmatauang text,
    aqkurs numeric(20,6),
    aqcatatan text,
    aqinputtgl timestamptz,
    aqinputuser text,
    aqidar bigint,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m7_aq_detail (
    idaqdetail bigint PRIMARY KEY,
    idaq bigint,
    idardetail bigint,
    idasset bigint,
    cabang text,
    lokasi text,
    namaasset text,
    satuan text,
    jml numeric(20,6),
    harga numeric(20,6),
    matauang text,
    kurs numeric(20,6),
    catatan text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m7_ao (
    aoid bigint PRIMARY KEY,
    aoautonotransaksi text,
    aonotransaksi text,
    aotgl timestamptz,
    aocabang text,
    aolokasi text,
    aomatauang text,
    aokurs numeric(20,6),
    aocatatan text,
    aoinputtgl timestamptz,
    aoinputuser text,
    aoidar bigint,
    aoidaq bigint,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m7_ao_detail (
    idaodetail bigint PRIMARY KEY,
    idao bigint,
    idaqdetail bigint,
    idardetail bigint,
    idasset bigint,
    cabang text,
    lokasi text,
    namaasset text,
    satuan text,
    jml numeric(20,6),
    harga numeric(20,6),
    matauang text,
    kurs numeric(20,6),
    catatan text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m7_ae (
    aeid bigint PRIMARY KEY,
    aeautonotransaksi text,
    aenotransaksi text,
    aetgl timestamptz,
    aecabang text,
    aelokasi text,
    aematauang text,
    aekurs numeric(20,6),
    aecatatan text,
    aeinputtgl timestamptz,
    aeinputuser text,
    aeidar bigint,
    aeidaq bigint,
    aeidao bigint,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m7_ae_detail (
    idaedetail bigint PRIMARY KEY,
    idae bigint,
    idaodetail bigint,
    idaqdetail bigint,
    idardetail bigint,
    idasset bigint,
    cabang text,
    lokasi text,
    namaasset text,
    satuan text,
    jml numeric(20,6),
    harga numeric(20,6),
    matauang text,
    kurs numeric(20,6),
    catatan text,
    rekasset text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m7_at (
    atid bigint PRIMARY KEY,
    atautonotransaksi text,
    atnotransaksi text,
    attgl timestamptz,
    atcabang text,
    atlokasi text,
    atmatauang text,
    atkurs numeric(20,6),
    atcatatan text,
    atgudang text,
    atinputtgl timestamptz,
    atinputuser text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m7_at_detail (
    idatdetail bigint PRIMARY KEY,
    idat bigint,
    idtransaksi bigint,
    sumber text,
    matauang text,
    kurs numeric(20,6),
    jmlbayar numeric(20,6),
    terbayar numeric(20,6),
    sisa numeric(20,6),
    catatan text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m7_at_pay (
    idat bigint,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m7_ag (
    agid bigint PRIMARY KEY,
    agautonotransaksi text,
    agnotransaksi text,
    agtgl timestamptz,
    agcabang text,
    aglokasi text,
    agmatauang text,
    agkurs numeric(20,6),
    agcatatan text,
    aginputtgl timestamptz,
    aginputuser text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m7_ag_detail (
    idagdetail bigint PRIMARY KEY,
    idag bigint,
    idasset bigint,
    cabang text,
    lokasi text,
    namaasset text,
    satuan text,
    jml numeric(20,6),
    hargabeli numeric(20,6),
    matauang text,
    kurs numeric(20,6),
    catatan text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m7_da (
    daid bigint PRIMARY KEY,
    daautonotransaksi text,
    danotransaksi text,
    datgl timestamptz,
    dacabang text,
    dalokasi text,
    damatauang text,
    dakurs numeric(20,6),
    dacatatan text,
    dagudang text,
    dainputtgl timestamptz,
    dainputuser text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m7_da_detail (
    iddadetail bigint PRIMARY KEY,
    idda bigint,
    idaset bigint,
    penyusutanke numeric(20,6),
    nilaipenyusutan numeric(20,6),
    nilaibukusebelumnya numeric(20,6),
    matauang text,
    kurs numeric(20,6),
    catatan text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m7_notes (
    nid bigint PRIMARY KEY,
    nsumber text,
    nidtransaksi bigint,
    ncatatan text,
    ninputtgl timestamptz,
    ninputuser text,
    nmodifikasitgl timestamptz,
    nmodifikasiuser text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m7_files (
    fsumber text,
    fidtransaksi bigint,
    fnamafile text,
    finputtgl timestamptz,
    fcatatan text,
    ftanggal timestamptz,
    fukuranfile numeric(20,6),
    finputuser text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean,
    _cdc_payload jsonb
);
