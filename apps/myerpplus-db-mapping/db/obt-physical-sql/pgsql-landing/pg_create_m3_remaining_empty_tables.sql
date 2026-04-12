CREATE TABLE IF NOT EXISTS myerpplus_landing.m3_mr_history (
    mridhistory bigint PRIMARY KEY,
    mrid bigint,
    mrcabang text,
    mrlokasi text,
    mrgudangasal text,
    mrgudangtujuan text,
    mrnotransaksi text,
    mrtgl timestamptz,
    mruraian text,
    mrcatatan text,
    mrnoref text,
    mrtglnoref timestamptz,
    mrstatus text,
    mrstatussebelumnya text,
    _cdc_record_key text, _cdc_source_table text, _cdc_updated_at timestamptz, _cdc_deleted boolean, _cdc_payload jsonb
);
CREATE TABLE IF NOT EXISTS myerpplus_landing.m3_mr_detail_history (
    idhistorydetail bigint PRIMARY KEY,
    idhistory bigint,
    idmrdetail bigint,
    idmr bigint,
    idbarang bigint,
    namabarang text,
    jml numeric(20,6),
    jmlbarang numeric(20,6),
    satuan text,
    satuanbarang text,
    nilaisatuan numeric(20,6),
    cabang text, lokasi text, gudangasal text, gudangtujuan text,
    costcenter text, divisi text, subdivisi text, proyek text, catatan text, urutan bigint,
    _cdc_record_key text, _cdc_source_table text, _cdc_updated_at timestamptz, _cdc_deleted boolean, _cdc_payload jsonb
);
CREATE TABLE IF NOT EXISTS myerpplus_landing.m3_rs_history (
    rsidhistory bigint PRIMARY KEY,
    rsid bigint,
    rscabang text,
    rslokasi text,
    rsgudangasal text,
    rsgudangtransit text,
    rsgudangtujuan text,
    rsnotransaksi text,
    rstgl timestamptz,
    rsuraian text,
    rscatatan text,
    rsnoref text,
    rstglnoref timestamptz,
    rsstatus text,
    rsstatussebelumnya text,
    _cdc_record_key text, _cdc_source_table text, _cdc_updated_at timestamptz, _cdc_deleted boolean, _cdc_payload jsonb
);
CREATE TABLE IF NOT EXISTS myerpplus_landing.m3_rs_detail_history (
    idhistorydetail bigint PRIMARY KEY,
    idhistory bigint,
    idrsdetail bigint,
    idrs bigint,
    idbarang bigint,
    namabarang text,
    jml numeric(20,6),
    jmlbarang numeric(20,6),
    satuan text,
    satuanbarang text,
    nilaisatuan numeric(20,6),
    cabang text, lokasi text, gudangasal text, gudangtransit text, gudangtujuan text,
    costcenter text, divisi text, subdivisi text, proyek text, catatan text, urutan bigint,
    _cdc_record_key text, _cdc_source_table text, _cdc_updated_at timestamptz, _cdc_deleted boolean, _cdc_payload jsonb
);
CREATE TABLE IF NOT EXISTS myerpplus_landing.m3_pa (
    paid bigint PRIMARY KEY,
    panotransaksi text, patgl timestamptz, patglberlakusampai timestamptz, pakategoriharga text, pacabang text, palokasi text, pagudang text, pauraian text, pacatatan text,
    _cdc_record_key text, _cdc_source_table text, _cdc_updated_at timestamptz, _cdc_deleted boolean, _cdc_payload jsonb
);
CREATE TABLE IF NOT EXISTS myerpplus_landing.m3_pa_detail (
    idpadetail bigint PRIMARY KEY,
    idpa bigint, idbarang bigint, kontak text, satuan text, satuanbarang text, matauang text, kurs numeric(20,6), nilaisatuan numeric(20,6),
    hargajual1 numeric(20,6), hargajual2 numeric(20,6), hargajual3 numeric(20,6), hargajual4 numeric(20,6), hargajual5 numeric(20,6),
    _cdc_record_key text, _cdc_source_table text, _cdc_updated_at timestamptz, _cdc_deleted boolean, _cdc_payload jsonb
);
CREATE TABLE IF NOT EXISTS myerpplus_landing.m3_rf (
    rfid bigint PRIMARY KEY,
    rfcabang text, rflokasi text, rfgudangasal text, rfgudangtujuan text, rfnotransaksi text, rftgl timestamptz, rfuraian text, rfcatatan text, rfnoref text, rftglnoref timestamptz,
    _cdc_record_key text, _cdc_source_table text, _cdc_updated_at timestamptz, _cdc_deleted boolean, _cdc_payload jsonb
);
CREATE TABLE IF NOT EXISTS myerpplus_landing.m3_rf_detail (
    idrfdetail bigint PRIMARY KEY,
    idrf bigint, idbarang bigint, namabarang text, jml numeric(20,6), jmlbarang numeric(20,6), satuan text, satuanbarang text, nilaisatuan numeric(20,6), cabang text, lokasi text, gudangasal text, gudangtujuan text, costcenter text, divisi text, subdivisi text, proyek text, catatan text, urutan bigint,
    _cdc_record_key text, _cdc_source_table text, _cdc_updated_at timestamptz, _cdc_deleted boolean, _cdc_payload jsonb
);
CREATE TABLE IF NOT EXISTS myerpplus_landing.m3_dc (
    dcid bigint PRIMARY KEY,
    dcnotransaksi text, dctgl timestamptz, dccabang text, dclokasi text, dcgudangasal text, dcgudangtujuan text, dcshift bigint, dcnamabarang text, dcuraian text, dccatatan text,
    _cdc_record_key text, _cdc_source_table text, _cdc_updated_at timestamptz, _cdc_deleted boolean, _cdc_payload jsonb
);
CREATE TABLE IF NOT EXISTS myerpplus_landing.m3_dc_detail (
    iddcdetail bigint PRIMARY KEY,
    iddc bigint, cabang text, lokasi text, gudangasal text, gudangtujuan text, costcenter text, divisi text, subdivisi text, proyek text, catatan text,
    _cdc_record_key text, _cdc_source_table text, _cdc_updated_at timestamptz, _cdc_deleted boolean, _cdc_payload jsonb
);
CREATE TABLE IF NOT EXISTS myerpplus_landing.m3_dc_check (
    iddccheck bigint PRIMARY KEY,
    iddc bigint, idkategoricheck bigint, catatan text, status text, urutan bigint, isclose bigint,
    _cdc_record_key text, _cdc_source_table text, _cdc_updated_at timestamptz, _cdc_deleted boolean, _cdc_payload jsonb
);
CREATE TABLE IF NOT EXISTS myerpplus_landing.m3_dc_history (
    dcidhistory bigint PRIMARY KEY,
    dcid bigint, dcnotransaksi text, dctgl timestamptz, dccabang text, dclokasi text, dcgudangasal text, dcgudangtujuan text, dcshift bigint, dcnamabarang text, dcuraian text, dccatatan text,
    _cdc_record_key text, _cdc_source_table text, _cdc_updated_at timestamptz, _cdc_deleted boolean, _cdc_payload jsonb
);
CREATE TABLE IF NOT EXISTS myerpplus_landing.m3_dc_detail_history (
    iddcdetailhistory bigint PRIMARY KEY,
    iddchistory bigint, iddcdetail bigint, iddc bigint, cabang text, lokasi text, gudangasal text, gudangtujuan text, costcenter text, divisi text, subdivisi text, proyek text, catatan text,
    _cdc_record_key text, _cdc_source_table text, _cdc_updated_at timestamptz, _cdc_deleted boolean, _cdc_payload jsonb
);
CREATE TABLE IF NOT EXISTS myerpplus_landing.m3_dc_check_history (
    iddccheckhistory bigint PRIMARY KEY,
    iddchistory bigint, iddccheck bigint, iddc bigint, idkategoricheck bigint, catatan text, status text, urutan bigint, isclose bigint,
    _cdc_record_key text, _cdc_source_table text, _cdc_updated_at timestamptz, _cdc_deleted boolean, _cdc_payload jsonb
);
CREATE TABLE IF NOT EXISTS myerpplus_landing.m3_rw (
    rwid bigint PRIMARY KEY,
    rwnotransaksi text, rwtgl timestamptz, rwcabang text, rwlokasi text, rwnopol text, rwsopir text, rwuraian text, rwcatatan text,
    _cdc_record_key text, _cdc_source_table text, _cdc_updated_at timestamptz, _cdc_deleted boolean, _cdc_payload jsonb
);
