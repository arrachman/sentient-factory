CREATE SCHEMA IF NOT EXISTS myerpplus_landing;

CREATE TABLE IF NOT EXISTS myerpplus_landing.m4_cs (
    csid bigint PRIMARY KEY,
    cscabang text,
    cslokasi text,
    csnotransaksi text,
    cstgl timestamptz,
    cssupplier text,
    cssumber text,
    csstatus text,
    csinputuser text,
    csinputtgl timestamptz,
    csmodifikasiuser text,
    csmodifikasitgl timestamptz,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean NOT NULL DEFAULT false,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m4_cs_detail (
    idcsdetail bigint PRIMARY KEY,
    idcs bigint,
    idbarang text,
    namabarang text,
    jml numeric(20,6),
    harga numeric(20,6),
    catatan text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean NOT NULL DEFAULT false,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m4_pie (
    pieid bigint PRIMARY KEY,
    piecabang text,
    pielokasi text,
    pienotransaksi text,
    pietgl timestamptz,
    piekontak text,
    piesumber text,
    piestatus text,
    pieinputuser text,
    pieinputtgl timestamptz,
    piemodifikasiuser text,
    piemodifikasitgl timestamptz,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean NOT NULL DEFAULT false,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m4_pie_detail (
    idpiedetail bigint PRIMARY KEY,
    idpie bigint,
    sumber text,
    idtransaksi text,
    catatan text,
    urutan bigint,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean NOT NULL DEFAULT false,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m4_notes (
    nid bigint PRIMARY KEY,
    nsumber text,
    nidtransaksi text,
    ncatatan text,
    ninputuser text,
    ninputtgl timestamptz,
    nmodifikasiuser text,
    nmodifikasitgl timestamptz,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean NOT NULL DEFAULT false,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m4_files (
    fsumber text NOT NULL,
    fidtransaksi text NOT NULL,
    fnamafile text NOT NULL,
    fcatatan text,
    fukuranfile bigint,
    ftanggal timestamptz,
    finputuser text,
    finputtgl timestamptz,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean NOT NULL DEFAULT false,
    _cdc_payload jsonb,
    PRIMARY KEY (fsumber, fidtransaksi, fnamafile)
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m5_sie (
    sieid bigint PRIMARY KEY,
    siecabang text,
    sielokasi text,
    sienotransaksi text,
    sietgl timestamptz,
    siekontak text,
    siestatus text,
    sieinputuser text,
    sieinputtgl timestamptz,
    siemodifikasiuser text,
    siemodifikasitgl timestamptz,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean NOT NULL DEFAULT false,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m5_sie_detail (
    idsiedetail bigint PRIMARY KEY,
    idsie bigint,
    sumber text,
    idtransaksi text,
    catatan text,
    urutan bigint,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean NOT NULL DEFAULT false,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m5_spa (
    spaid bigint PRIMARY KEY,
    spacabang text,
    spalokasi text,
    spanotransaksi text,
    spatgl timestamptz,
    spakontak text,
    spastatus text,
    spainputuser text,
    spainputtgl timestamptz,
    spamodifikasiuser text,
    spamodifikasitgl timestamptz,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean NOT NULL DEFAULT false,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m5_spa_detail (
    idspadetail bigint PRIMARY KEY,
    idspa bigint,
    kontak text,
    jmlpoint numeric(20,6),
    nilai numeric(20,6),
    catatan text,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean NOT NULL DEFAULT false,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m5_cl (
    clid bigint PRIMARY KEY,
    clcabang text,
    cllokasi text,
    clnotransaksi text,
    cltgl timestamptz,
    clcustomer text,
    clstatus text,
    clinputuser text,
    clinputtgl timestamptz,
    clmodifikasiuser text,
    clmodifikasitgl timestamptz,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean NOT NULL DEFAULT false,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m5_sf (
    sfid bigint PRIMARY KEY,
    sfcabang text,
    sflokasi text,
    sfnotransaksi text,
    sftgl timestamptz,
    sfcustomer text,
    sfinputuser text,
    sfinputtgl timestamptz,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean NOT NULL DEFAULT false,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m5_sf_detail (
    idsfdetail bigint PRIMARY KEY,
    idsf bigint,
    idbarang text,
    namabarang text,
    jml numeric(20,6),
    harga numeric(20,6),
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean NOT NULL DEFAULT false,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m5_notes (
    nid bigint PRIMARY KEY,
    nsumber text,
    nidtransaksi text,
    ncatatan text,
    ninputuser text,
    ninputtgl timestamptz,
    nmodifikasiuser text,
    nmodifikasitgl timestamptz,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean NOT NULL DEFAULT false,
    _cdc_payload jsonb
);

CREATE TABLE IF NOT EXISTS myerpplus_landing.m5_files (
    fsumber text NOT NULL,
    fidtransaksi text NOT NULL,
    fnamafile text NOT NULL,
    fcatatan text,
    fukuranfile bigint,
    ftanggal timestamptz,
    finputuser text,
    finputtgl timestamptz,
    _cdc_record_key text,
    _cdc_source_table text,
    _cdc_updated_at timestamptz,
    _cdc_deleted boolean NOT NULL DEFAULT false,
    _cdc_payload jsonb,
    PRIMARY KEY (fsumber, fidtransaksi, fnamafile)
);
