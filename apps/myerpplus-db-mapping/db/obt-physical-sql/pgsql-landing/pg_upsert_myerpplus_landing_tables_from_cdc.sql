-- Auto-generated upsert from cdc_current_state into m0_user
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m0_user'
)
INSERT INTO m0_user (
    uaktif, ubahasa, ucabang, udefaultview, ugambar, ugrup, ugudang, ukode, ukontak, ukota, ulevel, ulokasi, unama, upassword, userid, utglexpired, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    uaktif, ubahasa, ucabang, udefaultview, ugambar, ugrup, ugudang, ukode, ukontak, ukota, ulevel, ulokasi, unama, upassword, userid, utglexpired, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'uaktif', '')::bigint AS uaktif,
        row_payload ->> 'ubahasa' AS ubahasa,
        row_payload ->> 'ucabang' AS ucabang,
        row_payload ->> 'udefaultview' AS udefaultview,
        row_payload ->> 'ugambar' AS ugambar,
        row_payload ->> 'ugrup' AS ugrup,
        row_payload ->> 'ugudang' AS ugudang,
        row_payload ->> 'ukode' AS ukode,
        row_payload ->> 'ukontak' AS ukontak,
        row_payload ->> 'ukota' AS ukota,
        row_payload ->> 'ulevel' AS ulevel,
        row_payload ->> 'ulokasi' AS ulokasi,
        row_payload ->> 'unama' AS unama,
        row_payload ->> 'upassword' AS upassword,
        NULLIF(row_payload ->> 'userid', '')::bigint AS userid,
        NULLIF(row_payload ->> 'utglexpired', '')::timestamptz AS utglexpired,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'userid') IS NOT NULL
) AS prepared
ON CONFLICT (userid) DO UPDATE
SET
    uaktif = EXCLUDED.uaktif,
    ubahasa = EXCLUDED.ubahasa,
    ucabang = EXCLUDED.ucabang,
    udefaultview = EXCLUDED.udefaultview,
    ugambar = EXCLUDED.ugambar,
    ugrup = EXCLUDED.ugrup,
    ugudang = EXCLUDED.ugudang,
    ukode = EXCLUDED.ukode,
    ukontak = EXCLUDED.ukontak,
    ukota = EXCLUDED.ukota,
    ulevel = EXCLUDED.ulevel,
    ulokasi = EXCLUDED.ulokasi,
    unama = EXCLUDED.unama,
    upassword = EXCLUDED.upassword,
    utglexpired = EXCLUDED.utglexpired,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m0_menu
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m0_menu'
)
INSERT INTO m0_menu (
    mnactive, mnid, mnidtransaksi, mnlebar, mnlevel, mnmoduleid, mnname, mnparent, mnpopup, mntinggi, mntype, mnurl, mnurutan, mnviewopening, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    mnactive, mnid, mnidtransaksi, mnlebar, mnlevel, mnmoduleid, mnname, mnparent, mnpopup, mntinggi, mntype, mnurl, mnurutan, mnviewopening, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'mnactive' AS mnactive,
        NULLIF(row_payload ->> 'mnid', '')::bigint AS mnid,
        NULLIF(row_payload ->> 'mnidtransaksi', '')::bigint AS mnidtransaksi,
        NULLIF(row_payload ->> 'mnlebar', '')::bigint AS mnlebar,
        NULLIF(row_payload ->> 'mnlevel', '')::bigint AS mnlevel,
        NULLIF(row_payload ->> 'mnmoduleid', '')::bigint AS mnmoduleid,
        row_payload ->> 'mnname' AS mnname,
        row_payload ->> 'mnparent' AS mnparent,
        NULLIF(row_payload ->> 'mnpopup', '')::bigint AS mnpopup,
        NULLIF(row_payload ->> 'mntinggi', '')::bigint AS mntinggi,
        NULLIF(row_payload ->> 'mntype', '')::bigint AS mntype,
        row_payload ->> 'mnurl' AS mnurl,
        NULLIF(row_payload ->> 'mnurutan', '')::bigint AS mnurutan,
        NULLIF(row_payload ->> 'mnviewopening', '')::bigint AS mnviewopening,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'mnmoduleid') IS NOT NULL AND (row_payload ->> 'mnid') IS NOT NULL
) AS prepared
ON CONFLICT (mnmoduleid, mnid) DO UPDATE
SET
    mnactive = EXCLUDED.mnactive,
    mnidtransaksi = EXCLUDED.mnidtransaksi,
    mnlebar = EXCLUDED.mnlebar,
    mnlevel = EXCLUDED.mnlevel,
    mnname = EXCLUDED.mnname,
    mnparent = EXCLUDED.mnparent,
    mnpopup = EXCLUDED.mnpopup,
    mntinggi = EXCLUDED.mntinggi,
    mntype = EXCLUDED.mntype,
    mnurl = EXCLUDED.mnurl,
    mnurutan = EXCLUDED.mnurutan,
    mnviewopening = EXCLUDED.mnviewopening,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m0_nomor
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m0_nomor'
)
INSERT INTO m0_nomor (
    awalan, jmldigit, kodetabel, menuid, moduleid, transaksibarang, transaksifa, transaksihpp, uraian, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    awalan, jmldigit, kodetabel, menuid, moduleid, transaksibarang, transaksifa, transaksihpp, uraian, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'awalan' AS awalan,
        NULLIF(row_payload ->> 'jmldigit', '')::bigint AS jmldigit,
        row_payload ->> 'kodetabel' AS kodetabel,
        NULLIF(row_payload ->> 'menuid', '')::bigint AS menuid,
        NULLIF(row_payload ->> 'moduleid', '')::bigint AS moduleid,
        row_payload ->> 'transaksibarang' AS transaksibarang,
        row_payload ->> 'transaksifa' AS transaksifa,
        row_payload ->> 'transaksihpp' AS transaksihpp,
        row_payload ->> 'uraian' AS uraian,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'kodetabel') IS NOT NULL
) AS prepared
ON CONFLICT (kodetabel) DO UPDATE
SET
    awalan = EXCLUDED.awalan,
    jmldigit = EXCLUDED.jmldigit,
    menuid = EXCLUDED.menuid,
    moduleid = EXCLUDED.moduleid,
    transaksibarang = EXCLUDED.transaksibarang,
    transaksifa = EXCLUDED.transaksifa,
    transaksihpp = EXCLUDED.transaksihpp,
    uraian = EXCLUDED.uraian,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m0_role
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m0_role'
)
INSERT INTO m0_role (
    rkode, rnama, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    rkode, rnama, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'rkode' AS rkode,
        row_payload ->> 'rnama' AS rnama,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'rkode') IS NOT NULL
) AS prepared
ON CONFLICT (rkode) DO UPDATE
SET
    rnama = EXCLUDED.rnama,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m0_role_menu
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m0_role_menu'
)
INSERT INTO m0_role_menu (
    rmakses, rmfavourite, rmmenuid, rmmoduleid, rmrole, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    rmakses, rmfavourite, rmmenuid, rmmoduleid, rmrole, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'rmakses' AS rmakses,
        NULLIF(row_payload ->> 'rmfavourite', '')::bigint AS rmfavourite,
        NULLIF(row_payload ->> 'rmmenuid', '')::bigint AS rmmenuid,
        NULLIF(row_payload ->> 'rmmoduleid', '')::bigint AS rmmoduleid,
        row_payload ->> 'rmrole' AS rmrole,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'rmrole') IS NOT NULL AND (row_payload ->> 'rmmoduleid') IS NOT NULL AND (row_payload ->> 'rmmenuid') IS NOT NULL
) AS prepared
ON CONFLICT (rmrole, rmmoduleid, rmmenuid) DO UPDATE
SET
    rmakses = EXCLUDED.rmakses,
    rmfavourite = EXCLUDED.rmfavourite,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m0_user_role
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m0_user_role'
)
INSERT INTO m0_user_role (
    role, userid, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    role, userid, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'role' AS role,
        NULLIF(row_payload ->> 'userid', '')::bigint AS userid,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'userid') IS NOT NULL AND (row_payload ->> 'role') IS NOT NULL
) AS prepared
ON CONFLICT (userid, role) DO UPDATE
SET
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m0_userlog
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m0_userlog'
)
INSERT INTO m0_userlog (
    ulaktivitas, ulidmenu, ulidmodule, uljenisaktivitas, ulkodepa, ultgl, uluserid, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    ulaktivitas, ulidmenu, ulidmodule, uljenisaktivitas, ulkodepa, ultgl, uluserid, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'ulaktivitas' AS ulaktivitas,
        NULLIF(row_payload ->> 'ulidmenu', '')::bigint AS ulidmenu,
        NULLIF(row_payload ->> 'ulidmodule', '')::bigint AS ulidmodule,
        NULLIF(row_payload ->> 'uljenisaktivitas', '')::bigint AS uljenisaktivitas,
        row_payload ->> 'ulkodepa' AS ulkodepa,
        NULLIF(row_payload ->> 'ultgl', '')::timestamptz AS ultgl,
        NULLIF(row_payload ->> 'uluserid', '')::bigint AS uluserid,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'uluserid') IS NOT NULL AND (row_payload ->> 'ultgl') IS NOT NULL AND (row_payload ->> 'ulidmodule') IS NOT NULL AND (row_payload ->> 'ulidmenu') IS NOT NULL AND (row_payload ->> 'uljenisaktivitas') IS NOT NULL AND (row_payload ->> 'ulaktivitas') IS NOT NULL
) AS prepared
ON CONFLICT (uluserid, ultgl, ulidmodule, ulidmenu, uljenisaktivitas, ulaktivitas) DO UPDATE
SET
    ulkodepa = EXCLUDED.ulkodepa,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_branch
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_branch'
)
INSERT INTO m1_branch (
    bkode, bnama, balamat1, balamat2, bkota, bkodepos, bnotelp, bnofax, bcatatan, baktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    bkode, bnama, balamat1, balamat2, bkota, bkodepos, bnotelp, bnofax, bcatatan, baktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'bkode' AS bkode,
        row_payload ->> 'bnama' AS bnama,
        row_payload ->> 'balamat1' AS balamat1,
        row_payload ->> 'balamat2' AS balamat2,
        row_payload ->> 'bkota' AS bkota,
        row_payload ->> 'bkodepos' AS bkodepos,
        row_payload ->> 'bnotelp' AS bnotelp,
        row_payload ->> 'bnofax' AS bnofax,
        row_payload ->> 'bcatatan' AS bcatatan,
        NULLIF(row_payload ->> 'baktif', '')::bigint AS baktif,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'bkode') IS NOT NULL
) AS prepared
ON CONFLICT (bkode) DO UPDATE
SET
    bnama = EXCLUDED.bnama,
    balamat1 = EXCLUDED.balamat1,
    balamat2 = EXCLUDED.balamat2,
    bkota = EXCLUDED.bkota,
    bkodepos = EXCLUDED.bkodepos,
    bnotelp = EXCLUDED.bnotelp,
    bnofax = EXCLUDED.bnofax,
    bcatatan = EXCLUDED.bcatatan,
    baktif = EXCLUDED.baktif,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_class_product
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_class_product'
)
INSERT INTO m1_class_product (
    cpkode, cpnama, cpcatatan, cpaktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    cpkode, cpnama, cpcatatan, cpaktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'cpkode' AS cpkode,
        row_payload ->> 'cpnama' AS cpnama,
        row_payload ->> 'cpcatatan' AS cpcatatan,
        NULLIF(row_payload ->> 'cpaktif', '')::bigint AS cpaktif,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'cpkode') IS NOT NULL
) AS prepared
ON CONFLICT (cpkode) DO UPDATE
SET
    cpnama = EXCLUDED.cpnama,
    cpcatatan = EXCLUDED.cpcatatan,
    cpaktif = EXCLUDED.cpaktif,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_coa
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_coa'
)
INSERT INTO m1_coa (
    cid, cnomor, ctipe, ckategori, cdc, curutan, caktif, cnama, cnamaalias1, cnamaalias2, cnamaalias3, cgd, clevel, csubdari, cparent, clevel1, clevel2, clevel3, clevel4, clevel5, cjenisaruskas, cbukupembantu, ccabang, clokasi, cdivisi, cmatauang, ckodebank, cnorekbank, cjenis, csaldoawal, csaldoberjalan, ccatatan, ccostcenter, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    cid, cnomor, ctipe, ckategori, cdc, curutan, caktif, cnama, cnamaalias1, cnamaalias2, cnamaalias3, cgd, clevel, csubdari, cparent, clevel1, clevel2, clevel3, clevel4, clevel5, cjenisaruskas, cbukupembantu, ccabang, clokasi, cdivisi, cmatauang, ckodebank, cnorekbank, cjenis, csaldoawal, csaldoberjalan, ccatatan, ccostcenter, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'cid', '')::bigint AS cid,
        row_payload ->> 'cnomor' AS cnomor,
        row_payload ->> 'ctipe' AS ctipe,
        row_payload ->> 'ckategori' AS ckategori,
        row_payload ->> 'cdc' AS cdc,
        row_payload ->> 'curutan' AS curutan,
        NULLIF(row_payload ->> 'caktif', '')::bigint AS caktif,
        row_payload ->> 'cnama' AS cnama,
        row_payload ->> 'cnamaalias1' AS cnamaalias1,
        row_payload ->> 'cnamaalias2' AS cnamaalias2,
        row_payload ->> 'cnamaalias3' AS cnamaalias3,
        row_payload ->> 'cgd' AS cgd,
        row_payload ->> 'clevel' AS clevel,
        row_payload ->> 'csubdari' AS csubdari,
        row_payload ->> 'cparent' AS cparent,
        row_payload ->> 'clevel1' AS clevel1,
        row_payload ->> 'clevel2' AS clevel2,
        row_payload ->> 'clevel3' AS clevel3,
        row_payload ->> 'clevel4' AS clevel4,
        row_payload ->> 'clevel5' AS clevel5,
        row_payload ->> 'cjenisaruskas' AS cjenisaruskas,
        row_payload ->> 'cbukupembantu' AS cbukupembantu,
        row_payload ->> 'ccabang' AS ccabang,
        row_payload ->> 'clokasi' AS clokasi,
        row_payload ->> 'cdivisi' AS cdivisi,
        row_payload ->> 'cmatauang' AS cmatauang,
        row_payload ->> 'ckodebank' AS ckodebank,
        row_payload ->> 'cnorekbank' AS cnorekbank,
        row_payload ->> 'cjenis' AS cjenis,
        NULLIF(row_payload ->> 'csaldoawal', '')::numeric(20,6) AS csaldoawal,
        NULLIF(row_payload ->> 'csaldoberjalan', '')::numeric(20,6) AS csaldoberjalan,
        row_payload ->> 'ccatatan' AS ccatatan,
        row_payload ->> 'ccostcenter' AS ccostcenter,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'cnomor') IS NOT NULL
) AS prepared
ON CONFLICT (cnomor) DO UPDATE
SET
    cid = EXCLUDED.cid,
    ctipe = EXCLUDED.ctipe,
    ckategori = EXCLUDED.ckategori,
    cdc = EXCLUDED.cdc,
    curutan = EXCLUDED.curutan,
    caktif = EXCLUDED.caktif,
    cnama = EXCLUDED.cnama,
    cnamaalias1 = EXCLUDED.cnamaalias1,
    cnamaalias2 = EXCLUDED.cnamaalias2,
    cnamaalias3 = EXCLUDED.cnamaalias3,
    cgd = EXCLUDED.cgd,
    clevel = EXCLUDED.clevel,
    csubdari = EXCLUDED.csubdari,
    cparent = EXCLUDED.cparent,
    clevel1 = EXCLUDED.clevel1,
    clevel2 = EXCLUDED.clevel2,
    clevel3 = EXCLUDED.clevel3,
    clevel4 = EXCLUDED.clevel4,
    clevel5 = EXCLUDED.clevel5,
    cjenisaruskas = EXCLUDED.cjenisaruskas,
    cbukupembantu = EXCLUDED.cbukupembantu,
    ccabang = EXCLUDED.ccabang,
    clokasi = EXCLUDED.clokasi,
    cdivisi = EXCLUDED.cdivisi,
    cmatauang = EXCLUDED.cmatauang,
    ckodebank = EXCLUDED.ckodebank,
    cnorekbank = EXCLUDED.cnorekbank,
    cjenis = EXCLUDED.cjenis,
    csaldoawal = EXCLUDED.csaldoawal,
    csaldoberjalan = EXCLUDED.csaldoberjalan,
    ccatatan = EXCLUDED.ccatatan,
    ccostcenter = EXCLUDED.ccostcenter,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_contact
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_contact'
)
INSERT INTO m1_contact (
    kid, kkode, knama, kkategori, kkategorinama, kcabang, kcabangnama, klokasi, klokasinama, kgudang, kgudangnama, kkategorisalesman, kkategorisalesmannama, karea, kareanama, kkategoricustomer, kkategoricustomernama, kkategorisupplier, kkategorisuppliernama, kdivisi, kdivisinama, ksubdivisi, ksubdivisinama, ksalesman, ksalesmannama, kkontakperson, kterminglobal, kaktif, kaktiftgl, k1alamat1, k1alamat2, k1alamat3, k1alamat4, k1alamat5, k1kota, k1propinsi, k1kodepos, k1negara, k1kontakperson, k1kontaknohp, k1kontakemail, k1notelp1, k1notelp2, k1nofax, k1email, k1website, k2alamat1, k2alamat2, k2alamat3, k2alamat4, k2alamat5, k2propinsi, k2kota, k2kodepos, k2negara, k2kontakperson, k2kontaknohp, k2kontakemail, k2notelp1, k2notelp2, k2nofax, k2email, k2website, k3alamat1, k3alamat2, k3alamat3, k3alamat4, k3alamat5, k3kota, k3propinsi, k3kodepos, k3negara, k3kontakperson, k3kontaknohp, k3kontakemail, k3notelp1, k3notelp2, k3nofax, k3email, k3website, k4alamat1, k4alamat2, k4alamat3, k4alamat4, k4alamat5, k4kota, k4propinsi, k4kodepos, k4negara, k4kontakperson, k4kontaknohp, k4kontakemail, k4notelp1, k4notelp2, k4nofax, k4email, k4website, knpwp, kpkp, kbatashutang, kterminbeli, krekhutang, kbagpembelian, kfobbeli, kviabeli, kbataspiutang, kterminjual, krekpiutang, kbagpenjualan, ktingkatjual, kfobjual, kviajual, ktglkontrak, kbank, knorekening, kjeniskelamin, kmatauang, ktgllahir, ktglnikah, kkomisikode, kkomisipenjualan, kcatatan, ksinkron, kdownloaded, khargacustom, kpajakcustom, ktotalpiutang, ktotalhutang, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    kid, kkode, knama, kkategori, kkategorinama, kcabang, kcabangnama, klokasi, klokasinama, kgudang, kgudangnama, kkategorisalesman, kkategorisalesmannama, karea, kareanama, kkategoricustomer, kkategoricustomernama, kkategorisupplier, kkategorisuppliernama, kdivisi, kdivisinama, ksubdivisi, ksubdivisinama, ksalesman, ksalesmannama, kkontakperson, kterminglobal, kaktif, kaktiftgl, k1alamat1, k1alamat2, k1alamat3, k1alamat4, k1alamat5, k1kota, k1propinsi, k1kodepos, k1negara, k1kontakperson, k1kontaknohp, k1kontakemail, k1notelp1, k1notelp2, k1nofax, k1email, k1website, k2alamat1, k2alamat2, k2alamat3, k2alamat4, k2alamat5, k2propinsi, k2kota, k2kodepos, k2negara, k2kontakperson, k2kontaknohp, k2kontakemail, k2notelp1, k2notelp2, k2nofax, k2email, k2website, k3alamat1, k3alamat2, k3alamat3, k3alamat4, k3alamat5, k3kota, k3propinsi, k3kodepos, k3negara, k3kontakperson, k3kontaknohp, k3kontakemail, k3notelp1, k3notelp2, k3nofax, k3email, k3website, k4alamat1, k4alamat2, k4alamat3, k4alamat4, k4alamat5, k4kota, k4propinsi, k4kodepos, k4negara, k4kontakperson, k4kontaknohp, k4kontakemail, k4notelp1, k4notelp2, k4nofax, k4email, k4website, knpwp, kpkp, kbatashutang, kterminbeli, krekhutang, kbagpembelian, kfobbeli, kviabeli, kbataspiutang, kterminjual, krekpiutang, kbagpenjualan, ktingkatjual, kfobjual, kviajual, ktglkontrak, kbank, knorekening, kjeniskelamin, kmatauang, ktgllahir, ktglnikah, kkomisikode, kkomisipenjualan, kcatatan, ksinkron, kdownloaded, khargacustom, kpajakcustom, ktotalpiutang, ktotalhutang, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'kid', '')::bigint AS kid,
        row_payload ->> 'kkode' AS kkode,
        row_payload ->> 'knama' AS knama,
        row_payload ->> 'kkategori' AS kkategori,
        row_payload ->> 'kkategorinama' AS kkategorinama,
        row_payload ->> 'kcabang' AS kcabang,
        row_payload ->> 'kcabangnama' AS kcabangnama,
        row_payload ->> 'klokasi' AS klokasi,
        row_payload ->> 'klokasinama' AS klokasinama,
        row_payload ->> 'kgudang' AS kgudang,
        row_payload ->> 'kgudangnama' AS kgudangnama,
        row_payload ->> 'kkategorisalesman' AS kkategorisalesman,
        row_payload ->> 'kkategorisalesmannama' AS kkategorisalesmannama,
        row_payload ->> 'karea' AS karea,
        row_payload ->> 'kareanama' AS kareanama,
        row_payload ->> 'kkategoricustomer' AS kkategoricustomer,
        row_payload ->> 'kkategoricustomernama' AS kkategoricustomernama,
        row_payload ->> 'kkategorisupplier' AS kkategorisupplier,
        row_payload ->> 'kkategorisuppliernama' AS kkategorisuppliernama,
        row_payload ->> 'kdivisi' AS kdivisi,
        row_payload ->> 'kdivisinama' AS kdivisinama,
        row_payload ->> 'ksubdivisi' AS ksubdivisi,
        row_payload ->> 'ksubdivisinama' AS ksubdivisinama,
        row_payload ->> 'ksalesman' AS ksalesman,
        row_payload ->> 'ksalesmannama' AS ksalesmannama,
        row_payload ->> 'kkontakperson' AS kkontakperson,
        row_payload ->> 'kterminglobal' AS kterminglobal,
        NULLIF(row_payload ->> 'kaktif', '')::bigint AS kaktif,
        NULLIF(row_payload ->> 'kaktiftgl', '')::timestamptz AS kaktiftgl,
        row_payload ->> 'k1alamat1' AS k1alamat1,
        row_payload ->> 'k1alamat2' AS k1alamat2,
        row_payload ->> 'k1alamat3' AS k1alamat3,
        row_payload ->> 'k1alamat4' AS k1alamat4,
        row_payload ->> 'k1alamat5' AS k1alamat5,
        row_payload ->> 'k1kota' AS k1kota,
        row_payload ->> 'k1propinsi' AS k1propinsi,
        row_payload ->> 'k1kodepos' AS k1kodepos,
        row_payload ->> 'k1negara' AS k1negara,
        row_payload ->> 'k1kontakperson' AS k1kontakperson,
        row_payload ->> 'k1kontaknohp' AS k1kontaknohp,
        row_payload ->> 'k1kontakemail' AS k1kontakemail,
        row_payload ->> 'k1notelp1' AS k1notelp1,
        row_payload ->> 'k1notelp2' AS k1notelp2,
        row_payload ->> 'k1nofax' AS k1nofax,
        row_payload ->> 'k1email' AS k1email,
        row_payload ->> 'k1website' AS k1website,
        row_payload ->> 'k2alamat1' AS k2alamat1,
        row_payload ->> 'k2alamat2' AS k2alamat2,
        row_payload ->> 'k2alamat3' AS k2alamat3,
        row_payload ->> 'k2alamat4' AS k2alamat4,
        row_payload ->> 'k2alamat5' AS k2alamat5,
        row_payload ->> 'k2propinsi' AS k2propinsi,
        row_payload ->> 'k2kota' AS k2kota,
        row_payload ->> 'k2kodepos' AS k2kodepos,
        row_payload ->> 'k2negara' AS k2negara,
        row_payload ->> 'k2kontakperson' AS k2kontakperson,
        row_payload ->> 'k2kontaknohp' AS k2kontaknohp,
        row_payload ->> 'k2kontakemail' AS k2kontakemail,
        row_payload ->> 'k2notelp1' AS k2notelp1,
        row_payload ->> 'k2notelp2' AS k2notelp2,
        row_payload ->> 'k2nofax' AS k2nofax,
        row_payload ->> 'k2email' AS k2email,
        row_payload ->> 'k2website' AS k2website,
        row_payload ->> 'k3alamat1' AS k3alamat1,
        row_payload ->> 'k3alamat2' AS k3alamat2,
        row_payload ->> 'k3alamat3' AS k3alamat3,
        row_payload ->> 'k3alamat4' AS k3alamat4,
        row_payload ->> 'k3alamat5' AS k3alamat5,
        row_payload ->> 'k3kota' AS k3kota,
        row_payload ->> 'k3propinsi' AS k3propinsi,
        row_payload ->> 'k3kodepos' AS k3kodepos,
        row_payload ->> 'k3negara' AS k3negara,
        row_payload ->> 'k3kontakperson' AS k3kontakperson,
        row_payload ->> 'k3kontaknohp' AS k3kontaknohp,
        row_payload ->> 'k3kontakemail' AS k3kontakemail,
        row_payload ->> 'k3notelp1' AS k3notelp1,
        row_payload ->> 'k3notelp2' AS k3notelp2,
        row_payload ->> 'k3nofax' AS k3nofax,
        row_payload ->> 'k3email' AS k3email,
        row_payload ->> 'k3website' AS k3website,
        row_payload ->> 'k4alamat1' AS k4alamat1,
        row_payload ->> 'k4alamat2' AS k4alamat2,
        row_payload ->> 'k4alamat3' AS k4alamat3,
        row_payload ->> 'k4alamat4' AS k4alamat4,
        row_payload ->> 'k4alamat5' AS k4alamat5,
        row_payload ->> 'k4kota' AS k4kota,
        row_payload ->> 'k4propinsi' AS k4propinsi,
        row_payload ->> 'k4kodepos' AS k4kodepos,
        row_payload ->> 'k4negara' AS k4negara,
        row_payload ->> 'k4kontakperson' AS k4kontakperson,
        row_payload ->> 'k4kontaknohp' AS k4kontaknohp,
        row_payload ->> 'k4kontakemail' AS k4kontakemail,
        row_payload ->> 'k4notelp1' AS k4notelp1,
        row_payload ->> 'k4notelp2' AS k4notelp2,
        row_payload ->> 'k4nofax' AS k4nofax,
        row_payload ->> 'k4email' AS k4email,
        row_payload ->> 'k4website' AS k4website,
        row_payload ->> 'knpwp' AS knpwp,
        row_payload ->> 'kpkp' AS kpkp,
        NULLIF(row_payload ->> 'kbatashutang', '')::numeric(20,6) AS kbatashutang,
        row_payload ->> 'kterminbeli' AS kterminbeli,
        row_payload ->> 'krekhutang' AS krekhutang,
        row_payload ->> 'kbagpembelian' AS kbagpembelian,
        row_payload ->> 'kfobbeli' AS kfobbeli,
        row_payload ->> 'kviabeli' AS kviabeli,
        NULLIF(row_payload ->> 'kbataspiutang', '')::numeric(20,6) AS kbataspiutang,
        row_payload ->> 'kterminjual' AS kterminjual,
        row_payload ->> 'krekpiutang' AS krekpiutang,
        row_payload ->> 'kbagpenjualan' AS kbagpenjualan,
        row_payload ->> 'ktingkatjual' AS ktingkatjual,
        row_payload ->> 'kfobjual' AS kfobjual,
        row_payload ->> 'kviajual' AS kviajual,
        NULLIF(row_payload ->> 'ktglkontrak', '')::timestamptz AS ktglkontrak,
        row_payload ->> 'kbank' AS kbank,
        row_payload ->> 'knorekening' AS knorekening,
        row_payload ->> 'kjeniskelamin' AS kjeniskelamin,
        row_payload ->> 'kmatauang' AS kmatauang,
        NULLIF(row_payload ->> 'ktgllahir', '')::timestamptz AS ktgllahir,
        NULLIF(row_payload ->> 'ktglnikah', '')::timestamptz AS ktglnikah,
        NULLIF(row_payload ->> 'kkomisikode', '')::numeric(20,6) AS kkomisikode,
        NULLIF(row_payload ->> 'kkomisipenjualan', '')::numeric(20,6) AS kkomisipenjualan,
        row_payload ->> 'kcatatan' AS kcatatan,
        row_payload ->> 'ksinkron' AS ksinkron,
        row_payload ->> 'kdownloaded' AS kdownloaded,
        NULLIF(row_payload ->> 'khargacustom', '')::numeric(20,6) AS khargacustom,
        NULLIF(row_payload ->> 'kpajakcustom', '')::numeric(20,6) AS kpajakcustom,
        NULLIF(row_payload ->> 'ktotalpiutang', '')::numeric(20,6) AS ktotalpiutang,
        NULLIF(row_payload ->> 'ktotalhutang', '')::numeric(20,6) AS ktotalhutang,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'kid') IS NOT NULL
) AS prepared
ON CONFLICT (kid) DO UPDATE
SET
    kkode = EXCLUDED.kkode,
    knama = EXCLUDED.knama,
    kkategori = EXCLUDED.kkategori,
    kkategorinama = EXCLUDED.kkategorinama,
    kcabang = EXCLUDED.kcabang,
    kcabangnama = EXCLUDED.kcabangnama,
    klokasi = EXCLUDED.klokasi,
    klokasinama = EXCLUDED.klokasinama,
    kgudang = EXCLUDED.kgudang,
    kgudangnama = EXCLUDED.kgudangnama,
    kkategorisalesman = EXCLUDED.kkategorisalesman,
    kkategorisalesmannama = EXCLUDED.kkategorisalesmannama,
    karea = EXCLUDED.karea,
    kareanama = EXCLUDED.kareanama,
    kkategoricustomer = EXCLUDED.kkategoricustomer,
    kkategoricustomernama = EXCLUDED.kkategoricustomernama,
    kkategorisupplier = EXCLUDED.kkategorisupplier,
    kkategorisuppliernama = EXCLUDED.kkategorisuppliernama,
    kdivisi = EXCLUDED.kdivisi,
    kdivisinama = EXCLUDED.kdivisinama,
    ksubdivisi = EXCLUDED.ksubdivisi,
    ksubdivisinama = EXCLUDED.ksubdivisinama,
    ksalesman = EXCLUDED.ksalesman,
    ksalesmannama = EXCLUDED.ksalesmannama,
    kkontakperson = EXCLUDED.kkontakperson,
    kterminglobal = EXCLUDED.kterminglobal,
    kaktif = EXCLUDED.kaktif,
    kaktiftgl = EXCLUDED.kaktiftgl,
    k1alamat1 = EXCLUDED.k1alamat1,
    k1alamat2 = EXCLUDED.k1alamat2,
    k1alamat3 = EXCLUDED.k1alamat3,
    k1alamat4 = EXCLUDED.k1alamat4,
    k1alamat5 = EXCLUDED.k1alamat5,
    k1kota = EXCLUDED.k1kota,
    k1propinsi = EXCLUDED.k1propinsi,
    k1kodepos = EXCLUDED.k1kodepos,
    k1negara = EXCLUDED.k1negara,
    k1kontakperson = EXCLUDED.k1kontakperson,
    k1kontaknohp = EXCLUDED.k1kontaknohp,
    k1kontakemail = EXCLUDED.k1kontakemail,
    k1notelp1 = EXCLUDED.k1notelp1,
    k1notelp2 = EXCLUDED.k1notelp2,
    k1nofax = EXCLUDED.k1nofax,
    k1email = EXCLUDED.k1email,
    k1website = EXCLUDED.k1website,
    k2alamat1 = EXCLUDED.k2alamat1,
    k2alamat2 = EXCLUDED.k2alamat2,
    k2alamat3 = EXCLUDED.k2alamat3,
    k2alamat4 = EXCLUDED.k2alamat4,
    k2alamat5 = EXCLUDED.k2alamat5,
    k2propinsi = EXCLUDED.k2propinsi,
    k2kota = EXCLUDED.k2kota,
    k2kodepos = EXCLUDED.k2kodepos,
    k2negara = EXCLUDED.k2negara,
    k2kontakperson = EXCLUDED.k2kontakperson,
    k2kontaknohp = EXCLUDED.k2kontaknohp,
    k2kontakemail = EXCLUDED.k2kontakemail,
    k2notelp1 = EXCLUDED.k2notelp1,
    k2notelp2 = EXCLUDED.k2notelp2,
    k2nofax = EXCLUDED.k2nofax,
    k2email = EXCLUDED.k2email,
    k2website = EXCLUDED.k2website,
    k3alamat1 = EXCLUDED.k3alamat1,
    k3alamat2 = EXCLUDED.k3alamat2,
    k3alamat3 = EXCLUDED.k3alamat3,
    k3alamat4 = EXCLUDED.k3alamat4,
    k3alamat5 = EXCLUDED.k3alamat5,
    k3kota = EXCLUDED.k3kota,
    k3propinsi = EXCLUDED.k3propinsi,
    k3kodepos = EXCLUDED.k3kodepos,
    k3negara = EXCLUDED.k3negara,
    k3kontakperson = EXCLUDED.k3kontakperson,
    k3kontaknohp = EXCLUDED.k3kontaknohp,
    k3kontakemail = EXCLUDED.k3kontakemail,
    k3notelp1 = EXCLUDED.k3notelp1,
    k3notelp2 = EXCLUDED.k3notelp2,
    k3nofax = EXCLUDED.k3nofax,
    k3email = EXCLUDED.k3email,
    k3website = EXCLUDED.k3website,
    k4alamat1 = EXCLUDED.k4alamat1,
    k4alamat2 = EXCLUDED.k4alamat2,
    k4alamat3 = EXCLUDED.k4alamat3,
    k4alamat4 = EXCLUDED.k4alamat4,
    k4alamat5 = EXCLUDED.k4alamat5,
    k4kota = EXCLUDED.k4kota,
    k4propinsi = EXCLUDED.k4propinsi,
    k4kodepos = EXCLUDED.k4kodepos,
    k4negara = EXCLUDED.k4negara,
    k4kontakperson = EXCLUDED.k4kontakperson,
    k4kontaknohp = EXCLUDED.k4kontaknohp,
    k4kontakemail = EXCLUDED.k4kontakemail,
    k4notelp1 = EXCLUDED.k4notelp1,
    k4notelp2 = EXCLUDED.k4notelp2,
    k4nofax = EXCLUDED.k4nofax,
    k4email = EXCLUDED.k4email,
    k4website = EXCLUDED.k4website,
    knpwp = EXCLUDED.knpwp,
    kpkp = EXCLUDED.kpkp,
    kbatashutang = EXCLUDED.kbatashutang,
    kterminbeli = EXCLUDED.kterminbeli,
    krekhutang = EXCLUDED.krekhutang,
    kbagpembelian = EXCLUDED.kbagpembelian,
    kfobbeli = EXCLUDED.kfobbeli,
    kviabeli = EXCLUDED.kviabeli,
    kbataspiutang = EXCLUDED.kbataspiutang,
    kterminjual = EXCLUDED.kterminjual,
    krekpiutang = EXCLUDED.krekpiutang,
    kbagpenjualan = EXCLUDED.kbagpenjualan,
    ktingkatjual = EXCLUDED.ktingkatjual,
    kfobjual = EXCLUDED.kfobjual,
    kviajual = EXCLUDED.kviajual,
    ktglkontrak = EXCLUDED.ktglkontrak,
    kbank = EXCLUDED.kbank,
    knorekening = EXCLUDED.knorekening,
    kjeniskelamin = EXCLUDED.kjeniskelamin,
    kmatauang = EXCLUDED.kmatauang,
    ktgllahir = EXCLUDED.ktgllahir,
    ktglnikah = EXCLUDED.ktglnikah,
    kkomisikode = EXCLUDED.kkomisikode,
    kkomisipenjualan = EXCLUDED.kkomisipenjualan,
    kcatatan = EXCLUDED.kcatatan,
    ksinkron = EXCLUDED.ksinkron,
    kdownloaded = EXCLUDED.kdownloaded,
    khargacustom = EXCLUDED.khargacustom,
    kpajakcustom = EXCLUDED.kpajakcustom,
    ktotalpiutang = EXCLUDED.ktotalpiutang,
    ktotalhutang = EXCLUDED.ktotalhutang,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_contact_category
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_contact_category'
)
INSERT INTO m1_contact_category (
    cckode, ccnama, cccatatan, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    cckode, ccnama, cccatatan, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'cckode' AS cckode,
        row_payload ->> 'ccnama' AS ccnama,
        row_payload ->> 'cccatatan' AS cccatatan,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'cckode') IS NOT NULL
) AS prepared
ON CONFLICT (cckode) DO UPDATE
SET
    ccnama = EXCLUDED.ccnama,
    cccatatan = EXCLUDED.cccatatan,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_cost_center
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_cost_center'
)
INSERT INTO m1_cost_center (
    cckode, ccnama, ccdivisi, ccakun, ccaktif, cccatatan, ccsubdepartemen, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    cckode, ccnama, ccdivisi, ccakun, ccaktif, cccatatan, ccsubdepartemen, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'cckode' AS cckode,
        row_payload ->> 'ccnama' AS ccnama,
        row_payload ->> 'ccdivisi' AS ccdivisi,
        row_payload ->> 'ccakun' AS ccakun,
        NULLIF(row_payload ->> 'ccaktif', '')::bigint AS ccaktif,
        row_payload ->> 'cccatatan' AS cccatatan,
        row_payload ->> 'ccsubdepartemen' AS ccsubdepartemen,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'cckode') IS NOT NULL
) AS prepared
ON CONFLICT (cckode) DO UPDATE
SET
    ccnama = EXCLUDED.ccnama,
    ccdivisi = EXCLUDED.ccdivisi,
    ccakun = EXCLUDED.ccakun,
    ccaktif = EXCLUDED.ccaktif,
    cccatatan = EXCLUDED.cccatatan,
    ccsubdepartemen = EXCLUDED.ccsubdepartemen,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_currency
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_currency'
)
INSERT INTO m1_currency (
    ckode, cnama, csimbol, ckurs, ccatatan, caktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    ckode, cnama, csimbol, ckurs, ccatatan, caktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'ckode' AS ckode,
        row_payload ->> 'cnama' AS cnama,
        row_payload ->> 'csimbol' AS csimbol,
        NULLIF(row_payload ->> 'ckurs', '')::numeric(20,6) AS ckurs,
        row_payload ->> 'ccatatan' AS ccatatan,
        NULLIF(row_payload ->> 'caktif', '')::bigint AS caktif,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'ckode') IS NOT NULL
) AS prepared
ON CONFLICT (ckode) DO UPDATE
SET
    cnama = EXCLUDED.cnama,
    csimbol = EXCLUDED.csimbol,
    ckurs = EXCLUDED.ckurs,
    ccatatan = EXCLUDED.ccatatan,
    caktif = EXCLUDED.caktif,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_customer_category
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_customer_category'
)
INSERT INTO m1_customer_category (
    cckode, ccnama, cccatatan, cctingkatjual, ccaktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    cckode, ccnama, cccatatan, cctingkatjual, ccaktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'cckode' AS cckode,
        row_payload ->> 'ccnama' AS ccnama,
        row_payload ->> 'cccatatan' AS cccatatan,
        row_payload ->> 'cctingkatjual' AS cctingkatjual,
        NULLIF(row_payload ->> 'ccaktif', '')::bigint AS ccaktif,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'cckode') IS NOT NULL
) AS prepared
ON CONFLICT (cckode) DO UPDATE
SET
    ccnama = EXCLUDED.ccnama,
    cccatatan = EXCLUDED.cccatatan,
    cctingkatjual = EXCLUDED.cctingkatjual,
    ccaktif = EXCLUDED.ccaktif,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_division
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_division'
)
INSERT INTO m1_division (
    dkode, dnama, dcatatan, daktif, dindexbarcode, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    dkode, dnama, dcatatan, daktif, dindexbarcode, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'dkode' AS dkode,
        row_payload ->> 'dnama' AS dnama,
        row_payload ->> 'dcatatan' AS dcatatan,
        NULLIF(row_payload ->> 'daktif', '')::bigint AS daktif,
        row_payload ->> 'dindexbarcode' AS dindexbarcode,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'dkode') IS NOT NULL
) AS prepared
ON CONFLICT (dkode) DO UPDATE
SET
    dnama = EXCLUDED.dnama,
    dcatatan = EXCLUDED.dcatatan,
    daktif = EXCLUDED.daktif,
    dindexbarcode = EXCLUDED.dindexbarcode,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_expedition
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_expedition'
)
INSERT INTO m1_expedition (
    ekode, enama, ealamat, ekota, etelp, efax, ecatatan, ekontakperson, eemail, eaktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    ekode, enama, ealamat, ekota, etelp, efax, ecatatan, ekontakperson, eemail, eaktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'ekode' AS ekode,
        row_payload ->> 'enama' AS enama,
        row_payload ->> 'ealamat' AS ealamat,
        row_payload ->> 'ekota' AS ekota,
        row_payload ->> 'etelp' AS etelp,
        row_payload ->> 'efax' AS efax,
        row_payload ->> 'ecatatan' AS ecatatan,
        row_payload ->> 'ekontakperson' AS ekontakperson,
        row_payload ->> 'eemail' AS eemail,
        NULLIF(row_payload ->> 'eaktif', '')::bigint AS eaktif,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'ekode') IS NOT NULL
) AS prepared
ON CONFLICT (ekode) DO UPDATE
SET
    enama = EXCLUDED.enama,
    ealamat = EXCLUDED.ealamat,
    ekota = EXCLUDED.ekota,
    etelp = EXCLUDED.etelp,
    efax = EXCLUDED.efax,
    ecatatan = EXCLUDED.ecatatan,
    ekontakperson = EXCLUDED.ekontakperson,
    eemail = EXCLUDED.eemail,
    eaktif = EXCLUDED.eaktif,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_bank
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_bank'
)
INSERT INTO m1_bank (
    bkode, bnama, balamat, bkota, bnotelp, bnofax, bcatatan, baktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    bkode, bnama, balamat, bkota, bnotelp, bnofax, bcatatan, baktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'bkode' AS bkode,
        row_payload ->> 'bnama' AS bnama,
        row_payload ->> 'balamat' AS balamat,
        row_payload ->> 'bkota' AS bkota,
        row_payload ->> 'bnotelp' AS bnotelp,
        row_payload ->> 'bnofax' AS bnofax,
        row_payload ->> 'bcatatan' AS bcatatan,
        NULLIF(row_payload ->> 'baktif', '')::bigint AS baktif,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'bkode') IS NOT NULL
) AS prepared
ON CONFLICT (bkode) DO UPDATE
SET
    bnama = EXCLUDED.bnama,
    balamat = EXCLUDED.balamat,
    bkota = EXCLUDED.bkota,
    bnotelp = EXCLUDED.bnotelp,
    bnofax = EXCLUDED.bnofax,
    bcatatan = EXCLUDED.bcatatan,
    baktif = EXCLUDED.baktif,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_city
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_city'
)
INSERT INTO m1_city (
    ckode, cnama, cpropinsi, ccatatan, caktif, cnegara, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    ckode, cnama, cpropinsi, ccatatan, caktif, cnegara, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'ckode' AS ckode,
        row_payload ->> 'cnama' AS cnama,
        row_payload ->> 'cpropinsi' AS cpropinsi,
        row_payload ->> 'ccatatan' AS ccatatan,
        NULLIF(row_payload ->> 'caktif', '')::bigint AS caktif,
        row_payload ->> 'cnegara' AS cnegara,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'ckode') IS NOT NULL
) AS prepared
ON CONFLICT (ckode) DO UPDATE
SET
    cnama = EXCLUDED.cnama,
    cpropinsi = EXCLUDED.cpropinsi,
    ccatatan = EXCLUDED.ccatatan,
    caktif = EXCLUDED.caktif,
    cnegara = EXCLUDED.cnegara,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_item
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_item'
)
INSERT INTO m1_item (
    bid, bkode, bnama, bnamaalias1, bnamaalias2, bnamaalias3, bnamaalias4, bnamaalias5, btipe, bjenis, bjenisdetail, bkategori, bkelasproduk, bretur, btag, bketerangan, bsatuan, bnilaisatuan, bsatuandefault, bnilaisatuandefault, bhpp, bcabang, blokasi, bdivisi, bsubdivisi, bdepartemen, bsubdepartemen, bgudang, bproyek, bsubitem, bsubitemdari, bbarcode, bsuplier, baktif, baktiftgl, bstokminimal, bstokmaksimal, breorder, bminorder, bjmlorderbeli, bjmlorderjual, bkategoriumur, bstatusmoving, bsifatharga, bpromo, bpromoberlaku, bkl, bkp, bpajakbeli, bpajakjual, bhargabeli, bhppaverage, bhargajual1, bhargajual2, bhargajual3, bhargajual4, bhargajual5, bdiskonjual1, bdiskonjual2, bdiskonjual3, bdiskonjual4, bdiskonjual5, bstok, bkomisi, bmarginminimal, brekpersediaan, brekpenjualan, brekreturpenjualan, brekdiskonpenjualan, brekhargapokok, brekreturpembelian, brekdiskonpembelian, brekkonsinyasi, bapanjang, balebar, batinggi, baberat, bavolume, bawarna, baoem, bamerk, baukuran, bamodel, bakelas, bserial, bbatch, bpengganti, bgambar, burutan, bcustom1, bcustom2, bcustom3, bcustom4, bcustom5, bcustom6, bcustom7, bcustom8, bcustom9, bcustom10, bcustom11, bcustom12, bcustom13, bcustom14, bcustom15, bcatatan, bedithpp, bmobile, bassembly, bdownloaded, bjmllapangan, bsatuanlapangan, bsubkelas, bmaterial, bsection, bvendor, bdesigner, basset, bhargajual6, bhargajual7, bhargajual8, bhargajual9, bhargajual10, bdiskonjual6, bdiskonjual7, bdiskonjual8, bdiskonjual9, bdiskonjual10, bavolumevarchar, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    bid, bkode, bnama, bnamaalias1, bnamaalias2, bnamaalias3, bnamaalias4, bnamaalias5, btipe, bjenis, bjenisdetail, bkategori, bkelasproduk, bretur, btag, bketerangan, bsatuan, bnilaisatuan, bsatuandefault, bnilaisatuandefault, bhpp, bcabang, blokasi, bdivisi, bsubdivisi, bdepartemen, bsubdepartemen, bgudang, bproyek, bsubitem, bsubitemdari, bbarcode, bsuplier, baktif, baktiftgl, bstokminimal, bstokmaksimal, breorder, bminorder, bjmlorderbeli, bjmlorderjual, bkategoriumur, bstatusmoving, bsifatharga, bpromo, bpromoberlaku, bkl, bkp, bpajakbeli, bpajakjual, bhargabeli, bhppaverage, bhargajual1, bhargajual2, bhargajual3, bhargajual4, bhargajual5, bdiskonjual1, bdiskonjual2, bdiskonjual3, bdiskonjual4, bdiskonjual5, bstok, bkomisi, bmarginminimal, brekpersediaan, brekpenjualan, brekreturpenjualan, brekdiskonpenjualan, brekhargapokok, brekreturpembelian, brekdiskonpembelian, brekkonsinyasi, bapanjang, balebar, batinggi, baberat, bavolume, bawarna, baoem, bamerk, baukuran, bamodel, bakelas, bserial, bbatch, bpengganti, bgambar, burutan, bcustom1, bcustom2, bcustom3, bcustom4, bcustom5, bcustom6, bcustom7, bcustom8, bcustom9, bcustom10, bcustom11, bcustom12, bcustom13, bcustom14, bcustom15, bcatatan, bedithpp, bmobile, bassembly, bdownloaded, bjmllapangan, bsatuanlapangan, bsubkelas, bmaterial, bsection, bvendor, bdesigner, basset, bhargajual6, bhargajual7, bhargajual8, bhargajual9, bhargajual10, bdiskonjual6, bdiskonjual7, bdiskonjual8, bdiskonjual9, bdiskonjual10, bavolumevarchar, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'bid', '')::bigint AS bid,
        row_payload ->> 'bkode' AS bkode,
        row_payload ->> 'bnama' AS bnama,
        row_payload ->> 'bnamaalias1' AS bnamaalias1,
        row_payload ->> 'bnamaalias2' AS bnamaalias2,
        row_payload ->> 'bnamaalias3' AS bnamaalias3,
        row_payload ->> 'bnamaalias4' AS bnamaalias4,
        row_payload ->> 'bnamaalias5' AS bnamaalias5,
        row_payload ->> 'btipe' AS btipe,
        row_payload ->> 'bjenis' AS bjenis,
        row_payload ->> 'bjenisdetail' AS bjenisdetail,
        row_payload ->> 'bkategori' AS bkategori,
        row_payload ->> 'bkelasproduk' AS bkelasproduk,
        row_payload ->> 'bretur' AS bretur,
        row_payload ->> 'btag' AS btag,
        row_payload ->> 'bketerangan' AS bketerangan,
        row_payload ->> 'bsatuan' AS bsatuan,
        NULLIF(row_payload ->> 'bnilaisatuan', '')::numeric(20,6) AS bnilaisatuan,
        row_payload ->> 'bsatuandefault' AS bsatuandefault,
        NULLIF(row_payload ->> 'bnilaisatuandefault', '')::numeric(20,6) AS bnilaisatuandefault,
        row_payload ->> 'bhpp' AS bhpp,
        row_payload ->> 'bcabang' AS bcabang,
        row_payload ->> 'blokasi' AS blokasi,
        row_payload ->> 'bdivisi' AS bdivisi,
        row_payload ->> 'bsubdivisi' AS bsubdivisi,
        row_payload ->> 'bdepartemen' AS bdepartemen,
        row_payload ->> 'bsubdepartemen' AS bsubdepartemen,
        row_payload ->> 'bgudang' AS bgudang,
        row_payload ->> 'bproyek' AS bproyek,
        row_payload ->> 'bsubitem' AS bsubitem,
        row_payload ->> 'bsubitemdari' AS bsubitemdari,
        row_payload ->> 'bbarcode' AS bbarcode,
        row_payload ->> 'bsuplier' AS bsuplier,
        NULLIF(row_payload ->> 'baktif', '')::bigint AS baktif,
        NULLIF(row_payload ->> 'baktiftgl', '')::timestamptz AS baktiftgl,
        row_payload ->> 'bstokminimal' AS bstokminimal,
        row_payload ->> 'bstokmaksimal' AS bstokmaksimal,
        row_payload ->> 'breorder' AS breorder,
        row_payload ->> 'bminorder' AS bminorder,
        NULLIF(row_payload ->> 'bjmlorderbeli', '')::numeric(20,6) AS bjmlorderbeli,
        NULLIF(row_payload ->> 'bjmlorderjual', '')::numeric(20,6) AS bjmlorderjual,
        row_payload ->> 'bkategoriumur' AS bkategoriumur,
        row_payload ->> 'bstatusmoving' AS bstatusmoving,
        NULLIF(row_payload ->> 'bsifatharga', '')::numeric(20,6) AS bsifatharga,
        row_payload ->> 'bpromo' AS bpromo,
        row_payload ->> 'bpromoberlaku' AS bpromoberlaku,
        row_payload ->> 'bkl' AS bkl,
        row_payload ->> 'bkp' AS bkp,
        NULLIF(row_payload ->> 'bpajakbeli', '')::numeric(20,6) AS bpajakbeli,
        NULLIF(row_payload ->> 'bpajakjual', '')::numeric(20,6) AS bpajakjual,
        NULLIF(row_payload ->> 'bhargabeli', '')::numeric(20,6) AS bhargabeli,
        row_payload ->> 'bhppaverage' AS bhppaverage,
        NULLIF(row_payload ->> 'bhargajual1', '')::numeric(20,6) AS bhargajual1,
        NULLIF(row_payload ->> 'bhargajual2', '')::numeric(20,6) AS bhargajual2,
        NULLIF(row_payload ->> 'bhargajual3', '')::numeric(20,6) AS bhargajual3,
        NULLIF(row_payload ->> 'bhargajual4', '')::numeric(20,6) AS bhargajual4,
        NULLIF(row_payload ->> 'bhargajual5', '')::numeric(20,6) AS bhargajual5,
        NULLIF(row_payload ->> 'bdiskonjual1', '')::numeric(20,6) AS bdiskonjual1,
        NULLIF(row_payload ->> 'bdiskonjual2', '')::numeric(20,6) AS bdiskonjual2,
        NULLIF(row_payload ->> 'bdiskonjual3', '')::numeric(20,6) AS bdiskonjual3,
        NULLIF(row_payload ->> 'bdiskonjual4', '')::numeric(20,6) AS bdiskonjual4,
        NULLIF(row_payload ->> 'bdiskonjual5', '')::numeric(20,6) AS bdiskonjual5,
        row_payload ->> 'bstok' AS bstok,
        NULLIF(row_payload ->> 'bkomisi', '')::numeric(20,6) AS bkomisi,
        row_payload ->> 'bmarginminimal' AS bmarginminimal,
        row_payload ->> 'brekpersediaan' AS brekpersediaan,
        row_payload ->> 'brekpenjualan' AS brekpenjualan,
        row_payload ->> 'brekreturpenjualan' AS brekreturpenjualan,
        NULLIF(row_payload ->> 'brekdiskonpenjualan', '')::numeric(20,6) AS brekdiskonpenjualan,
        NULLIF(row_payload ->> 'brekhargapokok', '')::numeric(20,6) AS brekhargapokok,
        row_payload ->> 'brekreturpembelian' AS brekreturpembelian,
        NULLIF(row_payload ->> 'brekdiskonpembelian', '')::numeric(20,6) AS brekdiskonpembelian,
        row_payload ->> 'brekkonsinyasi' AS brekkonsinyasi,
        row_payload ->> 'bapanjang' AS bapanjang,
        row_payload ->> 'balebar' AS balebar,
        row_payload ->> 'batinggi' AS batinggi,
        NULLIF(row_payload ->> 'baberat', '')::numeric(20,6) AS baberat,
        NULLIF(row_payload ->> 'bavolume', '')::numeric(20,6) AS bavolume,
        row_payload ->> 'bawarna' AS bawarna,
        row_payload ->> 'baoem' AS baoem,
        row_payload ->> 'bamerk' AS bamerk,
        row_payload ->> 'baukuran' AS baukuran,
        row_payload ->> 'bamodel' AS bamodel,
        row_payload ->> 'bakelas' AS bakelas,
        row_payload ->> 'bserial' AS bserial,
        row_payload ->> 'bbatch' AS bbatch,
        row_payload ->> 'bpengganti' AS bpengganti,
        row_payload ->> 'bgambar' AS bgambar,
        row_payload ->> 'burutan' AS burutan,
        row_payload ->> 'bcustom1' AS bcustom1,
        row_payload ->> 'bcustom2' AS bcustom2,
        row_payload ->> 'bcustom3' AS bcustom3,
        row_payload ->> 'bcustom4' AS bcustom4,
        row_payload ->> 'bcustom5' AS bcustom5,
        row_payload ->> 'bcustom6' AS bcustom6,
        row_payload ->> 'bcustom7' AS bcustom7,
        row_payload ->> 'bcustom8' AS bcustom8,
        row_payload ->> 'bcustom9' AS bcustom9,
        row_payload ->> 'bcustom10' AS bcustom10,
        row_payload ->> 'bcustom11' AS bcustom11,
        row_payload ->> 'bcustom12' AS bcustom12,
        row_payload ->> 'bcustom13' AS bcustom13,
        row_payload ->> 'bcustom14' AS bcustom14,
        row_payload ->> 'bcustom15' AS bcustom15,
        row_payload ->> 'bcatatan' AS bcatatan,
        row_payload ->> 'bedithpp' AS bedithpp,
        row_payload ->> 'bmobile' AS bmobile,
        row_payload ->> 'bassembly' AS bassembly,
        row_payload ->> 'bdownloaded' AS bdownloaded,
        NULLIF(row_payload ->> 'bjmllapangan', '')::numeric(20,6) AS bjmllapangan,
        row_payload ->> 'bsatuanlapangan' AS bsatuanlapangan,
        row_payload ->> 'bsubkelas' AS bsubkelas,
        row_payload ->> 'bmaterial' AS bmaterial,
        row_payload ->> 'bsection' AS bsection,
        row_payload ->> 'bvendor' AS bvendor,
        row_payload ->> 'bdesigner' AS bdesigner,
        row_payload ->> 'basset' AS basset,
        NULLIF(row_payload ->> 'bhargajual6', '')::numeric(20,6) AS bhargajual6,
        NULLIF(row_payload ->> 'bhargajual7', '')::numeric(20,6) AS bhargajual7,
        NULLIF(row_payload ->> 'bhargajual8', '')::numeric(20,6) AS bhargajual8,
        NULLIF(row_payload ->> 'bhargajual9', '')::numeric(20,6) AS bhargajual9,
        NULLIF(row_payload ->> 'bhargajual10', '')::numeric(20,6) AS bhargajual10,
        NULLIF(row_payload ->> 'bdiskonjual6', '')::numeric(20,6) AS bdiskonjual6,
        NULLIF(row_payload ->> 'bdiskonjual7', '')::numeric(20,6) AS bdiskonjual7,
        NULLIF(row_payload ->> 'bdiskonjual8', '')::numeric(20,6) AS bdiskonjual8,
        NULLIF(row_payload ->> 'bdiskonjual9', '')::numeric(20,6) AS bdiskonjual9,
        NULLIF(row_payload ->> 'bdiskonjual10', '')::numeric(20,6) AS bdiskonjual10,
        NULLIF(row_payload ->> 'bavolumevarchar', '')::numeric(20,6) AS bavolumevarchar,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'bid') IS NOT NULL
) AS prepared
ON CONFLICT (bid) DO UPDATE
SET
    bkode = EXCLUDED.bkode,
    bnama = EXCLUDED.bnama,
    bnamaalias1 = EXCLUDED.bnamaalias1,
    bnamaalias2 = EXCLUDED.bnamaalias2,
    bnamaalias3 = EXCLUDED.bnamaalias3,
    bnamaalias4 = EXCLUDED.bnamaalias4,
    bnamaalias5 = EXCLUDED.bnamaalias5,
    btipe = EXCLUDED.btipe,
    bjenis = EXCLUDED.bjenis,
    bjenisdetail = EXCLUDED.bjenisdetail,
    bkategori = EXCLUDED.bkategori,
    bkelasproduk = EXCLUDED.bkelasproduk,
    bretur = EXCLUDED.bretur,
    btag = EXCLUDED.btag,
    bketerangan = EXCLUDED.bketerangan,
    bsatuan = EXCLUDED.bsatuan,
    bnilaisatuan = EXCLUDED.bnilaisatuan,
    bsatuandefault = EXCLUDED.bsatuandefault,
    bnilaisatuandefault = EXCLUDED.bnilaisatuandefault,
    bhpp = EXCLUDED.bhpp,
    bcabang = EXCLUDED.bcabang,
    blokasi = EXCLUDED.blokasi,
    bdivisi = EXCLUDED.bdivisi,
    bsubdivisi = EXCLUDED.bsubdivisi,
    bdepartemen = EXCLUDED.bdepartemen,
    bsubdepartemen = EXCLUDED.bsubdepartemen,
    bgudang = EXCLUDED.bgudang,
    bproyek = EXCLUDED.bproyek,
    bsubitem = EXCLUDED.bsubitem,
    bsubitemdari = EXCLUDED.bsubitemdari,
    bbarcode = EXCLUDED.bbarcode,
    bsuplier = EXCLUDED.bsuplier,
    baktif = EXCLUDED.baktif,
    baktiftgl = EXCLUDED.baktiftgl,
    bstokminimal = EXCLUDED.bstokminimal,
    bstokmaksimal = EXCLUDED.bstokmaksimal,
    breorder = EXCLUDED.breorder,
    bminorder = EXCLUDED.bminorder,
    bjmlorderbeli = EXCLUDED.bjmlorderbeli,
    bjmlorderjual = EXCLUDED.bjmlorderjual,
    bkategoriumur = EXCLUDED.bkategoriumur,
    bstatusmoving = EXCLUDED.bstatusmoving,
    bsifatharga = EXCLUDED.bsifatharga,
    bpromo = EXCLUDED.bpromo,
    bpromoberlaku = EXCLUDED.bpromoberlaku,
    bkl = EXCLUDED.bkl,
    bkp = EXCLUDED.bkp,
    bpajakbeli = EXCLUDED.bpajakbeli,
    bpajakjual = EXCLUDED.bpajakjual,
    bhargabeli = EXCLUDED.bhargabeli,
    bhppaverage = EXCLUDED.bhppaverage,
    bhargajual1 = EXCLUDED.bhargajual1,
    bhargajual2 = EXCLUDED.bhargajual2,
    bhargajual3 = EXCLUDED.bhargajual3,
    bhargajual4 = EXCLUDED.bhargajual4,
    bhargajual5 = EXCLUDED.bhargajual5,
    bdiskonjual1 = EXCLUDED.bdiskonjual1,
    bdiskonjual2 = EXCLUDED.bdiskonjual2,
    bdiskonjual3 = EXCLUDED.bdiskonjual3,
    bdiskonjual4 = EXCLUDED.bdiskonjual4,
    bdiskonjual5 = EXCLUDED.bdiskonjual5,
    bstok = EXCLUDED.bstok,
    bkomisi = EXCLUDED.bkomisi,
    bmarginminimal = EXCLUDED.bmarginminimal,
    brekpersediaan = EXCLUDED.brekpersediaan,
    brekpenjualan = EXCLUDED.brekpenjualan,
    brekreturpenjualan = EXCLUDED.brekreturpenjualan,
    brekdiskonpenjualan = EXCLUDED.brekdiskonpenjualan,
    brekhargapokok = EXCLUDED.brekhargapokok,
    brekreturpembelian = EXCLUDED.brekreturpembelian,
    brekdiskonpembelian = EXCLUDED.brekdiskonpembelian,
    brekkonsinyasi = EXCLUDED.brekkonsinyasi,
    bapanjang = EXCLUDED.bapanjang,
    balebar = EXCLUDED.balebar,
    batinggi = EXCLUDED.batinggi,
    baberat = EXCLUDED.baberat,
    bavolume = EXCLUDED.bavolume,
    bawarna = EXCLUDED.bawarna,
    baoem = EXCLUDED.baoem,
    bamerk = EXCLUDED.bamerk,
    baukuran = EXCLUDED.baukuran,
    bamodel = EXCLUDED.bamodel,
    bakelas = EXCLUDED.bakelas,
    bserial = EXCLUDED.bserial,
    bbatch = EXCLUDED.bbatch,
    bpengganti = EXCLUDED.bpengganti,
    bgambar = EXCLUDED.bgambar,
    burutan = EXCLUDED.burutan,
    bcustom1 = EXCLUDED.bcustom1,
    bcustom2 = EXCLUDED.bcustom2,
    bcustom3 = EXCLUDED.bcustom3,
    bcustom4 = EXCLUDED.bcustom4,
    bcustom5 = EXCLUDED.bcustom5,
    bcustom6 = EXCLUDED.bcustom6,
    bcustom7 = EXCLUDED.bcustom7,
    bcustom8 = EXCLUDED.bcustom8,
    bcustom9 = EXCLUDED.bcustom9,
    bcustom10 = EXCLUDED.bcustom10,
    bcustom11 = EXCLUDED.bcustom11,
    bcustom12 = EXCLUDED.bcustom12,
    bcustom13 = EXCLUDED.bcustom13,
    bcustom14 = EXCLUDED.bcustom14,
    bcustom15 = EXCLUDED.bcustom15,
    bcatatan = EXCLUDED.bcatatan,
    bedithpp = EXCLUDED.bedithpp,
    bmobile = EXCLUDED.bmobile,
    bassembly = EXCLUDED.bassembly,
    bdownloaded = EXCLUDED.bdownloaded,
    bjmllapangan = EXCLUDED.bjmllapangan,
    bsatuanlapangan = EXCLUDED.bsatuanlapangan,
    bsubkelas = EXCLUDED.bsubkelas,
    bmaterial = EXCLUDED.bmaterial,
    bsection = EXCLUDED.bsection,
    bvendor = EXCLUDED.bvendor,
    bdesigner = EXCLUDED.bdesigner,
    basset = EXCLUDED.basset,
    bhargajual6 = EXCLUDED.bhargajual6,
    bhargajual7 = EXCLUDED.bhargajual7,
    bhargajual8 = EXCLUDED.bhargajual8,
    bhargajual9 = EXCLUDED.bhargajual9,
    bhargajual10 = EXCLUDED.bhargajual10,
    bdiskonjual6 = EXCLUDED.bdiskonjual6,
    bdiskonjual7 = EXCLUDED.bdiskonjual7,
    bdiskonjual8 = EXCLUDED.bdiskonjual8,
    bdiskonjual9 = EXCLUDED.bdiskonjual9,
    bdiskonjual10 = EXCLUDED.bdiskonjual10,
    bavolumevarchar = EXCLUDED.bavolumevarchar,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_department
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_department'
)
INSERT INTO m1_department (
    dpkode, dpnama, dpdivisi, dpsubdivisi, dpcatatan, dpaktif, dpindexbarcode, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    dpkode, dpnama, dpdivisi, dpsubdivisi, dpcatatan, dpaktif, dpindexbarcode, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'dpkode' AS dpkode,
        row_payload ->> 'dpnama' AS dpnama,
        row_payload ->> 'dpdivisi' AS dpdivisi,
        row_payload ->> 'dpsubdivisi' AS dpsubdivisi,
        row_payload ->> 'dpcatatan' AS dpcatatan,
        NULLIF(row_payload ->> 'dpaktif', '')::bigint AS dpaktif,
        row_payload ->> 'dpindexbarcode' AS dpindexbarcode,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'dpkode') IS NOT NULL
) AS prepared
ON CONFLICT (dpkode) DO UPDATE
SET
    dpnama = EXCLUDED.dpnama,
    dpdivisi = EXCLUDED.dpdivisi,
    dpsubdivisi = EXCLUDED.dpsubdivisi,
    dpcatatan = EXCLUDED.dpcatatan,
    dpaktif = EXCLUDED.dpaktif,
    dpindexbarcode = EXCLUDED.dpindexbarcode,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_country
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_country'
)
INSERT INTO m1_country (
    ckode, cnama, ccatatan, caktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    ckode, cnama, ccatatan, caktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'ckode' AS ckode,
        row_payload ->> 'cnama' AS cnama,
        row_payload ->> 'ccatatan' AS ccatatan,
        NULLIF(row_payload ->> 'caktif', '')::bigint AS caktif,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'ckode') IS NOT NULL
) AS prepared
ON CONFLICT (ckode) DO UPDATE
SET
    cnama = EXCLUDED.cnama,
    ccatatan = EXCLUDED.ccatatan,
    caktif = EXCLUDED.caktif,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_item_category
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_item_category'
)
INSERT INTO m1_item_category (
    ickode, icnama, icdivisi, icsubdivisi, icdepartemen, icsubdepartemen, icrekpersediaan, icrekhargapokok, icrekpenjualan, iccatatan, icaktif, icindexbarcode, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    ickode, icnama, icdivisi, icsubdivisi, icdepartemen, icsubdepartemen, icrekpersediaan, icrekhargapokok, icrekpenjualan, iccatatan, icaktif, icindexbarcode, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'ickode' AS ickode,
        row_payload ->> 'icnama' AS icnama,
        row_payload ->> 'icdivisi' AS icdivisi,
        row_payload ->> 'icsubdivisi' AS icsubdivisi,
        row_payload ->> 'icdepartemen' AS icdepartemen,
        row_payload ->> 'icsubdepartemen' AS icsubdepartemen,
        row_payload ->> 'icrekpersediaan' AS icrekpersediaan,
        NULLIF(row_payload ->> 'icrekhargapokok', '')::numeric(20,6) AS icrekhargapokok,
        row_payload ->> 'icrekpenjualan' AS icrekpenjualan,
        row_payload ->> 'iccatatan' AS iccatatan,
        NULLIF(row_payload ->> 'icaktif', '')::bigint AS icaktif,
        row_payload ->> 'icindexbarcode' AS icindexbarcode,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'ickode') IS NOT NULL
) AS prepared
ON CONFLICT (ickode) DO UPDATE
SET
    icnama = EXCLUDED.icnama,
    icdivisi = EXCLUDED.icdivisi,
    icsubdivisi = EXCLUDED.icsubdivisi,
    icdepartemen = EXCLUDED.icdepartemen,
    icsubdepartemen = EXCLUDED.icsubdepartemen,
    icrekpersediaan = EXCLUDED.icrekpersediaan,
    icrekhargapokok = EXCLUDED.icrekhargapokok,
    icrekpenjualan = EXCLUDED.icrekpenjualan,
    iccatatan = EXCLUDED.iccatatan,
    icaktif = EXCLUDED.icaktif,
    icindexbarcode = EXCLUDED.icindexbarcode,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_item_permission
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_item_permission'
)
INSERT INTO m1_item_permission (
    ipkode, ipnama, ipcatatan, ipjual, ipmutasipusat, ippermintaanmutasi, ipmutasicabang, ipretursupplier, ippermintaanpembelian, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    ipkode, ipnama, ipcatatan, ipjual, ipmutasipusat, ippermintaanmutasi, ipmutasicabang, ipretursupplier, ippermintaanpembelian, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'ipkode' AS ipkode,
        row_payload ->> 'ipnama' AS ipnama,
        row_payload ->> 'ipcatatan' AS ipcatatan,
        row_payload ->> 'ipjual' AS ipjual,
        row_payload ->> 'ipmutasipusat' AS ipmutasipusat,
        row_payload ->> 'ippermintaanmutasi' AS ippermintaanmutasi,
        row_payload ->> 'ipmutasicabang' AS ipmutasicabang,
        row_payload ->> 'ipretursupplier' AS ipretursupplier,
        row_payload ->> 'ippermintaanpembelian' AS ippermintaanpembelian,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'ipkode') IS NOT NULL
) AS prepared
ON CONFLICT (ipkode) DO UPDATE
SET
    ipnama = EXCLUDED.ipnama,
    ipcatatan = EXCLUDED.ipcatatan,
    ipjual = EXCLUDED.ipjual,
    ipmutasipusat = EXCLUDED.ipmutasipusat,
    ippermintaanmutasi = EXCLUDED.ippermintaanmutasi,
    ipmutasicabang = EXCLUDED.ipmutasicabang,
    ipretursupplier = EXCLUDED.ipretursupplier,
    ippermintaanpembelian = EXCLUDED.ippermintaanpembelian,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_item_stock_warehouse
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_item_stock_warehouse'
)
INSERT INTO m1_item_stock_warehouse (
    idbarang, kgudang, stok, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idbarang, kgudang, stok, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idbarang', '')::bigint AS idbarang,
        row_payload ->> 'kgudang' AS kgudang,
        row_payload ->> 'stok' AS stok,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idbarang') IS NOT NULL AND (row_payload ->> 'kgudang') IS NOT NULL
) AS prepared
ON CONFLICT (idbarang, kgudang) DO UPDATE
SET
    stok = EXCLUDED.stok,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_item_transaction
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_item_transaction'
)
INSERT INTO m1_item_transaction (
    id, cabang, lokasi, gudang, kodepa, jenismutasi, sumber, idutama, iddetail, notransaksi, tgl, kontak, idbarang, namabarang, tipebarang, tipehpp, jml, satuan, jmlbarang, satuanbarang, matauang, kurs, harga, diskon, jmldiskon, idhppikm, idhppikk, idhppfifo, hpp, uraian, catatan, catatandetail, costcenter, divisi, subdivisi, proyek, saldojml, saldohpp, saldonilai, postingtgl, updatehpp, postinghpp, hppfix, postingjurnal, jurnalfix, tutupperiode, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    id, cabang, lokasi, gudang, kodepa, jenismutasi, sumber, idutama, iddetail, notransaksi, tgl, kontak, idbarang, namabarang, tipebarang, tipehpp, jml, satuan, jmlbarang, satuanbarang, matauang, kurs, harga, diskon, jmldiskon, idhppikm, idhppikk, idhppfifo, hpp, uraian, catatan, catatandetail, costcenter, divisi, subdivisi, proyek, saldojml, saldohpp, saldonilai, postingtgl, updatehpp, postinghpp, hppfix, postingjurnal, jurnalfix, tutupperiode, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'id', '')::bigint AS id,
        row_payload ->> 'cabang' AS cabang,
        row_payload ->> 'lokasi' AS lokasi,
        row_payload ->> 'gudang' AS gudang,
        row_payload ->> 'kodepa' AS kodepa,
        row_payload ->> 'jenismutasi' AS jenismutasi,
        row_payload ->> 'sumber' AS sumber,
        NULLIF(row_payload ->> 'idutama', '')::bigint AS idutama,
        NULLIF(row_payload ->> 'iddetail', '')::bigint AS iddetail,
        row_payload ->> 'notransaksi' AS notransaksi,
        NULLIF(row_payload ->> 'tgl', '')::timestamptz AS tgl,
        row_payload ->> 'kontak' AS kontak,
        NULLIF(row_payload ->> 'idbarang', '')::bigint AS idbarang,
        row_payload ->> 'namabarang' AS namabarang,
        row_payload ->> 'tipebarang' AS tipebarang,
        row_payload ->> 'tipehpp' AS tipehpp,
        NULLIF(row_payload ->> 'jml', '')::numeric(20,6) AS jml,
        row_payload ->> 'satuan' AS satuan,
        NULLIF(row_payload ->> 'jmlbarang', '')::numeric(20,6) AS jmlbarang,
        row_payload ->> 'satuanbarang' AS satuanbarang,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        NULLIF(row_payload ->> 'harga', '')::numeric(20,6) AS harga,
        NULLIF(row_payload ->> 'diskon', '')::numeric(20,6) AS diskon,
        NULLIF(row_payload ->> 'jmldiskon', '')::numeric(20,6) AS jmldiskon,
        NULLIF(row_payload ->> 'idhppikm', '')::bigint AS idhppikm,
        NULLIF(row_payload ->> 'idhppikk', '')::bigint AS idhppikk,
        NULLIF(row_payload ->> 'idhppfifo', '')::bigint AS idhppfifo,
        row_payload ->> 'hpp' AS hpp,
        row_payload ->> 'uraian' AS uraian,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'catatandetail' AS catatandetail,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        NULLIF(row_payload ->> 'saldojml', '')::numeric(20,6) AS saldojml,
        NULLIF(row_payload ->> 'saldohpp', '')::numeric(20,6) AS saldohpp,
        NULLIF(row_payload ->> 'saldonilai', '')::numeric(20,6) AS saldonilai,
        NULLIF(row_payload ->> 'postingtgl', '')::timestamptz AS postingtgl,
        NULLIF(row_payload ->> 'updatehpp', '')::timestamptz AS updatehpp,
        row_payload ->> 'postinghpp' AS postinghpp,
        row_payload ->> 'hppfix' AS hppfix,
        row_payload ->> 'postingjurnal' AS postingjurnal,
        row_payload ->> 'jurnalfix' AS jurnalfix,
        row_payload ->> 'tutupperiode' AS tutupperiode,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'id') IS NOT NULL
) AS prepared
ON CONFLICT (id) DO UPDATE
SET
    cabang = EXCLUDED.cabang,
    lokasi = EXCLUDED.lokasi,
    gudang = EXCLUDED.gudang,
    kodepa = EXCLUDED.kodepa,
    jenismutasi = EXCLUDED.jenismutasi,
    sumber = EXCLUDED.sumber,
    idutama = EXCLUDED.idutama,
    iddetail = EXCLUDED.iddetail,
    notransaksi = EXCLUDED.notransaksi,
    tgl = EXCLUDED.tgl,
    kontak = EXCLUDED.kontak,
    idbarang = EXCLUDED.idbarang,
    namabarang = EXCLUDED.namabarang,
    tipebarang = EXCLUDED.tipebarang,
    tipehpp = EXCLUDED.tipehpp,
    jml = EXCLUDED.jml,
    satuan = EXCLUDED.satuan,
    jmlbarang = EXCLUDED.jmlbarang,
    satuanbarang = EXCLUDED.satuanbarang,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    harga = EXCLUDED.harga,
    diskon = EXCLUDED.diskon,
    jmldiskon = EXCLUDED.jmldiskon,
    idhppikm = EXCLUDED.idhppikm,
    idhppikk = EXCLUDED.idhppikk,
    idhppfifo = EXCLUDED.idhppfifo,
    hpp = EXCLUDED.hpp,
    uraian = EXCLUDED.uraian,
    catatan = EXCLUDED.catatan,
    catatandetail = EXCLUDED.catatandetail,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    saldojml = EXCLUDED.saldojml,
    saldohpp = EXCLUDED.saldohpp,
    saldonilai = EXCLUDED.saldonilai,
    postingtgl = EXCLUDED.postingtgl,
    updatehpp = EXCLUDED.updatehpp,
    postinghpp = EXCLUDED.postinghpp,
    hppfix = EXCLUDED.hppfix,
    postingjurnal = EXCLUDED.postingjurnal,
    jurnalfix = EXCLUDED.jurnalfix,
    tutupperiode = EXCLUDED.tutupperiode,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_item_type
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_item_type'
)
INSERT INTO m1_item_type (
    itkode, itnama, itcatatan, itaktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    itkode, itnama, itcatatan, itaktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'itkode' AS itkode,
        row_payload ->> 'itnama' AS itnama,
        row_payload ->> 'itcatatan' AS itcatatan,
        NULLIF(row_payload ->> 'itaktif', '')::bigint AS itaktif,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'itkode') IS NOT NULL
) AS prepared
ON CONFLICT (itkode) DO UPDATE
SET
    itnama = EXCLUDED.itnama,
    itcatatan = EXCLUDED.itcatatan,
    itaktif = EXCLUDED.itaktif,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_location
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_location'
)
INSERT INTO m1_location (
    lkode, lnama, lkodetransaksi, lcabang, lkategoripos, laktif, lalamat1, lalamat2, lkota, lkodepos, lnotelp, lnofax, lluas, lcatatan, lmodifikasitanggal, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    lkode, lnama, lkodetransaksi, lcabang, lkategoripos, laktif, lalamat1, lalamat2, lkota, lkodepos, lnotelp, lnofax, lluas, lcatatan, lmodifikasitanggal, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'lkode' AS lkode,
        row_payload ->> 'lnama' AS lnama,
        row_payload ->> 'lkodetransaksi' AS lkodetransaksi,
        row_payload ->> 'lcabang' AS lcabang,
        row_payload ->> 'lkategoripos' AS lkategoripos,
        NULLIF(row_payload ->> 'laktif', '')::bigint AS laktif,
        row_payload ->> 'lalamat1' AS lalamat1,
        row_payload ->> 'lalamat2' AS lalamat2,
        row_payload ->> 'lkota' AS lkota,
        row_payload ->> 'lkodepos' AS lkodepos,
        row_payload ->> 'lnotelp' AS lnotelp,
        row_payload ->> 'lnofax' AS lnofax,
        NULLIF(row_payload ->> 'lluas', '')::numeric(20,6) AS lluas,
        row_payload ->> 'lcatatan' AS lcatatan,
        row_payload ->> 'lmodifikasitanggal' AS lmodifikasitanggal,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'lkode') IS NOT NULL
) AS prepared
ON CONFLICT (lkode) DO UPDATE
SET
    lnama = EXCLUDED.lnama,
    lkodetransaksi = EXCLUDED.lkodetransaksi,
    lcabang = EXCLUDED.lcabang,
    lkategoripos = EXCLUDED.lkategoripos,
    laktif = EXCLUDED.laktif,
    lalamat1 = EXCLUDED.lalamat1,
    lalamat2 = EXCLUDED.lalamat2,
    lkota = EXCLUDED.lkota,
    lkodepos = EXCLUDED.lkodepos,
    lnotelp = EXCLUDED.lnotelp,
    lnofax = EXCLUDED.lnofax,
    lluas = EXCLUDED.lluas,
    lcatatan = EXCLUDED.lcatatan,
    lmodifikasitanggal = EXCLUDED.lmodifikasitanggal,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_material
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_material'
)
INSERT INTO m1_material (
    mkode, mnama, mcatatan, maktif, mindexbarcode, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    mkode, mnama, mcatatan, maktif, mindexbarcode, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'mkode' AS mkode,
        row_payload ->> 'mnama' AS mnama,
        row_payload ->> 'mcatatan' AS mcatatan,
        NULLIF(row_payload ->> 'maktif', '')::bigint AS maktif,
        row_payload ->> 'mindexbarcode' AS mindexbarcode,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'mkode') IS NOT NULL
) AS prepared
ON CONFLICT (mkode) DO UPDATE
SET
    mnama = EXCLUDED.mnama,
    mcatatan = EXCLUDED.mcatatan,
    maktif = EXCLUDED.maktif,
    mindexbarcode = EXCLUDED.mindexbarcode,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_merk
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_merk'
)
INSERT INTO m1_merk (
    mkode, mnama, mcatatan, maktif, mindexbarcode, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    mkode, mnama, mcatatan, maktif, mindexbarcode, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'mkode' AS mkode,
        row_payload ->> 'mnama' AS mnama,
        row_payload ->> 'mcatatan' AS mcatatan,
        NULLIF(row_payload ->> 'maktif', '')::bigint AS maktif,
        row_payload ->> 'mindexbarcode' AS mindexbarcode,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'mkode') IS NOT NULL
) AS prepared
ON CONFLICT (mkode) DO UPDATE
SET
    mnama = EXCLUDED.mnama,
    mcatatan = EXCLUDED.mcatatan,
    maktif = EXCLUDED.maktif,
    mindexbarcode = EXCLUDED.mindexbarcode,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_model
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_model'
)
INSERT INTO m1_model (
    mkode, mnama, mcatatan, maktif, mindexbarcode, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    mkode, mnama, mcatatan, maktif, mindexbarcode, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'mkode' AS mkode,
        row_payload ->> 'mnama' AS mnama,
        row_payload ->> 'mcatatan' AS mcatatan,
        NULLIF(row_payload ->> 'maktif', '')::bigint AS maktif,
        row_payload ->> 'mindexbarcode' AS mindexbarcode,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'mkode') IS NOT NULL
) AS prepared
ON CONFLICT (mkode) DO UPDATE
SET
    mnama = EXCLUDED.mnama,
    mcatatan = EXCLUDED.mcatatan,
    maktif = EXCLUDED.maktif,
    mindexbarcode = EXCLUDED.mindexbarcode,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_project
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_project'
)
INSERT INTO m1_project (
    pkode, pnama, pkategori, paktif, ptglorder, ptglmulairencana, ptglmulairealisasi, ptglselesairencana, ptglselesairealisasi, pprioritas, pselesai, pkontak, pkontakperson, ppimpinanproyek, pdivisi, pketerangan, ptglkontrak, pnokontrak, pnilaikontrak, psubdari, pparent, plevel, pcustom1, pcustom2, pcustom3, pcustom4, pcustom5, pgd, pstatus, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    pkode, pnama, pkategori, paktif, ptglorder, ptglmulairencana, ptglmulairealisasi, ptglselesairencana, ptglselesairealisasi, pprioritas, pselesai, pkontak, pkontakperson, ppimpinanproyek, pdivisi, pketerangan, ptglkontrak, pnokontrak, pnilaikontrak, psubdari, pparent, plevel, pcustom1, pcustom2, pcustom3, pcustom4, pcustom5, pgd, pstatus, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'pkode' AS pkode,
        row_payload ->> 'pnama' AS pnama,
        row_payload ->> 'pkategori' AS pkategori,
        NULLIF(row_payload ->> 'paktif', '')::bigint AS paktif,
        NULLIF(row_payload ->> 'ptglorder', '')::timestamptz AS ptglorder,
        NULLIF(row_payload ->> 'ptglmulairencana', '')::timestamptz AS ptglmulairencana,
        NULLIF(row_payload ->> 'ptglmulairealisasi', '')::timestamptz AS ptglmulairealisasi,
        NULLIF(row_payload ->> 'ptglselesairencana', '')::timestamptz AS ptglselesairencana,
        NULLIF(row_payload ->> 'ptglselesairealisasi', '')::timestamptz AS ptglselesairealisasi,
        row_payload ->> 'pprioritas' AS pprioritas,
        row_payload ->> 'pselesai' AS pselesai,
        row_payload ->> 'pkontak' AS pkontak,
        row_payload ->> 'pkontakperson' AS pkontakperson,
        row_payload ->> 'ppimpinanproyek' AS ppimpinanproyek,
        row_payload ->> 'pdivisi' AS pdivisi,
        row_payload ->> 'pketerangan' AS pketerangan,
        NULLIF(row_payload ->> 'ptglkontrak', '')::timestamptz AS ptglkontrak,
        row_payload ->> 'pnokontrak' AS pnokontrak,
        NULLIF(row_payload ->> 'pnilaikontrak', '')::numeric(20,6) AS pnilaikontrak,
        row_payload ->> 'psubdari' AS psubdari,
        row_payload ->> 'pparent' AS pparent,
        row_payload ->> 'plevel' AS plevel,
        row_payload ->> 'pcustom1' AS pcustom1,
        row_payload ->> 'pcustom2' AS pcustom2,
        row_payload ->> 'pcustom3' AS pcustom3,
        row_payload ->> 'pcustom4' AS pcustom4,
        row_payload ->> 'pcustom5' AS pcustom5,
        row_payload ->> 'pgd' AS pgd,
        row_payload ->> 'pstatus' AS pstatus,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'pkode') IS NOT NULL
) AS prepared
ON CONFLICT (pkode) DO UPDATE
SET
    pnama = EXCLUDED.pnama,
    pkategori = EXCLUDED.pkategori,
    paktif = EXCLUDED.paktif,
    ptglorder = EXCLUDED.ptglorder,
    ptglmulairencana = EXCLUDED.ptglmulairencana,
    ptglmulairealisasi = EXCLUDED.ptglmulairealisasi,
    ptglselesairencana = EXCLUDED.ptglselesairencana,
    ptglselesairealisasi = EXCLUDED.ptglselesairealisasi,
    pprioritas = EXCLUDED.pprioritas,
    pselesai = EXCLUDED.pselesai,
    pkontak = EXCLUDED.pkontak,
    pkontakperson = EXCLUDED.pkontakperson,
    ppimpinanproyek = EXCLUDED.ppimpinanproyek,
    pdivisi = EXCLUDED.pdivisi,
    pketerangan = EXCLUDED.pketerangan,
    ptglkontrak = EXCLUDED.ptglkontrak,
    pnokontrak = EXCLUDED.pnokontrak,
    pnilaikontrak = EXCLUDED.pnilaikontrak,
    psubdari = EXCLUDED.psubdari,
    pparent = EXCLUDED.pparent,
    plevel = EXCLUDED.plevel,
    pcustom1 = EXCLUDED.pcustom1,
    pcustom2 = EXCLUDED.pcustom2,
    pcustom3 = EXCLUDED.pcustom3,
    pcustom4 = EXCLUDED.pcustom4,
    pcustom5 = EXCLUDED.pcustom5,
    pgd = EXCLUDED.pgd,
    pstatus = EXCLUDED.pstatus,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_salesman_category
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_salesman_category'
)
INSERT INTO m1_salesman_category (
    sckode, scnama, scarea, sccatatan, scaktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    sckode, scnama, scarea, sccatatan, scaktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'sckode' AS sckode,
        row_payload ->> 'scnama' AS scnama,
        row_payload ->> 'scarea' AS scarea,
        row_payload ->> 'sccatatan' AS sccatatan,
        NULLIF(row_payload ->> 'scaktif', '')::bigint AS scaktif,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'sckode') IS NOT NULL
) AS prepared
ON CONFLICT (sckode) DO UPDATE
SET
    scnama = EXCLUDED.scnama,
    scarea = EXCLUDED.scarea,
    sccatatan = EXCLUDED.sccatatan,
    scaktif = EXCLUDED.scaktif,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_section
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_section'
)
INSERT INTO m1_section (
    skode, snama, scatatan, saktif, sindexbarcode, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    skode, snama, scatatan, saktif, sindexbarcode, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'skode' AS skode,
        row_payload ->> 'snama' AS snama,
        row_payload ->> 'scatatan' AS scatatan,
        NULLIF(row_payload ->> 'saktif', '')::bigint AS saktif,
        row_payload ->> 'sindexbarcode' AS sindexbarcode,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'skode') IS NOT NULL
) AS prepared
ON CONFLICT (skode) DO UPDATE
SET
    snama = EXCLUDED.snama,
    scatatan = EXCLUDED.scatatan,
    saktif = EXCLUDED.saktif,
    sindexbarcode = EXCLUDED.sindexbarcode,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_size
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_size'
)
INSERT INTO m1_size (
    skode, snama, scatatan, saktif, sindexbarcode, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    skode, snama, scatatan, saktif, sindexbarcode, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'skode' AS skode,
        row_payload ->> 'snama' AS snama,
        row_payload ->> 'scatatan' AS scatatan,
        NULLIF(row_payload ->> 'saktif', '')::bigint AS saktif,
        row_payload ->> 'sindexbarcode' AS sindexbarcode,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'skode') IS NOT NULL
) AS prepared
ON CONFLICT (skode) DO UPDATE
SET
    snama = EXCLUDED.snama,
    scatatan = EXCLUDED.scatatan,
    saktif = EXCLUDED.saktif,
    sindexbarcode = EXCLUDED.sindexbarcode,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_subdepartment
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_subdepartment'
)
INSERT INTO m1_subdepartment (
    sdpkode, sdpnama, sdpdepartemen, sdpdivisi, sdpsubdivisi, sdpcatatan, sdpaktif, sdpindexbarcode, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    sdpkode, sdpnama, sdpdepartemen, sdpdivisi, sdpsubdivisi, sdpcatatan, sdpaktif, sdpindexbarcode, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'sdpkode' AS sdpkode,
        row_payload ->> 'sdpnama' AS sdpnama,
        row_payload ->> 'sdpdepartemen' AS sdpdepartemen,
        row_payload ->> 'sdpdivisi' AS sdpdivisi,
        row_payload ->> 'sdpsubdivisi' AS sdpsubdivisi,
        row_payload ->> 'sdpcatatan' AS sdpcatatan,
        NULLIF(row_payload ->> 'sdpaktif', '')::bigint AS sdpaktif,
        row_payload ->> 'sdpindexbarcode' AS sdpindexbarcode,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'sdpkode') IS NOT NULL
) AS prepared
ON CONFLICT (sdpkode) DO UPDATE
SET
    sdpnama = EXCLUDED.sdpnama,
    sdpdepartemen = EXCLUDED.sdpdepartemen,
    sdpdivisi = EXCLUDED.sdpdivisi,
    sdpsubdivisi = EXCLUDED.sdpsubdivisi,
    sdpcatatan = EXCLUDED.sdpcatatan,
    sdpaktif = EXCLUDED.sdpaktif,
    sdpindexbarcode = EXCLUDED.sdpindexbarcode,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_subdivision
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_subdivision'
)
INSERT INTO m1_subdivision (
    sdkode, sddivisi, sdnama, sdcatatan, sdaktif, sdindexbarcode, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    sdkode, sddivisi, sdnama, sdcatatan, sdaktif, sdindexbarcode, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'sdkode' AS sdkode,
        row_payload ->> 'sddivisi' AS sddivisi,
        row_payload ->> 'sdnama' AS sdnama,
        row_payload ->> 'sdcatatan' AS sdcatatan,
        NULLIF(row_payload ->> 'sdaktif', '')::bigint AS sdaktif,
        row_payload ->> 'sdindexbarcode' AS sdindexbarcode,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'sdkode') IS NOT NULL
) AS prepared
ON CONFLICT (sdkode) DO UPDATE
SET
    sddivisi = EXCLUDED.sddivisi,
    sdnama = EXCLUDED.sdnama,
    sdcatatan = EXCLUDED.sdcatatan,
    sdaktif = EXCLUDED.sdaktif,
    sdindexbarcode = EXCLUDED.sdindexbarcode,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_supplier_category
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_supplier_category'
)
INSERT INTO m1_supplier_category (
    sckode, scnama, sccatatan, scaktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    sckode, scnama, sccatatan, scaktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'sckode' AS sckode,
        row_payload ->> 'scnama' AS scnama,
        row_payload ->> 'sccatatan' AS sccatatan,
        NULLIF(row_payload ->> 'scaktif', '')::bigint AS scaktif,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'sckode') IS NOT NULL
) AS prepared
ON CONFLICT (sckode) DO UPDATE
SET
    scnama = EXCLUDED.scnama,
    sccatatan = EXCLUDED.sccatatan,
    scaktif = EXCLUDED.scaktif,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_tax
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_tax'
)
INSERT INTO m1_tax (
    tkode, tnama, tnilai, tcatatan, taktif, takunbeli, takunjual, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    tkode, tnama, tnilai, tcatatan, taktif, takunbeli, takunjual, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'tkode' AS tkode,
        row_payload ->> 'tnama' AS tnama,
        NULLIF(row_payload ->> 'tnilai', '')::numeric(20,6) AS tnilai,
        row_payload ->> 'tcatatan' AS tcatatan,
        NULLIF(row_payload ->> 'taktif', '')::bigint AS taktif,
        row_payload ->> 'takunbeli' AS takunbeli,
        row_payload ->> 'takunjual' AS takunjual,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'tkode') IS NOT NULL
) AS prepared
ON CONFLICT (tkode) DO UPDATE
SET
    tnama = EXCLUDED.tnama,
    tnilai = EXCLUDED.tnilai,
    tcatatan = EXCLUDED.tcatatan,
    taktif = EXCLUDED.taktif,
    takunbeli = EXCLUDED.takunbeli,
    takunjual = EXCLUDED.takunjual,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_terms
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_terms'
)
INSERT INTO m1_terms (
    trkode, trnama, trdiskon1, trharidiskon1, trdiskon2, trharidiskon2, trdenda, trharijatuhtempo, trdendaper, trcatatan, traktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    trkode, trnama, trdiskon1, trharidiskon1, trdiskon2, trharidiskon2, trdenda, trharijatuhtempo, trdendaper, trcatatan, traktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'trkode' AS trkode,
        row_payload ->> 'trnama' AS trnama,
        NULLIF(row_payload ->> 'trdiskon1', '')::numeric(20,6) AS trdiskon1,
        NULLIF(row_payload ->> 'trharidiskon1', '')::numeric(20,6) AS trharidiskon1,
        NULLIF(row_payload ->> 'trdiskon2', '')::numeric(20,6) AS trdiskon2,
        NULLIF(row_payload ->> 'trharidiskon2', '')::numeric(20,6) AS trharidiskon2,
        NULLIF(row_payload ->> 'trdenda', '')::numeric(20,6) AS trdenda,
        row_payload ->> 'trharijatuhtempo' AS trharijatuhtempo,
        NULLIF(row_payload ->> 'trdendaper', '')::numeric(20,6) AS trdendaper,
        row_payload ->> 'trcatatan' AS trcatatan,
        NULLIF(row_payload ->> 'traktif', '')::bigint AS traktif,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'trkode') IS NOT NULL
) AS prepared
ON CONFLICT (trkode) DO UPDATE
SET
    trnama = EXCLUDED.trnama,
    trdiskon1 = EXCLUDED.trdiskon1,
    trharidiskon1 = EXCLUDED.trharidiskon1,
    trdiskon2 = EXCLUDED.trdiskon2,
    trharidiskon2 = EXCLUDED.trharidiskon2,
    trdenda = EXCLUDED.trdenda,
    trharijatuhtempo = EXCLUDED.trharijatuhtempo,
    trdendaper = EXCLUDED.trdendaper,
    trcatatan = EXCLUDED.trcatatan,
    traktif = EXCLUDED.traktif,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_transaction_note
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_transaction_note'
)
INSERT INTO m1_transaction_note (
    tnsumber, tnkode, tncatatan, tnaktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    tnsumber, tnkode, tncatatan, tnaktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'tnsumber' AS tnsumber,
        row_payload ->> 'tnkode' AS tnkode,
        row_payload ->> 'tncatatan' AS tncatatan,
        NULLIF(row_payload ->> 'tnaktif', '')::bigint AS tnaktif,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'tnsumber') IS NOT NULL AND (row_payload ->> 'tnkode') IS NOT NULL
) AS prepared
ON CONFLICT (tnsumber, tnkode) DO UPDATE
SET
    tncatatan = EXCLUDED.tncatatan,
    tnaktif = EXCLUDED.tnaktif,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_transaction_note_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_transaction_note_detail'
)
INSERT INTO m1_transaction_note_detail (
    tndkode, tndsumber, tndcatatan, tndaktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    tndkode, tndsumber, tndcatatan, tndaktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'tndkode' AS tndkode,
        row_payload ->> 'tndsumber' AS tndsumber,
        row_payload ->> 'tndcatatan' AS tndcatatan,
        NULLIF(row_payload ->> 'tndaktif', '')::bigint AS tndaktif,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'tndsumber') IS NOT NULL AND (row_payload ->> 'tndkode') IS NOT NULL
) AS prepared
ON CONFLICT (tndsumber, tndkode) DO UPDATE
SET
    tndcatatan = EXCLUDED.tndcatatan,
    tndaktif = EXCLUDED.tndaktif,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_type_sa
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_type_sa'
)
INSERT INTO m1_type_sa (
    tsakode, tsanama, tsarek, tsacatatan, tsaaktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    tsakode, tsanama, tsarek, tsacatatan, tsaaktif, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'tsakode' AS tsakode,
        row_payload ->> 'tsanama' AS tsanama,
        row_payload ->> 'tsarek' AS tsarek,
        row_payload ->> 'tsacatatan' AS tsacatatan,
        NULLIF(row_payload ->> 'tsaaktif', '')::bigint AS tsaaktif,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'tsakode') IS NOT NULL
) AS prepared
ON CONFLICT (tsakode) DO UPDATE
SET
    tsanama = EXCLUDED.tsanama,
    tsarek = EXCLUDED.tsarek,
    tsacatatan = EXCLUDED.tsacatatan,
    tsaaktif = EXCLUDED.tsaaktif,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_unit
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_unit'
)
INSERT INTO m1_unit (
    ukode, unama, unilai, uketerangan, uaktif, uindexbarcode, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    ukode, unama, unilai, uketerangan, uaktif, uindexbarcode, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'ukode' AS ukode,
        row_payload ->> 'unama' AS unama,
        NULLIF(row_payload ->> 'unilai', '')::numeric(20,6) AS unilai,
        row_payload ->> 'uketerangan' AS uketerangan,
        NULLIF(row_payload ->> 'uaktif', '')::bigint AS uaktif,
        row_payload ->> 'uindexbarcode' AS uindexbarcode,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'ukode') IS NOT NULL
) AS prepared
ON CONFLICT (ukode) DO UPDATE
SET
    unama = EXCLUDED.unama,
    unilai = EXCLUDED.unilai,
    uketerangan = EXCLUDED.uketerangan,
    uaktif = EXCLUDED.uaktif,
    uindexbarcode = EXCLUDED.uindexbarcode,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_warehouse
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_warehouse'
)
INSERT INTO m1_warehouse (
    wkode, wnama, wdivisi, wlokasi, walamat1, walamat2, wkota, wkodepos, wnotelp, wnofax, wketerangan, waktif, wmodifikasitanggal, wbookingstok, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    wkode, wnama, wdivisi, wlokasi, walamat1, walamat2, wkota, wkodepos, wnotelp, wnofax, wketerangan, waktif, wmodifikasitanggal, wbookingstok, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'wkode' AS wkode,
        row_payload ->> 'wnama' AS wnama,
        row_payload ->> 'wdivisi' AS wdivisi,
        row_payload ->> 'wlokasi' AS wlokasi,
        row_payload ->> 'walamat1' AS walamat1,
        row_payload ->> 'walamat2' AS walamat2,
        row_payload ->> 'wkota' AS wkota,
        row_payload ->> 'wkodepos' AS wkodepos,
        row_payload ->> 'wnotelp' AS wnotelp,
        row_payload ->> 'wnofax' AS wnofax,
        row_payload ->> 'wketerangan' AS wketerangan,
        NULLIF(row_payload ->> 'waktif', '')::bigint AS waktif,
        row_payload ->> 'wmodifikasitanggal' AS wmodifikasitanggal,
        row_payload ->> 'wbookingstok' AS wbookingstok,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'wkode') IS NOT NULL
) AS prepared
ON CONFLICT (wkode) DO UPDATE
SET
    wnama = EXCLUDED.wnama,
    wdivisi = EXCLUDED.wdivisi,
    wlokasi = EXCLUDED.wlokasi,
    walamat1 = EXCLUDED.walamat1,
    walamat2 = EXCLUDED.walamat2,
    wkota = EXCLUDED.wkota,
    wkodepos = EXCLUDED.wkodepos,
    wnotelp = EXCLUDED.wnotelp,
    wnofax = EXCLUDED.wnofax,
    wketerangan = EXCLUDED.wketerangan,
    waktif = EXCLUDED.waktif,
    wmodifikasitanggal = EXCLUDED.wmodifikasitanggal,
    wbookingstok = EXCLUDED.wbookingstok,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_province
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_province'
)
INSERT INTO m1_province (
    pkode, pnama, pcatatan, paktif, pnegara, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    pkode, pnama, pcatatan, paktif, pnegara, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'pkode' AS pkode,
        row_payload ->> 'pnama' AS pnama,
        row_payload ->> 'pcatatan' AS pcatatan,
        NULLIF(row_payload ->> 'paktif', '')::bigint AS paktif,
        row_payload ->> 'pnegara' AS pnegara,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'pkode') IS NOT NULL
) AS prepared
ON CONFLICT (pkode) DO UPDATE
SET
    pnama = EXCLUDED.pnama,
    pcatatan = EXCLUDED.pcatatan,
    paktif = EXCLUDED.paktif,
    pnegara = EXCLUDED.pnegara,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m1_other_cost
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m1_other_cost'
)
INSERT INTO m1_other_cost (
    ockode, ocnama, ocrekdebit, ocrekkredit, ockontak, octermasukhpp, occatatan, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    ockode, ocnama, ocrekdebit, ocrekkredit, ockontak, octermasukhpp, occatatan, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'ockode' AS ockode,
        row_payload ->> 'ocnama' AS ocnama,
        row_payload ->> 'ocrekdebit' AS ocrekdebit,
        row_payload ->> 'ocrekkredit' AS ocrekkredit,
        row_payload ->> 'ockontak' AS ockontak,
        row_payload ->> 'octermasukhpp' AS octermasukhpp,
        row_payload ->> 'occatatan' AS occatatan,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'ockode') IS NOT NULL
) AS prepared
ON CONFLICT (ockode) DO UPDATE
SET
    ocnama = EXCLUDED.ocnama,
    ocrekdebit = EXCLUDED.ocrekdebit,
    ocrekkredit = EXCLUDED.ocrekkredit,
    ockontak = EXCLUDED.ockontak,
    octermasukhpp = EXCLUDED.octermasukhpp,
    occatatan = EXCLUDED.occatatan,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_cd
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_cd'
)
INSERT INTO m2_cd (
    cdid, cdcabang, cdlokasi, cdsumber, cdautonotransaksi, cdnotransaksi, cdtgl, cdkodepa, cdkontak, cdkontakperson, cdnorek, cduraian, cdcatatan, cdmatauang, cdkurs, cdjumlah, cdjumlahvalas, cdjumlahbayar, cdjumlahbayarvalas, cdstatusbayar, cdtgllunas, cdstatus, cdstatussebelumnya, cdjmlrevisi, cdcetakanke, cdisclose, cdposting, cdpostingtgl, cdcustomtext1, cdcustomtext2, cdcustomtext3, cdcustomtext4, cdcustomtext5, cdcustomint1, cdcustomint2, cdcustomint3, cdcustomdbl1, cdcustomdbl2, cdcustomdbl3, cdcustomdate1, cdcustomdate2, cdcustomdate3, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    cdid, cdcabang, cdlokasi, cdsumber, cdautonotransaksi, cdnotransaksi, cdtgl, cdkodepa, cdkontak, cdkontakperson, cdnorek, cduraian, cdcatatan, cdmatauang, cdkurs, cdjumlah, cdjumlahvalas, cdjumlahbayar, cdjumlahbayarvalas, cdstatusbayar, cdtgllunas, cdstatus, cdstatussebelumnya, cdjmlrevisi, cdcetakanke, cdisclose, cdposting, cdpostingtgl, cdcustomtext1, cdcustomtext2, cdcustomtext3, cdcustomtext4, cdcustomtext5, cdcustomint1, cdcustomint2, cdcustomint3, cdcustomdbl1, cdcustomdbl2, cdcustomdbl3, cdcustomdate1, cdcustomdate2, cdcustomdate3, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'cdid', '')::bigint AS cdid,
        row_payload ->> 'cdcabang' AS cdcabang,
        row_payload ->> 'cdlokasi' AS cdlokasi,
        row_payload ->> 'cdsumber' AS cdsumber,
        row_payload ->> 'cdautonotransaksi' AS cdautonotransaksi,
        row_payload ->> 'cdnotransaksi' AS cdnotransaksi,
        NULLIF(row_payload ->> 'cdtgl', '')::timestamptz AS cdtgl,
        row_payload ->> 'cdkodepa' AS cdkodepa,
        row_payload ->> 'cdkontak' AS cdkontak,
        row_payload ->> 'cdkontakperson' AS cdkontakperson,
        row_payload ->> 'cdnorek' AS cdnorek,
        row_payload ->> 'cduraian' AS cduraian,
        row_payload ->> 'cdcatatan' AS cdcatatan,
        row_payload ->> 'cdmatauang' AS cdmatauang,
        NULLIF(row_payload ->> 'cdkurs', '')::numeric(20,6) AS cdkurs,
        row_payload ->> 'cdjumlah' AS cdjumlah,
        row_payload ->> 'cdjumlahvalas' AS cdjumlahvalas,
        row_payload ->> 'cdjumlahbayar' AS cdjumlahbayar,
        row_payload ->> 'cdjumlahbayarvalas' AS cdjumlahbayarvalas,
        row_payload ->> 'cdstatusbayar' AS cdstatusbayar,
        NULLIF(row_payload ->> 'cdtgllunas', '')::timestamptz AS cdtgllunas,
        row_payload ->> 'cdstatus' AS cdstatus,
        row_payload ->> 'cdstatussebelumnya' AS cdstatussebelumnya,
        NULLIF(row_payload ->> 'cdjmlrevisi', '')::numeric(20,6) AS cdjmlrevisi,
        row_payload ->> 'cdcetakanke' AS cdcetakanke,
        NULLIF(row_payload ->> 'cdisclose', '')::bigint AS cdisclose,
        NULLIF(row_payload ->> 'cdposting', '')::bigint AS cdposting,
        NULLIF(row_payload ->> 'cdpostingtgl', '')::timestamptz AS cdpostingtgl,
        row_payload ->> 'cdcustomtext1' AS cdcustomtext1,
        row_payload ->> 'cdcustomtext2' AS cdcustomtext2,
        row_payload ->> 'cdcustomtext3' AS cdcustomtext3,
        row_payload ->> 'cdcustomtext4' AS cdcustomtext4,
        row_payload ->> 'cdcustomtext5' AS cdcustomtext5,
        row_payload ->> 'cdcustomint1' AS cdcustomint1,
        row_payload ->> 'cdcustomint2' AS cdcustomint2,
        row_payload ->> 'cdcustomint3' AS cdcustomint3,
        row_payload ->> 'cdcustomdbl1' AS cdcustomdbl1,
        row_payload ->> 'cdcustomdbl2' AS cdcustomdbl2,
        row_payload ->> 'cdcustomdbl3' AS cdcustomdbl3,
        NULLIF(row_payload ->> 'cdcustomdate1', '')::timestamptz AS cdcustomdate1,
        NULLIF(row_payload ->> 'cdcustomdate2', '')::timestamptz AS cdcustomdate2,
        NULLIF(row_payload ->> 'cdcustomdate3', '')::timestamptz AS cdcustomdate3,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'cdid') IS NOT NULL
) AS prepared
ON CONFLICT (cdid) DO UPDATE
SET
    cdcabang = EXCLUDED.cdcabang,
    cdlokasi = EXCLUDED.cdlokasi,
    cdsumber = EXCLUDED.cdsumber,
    cdautonotransaksi = EXCLUDED.cdautonotransaksi,
    cdnotransaksi = EXCLUDED.cdnotransaksi,
    cdtgl = EXCLUDED.cdtgl,
    cdkodepa = EXCLUDED.cdkodepa,
    cdkontak = EXCLUDED.cdkontak,
    cdkontakperson = EXCLUDED.cdkontakperson,
    cdnorek = EXCLUDED.cdnorek,
    cduraian = EXCLUDED.cduraian,
    cdcatatan = EXCLUDED.cdcatatan,
    cdmatauang = EXCLUDED.cdmatauang,
    cdkurs = EXCLUDED.cdkurs,
    cdjumlah = EXCLUDED.cdjumlah,
    cdjumlahvalas = EXCLUDED.cdjumlahvalas,
    cdjumlahbayar = EXCLUDED.cdjumlahbayar,
    cdjumlahbayarvalas = EXCLUDED.cdjumlahbayarvalas,
    cdstatusbayar = EXCLUDED.cdstatusbayar,
    cdtgllunas = EXCLUDED.cdtgllunas,
    cdstatus = EXCLUDED.cdstatus,
    cdstatussebelumnya = EXCLUDED.cdstatussebelumnya,
    cdjmlrevisi = EXCLUDED.cdjmlrevisi,
    cdcetakanke = EXCLUDED.cdcetakanke,
    cdisclose = EXCLUDED.cdisclose,
    cdposting = EXCLUDED.cdposting,
    cdpostingtgl = EXCLUDED.cdpostingtgl,
    cdcustomtext1 = EXCLUDED.cdcustomtext1,
    cdcustomtext2 = EXCLUDED.cdcustomtext2,
    cdcustomtext3 = EXCLUDED.cdcustomtext3,
    cdcustomtext4 = EXCLUDED.cdcustomtext4,
    cdcustomtext5 = EXCLUDED.cdcustomtext5,
    cdcustomint1 = EXCLUDED.cdcustomint1,
    cdcustomint2 = EXCLUDED.cdcustomint2,
    cdcustomint3 = EXCLUDED.cdcustomint3,
    cdcustomdbl1 = EXCLUDED.cdcustomdbl1,
    cdcustomdbl2 = EXCLUDED.cdcustomdbl2,
    cdcustomdbl3 = EXCLUDED.cdcustomdbl3,
    cdcustomdate1 = EXCLUDED.cdcustomdate1,
    cdcustomdate2 = EXCLUDED.cdcustomdate2,
    cdcustomdate3 = EXCLUDED.cdcustomdate3,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_cd_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_cd_detail'
)
INSERT INTO m2_cd_detail (
    idcddetail, idcd, norek, matauang, kurs, jumlah, jumlahvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idcddetail, idcd, norek, matauang, kurs, jumlah, jumlahvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idcddetail', '')::bigint AS idcddetail,
        NULLIF(row_payload ->> 'idcd', '')::bigint AS idcd,
        row_payload ->> 'norek' AS norek,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'jumlah' AS jumlah,
        row_payload ->> 'jumlahvalas' AS jumlahvalas,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        row_payload ->> 'customtext1' AS customtext1,
        row_payload ->> 'customtext2' AS customtext2,
        row_payload ->> 'customtext3' AS customtext3,
        row_payload ->> 'customdbl1' AS customdbl1,
        row_payload ->> 'customdbl2' AS customdbl2,
        row_payload ->> 'customdbl3' AS customdbl3,
        NULLIF(row_payload ->> 'customdate1', '')::timestamptz AS customdate1,
        NULLIF(row_payload ->> 'customdate2', '')::timestamptz AS customdate2,
        NULLIF(row_payload ->> 'customdate3', '')::timestamptz AS customdate3,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idcddetail') IS NOT NULL
) AS prepared
ON CONFLICT (idcddetail) DO UPDATE
SET
    idcd = EXCLUDED.idcd,
    norek = EXCLUDED.norek,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    jumlah = EXCLUDED.jumlah,
    jumlahvalas = EXCLUDED.jumlahvalas,
    catatan = EXCLUDED.catatan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    urutan = EXCLUDED.urutan,
    isclose = EXCLUDED.isclose,
    customtext1 = EXCLUDED.customtext1,
    customtext2 = EXCLUDED.customtext2,
    customtext3 = EXCLUDED.customtext3,
    customdbl1 = EXCLUDED.customdbl1,
    customdbl2 = EXCLUDED.customdbl2,
    customdbl3 = EXCLUDED.customdbl3,
    customdate1 = EXCLUDED.customdate1,
    customdate2 = EXCLUDED.customdate2,
    customdate3 = EXCLUDED.customdate3,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_cd_detail_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_cd_detail_history'
)
INSERT INTO m2_cd_detail_history (
    idcddetailhistory, idcdhistory, idcddetail, idcd, norek, matauang, kurs, jumlah, jumlahvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idcddetailhistory, idcdhistory, idcddetail, idcd, norek, matauang, kurs, jumlah, jumlahvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idcddetailhistory', '')::bigint AS idcddetailhistory,
        NULLIF(row_payload ->> 'idcdhistory', '')::bigint AS idcdhistory,
        NULLIF(row_payload ->> 'idcddetail', '')::bigint AS idcddetail,
        NULLIF(row_payload ->> 'idcd', '')::bigint AS idcd,
        row_payload ->> 'norek' AS norek,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'jumlah' AS jumlah,
        row_payload ->> 'jumlahvalas' AS jumlahvalas,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        row_payload ->> 'customtext1' AS customtext1,
        row_payload ->> 'customtext2' AS customtext2,
        row_payload ->> 'customtext3' AS customtext3,
        row_payload ->> 'customdbl1' AS customdbl1,
        row_payload ->> 'customdbl2' AS customdbl2,
        row_payload ->> 'customdbl3' AS customdbl3,
        NULLIF(row_payload ->> 'customdate1', '')::timestamptz AS customdate1,
        NULLIF(row_payload ->> 'customdate2', '')::timestamptz AS customdate2,
        NULLIF(row_payload ->> 'customdate3', '')::timestamptz AS customdate3,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idhistorydetail') IS NOT NULL
) AS prepared
ON CONFLICT (idhistorydetail) DO UPDATE
SET
    idcddetailhistory = EXCLUDED.idcddetailhistory,
    idcdhistory = EXCLUDED.idcdhistory,
    idcddetail = EXCLUDED.idcddetail,
    idcd = EXCLUDED.idcd,
    norek = EXCLUDED.norek,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    jumlah = EXCLUDED.jumlah,
    jumlahvalas = EXCLUDED.jumlahvalas,
    catatan = EXCLUDED.catatan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    urutan = EXCLUDED.urutan,
    isclose = EXCLUDED.isclose,
    customtext1 = EXCLUDED.customtext1,
    customtext2 = EXCLUDED.customtext2,
    customtext3 = EXCLUDED.customtext3,
    customdbl1 = EXCLUDED.customdbl1,
    customdbl2 = EXCLUDED.customdbl2,
    customdbl3 = EXCLUDED.customdbl3,
    customdate1 = EXCLUDED.customdate1,
    customdate2 = EXCLUDED.customdate2,
    customdate3 = EXCLUDED.customdate3,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_cd_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_cd_history'
)
INSERT INTO m2_cd_history (
    cdidhistory, cdid, cdcabang, cdlokasi, cdsumber, cdautonotransaksi, cdnotransaksi, cdtgl, cdkodepa, cdkontak, cdkontakperson, cdnorek, cduraian, cdcatatan, cdmatauang, cdkurs, cdjumlah, cdjumlahvalas, cdjumlahbayar, cdjumlahbayarvalas, cdstatusbayar, cdtgllunas, cdstatus, cdstatussebelumnya, cdjmlrevisi, cdcetakanke, cdisclose, cdposting, cdpostingtgl, cdcustomtext1, cdcustomtext2, cdcustomtext3, cdcustomtext4, cdcustomtext5, cdcustomint1, cdcustomint2, cdcustomint3, cdcustomdbl1, cdcustomdbl2, cdcustomdbl3, cdcustomdate1, cdcustomdate2, cdcustomdate3, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    cdidhistory, cdid, cdcabang, cdlokasi, cdsumber, cdautonotransaksi, cdnotransaksi, cdtgl, cdkodepa, cdkontak, cdkontakperson, cdnorek, cduraian, cdcatatan, cdmatauang, cdkurs, cdjumlah, cdjumlahvalas, cdjumlahbayar, cdjumlahbayarvalas, cdstatusbayar, cdtgllunas, cdstatus, cdstatussebelumnya, cdjmlrevisi, cdcetakanke, cdisclose, cdposting, cdpostingtgl, cdcustomtext1, cdcustomtext2, cdcustomtext3, cdcustomtext4, cdcustomtext5, cdcustomint1, cdcustomint2, cdcustomint3, cdcustomdbl1, cdcustomdbl2, cdcustomdbl3, cdcustomdate1, cdcustomdate2, cdcustomdate3, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'cdidhistory', '')::bigint AS cdidhistory,
        NULLIF(row_payload ->> 'cdid', '')::bigint AS cdid,
        row_payload ->> 'cdcabang' AS cdcabang,
        row_payload ->> 'cdlokasi' AS cdlokasi,
        row_payload ->> 'cdsumber' AS cdsumber,
        row_payload ->> 'cdautonotransaksi' AS cdautonotransaksi,
        row_payload ->> 'cdnotransaksi' AS cdnotransaksi,
        NULLIF(row_payload ->> 'cdtgl', '')::timestamptz AS cdtgl,
        row_payload ->> 'cdkodepa' AS cdkodepa,
        row_payload ->> 'cdkontak' AS cdkontak,
        row_payload ->> 'cdkontakperson' AS cdkontakperson,
        row_payload ->> 'cdnorek' AS cdnorek,
        row_payload ->> 'cduraian' AS cduraian,
        row_payload ->> 'cdcatatan' AS cdcatatan,
        row_payload ->> 'cdmatauang' AS cdmatauang,
        NULLIF(row_payload ->> 'cdkurs', '')::numeric(20,6) AS cdkurs,
        row_payload ->> 'cdjumlah' AS cdjumlah,
        row_payload ->> 'cdjumlahvalas' AS cdjumlahvalas,
        row_payload ->> 'cdjumlahbayar' AS cdjumlahbayar,
        row_payload ->> 'cdjumlahbayarvalas' AS cdjumlahbayarvalas,
        row_payload ->> 'cdstatusbayar' AS cdstatusbayar,
        NULLIF(row_payload ->> 'cdtgllunas', '')::timestamptz AS cdtgllunas,
        row_payload ->> 'cdstatus' AS cdstatus,
        row_payload ->> 'cdstatussebelumnya' AS cdstatussebelumnya,
        NULLIF(row_payload ->> 'cdjmlrevisi', '')::numeric(20,6) AS cdjmlrevisi,
        row_payload ->> 'cdcetakanke' AS cdcetakanke,
        NULLIF(row_payload ->> 'cdisclose', '')::bigint AS cdisclose,
        NULLIF(row_payload ->> 'cdposting', '')::bigint AS cdposting,
        NULLIF(row_payload ->> 'cdpostingtgl', '')::timestamptz AS cdpostingtgl,
        row_payload ->> 'cdcustomtext1' AS cdcustomtext1,
        row_payload ->> 'cdcustomtext2' AS cdcustomtext2,
        row_payload ->> 'cdcustomtext3' AS cdcustomtext3,
        row_payload ->> 'cdcustomtext4' AS cdcustomtext4,
        row_payload ->> 'cdcustomtext5' AS cdcustomtext5,
        row_payload ->> 'cdcustomint1' AS cdcustomint1,
        row_payload ->> 'cdcustomint2' AS cdcustomint2,
        row_payload ->> 'cdcustomint3' AS cdcustomint3,
        row_payload ->> 'cdcustomdbl1' AS cdcustomdbl1,
        row_payload ->> 'cdcustomdbl2' AS cdcustomdbl2,
        row_payload ->> 'cdcustomdbl3' AS cdcustomdbl3,
        NULLIF(row_payload ->> 'cdcustomdate1', '')::timestamptz AS cdcustomdate1,
        NULLIF(row_payload ->> 'cdcustomdate2', '')::timestamptz AS cdcustomdate2,
        NULLIF(row_payload ->> 'cdcustomdate3', '')::timestamptz AS cdcustomdate3,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'cdidhistory') IS NOT NULL
) AS prepared
ON CONFLICT (cdidhistory) DO UPDATE
SET
    cdid = EXCLUDED.cdid,
    cdcabang = EXCLUDED.cdcabang,
    cdlokasi = EXCLUDED.cdlokasi,
    cdsumber = EXCLUDED.cdsumber,
    cdautonotransaksi = EXCLUDED.cdautonotransaksi,
    cdnotransaksi = EXCLUDED.cdnotransaksi,
    cdtgl = EXCLUDED.cdtgl,
    cdkodepa = EXCLUDED.cdkodepa,
    cdkontak = EXCLUDED.cdkontak,
    cdkontakperson = EXCLUDED.cdkontakperson,
    cdnorek = EXCLUDED.cdnorek,
    cduraian = EXCLUDED.cduraian,
    cdcatatan = EXCLUDED.cdcatatan,
    cdmatauang = EXCLUDED.cdmatauang,
    cdkurs = EXCLUDED.cdkurs,
    cdjumlah = EXCLUDED.cdjumlah,
    cdjumlahvalas = EXCLUDED.cdjumlahvalas,
    cdjumlahbayar = EXCLUDED.cdjumlahbayar,
    cdjumlahbayarvalas = EXCLUDED.cdjumlahbayarvalas,
    cdstatusbayar = EXCLUDED.cdstatusbayar,
    cdtgllunas = EXCLUDED.cdtgllunas,
    cdstatus = EXCLUDED.cdstatus,
    cdstatussebelumnya = EXCLUDED.cdstatussebelumnya,
    cdjmlrevisi = EXCLUDED.cdjmlrevisi,
    cdcetakanke = EXCLUDED.cdcetakanke,
    cdisclose = EXCLUDED.cdisclose,
    cdposting = EXCLUDED.cdposting,
    cdpostingtgl = EXCLUDED.cdpostingtgl,
    cdcustomtext1 = EXCLUDED.cdcustomtext1,
    cdcustomtext2 = EXCLUDED.cdcustomtext2,
    cdcustomtext3 = EXCLUDED.cdcustomtext3,
    cdcustomtext4 = EXCLUDED.cdcustomtext4,
    cdcustomtext5 = EXCLUDED.cdcustomtext5,
    cdcustomint1 = EXCLUDED.cdcustomint1,
    cdcustomint2 = EXCLUDED.cdcustomint2,
    cdcustomint3 = EXCLUDED.cdcustomint3,
    cdcustomdbl1 = EXCLUDED.cdcustomdbl1,
    cdcustomdbl2 = EXCLUDED.cdcustomdbl2,
    cdcustomdbl3 = EXCLUDED.cdcustomdbl3,
    cdcustomdate1 = EXCLUDED.cdcustomdate1,
    cdcustomdate2 = EXCLUDED.cdcustomdate2,
    cdcustomdate3 = EXCLUDED.cdcustomdate3,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_bd
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_bd'
)
INSERT INTO m2_bd (
    bdid, bdcabang, bdlokasi, bdsumber, bdautonotransaksi, bdnotransaksi, bdtgl, bdtglanggaran, bdkodepa, bdkontak, bdkontakperson, bdanggarankategori, bdanggarancabang, bdanggaranlokasi, bdanggarancostcenter, bdanggarandivisi, bdanggaransubdivisi, bdanggaranproyek, bduraian, bdcatatan, bdmatauang, bdkurs, bdstatus, bdstatussebelumnya, bdjmlrevisi, bdcetakanke, bdisclose, bdposting, bdpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    bdid, bdcabang, bdlokasi, bdsumber, bdautonotransaksi, bdnotransaksi, bdtgl, bdtglanggaran, bdkodepa, bdkontak, bdkontakperson, bdanggarankategori, bdanggarancabang, bdanggaranlokasi, bdanggarancostcenter, bdanggarandivisi, bdanggaransubdivisi, bdanggaranproyek, bduraian, bdcatatan, bdmatauang, bdkurs, bdstatus, bdstatussebelumnya, bdjmlrevisi, bdcetakanke, bdisclose, bdposting, bdpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'bdid', '')::bigint AS bdid,
        row_payload ->> 'bdcabang' AS bdcabang,
        row_payload ->> 'bdlokasi' AS bdlokasi,
        row_payload ->> 'bdsumber' AS bdsumber,
        row_payload ->> 'bdautonotransaksi' AS bdautonotransaksi,
        row_payload ->> 'bdnotransaksi' AS bdnotransaksi,
        NULLIF(row_payload ->> 'bdtgl', '')::timestamptz AS bdtgl,
        NULLIF(row_payload ->> 'bdtglanggaran', '')::timestamptz AS bdtglanggaran,
        row_payload ->> 'bdkodepa' AS bdkodepa,
        row_payload ->> 'bdkontak' AS bdkontak,
        row_payload ->> 'bdkontakperson' AS bdkontakperson,
        row_payload ->> 'bdanggarankategori' AS bdanggarankategori,
        row_payload ->> 'bdanggarancabang' AS bdanggarancabang,
        row_payload ->> 'bdanggaranlokasi' AS bdanggaranlokasi,
        row_payload ->> 'bdanggarancostcenter' AS bdanggarancostcenter,
        row_payload ->> 'bdanggarandivisi' AS bdanggarandivisi,
        row_payload ->> 'bdanggaransubdivisi' AS bdanggaransubdivisi,
        row_payload ->> 'bdanggaranproyek' AS bdanggaranproyek,
        row_payload ->> 'bduraian' AS bduraian,
        row_payload ->> 'bdcatatan' AS bdcatatan,
        row_payload ->> 'bdmatauang' AS bdmatauang,
        NULLIF(row_payload ->> 'bdkurs', '')::numeric(20,6) AS bdkurs,
        row_payload ->> 'bdstatus' AS bdstatus,
        row_payload ->> 'bdstatussebelumnya' AS bdstatussebelumnya,
        NULLIF(row_payload ->> 'bdjmlrevisi', '')::numeric(20,6) AS bdjmlrevisi,
        row_payload ->> 'bdcetakanke' AS bdcetakanke,
        NULLIF(row_payload ->> 'bdisclose', '')::bigint AS bdisclose,
        NULLIF(row_payload ->> 'bdposting', '')::bigint AS bdposting,
        NULLIF(row_payload ->> 'bdpostingtgl', '')::timestamptz AS bdpostingtgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'bdid') IS NOT NULL
) AS prepared
ON CONFLICT (bdid) DO UPDATE
SET
    bdcabang = EXCLUDED.bdcabang,
    bdlokasi = EXCLUDED.bdlokasi,
    bdsumber = EXCLUDED.bdsumber,
    bdautonotransaksi = EXCLUDED.bdautonotransaksi,
    bdnotransaksi = EXCLUDED.bdnotransaksi,
    bdtgl = EXCLUDED.bdtgl,
    bdtglanggaran = EXCLUDED.bdtglanggaran,
    bdkodepa = EXCLUDED.bdkodepa,
    bdkontak = EXCLUDED.bdkontak,
    bdkontakperson = EXCLUDED.bdkontakperson,
    bdanggarankategori = EXCLUDED.bdanggarankategori,
    bdanggarancabang = EXCLUDED.bdanggarancabang,
    bdanggaranlokasi = EXCLUDED.bdanggaranlokasi,
    bdanggarancostcenter = EXCLUDED.bdanggarancostcenter,
    bdanggarandivisi = EXCLUDED.bdanggarandivisi,
    bdanggaransubdivisi = EXCLUDED.bdanggaransubdivisi,
    bdanggaranproyek = EXCLUDED.bdanggaranproyek,
    bduraian = EXCLUDED.bduraian,
    bdcatatan = EXCLUDED.bdcatatan,
    bdmatauang = EXCLUDED.bdmatauang,
    bdkurs = EXCLUDED.bdkurs,
    bdstatus = EXCLUDED.bdstatus,
    bdstatussebelumnya = EXCLUDED.bdstatussebelumnya,
    bdjmlrevisi = EXCLUDED.bdjmlrevisi,
    bdcetakanke = EXCLUDED.bdcetakanke,
    bdisclose = EXCLUDED.bdisclose,
    bdposting = EXCLUDED.bdposting,
    bdpostingtgl = EXCLUDED.bdpostingtgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_bd_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_bd_detail'
)
INSERT INTO m2_bd_detail (
    idbddetail, idbd, norek, matauang, kurs, jumlah, jumlahvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idbddetail, idbd, norek, matauang, kurs, jumlah, jumlahvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idbddetail', '')::bigint AS idbddetail,
        NULLIF(row_payload ->> 'idbd', '')::bigint AS idbd,
        row_payload ->> 'norek' AS norek,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'jumlah' AS jumlah,
        row_payload ->> 'jumlahvalas' AS jumlahvalas,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idbddetail') IS NOT NULL
) AS prepared
ON CONFLICT (idbddetail) DO UPDATE
SET
    idbd = EXCLUDED.idbd,
    norek = EXCLUDED.norek,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    jumlah = EXCLUDED.jumlah,
    jumlahvalas = EXCLUDED.jumlahvalas,
    catatan = EXCLUDED.catatan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    urutan = EXCLUDED.urutan,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_bd_detail_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_bd_detail_history'
)
INSERT INTO m2_bd_detail_history (
    idbddetailhistory, idbdhistory, idbddetail, idbd, norek, matauang, kurs, jumlah, jumlahvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idbddetailhistory, idbdhistory, idbddetail, idbd, norek, matauang, kurs, jumlah, jumlahvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idbddetailhistory', '')::bigint AS idbddetailhistory,
        NULLIF(row_payload ->> 'idbdhistory', '')::bigint AS idbdhistory,
        NULLIF(row_payload ->> 'idbddetail', '')::bigint AS idbddetail,
        NULLIF(row_payload ->> 'idbd', '')::bigint AS idbd,
        row_payload ->> 'norek' AS norek,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'jumlah' AS jumlah,
        row_payload ->> 'jumlahvalas' AS jumlahvalas,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idhistorydetail') IS NOT NULL
) AS prepared
ON CONFLICT (idhistorydetail) DO UPDATE
SET
    idbddetailhistory = EXCLUDED.idbddetailhistory,
    idbdhistory = EXCLUDED.idbdhistory,
    idbddetail = EXCLUDED.idbddetail,
    idbd = EXCLUDED.idbd,
    norek = EXCLUDED.norek,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    jumlah = EXCLUDED.jumlah,
    jumlahvalas = EXCLUDED.jumlahvalas,
    catatan = EXCLUDED.catatan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    urutan = EXCLUDED.urutan,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_bd_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_bd_history'
)
INSERT INTO m2_bd_history (
    bdidhistory, bdid, bdcabang, bdlokasi, bdsumber, bdautonotransaksi, bdnotransaksi, bdtgl, bdtglanggaran, bdkodepa, bdkontak, bdkontakperson, bdanggarankategori, bdanggarancabang, bdanggaranlokasi, bdanggarancostcenter, bdanggarandivisi, bdanggaransubdivisi, bdanggaranproyek, bduraian, bdcatatan, bdmatauang, bdkurs, bdstatus, bdstatussebelumnya, bdjmlrevisi, bdcetakanke, bdisclose, bdposting, bdpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    bdidhistory, bdid, bdcabang, bdlokasi, bdsumber, bdautonotransaksi, bdnotransaksi, bdtgl, bdtglanggaran, bdkodepa, bdkontak, bdkontakperson, bdanggarankategori, bdanggarancabang, bdanggaranlokasi, bdanggarancostcenter, bdanggarandivisi, bdanggaransubdivisi, bdanggaranproyek, bduraian, bdcatatan, bdmatauang, bdkurs, bdstatus, bdstatussebelumnya, bdjmlrevisi, bdcetakanke, bdisclose, bdposting, bdpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'bdidhistory', '')::bigint AS bdidhistory,
        NULLIF(row_payload ->> 'bdid', '')::bigint AS bdid,
        row_payload ->> 'bdcabang' AS bdcabang,
        row_payload ->> 'bdlokasi' AS bdlokasi,
        row_payload ->> 'bdsumber' AS bdsumber,
        row_payload ->> 'bdautonotransaksi' AS bdautonotransaksi,
        row_payload ->> 'bdnotransaksi' AS bdnotransaksi,
        NULLIF(row_payload ->> 'bdtgl', '')::timestamptz AS bdtgl,
        NULLIF(row_payload ->> 'bdtglanggaran', '')::timestamptz AS bdtglanggaran,
        row_payload ->> 'bdkodepa' AS bdkodepa,
        row_payload ->> 'bdkontak' AS bdkontak,
        row_payload ->> 'bdkontakperson' AS bdkontakperson,
        row_payload ->> 'bdanggarankategori' AS bdanggarankategori,
        row_payload ->> 'bdanggarancabang' AS bdanggarancabang,
        row_payload ->> 'bdanggaranlokasi' AS bdanggaranlokasi,
        row_payload ->> 'bdanggarancostcenter' AS bdanggarancostcenter,
        row_payload ->> 'bdanggarandivisi' AS bdanggarandivisi,
        row_payload ->> 'bdanggaransubdivisi' AS bdanggaransubdivisi,
        row_payload ->> 'bdanggaranproyek' AS bdanggaranproyek,
        row_payload ->> 'bduraian' AS bduraian,
        row_payload ->> 'bdcatatan' AS bdcatatan,
        row_payload ->> 'bdmatauang' AS bdmatauang,
        NULLIF(row_payload ->> 'bdkurs', '')::numeric(20,6) AS bdkurs,
        row_payload ->> 'bdstatus' AS bdstatus,
        row_payload ->> 'bdstatussebelumnya' AS bdstatussebelumnya,
        NULLIF(row_payload ->> 'bdjmlrevisi', '')::numeric(20,6) AS bdjmlrevisi,
        row_payload ->> 'bdcetakanke' AS bdcetakanke,
        NULLIF(row_payload ->> 'bdisclose', '')::bigint AS bdisclose,
        NULLIF(row_payload ->> 'bdposting', '')::bigint AS bdposting,
        NULLIF(row_payload ->> 'bdpostingtgl', '')::timestamptz AS bdpostingtgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'bdidhistory') IS NOT NULL
) AS prepared
ON CONFLICT (bdidhistory) DO UPDATE
SET
    bdid = EXCLUDED.bdid,
    bdcabang = EXCLUDED.bdcabang,
    bdlokasi = EXCLUDED.bdlokasi,
    bdsumber = EXCLUDED.bdsumber,
    bdautonotransaksi = EXCLUDED.bdautonotransaksi,
    bdnotransaksi = EXCLUDED.bdnotransaksi,
    bdtgl = EXCLUDED.bdtgl,
    bdtglanggaran = EXCLUDED.bdtglanggaran,
    bdkodepa = EXCLUDED.bdkodepa,
    bdkontak = EXCLUDED.bdkontak,
    bdkontakperson = EXCLUDED.bdkontakperson,
    bdanggarankategori = EXCLUDED.bdanggarankategori,
    bdanggarancabang = EXCLUDED.bdanggarancabang,
    bdanggaranlokasi = EXCLUDED.bdanggaranlokasi,
    bdanggarancostcenter = EXCLUDED.bdanggarancostcenter,
    bdanggarandivisi = EXCLUDED.bdanggarandivisi,
    bdanggaransubdivisi = EXCLUDED.bdanggaransubdivisi,
    bdanggaranproyek = EXCLUDED.bdanggaranproyek,
    bduraian = EXCLUDED.bduraian,
    bdcatatan = EXCLUDED.bdcatatan,
    bdmatauang = EXCLUDED.bdmatauang,
    bdkurs = EXCLUDED.bdkurs,
    bdstatus = EXCLUDED.bdstatus,
    bdstatussebelumnya = EXCLUDED.bdstatussebelumnya,
    bdjmlrevisi = EXCLUDED.bdjmlrevisi,
    bdcetakanke = EXCLUDED.bdcetakanke,
    bdisclose = EXCLUDED.bdisclose,
    bdposting = EXCLUDED.bdposting,
    bdpostingtgl = EXCLUDED.bdpostingtgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_cr
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_cr'
)
INSERT INTO m2_cr (
    crid, crcabang, crlokasi, crsumber, crautonotransaksi, crnotransaksi, crtgl, crkodepa, crkontak, crkontakperson, crnorek, cruraian, crcatatan, crmatauang, crkurs, crjumlah, crjumlahvalas, crjumlahbayar, crjumlahbayarvalas, crstatusbayar, crtgllunas, crstatus, crstatussebelumnya, crjmlrevisi, crcetakanke, crisclose, crposting, crpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    crid, crcabang, crlokasi, crsumber, crautonotransaksi, crnotransaksi, crtgl, crkodepa, crkontak, crkontakperson, crnorek, cruraian, crcatatan, crmatauang, crkurs, crjumlah, crjumlahvalas, crjumlahbayar, crjumlahbayarvalas, crstatusbayar, crtgllunas, crstatus, crstatussebelumnya, crjmlrevisi, crcetakanke, crisclose, crposting, crpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'crid', '')::bigint AS crid,
        row_payload ->> 'crcabang' AS crcabang,
        row_payload ->> 'crlokasi' AS crlokasi,
        row_payload ->> 'crsumber' AS crsumber,
        row_payload ->> 'crautonotransaksi' AS crautonotransaksi,
        row_payload ->> 'crnotransaksi' AS crnotransaksi,
        NULLIF(row_payload ->> 'crtgl', '')::timestamptz AS crtgl,
        row_payload ->> 'crkodepa' AS crkodepa,
        row_payload ->> 'crkontak' AS crkontak,
        row_payload ->> 'crkontakperson' AS crkontakperson,
        row_payload ->> 'crnorek' AS crnorek,
        row_payload ->> 'cruraian' AS cruraian,
        row_payload ->> 'crcatatan' AS crcatatan,
        row_payload ->> 'crmatauang' AS crmatauang,
        NULLIF(row_payload ->> 'crkurs', '')::numeric(20,6) AS crkurs,
        row_payload ->> 'crjumlah' AS crjumlah,
        row_payload ->> 'crjumlahvalas' AS crjumlahvalas,
        row_payload ->> 'crjumlahbayar' AS crjumlahbayar,
        row_payload ->> 'crjumlahbayarvalas' AS crjumlahbayarvalas,
        row_payload ->> 'crstatusbayar' AS crstatusbayar,
        NULLIF(row_payload ->> 'crtgllunas', '')::timestamptz AS crtgllunas,
        row_payload ->> 'crstatus' AS crstatus,
        row_payload ->> 'crstatussebelumnya' AS crstatussebelumnya,
        NULLIF(row_payload ->> 'crjmlrevisi', '')::numeric(20,6) AS crjmlrevisi,
        row_payload ->> 'crcetakanke' AS crcetakanke,
        NULLIF(row_payload ->> 'crisclose', '')::bigint AS crisclose,
        NULLIF(row_payload ->> 'crposting', '')::bigint AS crposting,
        NULLIF(row_payload ->> 'crpostingtgl', '')::timestamptz AS crpostingtgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'crid') IS NOT NULL
) AS prepared
ON CONFLICT (crid) DO UPDATE
SET
    crcabang = EXCLUDED.crcabang,
    crlokasi = EXCLUDED.crlokasi,
    crsumber = EXCLUDED.crsumber,
    crautonotransaksi = EXCLUDED.crautonotransaksi,
    crnotransaksi = EXCLUDED.crnotransaksi,
    crtgl = EXCLUDED.crtgl,
    crkodepa = EXCLUDED.crkodepa,
    crkontak = EXCLUDED.crkontak,
    crkontakperson = EXCLUDED.crkontakperson,
    crnorek = EXCLUDED.crnorek,
    cruraian = EXCLUDED.cruraian,
    crcatatan = EXCLUDED.crcatatan,
    crmatauang = EXCLUDED.crmatauang,
    crkurs = EXCLUDED.crkurs,
    crjumlah = EXCLUDED.crjumlah,
    crjumlahvalas = EXCLUDED.crjumlahvalas,
    crjumlahbayar = EXCLUDED.crjumlahbayar,
    crjumlahbayarvalas = EXCLUDED.crjumlahbayarvalas,
    crstatusbayar = EXCLUDED.crstatusbayar,
    crtgllunas = EXCLUDED.crtgllunas,
    crstatus = EXCLUDED.crstatus,
    crstatussebelumnya = EXCLUDED.crstatussebelumnya,
    crjmlrevisi = EXCLUDED.crjmlrevisi,
    crcetakanke = EXCLUDED.crcetakanke,
    crisclose = EXCLUDED.crisclose,
    crposting = EXCLUDED.crposting,
    crpostingtgl = EXCLUDED.crpostingtgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_cr_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_cr_detail'
)
INSERT INTO m2_cr_detail (
    idcrdetail, idcr, norek, matauang, kurs, jumlah, jumlahvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idcrdetail, idcr, norek, matauang, kurs, jumlah, jumlahvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idcrdetail', '')::bigint AS idcrdetail,
        NULLIF(row_payload ->> 'idcr', '')::bigint AS idcr,
        row_payload ->> 'norek' AS norek,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'jumlah' AS jumlah,
        row_payload ->> 'jumlahvalas' AS jumlahvalas,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idcrdetail') IS NOT NULL
) AS prepared
ON CONFLICT (idcrdetail) DO UPDATE
SET
    idcr = EXCLUDED.idcr,
    norek = EXCLUDED.norek,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    jumlah = EXCLUDED.jumlah,
    jumlahvalas = EXCLUDED.jumlahvalas,
    catatan = EXCLUDED.catatan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    urutan = EXCLUDED.urutan,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_cr_detail_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_cr_detail_history'
)
INSERT INTO m2_cr_detail_history (
    idcrdetailhistory, idcrhistory, idcrdetail, idcr, norek, matauang, kurs, jumlah, jumlahvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idcrdetailhistory, idcrhistory, idcrdetail, idcr, norek, matauang, kurs, jumlah, jumlahvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idcrdetailhistory', '')::bigint AS idcrdetailhistory,
        NULLIF(row_payload ->> 'idcrhistory', '')::bigint AS idcrhistory,
        NULLIF(row_payload ->> 'idcrdetail', '')::bigint AS idcrdetail,
        NULLIF(row_payload ->> 'idcr', '')::bigint AS idcr,
        row_payload ->> 'norek' AS norek,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'jumlah' AS jumlah,
        row_payload ->> 'jumlahvalas' AS jumlahvalas,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idhistorydetail') IS NOT NULL
) AS prepared
ON CONFLICT (idhistorydetail) DO UPDATE
SET
    idcrdetailhistory = EXCLUDED.idcrdetailhistory,
    idcrhistory = EXCLUDED.idcrhistory,
    idcrdetail = EXCLUDED.idcrdetail,
    idcr = EXCLUDED.idcr,
    norek = EXCLUDED.norek,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    jumlah = EXCLUDED.jumlah,
    jumlahvalas = EXCLUDED.jumlahvalas,
    catatan = EXCLUDED.catatan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    urutan = EXCLUDED.urutan,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_cr_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_cr_history'
)
INSERT INTO m2_cr_history (
    cridhistory, crid, crcabang, crlokasi, crsumber, crautonotransaksi, crnotransaksi, crtgl, crkodepa, crkontak, crkontakperson, crnorek, cruraian, crcatatan, crmatauang, crkurs, crjumlah, crjumlahvalas, crjumlahbayar, crjumlahbayarvalas, crstatusbayar, crtgllunas, crstatus, crstatussebelumnya, crjmlrevisi, crcetakanke, crisclose, crposting, crpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    cridhistory, crid, crcabang, crlokasi, crsumber, crautonotransaksi, crnotransaksi, crtgl, crkodepa, crkontak, crkontakperson, crnorek, cruraian, crcatatan, crmatauang, crkurs, crjumlah, crjumlahvalas, crjumlahbayar, crjumlahbayarvalas, crstatusbayar, crtgllunas, crstatus, crstatussebelumnya, crjmlrevisi, crcetakanke, crisclose, crposting, crpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'cridhistory', '')::bigint AS cridhistory,
        NULLIF(row_payload ->> 'crid', '')::bigint AS crid,
        row_payload ->> 'crcabang' AS crcabang,
        row_payload ->> 'crlokasi' AS crlokasi,
        row_payload ->> 'crsumber' AS crsumber,
        row_payload ->> 'crautonotransaksi' AS crautonotransaksi,
        row_payload ->> 'crnotransaksi' AS crnotransaksi,
        NULLIF(row_payload ->> 'crtgl', '')::timestamptz AS crtgl,
        row_payload ->> 'crkodepa' AS crkodepa,
        row_payload ->> 'crkontak' AS crkontak,
        row_payload ->> 'crkontakperson' AS crkontakperson,
        row_payload ->> 'crnorek' AS crnorek,
        row_payload ->> 'cruraian' AS cruraian,
        row_payload ->> 'crcatatan' AS crcatatan,
        row_payload ->> 'crmatauang' AS crmatauang,
        NULLIF(row_payload ->> 'crkurs', '')::numeric(20,6) AS crkurs,
        row_payload ->> 'crjumlah' AS crjumlah,
        row_payload ->> 'crjumlahvalas' AS crjumlahvalas,
        row_payload ->> 'crjumlahbayar' AS crjumlahbayar,
        row_payload ->> 'crjumlahbayarvalas' AS crjumlahbayarvalas,
        row_payload ->> 'crstatusbayar' AS crstatusbayar,
        NULLIF(row_payload ->> 'crtgllunas', '')::timestamptz AS crtgllunas,
        row_payload ->> 'crstatus' AS crstatus,
        row_payload ->> 'crstatussebelumnya' AS crstatussebelumnya,
        NULLIF(row_payload ->> 'crjmlrevisi', '')::numeric(20,6) AS crjmlrevisi,
        row_payload ->> 'crcetakanke' AS crcetakanke,
        NULLIF(row_payload ->> 'crisclose', '')::bigint AS crisclose,
        NULLIF(row_payload ->> 'crposting', '')::bigint AS crposting,
        NULLIF(row_payload ->> 'crpostingtgl', '')::timestamptz AS crpostingtgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'cridhistory') IS NOT NULL
) AS prepared
ON CONFLICT (cridhistory) DO UPDATE
SET
    crid = EXCLUDED.crid,
    crcabang = EXCLUDED.crcabang,
    crlokasi = EXCLUDED.crlokasi,
    crsumber = EXCLUDED.crsumber,
    crautonotransaksi = EXCLUDED.crautonotransaksi,
    crnotransaksi = EXCLUDED.crnotransaksi,
    crtgl = EXCLUDED.crtgl,
    crkodepa = EXCLUDED.crkodepa,
    crkontak = EXCLUDED.crkontak,
    crkontakperson = EXCLUDED.crkontakperson,
    crnorek = EXCLUDED.crnorek,
    cruraian = EXCLUDED.cruraian,
    crcatatan = EXCLUDED.crcatatan,
    crmatauang = EXCLUDED.crmatauang,
    crkurs = EXCLUDED.crkurs,
    crjumlah = EXCLUDED.crjumlah,
    crjumlahvalas = EXCLUDED.crjumlahvalas,
    crjumlahbayar = EXCLUDED.crjumlahbayar,
    crjumlahbayarvalas = EXCLUDED.crjumlahbayarvalas,
    crstatusbayar = EXCLUDED.crstatusbayar,
    crtgllunas = EXCLUDED.crtgllunas,
    crstatus = EXCLUDED.crstatus,
    crstatussebelumnya = EXCLUDED.crstatussebelumnya,
    crjmlrevisi = EXCLUDED.crjmlrevisi,
    crcetakanke = EXCLUDED.crcetakanke,
    crisclose = EXCLUDED.crisclose,
    crposting = EXCLUDED.crposting,
    crpostingtgl = EXCLUDED.crpostingtgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_aj
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_aj'
)
INSERT INTO m2_aj (
    ajid, ajcabang, ajlokasi, ajsumber, ajautonotransaksi, ajnotransaksi, ajtgl, ajkodepa, ajkontak, ajkontakperson, ajuraian, ajcatatan, ajmatauang, ajkurs, ajdebit, ajdebitvalas, ajkredit, ajkreditvalas, ajjumlahbayar, ajjumlahbayarvalas, ajstatusbayar, ajtgllunas, ajstatus, ajstatussebelumnya, ajjmlrevisi, ajcetakanke, ajisclose, ajposting, ajpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    ajid, ajcabang, ajlokasi, ajsumber, ajautonotransaksi, ajnotransaksi, ajtgl, ajkodepa, ajkontak, ajkontakperson, ajuraian, ajcatatan, ajmatauang, ajkurs, ajdebit, ajdebitvalas, ajkredit, ajkreditvalas, ajjumlahbayar, ajjumlahbayarvalas, ajstatusbayar, ajtgllunas, ajstatus, ajstatussebelumnya, ajjmlrevisi, ajcetakanke, ajisclose, ajposting, ajpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'ajid', '')::bigint AS ajid,
        row_payload ->> 'ajcabang' AS ajcabang,
        row_payload ->> 'ajlokasi' AS ajlokasi,
        row_payload ->> 'ajsumber' AS ajsumber,
        row_payload ->> 'ajautonotransaksi' AS ajautonotransaksi,
        row_payload ->> 'ajnotransaksi' AS ajnotransaksi,
        NULLIF(row_payload ->> 'ajtgl', '')::timestamptz AS ajtgl,
        row_payload ->> 'ajkodepa' AS ajkodepa,
        row_payload ->> 'ajkontak' AS ajkontak,
        row_payload ->> 'ajkontakperson' AS ajkontakperson,
        row_payload ->> 'ajuraian' AS ajuraian,
        row_payload ->> 'ajcatatan' AS ajcatatan,
        row_payload ->> 'ajmatauang' AS ajmatauang,
        NULLIF(row_payload ->> 'ajkurs', '')::numeric(20,6) AS ajkurs,
        row_payload ->> 'ajdebit' AS ajdebit,
        row_payload ->> 'ajdebitvalas' AS ajdebitvalas,
        row_payload ->> 'ajkredit' AS ajkredit,
        row_payload ->> 'ajkreditvalas' AS ajkreditvalas,
        row_payload ->> 'ajjumlahbayar' AS ajjumlahbayar,
        row_payload ->> 'ajjumlahbayarvalas' AS ajjumlahbayarvalas,
        row_payload ->> 'ajstatusbayar' AS ajstatusbayar,
        NULLIF(row_payload ->> 'ajtgllunas', '')::timestamptz AS ajtgllunas,
        row_payload ->> 'ajstatus' AS ajstatus,
        row_payload ->> 'ajstatussebelumnya' AS ajstatussebelumnya,
        NULLIF(row_payload ->> 'ajjmlrevisi', '')::numeric(20,6) AS ajjmlrevisi,
        row_payload ->> 'ajcetakanke' AS ajcetakanke,
        NULLIF(row_payload ->> 'ajisclose', '')::bigint AS ajisclose,
        NULLIF(row_payload ->> 'ajposting', '')::bigint AS ajposting,
        NULLIF(row_payload ->> 'ajpostingtgl', '')::timestamptz AS ajpostingtgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'ajid') IS NOT NULL
) AS prepared
ON CONFLICT (ajid) DO UPDATE
SET
    ajcabang = EXCLUDED.ajcabang,
    ajlokasi = EXCLUDED.ajlokasi,
    ajsumber = EXCLUDED.ajsumber,
    ajautonotransaksi = EXCLUDED.ajautonotransaksi,
    ajnotransaksi = EXCLUDED.ajnotransaksi,
    ajtgl = EXCLUDED.ajtgl,
    ajkodepa = EXCLUDED.ajkodepa,
    ajkontak = EXCLUDED.ajkontak,
    ajkontakperson = EXCLUDED.ajkontakperson,
    ajuraian = EXCLUDED.ajuraian,
    ajcatatan = EXCLUDED.ajcatatan,
    ajmatauang = EXCLUDED.ajmatauang,
    ajkurs = EXCLUDED.ajkurs,
    ajdebit = EXCLUDED.ajdebit,
    ajdebitvalas = EXCLUDED.ajdebitvalas,
    ajkredit = EXCLUDED.ajkredit,
    ajkreditvalas = EXCLUDED.ajkreditvalas,
    ajjumlahbayar = EXCLUDED.ajjumlahbayar,
    ajjumlahbayarvalas = EXCLUDED.ajjumlahbayarvalas,
    ajstatusbayar = EXCLUDED.ajstatusbayar,
    ajtgllunas = EXCLUDED.ajtgllunas,
    ajstatus = EXCLUDED.ajstatus,
    ajstatussebelumnya = EXCLUDED.ajstatussebelumnya,
    ajjmlrevisi = EXCLUDED.ajjmlrevisi,
    ajcetakanke = EXCLUDED.ajcetakanke,
    ajisclose = EXCLUDED.ajisclose,
    ajposting = EXCLUDED.ajposting,
    ajpostingtgl = EXCLUDED.ajpostingtgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_aj_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_aj_detail'
)
INSERT INTO m2_aj_detail (
    idajdetail, idaj, norek, matauang, kurs, debit, debitvalas, kredit, kreditvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idajdetail, idaj, norek, matauang, kurs, debit, debitvalas, kredit, kreditvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idajdetail', '')::bigint AS idajdetail,
        NULLIF(row_payload ->> 'idaj', '')::bigint AS idaj,
        row_payload ->> 'norek' AS norek,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'debit' AS debit,
        row_payload ->> 'debitvalas' AS debitvalas,
        row_payload ->> 'kredit' AS kredit,
        row_payload ->> 'kreditvalas' AS kreditvalas,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idajdetail') IS NOT NULL
) AS prepared
ON CONFLICT (idajdetail) DO UPDATE
SET
    idaj = EXCLUDED.idaj,
    norek = EXCLUDED.norek,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    debit = EXCLUDED.debit,
    debitvalas = EXCLUDED.debitvalas,
    kredit = EXCLUDED.kredit,
    kreditvalas = EXCLUDED.kreditvalas,
    catatan = EXCLUDED.catatan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    urutan = EXCLUDED.urutan,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_aj_detail_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_aj_detail_history'
)
INSERT INTO m2_aj_detail_history (
    idajdetailhistory, idajhistory, idajdetail, idaj, norek, matauang, kurs, debit, debitvalas, kredit, kreditvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idajdetailhistory, idajhistory, idajdetail, idaj, norek, matauang, kurs, debit, debitvalas, kredit, kreditvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idajdetailhistory', '')::bigint AS idajdetailhistory,
        NULLIF(row_payload ->> 'idajhistory', '')::bigint AS idajhistory,
        NULLIF(row_payload ->> 'idajdetail', '')::bigint AS idajdetail,
        NULLIF(row_payload ->> 'idaj', '')::bigint AS idaj,
        row_payload ->> 'norek' AS norek,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'debit' AS debit,
        row_payload ->> 'debitvalas' AS debitvalas,
        row_payload ->> 'kredit' AS kredit,
        row_payload ->> 'kreditvalas' AS kreditvalas,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idhistorydetail') IS NOT NULL
) AS prepared
ON CONFLICT (idhistorydetail) DO UPDATE
SET
    idajdetailhistory = EXCLUDED.idajdetailhistory,
    idajhistory = EXCLUDED.idajhistory,
    idajdetail = EXCLUDED.idajdetail,
    idaj = EXCLUDED.idaj,
    norek = EXCLUDED.norek,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    debit = EXCLUDED.debit,
    debitvalas = EXCLUDED.debitvalas,
    kredit = EXCLUDED.kredit,
    kreditvalas = EXCLUDED.kreditvalas,
    catatan = EXCLUDED.catatan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    urutan = EXCLUDED.urutan,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_aj_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_aj_history'
)
INSERT INTO m2_aj_history (
    ajidhistory, ajid, ajcabang, ajlokasi, ajsumber, ajautonotransaksi, ajnotransaksi, ajtgl, ajkodepa, ajkontak, ajkontakperson, ajuraian, ajcatatan, ajmatauang, ajkurs, ajdebit, ajdebitvalas, ajkredit, ajkreditvalas, ajjumlahbayar, ajjumlahbayarvalas, ajstatusbayar, ajtgllunas, ajstatus, ajstatussebelumnya, ajjmlrevisi, ajcetakanke, ajisclose, ajposting, ajpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    ajidhistory, ajid, ajcabang, ajlokasi, ajsumber, ajautonotransaksi, ajnotransaksi, ajtgl, ajkodepa, ajkontak, ajkontakperson, ajuraian, ajcatatan, ajmatauang, ajkurs, ajdebit, ajdebitvalas, ajkredit, ajkreditvalas, ajjumlahbayar, ajjumlahbayarvalas, ajstatusbayar, ajtgllunas, ajstatus, ajstatussebelumnya, ajjmlrevisi, ajcetakanke, ajisclose, ajposting, ajpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'ajidhistory', '')::bigint AS ajidhistory,
        NULLIF(row_payload ->> 'ajid', '')::bigint AS ajid,
        row_payload ->> 'ajcabang' AS ajcabang,
        row_payload ->> 'ajlokasi' AS ajlokasi,
        row_payload ->> 'ajsumber' AS ajsumber,
        row_payload ->> 'ajautonotransaksi' AS ajautonotransaksi,
        row_payload ->> 'ajnotransaksi' AS ajnotransaksi,
        NULLIF(row_payload ->> 'ajtgl', '')::timestamptz AS ajtgl,
        row_payload ->> 'ajkodepa' AS ajkodepa,
        row_payload ->> 'ajkontak' AS ajkontak,
        row_payload ->> 'ajkontakperson' AS ajkontakperson,
        row_payload ->> 'ajuraian' AS ajuraian,
        row_payload ->> 'ajcatatan' AS ajcatatan,
        row_payload ->> 'ajmatauang' AS ajmatauang,
        NULLIF(row_payload ->> 'ajkurs', '')::numeric(20,6) AS ajkurs,
        row_payload ->> 'ajdebit' AS ajdebit,
        row_payload ->> 'ajdebitvalas' AS ajdebitvalas,
        row_payload ->> 'ajkredit' AS ajkredit,
        row_payload ->> 'ajkreditvalas' AS ajkreditvalas,
        row_payload ->> 'ajjumlahbayar' AS ajjumlahbayar,
        row_payload ->> 'ajjumlahbayarvalas' AS ajjumlahbayarvalas,
        row_payload ->> 'ajstatusbayar' AS ajstatusbayar,
        NULLIF(row_payload ->> 'ajtgllunas', '')::timestamptz AS ajtgllunas,
        row_payload ->> 'ajstatus' AS ajstatus,
        row_payload ->> 'ajstatussebelumnya' AS ajstatussebelumnya,
        NULLIF(row_payload ->> 'ajjmlrevisi', '')::numeric(20,6) AS ajjmlrevisi,
        row_payload ->> 'ajcetakanke' AS ajcetakanke,
        NULLIF(row_payload ->> 'ajisclose', '')::bigint AS ajisclose,
        NULLIF(row_payload ->> 'ajposting', '')::bigint AS ajposting,
        NULLIF(row_payload ->> 'ajpostingtgl', '')::timestamptz AS ajpostingtgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'ajidhistory') IS NOT NULL
) AS prepared
ON CONFLICT (ajidhistory) DO UPDATE
SET
    ajid = EXCLUDED.ajid,
    ajcabang = EXCLUDED.ajcabang,
    ajlokasi = EXCLUDED.ajlokasi,
    ajsumber = EXCLUDED.ajsumber,
    ajautonotransaksi = EXCLUDED.ajautonotransaksi,
    ajnotransaksi = EXCLUDED.ajnotransaksi,
    ajtgl = EXCLUDED.ajtgl,
    ajkodepa = EXCLUDED.ajkodepa,
    ajkontak = EXCLUDED.ajkontak,
    ajkontakperson = EXCLUDED.ajkontakperson,
    ajuraian = EXCLUDED.ajuraian,
    ajcatatan = EXCLUDED.ajcatatan,
    ajmatauang = EXCLUDED.ajmatauang,
    ajkurs = EXCLUDED.ajkurs,
    ajdebit = EXCLUDED.ajdebit,
    ajdebitvalas = EXCLUDED.ajdebitvalas,
    ajkredit = EXCLUDED.ajkredit,
    ajkreditvalas = EXCLUDED.ajkreditvalas,
    ajjumlahbayar = EXCLUDED.ajjumlahbayar,
    ajjumlahbayarvalas = EXCLUDED.ajjumlahbayarvalas,
    ajstatusbayar = EXCLUDED.ajstatusbayar,
    ajtgllunas = EXCLUDED.ajtgllunas,
    ajstatus = EXCLUDED.ajstatus,
    ajstatussebelumnya = EXCLUDED.ajstatussebelumnya,
    ajjmlrevisi = EXCLUDED.ajjmlrevisi,
    ajcetakanke = EXCLUDED.ajcetakanke,
    ajisclose = EXCLUDED.ajisclose,
    ajposting = EXCLUDED.ajposting,
    ajpostingtgl = EXCLUDED.ajpostingtgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_cb
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_cb'
)
INSERT INTO m2_cb (
    cbid, cbcabang, cblokasi, cbsumber, cbautonotransaksi, cbnotransaksi, cbtgl, cbkodepa, cbkontak, cbkontakperson, cburaian, cbcatatan, cbmatauang, cbkurs, cbdebit, cbdebitvalas, cbkredit, cbkreditvalas, cbjumlahbayar, cbjumlahbayarvalas, cbstatusbayar, cbtgllunas, cbstatus, cbstatussebelumnya, cbjmlrevisi, cbcetakanke, cbisclose, cbposting, cbpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    cbid, cbcabang, cblokasi, cbsumber, cbautonotransaksi, cbnotransaksi, cbtgl, cbkodepa, cbkontak, cbkontakperson, cburaian, cbcatatan, cbmatauang, cbkurs, cbdebit, cbdebitvalas, cbkredit, cbkreditvalas, cbjumlahbayar, cbjumlahbayarvalas, cbstatusbayar, cbtgllunas, cbstatus, cbstatussebelumnya, cbjmlrevisi, cbcetakanke, cbisclose, cbposting, cbpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'cbid', '')::bigint AS cbid,
        row_payload ->> 'cbcabang' AS cbcabang,
        row_payload ->> 'cblokasi' AS cblokasi,
        row_payload ->> 'cbsumber' AS cbsumber,
        row_payload ->> 'cbautonotransaksi' AS cbautonotransaksi,
        row_payload ->> 'cbnotransaksi' AS cbnotransaksi,
        NULLIF(row_payload ->> 'cbtgl', '')::timestamptz AS cbtgl,
        row_payload ->> 'cbkodepa' AS cbkodepa,
        row_payload ->> 'cbkontak' AS cbkontak,
        row_payload ->> 'cbkontakperson' AS cbkontakperson,
        row_payload ->> 'cburaian' AS cburaian,
        row_payload ->> 'cbcatatan' AS cbcatatan,
        row_payload ->> 'cbmatauang' AS cbmatauang,
        NULLIF(row_payload ->> 'cbkurs', '')::numeric(20,6) AS cbkurs,
        row_payload ->> 'cbdebit' AS cbdebit,
        row_payload ->> 'cbdebitvalas' AS cbdebitvalas,
        row_payload ->> 'cbkredit' AS cbkredit,
        row_payload ->> 'cbkreditvalas' AS cbkreditvalas,
        row_payload ->> 'cbjumlahbayar' AS cbjumlahbayar,
        row_payload ->> 'cbjumlahbayarvalas' AS cbjumlahbayarvalas,
        row_payload ->> 'cbstatusbayar' AS cbstatusbayar,
        NULLIF(row_payload ->> 'cbtgllunas', '')::timestamptz AS cbtgllunas,
        row_payload ->> 'cbstatus' AS cbstatus,
        row_payload ->> 'cbstatussebelumnya' AS cbstatussebelumnya,
        NULLIF(row_payload ->> 'cbjmlrevisi', '')::numeric(20,6) AS cbjmlrevisi,
        row_payload ->> 'cbcetakanke' AS cbcetakanke,
        NULLIF(row_payload ->> 'cbisclose', '')::bigint AS cbisclose,
        NULLIF(row_payload ->> 'cbposting', '')::bigint AS cbposting,
        NULLIF(row_payload ->> 'cbpostingtgl', '')::timestamptz AS cbpostingtgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'cbid') IS NOT NULL
) AS prepared
ON CONFLICT (cbid) DO UPDATE
SET
    cbcabang = EXCLUDED.cbcabang,
    cblokasi = EXCLUDED.cblokasi,
    cbsumber = EXCLUDED.cbsumber,
    cbautonotransaksi = EXCLUDED.cbautonotransaksi,
    cbnotransaksi = EXCLUDED.cbnotransaksi,
    cbtgl = EXCLUDED.cbtgl,
    cbkodepa = EXCLUDED.cbkodepa,
    cbkontak = EXCLUDED.cbkontak,
    cbkontakperson = EXCLUDED.cbkontakperson,
    cburaian = EXCLUDED.cburaian,
    cbcatatan = EXCLUDED.cbcatatan,
    cbmatauang = EXCLUDED.cbmatauang,
    cbkurs = EXCLUDED.cbkurs,
    cbdebit = EXCLUDED.cbdebit,
    cbdebitvalas = EXCLUDED.cbdebitvalas,
    cbkredit = EXCLUDED.cbkredit,
    cbkreditvalas = EXCLUDED.cbkreditvalas,
    cbjumlahbayar = EXCLUDED.cbjumlahbayar,
    cbjumlahbayarvalas = EXCLUDED.cbjumlahbayarvalas,
    cbstatusbayar = EXCLUDED.cbstatusbayar,
    cbtgllunas = EXCLUDED.cbtgllunas,
    cbstatus = EXCLUDED.cbstatus,
    cbstatussebelumnya = EXCLUDED.cbstatussebelumnya,
    cbjmlrevisi = EXCLUDED.cbjmlrevisi,
    cbcetakanke = EXCLUDED.cbcetakanke,
    cbisclose = EXCLUDED.cbisclose,
    cbposting = EXCLUDED.cbposting,
    cbpostingtgl = EXCLUDED.cbpostingtgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_cb_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_cb_detail'
)
INSERT INTO m2_cb_detail (
    idcbdetail, idcb, norek, matauang, kurs, debit, debitvalas, kredit, kreditvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idcbdetail, idcb, norek, matauang, kurs, debit, debitvalas, kredit, kreditvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idcbdetail', '')::bigint AS idcbdetail,
        NULLIF(row_payload ->> 'idcb', '')::bigint AS idcb,
        row_payload ->> 'norek' AS norek,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'debit' AS debit,
        row_payload ->> 'debitvalas' AS debitvalas,
        row_payload ->> 'kredit' AS kredit,
        row_payload ->> 'kreditvalas' AS kreditvalas,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idcbdetail') IS NOT NULL
) AS prepared
ON CONFLICT (idcbdetail) DO UPDATE
SET
    idcb = EXCLUDED.idcb,
    norek = EXCLUDED.norek,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    debit = EXCLUDED.debit,
    debitvalas = EXCLUDED.debitvalas,
    kredit = EXCLUDED.kredit,
    kreditvalas = EXCLUDED.kreditvalas,
    catatan = EXCLUDED.catatan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    urutan = EXCLUDED.urutan,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_cb_detail_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_cb_detail_history'
)
INSERT INTO m2_cb_detail_history (
    idcbdetailhistory, idcbhistory, idcbdetail, idcb, norek, matauang, kurs, debit, debitvalas, kredit, kreditvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idcbdetailhistory, idcbhistory, idcbdetail, idcb, norek, matauang, kurs, debit, debitvalas, kredit, kreditvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idcbdetailhistory', '')::bigint AS idcbdetailhistory,
        NULLIF(row_payload ->> 'idcbhistory', '')::bigint AS idcbhistory,
        NULLIF(row_payload ->> 'idcbdetail', '')::bigint AS idcbdetail,
        NULLIF(row_payload ->> 'idcb', '')::bigint AS idcb,
        row_payload ->> 'norek' AS norek,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'debit' AS debit,
        row_payload ->> 'debitvalas' AS debitvalas,
        row_payload ->> 'kredit' AS kredit,
        row_payload ->> 'kreditvalas' AS kreditvalas,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idhistorydetail') IS NOT NULL
) AS prepared
ON CONFLICT (idhistorydetail) DO UPDATE
SET
    idcbdetailhistory = EXCLUDED.idcbdetailhistory,
    idcbhistory = EXCLUDED.idcbhistory,
    idcbdetail = EXCLUDED.idcbdetail,
    idcb = EXCLUDED.idcb,
    norek = EXCLUDED.norek,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    debit = EXCLUDED.debit,
    debitvalas = EXCLUDED.debitvalas,
    kredit = EXCLUDED.kredit,
    kreditvalas = EXCLUDED.kreditvalas,
    catatan = EXCLUDED.catatan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    urutan = EXCLUDED.urutan,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_cb_pay
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_cb_pay'
)
INSERT INTO m2_cb_pay (
    idcbcarabayar, idcb, jenisgiro, matauang, kurs, jumlah, jumlahvalas, nogiro, tgljt, bank, noacbank, rekbank, rekgiro, catatan, urutan, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idcbcarabayar, idcb, jenisgiro, matauang, kurs, jumlah, jumlahvalas, nogiro, tgljt, bank, noacbank, rekbank, rekgiro, catatan, urutan, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idcbcarabayar', '')::bigint AS idcbcarabayar,
        NULLIF(row_payload ->> 'idcb', '')::bigint AS idcb,
        row_payload ->> 'jenisgiro' AS jenisgiro,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'jumlah' AS jumlah,
        row_payload ->> 'jumlahvalas' AS jumlahvalas,
        row_payload ->> 'nogiro' AS nogiro,
        NULLIF(row_payload ->> 'tgljt', '')::timestamptz AS tgljt,
        row_payload ->> 'bank' AS bank,
        row_payload ->> 'noacbank' AS noacbank,
        row_payload ->> 'rekbank' AS rekbank,
        row_payload ->> 'rekgiro' AS rekgiro,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idcbcarabayar') IS NOT NULL
) AS prepared
ON CONFLICT (idcbcarabayar) DO UPDATE
SET
    idcb = EXCLUDED.idcb,
    jenisgiro = EXCLUDED.jenisgiro,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    jumlah = EXCLUDED.jumlah,
    jumlahvalas = EXCLUDED.jumlahvalas,
    nogiro = EXCLUDED.nogiro,
    tgljt = EXCLUDED.tgljt,
    bank = EXCLUDED.bank,
    noacbank = EXCLUDED.noacbank,
    rekbank = EXCLUDED.rekbank,
    rekgiro = EXCLUDED.rekgiro,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_cb_pay_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_cb_pay_history'
)
INSERT INTO m2_cb_pay_history (
    idcbcarabayarhistory, idcbhistory, idcbcarabayar, idcb, jenisgiro, matauang, kurs, jumlah, jumlahvalas, nogiro, tgljt, bank, noacbank, rekbank, rekgiro, catatan, urutan, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idcbcarabayarhistory, idcbhistory, idcbcarabayar, idcb, jenisgiro, matauang, kurs, jumlah, jumlahvalas, nogiro, tgljt, bank, noacbank, rekbank, rekgiro, catatan, urutan, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idcbcarabayarhistory', '')::bigint AS idcbcarabayarhistory,
        NULLIF(row_payload ->> 'idcbhistory', '')::bigint AS idcbhistory,
        NULLIF(row_payload ->> 'idcbcarabayar', '')::bigint AS idcbcarabayar,
        NULLIF(row_payload ->> 'idcb', '')::bigint AS idcb,
        row_payload ->> 'jenisgiro' AS jenisgiro,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'jumlah' AS jumlah,
        row_payload ->> 'jumlahvalas' AS jumlahvalas,
        row_payload ->> 'nogiro' AS nogiro,
        NULLIF(row_payload ->> 'tgljt', '')::timestamptz AS tgljt,
        row_payload ->> 'bank' AS bank,
        row_payload ->> 'noacbank' AS noacbank,
        row_payload ->> 'rekbank' AS rekbank,
        row_payload ->> 'rekgiro' AS rekgiro,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idcarabayarhistory') IS NOT NULL
) AS prepared
ON CONFLICT (idcarabayarhistory) DO UPDATE
SET
    idcbcarabayarhistory = EXCLUDED.idcbcarabayarhistory,
    idcbhistory = EXCLUDED.idcbhistory,
    idcbcarabayar = EXCLUDED.idcbcarabayar,
    idcb = EXCLUDED.idcb,
    jenisgiro = EXCLUDED.jenisgiro,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    jumlah = EXCLUDED.jumlah,
    jumlahvalas = EXCLUDED.jumlahvalas,
    nogiro = EXCLUDED.nogiro,
    tgljt = EXCLUDED.tgljt,
    bank = EXCLUDED.bank,
    noacbank = EXCLUDED.noacbank,
    rekbank = EXCLUDED.rekbank,
    rekgiro = EXCLUDED.rekgiro,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_cb_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_cb_history'
)
INSERT INTO m2_cb_history (
    cbidhistory, cbid, cbcabang, cblokasi, cbsumber, cbautonotransaksi, cbnotransaksi, cbtgl, cbkodepa, cbkontak, cbkontakperson, cburaian, cbcatatan, cbmatauang, cbkurs, cbdebit, cbdebitvalas, cbkredit, cbkreditvalas, cbjumlahbayar, cbjumlahbayarvalas, cbstatusbayar, cbtgllunas, cbstatus, cbstatussebelumnya, cbjmlrevisi, cbcetakanke, cbisclose, cbposting, cbpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    cbidhistory, cbid, cbcabang, cblokasi, cbsumber, cbautonotransaksi, cbnotransaksi, cbtgl, cbkodepa, cbkontak, cbkontakperson, cburaian, cbcatatan, cbmatauang, cbkurs, cbdebit, cbdebitvalas, cbkredit, cbkreditvalas, cbjumlahbayar, cbjumlahbayarvalas, cbstatusbayar, cbtgllunas, cbstatus, cbstatussebelumnya, cbjmlrevisi, cbcetakanke, cbisclose, cbposting, cbpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'cbidhistory', '')::bigint AS cbidhistory,
        NULLIF(row_payload ->> 'cbid', '')::bigint AS cbid,
        row_payload ->> 'cbcabang' AS cbcabang,
        row_payload ->> 'cblokasi' AS cblokasi,
        row_payload ->> 'cbsumber' AS cbsumber,
        row_payload ->> 'cbautonotransaksi' AS cbautonotransaksi,
        row_payload ->> 'cbnotransaksi' AS cbnotransaksi,
        NULLIF(row_payload ->> 'cbtgl', '')::timestamptz AS cbtgl,
        row_payload ->> 'cbkodepa' AS cbkodepa,
        row_payload ->> 'cbkontak' AS cbkontak,
        row_payload ->> 'cbkontakperson' AS cbkontakperson,
        row_payload ->> 'cburaian' AS cburaian,
        row_payload ->> 'cbcatatan' AS cbcatatan,
        row_payload ->> 'cbmatauang' AS cbmatauang,
        NULLIF(row_payload ->> 'cbkurs', '')::numeric(20,6) AS cbkurs,
        row_payload ->> 'cbdebit' AS cbdebit,
        row_payload ->> 'cbdebitvalas' AS cbdebitvalas,
        row_payload ->> 'cbkredit' AS cbkredit,
        row_payload ->> 'cbkreditvalas' AS cbkreditvalas,
        row_payload ->> 'cbjumlahbayar' AS cbjumlahbayar,
        row_payload ->> 'cbjumlahbayarvalas' AS cbjumlahbayarvalas,
        row_payload ->> 'cbstatusbayar' AS cbstatusbayar,
        NULLIF(row_payload ->> 'cbtgllunas', '')::timestamptz AS cbtgllunas,
        row_payload ->> 'cbstatus' AS cbstatus,
        row_payload ->> 'cbstatussebelumnya' AS cbstatussebelumnya,
        NULLIF(row_payload ->> 'cbjmlrevisi', '')::numeric(20,6) AS cbjmlrevisi,
        row_payload ->> 'cbcetakanke' AS cbcetakanke,
        NULLIF(row_payload ->> 'cbisclose', '')::bigint AS cbisclose,
        NULLIF(row_payload ->> 'cbposting', '')::bigint AS cbposting,
        NULLIF(row_payload ->> 'cbpostingtgl', '')::timestamptz AS cbpostingtgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'cbidhistory') IS NOT NULL
) AS prepared
ON CONFLICT (cbidhistory) DO UPDATE
SET
    cbid = EXCLUDED.cbid,
    cbcabang = EXCLUDED.cbcabang,
    cblokasi = EXCLUDED.cblokasi,
    cbsumber = EXCLUDED.cbsumber,
    cbautonotransaksi = EXCLUDED.cbautonotransaksi,
    cbnotransaksi = EXCLUDED.cbnotransaksi,
    cbtgl = EXCLUDED.cbtgl,
    cbkodepa = EXCLUDED.cbkodepa,
    cbkontak = EXCLUDED.cbkontak,
    cbkontakperson = EXCLUDED.cbkontakperson,
    cburaian = EXCLUDED.cburaian,
    cbcatatan = EXCLUDED.cbcatatan,
    cbmatauang = EXCLUDED.cbmatauang,
    cbkurs = EXCLUDED.cbkurs,
    cbdebit = EXCLUDED.cbdebit,
    cbdebitvalas = EXCLUDED.cbdebitvalas,
    cbkredit = EXCLUDED.cbkredit,
    cbkreditvalas = EXCLUDED.cbkreditvalas,
    cbjumlahbayar = EXCLUDED.cbjumlahbayar,
    cbjumlahbayarvalas = EXCLUDED.cbjumlahbayarvalas,
    cbstatusbayar = EXCLUDED.cbstatusbayar,
    cbtgllunas = EXCLUDED.cbtgllunas,
    cbstatus = EXCLUDED.cbstatus,
    cbstatussebelumnya = EXCLUDED.cbstatussebelumnya,
    cbjmlrevisi = EXCLUDED.cbjmlrevisi,
    cbcetakanke = EXCLUDED.cbcetakanke,
    cbisclose = EXCLUDED.cbisclose,
    cbposting = EXCLUDED.cbposting,
    cbpostingtgl = EXCLUDED.cbpostingtgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_files
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_files'
)
INSERT INTO m2_files (
    fsumber, fidtransaksi, fnamafile, fcatatan, fukuranfile, ftanggal, finputuser, finputtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    fsumber, fidtransaksi, fnamafile, fcatatan, fukuranfile, ftanggal, finputuser, finputtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'fsumber' AS fsumber,
        NULLIF(row_payload ->> 'fidtransaksi', '')::bigint AS fidtransaksi,
        row_payload ->> 'fnamafile' AS fnamafile,
        row_payload ->> 'fcatatan' AS fcatatan,
        row_payload ->> 'fukuranfile' AS fukuranfile,
        row_payload ->> 'ftanggal' AS ftanggal,
        row_payload ->> 'finputuser' AS finputuser,
        NULLIF(row_payload ->> 'finputtgl', '')::timestamptz AS finputtgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'fsumber') IS NOT NULL AND (row_payload ->> 'fidtransaksi') IS NOT NULL AND (row_payload ->> 'fnamafile') IS NOT NULL AND (row_payload ->> 'finputtgl') IS NOT NULL
) AS prepared
ON CONFLICT (fsumber, fidtransaksi, fnamafile, finputtgl) DO UPDATE
SET
    fcatatan = EXCLUDED.fcatatan,
    fukuranfile = EXCLUDED.fukuranfile,
    ftanggal = EXCLUDED.ftanggal,
    finputuser = EXCLUDED.finputuser,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_gj
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_gj'
)
INSERT INTO m2_gj (
    gjid, gjcabang, gjlokasi, gjsumber, gjautonotransaksi, gjnotransaksi, gjtgl, gjkodepa, gjkontak, gjkontakperson, gjuraian, gjcatatan, gjmatauang, gjkurs, gjdebit, gjdebitvalas, gjkredit, gjkreditvalas, gjjumlahbayar, gjjumlahbayarvalas, gjstatusbayar, gjtgllunas, gjstatus, gjstatussebelumnya, gjjmlrevisi, gjcetakanke, gjisclose, gjposting, gjpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    gjid, gjcabang, gjlokasi, gjsumber, gjautonotransaksi, gjnotransaksi, gjtgl, gjkodepa, gjkontak, gjkontakperson, gjuraian, gjcatatan, gjmatauang, gjkurs, gjdebit, gjdebitvalas, gjkredit, gjkreditvalas, gjjumlahbayar, gjjumlahbayarvalas, gjstatusbayar, gjtgllunas, gjstatus, gjstatussebelumnya, gjjmlrevisi, gjcetakanke, gjisclose, gjposting, gjpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'gjid', '')::bigint AS gjid,
        row_payload ->> 'gjcabang' AS gjcabang,
        row_payload ->> 'gjlokasi' AS gjlokasi,
        row_payload ->> 'gjsumber' AS gjsumber,
        row_payload ->> 'gjautonotransaksi' AS gjautonotransaksi,
        row_payload ->> 'gjnotransaksi' AS gjnotransaksi,
        NULLIF(row_payload ->> 'gjtgl', '')::timestamptz AS gjtgl,
        row_payload ->> 'gjkodepa' AS gjkodepa,
        row_payload ->> 'gjkontak' AS gjkontak,
        row_payload ->> 'gjkontakperson' AS gjkontakperson,
        row_payload ->> 'gjuraian' AS gjuraian,
        row_payload ->> 'gjcatatan' AS gjcatatan,
        row_payload ->> 'gjmatauang' AS gjmatauang,
        NULLIF(row_payload ->> 'gjkurs', '')::numeric(20,6) AS gjkurs,
        row_payload ->> 'gjdebit' AS gjdebit,
        row_payload ->> 'gjdebitvalas' AS gjdebitvalas,
        row_payload ->> 'gjkredit' AS gjkredit,
        row_payload ->> 'gjkreditvalas' AS gjkreditvalas,
        row_payload ->> 'gjjumlahbayar' AS gjjumlahbayar,
        row_payload ->> 'gjjumlahbayarvalas' AS gjjumlahbayarvalas,
        row_payload ->> 'gjstatusbayar' AS gjstatusbayar,
        NULLIF(row_payload ->> 'gjtgllunas', '')::timestamptz AS gjtgllunas,
        row_payload ->> 'gjstatus' AS gjstatus,
        row_payload ->> 'gjstatussebelumnya' AS gjstatussebelumnya,
        NULLIF(row_payload ->> 'gjjmlrevisi', '')::numeric(20,6) AS gjjmlrevisi,
        row_payload ->> 'gjcetakanke' AS gjcetakanke,
        NULLIF(row_payload ->> 'gjisclose', '')::bigint AS gjisclose,
        NULLIF(row_payload ->> 'gjposting', '')::bigint AS gjposting,
        NULLIF(row_payload ->> 'gjpostingtgl', '')::timestamptz AS gjpostingtgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'gjid') IS NOT NULL
) AS prepared
ON CONFLICT (gjid) DO UPDATE
SET
    gjcabang = EXCLUDED.gjcabang,
    gjlokasi = EXCLUDED.gjlokasi,
    gjsumber = EXCLUDED.gjsumber,
    gjautonotransaksi = EXCLUDED.gjautonotransaksi,
    gjnotransaksi = EXCLUDED.gjnotransaksi,
    gjtgl = EXCLUDED.gjtgl,
    gjkodepa = EXCLUDED.gjkodepa,
    gjkontak = EXCLUDED.gjkontak,
    gjkontakperson = EXCLUDED.gjkontakperson,
    gjuraian = EXCLUDED.gjuraian,
    gjcatatan = EXCLUDED.gjcatatan,
    gjmatauang = EXCLUDED.gjmatauang,
    gjkurs = EXCLUDED.gjkurs,
    gjdebit = EXCLUDED.gjdebit,
    gjdebitvalas = EXCLUDED.gjdebitvalas,
    gjkredit = EXCLUDED.gjkredit,
    gjkreditvalas = EXCLUDED.gjkreditvalas,
    gjjumlahbayar = EXCLUDED.gjjumlahbayar,
    gjjumlahbayarvalas = EXCLUDED.gjjumlahbayarvalas,
    gjstatusbayar = EXCLUDED.gjstatusbayar,
    gjtgllunas = EXCLUDED.gjtgllunas,
    gjstatus = EXCLUDED.gjstatus,
    gjstatussebelumnya = EXCLUDED.gjstatussebelumnya,
    gjjmlrevisi = EXCLUDED.gjjmlrevisi,
    gjcetakanke = EXCLUDED.gjcetakanke,
    gjisclose = EXCLUDED.gjisclose,
    gjposting = EXCLUDED.gjposting,
    gjpostingtgl = EXCLUDED.gjpostingtgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_gj_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_gj_detail'
)
INSERT INTO m2_gj_detail (
    idgjdetail, idgj, norek, matauang, kurs, debit, debitvalas, kredit, kreditvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idgjdetail, idgj, norek, matauang, kurs, debit, debitvalas, kredit, kreditvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idgjdetail', '')::bigint AS idgjdetail,
        NULLIF(row_payload ->> 'idgj', '')::bigint AS idgj,
        row_payload ->> 'norek' AS norek,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'debit' AS debit,
        row_payload ->> 'debitvalas' AS debitvalas,
        row_payload ->> 'kredit' AS kredit,
        row_payload ->> 'kreditvalas' AS kreditvalas,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idgjdetail') IS NOT NULL
) AS prepared
ON CONFLICT (idgjdetail) DO UPDATE
SET
    idgj = EXCLUDED.idgj,
    norek = EXCLUDED.norek,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    debit = EXCLUDED.debit,
    debitvalas = EXCLUDED.debitvalas,
    kredit = EXCLUDED.kredit,
    kreditvalas = EXCLUDED.kreditvalas,
    catatan = EXCLUDED.catatan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    urutan = EXCLUDED.urutan,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_gj_detail_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_gj_detail_history'
)
INSERT INTO m2_gj_detail_history (
    idgjdetailhistory, idgjhistory, idgjdetail, idgj, norek, matauang, kurs, debit, debitvalas, kredit, kreditvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idgjdetailhistory, idgjhistory, idgjdetail, idgj, norek, matauang, kurs, debit, debitvalas, kredit, kreditvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idgjdetailhistory', '')::bigint AS idgjdetailhistory,
        NULLIF(row_payload ->> 'idgjhistory', '')::bigint AS idgjhistory,
        NULLIF(row_payload ->> 'idgjdetail', '')::bigint AS idgjdetail,
        NULLIF(row_payload ->> 'idgj', '')::bigint AS idgj,
        row_payload ->> 'norek' AS norek,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'debit' AS debit,
        row_payload ->> 'debitvalas' AS debitvalas,
        row_payload ->> 'kredit' AS kredit,
        row_payload ->> 'kreditvalas' AS kreditvalas,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idhistorydetail') IS NOT NULL
) AS prepared
ON CONFLICT (idhistorydetail) DO UPDATE
SET
    idgjdetailhistory = EXCLUDED.idgjdetailhistory,
    idgjhistory = EXCLUDED.idgjhistory,
    idgjdetail = EXCLUDED.idgjdetail,
    idgj = EXCLUDED.idgj,
    norek = EXCLUDED.norek,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    debit = EXCLUDED.debit,
    debitvalas = EXCLUDED.debitvalas,
    kredit = EXCLUDED.kredit,
    kreditvalas = EXCLUDED.kreditvalas,
    catatan = EXCLUDED.catatan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    urutan = EXCLUDED.urutan,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_gj_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_gj_history'
)
INSERT INTO m2_gj_history (
    gjidhistory, gjid, gjcabang, gjlokasi, gjsumber, gjautonotransaksi, gjnotransaksi, gjtgl, gjkodepa, gjkontak, gjkontakperson, gjuraian, gjcatatan, gjmatauang, gjkurs, gjdebit, gjdebitvalas, gjkredit, gjkreditvalas, gjjumlahbayar, gjjumlahbayarvalas, gjstatusbayar, gjtgllunas, gjstatus, gjstatussebelumnya, gjjmlrevisi, gjcetakanke, gjisclose, gjposting, gjpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    gjidhistory, gjid, gjcabang, gjlokasi, gjsumber, gjautonotransaksi, gjnotransaksi, gjtgl, gjkodepa, gjkontak, gjkontakperson, gjuraian, gjcatatan, gjmatauang, gjkurs, gjdebit, gjdebitvalas, gjkredit, gjkreditvalas, gjjumlahbayar, gjjumlahbayarvalas, gjstatusbayar, gjtgllunas, gjstatus, gjstatussebelumnya, gjjmlrevisi, gjcetakanke, gjisclose, gjposting, gjpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'gjidhistory', '')::bigint AS gjidhistory,
        NULLIF(row_payload ->> 'gjid', '')::bigint AS gjid,
        row_payload ->> 'gjcabang' AS gjcabang,
        row_payload ->> 'gjlokasi' AS gjlokasi,
        row_payload ->> 'gjsumber' AS gjsumber,
        row_payload ->> 'gjautonotransaksi' AS gjautonotransaksi,
        row_payload ->> 'gjnotransaksi' AS gjnotransaksi,
        NULLIF(row_payload ->> 'gjtgl', '')::timestamptz AS gjtgl,
        row_payload ->> 'gjkodepa' AS gjkodepa,
        row_payload ->> 'gjkontak' AS gjkontak,
        row_payload ->> 'gjkontakperson' AS gjkontakperson,
        row_payload ->> 'gjuraian' AS gjuraian,
        row_payload ->> 'gjcatatan' AS gjcatatan,
        row_payload ->> 'gjmatauang' AS gjmatauang,
        NULLIF(row_payload ->> 'gjkurs', '')::numeric(20,6) AS gjkurs,
        row_payload ->> 'gjdebit' AS gjdebit,
        row_payload ->> 'gjdebitvalas' AS gjdebitvalas,
        row_payload ->> 'gjkredit' AS gjkredit,
        row_payload ->> 'gjkreditvalas' AS gjkreditvalas,
        row_payload ->> 'gjjumlahbayar' AS gjjumlahbayar,
        row_payload ->> 'gjjumlahbayarvalas' AS gjjumlahbayarvalas,
        row_payload ->> 'gjstatusbayar' AS gjstatusbayar,
        NULLIF(row_payload ->> 'gjtgllunas', '')::timestamptz AS gjtgllunas,
        row_payload ->> 'gjstatus' AS gjstatus,
        row_payload ->> 'gjstatussebelumnya' AS gjstatussebelumnya,
        NULLIF(row_payload ->> 'gjjmlrevisi', '')::numeric(20,6) AS gjjmlrevisi,
        row_payload ->> 'gjcetakanke' AS gjcetakanke,
        NULLIF(row_payload ->> 'gjisclose', '')::bigint AS gjisclose,
        NULLIF(row_payload ->> 'gjposting', '')::bigint AS gjposting,
        NULLIF(row_payload ->> 'gjpostingtgl', '')::timestamptz AS gjpostingtgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'gjidhistory') IS NOT NULL
) AS prepared
ON CONFLICT (gjidhistory) DO UPDATE
SET
    gjid = EXCLUDED.gjid,
    gjcabang = EXCLUDED.gjcabang,
    gjlokasi = EXCLUDED.gjlokasi,
    gjsumber = EXCLUDED.gjsumber,
    gjautonotransaksi = EXCLUDED.gjautonotransaksi,
    gjnotransaksi = EXCLUDED.gjnotransaksi,
    gjtgl = EXCLUDED.gjtgl,
    gjkodepa = EXCLUDED.gjkodepa,
    gjkontak = EXCLUDED.gjkontak,
    gjkontakperson = EXCLUDED.gjkontakperson,
    gjuraian = EXCLUDED.gjuraian,
    gjcatatan = EXCLUDED.gjcatatan,
    gjmatauang = EXCLUDED.gjmatauang,
    gjkurs = EXCLUDED.gjkurs,
    gjdebit = EXCLUDED.gjdebit,
    gjdebitvalas = EXCLUDED.gjdebitvalas,
    gjkredit = EXCLUDED.gjkredit,
    gjkreditvalas = EXCLUDED.gjkreditvalas,
    gjjumlahbayar = EXCLUDED.gjjumlahbayar,
    gjjumlahbayarvalas = EXCLUDED.gjjumlahbayarvalas,
    gjstatusbayar = EXCLUDED.gjstatusbayar,
    gjtgllunas = EXCLUDED.gjtgllunas,
    gjstatus = EXCLUDED.gjstatus,
    gjstatussebelumnya = EXCLUDED.gjstatussebelumnya,
    gjjmlrevisi = EXCLUDED.gjjmlrevisi,
    gjcetakanke = EXCLUDED.gjcetakanke,
    gjisclose = EXCLUDED.gjisclose,
    gjposting = EXCLUDED.gjposting,
    gjpostingtgl = EXCLUDED.gjpostingtgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_giro_list
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_giro_list'
)
INSERT INTO m2_giro_list (
    glnogiro, glsumber, glidtransaksi, glnotransaksi, glkontak, glrekbank, glrekgiro, gljenis, glbank, glnoacbank, glmatauang, glkurs, gljumlah, gljumlahvalas, gltgljthtempo, gltglcair, glstatus, glstatussebelumnya, glurutan, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    glnogiro, glsumber, glidtransaksi, glnotransaksi, glkontak, glrekbank, glrekgiro, gljenis, glbank, glnoacbank, glmatauang, glkurs, gljumlah, gljumlahvalas, gltgljthtempo, gltglcair, glstatus, glstatussebelumnya, glurutan, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'glnogiro' AS glnogiro,
        row_payload ->> 'glsumber' AS glsumber,
        NULLIF(row_payload ->> 'glidtransaksi', '')::bigint AS glidtransaksi,
        row_payload ->> 'glnotransaksi' AS glnotransaksi,
        row_payload ->> 'glkontak' AS glkontak,
        row_payload ->> 'glrekbank' AS glrekbank,
        row_payload ->> 'glrekgiro' AS glrekgiro,
        row_payload ->> 'gljenis' AS gljenis,
        row_payload ->> 'glbank' AS glbank,
        row_payload ->> 'glnoacbank' AS glnoacbank,
        row_payload ->> 'glmatauang' AS glmatauang,
        NULLIF(row_payload ->> 'glkurs', '')::numeric(20,6) AS glkurs,
        row_payload ->> 'gljumlah' AS gljumlah,
        row_payload ->> 'gljumlahvalas' AS gljumlahvalas,
        NULLIF(row_payload ->> 'gltgljthtempo', '')::timestamptz AS gltgljthtempo,
        NULLIF(row_payload ->> 'gltglcair', '')::timestamptz AS gltglcair,
        row_payload ->> 'glstatus' AS glstatus,
        row_payload ->> 'glstatussebelumnya' AS glstatussebelumnya,
        row_payload ->> 'glurutan' AS glurutan,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'glsumber') IS NOT NULL AND (row_payload ->> 'glidtransaksi') IS NOT NULL AND (row_payload ->> 'glnogiro') IS NOT NULL AND (row_payload ->> 'glurutan') IS NOT NULL
) AS prepared
ON CONFLICT (glsumber, glidtransaksi, glnogiro, glurutan) DO UPDATE
SET
    glnotransaksi = EXCLUDED.glnotransaksi,
    glkontak = EXCLUDED.glkontak,
    glrekbank = EXCLUDED.glrekbank,
    glrekgiro = EXCLUDED.glrekgiro,
    gljenis = EXCLUDED.gljenis,
    glbank = EXCLUDED.glbank,
    glnoacbank = EXCLUDED.glnoacbank,
    glmatauang = EXCLUDED.glmatauang,
    glkurs = EXCLUDED.glkurs,
    gljumlah = EXCLUDED.gljumlah,
    gljumlahvalas = EXCLUDED.gljumlahvalas,
    gltgljthtempo = EXCLUDED.gltgljthtempo,
    gltglcair = EXCLUDED.gltglcair,
    glstatus = EXCLUDED.glstatus,
    glstatussebelumnya = EXCLUDED.glstatussebelumnya,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_jm
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_jm'
)
INSERT INTO m2_jm (
    jmid, jmcabang, jmlokasi, jmsumber, jmautonotransaksi, jmnotransaksi, jmtgl, jmkodepa, jmkontakperson, jmuraian, jmcatatan, jmmatauang, jmkurs, jmdebit, jmdebitvalas, jmkredit, jmkreditvalas, jmjumlahbayar, jmjumlahbayarvalas, jmstatusbayar, jmtgllunas, jmstatus, jmstatussebelumnya, jmjmlrevisi, jmcetakanke, jmisclose, jmposting, jmpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    jmid, jmcabang, jmlokasi, jmsumber, jmautonotransaksi, jmnotransaksi, jmtgl, jmkodepa, jmkontakperson, jmuraian, jmcatatan, jmmatauang, jmkurs, jmdebit, jmdebitvalas, jmkredit, jmkreditvalas, jmjumlahbayar, jmjumlahbayarvalas, jmstatusbayar, jmtgllunas, jmstatus, jmstatussebelumnya, jmjmlrevisi, jmcetakanke, jmisclose, jmposting, jmpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'jmid', '')::bigint AS jmid,
        row_payload ->> 'jmcabang' AS jmcabang,
        NULLIF(row_payload ->> 'jmlokasi', '')::numeric(20,6) AS jmlokasi,
        row_payload ->> 'jmsumber' AS jmsumber,
        row_payload ->> 'jmautonotransaksi' AS jmautonotransaksi,
        row_payload ->> 'jmnotransaksi' AS jmnotransaksi,
        NULLIF(row_payload ->> 'jmtgl', '')::timestamptz AS jmtgl,
        row_payload ->> 'jmkodepa' AS jmkodepa,
        row_payload ->> 'jmkontakperson' AS jmkontakperson,
        row_payload ->> 'jmuraian' AS jmuraian,
        row_payload ->> 'jmcatatan' AS jmcatatan,
        row_payload ->> 'jmmatauang' AS jmmatauang,
        NULLIF(row_payload ->> 'jmkurs', '')::numeric(20,6) AS jmkurs,
        row_payload ->> 'jmdebit' AS jmdebit,
        row_payload ->> 'jmdebitvalas' AS jmdebitvalas,
        row_payload ->> 'jmkredit' AS jmkredit,
        row_payload ->> 'jmkreditvalas' AS jmkreditvalas,
        row_payload ->> 'jmjumlahbayar' AS jmjumlahbayar,
        row_payload ->> 'jmjumlahbayarvalas' AS jmjumlahbayarvalas,
        row_payload ->> 'jmstatusbayar' AS jmstatusbayar,
        NULLIF(row_payload ->> 'jmtgllunas', '')::timestamptz AS jmtgllunas,
        row_payload ->> 'jmstatus' AS jmstatus,
        row_payload ->> 'jmstatussebelumnya' AS jmstatussebelumnya,
        NULLIF(row_payload ->> 'jmjmlrevisi', '')::numeric(20,6) AS jmjmlrevisi,
        row_payload ->> 'jmcetakanke' AS jmcetakanke,
        NULLIF(row_payload ->> 'jmisclose', '')::bigint AS jmisclose,
        NULLIF(row_payload ->> 'jmposting', '')::bigint AS jmposting,
        NULLIF(row_payload ->> 'jmpostingtgl', '')::timestamptz AS jmpostingtgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'jmid') IS NOT NULL
) AS prepared
ON CONFLICT (jmid) DO UPDATE
SET
    jmcabang = EXCLUDED.jmcabang,
    jmlokasi = EXCLUDED.jmlokasi,
    jmsumber = EXCLUDED.jmsumber,
    jmautonotransaksi = EXCLUDED.jmautonotransaksi,
    jmnotransaksi = EXCLUDED.jmnotransaksi,
    jmtgl = EXCLUDED.jmtgl,
    jmkodepa = EXCLUDED.jmkodepa,
    jmkontakperson = EXCLUDED.jmkontakperson,
    jmuraian = EXCLUDED.jmuraian,
    jmcatatan = EXCLUDED.jmcatatan,
    jmmatauang = EXCLUDED.jmmatauang,
    jmkurs = EXCLUDED.jmkurs,
    jmdebit = EXCLUDED.jmdebit,
    jmdebitvalas = EXCLUDED.jmdebitvalas,
    jmkredit = EXCLUDED.jmkredit,
    jmkreditvalas = EXCLUDED.jmkreditvalas,
    jmjumlahbayar = EXCLUDED.jmjumlahbayar,
    jmjumlahbayarvalas = EXCLUDED.jmjumlahbayarvalas,
    jmstatusbayar = EXCLUDED.jmstatusbayar,
    jmtgllunas = EXCLUDED.jmtgllunas,
    jmstatus = EXCLUDED.jmstatus,
    jmstatussebelumnya = EXCLUDED.jmstatussebelumnya,
    jmjmlrevisi = EXCLUDED.jmjmlrevisi,
    jmcetakanke = EXCLUDED.jmcetakanke,
    jmisclose = EXCLUDED.jmisclose,
    jmposting = EXCLUDED.jmposting,
    jmpostingtgl = EXCLUDED.jmpostingtgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_jm_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_jm_detail'
)
INSERT INTO m2_jm_detail (
    idjmdetail, idjm, kontak, norek, matauang, kurs, debit, debitvalas, kredit, kreditvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idjmdetail, idjm, kontak, norek, matauang, kurs, debit, debitvalas, kredit, kreditvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idjmdetail', '')::bigint AS idjmdetail,
        NULLIF(row_payload ->> 'idjm', '')::bigint AS idjm,
        row_payload ->> 'kontak' AS kontak,
        row_payload ->> 'norek' AS norek,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'debit' AS debit,
        row_payload ->> 'debitvalas' AS debitvalas,
        row_payload ->> 'kredit' AS kredit,
        row_payload ->> 'kreditvalas' AS kreditvalas,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idjmdetail') IS NOT NULL
) AS prepared
ON CONFLICT (idjmdetail) DO UPDATE
SET
    idjm = EXCLUDED.idjm,
    kontak = EXCLUDED.kontak,
    norek = EXCLUDED.norek,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    debit = EXCLUDED.debit,
    debitvalas = EXCLUDED.debitvalas,
    kredit = EXCLUDED.kredit,
    kreditvalas = EXCLUDED.kreditvalas,
    catatan = EXCLUDED.catatan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    urutan = EXCLUDED.urutan,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_jm_detail_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_jm_detail_history'
)
INSERT INTO m2_jm_detail_history (
    idjmdetailhistory, idjmhistory, idjmdetail, idjm, kontak, norek, matauang, kurs, debit, debitvalas, kredit, kreditvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idjmdetailhistory, idjmhistory, idjmdetail, idjm, kontak, norek, matauang, kurs, debit, debitvalas, kredit, kreditvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idjmdetailhistory', '')::bigint AS idjmdetailhistory,
        NULLIF(row_payload ->> 'idjmhistory', '')::bigint AS idjmhistory,
        NULLIF(row_payload ->> 'idjmdetail', '')::bigint AS idjmdetail,
        NULLIF(row_payload ->> 'idjm', '')::bigint AS idjm,
        row_payload ->> 'kontak' AS kontak,
        row_payload ->> 'norek' AS norek,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'debit' AS debit,
        row_payload ->> 'debitvalas' AS debitvalas,
        row_payload ->> 'kredit' AS kredit,
        row_payload ->> 'kreditvalas' AS kreditvalas,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idhistorydetail') IS NOT NULL
) AS prepared
ON CONFLICT (idhistorydetail) DO UPDATE
SET
    idjmdetailhistory = EXCLUDED.idjmdetailhistory,
    idjmhistory = EXCLUDED.idjmhistory,
    idjmdetail = EXCLUDED.idjmdetail,
    idjm = EXCLUDED.idjm,
    kontak = EXCLUDED.kontak,
    norek = EXCLUDED.norek,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    debit = EXCLUDED.debit,
    debitvalas = EXCLUDED.debitvalas,
    kredit = EXCLUDED.kredit,
    kreditvalas = EXCLUDED.kreditvalas,
    catatan = EXCLUDED.catatan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    urutan = EXCLUDED.urutan,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_jm_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_jm_history'
)
INSERT INTO m2_jm_history (
    jmidhistory, jmid, jmcabang, jmlokasi, jmsumber, jmautonotransaksi, jmnotransaksi, jmtgl, jmkodepa, jmkontakperson, jmuraian, jmcatatan, jmmatauang, jmkurs, jmdebit, jmdebitvalas, jmkredit, jmkreditvalas, jmjumlahbayar, jmjumlahbayarvalas, jmstatusbayar, jmtgllunas, jmstatus, jmstatussebelumnya, jmjmlrevisi, jmcetakanke, jmisclose, jmposting, jmpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    jmidhistory, jmid, jmcabang, jmlokasi, jmsumber, jmautonotransaksi, jmnotransaksi, jmtgl, jmkodepa, jmkontakperson, jmuraian, jmcatatan, jmmatauang, jmkurs, jmdebit, jmdebitvalas, jmkredit, jmkreditvalas, jmjumlahbayar, jmjumlahbayarvalas, jmstatusbayar, jmtgllunas, jmstatus, jmstatussebelumnya, jmjmlrevisi, jmcetakanke, jmisclose, jmposting, jmpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'jmidhistory', '')::bigint AS jmidhistory,
        NULLIF(row_payload ->> 'jmid', '')::bigint AS jmid,
        row_payload ->> 'jmcabang' AS jmcabang,
        NULLIF(row_payload ->> 'jmlokasi', '')::numeric(20,6) AS jmlokasi,
        row_payload ->> 'jmsumber' AS jmsumber,
        row_payload ->> 'jmautonotransaksi' AS jmautonotransaksi,
        row_payload ->> 'jmnotransaksi' AS jmnotransaksi,
        NULLIF(row_payload ->> 'jmtgl', '')::timestamptz AS jmtgl,
        row_payload ->> 'jmkodepa' AS jmkodepa,
        row_payload ->> 'jmkontakperson' AS jmkontakperson,
        row_payload ->> 'jmuraian' AS jmuraian,
        row_payload ->> 'jmcatatan' AS jmcatatan,
        row_payload ->> 'jmmatauang' AS jmmatauang,
        NULLIF(row_payload ->> 'jmkurs', '')::numeric(20,6) AS jmkurs,
        row_payload ->> 'jmdebit' AS jmdebit,
        row_payload ->> 'jmdebitvalas' AS jmdebitvalas,
        row_payload ->> 'jmkredit' AS jmkredit,
        row_payload ->> 'jmkreditvalas' AS jmkreditvalas,
        row_payload ->> 'jmjumlahbayar' AS jmjumlahbayar,
        row_payload ->> 'jmjumlahbayarvalas' AS jmjumlahbayarvalas,
        row_payload ->> 'jmstatusbayar' AS jmstatusbayar,
        NULLIF(row_payload ->> 'jmtgllunas', '')::timestamptz AS jmtgllunas,
        row_payload ->> 'jmstatus' AS jmstatus,
        row_payload ->> 'jmstatussebelumnya' AS jmstatussebelumnya,
        NULLIF(row_payload ->> 'jmjmlrevisi', '')::numeric(20,6) AS jmjmlrevisi,
        row_payload ->> 'jmcetakanke' AS jmcetakanke,
        NULLIF(row_payload ->> 'jmisclose', '')::bigint AS jmisclose,
        NULLIF(row_payload ->> 'jmposting', '')::bigint AS jmposting,
        NULLIF(row_payload ->> 'jmpostingtgl', '')::timestamptz AS jmpostingtgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'jmidhistory') IS NOT NULL
) AS prepared
ON CONFLICT (jmidhistory) DO UPDATE
SET
    jmid = EXCLUDED.jmid,
    jmcabang = EXCLUDED.jmcabang,
    jmlokasi = EXCLUDED.jmlokasi,
    jmsumber = EXCLUDED.jmsumber,
    jmautonotransaksi = EXCLUDED.jmautonotransaksi,
    jmnotransaksi = EXCLUDED.jmnotransaksi,
    jmtgl = EXCLUDED.jmtgl,
    jmkodepa = EXCLUDED.jmkodepa,
    jmkontakperson = EXCLUDED.jmkontakperson,
    jmuraian = EXCLUDED.jmuraian,
    jmcatatan = EXCLUDED.jmcatatan,
    jmmatauang = EXCLUDED.jmmatauang,
    jmkurs = EXCLUDED.jmkurs,
    jmdebit = EXCLUDED.jmdebit,
    jmdebitvalas = EXCLUDED.jmdebitvalas,
    jmkredit = EXCLUDED.jmkredit,
    jmkreditvalas = EXCLUDED.jmkreditvalas,
    jmjumlahbayar = EXCLUDED.jmjumlahbayar,
    jmjumlahbayarvalas = EXCLUDED.jmjumlahbayarvalas,
    jmstatusbayar = EXCLUDED.jmstatusbayar,
    jmtgllunas = EXCLUDED.jmtgllunas,
    jmstatus = EXCLUDED.jmstatus,
    jmstatussebelumnya = EXCLUDED.jmstatussebelumnya,
    jmjmlrevisi = EXCLUDED.jmjmlrevisi,
    jmcetakanke = EXCLUDED.jmcetakanke,
    jmisclose = EXCLUDED.jmisclose,
    jmposting = EXCLUDED.jmposting,
    jmpostingtgl = EXCLUDED.jmpostingtgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_notes
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_notes'
)
INSERT INTO m2_notes (
    nid, nsumber, nidtransaksi, ncatatan, ninputuser, ninputtgl, nmodifikasiuser, nmodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    nid, nsumber, nidtransaksi, ncatatan, ninputuser, ninputtgl, nmodifikasiuser, nmodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'nid', '')::bigint AS nid,
        row_payload ->> 'nsumber' AS nsumber,
        NULLIF(row_payload ->> 'nidtransaksi', '')::bigint AS nidtransaksi,
        row_payload ->> 'ncatatan' AS ncatatan,
        row_payload ->> 'ninputuser' AS ninputuser,
        NULLIF(row_payload ->> 'ninputtgl', '')::timestamptz AS ninputtgl,
        row_payload ->> 'nmodifikasiuser' AS nmodifikasiuser,
        NULLIF(row_payload ->> 'nmodifikasitgl', '')::timestamptz AS nmodifikasitgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'nid') IS NOT NULL
) AS prepared
ON CONFLICT (nid) DO UPDATE
SET
    nsumber = EXCLUDED.nsumber,
    nidtransaksi = EXCLUDED.nidtransaksi,
    ncatatan = EXCLUDED.ncatatan,
    ninputuser = EXCLUDED.ninputuser,
    ninputtgl = EXCLUDED.ninputtgl,
    nmodifikasiuser = EXCLUDED.nmodifikasiuser,
    nmodifikasitgl = EXCLUDED.nmodifikasitgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_realization
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_realization'
)
INSERT INTO m2_realization (
    rtahun, rbulan, rnorek, rjmldebit, rjmlkredit, ranggaran, rkodepa, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    rtahun, rbulan, rnorek, rjmldebit, rjmlkredit, ranggaran, rkodepa, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        row_payload ->> 'rtahun' AS rtahun,
        row_payload ->> 'rbulan' AS rbulan,
        row_payload ->> 'rnorek' AS rnorek,
        NULLIF(row_payload ->> 'rjmldebit', '')::numeric(20,6) AS rjmldebit,
        NULLIF(row_payload ->> 'rjmlkredit', '')::numeric(20,6) AS rjmlkredit,
        row_payload ->> 'ranggaran' AS ranggaran,
        row_payload ->> 'rkodepa' AS rkodepa,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'rtahun') IS NOT NULL AND (row_payload ->> 'rbulan') IS NOT NULL AND (row_payload ->> 'rnorek') IS NOT NULL AND (row_payload ->> 'rkodepa') IS NOT NULL
) AS prepared
ON CONFLICT (rtahun, rbulan, rnorek, rkodepa) DO UPDATE
SET
    rjmldebit = EXCLUDED.rjmldebit,
    rjmlkredit = EXCLUDED.rjmlkredit,
    ranggaran = EXCLUDED.ranggaran,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_rm
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_rm'
)
INSERT INTO m2_rm (
    rmid, rmcabang, rmlokasi, rmsumber, rmautonotransaksi, rmnotransaksi, rmtgl, rmkodepa, rmcarabayar, rmkontak, rmkontakperson, rmnorek, rmuraian, rmcatatan, rmmatauang, rmkurs, rmjumlah, rmjumlahvalas, rmjumlahbayar, rmjumlahbayarvalas, rmstatusbayar, rmtgllunas, rmstatus, rmstatussebelumnya, rmjmlrevisi, rmcetakanke, rmisclose, rmposting, rmpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    rmid, rmcabang, rmlokasi, rmsumber, rmautonotransaksi, rmnotransaksi, rmtgl, rmkodepa, rmcarabayar, rmkontak, rmkontakperson, rmnorek, rmuraian, rmcatatan, rmmatauang, rmkurs, rmjumlah, rmjumlahvalas, rmjumlahbayar, rmjumlahbayarvalas, rmstatusbayar, rmtgllunas, rmstatus, rmstatussebelumnya, rmjmlrevisi, rmcetakanke, rmisclose, rmposting, rmpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'rmid', '')::bigint AS rmid,
        row_payload ->> 'rmcabang' AS rmcabang,
        row_payload ->> 'rmlokasi' AS rmlokasi,
        row_payload ->> 'rmsumber' AS rmsumber,
        row_payload ->> 'rmautonotransaksi' AS rmautonotransaksi,
        row_payload ->> 'rmnotransaksi' AS rmnotransaksi,
        NULLIF(row_payload ->> 'rmtgl', '')::timestamptz AS rmtgl,
        row_payload ->> 'rmkodepa' AS rmkodepa,
        row_payload ->> 'rmcarabayar' AS rmcarabayar,
        row_payload ->> 'rmkontak' AS rmkontak,
        row_payload ->> 'rmkontakperson' AS rmkontakperson,
        row_payload ->> 'rmnorek' AS rmnorek,
        row_payload ->> 'rmuraian' AS rmuraian,
        row_payload ->> 'rmcatatan' AS rmcatatan,
        row_payload ->> 'rmmatauang' AS rmmatauang,
        NULLIF(row_payload ->> 'rmkurs', '')::numeric(20,6) AS rmkurs,
        row_payload ->> 'rmjumlah' AS rmjumlah,
        row_payload ->> 'rmjumlahvalas' AS rmjumlahvalas,
        row_payload ->> 'rmjumlahbayar' AS rmjumlahbayar,
        row_payload ->> 'rmjumlahbayarvalas' AS rmjumlahbayarvalas,
        row_payload ->> 'rmstatusbayar' AS rmstatusbayar,
        NULLIF(row_payload ->> 'rmtgllunas', '')::timestamptz AS rmtgllunas,
        row_payload ->> 'rmstatus' AS rmstatus,
        row_payload ->> 'rmstatussebelumnya' AS rmstatussebelumnya,
        NULLIF(row_payload ->> 'rmjmlrevisi', '')::numeric(20,6) AS rmjmlrevisi,
        row_payload ->> 'rmcetakanke' AS rmcetakanke,
        NULLIF(row_payload ->> 'rmisclose', '')::bigint AS rmisclose,
        NULLIF(row_payload ->> 'rmposting', '')::bigint AS rmposting,
        NULLIF(row_payload ->> 'rmpostingtgl', '')::timestamptz AS rmpostingtgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'rmid') IS NOT NULL
) AS prepared
ON CONFLICT (rmid) DO UPDATE
SET
    rmcabang = EXCLUDED.rmcabang,
    rmlokasi = EXCLUDED.rmlokasi,
    rmsumber = EXCLUDED.rmsumber,
    rmautonotransaksi = EXCLUDED.rmautonotransaksi,
    rmnotransaksi = EXCLUDED.rmnotransaksi,
    rmtgl = EXCLUDED.rmtgl,
    rmkodepa = EXCLUDED.rmkodepa,
    rmcarabayar = EXCLUDED.rmcarabayar,
    rmkontak = EXCLUDED.rmkontak,
    rmkontakperson = EXCLUDED.rmkontakperson,
    rmnorek = EXCLUDED.rmnorek,
    rmuraian = EXCLUDED.rmuraian,
    rmcatatan = EXCLUDED.rmcatatan,
    rmmatauang = EXCLUDED.rmmatauang,
    rmkurs = EXCLUDED.rmkurs,
    rmjumlah = EXCLUDED.rmjumlah,
    rmjumlahvalas = EXCLUDED.rmjumlahvalas,
    rmjumlahbayar = EXCLUDED.rmjumlahbayar,
    rmjumlahbayarvalas = EXCLUDED.rmjumlahbayarvalas,
    rmstatusbayar = EXCLUDED.rmstatusbayar,
    rmtgllunas = EXCLUDED.rmtgllunas,
    rmstatus = EXCLUDED.rmstatus,
    rmstatussebelumnya = EXCLUDED.rmstatussebelumnya,
    rmjmlrevisi = EXCLUDED.rmjmlrevisi,
    rmcetakanke = EXCLUDED.rmcetakanke,
    rmisclose = EXCLUDED.rmisclose,
    rmposting = EXCLUDED.rmposting,
    rmpostingtgl = EXCLUDED.rmpostingtgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_rm_pay
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_rm_pay'
)
INSERT INTO m2_rm_pay (
    idrmcarabayar, idrm, carabayar, matauang, kurs, jumlah, jumlahvalas, nogiro, tgljt, bank, noacbank, rekbank, rekgiro, catatan, urutan, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idrmcarabayar, idrm, carabayar, matauang, kurs, jumlah, jumlahvalas, nogiro, tgljt, bank, noacbank, rekbank, rekgiro, catatan, urutan, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idrmcarabayar', '')::bigint AS idrmcarabayar,
        NULLIF(row_payload ->> 'idrm', '')::bigint AS idrm,
        row_payload ->> 'carabayar' AS carabayar,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'jumlah' AS jumlah,
        row_payload ->> 'jumlahvalas' AS jumlahvalas,
        row_payload ->> 'nogiro' AS nogiro,
        NULLIF(row_payload ->> 'tgljt', '')::timestamptz AS tgljt,
        row_payload ->> 'bank' AS bank,
        row_payload ->> 'noacbank' AS noacbank,
        row_payload ->> 'rekbank' AS rekbank,
        row_payload ->> 'rekgiro' AS rekgiro,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idrmcarabayar') IS NOT NULL
) AS prepared
ON CONFLICT (idrmcarabayar) DO UPDATE
SET
    idrm = EXCLUDED.idrm,
    carabayar = EXCLUDED.carabayar,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    jumlah = EXCLUDED.jumlah,
    jumlahvalas = EXCLUDED.jumlahvalas,
    nogiro = EXCLUDED.nogiro,
    tgljt = EXCLUDED.tgljt,
    bank = EXCLUDED.bank,
    noacbank = EXCLUDED.noacbank,
    rekbank = EXCLUDED.rekbank,
    rekgiro = EXCLUDED.rekgiro,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_rm_pay_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_rm_pay_history'
)
INSERT INTO m2_rm_pay_history (
    idrmcarabayarhistory, idrmhistory, idrmcarabayar, idrm, carabayar, matauang, kurs, jumlah, jumlahvalas, nogiro, tgljt, bank, noacbank, rekbank, rekgiro, catatan, urutan, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idrmcarabayarhistory, idrmhistory, idrmcarabayar, idrm, carabayar, matauang, kurs, jumlah, jumlahvalas, nogiro, tgljt, bank, noacbank, rekbank, rekgiro, catatan, urutan, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idrmcarabayarhistory', '')::bigint AS idrmcarabayarhistory,
        NULLIF(row_payload ->> 'idrmhistory', '')::bigint AS idrmhistory,
        NULLIF(row_payload ->> 'idrmcarabayar', '')::bigint AS idrmcarabayar,
        NULLIF(row_payload ->> 'idrm', '')::bigint AS idrm,
        row_payload ->> 'carabayar' AS carabayar,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'jumlah' AS jumlah,
        row_payload ->> 'jumlahvalas' AS jumlahvalas,
        row_payload ->> 'nogiro' AS nogiro,
        NULLIF(row_payload ->> 'tgljt', '')::timestamptz AS tgljt,
        row_payload ->> 'bank' AS bank,
        row_payload ->> 'noacbank' AS noacbank,
        row_payload ->> 'rekbank' AS rekbank,
        row_payload ->> 'rekgiro' AS rekgiro,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idrmcarabayarhistory') IS NOT NULL
) AS prepared
ON CONFLICT (idrmcarabayarhistory) DO UPDATE
SET
    idrmhistory = EXCLUDED.idrmhistory,
    idrmcarabayar = EXCLUDED.idrmcarabayar,
    idrm = EXCLUDED.idrm,
    carabayar = EXCLUDED.carabayar,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    jumlah = EXCLUDED.jumlah,
    jumlahvalas = EXCLUDED.jumlahvalas,
    nogiro = EXCLUDED.nogiro,
    tgljt = EXCLUDED.tgljt,
    bank = EXCLUDED.bank,
    noacbank = EXCLUDED.noacbank,
    rekbank = EXCLUDED.rekbank,
    rekgiro = EXCLUDED.rekgiro,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_rm_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_rm_detail'
)
INSERT INTO m2_rm_detail (
    idrmdetail, idrm, norek, matauang, kurs, jumlah, jumlahvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idrmdetail, idrm, norek, matauang, kurs, jumlah, jumlahvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idrmdetail', '')::bigint AS idrmdetail,
        NULLIF(row_payload ->> 'idrm', '')::bigint AS idrm,
        row_payload ->> 'norek' AS norek,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'jumlah' AS jumlah,
        row_payload ->> 'jumlahvalas' AS jumlahvalas,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idrmdetail') IS NOT NULL
) AS prepared
ON CONFLICT (idrmdetail) DO UPDATE
SET
    idrm = EXCLUDED.idrm,
    norek = EXCLUDED.norek,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    jumlah = EXCLUDED.jumlah,
    jumlahvalas = EXCLUDED.jumlahvalas,
    catatan = EXCLUDED.catatan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    urutan = EXCLUDED.urutan,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_rm_detail_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_rm_detail_history'
)
INSERT INTO m2_rm_detail_history (
    idrmdetailhistory, idrmhistory, idrmdetail, idrm, norek, matauang, kurs, jumlah, jumlahvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idrmdetailhistory, idrmhistory, idrmdetail, idrm, norek, matauang, kurs, jumlah, jumlahvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idrmdetailhistory', '')::bigint AS idrmdetailhistory,
        NULLIF(row_payload ->> 'idrmhistory', '')::bigint AS idrmhistory,
        NULLIF(row_payload ->> 'idrmdetail', '')::bigint AS idrmdetail,
        NULLIF(row_payload ->> 'idrm', '')::bigint AS idrm,
        row_payload ->> 'norek' AS norek,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'jumlah' AS jumlah,
        row_payload ->> 'jumlahvalas' AS jumlahvalas,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idhistorydetail') IS NOT NULL
) AS prepared
ON CONFLICT (idhistorydetail) DO UPDATE
SET
    idrmdetailhistory = EXCLUDED.idrmdetailhistory,
    idrmhistory = EXCLUDED.idrmhistory,
    idrmdetail = EXCLUDED.idrmdetail,
    idrm = EXCLUDED.idrm,
    norek = EXCLUDED.norek,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    jumlah = EXCLUDED.jumlah,
    jumlahvalas = EXCLUDED.jumlahvalas,
    catatan = EXCLUDED.catatan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    urutan = EXCLUDED.urutan,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_rm_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_rm_history'
)
INSERT INTO m2_rm_history (
    rmidhistory, rmid, rmcabang, rmlokasi, rmsumber, rmautonotransaksi, rmnotransaksi, rmtgl, rmkodepa, rmcarabayar, rmkontak, rmkontakperson, rmnorek, rmuraian, rmcatatan, rmmatauang, rmkurs, rmjumlah, rmjumlahvalas, rmjumlahbayar, rmjumlahbayarvalas, rmstatusbayar, rmtgllunas, rmstatus, rmstatussebelumnya, rmjmlrevisi, rmcetakanke, rmisclose, rmposting, rmpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    rmidhistory, rmid, rmcabang, rmlokasi, rmsumber, rmautonotransaksi, rmnotransaksi, rmtgl, rmkodepa, rmcarabayar, rmkontak, rmkontakperson, rmnorek, rmuraian, rmcatatan, rmmatauang, rmkurs, rmjumlah, rmjumlahvalas, rmjumlahbayar, rmjumlahbayarvalas, rmstatusbayar, rmtgllunas, rmstatus, rmstatussebelumnya, rmjmlrevisi, rmcetakanke, rmisclose, rmposting, rmpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'rmidhistory', '')::bigint AS rmidhistory,
        NULLIF(row_payload ->> 'rmid', '')::bigint AS rmid,
        row_payload ->> 'rmcabang' AS rmcabang,
        row_payload ->> 'rmlokasi' AS rmlokasi,
        row_payload ->> 'rmsumber' AS rmsumber,
        row_payload ->> 'rmautonotransaksi' AS rmautonotransaksi,
        row_payload ->> 'rmnotransaksi' AS rmnotransaksi,
        NULLIF(row_payload ->> 'rmtgl', '')::timestamptz AS rmtgl,
        row_payload ->> 'rmkodepa' AS rmkodepa,
        row_payload ->> 'rmcarabayar' AS rmcarabayar,
        row_payload ->> 'rmkontak' AS rmkontak,
        row_payload ->> 'rmkontakperson' AS rmkontakperson,
        row_payload ->> 'rmnorek' AS rmnorek,
        row_payload ->> 'rmuraian' AS rmuraian,
        row_payload ->> 'rmcatatan' AS rmcatatan,
        row_payload ->> 'rmmatauang' AS rmmatauang,
        NULLIF(row_payload ->> 'rmkurs', '')::numeric(20,6) AS rmkurs,
        row_payload ->> 'rmjumlah' AS rmjumlah,
        row_payload ->> 'rmjumlahvalas' AS rmjumlahvalas,
        row_payload ->> 'rmjumlahbayar' AS rmjumlahbayar,
        row_payload ->> 'rmjumlahbayarvalas' AS rmjumlahbayarvalas,
        row_payload ->> 'rmstatusbayar' AS rmstatusbayar,
        NULLIF(row_payload ->> 'rmtgllunas', '')::timestamptz AS rmtgllunas,
        row_payload ->> 'rmstatus' AS rmstatus,
        row_payload ->> 'rmstatussebelumnya' AS rmstatussebelumnya,
        NULLIF(row_payload ->> 'rmjmlrevisi', '')::numeric(20,6) AS rmjmlrevisi,
        row_payload ->> 'rmcetakanke' AS rmcetakanke,
        NULLIF(row_payload ->> 'rmisclose', '')::bigint AS rmisclose,
        NULLIF(row_payload ->> 'rmposting', '')::bigint AS rmposting,
        NULLIF(row_payload ->> 'rmpostingtgl', '')::timestamptz AS rmpostingtgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'rmidhistory') IS NOT NULL
) AS prepared
ON CONFLICT (rmidhistory) DO UPDATE
SET
    rmid = EXCLUDED.rmid,
    rmcabang = EXCLUDED.rmcabang,
    rmlokasi = EXCLUDED.rmlokasi,
    rmsumber = EXCLUDED.rmsumber,
    rmautonotransaksi = EXCLUDED.rmautonotransaksi,
    rmnotransaksi = EXCLUDED.rmnotransaksi,
    rmtgl = EXCLUDED.rmtgl,
    rmkodepa = EXCLUDED.rmkodepa,
    rmcarabayar = EXCLUDED.rmcarabayar,
    rmkontak = EXCLUDED.rmkontak,
    rmkontakperson = EXCLUDED.rmkontakperson,
    rmnorek = EXCLUDED.rmnorek,
    rmuraian = EXCLUDED.rmuraian,
    rmcatatan = EXCLUDED.rmcatatan,
    rmmatauang = EXCLUDED.rmmatauang,
    rmkurs = EXCLUDED.rmkurs,
    rmjumlah = EXCLUDED.rmjumlah,
    rmjumlahvalas = EXCLUDED.rmjumlahvalas,
    rmjumlahbayar = EXCLUDED.rmjumlahbayar,
    rmjumlahbayarvalas = EXCLUDED.rmjumlahbayarvalas,
    rmstatusbayar = EXCLUDED.rmstatusbayar,
    rmtgllunas = EXCLUDED.rmtgllunas,
    rmstatus = EXCLUDED.rmstatus,
    rmstatussebelumnya = EXCLUDED.rmstatussebelumnya,
    rmjmlrevisi = EXCLUDED.rmjmlrevisi,
    rmcetakanke = EXCLUDED.rmcetakanke,
    rmisclose = EXCLUDED.rmisclose,
    rmposting = EXCLUDED.rmposting,
    rmpostingtgl = EXCLUDED.rmpostingtgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_rg
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_rg'
)
INSERT INTO m2_rg (
    rgid, rgcabang, rglokasi, rgsumber, rgautonotransaksi, rgnotransaksi, rgtgl, rgkodepa, rgkontak, rgkontakperson, rguraian, rgcatatan, rgmatauang, rgkurs, rgjumlah, rgjumlahvalas, rgstatusrgc, rgstatus, rgstatussebelumnya, rgjmlrevisi, rgcetakanke, rgisclose, rgposting, rgpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    rgid, rgcabang, rglokasi, rgsumber, rgautonotransaksi, rgnotransaksi, rgtgl, rgkodepa, rgkontak, rgkontakperson, rguraian, rgcatatan, rgmatauang, rgkurs, rgjumlah, rgjumlahvalas, rgstatusrgc, rgstatus, rgstatussebelumnya, rgjmlrevisi, rgcetakanke, rgisclose, rgposting, rgpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'rgid', '')::bigint AS rgid,
        row_payload ->> 'rgcabang' AS rgcabang,
        row_payload ->> 'rglokasi' AS rglokasi,
        row_payload ->> 'rgsumber' AS rgsumber,
        row_payload ->> 'rgautonotransaksi' AS rgautonotransaksi,
        row_payload ->> 'rgnotransaksi' AS rgnotransaksi,
        NULLIF(row_payload ->> 'rgtgl', '')::timestamptz AS rgtgl,
        row_payload ->> 'rgkodepa' AS rgkodepa,
        row_payload ->> 'rgkontak' AS rgkontak,
        row_payload ->> 'rgkontakperson' AS rgkontakperson,
        row_payload ->> 'rguraian' AS rguraian,
        row_payload ->> 'rgcatatan' AS rgcatatan,
        row_payload ->> 'rgmatauang' AS rgmatauang,
        NULLIF(row_payload ->> 'rgkurs', '')::numeric(20,6) AS rgkurs,
        row_payload ->> 'rgjumlah' AS rgjumlah,
        row_payload ->> 'rgjumlahvalas' AS rgjumlahvalas,
        row_payload ->> 'rgstatusrgc' AS rgstatusrgc,
        row_payload ->> 'rgstatus' AS rgstatus,
        row_payload ->> 'rgstatussebelumnya' AS rgstatussebelumnya,
        NULLIF(row_payload ->> 'rgjmlrevisi', '')::numeric(20,6) AS rgjmlrevisi,
        row_payload ->> 'rgcetakanke' AS rgcetakanke,
        NULLIF(row_payload ->> 'rgisclose', '')::bigint AS rgisclose,
        NULLIF(row_payload ->> 'rgposting', '')::bigint AS rgposting,
        NULLIF(row_payload ->> 'rgpostingtgl', '')::timestamptz AS rgpostingtgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'rgid') IS NOT NULL
) AS prepared
ON CONFLICT (rgid) DO UPDATE
SET
    rgcabang = EXCLUDED.rgcabang,
    rglokasi = EXCLUDED.rglokasi,
    rgsumber = EXCLUDED.rgsumber,
    rgautonotransaksi = EXCLUDED.rgautonotransaksi,
    rgnotransaksi = EXCLUDED.rgnotransaksi,
    rgtgl = EXCLUDED.rgtgl,
    rgkodepa = EXCLUDED.rgkodepa,
    rgkontak = EXCLUDED.rgkontak,
    rgkontakperson = EXCLUDED.rgkontakperson,
    rguraian = EXCLUDED.rguraian,
    rgcatatan = EXCLUDED.rgcatatan,
    rgmatauang = EXCLUDED.rgmatauang,
    rgkurs = EXCLUDED.rgkurs,
    rgjumlah = EXCLUDED.rgjumlah,
    rgjumlahvalas = EXCLUDED.rgjumlahvalas,
    rgstatusrgc = EXCLUDED.rgstatusrgc,
    rgstatus = EXCLUDED.rgstatus,
    rgstatussebelumnya = EXCLUDED.rgstatussebelumnya,
    rgjmlrevisi = EXCLUDED.rgjmlrevisi,
    rgcetakanke = EXCLUDED.rgcetakanke,
    rgisclose = EXCLUDED.rgisclose,
    rgposting = EXCLUDED.rgposting,
    rgpostingtgl = EXCLUDED.rgpostingtgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_rg_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_rg_detail'
)
INSERT INTO m2_rg_detail (
    idrgdetail, idrg, nogiro, kontak, matauang, kurs, jumlah, jumlahvalas, bank, noacbank, rekbank, rekgiro, tgljatuhtempo, catatan, urutan, statusgiro, statusrgc, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idrgdetail, idrg, nogiro, kontak, matauang, kurs, jumlah, jumlahvalas, bank, noacbank, rekbank, rekgiro, tgljatuhtempo, catatan, urutan, statusgiro, statusrgc, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idrgdetail', '')::bigint AS idrgdetail,
        NULLIF(row_payload ->> 'idrg', '')::bigint AS idrg,
        row_payload ->> 'nogiro' AS nogiro,
        row_payload ->> 'kontak' AS kontak,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'jumlah' AS jumlah,
        row_payload ->> 'jumlahvalas' AS jumlahvalas,
        row_payload ->> 'bank' AS bank,
        row_payload ->> 'noacbank' AS noacbank,
        row_payload ->> 'rekbank' AS rekbank,
        row_payload ->> 'rekgiro' AS rekgiro,
        NULLIF(row_payload ->> 'tgljatuhtempo', '')::timestamptz AS tgljatuhtempo,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'statusgiro', '')::bigint AS statusgiro,
        NULLIF(row_payload ->> 'statusrgc', '')::bigint AS statusrgc,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idrgdetail') IS NOT NULL
) AS prepared
ON CONFLICT (idrgdetail) DO UPDATE
SET
    idrg = EXCLUDED.idrg,
    nogiro = EXCLUDED.nogiro,
    kontak = EXCLUDED.kontak,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    jumlah = EXCLUDED.jumlah,
    jumlahvalas = EXCLUDED.jumlahvalas,
    bank = EXCLUDED.bank,
    noacbank = EXCLUDED.noacbank,
    rekbank = EXCLUDED.rekbank,
    rekgiro = EXCLUDED.rekgiro,
    tgljatuhtempo = EXCLUDED.tgljatuhtempo,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    statusgiro = EXCLUDED.statusgiro,
    statusrgc = EXCLUDED.statusrgc,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_rg_detail_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_rg_detail_history'
)
INSERT INTO m2_rg_detail_history (
    idrgdetailhistory, idrghistory, idrgdetail, idrg, nogiro, kontak, matauang, kurs, jumlah, jumlahvalas, bank, noacbank, rekbank, rekgiro, tgljatuhtempo, catatan, urutan, statusgiro, statusrgc, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idrgdetailhistory, idrghistory, idrgdetail, idrg, nogiro, kontak, matauang, kurs, jumlah, jumlahvalas, bank, noacbank, rekbank, rekgiro, tgljatuhtempo, catatan, urutan, statusgiro, statusrgc, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idrgdetailhistory', '')::bigint AS idrgdetailhistory,
        NULLIF(row_payload ->> 'idrghistory', '')::bigint AS idrghistory,
        NULLIF(row_payload ->> 'idrgdetail', '')::bigint AS idrgdetail,
        NULLIF(row_payload ->> 'idrg', '')::bigint AS idrg,
        row_payload ->> 'nogiro' AS nogiro,
        row_payload ->> 'kontak' AS kontak,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'jumlah' AS jumlah,
        row_payload ->> 'jumlahvalas' AS jumlahvalas,
        row_payload ->> 'bank' AS bank,
        row_payload ->> 'noacbank' AS noacbank,
        row_payload ->> 'rekbank' AS rekbank,
        row_payload ->> 'rekgiro' AS rekgiro,
        NULLIF(row_payload ->> 'tgljatuhtempo', '')::timestamptz AS tgljatuhtempo,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'statusgiro', '')::bigint AS statusgiro,
        NULLIF(row_payload ->> 'statusrgc', '')::bigint AS statusrgc,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idhistorydetail') IS NOT NULL
) AS prepared
ON CONFLICT (idhistorydetail) DO UPDATE
SET
    idrgdetailhistory = EXCLUDED.idrgdetailhistory,
    idrghistory = EXCLUDED.idrghistory,
    idrgdetail = EXCLUDED.idrgdetail,
    idrg = EXCLUDED.idrg,
    nogiro = EXCLUDED.nogiro,
    kontak = EXCLUDED.kontak,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    jumlah = EXCLUDED.jumlah,
    jumlahvalas = EXCLUDED.jumlahvalas,
    bank = EXCLUDED.bank,
    noacbank = EXCLUDED.noacbank,
    rekbank = EXCLUDED.rekbank,
    rekgiro = EXCLUDED.rekgiro,
    tgljatuhtempo = EXCLUDED.tgljatuhtempo,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    statusgiro = EXCLUDED.statusgiro,
    statusrgc = EXCLUDED.statusrgc,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_rg_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_rg_history'
)
INSERT INTO m2_rg_history (
    rgidhistory, rgid, rgcabang, rglokasi, rgsumber, rgautonotransaksi, rgnotransaksi, rgtgl, rgkodepa, rgkontak, rgkontakperson, rguraian, rgcatatan, rgmatauang, rgkurs, rgjumlah, rgjumlahvalas, rgstatusrgc, rgstatus, rgstatussebelumnya, rgjmlrevisi, rgcetakanke, rgisclose, rgposting, rgpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    rgidhistory, rgid, rgcabang, rglokasi, rgsumber, rgautonotransaksi, rgnotransaksi, rgtgl, rgkodepa, rgkontak, rgkontakperson, rguraian, rgcatatan, rgmatauang, rgkurs, rgjumlah, rgjumlahvalas, rgstatusrgc, rgstatus, rgstatussebelumnya, rgjmlrevisi, rgcetakanke, rgisclose, rgposting, rgpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'rgidhistory', '')::bigint AS rgidhistory,
        NULLIF(row_payload ->> 'rgid', '')::bigint AS rgid,
        row_payload ->> 'rgcabang' AS rgcabang,
        row_payload ->> 'rglokasi' AS rglokasi,
        row_payload ->> 'rgsumber' AS rgsumber,
        row_payload ->> 'rgautonotransaksi' AS rgautonotransaksi,
        row_payload ->> 'rgnotransaksi' AS rgnotransaksi,
        NULLIF(row_payload ->> 'rgtgl', '')::timestamptz AS rgtgl,
        row_payload ->> 'rgkodepa' AS rgkodepa,
        row_payload ->> 'rgkontak' AS rgkontak,
        row_payload ->> 'rgkontakperson' AS rgkontakperson,
        row_payload ->> 'rguraian' AS rguraian,
        row_payload ->> 'rgcatatan' AS rgcatatan,
        row_payload ->> 'rgmatauang' AS rgmatauang,
        NULLIF(row_payload ->> 'rgkurs', '')::numeric(20,6) AS rgkurs,
        row_payload ->> 'rgjumlah' AS rgjumlah,
        row_payload ->> 'rgjumlahvalas' AS rgjumlahvalas,
        row_payload ->> 'rgstatusrgc' AS rgstatusrgc,
        row_payload ->> 'rgstatus' AS rgstatus,
        row_payload ->> 'rgstatussebelumnya' AS rgstatussebelumnya,
        NULLIF(row_payload ->> 'rgjmlrevisi', '')::numeric(20,6) AS rgjmlrevisi,
        row_payload ->> 'rgcetakanke' AS rgcetakanke,
        NULLIF(row_payload ->> 'rgisclose', '')::bigint AS rgisclose,
        NULLIF(row_payload ->> 'rgposting', '')::bigint AS rgposting,
        NULLIF(row_payload ->> 'rgpostingtgl', '')::timestamptz AS rgpostingtgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'rgidhistory') IS NOT NULL
) AS prepared
ON CONFLICT (rgidhistory) DO UPDATE
SET
    rgid = EXCLUDED.rgid,
    rgcabang = EXCLUDED.rgcabang,
    rglokasi = EXCLUDED.rglokasi,
    rgsumber = EXCLUDED.rgsumber,
    rgautonotransaksi = EXCLUDED.rgautonotransaksi,
    rgnotransaksi = EXCLUDED.rgnotransaksi,
    rgtgl = EXCLUDED.rgtgl,
    rgkodepa = EXCLUDED.rgkodepa,
    rgkontak = EXCLUDED.rgkontak,
    rgkontakperson = EXCLUDED.rgkontakperson,
    rguraian = EXCLUDED.rguraian,
    rgcatatan = EXCLUDED.rgcatatan,
    rgmatauang = EXCLUDED.rgmatauang,
    rgkurs = EXCLUDED.rgkurs,
    rgjumlah = EXCLUDED.rgjumlah,
    rgjumlahvalas = EXCLUDED.rgjumlahvalas,
    rgstatusrgc = EXCLUDED.rgstatusrgc,
    rgstatus = EXCLUDED.rgstatus,
    rgstatussebelumnya = EXCLUDED.rgstatussebelumnya,
    rgjmlrevisi = EXCLUDED.rgjmlrevisi,
    rgcetakanke = EXCLUDED.rgcetakanke,
    rgisclose = EXCLUDED.rgisclose,
    rgposting = EXCLUDED.rgposting,
    rgpostingtgl = EXCLUDED.rgpostingtgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_rgc
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_rgc'
)
INSERT INTO m2_rgc (
    rgcid, rgccabang, rgclokasi, rgcsumber, rgcjenis, rgcautonotransaksi, rgcnotransaksi, rgctgl, rgckodepa, rgckontak, rgckontakperson, rgcuraian, rgccatatan, rgcmatauang, rgckurs, rgcjumlah, rgcjumlahvalas, rgcidrg, rgcstatus, rgcstatussebelumnya, rgcjmlrevisi, rgccetakanke, rgcisclose, rgcposting, rgcpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    rgcid, rgccabang, rgclokasi, rgcsumber, rgcjenis, rgcautonotransaksi, rgcnotransaksi, rgctgl, rgckodepa, rgckontak, rgckontakperson, rgcuraian, rgccatatan, rgcmatauang, rgckurs, rgcjumlah, rgcjumlahvalas, rgcidrg, rgcstatus, rgcstatussebelumnya, rgcjmlrevisi, rgccetakanke, rgcisclose, rgcposting, rgcpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'rgcid', '')::bigint AS rgcid,
        row_payload ->> 'rgccabang' AS rgccabang,
        row_payload ->> 'rgclokasi' AS rgclokasi,
        row_payload ->> 'rgcsumber' AS rgcsumber,
        row_payload ->> 'rgcjenis' AS rgcjenis,
        row_payload ->> 'rgcautonotransaksi' AS rgcautonotransaksi,
        row_payload ->> 'rgcnotransaksi' AS rgcnotransaksi,
        NULLIF(row_payload ->> 'rgctgl', '')::timestamptz AS rgctgl,
        row_payload ->> 'rgckodepa' AS rgckodepa,
        row_payload ->> 'rgckontak' AS rgckontak,
        row_payload ->> 'rgckontakperson' AS rgckontakperson,
        row_payload ->> 'rgcuraian' AS rgcuraian,
        row_payload ->> 'rgccatatan' AS rgccatatan,
        row_payload ->> 'rgcmatauang' AS rgcmatauang,
        NULLIF(row_payload ->> 'rgckurs', '')::numeric(20,6) AS rgckurs,
        row_payload ->> 'rgcjumlah' AS rgcjumlah,
        row_payload ->> 'rgcjumlahvalas' AS rgcjumlahvalas,
        NULLIF(row_payload ->> 'rgcidrg', '')::bigint AS rgcidrg,
        row_payload ->> 'rgcstatus' AS rgcstatus,
        row_payload ->> 'rgcstatussebelumnya' AS rgcstatussebelumnya,
        NULLIF(row_payload ->> 'rgcjmlrevisi', '')::numeric(20,6) AS rgcjmlrevisi,
        row_payload ->> 'rgccetakanke' AS rgccetakanke,
        NULLIF(row_payload ->> 'rgcisclose', '')::bigint AS rgcisclose,
        NULLIF(row_payload ->> 'rgcposting', '')::bigint AS rgcposting,
        NULLIF(row_payload ->> 'rgcpostingtgl', '')::timestamptz AS rgcpostingtgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'rgcid') IS NOT NULL
) AS prepared
ON CONFLICT (rgcid) DO UPDATE
SET
    rgccabang = EXCLUDED.rgccabang,
    rgclokasi = EXCLUDED.rgclokasi,
    rgcsumber = EXCLUDED.rgcsumber,
    rgcjenis = EXCLUDED.rgcjenis,
    rgcautonotransaksi = EXCLUDED.rgcautonotransaksi,
    rgcnotransaksi = EXCLUDED.rgcnotransaksi,
    rgctgl = EXCLUDED.rgctgl,
    rgckodepa = EXCLUDED.rgckodepa,
    rgckontak = EXCLUDED.rgckontak,
    rgckontakperson = EXCLUDED.rgckontakperson,
    rgcuraian = EXCLUDED.rgcuraian,
    rgccatatan = EXCLUDED.rgccatatan,
    rgcmatauang = EXCLUDED.rgcmatauang,
    rgckurs = EXCLUDED.rgckurs,
    rgcjumlah = EXCLUDED.rgcjumlah,
    rgcjumlahvalas = EXCLUDED.rgcjumlahvalas,
    rgcidrg = EXCLUDED.rgcidrg,
    rgcstatus = EXCLUDED.rgcstatus,
    rgcstatussebelumnya = EXCLUDED.rgcstatussebelumnya,
    rgcjmlrevisi = EXCLUDED.rgcjmlrevisi,
    rgccetakanke = EXCLUDED.rgccetakanke,
    rgcisclose = EXCLUDED.rgcisclose,
    rgcposting = EXCLUDED.rgcposting,
    rgcpostingtgl = EXCLUDED.rgcpostingtgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_rgc_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_rgc_detail'
)
INSERT INTO m2_rgc_detail (
    idrgcdetail, idrgc, nogiro, kontak, matauang, kurs, jumlah, jumlahvalas, bank, noacbank, rekbank, rekgiro, tgljatuhtempo, catatan, urutan, statusgiro, idrgdetail, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idrgcdetail, idrgc, nogiro, kontak, matauang, kurs, jumlah, jumlahvalas, bank, noacbank, rekbank, rekgiro, tgljatuhtempo, catatan, urutan, statusgiro, idrgdetail, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idrgcdetail', '')::bigint AS idrgcdetail,
        NULLIF(row_payload ->> 'idrgc', '')::bigint AS idrgc,
        row_payload ->> 'nogiro' AS nogiro,
        row_payload ->> 'kontak' AS kontak,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'jumlah' AS jumlah,
        row_payload ->> 'jumlahvalas' AS jumlahvalas,
        row_payload ->> 'bank' AS bank,
        row_payload ->> 'noacbank' AS noacbank,
        row_payload ->> 'rekbank' AS rekbank,
        row_payload ->> 'rekgiro' AS rekgiro,
        NULLIF(row_payload ->> 'tgljatuhtempo', '')::timestamptz AS tgljatuhtempo,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'statusgiro', '')::bigint AS statusgiro,
        NULLIF(row_payload ->> 'idrgdetail', '')::bigint AS idrgdetail,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idrgcdetail') IS NOT NULL
) AS prepared
ON CONFLICT (idrgcdetail) DO UPDATE
SET
    idrgc = EXCLUDED.idrgc,
    nogiro = EXCLUDED.nogiro,
    kontak = EXCLUDED.kontak,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    jumlah = EXCLUDED.jumlah,
    jumlahvalas = EXCLUDED.jumlahvalas,
    bank = EXCLUDED.bank,
    noacbank = EXCLUDED.noacbank,
    rekbank = EXCLUDED.rekbank,
    rekgiro = EXCLUDED.rekgiro,
    tgljatuhtempo = EXCLUDED.tgljatuhtempo,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    statusgiro = EXCLUDED.statusgiro,
    idrgdetail = EXCLUDED.idrgdetail,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_rgc_detail_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_rgc_detail_history'
)
INSERT INTO m2_rgc_detail_history (
    idrgcdetailhistory, idrgchistory, idrgcdetail, idrgc, nogiro, kontak, matauang, kurs, jumlah, jumlahvalas, bank, noacbank, rekbank, rekgiro, tgljatuhtempo, catatan, urutan, statusgiro, idrgdetail, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idrgcdetailhistory, idrgchistory, idrgcdetail, idrgc, nogiro, kontak, matauang, kurs, jumlah, jumlahvalas, bank, noacbank, rekbank, rekgiro, tgljatuhtempo, catatan, urutan, statusgiro, idrgdetail, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idrgcdetailhistory', '')::bigint AS idrgcdetailhistory,
        NULLIF(row_payload ->> 'idrgchistory', '')::bigint AS idrgchistory,
        NULLIF(row_payload ->> 'idrgcdetail', '')::bigint AS idrgcdetail,
        NULLIF(row_payload ->> 'idrgc', '')::bigint AS idrgc,
        row_payload ->> 'nogiro' AS nogiro,
        row_payload ->> 'kontak' AS kontak,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'jumlah' AS jumlah,
        row_payload ->> 'jumlahvalas' AS jumlahvalas,
        row_payload ->> 'bank' AS bank,
        row_payload ->> 'noacbank' AS noacbank,
        row_payload ->> 'rekbank' AS rekbank,
        row_payload ->> 'rekgiro' AS rekgiro,
        NULLIF(row_payload ->> 'tgljatuhtempo', '')::timestamptz AS tgljatuhtempo,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'statusgiro', '')::bigint AS statusgiro,
        NULLIF(row_payload ->> 'idrgdetail', '')::bigint AS idrgdetail,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idhistorydetail') IS NOT NULL
) AS prepared
ON CONFLICT (idhistorydetail) DO UPDATE
SET
    idrgcdetailhistory = EXCLUDED.idrgcdetailhistory,
    idrgchistory = EXCLUDED.idrgchistory,
    idrgcdetail = EXCLUDED.idrgcdetail,
    idrgc = EXCLUDED.idrgc,
    nogiro = EXCLUDED.nogiro,
    kontak = EXCLUDED.kontak,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    jumlah = EXCLUDED.jumlah,
    jumlahvalas = EXCLUDED.jumlahvalas,
    bank = EXCLUDED.bank,
    noacbank = EXCLUDED.noacbank,
    rekbank = EXCLUDED.rekbank,
    rekgiro = EXCLUDED.rekgiro,
    tgljatuhtempo = EXCLUDED.tgljatuhtempo,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    statusgiro = EXCLUDED.statusgiro,
    idrgdetail = EXCLUDED.idrgdetail,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_rgc_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_rgc_history'
)
INSERT INTO m2_rgc_history (
    rgcidhistory, rgcid, rgccabang, rgclokasi, rgcsumber, rgcjenis, rgcautonotransaksi, rgcnotransaksi, rgctgl, rgckodepa, rgckontak, rgckontakperson, rgcuraian, rgccatatan, rgcmatauang, rgckurs, rgcjumlah, rgcjumlahvalas, rgcidrg, rgcstatus, rgcstatussebelumnya, rgcjmlrevisi, rgccetakanke, rgcisclose, rgcposting, rgcpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    rgcidhistory, rgcid, rgccabang, rgclokasi, rgcsumber, rgcjenis, rgcautonotransaksi, rgcnotransaksi, rgctgl, rgckodepa, rgckontak, rgckontakperson, rgcuraian, rgccatatan, rgcmatauang, rgckurs, rgcjumlah, rgcjumlahvalas, rgcidrg, rgcstatus, rgcstatussebelumnya, rgcjmlrevisi, rgccetakanke, rgcisclose, rgcposting, rgcpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'rgcidhistory', '')::bigint AS rgcidhistory,
        NULLIF(row_payload ->> 'rgcid', '')::bigint AS rgcid,
        row_payload ->> 'rgccabang' AS rgccabang,
        row_payload ->> 'rgclokasi' AS rgclokasi,
        row_payload ->> 'rgcsumber' AS rgcsumber,
        row_payload ->> 'rgcjenis' AS rgcjenis,
        row_payload ->> 'rgcautonotransaksi' AS rgcautonotransaksi,
        row_payload ->> 'rgcnotransaksi' AS rgcnotransaksi,
        NULLIF(row_payload ->> 'rgctgl', '')::timestamptz AS rgctgl,
        row_payload ->> 'rgckodepa' AS rgckodepa,
        row_payload ->> 'rgckontak' AS rgckontak,
        row_payload ->> 'rgckontakperson' AS rgckontakperson,
        row_payload ->> 'rgcuraian' AS rgcuraian,
        row_payload ->> 'rgccatatan' AS rgccatatan,
        row_payload ->> 'rgcmatauang' AS rgcmatauang,
        NULLIF(row_payload ->> 'rgckurs', '')::numeric(20,6) AS rgckurs,
        row_payload ->> 'rgcjumlah' AS rgcjumlah,
        row_payload ->> 'rgcjumlahvalas' AS rgcjumlahvalas,
        NULLIF(row_payload ->> 'rgcidrg', '')::bigint AS rgcidrg,
        row_payload ->> 'rgcstatus' AS rgcstatus,
        row_payload ->> 'rgcstatussebelumnya' AS rgcstatussebelumnya,
        NULLIF(row_payload ->> 'rgcjmlrevisi', '')::numeric(20,6) AS rgcjmlrevisi,
        row_payload ->> 'rgccetakanke' AS rgccetakanke,
        NULLIF(row_payload ->> 'rgcisclose', '')::bigint AS rgcisclose,
        NULLIF(row_payload ->> 'rgcposting', '')::bigint AS rgcposting,
        NULLIF(row_payload ->> 'rgcpostingtgl', '')::timestamptz AS rgcpostingtgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'rgcidhistory') IS NOT NULL
) AS prepared
ON CONFLICT (rgcidhistory) DO UPDATE
SET
    rgcid = EXCLUDED.rgcid,
    rgccabang = EXCLUDED.rgccabang,
    rgclokasi = EXCLUDED.rgclokasi,
    rgcsumber = EXCLUDED.rgcsumber,
    rgcjenis = EXCLUDED.rgcjenis,
    rgcautonotransaksi = EXCLUDED.rgcautonotransaksi,
    rgcnotransaksi = EXCLUDED.rgcnotransaksi,
    rgctgl = EXCLUDED.rgctgl,
    rgckodepa = EXCLUDED.rgckodepa,
    rgckontak = EXCLUDED.rgckontak,
    rgckontakperson = EXCLUDED.rgckontakperson,
    rgcuraian = EXCLUDED.rgcuraian,
    rgccatatan = EXCLUDED.rgccatatan,
    rgcmatauang = EXCLUDED.rgcmatauang,
    rgckurs = EXCLUDED.rgckurs,
    rgcjumlah = EXCLUDED.rgcjumlah,
    rgcjumlahvalas = EXCLUDED.rgcjumlahvalas,
    rgcidrg = EXCLUDED.rgcidrg,
    rgcstatus = EXCLUDED.rgcstatus,
    rgcstatussebelumnya = EXCLUDED.rgcstatussebelumnya,
    rgcjmlrevisi = EXCLUDED.rgcjmlrevisi,
    rgccetakanke = EXCLUDED.rgccetakanke,
    rgcisclose = EXCLUDED.rgcisclose,
    rgcposting = EXCLUDED.rgcposting,
    rgcpostingtgl = EXCLUDED.rgcpostingtgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_sg
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_sg'
)
INSERT INTO m2_sg (
    sgid, sgcabang, sglokasi, sgsumber, sgautonotransaksi, sgnotransaksi, sgtgl, sgkodepa, sgkontak, sgkontakperson, sguraian, sgcatatan, sgmatauang, sgkurs, sgjumlah, sgjumlahvalas, sgstatussgc, sgstatus, sgstatussebelumnya, sgjmlrevisi, sgcetakanke, sgisclose, sgposting, sgpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    sgid, sgcabang, sglokasi, sgsumber, sgautonotransaksi, sgnotransaksi, sgtgl, sgkodepa, sgkontak, sgkontakperson, sguraian, sgcatatan, sgmatauang, sgkurs, sgjumlah, sgjumlahvalas, sgstatussgc, sgstatus, sgstatussebelumnya, sgjmlrevisi, sgcetakanke, sgisclose, sgposting, sgpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'sgid', '')::bigint AS sgid,
        row_payload ->> 'sgcabang' AS sgcabang,
        row_payload ->> 'sglokasi' AS sglokasi,
        row_payload ->> 'sgsumber' AS sgsumber,
        row_payload ->> 'sgautonotransaksi' AS sgautonotransaksi,
        row_payload ->> 'sgnotransaksi' AS sgnotransaksi,
        NULLIF(row_payload ->> 'sgtgl', '')::timestamptz AS sgtgl,
        row_payload ->> 'sgkodepa' AS sgkodepa,
        row_payload ->> 'sgkontak' AS sgkontak,
        row_payload ->> 'sgkontakperson' AS sgkontakperson,
        row_payload ->> 'sguraian' AS sguraian,
        row_payload ->> 'sgcatatan' AS sgcatatan,
        row_payload ->> 'sgmatauang' AS sgmatauang,
        NULLIF(row_payload ->> 'sgkurs', '')::numeric(20,6) AS sgkurs,
        row_payload ->> 'sgjumlah' AS sgjumlah,
        row_payload ->> 'sgjumlahvalas' AS sgjumlahvalas,
        row_payload ->> 'sgstatussgc' AS sgstatussgc,
        row_payload ->> 'sgstatus' AS sgstatus,
        row_payload ->> 'sgstatussebelumnya' AS sgstatussebelumnya,
        NULLIF(row_payload ->> 'sgjmlrevisi', '')::numeric(20,6) AS sgjmlrevisi,
        row_payload ->> 'sgcetakanke' AS sgcetakanke,
        NULLIF(row_payload ->> 'sgisclose', '')::bigint AS sgisclose,
        NULLIF(row_payload ->> 'sgposting', '')::bigint AS sgposting,
        NULLIF(row_payload ->> 'sgpostingtgl', '')::timestamptz AS sgpostingtgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'sgid') IS NOT NULL
) AS prepared
ON CONFLICT (sgid) DO UPDATE
SET
    sgcabang = EXCLUDED.sgcabang,
    sglokasi = EXCLUDED.sglokasi,
    sgsumber = EXCLUDED.sgsumber,
    sgautonotransaksi = EXCLUDED.sgautonotransaksi,
    sgnotransaksi = EXCLUDED.sgnotransaksi,
    sgtgl = EXCLUDED.sgtgl,
    sgkodepa = EXCLUDED.sgkodepa,
    sgkontak = EXCLUDED.sgkontak,
    sgkontakperson = EXCLUDED.sgkontakperson,
    sguraian = EXCLUDED.sguraian,
    sgcatatan = EXCLUDED.sgcatatan,
    sgmatauang = EXCLUDED.sgmatauang,
    sgkurs = EXCLUDED.sgkurs,
    sgjumlah = EXCLUDED.sgjumlah,
    sgjumlahvalas = EXCLUDED.sgjumlahvalas,
    sgstatussgc = EXCLUDED.sgstatussgc,
    sgstatus = EXCLUDED.sgstatus,
    sgstatussebelumnya = EXCLUDED.sgstatussebelumnya,
    sgjmlrevisi = EXCLUDED.sgjmlrevisi,
    sgcetakanke = EXCLUDED.sgcetakanke,
    sgisclose = EXCLUDED.sgisclose,
    sgposting = EXCLUDED.sgposting,
    sgpostingtgl = EXCLUDED.sgpostingtgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_sg_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_sg_detail'
)
INSERT INTO m2_sg_detail (
    idsgdetail, idsg, nogiro, kontak, matauang, kurs, jumlah, jumlahvalas, bank, noacbank, rekbank, rekgiro, tgljatuhtempo, catatan, urutan, statusgiro, statussgc, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idsgdetail, idsg, nogiro, kontak, matauang, kurs, jumlah, jumlahvalas, bank, noacbank, rekbank, rekgiro, tgljatuhtempo, catatan, urutan, statusgiro, statussgc, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idsgdetail', '')::bigint AS idsgdetail,
        NULLIF(row_payload ->> 'idsg', '')::bigint AS idsg,
        row_payload ->> 'nogiro' AS nogiro,
        row_payload ->> 'kontak' AS kontak,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'jumlah' AS jumlah,
        row_payload ->> 'jumlahvalas' AS jumlahvalas,
        row_payload ->> 'bank' AS bank,
        row_payload ->> 'noacbank' AS noacbank,
        row_payload ->> 'rekbank' AS rekbank,
        row_payload ->> 'rekgiro' AS rekgiro,
        NULLIF(row_payload ->> 'tgljatuhtempo', '')::timestamptz AS tgljatuhtempo,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'statusgiro', '')::bigint AS statusgiro,
        NULLIF(row_payload ->> 'statussgc', '')::bigint AS statussgc,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idsgdetail') IS NOT NULL
) AS prepared
ON CONFLICT (idsgdetail) DO UPDATE
SET
    idsg = EXCLUDED.idsg,
    nogiro = EXCLUDED.nogiro,
    kontak = EXCLUDED.kontak,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    jumlah = EXCLUDED.jumlah,
    jumlahvalas = EXCLUDED.jumlahvalas,
    bank = EXCLUDED.bank,
    noacbank = EXCLUDED.noacbank,
    rekbank = EXCLUDED.rekbank,
    rekgiro = EXCLUDED.rekgiro,
    tgljatuhtempo = EXCLUDED.tgljatuhtempo,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    statusgiro = EXCLUDED.statusgiro,
    statussgc = EXCLUDED.statussgc,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_sg_detail_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_sg_detail_history'
)
INSERT INTO m2_sg_detail_history (
    idsgdetailhistory, idsghistory, idsgdetail, idsg, nogiro, kontak, matauang, kurs, jumlah, jumlahvalas, bank, noacbank, rekbank, rekgiro, tgljatuhtempo, catatan, urutan, statusgiro, statussgc, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idsgdetailhistory, idsghistory, idsgdetail, idsg, nogiro, kontak, matauang, kurs, jumlah, jumlahvalas, bank, noacbank, rekbank, rekgiro, tgljatuhtempo, catatan, urutan, statusgiro, statussgc, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idsgdetailhistory', '')::bigint AS idsgdetailhistory,
        NULLIF(row_payload ->> 'idsghistory', '')::bigint AS idsghistory,
        NULLIF(row_payload ->> 'idsgdetail', '')::bigint AS idsgdetail,
        NULLIF(row_payload ->> 'idsg', '')::bigint AS idsg,
        row_payload ->> 'nogiro' AS nogiro,
        row_payload ->> 'kontak' AS kontak,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'jumlah' AS jumlah,
        row_payload ->> 'jumlahvalas' AS jumlahvalas,
        row_payload ->> 'bank' AS bank,
        row_payload ->> 'noacbank' AS noacbank,
        row_payload ->> 'rekbank' AS rekbank,
        row_payload ->> 'rekgiro' AS rekgiro,
        NULLIF(row_payload ->> 'tgljatuhtempo', '')::timestamptz AS tgljatuhtempo,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'statusgiro', '')::bigint AS statusgiro,
        NULLIF(row_payload ->> 'statussgc', '')::bigint AS statussgc,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idhistorydetail') IS NOT NULL
) AS prepared
ON CONFLICT (idhistorydetail) DO UPDATE
SET
    idsgdetailhistory = EXCLUDED.idsgdetailhistory,
    idsghistory = EXCLUDED.idsghistory,
    idsgdetail = EXCLUDED.idsgdetail,
    idsg = EXCLUDED.idsg,
    nogiro = EXCLUDED.nogiro,
    kontak = EXCLUDED.kontak,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    jumlah = EXCLUDED.jumlah,
    jumlahvalas = EXCLUDED.jumlahvalas,
    bank = EXCLUDED.bank,
    noacbank = EXCLUDED.noacbank,
    rekbank = EXCLUDED.rekbank,
    rekgiro = EXCLUDED.rekgiro,
    tgljatuhtempo = EXCLUDED.tgljatuhtempo,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    statusgiro = EXCLUDED.statusgiro,
    statussgc = EXCLUDED.statussgc,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_sg_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_sg_history'
)
INSERT INTO m2_sg_history (
    sgidhistory, sgid, sgcabang, sglokasi, sgsumber, sgautonotransaksi, sgnotransaksi, sgtgl, sgkodepa, sgkontak, sgkontakperson, sguraian, sgcatatan, sgmatauang, sgkurs, sgjumlah, sgjumlahvalas, sgstatussgc, sgstatus, sgstatussebelumnya, sgjmlrevisi, sgcetakanke, sgisclose, sgposting, sgpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    sgidhistory, sgid, sgcabang, sglokasi, sgsumber, sgautonotransaksi, sgnotransaksi, sgtgl, sgkodepa, sgkontak, sgkontakperson, sguraian, sgcatatan, sgmatauang, sgkurs, sgjumlah, sgjumlahvalas, sgstatussgc, sgstatus, sgstatussebelumnya, sgjmlrevisi, sgcetakanke, sgisclose, sgposting, sgpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'sgidhistory', '')::bigint AS sgidhistory,
        NULLIF(row_payload ->> 'sgid', '')::bigint AS sgid,
        row_payload ->> 'sgcabang' AS sgcabang,
        row_payload ->> 'sglokasi' AS sglokasi,
        row_payload ->> 'sgsumber' AS sgsumber,
        row_payload ->> 'sgautonotransaksi' AS sgautonotransaksi,
        row_payload ->> 'sgnotransaksi' AS sgnotransaksi,
        NULLIF(row_payload ->> 'sgtgl', '')::timestamptz AS sgtgl,
        row_payload ->> 'sgkodepa' AS sgkodepa,
        row_payload ->> 'sgkontak' AS sgkontak,
        row_payload ->> 'sgkontakperson' AS sgkontakperson,
        row_payload ->> 'sguraian' AS sguraian,
        row_payload ->> 'sgcatatan' AS sgcatatan,
        row_payload ->> 'sgmatauang' AS sgmatauang,
        NULLIF(row_payload ->> 'sgkurs', '')::numeric(20,6) AS sgkurs,
        row_payload ->> 'sgjumlah' AS sgjumlah,
        row_payload ->> 'sgjumlahvalas' AS sgjumlahvalas,
        row_payload ->> 'sgstatussgc' AS sgstatussgc,
        row_payload ->> 'sgstatus' AS sgstatus,
        row_payload ->> 'sgstatussebelumnya' AS sgstatussebelumnya,
        NULLIF(row_payload ->> 'sgjmlrevisi', '')::numeric(20,6) AS sgjmlrevisi,
        row_payload ->> 'sgcetakanke' AS sgcetakanke,
        NULLIF(row_payload ->> 'sgisclose', '')::bigint AS sgisclose,
        NULLIF(row_payload ->> 'sgposting', '')::bigint AS sgposting,
        NULLIF(row_payload ->> 'sgpostingtgl', '')::timestamptz AS sgpostingtgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'sgidhistory') IS NOT NULL
) AS prepared
ON CONFLICT (sgidhistory) DO UPDATE
SET
    sgid = EXCLUDED.sgid,
    sgcabang = EXCLUDED.sgcabang,
    sglokasi = EXCLUDED.sglokasi,
    sgsumber = EXCLUDED.sgsumber,
    sgautonotransaksi = EXCLUDED.sgautonotransaksi,
    sgnotransaksi = EXCLUDED.sgnotransaksi,
    sgtgl = EXCLUDED.sgtgl,
    sgkodepa = EXCLUDED.sgkodepa,
    sgkontak = EXCLUDED.sgkontak,
    sgkontakperson = EXCLUDED.sgkontakperson,
    sguraian = EXCLUDED.sguraian,
    sgcatatan = EXCLUDED.sgcatatan,
    sgmatauang = EXCLUDED.sgmatauang,
    sgkurs = EXCLUDED.sgkurs,
    sgjumlah = EXCLUDED.sgjumlah,
    sgjumlahvalas = EXCLUDED.sgjumlahvalas,
    sgstatussgc = EXCLUDED.sgstatussgc,
    sgstatus = EXCLUDED.sgstatus,
    sgstatussebelumnya = EXCLUDED.sgstatussebelumnya,
    sgjmlrevisi = EXCLUDED.sgjmlrevisi,
    sgcetakanke = EXCLUDED.sgcetakanke,
    sgisclose = EXCLUDED.sgisclose,
    sgposting = EXCLUDED.sgposting,
    sgpostingtgl = EXCLUDED.sgpostingtgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_sgc
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_sgc'
)
INSERT INTO m2_sgc (
    sgcid, sgccabang, sgclokasi, sgcsumber, sgcjenis, sgcautonotransaksi, sgcnotransaksi, sgctgl, sgckodepa, sgckontak, sgckontakperson, sgcuraian, sgccatatan, sgcmatauang, sgckurs, sgcjumlah, sgcjumlahvalas, sgcidsg, sgcstatus, sgcstatussebelumnya, sgcjmlrevisi, sgccetakanke, sgcisclose, sgcposting, sgcpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    sgcid, sgccabang, sgclokasi, sgcsumber, sgcjenis, sgcautonotransaksi, sgcnotransaksi, sgctgl, sgckodepa, sgckontak, sgckontakperson, sgcuraian, sgccatatan, sgcmatauang, sgckurs, sgcjumlah, sgcjumlahvalas, sgcidsg, sgcstatus, sgcstatussebelumnya, sgcjmlrevisi, sgccetakanke, sgcisclose, sgcposting, sgcpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'sgcid', '')::bigint AS sgcid,
        row_payload ->> 'sgccabang' AS sgccabang,
        row_payload ->> 'sgclokasi' AS sgclokasi,
        row_payload ->> 'sgcsumber' AS sgcsumber,
        row_payload ->> 'sgcjenis' AS sgcjenis,
        row_payload ->> 'sgcautonotransaksi' AS sgcautonotransaksi,
        row_payload ->> 'sgcnotransaksi' AS sgcnotransaksi,
        NULLIF(row_payload ->> 'sgctgl', '')::timestamptz AS sgctgl,
        row_payload ->> 'sgckodepa' AS sgckodepa,
        row_payload ->> 'sgckontak' AS sgckontak,
        row_payload ->> 'sgckontakperson' AS sgckontakperson,
        row_payload ->> 'sgcuraian' AS sgcuraian,
        row_payload ->> 'sgccatatan' AS sgccatatan,
        row_payload ->> 'sgcmatauang' AS sgcmatauang,
        NULLIF(row_payload ->> 'sgckurs', '')::numeric(20,6) AS sgckurs,
        row_payload ->> 'sgcjumlah' AS sgcjumlah,
        row_payload ->> 'sgcjumlahvalas' AS sgcjumlahvalas,
        NULLIF(row_payload ->> 'sgcidsg', '')::bigint AS sgcidsg,
        row_payload ->> 'sgcstatus' AS sgcstatus,
        row_payload ->> 'sgcstatussebelumnya' AS sgcstatussebelumnya,
        NULLIF(row_payload ->> 'sgcjmlrevisi', '')::numeric(20,6) AS sgcjmlrevisi,
        row_payload ->> 'sgccetakanke' AS sgccetakanke,
        NULLIF(row_payload ->> 'sgcisclose', '')::bigint AS sgcisclose,
        NULLIF(row_payload ->> 'sgcposting', '')::bigint AS sgcposting,
        NULLIF(row_payload ->> 'sgcpostingtgl', '')::timestamptz AS sgcpostingtgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'sgcid') IS NOT NULL
) AS prepared
ON CONFLICT (sgcid) DO UPDATE
SET
    sgccabang = EXCLUDED.sgccabang,
    sgclokasi = EXCLUDED.sgclokasi,
    sgcsumber = EXCLUDED.sgcsumber,
    sgcjenis = EXCLUDED.sgcjenis,
    sgcautonotransaksi = EXCLUDED.sgcautonotransaksi,
    sgcnotransaksi = EXCLUDED.sgcnotransaksi,
    sgctgl = EXCLUDED.sgctgl,
    sgckodepa = EXCLUDED.sgckodepa,
    sgckontak = EXCLUDED.sgckontak,
    sgckontakperson = EXCLUDED.sgckontakperson,
    sgcuraian = EXCLUDED.sgcuraian,
    sgccatatan = EXCLUDED.sgccatatan,
    sgcmatauang = EXCLUDED.sgcmatauang,
    sgckurs = EXCLUDED.sgckurs,
    sgcjumlah = EXCLUDED.sgcjumlah,
    sgcjumlahvalas = EXCLUDED.sgcjumlahvalas,
    sgcidsg = EXCLUDED.sgcidsg,
    sgcstatus = EXCLUDED.sgcstatus,
    sgcstatussebelumnya = EXCLUDED.sgcstatussebelumnya,
    sgcjmlrevisi = EXCLUDED.sgcjmlrevisi,
    sgccetakanke = EXCLUDED.sgccetakanke,
    sgcisclose = EXCLUDED.sgcisclose,
    sgcposting = EXCLUDED.sgcposting,
    sgcpostingtgl = EXCLUDED.sgcpostingtgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_sgc_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_sgc_detail'
)
INSERT INTO m2_sgc_detail (
    idsgcdetail, idsgc, nogiro, kontak, matauang, kurs, jumlah, jumlahvalas, bank, noacbank, rekbank, rekgiro, tgljatuhtempo, catatan, urutan, statusgiro, idsgdetail, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idsgcdetail, idsgc, nogiro, kontak, matauang, kurs, jumlah, jumlahvalas, bank, noacbank, rekbank, rekgiro, tgljatuhtempo, catatan, urutan, statusgiro, idsgdetail, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idsgcdetail', '')::bigint AS idsgcdetail,
        NULLIF(row_payload ->> 'idsgc', '')::bigint AS idsgc,
        row_payload ->> 'nogiro' AS nogiro,
        row_payload ->> 'kontak' AS kontak,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'jumlah' AS jumlah,
        row_payload ->> 'jumlahvalas' AS jumlahvalas,
        row_payload ->> 'bank' AS bank,
        row_payload ->> 'noacbank' AS noacbank,
        row_payload ->> 'rekbank' AS rekbank,
        row_payload ->> 'rekgiro' AS rekgiro,
        NULLIF(row_payload ->> 'tgljatuhtempo', '')::timestamptz AS tgljatuhtempo,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'statusgiro', '')::bigint AS statusgiro,
        NULLIF(row_payload ->> 'idsgdetail', '')::bigint AS idsgdetail,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idsgcdetail') IS NOT NULL
) AS prepared
ON CONFLICT (idsgcdetail) DO UPDATE
SET
    idsgc = EXCLUDED.idsgc,
    nogiro = EXCLUDED.nogiro,
    kontak = EXCLUDED.kontak,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    jumlah = EXCLUDED.jumlah,
    jumlahvalas = EXCLUDED.jumlahvalas,
    bank = EXCLUDED.bank,
    noacbank = EXCLUDED.noacbank,
    rekbank = EXCLUDED.rekbank,
    rekgiro = EXCLUDED.rekgiro,
    tgljatuhtempo = EXCLUDED.tgljatuhtempo,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    statusgiro = EXCLUDED.statusgiro,
    idsgdetail = EXCLUDED.idsgdetail,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_sgc_detail_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_sgc_detail_history'
)
INSERT INTO m2_sgc_detail_history (
    idsgcdetailhistory, idsgchistory, idsgcdetail, idsgc, nogiro, kontak, matauang, kurs, jumlah, jumlahvalas, bank, noacbank, rekbank, rekgiro, tgljatuhtempo, catatan, urutan, statusgiro, idsgdetail, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idsgcdetailhistory, idsgchistory, idsgcdetail, idsgc, nogiro, kontak, matauang, kurs, jumlah, jumlahvalas, bank, noacbank, rekbank, rekgiro, tgljatuhtempo, catatan, urutan, statusgiro, idsgdetail, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idsgcdetailhistory', '')::bigint AS idsgcdetailhistory,
        NULLIF(row_payload ->> 'idsgchistory', '')::bigint AS idsgchistory,
        NULLIF(row_payload ->> 'idsgcdetail', '')::bigint AS idsgcdetail,
        NULLIF(row_payload ->> 'idsgc', '')::bigint AS idsgc,
        row_payload ->> 'nogiro' AS nogiro,
        row_payload ->> 'kontak' AS kontak,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'jumlah' AS jumlah,
        row_payload ->> 'jumlahvalas' AS jumlahvalas,
        row_payload ->> 'bank' AS bank,
        row_payload ->> 'noacbank' AS noacbank,
        row_payload ->> 'rekbank' AS rekbank,
        row_payload ->> 'rekgiro' AS rekgiro,
        NULLIF(row_payload ->> 'tgljatuhtempo', '')::timestamptz AS tgljatuhtempo,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'statusgiro', '')::bigint AS statusgiro,
        NULLIF(row_payload ->> 'idsgdetail', '')::bigint AS idsgdetail,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idhistorydetail') IS NOT NULL
) AS prepared
ON CONFLICT (idhistorydetail) DO UPDATE
SET
    idsgcdetailhistory = EXCLUDED.idsgcdetailhistory,
    idsgchistory = EXCLUDED.idsgchistory,
    idsgcdetail = EXCLUDED.idsgcdetail,
    idsgc = EXCLUDED.idsgc,
    nogiro = EXCLUDED.nogiro,
    kontak = EXCLUDED.kontak,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    jumlah = EXCLUDED.jumlah,
    jumlahvalas = EXCLUDED.jumlahvalas,
    bank = EXCLUDED.bank,
    noacbank = EXCLUDED.noacbank,
    rekbank = EXCLUDED.rekbank,
    rekgiro = EXCLUDED.rekgiro,
    tgljatuhtempo = EXCLUDED.tgljatuhtempo,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    statusgiro = EXCLUDED.statusgiro,
    idsgdetail = EXCLUDED.idsgdetail,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_sgc_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_sgc_history'
)
INSERT INTO m2_sgc_history (
    sgcidhistory, sgcid, sgccabang, sgclokasi, sgcsumber, sgcjenis, sgcautonotransaksi, sgcnotransaksi, sgctgl, sgckodepa, sgckontak, sgckontakperson, sgcuraian, sgccatatan, sgcmatauang, sgckurs, sgcjumlah, sgcjumlahvalas, sgcidsg, sgcstatus, sgcstatussebelumnya, sgcjmlrevisi, sgccetakanke, sgcisclose, sgcposting, sgcpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    sgcidhistory, sgcid, sgccabang, sgclokasi, sgcsumber, sgcjenis, sgcautonotransaksi, sgcnotransaksi, sgctgl, sgckodepa, sgckontak, sgckontakperson, sgcuraian, sgccatatan, sgcmatauang, sgckurs, sgcjumlah, sgcjumlahvalas, sgcidsg, sgcstatus, sgcstatussebelumnya, sgcjmlrevisi, sgccetakanke, sgcisclose, sgcposting, sgcpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'sgcidhistory', '')::bigint AS sgcidhistory,
        NULLIF(row_payload ->> 'sgcid', '')::bigint AS sgcid,
        row_payload ->> 'sgccabang' AS sgccabang,
        row_payload ->> 'sgclokasi' AS sgclokasi,
        row_payload ->> 'sgcsumber' AS sgcsumber,
        row_payload ->> 'sgcjenis' AS sgcjenis,
        row_payload ->> 'sgcautonotransaksi' AS sgcautonotransaksi,
        row_payload ->> 'sgcnotransaksi' AS sgcnotransaksi,
        NULLIF(row_payload ->> 'sgctgl', '')::timestamptz AS sgctgl,
        row_payload ->> 'sgckodepa' AS sgckodepa,
        row_payload ->> 'sgckontak' AS sgckontak,
        row_payload ->> 'sgckontakperson' AS sgckontakperson,
        row_payload ->> 'sgcuraian' AS sgcuraian,
        row_payload ->> 'sgccatatan' AS sgccatatan,
        row_payload ->> 'sgcmatauang' AS sgcmatauang,
        NULLIF(row_payload ->> 'sgckurs', '')::numeric(20,6) AS sgckurs,
        row_payload ->> 'sgcjumlah' AS sgcjumlah,
        row_payload ->> 'sgcjumlahvalas' AS sgcjumlahvalas,
        NULLIF(row_payload ->> 'sgcidsg', '')::bigint AS sgcidsg,
        row_payload ->> 'sgcstatus' AS sgcstatus,
        row_payload ->> 'sgcstatussebelumnya' AS sgcstatussebelumnya,
        NULLIF(row_payload ->> 'sgcjmlrevisi', '')::numeric(20,6) AS sgcjmlrevisi,
        row_payload ->> 'sgccetakanke' AS sgccetakanke,
        NULLIF(row_payload ->> 'sgcisclose', '')::bigint AS sgcisclose,
        NULLIF(row_payload ->> 'sgcposting', '')::bigint AS sgcposting,
        NULLIF(row_payload ->> 'sgcpostingtgl', '')::timestamptz AS sgcpostingtgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'sgcidhistory') IS NOT NULL
) AS prepared
ON CONFLICT (sgcidhistory) DO UPDATE
SET
    sgcid = EXCLUDED.sgcid,
    sgccabang = EXCLUDED.sgccabang,
    sgclokasi = EXCLUDED.sgclokasi,
    sgcsumber = EXCLUDED.sgcsumber,
    sgcjenis = EXCLUDED.sgcjenis,
    sgcautonotransaksi = EXCLUDED.sgcautonotransaksi,
    sgcnotransaksi = EXCLUDED.sgcnotransaksi,
    sgctgl = EXCLUDED.sgctgl,
    sgckodepa = EXCLUDED.sgckodepa,
    sgckontak = EXCLUDED.sgckontak,
    sgckontakperson = EXCLUDED.sgckontakperson,
    sgcuraian = EXCLUDED.sgcuraian,
    sgccatatan = EXCLUDED.sgccatatan,
    sgcmatauang = EXCLUDED.sgcmatauang,
    sgckurs = EXCLUDED.sgckurs,
    sgcjumlah = EXCLUDED.sgcjumlah,
    sgcjumlahvalas = EXCLUDED.sgcjumlahvalas,
    sgcidsg = EXCLUDED.sgcidsg,
    sgcstatus = EXCLUDED.sgcstatus,
    sgcstatussebelumnya = EXCLUDED.sgcstatussebelumnya,
    sgcjmlrevisi = EXCLUDED.sgcjmlrevisi,
    sgccetakanke = EXCLUDED.sgccetakanke,
    sgcisclose = EXCLUDED.sgcisclose,
    sgcposting = EXCLUDED.sgcposting,
    sgcpostingtgl = EXCLUDED.sgcpostingtgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_sm
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_sm'
)
INSERT INTO m2_sm (
    smid, smcabang, smlokasi, smsumber, smautonotransaksi, smnotransaksi, smtgl, smkodepa, smcarabayar, smkontak, smkontakperson, smnorek, smuraian, smcatatan, smmatauang, smkurs, smjumlah, smjumlahvalas, smjumlahbayar, smjumlahbayarvalas, smstatusbayar, smtgllunas, smstatus, smstatussebelumnya, smjmlrevisi, smcetakanke, smisclose, smposting, smpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    smid, smcabang, smlokasi, smsumber, smautonotransaksi, smnotransaksi, smtgl, smkodepa, smcarabayar, smkontak, smkontakperson, smnorek, smuraian, smcatatan, smmatauang, smkurs, smjumlah, smjumlahvalas, smjumlahbayar, smjumlahbayarvalas, smstatusbayar, smtgllunas, smstatus, smstatussebelumnya, smjmlrevisi, smcetakanke, smisclose, smposting, smpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'smid', '')::bigint AS smid,
        row_payload ->> 'smcabang' AS smcabang,
        row_payload ->> 'smlokasi' AS smlokasi,
        row_payload ->> 'smsumber' AS smsumber,
        row_payload ->> 'smautonotransaksi' AS smautonotransaksi,
        row_payload ->> 'smnotransaksi' AS smnotransaksi,
        NULLIF(row_payload ->> 'smtgl', '')::timestamptz AS smtgl,
        row_payload ->> 'smkodepa' AS smkodepa,
        row_payload ->> 'smcarabayar' AS smcarabayar,
        row_payload ->> 'smkontak' AS smkontak,
        row_payload ->> 'smkontakperson' AS smkontakperson,
        row_payload ->> 'smnorek' AS smnorek,
        row_payload ->> 'smuraian' AS smuraian,
        row_payload ->> 'smcatatan' AS smcatatan,
        row_payload ->> 'smmatauang' AS smmatauang,
        NULLIF(row_payload ->> 'smkurs', '')::numeric(20,6) AS smkurs,
        row_payload ->> 'smjumlah' AS smjumlah,
        row_payload ->> 'smjumlahvalas' AS smjumlahvalas,
        row_payload ->> 'smjumlahbayar' AS smjumlahbayar,
        row_payload ->> 'smjumlahbayarvalas' AS smjumlahbayarvalas,
        row_payload ->> 'smstatusbayar' AS smstatusbayar,
        NULLIF(row_payload ->> 'smtgllunas', '')::timestamptz AS smtgllunas,
        row_payload ->> 'smstatus' AS smstatus,
        row_payload ->> 'smstatussebelumnya' AS smstatussebelumnya,
        NULLIF(row_payload ->> 'smjmlrevisi', '')::numeric(20,6) AS smjmlrevisi,
        row_payload ->> 'smcetakanke' AS smcetakanke,
        NULLIF(row_payload ->> 'smisclose', '')::bigint AS smisclose,
        NULLIF(row_payload ->> 'smposting', '')::bigint AS smposting,
        NULLIF(row_payload ->> 'smpostingtgl', '')::timestamptz AS smpostingtgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'smid') IS NOT NULL
) AS prepared
ON CONFLICT (smid) DO UPDATE
SET
    smcabang = EXCLUDED.smcabang,
    smlokasi = EXCLUDED.smlokasi,
    smsumber = EXCLUDED.smsumber,
    smautonotransaksi = EXCLUDED.smautonotransaksi,
    smnotransaksi = EXCLUDED.smnotransaksi,
    smtgl = EXCLUDED.smtgl,
    smkodepa = EXCLUDED.smkodepa,
    smcarabayar = EXCLUDED.smcarabayar,
    smkontak = EXCLUDED.smkontak,
    smkontakperson = EXCLUDED.smkontakperson,
    smnorek = EXCLUDED.smnorek,
    smuraian = EXCLUDED.smuraian,
    smcatatan = EXCLUDED.smcatatan,
    smmatauang = EXCLUDED.smmatauang,
    smkurs = EXCLUDED.smkurs,
    smjumlah = EXCLUDED.smjumlah,
    smjumlahvalas = EXCLUDED.smjumlahvalas,
    smjumlahbayar = EXCLUDED.smjumlahbayar,
    smjumlahbayarvalas = EXCLUDED.smjumlahbayarvalas,
    smstatusbayar = EXCLUDED.smstatusbayar,
    smtgllunas = EXCLUDED.smtgllunas,
    smstatus = EXCLUDED.smstatus,
    smstatussebelumnya = EXCLUDED.smstatussebelumnya,
    smjmlrevisi = EXCLUDED.smjmlrevisi,
    smcetakanke = EXCLUDED.smcetakanke,
    smisclose = EXCLUDED.smisclose,
    smposting = EXCLUDED.smposting,
    smpostingtgl = EXCLUDED.smpostingtgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_sm_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_sm_detail'
)
INSERT INTO m2_sm_detail (
    idsmdetail, idsm, norek, matauang, kurs, jumlah, jumlahvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idsmdetail, idsm, norek, matauang, kurs, jumlah, jumlahvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idsmdetail', '')::bigint AS idsmdetail,
        NULLIF(row_payload ->> 'idsm', '')::bigint AS idsm,
        row_payload ->> 'norek' AS norek,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'jumlah' AS jumlah,
        row_payload ->> 'jumlahvalas' AS jumlahvalas,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idsmdetail') IS NOT NULL
) AS prepared
ON CONFLICT (idsmdetail) DO UPDATE
SET
    idsm = EXCLUDED.idsm,
    norek = EXCLUDED.norek,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    jumlah = EXCLUDED.jumlah,
    jumlahvalas = EXCLUDED.jumlahvalas,
    catatan = EXCLUDED.catatan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    urutan = EXCLUDED.urutan,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_sm_detail_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_sm_detail_history'
)
INSERT INTO m2_sm_detail_history (
    idsmdetailhistory, idsmhistory, idsmdetail, idsm, norek, matauang, kurs, jumlah, jumlahvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idsmdetailhistory, idsmhistory, idsmdetail, idsm, norek, matauang, kurs, jumlah, jumlahvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idsmdetailhistory', '')::bigint AS idsmdetailhistory,
        NULLIF(row_payload ->> 'idsmhistory', '')::bigint AS idsmhistory,
        NULLIF(row_payload ->> 'idsmdetail', '')::bigint AS idsmdetail,
        NULLIF(row_payload ->> 'idsm', '')::bigint AS idsm,
        row_payload ->> 'norek' AS norek,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'jumlah' AS jumlah,
        row_payload ->> 'jumlahvalas' AS jumlahvalas,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idhistorydetail') IS NOT NULL
) AS prepared
ON CONFLICT (idhistorydetail) DO UPDATE
SET
    idsmdetailhistory = EXCLUDED.idsmdetailhistory,
    idsmhistory = EXCLUDED.idsmhistory,
    idsmdetail = EXCLUDED.idsmdetail,
    idsm = EXCLUDED.idsm,
    norek = EXCLUDED.norek,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    jumlah = EXCLUDED.jumlah,
    jumlahvalas = EXCLUDED.jumlahvalas,
    catatan = EXCLUDED.catatan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    urutan = EXCLUDED.urutan,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_sm_pay
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_sm_pay'
)
INSERT INTO m2_sm_pay (
    idsmcarabayar, idsm, carabayar, matauang, kurs, jumlah, jumlahvalas, nogiro, tgljt, bank, noacbank, rekbank, rekgiro, catatan, urutan, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idsmcarabayar, idsm, carabayar, matauang, kurs, jumlah, jumlahvalas, nogiro, tgljt, bank, noacbank, rekbank, rekgiro, catatan, urutan, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idsmcarabayar', '')::bigint AS idsmcarabayar,
        NULLIF(row_payload ->> 'idsm', '')::bigint AS idsm,
        row_payload ->> 'carabayar' AS carabayar,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'jumlah' AS jumlah,
        row_payload ->> 'jumlahvalas' AS jumlahvalas,
        row_payload ->> 'nogiro' AS nogiro,
        NULLIF(row_payload ->> 'tgljt', '')::timestamptz AS tgljt,
        row_payload ->> 'bank' AS bank,
        row_payload ->> 'noacbank' AS noacbank,
        row_payload ->> 'rekbank' AS rekbank,
        row_payload ->> 'rekgiro' AS rekgiro,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idsmcarabayar') IS NOT NULL
) AS prepared
ON CONFLICT (idsmcarabayar) DO UPDATE
SET
    idsm = EXCLUDED.idsm,
    carabayar = EXCLUDED.carabayar,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    jumlah = EXCLUDED.jumlah,
    jumlahvalas = EXCLUDED.jumlahvalas,
    nogiro = EXCLUDED.nogiro,
    tgljt = EXCLUDED.tgljt,
    bank = EXCLUDED.bank,
    noacbank = EXCLUDED.noacbank,
    rekbank = EXCLUDED.rekbank,
    rekgiro = EXCLUDED.rekgiro,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_sm_pay_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_sm_pay_history'
)
INSERT INTO m2_sm_pay_history (
    idsmcarabayarhistory, idsmhistory, idsmcarabayar, idsm, carabayar, matauang, kurs, jumlah, jumlahvalas, nogiro, tgljt, bank, noacbank, rekbank, rekgiro, catatan, urutan, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idsmcarabayarhistory, idsmhistory, idsmcarabayar, idsm, carabayar, matauang, kurs, jumlah, jumlahvalas, nogiro, tgljt, bank, noacbank, rekbank, rekgiro, catatan, urutan, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idsmcarabayarhistory', '')::bigint AS idsmcarabayarhistory,
        NULLIF(row_payload ->> 'idsmhistory', '')::bigint AS idsmhistory,
        NULLIF(row_payload ->> 'idsmcarabayar', '')::bigint AS idsmcarabayar,
        NULLIF(row_payload ->> 'idsm', '')::bigint AS idsm,
        row_payload ->> 'carabayar' AS carabayar,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'jumlah' AS jumlah,
        row_payload ->> 'jumlahvalas' AS jumlahvalas,
        row_payload ->> 'nogiro' AS nogiro,
        NULLIF(row_payload ->> 'tgljt', '')::timestamptz AS tgljt,
        row_payload ->> 'bank' AS bank,
        row_payload ->> 'noacbank' AS noacbank,
        row_payload ->> 'rekbank' AS rekbank,
        row_payload ->> 'rekgiro' AS rekgiro,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idsmcarabayarhistory') IS NOT NULL
) AS prepared
ON CONFLICT (idsmcarabayarhistory) DO UPDATE
SET
    idsmhistory = EXCLUDED.idsmhistory,
    idsmcarabayar = EXCLUDED.idsmcarabayar,
    idsm = EXCLUDED.idsm,
    carabayar = EXCLUDED.carabayar,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    jumlah = EXCLUDED.jumlah,
    jumlahvalas = EXCLUDED.jumlahvalas,
    nogiro = EXCLUDED.nogiro,
    tgljt = EXCLUDED.tgljt,
    bank = EXCLUDED.bank,
    noacbank = EXCLUDED.noacbank,
    rekbank = EXCLUDED.rekbank,
    rekgiro = EXCLUDED.rekgiro,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_sm_history
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_sm_history'
)
INSERT INTO m2_sm_history (
    smidhistory, smid, smcabang, smlokasi, smsumber, smautonotransaksi, smnotransaksi, smtgl, smkodepa, smcarabayar, smkontak, smkontakperson, smnorek, smuraian, smcatatan, smmatauang, smkurs, smjumlah, smjumlahvalas, smjumlahbayar, smjumlahbayarvalas, smstatusbayar, smtgllunas, smstatus, smstatussebelumnya, smjmlrevisi, smcetakanke, smisclose, smposting, smpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    smidhistory, smid, smcabang, smlokasi, smsumber, smautonotransaksi, smnotransaksi, smtgl, smkodepa, smcarabayar, smkontak, smkontakperson, smnorek, smuraian, smcatatan, smmatauang, smkurs, smjumlah, smjumlahvalas, smjumlahbayar, smjumlahbayarvalas, smstatusbayar, smtgllunas, smstatus, smstatussebelumnya, smjmlrevisi, smcetakanke, smisclose, smposting, smpostingtgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'smidhistory', '')::bigint AS smidhistory,
        NULLIF(row_payload ->> 'smid', '')::bigint AS smid,
        row_payload ->> 'smcabang' AS smcabang,
        row_payload ->> 'smlokasi' AS smlokasi,
        row_payload ->> 'smsumber' AS smsumber,
        row_payload ->> 'smautonotransaksi' AS smautonotransaksi,
        row_payload ->> 'smnotransaksi' AS smnotransaksi,
        NULLIF(row_payload ->> 'smtgl', '')::timestamptz AS smtgl,
        row_payload ->> 'smkodepa' AS smkodepa,
        row_payload ->> 'smcarabayar' AS smcarabayar,
        row_payload ->> 'smkontak' AS smkontak,
        row_payload ->> 'smkontakperson' AS smkontakperson,
        row_payload ->> 'smnorek' AS smnorek,
        row_payload ->> 'smuraian' AS smuraian,
        row_payload ->> 'smcatatan' AS smcatatan,
        row_payload ->> 'smmatauang' AS smmatauang,
        NULLIF(row_payload ->> 'smkurs', '')::numeric(20,6) AS smkurs,
        row_payload ->> 'smjumlah' AS smjumlah,
        row_payload ->> 'smjumlahvalas' AS smjumlahvalas,
        row_payload ->> 'smjumlahbayar' AS smjumlahbayar,
        row_payload ->> 'smjumlahbayarvalas' AS smjumlahbayarvalas,
        row_payload ->> 'smstatusbayar' AS smstatusbayar,
        NULLIF(row_payload ->> 'smtgllunas', '')::timestamptz AS smtgllunas,
        row_payload ->> 'smstatus' AS smstatus,
        row_payload ->> 'smstatussebelumnya' AS smstatussebelumnya,
        NULLIF(row_payload ->> 'smjmlrevisi', '')::numeric(20,6) AS smjmlrevisi,
        row_payload ->> 'smcetakanke' AS smcetakanke,
        NULLIF(row_payload ->> 'smisclose', '')::bigint AS smisclose,
        NULLIF(row_payload ->> 'smposting', '')::bigint AS smposting,
        NULLIF(row_payload ->> 'smpostingtgl', '')::timestamptz AS smpostingtgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'smidhistory') IS NOT NULL
) AS prepared
ON CONFLICT (smidhistory) DO UPDATE
SET
    smid = EXCLUDED.smid,
    smcabang = EXCLUDED.smcabang,
    smlokasi = EXCLUDED.smlokasi,
    smsumber = EXCLUDED.smsumber,
    smautonotransaksi = EXCLUDED.smautonotransaksi,
    smnotransaksi = EXCLUDED.smnotransaksi,
    smtgl = EXCLUDED.smtgl,
    smkodepa = EXCLUDED.smkodepa,
    smcarabayar = EXCLUDED.smcarabayar,
    smkontak = EXCLUDED.smkontak,
    smkontakperson = EXCLUDED.smkontakperson,
    smnorek = EXCLUDED.smnorek,
    smuraian = EXCLUDED.smuraian,
    smcatatan = EXCLUDED.smcatatan,
    smmatauang = EXCLUDED.smmatauang,
    smkurs = EXCLUDED.smkurs,
    smjumlah = EXCLUDED.smjumlah,
    smjumlahvalas = EXCLUDED.smjumlahvalas,
    smjumlahbayar = EXCLUDED.smjumlahbayar,
    smjumlahbayarvalas = EXCLUDED.smjumlahbayarvalas,
    smstatusbayar = EXCLUDED.smstatusbayar,
    smtgllunas = EXCLUDED.smtgllunas,
    smstatus = EXCLUDED.smstatus,
    smstatussebelumnya = EXCLUDED.smstatussebelumnya,
    smjmlrevisi = EXCLUDED.smjmlrevisi,
    smcetakanke = EXCLUDED.smcetakanke,
    smisclose = EXCLUDED.smisclose,
    smposting = EXCLUDED.smposting,
    smpostingtgl = EXCLUDED.smpostingtgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m2_transaction_journal
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m2_transaction_journal'
)
INSERT INTO m2_transaction_journal (
    tid, tcabang, tlokasi, tsumber, tkodetabelangka, tidtransaksi, tnotransaksi, ttgl, tkodepa, tkontak, tnorek, turaian, tcatatan, tmatauang, tkurs, tnobon, tdebit, tkredit, tdebitvalas, tkreditvalas, tcarabayar, thutangpiutang, ttgljatuhtempo, ttgllunas, tstatuslunas, ttglrekonsiliasi, tsudahrekonsiliasi, turutan, tnohutangpiutang, tsaldoawal, tadjustment, tcostcenter, tdivisi, tsubdivisi, tproyek, tgrup, tretail, tjenisaruskas, tjmlrealisasium, tstatusrealisasi, tstatus, tposting, tpostingtgl, tjmlrevisi, tcetakanke, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    tid, tcabang, tlokasi, tsumber, tkodetabelangka, tidtransaksi, tnotransaksi, ttgl, tkodepa, tkontak, tnorek, turaian, tcatatan, tmatauang, tkurs, tnobon, tdebit, tkredit, tdebitvalas, tkreditvalas, tcarabayar, thutangpiutang, ttgljatuhtempo, ttgllunas, tstatuslunas, ttglrekonsiliasi, tsudahrekonsiliasi, turutan, tnohutangpiutang, tsaldoawal, tadjustment, tcostcenter, tdivisi, tsubdivisi, tproyek, tgrup, tretail, tjenisaruskas, tjmlrealisasium, tstatusrealisasi, tstatus, tposting, tpostingtgl, tjmlrevisi, tcetakanke, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'tid', '')::bigint AS tid,
        row_payload ->> 'tcabang' AS tcabang,
        row_payload ->> 'tlokasi' AS tlokasi,
        row_payload ->> 'tsumber' AS tsumber,
        row_payload ->> 'tkodetabelangka' AS tkodetabelangka,
        NULLIF(row_payload ->> 'tidtransaksi', '')::bigint AS tidtransaksi,
        row_payload ->> 'tnotransaksi' AS tnotransaksi,
        NULLIF(row_payload ->> 'ttgl', '')::timestamptz AS ttgl,
        row_payload ->> 'tkodepa' AS tkodepa,
        row_payload ->> 'tkontak' AS tkontak,
        row_payload ->> 'tnorek' AS tnorek,
        row_payload ->> 'turaian' AS turaian,
        row_payload ->> 'tcatatan' AS tcatatan,
        row_payload ->> 'tmatauang' AS tmatauang,
        NULLIF(row_payload ->> 'tkurs', '')::numeric(20,6) AS tkurs,
        row_payload ->> 'tnobon' AS tnobon,
        row_payload ->> 'tdebit' AS tdebit,
        row_payload ->> 'tkredit' AS tkredit,
        row_payload ->> 'tdebitvalas' AS tdebitvalas,
        row_payload ->> 'tkreditvalas' AS tkreditvalas,
        row_payload ->> 'tcarabayar' AS tcarabayar,
        row_payload ->> 'thutangpiutang' AS thutangpiutang,
        NULLIF(row_payload ->> 'ttgljatuhtempo', '')::timestamptz AS ttgljatuhtempo,
        NULLIF(row_payload ->> 'ttgllunas', '')::timestamptz AS ttgllunas,
        row_payload ->> 'tstatuslunas' AS tstatuslunas,
        NULLIF(row_payload ->> 'ttglrekonsiliasi', '')::timestamptz AS ttglrekonsiliasi,
        row_payload ->> 'tsudahrekonsiliasi' AS tsudahrekonsiliasi,
        row_payload ->> 'turutan' AS turutan,
        row_payload ->> 'tnohutangpiutang' AS tnohutangpiutang,
        NULLIF(row_payload ->> 'tsaldoawal', '')::numeric(20,6) AS tsaldoawal,
        row_payload ->> 'tadjustment' AS tadjustment,
        row_payload ->> 'tcostcenter' AS tcostcenter,
        row_payload ->> 'tdivisi' AS tdivisi,
        row_payload ->> 'tsubdivisi' AS tsubdivisi,
        row_payload ->> 'tproyek' AS tproyek,
        row_payload ->> 'tgrup' AS tgrup,
        row_payload ->> 'tretail' AS tretail,
        row_payload ->> 'tjenisaruskas' AS tjenisaruskas,
        NULLIF(row_payload ->> 'tjmlrealisasium', '')::numeric(20,6) AS tjmlrealisasium,
        row_payload ->> 'tstatusrealisasi' AS tstatusrealisasi,
        row_payload ->> 'tstatus' AS tstatus,
        NULLIF(row_payload ->> 'tposting', '')::bigint AS tposting,
        NULLIF(row_payload ->> 'tpostingtgl', '')::timestamptz AS tpostingtgl,
        NULLIF(row_payload ->> 'tjmlrevisi', '')::numeric(20,6) AS tjmlrevisi,
        row_payload ->> 'tcetakanke' AS tcetakanke,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'tid') IS NOT NULL
) AS prepared
ON CONFLICT (tid) DO UPDATE
SET
    tcabang = EXCLUDED.tcabang,
    tlokasi = EXCLUDED.tlokasi,
    tsumber = EXCLUDED.tsumber,
    tkodetabelangka = EXCLUDED.tkodetabelangka,
    tidtransaksi = EXCLUDED.tidtransaksi,
    tnotransaksi = EXCLUDED.tnotransaksi,
    ttgl = EXCLUDED.ttgl,
    tkodepa = EXCLUDED.tkodepa,
    tkontak = EXCLUDED.tkontak,
    tnorek = EXCLUDED.tnorek,
    turaian = EXCLUDED.turaian,
    tcatatan = EXCLUDED.tcatatan,
    tmatauang = EXCLUDED.tmatauang,
    tkurs = EXCLUDED.tkurs,
    tnobon = EXCLUDED.tnobon,
    tdebit = EXCLUDED.tdebit,
    tkredit = EXCLUDED.tkredit,
    tdebitvalas = EXCLUDED.tdebitvalas,
    tkreditvalas = EXCLUDED.tkreditvalas,
    tcarabayar = EXCLUDED.tcarabayar,
    thutangpiutang = EXCLUDED.thutangpiutang,
    ttgljatuhtempo = EXCLUDED.ttgljatuhtempo,
    ttgllunas = EXCLUDED.ttgllunas,
    tstatuslunas = EXCLUDED.tstatuslunas,
    ttglrekonsiliasi = EXCLUDED.ttglrekonsiliasi,
    tsudahrekonsiliasi = EXCLUDED.tsudahrekonsiliasi,
    turutan = EXCLUDED.turutan,
    tnohutangpiutang = EXCLUDED.tnohutangpiutang,
    tsaldoawal = EXCLUDED.tsaldoawal,
    tadjustment = EXCLUDED.tadjustment,
    tcostcenter = EXCLUDED.tcostcenter,
    tdivisi = EXCLUDED.tdivisi,
    tsubdivisi = EXCLUDED.tsubdivisi,
    tproyek = EXCLUDED.tproyek,
    tgrup = EXCLUDED.tgrup,
    tretail = EXCLUDED.tretail,
    tjenisaruskas = EXCLUDED.tjenisaruskas,
    tjmlrealisasium = EXCLUDED.tjmlrealisasium,
    tstatusrealisasi = EXCLUDED.tstatusrealisasi,
    tstatus = EXCLUDED.tstatus,
    tposting = EXCLUDED.tposting,
    tpostingtgl = EXCLUDED.tpostingtgl,
    tjmlrevisi = EXCLUDED.tjmlrevisi,
    tcetakanke = EXCLUDED.tcetakanke,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m3_sa
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m3_sa'
)
INSERT INTO m3_sa (
    said, sacabang, salokasi, sagudang, sasumber, sajenis, saautonotransaksi, sanotransaksi, satgl, sakodepa, sabagiansa, sabagiansakontak, sauraian, sacatatan, sanoref, satglnoref, saidsp, sastatus, sastatussebelumnya, sajmlrevisi, sacetakanke, saposting, sapostingtgl, satutupperiode, saisclose, sauploaded, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    said, sacabang, salokasi, sagudang, sasumber, sajenis, saautonotransaksi, sanotransaksi, satgl, sakodepa, sabagiansa, sabagiansakontak, sauraian, sacatatan, sanoref, satglnoref, saidsp, sastatus, sastatussebelumnya, sajmlrevisi, sacetakanke, saposting, sapostingtgl, satutupperiode, saisclose, sauploaded, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'said', '')::bigint AS said,
        row_payload ->> 'sacabang' AS sacabang,
        row_payload ->> 'salokasi' AS salokasi,
        row_payload ->> 'sagudang' AS sagudang,
        row_payload ->> 'sasumber' AS sasumber,
        row_payload ->> 'sajenis' AS sajenis,
        row_payload ->> 'saautonotransaksi' AS saautonotransaksi,
        row_payload ->> 'sanotransaksi' AS sanotransaksi,
        NULLIF(row_payload ->> 'satgl', '')::timestamptz AS satgl,
        row_payload ->> 'sakodepa' AS sakodepa,
        row_payload ->> 'sabagiansa' AS sabagiansa,
        row_payload ->> 'sabagiansakontak' AS sabagiansakontak,
        row_payload ->> 'sauraian' AS sauraian,
        row_payload ->> 'sacatatan' AS sacatatan,
        row_payload ->> 'sanoref' AS sanoref,
        NULLIF(row_payload ->> 'satglnoref', '')::timestamptz AS satglnoref,
        NULLIF(row_payload ->> 'saidsp', '')::bigint AS saidsp,
        row_payload ->> 'sastatus' AS sastatus,
        row_payload ->> 'sastatussebelumnya' AS sastatussebelumnya,
        NULLIF(row_payload ->> 'sajmlrevisi', '')::numeric(20,6) AS sajmlrevisi,
        row_payload ->> 'sacetakanke' AS sacetakanke,
        NULLIF(row_payload ->> 'saposting', '')::bigint AS saposting,
        NULLIF(row_payload ->> 'sapostingtgl', '')::timestamptz AS sapostingtgl,
        row_payload ->> 'satutupperiode' AS satutupperiode,
        NULLIF(row_payload ->> 'saisclose', '')::bigint AS saisclose,
        row_payload ->> 'sauploaded' AS sauploaded,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'said') IS NOT NULL
) AS prepared
ON CONFLICT (said) DO UPDATE
SET
    sacabang = EXCLUDED.sacabang,
    salokasi = EXCLUDED.salokasi,
    sagudang = EXCLUDED.sagudang,
    sasumber = EXCLUDED.sasumber,
    sajenis = EXCLUDED.sajenis,
    saautonotransaksi = EXCLUDED.saautonotransaksi,
    sanotransaksi = EXCLUDED.sanotransaksi,
    satgl = EXCLUDED.satgl,
    sakodepa = EXCLUDED.sakodepa,
    sabagiansa = EXCLUDED.sabagiansa,
    sabagiansakontak = EXCLUDED.sabagiansakontak,
    sauraian = EXCLUDED.sauraian,
    sacatatan = EXCLUDED.sacatatan,
    sanoref = EXCLUDED.sanoref,
    satglnoref = EXCLUDED.satglnoref,
    saidsp = EXCLUDED.saidsp,
    sastatus = EXCLUDED.sastatus,
    sastatussebelumnya = EXCLUDED.sastatussebelumnya,
    sajmlrevisi = EXCLUDED.sajmlrevisi,
    sacetakanke = EXCLUDED.sacetakanke,
    saposting = EXCLUDED.saposting,
    sapostingtgl = EXCLUDED.sapostingtgl,
    satutupperiode = EXCLUDED.satutupperiode,
    saisclose = EXCLUDED.saisclose,
    sauploaded = EXCLUDED.sauploaded,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m3_sa_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m3_sa_detail'
)
INSERT INTO m3_sa_detail (
    idsadetail, idsa, idbarang, namabarang, tipebarang, jmlmasuk, jmlkeluar, satuan, nilaisatuan, jmlbarangmasuk, jmlbarangkeluar, satuanbarang, idhppkhususmasuk, hpplama, hpp, rekpersediaan, reklawan, idspdetail, cabang, lokasi, gudang, costcenter, divisi, subdivisi, proyek, catatan, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idsadetail, idsa, idbarang, namabarang, tipebarang, jmlmasuk, jmlkeluar, satuan, nilaisatuan, jmlbarangmasuk, jmlbarangkeluar, satuanbarang, idhppkhususmasuk, hpplama, hpp, rekpersediaan, reklawan, idspdetail, cabang, lokasi, gudang, costcenter, divisi, subdivisi, proyek, catatan, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idsadetail', '')::bigint AS idsadetail,
        NULLIF(row_payload ->> 'idsa', '')::bigint AS idsa,
        NULLIF(row_payload ->> 'idbarang', '')::bigint AS idbarang,
        row_payload ->> 'namabarang' AS namabarang,
        row_payload ->> 'tipebarang' AS tipebarang,
        NULLIF(row_payload ->> 'jmlmasuk', '')::numeric(20,6) AS jmlmasuk,
        NULLIF(row_payload ->> 'jmlkeluar', '')::numeric(20,6) AS jmlkeluar,
        row_payload ->> 'satuan' AS satuan,
        NULLIF(row_payload ->> 'nilaisatuan', '')::numeric(20,6) AS nilaisatuan,
        NULLIF(row_payload ->> 'jmlbarangmasuk', '')::numeric(20,6) AS jmlbarangmasuk,
        NULLIF(row_payload ->> 'jmlbarangkeluar', '')::numeric(20,6) AS jmlbarangkeluar,
        row_payload ->> 'satuanbarang' AS satuanbarang,
        NULLIF(row_payload ->> 'idhppkhususmasuk', '')::bigint AS idhppkhususmasuk,
        row_payload ->> 'hpplama' AS hpplama,
        row_payload ->> 'hpp' AS hpp,
        row_payload ->> 'rekpersediaan' AS rekpersediaan,
        row_payload ->> 'reklawan' AS reklawan,
        NULLIF(row_payload ->> 'idspdetail', '')::bigint AS idspdetail,
        row_payload ->> 'cabang' AS cabang,
        row_payload ->> 'lokasi' AS lokasi,
        row_payload ->> 'gudang' AS gudang,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idsadetail') IS NOT NULL
) AS prepared
ON CONFLICT (idsadetail) DO UPDATE
SET
    idsa = EXCLUDED.idsa,
    idbarang = EXCLUDED.idbarang,
    namabarang = EXCLUDED.namabarang,
    tipebarang = EXCLUDED.tipebarang,
    jmlmasuk = EXCLUDED.jmlmasuk,
    jmlkeluar = EXCLUDED.jmlkeluar,
    satuan = EXCLUDED.satuan,
    nilaisatuan = EXCLUDED.nilaisatuan,
    jmlbarangmasuk = EXCLUDED.jmlbarangmasuk,
    jmlbarangkeluar = EXCLUDED.jmlbarangkeluar,
    satuanbarang = EXCLUDED.satuanbarang,
    idhppkhususmasuk = EXCLUDED.idhppkhususmasuk,
    hpplama = EXCLUDED.hpplama,
    hpp = EXCLUDED.hpp,
    rekpersediaan = EXCLUDED.rekpersediaan,
    reklawan = EXCLUDED.reklawan,
    idspdetail = EXCLUDED.idspdetail,
    cabang = EXCLUDED.cabang,
    lokasi = EXCLUDED.lokasi,
    gudang = EXCLUDED.gudang,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m3_mr
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m3_mr'
)
INSERT INTO m3_mr (
    mrid, mrcabang, mrlokasi, mrgudangasal, mrgudangtujuan, mrsumber, mrautonotransaksi, mrnotransaksi, mrtgl, mrkodepa, mrdimintaoleh, mrdimintaolehkontak, mrmintake, mrtgldipakai, mruraian, mrcatatan, mrnoref, mrtglnoref, mrstatusts, mrstatusrs, mrstatusrealisasi, mrstatus, mrstatussebelumnya, mrjmlrevisi, mrcetakanke, mrposting, mrpostingtgl, mrisclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    mrid, mrcabang, mrlokasi, mrgudangasal, mrgudangtujuan, mrsumber, mrautonotransaksi, mrnotransaksi, mrtgl, mrkodepa, mrdimintaoleh, mrdimintaolehkontak, mrmintake, mrtgldipakai, mruraian, mrcatatan, mrnoref, mrtglnoref, mrstatusts, mrstatusrs, mrstatusrealisasi, mrstatus, mrstatussebelumnya, mrjmlrevisi, mrcetakanke, mrposting, mrpostingtgl, mrisclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'mrid', '')::bigint AS mrid,
        row_payload ->> 'mrcabang' AS mrcabang,
        row_payload ->> 'mrlokasi' AS mrlokasi,
        row_payload ->> 'mrgudangasal' AS mrgudangasal,
        row_payload ->> 'mrgudangtujuan' AS mrgudangtujuan,
        row_payload ->> 'mrsumber' AS mrsumber,
        row_payload ->> 'mrautonotransaksi' AS mrautonotransaksi,
        row_payload ->> 'mrnotransaksi' AS mrnotransaksi,
        NULLIF(row_payload ->> 'mrtgl', '')::timestamptz AS mrtgl,
        row_payload ->> 'mrkodepa' AS mrkodepa,
        row_payload ->> 'mrdimintaoleh' AS mrdimintaoleh,
        row_payload ->> 'mrdimintaolehkontak' AS mrdimintaolehkontak,
        row_payload ->> 'mrmintake' AS mrmintake,
        NULLIF(row_payload ->> 'mrtgldipakai', '')::timestamptz AS mrtgldipakai,
        row_payload ->> 'mruraian' AS mruraian,
        row_payload ->> 'mrcatatan' AS mrcatatan,
        row_payload ->> 'mrnoref' AS mrnoref,
        NULLIF(row_payload ->> 'mrtglnoref', '')::timestamptz AS mrtglnoref,
        row_payload ->> 'mrstatusts' AS mrstatusts,
        row_payload ->> 'mrstatusrs' AS mrstatusrs,
        row_payload ->> 'mrstatusrealisasi' AS mrstatusrealisasi,
        row_payload ->> 'mrstatus' AS mrstatus,
        row_payload ->> 'mrstatussebelumnya' AS mrstatussebelumnya,
        NULLIF(row_payload ->> 'mrjmlrevisi', '')::numeric(20,6) AS mrjmlrevisi,
        row_payload ->> 'mrcetakanke' AS mrcetakanke,
        NULLIF(row_payload ->> 'mrposting', '')::bigint AS mrposting,
        NULLIF(row_payload ->> 'mrpostingtgl', '')::timestamptz AS mrpostingtgl,
        NULLIF(row_payload ->> 'mrisclose', '')::bigint AS mrisclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'mrid') IS NOT NULL
) AS prepared
ON CONFLICT (mrid) DO UPDATE
SET
    mrcabang = EXCLUDED.mrcabang,
    mrlokasi = EXCLUDED.mrlokasi,
    mrgudangasal = EXCLUDED.mrgudangasal,
    mrgudangtujuan = EXCLUDED.mrgudangtujuan,
    mrsumber = EXCLUDED.mrsumber,
    mrautonotransaksi = EXCLUDED.mrautonotransaksi,
    mrnotransaksi = EXCLUDED.mrnotransaksi,
    mrtgl = EXCLUDED.mrtgl,
    mrkodepa = EXCLUDED.mrkodepa,
    mrdimintaoleh = EXCLUDED.mrdimintaoleh,
    mrdimintaolehkontak = EXCLUDED.mrdimintaolehkontak,
    mrmintake = EXCLUDED.mrmintake,
    mrtgldipakai = EXCLUDED.mrtgldipakai,
    mruraian = EXCLUDED.mruraian,
    mrcatatan = EXCLUDED.mrcatatan,
    mrnoref = EXCLUDED.mrnoref,
    mrtglnoref = EXCLUDED.mrtglnoref,
    mrstatusts = EXCLUDED.mrstatusts,
    mrstatusrs = EXCLUDED.mrstatusrs,
    mrstatusrealisasi = EXCLUDED.mrstatusrealisasi,
    mrstatus = EXCLUDED.mrstatus,
    mrstatussebelumnya = EXCLUDED.mrstatussebelumnya,
    mrjmlrevisi = EXCLUDED.mrjmlrevisi,
    mrcetakanke = EXCLUDED.mrcetakanke,
    mrposting = EXCLUDED.mrposting,
    mrpostingtgl = EXCLUDED.mrpostingtgl,
    mrisclose = EXCLUDED.mrisclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m3_mr_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m3_mr_detail'
)
INSERT INTO m3_mr_detail (
    idmrdetail, idmr, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, hargabeli, hargajual, stokterakhir, cabang, lokasi, gudangasal, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, jmlts, statusts, jmlrs, statusrs, jmlrealisasi, statusrealisasi, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idmrdetail, idmr, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, hargabeli, hargajual, stokterakhir, cabang, lokasi, gudangasal, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, jmlts, statusts, jmlrs, statusrs, jmlrealisasi, statusrealisasi, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idmrdetail', '')::bigint AS idmrdetail,
        NULLIF(row_payload ->> 'idmr', '')::bigint AS idmr,
        NULLIF(row_payload ->> 'idbarang', '')::bigint AS idbarang,
        row_payload ->> 'namabarang' AS namabarang,
        row_payload ->> 'tipebarang' AS tipebarang,
        NULLIF(row_payload ->> 'jml', '')::numeric(20,6) AS jml,
        row_payload ->> 'satuan' AS satuan,
        NULLIF(row_payload ->> 'nilaisatuan', '')::numeric(20,6) AS nilaisatuan,
        NULLIF(row_payload ->> 'jmlbarang', '')::numeric(20,6) AS jmlbarang,
        row_payload ->> 'satuanbarang' AS satuanbarang,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        NULLIF(row_payload ->> 'hargabeli', '')::numeric(20,6) AS hargabeli,
        NULLIF(row_payload ->> 'hargajual', '')::numeric(20,6) AS hargajual,
        row_payload ->> 'stokterakhir' AS stokterakhir,
        row_payload ->> 'cabang' AS cabang,
        row_payload ->> 'lokasi' AS lokasi,
        row_payload ->> 'gudangasal' AS gudangasal,
        row_payload ->> 'gudangtujuan' AS gudangtujuan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'jmlts', '')::numeric(20,6) AS jmlts,
        NULLIF(row_payload ->> 'statusts', '')::bigint AS statusts,
        NULLIF(row_payload ->> 'jmlrs', '')::numeric(20,6) AS jmlrs,
        NULLIF(row_payload ->> 'statusrs', '')::bigint AS statusrs,
        NULLIF(row_payload ->> 'jmlrealisasi', '')::numeric(20,6) AS jmlrealisasi,
        NULLIF(row_payload ->> 'statusrealisasi', '')::bigint AS statusrealisasi,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idmrdetail') IS NOT NULL
) AS prepared
ON CONFLICT (idmrdetail) DO UPDATE
SET
    idmr = EXCLUDED.idmr,
    idbarang = EXCLUDED.idbarang,
    namabarang = EXCLUDED.namabarang,
    tipebarang = EXCLUDED.tipebarang,
    jml = EXCLUDED.jml,
    satuan = EXCLUDED.satuan,
    nilaisatuan = EXCLUDED.nilaisatuan,
    jmlbarang = EXCLUDED.jmlbarang,
    satuanbarang = EXCLUDED.satuanbarang,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    hargabeli = EXCLUDED.hargabeli,
    hargajual = EXCLUDED.hargajual,
    stokterakhir = EXCLUDED.stokterakhir,
    cabang = EXCLUDED.cabang,
    lokasi = EXCLUDED.lokasi,
    gudangasal = EXCLUDED.gudangasal,
    gudangtujuan = EXCLUDED.gudangtujuan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    jmlts = EXCLUDED.jmlts,
    statusts = EXCLUDED.statusts,
    jmlrs = EXCLUDED.jmlrs,
    statusrs = EXCLUDED.statusrs,
    jmlrealisasi = EXCLUDED.jmlrealisasi,
    statusrealisasi = EXCLUDED.statusrealisasi,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m3_rs
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m3_rs'
)
INSERT INTO m3_rs (
    rsid, rscabang, rslokasi, rsgudangasal, rsgudangtransit, rsgudangtujuan, rssumber, rsautonotransaksi, rsnotransaksi, rstgl, rskodepa, rsbagianterima, rsbagianterimakontak, rsuraian, rscatatan, rsnoref, rstglnoref, rsidmr, rsidts, rsstatus, rsstatussebelumnya, rsjmlrevisi, rscetakanke, rsposting, rspostingtgl, rsisclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    rsid, rscabang, rslokasi, rsgudangasal, rsgudangtransit, rsgudangtujuan, rssumber, rsautonotransaksi, rsnotransaksi, rstgl, rskodepa, rsbagianterima, rsbagianterimakontak, rsuraian, rscatatan, rsnoref, rstglnoref, rsidmr, rsidts, rsstatus, rsstatussebelumnya, rsjmlrevisi, rscetakanke, rsposting, rspostingtgl, rsisclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'rsid', '')::bigint AS rsid,
        row_payload ->> 'rscabang' AS rscabang,
        row_payload ->> 'rslokasi' AS rslokasi,
        row_payload ->> 'rsgudangasal' AS rsgudangasal,
        row_payload ->> 'rsgudangtransit' AS rsgudangtransit,
        row_payload ->> 'rsgudangtujuan' AS rsgudangtujuan,
        row_payload ->> 'rssumber' AS rssumber,
        row_payload ->> 'rsautonotransaksi' AS rsautonotransaksi,
        row_payload ->> 'rsnotransaksi' AS rsnotransaksi,
        NULLIF(row_payload ->> 'rstgl', '')::timestamptz AS rstgl,
        row_payload ->> 'rskodepa' AS rskodepa,
        row_payload ->> 'rsbagianterima' AS rsbagianterima,
        row_payload ->> 'rsbagianterimakontak' AS rsbagianterimakontak,
        row_payload ->> 'rsuraian' AS rsuraian,
        row_payload ->> 'rscatatan' AS rscatatan,
        row_payload ->> 'rsnoref' AS rsnoref,
        NULLIF(row_payload ->> 'rstglnoref', '')::timestamptz AS rstglnoref,
        NULLIF(row_payload ->> 'rsidmr', '')::bigint AS rsidmr,
        NULLIF(row_payload ->> 'rsidts', '')::bigint AS rsidts,
        row_payload ->> 'rsstatus' AS rsstatus,
        row_payload ->> 'rsstatussebelumnya' AS rsstatussebelumnya,
        NULLIF(row_payload ->> 'rsjmlrevisi', '')::numeric(20,6) AS rsjmlrevisi,
        row_payload ->> 'rscetakanke' AS rscetakanke,
        NULLIF(row_payload ->> 'rsposting', '')::bigint AS rsposting,
        NULLIF(row_payload ->> 'rspostingtgl', '')::timestamptz AS rspostingtgl,
        NULLIF(row_payload ->> 'rsisclose', '')::bigint AS rsisclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'rsid') IS NOT NULL
) AS prepared
ON CONFLICT (rsid) DO UPDATE
SET
    rscabang = EXCLUDED.rscabang,
    rslokasi = EXCLUDED.rslokasi,
    rsgudangasal = EXCLUDED.rsgudangasal,
    rsgudangtransit = EXCLUDED.rsgudangtransit,
    rsgudangtujuan = EXCLUDED.rsgudangtujuan,
    rssumber = EXCLUDED.rssumber,
    rsautonotransaksi = EXCLUDED.rsautonotransaksi,
    rsnotransaksi = EXCLUDED.rsnotransaksi,
    rstgl = EXCLUDED.rstgl,
    rskodepa = EXCLUDED.rskodepa,
    rsbagianterima = EXCLUDED.rsbagianterima,
    rsbagianterimakontak = EXCLUDED.rsbagianterimakontak,
    rsuraian = EXCLUDED.rsuraian,
    rscatatan = EXCLUDED.rscatatan,
    rsnoref = EXCLUDED.rsnoref,
    rstglnoref = EXCLUDED.rstglnoref,
    rsidmr = EXCLUDED.rsidmr,
    rsidts = EXCLUDED.rsidts,
    rsstatus = EXCLUDED.rsstatus,
    rsstatussebelumnya = EXCLUDED.rsstatussebelumnya,
    rsjmlrevisi = EXCLUDED.rsjmlrevisi,
    rscetakanke = EXCLUDED.rscetakanke,
    rsposting = EXCLUDED.rsposting,
    rspostingtgl = EXCLUDED.rspostingtgl,
    rsisclose = EXCLUDED.rsisclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m3_rs_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m3_rs_detail'
)
INSERT INTO m3_rs_detail (
    idrsdetail, idrs, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, cabang, lokasi, gudangasal, gudangtransit, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idmrdetail, idtsdetail, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idrsdetail, idrs, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, cabang, lokasi, gudangasal, gudangtransit, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idmrdetail, idtsdetail, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idrsdetail', '')::bigint AS idrsdetail,
        NULLIF(row_payload ->> 'idrs', '')::bigint AS idrs,
        NULLIF(row_payload ->> 'idbarang', '')::bigint AS idbarang,
        row_payload ->> 'namabarang' AS namabarang,
        row_payload ->> 'tipebarang' AS tipebarang,
        NULLIF(row_payload ->> 'jml', '')::numeric(20,6) AS jml,
        row_payload ->> 'satuan' AS satuan,
        NULLIF(row_payload ->> 'nilaisatuan', '')::numeric(20,6) AS nilaisatuan,
        NULLIF(row_payload ->> 'jmlbarang', '')::numeric(20,6) AS jmlbarang,
        row_payload ->> 'satuanbarang' AS satuanbarang,
        row_payload ->> 'cabang' AS cabang,
        row_payload ->> 'lokasi' AS lokasi,
        row_payload ->> 'gudangasal' AS gudangasal,
        row_payload ->> 'gudangtransit' AS gudangtransit,
        row_payload ->> 'gudangtujuan' AS gudangtujuan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'idmrdetail', '')::bigint AS idmrdetail,
        NULLIF(row_payload ->> 'idtsdetail', '')::bigint AS idtsdetail,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idrsdetail') IS NOT NULL
) AS prepared
ON CONFLICT (idrsdetail) DO UPDATE
SET
    idrs = EXCLUDED.idrs,
    idbarang = EXCLUDED.idbarang,
    namabarang = EXCLUDED.namabarang,
    tipebarang = EXCLUDED.tipebarang,
    jml = EXCLUDED.jml,
    satuan = EXCLUDED.satuan,
    nilaisatuan = EXCLUDED.nilaisatuan,
    jmlbarang = EXCLUDED.jmlbarang,
    satuanbarang = EXCLUDED.satuanbarang,
    cabang = EXCLUDED.cabang,
    lokasi = EXCLUDED.lokasi,
    gudangasal = EXCLUDED.gudangasal,
    gudangtransit = EXCLUDED.gudangtransit,
    gudangtujuan = EXCLUDED.gudangtujuan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    idmrdetail = EXCLUDED.idmrdetail,
    idtsdetail = EXCLUDED.idtsdetail,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m3_sp
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m3_sp'
)
INSERT INTO m3_sp (
    spid, spcabang, splokasi, spgudang, spsumber, spautonotransaksi, spnotransaksi, sptgl, spkodepa, spbagiansp, spbagianspkontak, spuraian, spcatatan, spnoref, sptglnoref, spstatussa, spstatus, spstatussebelumnya, spjmlrevisi, spcetakanke, spposting, sppostingtgl, sptutupperiode, spisclose, spstepke, spuploaded, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    spid, spcabang, splokasi, spgudang, spsumber, spautonotransaksi, spnotransaksi, sptgl, spkodepa, spbagiansp, spbagianspkontak, spuraian, spcatatan, spnoref, sptglnoref, spstatussa, spstatus, spstatussebelumnya, spjmlrevisi, spcetakanke, spposting, sppostingtgl, sptutupperiode, spisclose, spstepke, spuploaded, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'spid', '')::bigint AS spid,
        row_payload ->> 'spcabang' AS spcabang,
        row_payload ->> 'splokasi' AS splokasi,
        row_payload ->> 'spgudang' AS spgudang,
        row_payload ->> 'spsumber' AS spsumber,
        row_payload ->> 'spautonotransaksi' AS spautonotransaksi,
        row_payload ->> 'spnotransaksi' AS spnotransaksi,
        NULLIF(row_payload ->> 'sptgl', '')::timestamptz AS sptgl,
        row_payload ->> 'spkodepa' AS spkodepa,
        row_payload ->> 'spbagiansp' AS spbagiansp,
        row_payload ->> 'spbagianspkontak' AS spbagianspkontak,
        row_payload ->> 'spuraian' AS spuraian,
        row_payload ->> 'spcatatan' AS spcatatan,
        row_payload ->> 'spnoref' AS spnoref,
        NULLIF(row_payload ->> 'sptglnoref', '')::timestamptz AS sptglnoref,
        row_payload ->> 'spstatussa' AS spstatussa,
        row_payload ->> 'spstatus' AS spstatus,
        row_payload ->> 'spstatussebelumnya' AS spstatussebelumnya,
        NULLIF(row_payload ->> 'spjmlrevisi', '')::numeric(20,6) AS spjmlrevisi,
        row_payload ->> 'spcetakanke' AS spcetakanke,
        NULLIF(row_payload ->> 'spposting', '')::bigint AS spposting,
        NULLIF(row_payload ->> 'sppostingtgl', '')::timestamptz AS sppostingtgl,
        row_payload ->> 'sptutupperiode' AS sptutupperiode,
        NULLIF(row_payload ->> 'spisclose', '')::bigint AS spisclose,
        row_payload ->> 'spstepke' AS spstepke,
        row_payload ->> 'spuploaded' AS spuploaded,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'spid') IS NOT NULL
) AS prepared
ON CONFLICT (spid) DO UPDATE
SET
    spcabang = EXCLUDED.spcabang,
    splokasi = EXCLUDED.splokasi,
    spgudang = EXCLUDED.spgudang,
    spsumber = EXCLUDED.spsumber,
    spautonotransaksi = EXCLUDED.spautonotransaksi,
    spnotransaksi = EXCLUDED.spnotransaksi,
    sptgl = EXCLUDED.sptgl,
    spkodepa = EXCLUDED.spkodepa,
    spbagiansp = EXCLUDED.spbagiansp,
    spbagianspkontak = EXCLUDED.spbagianspkontak,
    spuraian = EXCLUDED.spuraian,
    spcatatan = EXCLUDED.spcatatan,
    spnoref = EXCLUDED.spnoref,
    sptglnoref = EXCLUDED.sptglnoref,
    spstatussa = EXCLUDED.spstatussa,
    spstatus = EXCLUDED.spstatus,
    spstatussebelumnya = EXCLUDED.spstatussebelumnya,
    spjmlrevisi = EXCLUDED.spjmlrevisi,
    spcetakanke = EXCLUDED.spcetakanke,
    spposting = EXCLUDED.spposting,
    sppostingtgl = EXCLUDED.sppostingtgl,
    sptutupperiode = EXCLUDED.sptutupperiode,
    spisclose = EXCLUDED.spisclose,
    spstepke = EXCLUDED.spstepke,
    spuploaded = EXCLUDED.spuploaded,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m3_sp_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m3_sp_detail'
)
INSERT INTO m3_sp_detail (
    idspdetail, idsp, idbarang, namabarang, tipebarang, jmlsistem, jmlfisik, jmlbagus, jmlrusak, selisih, satuan, nilaisatuan, jmlbarangsistem, jmlbarangfisik, jmlbarangbagus, jmlbarangrusak, selisihbarang, satuanbarang, cabang, lokasi, gudang, lokasibarang, jmlsa, statussa, costcenter, divisi, subdivisi, proyek, catatan, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idspdetail, idsp, idbarang, namabarang, tipebarang, jmlsistem, jmlfisik, jmlbagus, jmlrusak, selisih, satuan, nilaisatuan, jmlbarangsistem, jmlbarangfisik, jmlbarangbagus, jmlbarangrusak, selisihbarang, satuanbarang, cabang, lokasi, gudang, lokasibarang, jmlsa, statussa, costcenter, divisi, subdivisi, proyek, catatan, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idspdetail', '')::bigint AS idspdetail,
        NULLIF(row_payload ->> 'idsp', '')::bigint AS idsp,
        NULLIF(row_payload ->> 'idbarang', '')::bigint AS idbarang,
        row_payload ->> 'namabarang' AS namabarang,
        row_payload ->> 'tipebarang' AS tipebarang,
        NULLIF(row_payload ->> 'jmlsistem', '')::numeric(20,6) AS jmlsistem,
        NULLIF(row_payload ->> 'jmlfisik', '')::numeric(20,6) AS jmlfisik,
        NULLIF(row_payload ->> 'jmlbagus', '')::numeric(20,6) AS jmlbagus,
        NULLIF(row_payload ->> 'jmlrusak', '')::numeric(20,6) AS jmlrusak,
        row_payload ->> 'selisih' AS selisih,
        row_payload ->> 'satuan' AS satuan,
        NULLIF(row_payload ->> 'nilaisatuan', '')::numeric(20,6) AS nilaisatuan,
        NULLIF(row_payload ->> 'jmlbarangsistem', '')::numeric(20,6) AS jmlbarangsistem,
        NULLIF(row_payload ->> 'jmlbarangfisik', '')::numeric(20,6) AS jmlbarangfisik,
        NULLIF(row_payload ->> 'jmlbarangbagus', '')::numeric(20,6) AS jmlbarangbagus,
        NULLIF(row_payload ->> 'jmlbarangrusak', '')::numeric(20,6) AS jmlbarangrusak,
        row_payload ->> 'selisihbarang' AS selisihbarang,
        row_payload ->> 'satuanbarang' AS satuanbarang,
        row_payload ->> 'cabang' AS cabang,
        row_payload ->> 'lokasi' AS lokasi,
        row_payload ->> 'gudang' AS gudang,
        row_payload ->> 'lokasibarang' AS lokasibarang,
        NULLIF(row_payload ->> 'jmlsa', '')::numeric(20,6) AS jmlsa,
        NULLIF(row_payload ->> 'statussa', '')::bigint AS statussa,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idspdetail') IS NOT NULL
) AS prepared
ON CONFLICT (idspdetail) DO UPDATE
SET
    idsp = EXCLUDED.idsp,
    idbarang = EXCLUDED.idbarang,
    namabarang = EXCLUDED.namabarang,
    tipebarang = EXCLUDED.tipebarang,
    jmlsistem = EXCLUDED.jmlsistem,
    jmlfisik = EXCLUDED.jmlfisik,
    jmlbagus = EXCLUDED.jmlbagus,
    jmlrusak = EXCLUDED.jmlrusak,
    selisih = EXCLUDED.selisih,
    satuan = EXCLUDED.satuan,
    nilaisatuan = EXCLUDED.nilaisatuan,
    jmlbarangsistem = EXCLUDED.jmlbarangsistem,
    jmlbarangfisik = EXCLUDED.jmlbarangfisik,
    jmlbarangbagus = EXCLUDED.jmlbarangbagus,
    jmlbarangrusak = EXCLUDED.jmlbarangrusak,
    selisihbarang = EXCLUDED.selisihbarang,
    satuanbarang = EXCLUDED.satuanbarang,
    cabang = EXCLUDED.cabang,
    lokasi = EXCLUDED.lokasi,
    gudang = EXCLUDED.gudang,
    lokasibarang = EXCLUDED.lokasibarang,
    jmlsa = EXCLUDED.jmlsa,
    statussa = EXCLUDED.statussa,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m3_ts
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m3_ts'
)
INSERT INTO m3_ts (
    tsid, tscabang, tslokasi, tsjenis, tsgudangasal, tsgudangtransit, tsgudangtujuan, tssumber, tsautonotransaksi, tsnotransaksi, tstgl, tskodepa, tsbagianmutasi, tsbagianmutasikontak, tsuraian, tscatatan, tsnoref, tstglnoref, tsidmr, tsstatusrs, tsstatusrealisasi, tsstatus, tsstatussebelumnya, tsjmlrevisi, tscetakanke, tsposting, tspostingtgl, tsisclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    tsid, tscabang, tslokasi, tsjenis, tsgudangasal, tsgudangtransit, tsgudangtujuan, tssumber, tsautonotransaksi, tsnotransaksi, tstgl, tskodepa, tsbagianmutasi, tsbagianmutasikontak, tsuraian, tscatatan, tsnoref, tstglnoref, tsidmr, tsstatusrs, tsstatusrealisasi, tsstatus, tsstatussebelumnya, tsjmlrevisi, tscetakanke, tsposting, tspostingtgl, tsisclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'tsid', '')::bigint AS tsid,
        row_payload ->> 'tscabang' AS tscabang,
        row_payload ->> 'tslokasi' AS tslokasi,
        row_payload ->> 'tsjenis' AS tsjenis,
        row_payload ->> 'tsgudangasal' AS tsgudangasal,
        row_payload ->> 'tsgudangtransit' AS tsgudangtransit,
        row_payload ->> 'tsgudangtujuan' AS tsgudangtujuan,
        row_payload ->> 'tssumber' AS tssumber,
        row_payload ->> 'tsautonotransaksi' AS tsautonotransaksi,
        row_payload ->> 'tsnotransaksi' AS tsnotransaksi,
        NULLIF(row_payload ->> 'tstgl', '')::timestamptz AS tstgl,
        row_payload ->> 'tskodepa' AS tskodepa,
        row_payload ->> 'tsbagianmutasi' AS tsbagianmutasi,
        row_payload ->> 'tsbagianmutasikontak' AS tsbagianmutasikontak,
        row_payload ->> 'tsuraian' AS tsuraian,
        row_payload ->> 'tscatatan' AS tscatatan,
        row_payload ->> 'tsnoref' AS tsnoref,
        NULLIF(row_payload ->> 'tstglnoref', '')::timestamptz AS tstglnoref,
        NULLIF(row_payload ->> 'tsidmr', '')::bigint AS tsidmr,
        row_payload ->> 'tsstatusrs' AS tsstatusrs,
        row_payload ->> 'tsstatusrealisasi' AS tsstatusrealisasi,
        row_payload ->> 'tsstatus' AS tsstatus,
        row_payload ->> 'tsstatussebelumnya' AS tsstatussebelumnya,
        NULLIF(row_payload ->> 'tsjmlrevisi', '')::numeric(20,6) AS tsjmlrevisi,
        row_payload ->> 'tscetakanke' AS tscetakanke,
        NULLIF(row_payload ->> 'tsposting', '')::bigint AS tsposting,
        NULLIF(row_payload ->> 'tspostingtgl', '')::timestamptz AS tspostingtgl,
        NULLIF(row_payload ->> 'tsisclose', '')::bigint AS tsisclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'tsid') IS NOT NULL
) AS prepared
ON CONFLICT (tsid) DO UPDATE
SET
    tscabang = EXCLUDED.tscabang,
    tslokasi = EXCLUDED.tslokasi,
    tsjenis = EXCLUDED.tsjenis,
    tsgudangasal = EXCLUDED.tsgudangasal,
    tsgudangtransit = EXCLUDED.tsgudangtransit,
    tsgudangtujuan = EXCLUDED.tsgudangtujuan,
    tssumber = EXCLUDED.tssumber,
    tsautonotransaksi = EXCLUDED.tsautonotransaksi,
    tsnotransaksi = EXCLUDED.tsnotransaksi,
    tstgl = EXCLUDED.tstgl,
    tskodepa = EXCLUDED.tskodepa,
    tsbagianmutasi = EXCLUDED.tsbagianmutasi,
    tsbagianmutasikontak = EXCLUDED.tsbagianmutasikontak,
    tsuraian = EXCLUDED.tsuraian,
    tscatatan = EXCLUDED.tscatatan,
    tsnoref = EXCLUDED.tsnoref,
    tstglnoref = EXCLUDED.tstglnoref,
    tsidmr = EXCLUDED.tsidmr,
    tsstatusrs = EXCLUDED.tsstatusrs,
    tsstatusrealisasi = EXCLUDED.tsstatusrealisasi,
    tsstatus = EXCLUDED.tsstatus,
    tsstatussebelumnya = EXCLUDED.tsstatussebelumnya,
    tsjmlrevisi = EXCLUDED.tsjmlrevisi,
    tscetakanke = EXCLUDED.tscetakanke,
    tsposting = EXCLUDED.tsposting,
    tspostingtgl = EXCLUDED.tspostingtgl,
    tsisclose = EXCLUDED.tsisclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m3_ts_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m3_ts_detail'
)
INSERT INTO m3_ts_detail (
    idtsdetail, idts, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, idhppkhususmasuk, cabang, lokasi, gudangasal, gudangtransit, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idmrdetail, idgrndetail, jmlrs, statusrs, jmlrealisasi, statusrealisasi, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idtsdetail, idts, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, idhppkhususmasuk, cabang, lokasi, gudangasal, gudangtransit, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idmrdetail, idgrndetail, jmlrs, statusrs, jmlrealisasi, statusrealisasi, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idtsdetail', '')::bigint AS idtsdetail,
        NULLIF(row_payload ->> 'idts', '')::bigint AS idts,
        NULLIF(row_payload ->> 'idbarang', '')::bigint AS idbarang,
        row_payload ->> 'namabarang' AS namabarang,
        row_payload ->> 'tipebarang' AS tipebarang,
        NULLIF(row_payload ->> 'jml', '')::numeric(20,6) AS jml,
        row_payload ->> 'satuan' AS satuan,
        NULLIF(row_payload ->> 'nilaisatuan', '')::numeric(20,6) AS nilaisatuan,
        NULLIF(row_payload ->> 'jmlbarang', '')::numeric(20,6) AS jmlbarang,
        row_payload ->> 'satuanbarang' AS satuanbarang,
        NULLIF(row_payload ->> 'idhppkhususmasuk', '')::bigint AS idhppkhususmasuk,
        row_payload ->> 'cabang' AS cabang,
        row_payload ->> 'lokasi' AS lokasi,
        row_payload ->> 'gudangasal' AS gudangasal,
        row_payload ->> 'gudangtransit' AS gudangtransit,
        row_payload ->> 'gudangtujuan' AS gudangtujuan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'idmrdetail', '')::bigint AS idmrdetail,
        NULLIF(row_payload ->> 'idgrndetail', '')::bigint AS idgrndetail,
        NULLIF(row_payload ->> 'jmlrs', '')::numeric(20,6) AS jmlrs,
        NULLIF(row_payload ->> 'statusrs', '')::bigint AS statusrs,
        NULLIF(row_payload ->> 'jmlrealisasi', '')::numeric(20,6) AS jmlrealisasi,
        NULLIF(row_payload ->> 'statusrealisasi', '')::bigint AS statusrealisasi,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idtsdetail') IS NOT NULL
) AS prepared
ON CONFLICT (idtsdetail) DO UPDATE
SET
    idts = EXCLUDED.idts,
    idbarang = EXCLUDED.idbarang,
    namabarang = EXCLUDED.namabarang,
    tipebarang = EXCLUDED.tipebarang,
    jml = EXCLUDED.jml,
    satuan = EXCLUDED.satuan,
    nilaisatuan = EXCLUDED.nilaisatuan,
    jmlbarang = EXCLUDED.jmlbarang,
    satuanbarang = EXCLUDED.satuanbarang,
    idhppkhususmasuk = EXCLUDED.idhppkhususmasuk,
    cabang = EXCLUDED.cabang,
    lokasi = EXCLUDED.lokasi,
    gudangasal = EXCLUDED.gudangasal,
    gudangtransit = EXCLUDED.gudangtransit,
    gudangtujuan = EXCLUDED.gudangtujuan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    idmrdetail = EXCLUDED.idmrdetail,
    idgrndetail = EXCLUDED.idgrndetail,
    jmlrs = EXCLUDED.jmlrs,
    statusrs = EXCLUDED.statusrs,
    jmlrealisasi = EXCLUDED.jmlrealisasi,
    statusrealisasi = EXCLUDED.statusrealisasi,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m4_po
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m4_po'
)
INSERT INTO m4_po (
    poid, pocabang, polokasi, pogudang, poasalbarang, poasalbarangkategori, pojenispembelian, pojenispembeliankategori, pocarabayar, posumber, poautonotransaksi, ponotransaksi, potgl, pokodepa, posupplier, posupplierkontak, po1alamat1, po1alamat2, po1alamat3, po2alamat1, po2alamat2, po2alamat3, pobagianpembelian, potgldipenuhi, potermin, potgljatuhtempo, pouraian, pocatatan, ponoref, potglnoref, potglpenutupan, pomatauang, pokurs, pohargatermasukpajak, pototal, podiskonpersen, pojmldiskon, pototalpajak1detail, pototalpajak2detail, pobiayalainpersen, pobiayalain, pototaltransaksi, pojmlbayar, porekdiskon, porekpajak1, porekpajak2, porekbiayalain, porekbayar, poidpr, poidcs, poidrq, poidbs, postatusipc, postatusgrn, postatusri, postatusdnr, postatusprt, postatusrealisasi, postatus, postatussebelumnya, pojmlrevisi, pocetakanke, poposting, popostingtgl, poisclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    poid, pocabang, polokasi, pogudang, poasalbarang, poasalbarangkategori, pojenispembelian, pojenispembeliankategori, pocarabayar, posumber, poautonotransaksi, ponotransaksi, potgl, pokodepa, posupplier, posupplierkontak, po1alamat1, po1alamat2, po1alamat3, po2alamat1, po2alamat2, po2alamat3, pobagianpembelian, potgldipenuhi, potermin, potgljatuhtempo, pouraian, pocatatan, ponoref, potglnoref, potglpenutupan, pomatauang, pokurs, pohargatermasukpajak, pototal, podiskonpersen, pojmldiskon, pototalpajak1detail, pototalpajak2detail, pobiayalainpersen, pobiayalain, pototaltransaksi, pojmlbayar, porekdiskon, porekpajak1, porekpajak2, porekbiayalain, porekbayar, poidpr, poidcs, poidrq, poidbs, postatusipc, postatusgrn, postatusri, postatusdnr, postatusprt, postatusrealisasi, postatus, postatussebelumnya, pojmlrevisi, pocetakanke, poposting, popostingtgl, poisclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'poid', '')::bigint AS poid,
        row_payload ->> 'pocabang' AS pocabang,
        row_payload ->> 'polokasi' AS polokasi,
        row_payload ->> 'pogudang' AS pogudang,
        row_payload ->> 'poasalbarang' AS poasalbarang,
        row_payload ->> 'poasalbarangkategori' AS poasalbarangkategori,
        row_payload ->> 'pojenispembelian' AS pojenispembelian,
        row_payload ->> 'pojenispembeliankategori' AS pojenispembeliankategori,
        row_payload ->> 'pocarabayar' AS pocarabayar,
        row_payload ->> 'posumber' AS posumber,
        row_payload ->> 'poautonotransaksi' AS poautonotransaksi,
        row_payload ->> 'ponotransaksi' AS ponotransaksi,
        NULLIF(row_payload ->> 'potgl', '')::timestamptz AS potgl,
        row_payload ->> 'pokodepa' AS pokodepa,
        NULLIF(row_payload ->> 'posupplier', '')::bigint AS posupplier,
        row_payload ->> 'posupplierkontak' AS posupplierkontak,
        row_payload ->> 'po1alamat1' AS po1alamat1,
        row_payload ->> 'po1alamat2' AS po1alamat2,
        row_payload ->> 'po1alamat3' AS po1alamat3,
        row_payload ->> 'po2alamat1' AS po2alamat1,
        row_payload ->> 'po2alamat2' AS po2alamat2,
        row_payload ->> 'po2alamat3' AS po2alamat3,
        NULLIF(row_payload ->> 'pobagianpembelian', '')::bigint AS pobagianpembelian,
        NULLIF(row_payload ->> 'potgldipenuhi', '')::timestamptz AS potgldipenuhi,
        row_payload ->> 'potermin' AS potermin,
        NULLIF(row_payload ->> 'potgljatuhtempo', '')::timestamptz AS potgljatuhtempo,
        row_payload ->> 'pouraian' AS pouraian,
        row_payload ->> 'pocatatan' AS pocatatan,
        row_payload ->> 'ponoref' AS ponoref,
        NULLIF(row_payload ->> 'potglnoref', '')::timestamptz AS potglnoref,
        NULLIF(row_payload ->> 'potglpenutupan', '')::timestamptz AS potglpenutupan,
        row_payload ->> 'pomatauang' AS pomatauang,
        NULLIF(row_payload ->> 'pokurs', '')::numeric(20,6) AS pokurs,
        NULLIF(row_payload ->> 'pohargatermasukpajak', '')::numeric(20,6) AS pohargatermasukpajak,
        NULLIF(row_payload ->> 'pototal', '')::numeric(20,6) AS pototal,
        NULLIF(row_payload ->> 'podiskonpersen', '')::numeric(20,6) AS podiskonpersen,
        NULLIF(row_payload ->> 'pojmldiskon', '')::numeric(20,6) AS pojmldiskon,
        NULLIF(row_payload ->> 'pototalpajak1detail', '')::numeric(20,6) AS pototalpajak1detail,
        NULLIF(row_payload ->> 'pototalpajak2detail', '')::numeric(20,6) AS pototalpajak2detail,
        NULLIF(row_payload ->> 'pobiayalainpersen', '')::numeric(20,6) AS pobiayalainpersen,
        row_payload ->> 'pobiayalain' AS pobiayalain,
        NULLIF(row_payload ->> 'pototaltransaksi', '')::numeric(20,6) AS pototaltransaksi,
        NULLIF(row_payload ->> 'pojmlbayar', '')::numeric(20,6) AS pojmlbayar,
        NULLIF(row_payload ->> 'porekdiskon', '')::numeric(20,6) AS porekdiskon,
        NULLIF(row_payload ->> 'porekpajak1', '')::numeric(20,6) AS porekpajak1,
        NULLIF(row_payload ->> 'porekpajak2', '')::numeric(20,6) AS porekpajak2,
        row_payload ->> 'porekbiayalain' AS porekbiayalain,
        row_payload ->> 'porekbayar' AS porekbayar,
        NULLIF(row_payload ->> 'poidpr', '')::bigint AS poidpr,
        NULLIF(row_payload ->> 'poidcs', '')::bigint AS poidcs,
        NULLIF(row_payload ->> 'poidrq', '')::bigint AS poidrq,
        NULLIF(row_payload ->> 'poidbs', '')::bigint AS poidbs,
        row_payload ->> 'postatusipc' AS postatusipc,
        row_payload ->> 'postatusgrn' AS postatusgrn,
        row_payload ->> 'postatusri' AS postatusri,
        row_payload ->> 'postatusdnr' AS postatusdnr,
        row_payload ->> 'postatusprt' AS postatusprt,
        row_payload ->> 'postatusrealisasi' AS postatusrealisasi,
        NULLIF(row_payload ->> 'postatus', '')::bigint AS postatus,
        row_payload ->> 'postatussebelumnya' AS postatussebelumnya,
        NULLIF(row_payload ->> 'pojmlrevisi', '')::numeric(20,6) AS pojmlrevisi,
        row_payload ->> 'pocetakanke' AS pocetakanke,
        NULLIF(row_payload ->> 'poposting', '')::bigint AS poposting,
        NULLIF(row_payload ->> 'popostingtgl', '')::timestamptz AS popostingtgl,
        NULLIF(row_payload ->> 'poisclose', '')::bigint AS poisclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'poid') IS NOT NULL
) AS prepared
ON CONFLICT (poid) DO UPDATE
SET
    pocabang = EXCLUDED.pocabang,
    polokasi = EXCLUDED.polokasi,
    pogudang = EXCLUDED.pogudang,
    poasalbarang = EXCLUDED.poasalbarang,
    poasalbarangkategori = EXCLUDED.poasalbarangkategori,
    pojenispembelian = EXCLUDED.pojenispembelian,
    pojenispembeliankategori = EXCLUDED.pojenispembeliankategori,
    pocarabayar = EXCLUDED.pocarabayar,
    posumber = EXCLUDED.posumber,
    poautonotransaksi = EXCLUDED.poautonotransaksi,
    ponotransaksi = EXCLUDED.ponotransaksi,
    potgl = EXCLUDED.potgl,
    pokodepa = EXCLUDED.pokodepa,
    posupplier = EXCLUDED.posupplier,
    posupplierkontak = EXCLUDED.posupplierkontak,
    po1alamat1 = EXCLUDED.po1alamat1,
    po1alamat2 = EXCLUDED.po1alamat2,
    po1alamat3 = EXCLUDED.po1alamat3,
    po2alamat1 = EXCLUDED.po2alamat1,
    po2alamat2 = EXCLUDED.po2alamat2,
    po2alamat3 = EXCLUDED.po2alamat3,
    pobagianpembelian = EXCLUDED.pobagianpembelian,
    potgldipenuhi = EXCLUDED.potgldipenuhi,
    potermin = EXCLUDED.potermin,
    potgljatuhtempo = EXCLUDED.potgljatuhtempo,
    pouraian = EXCLUDED.pouraian,
    pocatatan = EXCLUDED.pocatatan,
    ponoref = EXCLUDED.ponoref,
    potglnoref = EXCLUDED.potglnoref,
    potglpenutupan = EXCLUDED.potglpenutupan,
    pomatauang = EXCLUDED.pomatauang,
    pokurs = EXCLUDED.pokurs,
    pohargatermasukpajak = EXCLUDED.pohargatermasukpajak,
    pototal = EXCLUDED.pototal,
    podiskonpersen = EXCLUDED.podiskonpersen,
    pojmldiskon = EXCLUDED.pojmldiskon,
    pototalpajak1detail = EXCLUDED.pototalpajak1detail,
    pototalpajak2detail = EXCLUDED.pototalpajak2detail,
    pobiayalainpersen = EXCLUDED.pobiayalainpersen,
    pobiayalain = EXCLUDED.pobiayalain,
    pototaltransaksi = EXCLUDED.pototaltransaksi,
    pojmlbayar = EXCLUDED.pojmlbayar,
    porekdiskon = EXCLUDED.porekdiskon,
    porekpajak1 = EXCLUDED.porekpajak1,
    porekpajak2 = EXCLUDED.porekpajak2,
    porekbiayalain = EXCLUDED.porekbiayalain,
    porekbayar = EXCLUDED.porekbayar,
    poidpr = EXCLUDED.poidpr,
    poidcs = EXCLUDED.poidcs,
    poidrq = EXCLUDED.poidrq,
    poidbs = EXCLUDED.poidbs,
    postatusipc = EXCLUDED.postatusipc,
    postatusgrn = EXCLUDED.postatusgrn,
    postatusri = EXCLUDED.postatusri,
    postatusdnr = EXCLUDED.postatusdnr,
    postatusprt = EXCLUDED.postatusprt,
    postatusrealisasi = EXCLUDED.postatusrealisasi,
    postatus = EXCLUDED.postatus,
    postatussebelumnya = EXCLUDED.postatussebelumnya,
    pojmlrevisi = EXCLUDED.pojmlrevisi,
    pocetakanke = EXCLUDED.pocetakanke,
    poposting = EXCLUDED.poposting,
    popostingtgl = EXCLUDED.popostingtgl,
    poisclose = EXCLUDED.poisclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m4_po_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m4_po_detail'
)
INSERT INTO m4_po_detail (
    idpodetail, idpo, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, hargafix, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudang, costcenter, divisi, subdivisi, proyek, catatan, urutan, idprdetail, idcsdetail, idrqdetail, idbsdetail, jmlipc, statusipc, jmlgrn, statusgrn, jmlri, statusri, jmldnr, statusdnr, jmlprt, statusprt, jmlrealisasi, statusrealisasi, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idpodetail, idpo, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, hargafix, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudang, costcenter, divisi, subdivisi, proyek, catatan, urutan, idprdetail, idcsdetail, idrqdetail, idbsdetail, jmlipc, statusipc, jmlgrn, statusgrn, jmlri, statusri, jmldnr, statusdnr, jmlprt, statusprt, jmlrealisasi, statusrealisasi, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idpodetail', '')::bigint AS idpodetail,
        NULLIF(row_payload ->> 'idpo', '')::bigint AS idpo,
        NULLIF(row_payload ->> 'idbarang', '')::bigint AS idbarang,
        row_payload ->> 'namabarang' AS namabarang,
        row_payload ->> 'tipebarang' AS tipebarang,
        NULLIF(row_payload ->> 'jml', '')::numeric(20,6) AS jml,
        row_payload ->> 'satuan' AS satuan,
        NULLIF(row_payload ->> 'nilaisatuan', '')::numeric(20,6) AS nilaisatuan,
        NULLIF(row_payload ->> 'jmlbarang', '')::numeric(20,6) AS jmlbarang,
        row_payload ->> 'satuanbarang' AS satuanbarang,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        NULLIF(row_payload ->> 'hargafix', '')::numeric(20,6) AS hargafix,
        NULLIF(row_payload ->> 'harga', '')::numeric(20,6) AS harga,
        NULLIF(row_payload ->> 'diskon', '')::numeric(20,6) AS diskon,
        NULLIF(row_payload ->> 'jmldiskon', '')::numeric(20,6) AS jmldiskon,
        NULLIF(row_payload ->> 'pajak1', '')::numeric(20,6) AS pajak1,
        NULLIF(row_payload ->> 'jmlpajak1', '')::numeric(20,6) AS jmlpajak1,
        NULLIF(row_payload ->> 'pajak2', '')::numeric(20,6) AS pajak2,
        NULLIF(row_payload ->> 'jmlpajak2', '')::numeric(20,6) AS jmlpajak2,
        row_payload ->> 'cabang' AS cabang,
        row_payload ->> 'lokasi' AS lokasi,
        row_payload ->> 'gudang' AS gudang,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'catatan' AS catatan,
        NULLIF(row_payload ->> 'urutan', '')::bigint AS urutan,
        NULLIF(row_payload ->> 'idprdetail', '')::bigint AS idprdetail,
        NULLIF(row_payload ->> 'idcsdetail', '')::bigint AS idcsdetail,
        NULLIF(row_payload ->> 'idrqdetail', '')::bigint AS idrqdetail,
        NULLIF(row_payload ->> 'idbsdetail', '')::bigint AS idbsdetail,
        NULLIF(row_payload ->> 'jmlipc', '')::numeric(20,6) AS jmlipc,
        NULLIF(row_payload ->> 'statusipc', '')::bigint AS statusipc,
        NULLIF(row_payload ->> 'jmlgrn', '')::numeric(20,6) AS jmlgrn,
        NULLIF(row_payload ->> 'statusgrn', '')::bigint AS statusgrn,
        NULLIF(row_payload ->> 'jmlri', '')::numeric(20,6) AS jmlri,
        NULLIF(row_payload ->> 'statusri', '')::bigint AS statusri,
        NULLIF(row_payload ->> 'jmldnr', '')::numeric(20,6) AS jmldnr,
        NULLIF(row_payload ->> 'statusdnr', '')::bigint AS statusdnr,
        NULLIF(row_payload ->> 'jmlprt', '')::numeric(20,6) AS jmlprt,
        NULLIF(row_payload ->> 'statusprt', '')::bigint AS statusprt,
        NULLIF(row_payload ->> 'jmlrealisasi', '')::numeric(20,6) AS jmlrealisasi,
        NULLIF(row_payload ->> 'statusrealisasi', '')::bigint AS statusrealisasi,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idpodetail') IS NOT NULL
) AS prepared
ON CONFLICT (idpodetail) DO UPDATE
SET
    idpo = EXCLUDED.idpo,
    idbarang = EXCLUDED.idbarang,
    namabarang = EXCLUDED.namabarang,
    tipebarang = EXCLUDED.tipebarang,
    jml = EXCLUDED.jml,
    satuan = EXCLUDED.satuan,
    nilaisatuan = EXCLUDED.nilaisatuan,
    jmlbarang = EXCLUDED.jmlbarang,
    satuanbarang = EXCLUDED.satuanbarang,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    hargafix = EXCLUDED.hargafix,
    harga = EXCLUDED.harga,
    diskon = EXCLUDED.diskon,
    jmldiskon = EXCLUDED.jmldiskon,
    pajak1 = EXCLUDED.pajak1,
    jmlpajak1 = EXCLUDED.jmlpajak1,
    pajak2 = EXCLUDED.pajak2,
    jmlpajak2 = EXCLUDED.jmlpajak2,
    cabang = EXCLUDED.cabang,
    lokasi = EXCLUDED.lokasi,
    gudang = EXCLUDED.gudang,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    idprdetail = EXCLUDED.idprdetail,
    idcsdetail = EXCLUDED.idcsdetail,
    idrqdetail = EXCLUDED.idrqdetail,
    idbsdetail = EXCLUDED.idbsdetail,
    jmlipc = EXCLUDED.jmlipc,
    statusipc = EXCLUDED.statusipc,
    jmlgrn = EXCLUDED.jmlgrn,
    statusgrn = EXCLUDED.statusgrn,
    jmlri = EXCLUDED.jmlri,
    statusri = EXCLUDED.statusri,
    jmldnr = EXCLUDED.jmldnr,
    statusdnr = EXCLUDED.statusdnr,
    jmlprt = EXCLUDED.jmlprt,
    statusprt = EXCLUDED.statusprt,
    jmlrealisasi = EXCLUDED.jmlrealisasi,
    statusrealisasi = EXCLUDED.statusrealisasi,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m4_ap
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m4_ap'
)
INSERT INTO m4_ap (
    apid, apcabang, aplokasi, apjenis, apsumber, apautonotransaksi, apnotransaksi, aptgl, apkodepa, apkontak, apkontakperson, ap1alamat1, ap1alamat2, ap1alamat3, ap2alamat1, ap2alamat2, ap2alamat3, apbagianpembayaran, aptermin, aptgljatuhtempo, apidpo, apnorek, apuraian, apcatatan, apnoref, aptglnoref, apmatauang, apkurs, apjumlah, apjumlahvalas, apjumlahbayar, apjumlahbayarvalas, apstatusbayar, aptgllunas, apcostcenter, apdivisi, apsubdivisi, approyek, apstatusvpp, apstatus, apstatussebelumnya, apjmlrevisi, apcetakanke, apposting, appostingtgl, apisclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    apid, apcabang, aplokasi, apjenis, apsumber, apautonotransaksi, apnotransaksi, aptgl, apkodepa, apkontak, apkontakperson, ap1alamat1, ap1alamat2, ap1alamat3, ap2alamat1, ap2alamat2, ap2alamat3, apbagianpembayaran, aptermin, aptgljatuhtempo, apidpo, apnorek, apuraian, apcatatan, apnoref, aptglnoref, apmatauang, apkurs, apjumlah, apjumlahvalas, apjumlahbayar, apjumlahbayarvalas, apstatusbayar, aptgllunas, apcostcenter, apdivisi, apsubdivisi, approyek, apstatusvpp, apstatus, apstatussebelumnya, apjmlrevisi, apcetakanke, apposting, appostingtgl, apisclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'apid', '')::bigint AS apid,
        row_payload ->> 'apcabang' AS apcabang,
        row_payload ->> 'aplokasi' AS aplokasi,
        NULLIF(row_payload ->> 'apjenis', '')::bigint AS apjenis,
        row_payload ->> 'apsumber' AS apsumber,
        row_payload ->> 'apautonotransaksi' AS apautonotransaksi,
        row_payload ->> 'apnotransaksi' AS apnotransaksi,
        NULLIF(row_payload ->> 'aptgl', '')::timestamptz AS aptgl,
        NULLIF(row_payload ->> 'apkodepa', '')::bigint AS apkodepa,
        NULLIF(row_payload ->> 'apkontak', '')::bigint AS apkontak,
        NULLIF(row_payload ->> 'apkontakperson', '')::bigint AS apkontakperson,
        row_payload ->> 'ap1alamat1' AS ap1alamat1,
        row_payload ->> 'ap1alamat2' AS ap1alamat2,
        row_payload ->> 'ap1alamat3' AS ap1alamat3,
        row_payload ->> 'ap2alamat1' AS ap2alamat1,
        row_payload ->> 'ap2alamat2' AS ap2alamat2,
        row_payload ->> 'ap2alamat3' AS ap2alamat3,
        NULLIF(row_payload ->> 'apbagianpembayaran', '')::bigint AS apbagianpembayaran,
        row_payload ->> 'aptermin' AS aptermin,
        NULLIF(row_payload ->> 'aptgljatuhtempo', '')::timestamptz AS aptgljatuhtempo,
        NULLIF(row_payload ->> 'apidpo', '')::bigint AS apidpo,
        row_payload ->> 'apnorek' AS apnorek,
        row_payload ->> 'apuraian' AS apuraian,
        row_payload ->> 'apcatatan' AS apcatatan,
        row_payload ->> 'apnoref' AS apnoref,
        NULLIF(row_payload ->> 'aptglnoref', '')::timestamptz AS aptglnoref,
        row_payload ->> 'apmatauang' AS apmatauang,
        NULLIF(row_payload ->> 'apkurs', '')::numeric(20,6) AS apkurs,
        row_payload ->> 'apjumlah' AS apjumlah,
        row_payload ->> 'apjumlahvalas' AS apjumlahvalas,
        row_payload ->> 'apjumlahbayar' AS apjumlahbayar,
        row_payload ->> 'apjumlahbayarvalas' AS apjumlahbayarvalas,
        NULLIF(row_payload ->> 'apstatusbayar', '')::bigint AS apstatusbayar,
        NULLIF(row_payload ->> 'aptgllunas', '')::timestamptz AS aptgllunas,
        row_payload ->> 'apcostcenter' AS apcostcenter,
        row_payload ->> 'apdivisi' AS apdivisi,
        row_payload ->> 'apsubdivisi' AS apsubdivisi,
        row_payload ->> 'approyek' AS approyek,
        NULLIF(row_payload ->> 'apstatusvpp', '')::bigint AS apstatusvpp,
        NULLIF(row_payload ->> 'apstatus', '')::bigint AS apstatus,
        NULLIF(row_payload ->> 'apstatussebelumnya', '')::bigint AS apstatussebelumnya,
        NULLIF(row_payload ->> 'apjmlrevisi', '')::bigint AS apjmlrevisi,
        NULLIF(row_payload ->> 'apcetakanke', '')::bigint AS apcetakanke,
        NULLIF(row_payload ->> 'apposting', '')::bigint AS apposting,
        NULLIF(row_payload ->> 'appostingtgl', '')::timestamptz AS appostingtgl,
        NULLIF(row_payload ->> 'apisclose', '')::bigint AS apisclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'apid') IS NOT NULL
) AS prepared
ON CONFLICT (apid) DO UPDATE
SET
    apcabang = EXCLUDED.apcabang,
    aplokasi = EXCLUDED.aplokasi,
    apjenis = EXCLUDED.apjenis,
    apsumber = EXCLUDED.apsumber,
    apautonotransaksi = EXCLUDED.apautonotransaksi,
    apnotransaksi = EXCLUDED.apnotransaksi,
    aptgl = EXCLUDED.aptgl,
    apkodepa = EXCLUDED.apkodepa,
    apkontak = EXCLUDED.apkontak,
    apkontakperson = EXCLUDED.apkontakperson,
    ap1alamat1 = EXCLUDED.ap1alamat1,
    ap1alamat2 = EXCLUDED.ap1alamat2,
    ap1alamat3 = EXCLUDED.ap1alamat3,
    ap2alamat1 = EXCLUDED.ap2alamat1,
    ap2alamat2 = EXCLUDED.ap2alamat2,
    ap2alamat3 = EXCLUDED.ap2alamat3,
    apbagianpembayaran = EXCLUDED.apbagianpembayaran,
    aptermin = EXCLUDED.aptermin,
    aptgljatuhtempo = EXCLUDED.aptgljatuhtempo,
    apidpo = EXCLUDED.apidpo,
    apnorek = EXCLUDED.apnorek,
    apuraian = EXCLUDED.apuraian,
    apcatatan = EXCLUDED.apcatatan,
    apnoref = EXCLUDED.apnoref,
    aptglnoref = EXCLUDED.aptglnoref,
    apmatauang = EXCLUDED.apmatauang,
    apkurs = EXCLUDED.apkurs,
    apjumlah = EXCLUDED.apjumlah,
    apjumlahvalas = EXCLUDED.apjumlahvalas,
    apjumlahbayar = EXCLUDED.apjumlahbayar,
    apjumlahbayarvalas = EXCLUDED.apjumlahbayarvalas,
    apstatusbayar = EXCLUDED.apstatusbayar,
    aptgllunas = EXCLUDED.aptgllunas,
    apcostcenter = EXCLUDED.apcostcenter,
    apdivisi = EXCLUDED.apdivisi,
    apsubdivisi = EXCLUDED.apsubdivisi,
    approyek = EXCLUDED.approyek,
    apstatusvpp = EXCLUDED.apstatusvpp,
    apstatus = EXCLUDED.apstatus,
    apstatussebelumnya = EXCLUDED.apstatussebelumnya,
    apjmlrevisi = EXCLUDED.apjmlrevisi,
    apcetakanke = EXCLUDED.apcetakanke,
    apposting = EXCLUDED.apposting,
    appostingtgl = EXCLUDED.appostingtgl,
    apisclose = EXCLUDED.apisclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m4_ap_pay
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m4_ap_pay'
)
INSERT INTO m4_ap_pay (
    idapcarabayar, idap, carabayar, matauang, kurs, jumlah, jumlahvalas, nogiro, tgljt, bank, noacbank, rekbank, rekgiro, catatan, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idapcarabayar, idap, carabayar, matauang, kurs, jumlah, jumlahvalas, nogiro, tgljt, bank, noacbank, rekbank, rekgiro, catatan, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idapcarabayar', '')::bigint AS idapcarabayar,
        NULLIF(row_payload ->> 'idap', '')::bigint AS idap,
        NULLIF(row_payload ->> 'carabayar', '')::bigint AS carabayar,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        row_payload ->> 'jumlah' AS jumlah,
        row_payload ->> 'jumlahvalas' AS jumlahvalas,
        row_payload ->> 'nogiro' AS nogiro,
        NULLIF(row_payload ->> 'tgljt', '')::timestamptz AS tgljt,
        row_payload ->> 'bank' AS bank,
        row_payload ->> 'noacbank' AS noacbank,
        row_payload ->> 'rekbank' AS rekbank,
        row_payload ->> 'rekgiro' AS rekgiro,
        row_payload ->> 'catatan' AS catatan,
        NULLIF(row_payload ->> 'urutan', '')::bigint AS urutan,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idapcarabayar') IS NOT NULL
) AS prepared
ON CONFLICT (idapcarabayar) DO UPDATE
SET
    idap = EXCLUDED.idap,
    carabayar = EXCLUDED.carabayar,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    jumlah = EXCLUDED.jumlah,
    jumlahvalas = EXCLUDED.jumlahvalas,
    nogiro = EXCLUDED.nogiro,
    tgljt = EXCLUDED.tgljt,
    bank = EXCLUDED.bank,
    noacbank = EXCLUDED.noacbank,
    rekbank = EXCLUDED.rekbank,
    rekgiro = EXCLUDED.rekgiro,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m4_grn
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m4_grn'
)
INSERT INTO m4_grn (
    grnid, grncabang, grnlokasi, grngudang, grnasalbarang, grnasalbarangkategori, grnjenispembelian, grnjenispembeliankategori, grncarabayar, grnsumber, grnautonotransaksi, grnnotransaksi, grntgl, grnkodepa, grnsupplier, grnsupplierkontak, grn1alamat1, grn1alamat2, grn1alamat3, grn2alamat1, grn2alamat2, grn2alamat3, grnbagianpembelian, grntermin, grntgljatuhtempo, grnuraian, grncatatan, grnnoref, grntglnoref, grntglpenutupan, grnmatauang, grnkurs, grnhargatermasukpajak, grntotal, grndiskonpersen, grnjmldiskon, grntotalpajak1detail, grntotalpajak2detail, grnbiayalainpersen, grnbiayalain, grntotaltransaksi, grnjmlbayar, grnrekdiskon, grnrekpajak1, grnrekpajak2, grnrekbiayalain, grnrekbayar, grnidpr, grnidcs, grnidrq, grnidbs, grnidpo, grnidipc, grnstatusri, grnstatusdnr, grnstatusprt, grnstatusts, grnstatusrealisasi, grnstatus, grnstatussebelumnya, grnjmlrevisi, grncetakanke, grnposting, grnpostingtgl, grntutupperiode, grnisclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    grnid, grncabang, grnlokasi, grngudang, grnasalbarang, grnasalbarangkategori, grnjenispembelian, grnjenispembeliankategori, grncarabayar, grnsumber, grnautonotransaksi, grnnotransaksi, grntgl, grnkodepa, grnsupplier, grnsupplierkontak, grn1alamat1, grn1alamat2, grn1alamat3, grn2alamat1, grn2alamat2, grn2alamat3, grnbagianpembelian, grntermin, grntgljatuhtempo, grnuraian, grncatatan, grnnoref, grntglnoref, grntglpenutupan, grnmatauang, grnkurs, grnhargatermasukpajak, grntotal, grndiskonpersen, grnjmldiskon, grntotalpajak1detail, grntotalpajak2detail, grnbiayalainpersen, grnbiayalain, grntotaltransaksi, grnjmlbayar, grnrekdiskon, grnrekpajak1, grnrekpajak2, grnrekbiayalain, grnrekbayar, grnidpr, grnidcs, grnidrq, grnidbs, grnidpo, grnidipc, grnstatusri, grnstatusdnr, grnstatusprt, grnstatusts, grnstatusrealisasi, grnstatus, grnstatussebelumnya, grnjmlrevisi, grncetakanke, grnposting, grnpostingtgl, grntutupperiode, grnisclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'grnid', '')::bigint AS grnid,
        row_payload ->> 'grncabang' AS grncabang,
        row_payload ->> 'grnlokasi' AS grnlokasi,
        row_payload ->> 'grngudang' AS grngudang,
        row_payload ->> 'grnasalbarang' AS grnasalbarang,
        row_payload ->> 'grnasalbarangkategori' AS grnasalbarangkategori,
        row_payload ->> 'grnjenispembelian' AS grnjenispembelian,
        row_payload ->> 'grnjenispembeliankategori' AS grnjenispembeliankategori,
        row_payload ->> 'grncarabayar' AS grncarabayar,
        row_payload ->> 'grnsumber' AS grnsumber,
        row_payload ->> 'grnautonotransaksi' AS grnautonotransaksi,
        row_payload ->> 'grnnotransaksi' AS grnnotransaksi,
        NULLIF(row_payload ->> 'grntgl', '')::timestamptz AS grntgl,
        row_payload ->> 'grnkodepa' AS grnkodepa,
        row_payload ->> 'grnsupplier' AS grnsupplier,
        row_payload ->> 'grnsupplierkontak' AS grnsupplierkontak,
        row_payload ->> 'grn1alamat1' AS grn1alamat1,
        row_payload ->> 'grn1alamat2' AS grn1alamat2,
        row_payload ->> 'grn1alamat3' AS grn1alamat3,
        row_payload ->> 'grn2alamat1' AS grn2alamat1,
        row_payload ->> 'grn2alamat2' AS grn2alamat2,
        row_payload ->> 'grn2alamat3' AS grn2alamat3,
        row_payload ->> 'grnbagianpembelian' AS grnbagianpembelian,
        row_payload ->> 'grntermin' AS grntermin,
        NULLIF(row_payload ->> 'grntgljatuhtempo', '')::timestamptz AS grntgljatuhtempo,
        row_payload ->> 'grnuraian' AS grnuraian,
        row_payload ->> 'grncatatan' AS grncatatan,
        row_payload ->> 'grnnoref' AS grnnoref,
        NULLIF(row_payload ->> 'grntglnoref', '')::timestamptz AS grntglnoref,
        NULLIF(row_payload ->> 'grntglpenutupan', '')::timestamptz AS grntglpenutupan,
        row_payload ->> 'grnmatauang' AS grnmatauang,
        NULLIF(row_payload ->> 'grnkurs', '')::numeric(20,6) AS grnkurs,
        NULLIF(row_payload ->> 'grnhargatermasukpajak', '')::numeric(20,6) AS grnhargatermasukpajak,
        NULLIF(row_payload ->> 'grntotal', '')::numeric(20,6) AS grntotal,
        NULLIF(row_payload ->> 'grndiskonpersen', '')::numeric(20,6) AS grndiskonpersen,
        NULLIF(row_payload ->> 'grnjmldiskon', '')::numeric(20,6) AS grnjmldiskon,
        NULLIF(row_payload ->> 'grntotalpajak1detail', '')::numeric(20,6) AS grntotalpajak1detail,
        NULLIF(row_payload ->> 'grntotalpajak2detail', '')::numeric(20,6) AS grntotalpajak2detail,
        NULLIF(row_payload ->> 'grnbiayalainpersen', '')::numeric(20,6) AS grnbiayalainpersen,
        row_payload ->> 'grnbiayalain' AS grnbiayalain,
        NULLIF(row_payload ->> 'grntotaltransaksi', '')::numeric(20,6) AS grntotaltransaksi,
        NULLIF(row_payload ->> 'grnjmlbayar', '')::numeric(20,6) AS grnjmlbayar,
        NULLIF(row_payload ->> 'grnrekdiskon', '')::numeric(20,6) AS grnrekdiskon,
        NULLIF(row_payload ->> 'grnrekpajak1', '')::numeric(20,6) AS grnrekpajak1,
        NULLIF(row_payload ->> 'grnrekpajak2', '')::numeric(20,6) AS grnrekpajak2,
        row_payload ->> 'grnrekbiayalain' AS grnrekbiayalain,
        row_payload ->> 'grnrekbayar' AS grnrekbayar,
        NULLIF(row_payload ->> 'grnidpr', '')::bigint AS grnidpr,
        NULLIF(row_payload ->> 'grnidcs', '')::bigint AS grnidcs,
        NULLIF(row_payload ->> 'grnidrq', '')::bigint AS grnidrq,
        NULLIF(row_payload ->> 'grnidbs', '')::bigint AS grnidbs,
        NULLIF(row_payload ->> 'grnidpo', '')::bigint AS grnidpo,
        NULLIF(row_payload ->> 'grnidipc', '')::bigint AS grnidipc,
        row_payload ->> 'grnstatusri' AS grnstatusri,
        row_payload ->> 'grnstatusdnr' AS grnstatusdnr,
        row_payload ->> 'grnstatusprt' AS grnstatusprt,
        row_payload ->> 'grnstatusts' AS grnstatusts,
        row_payload ->> 'grnstatusrealisasi' AS grnstatusrealisasi,
        row_payload ->> 'grnstatus' AS grnstatus,
        row_payload ->> 'grnstatussebelumnya' AS grnstatussebelumnya,
        NULLIF(row_payload ->> 'grnjmlrevisi', '')::numeric(20,6) AS grnjmlrevisi,
        row_payload ->> 'grncetakanke' AS grncetakanke,
        NULLIF(row_payload ->> 'grnposting', '')::bigint AS grnposting,
        NULLIF(row_payload ->> 'grnpostingtgl', '')::timestamptz AS grnpostingtgl,
        row_payload ->> 'grntutupperiode' AS grntutupperiode,
        NULLIF(row_payload ->> 'grnisclose', '')::bigint AS grnisclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'grnid') IS NOT NULL
) AS prepared
ON CONFLICT (grnid) DO UPDATE
SET
    grncabang = EXCLUDED.grncabang,
    grnlokasi = EXCLUDED.grnlokasi,
    grngudang = EXCLUDED.grngudang,
    grnasalbarang = EXCLUDED.grnasalbarang,
    grnasalbarangkategori = EXCLUDED.grnasalbarangkategori,
    grnjenispembelian = EXCLUDED.grnjenispembelian,
    grnjenispembeliankategori = EXCLUDED.grnjenispembeliankategori,
    grncarabayar = EXCLUDED.grncarabayar,
    grnsumber = EXCLUDED.grnsumber,
    grnautonotransaksi = EXCLUDED.grnautonotransaksi,
    grnnotransaksi = EXCLUDED.grnnotransaksi,
    grntgl = EXCLUDED.grntgl,
    grnkodepa = EXCLUDED.grnkodepa,
    grnsupplier = EXCLUDED.grnsupplier,
    grnsupplierkontak = EXCLUDED.grnsupplierkontak,
    grn1alamat1 = EXCLUDED.grn1alamat1,
    grn1alamat2 = EXCLUDED.grn1alamat2,
    grn1alamat3 = EXCLUDED.grn1alamat3,
    grn2alamat1 = EXCLUDED.grn2alamat1,
    grn2alamat2 = EXCLUDED.grn2alamat2,
    grn2alamat3 = EXCLUDED.grn2alamat3,
    grnbagianpembelian = EXCLUDED.grnbagianpembelian,
    grntermin = EXCLUDED.grntermin,
    grntgljatuhtempo = EXCLUDED.grntgljatuhtempo,
    grnuraian = EXCLUDED.grnuraian,
    grncatatan = EXCLUDED.grncatatan,
    grnnoref = EXCLUDED.grnnoref,
    grntglnoref = EXCLUDED.grntglnoref,
    grntglpenutupan = EXCLUDED.grntglpenutupan,
    grnmatauang = EXCLUDED.grnmatauang,
    grnkurs = EXCLUDED.grnkurs,
    grnhargatermasukpajak = EXCLUDED.grnhargatermasukpajak,
    grntotal = EXCLUDED.grntotal,
    grndiskonpersen = EXCLUDED.grndiskonpersen,
    grnjmldiskon = EXCLUDED.grnjmldiskon,
    grntotalpajak1detail = EXCLUDED.grntotalpajak1detail,
    grntotalpajak2detail = EXCLUDED.grntotalpajak2detail,
    grnbiayalainpersen = EXCLUDED.grnbiayalainpersen,
    grnbiayalain = EXCLUDED.grnbiayalain,
    grntotaltransaksi = EXCLUDED.grntotaltransaksi,
    grnjmlbayar = EXCLUDED.grnjmlbayar,
    grnrekdiskon = EXCLUDED.grnrekdiskon,
    grnrekpajak1 = EXCLUDED.grnrekpajak1,
    grnrekpajak2 = EXCLUDED.grnrekpajak2,
    grnrekbiayalain = EXCLUDED.grnrekbiayalain,
    grnrekbayar = EXCLUDED.grnrekbayar,
    grnidpr = EXCLUDED.grnidpr,
    grnidcs = EXCLUDED.grnidcs,
    grnidrq = EXCLUDED.grnidrq,
    grnidbs = EXCLUDED.grnidbs,
    grnidpo = EXCLUDED.grnidpo,
    grnidipc = EXCLUDED.grnidipc,
    grnstatusri = EXCLUDED.grnstatusri,
    grnstatusdnr = EXCLUDED.grnstatusdnr,
    grnstatusprt = EXCLUDED.grnstatusprt,
    grnstatusts = EXCLUDED.grnstatusts,
    grnstatusrealisasi = EXCLUDED.grnstatusrealisasi,
    grnstatus = EXCLUDED.grnstatus,
    grnstatussebelumnya = EXCLUDED.grnstatussebelumnya,
    grnjmlrevisi = EXCLUDED.grnjmlrevisi,
    grncetakanke = EXCLUDED.grncetakanke,
    grnposting = EXCLUDED.grnposting,
    grnpostingtgl = EXCLUDED.grnpostingtgl,
    grntutupperiode = EXCLUDED.grntutupperiode,
    grnisclose = EXCLUDED.grnisclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m4_grn_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m4_grn_detail'
)
INSERT INTO m4_grn_detail (
    idgrndetail, idgrn, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, hargafix, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudang, rekpersediaan, rekdiskonpembelian, rekhutangsementara, costcenter, divisi, subdivisi, proyek, catatan, urutan, idprdetail, idcsdetail, idrqdetail, idbsdetail, idpodetail, idipcdetail, jmlri, statusri, jmldnr, statusdnr, jmlprt, statusprt, jmlts, statusts, jmlrealisasi, statusrealisasi, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idgrndetail, idgrn, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, hargafix, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudang, rekpersediaan, rekdiskonpembelian, rekhutangsementara, costcenter, divisi, subdivisi, proyek, catatan, urutan, idprdetail, idcsdetail, idrqdetail, idbsdetail, idpodetail, idipcdetail, jmlri, statusri, jmldnr, statusdnr, jmlprt, statusprt, jmlts, statusts, jmlrealisasi, statusrealisasi, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idgrndetail', '')::bigint AS idgrndetail,
        NULLIF(row_payload ->> 'idgrn', '')::bigint AS idgrn,
        NULLIF(row_payload ->> 'idbarang', '')::bigint AS idbarang,
        row_payload ->> 'namabarang' AS namabarang,
        row_payload ->> 'tipebarang' AS tipebarang,
        NULLIF(row_payload ->> 'jml', '')::numeric(20,6) AS jml,
        row_payload ->> 'satuan' AS satuan,
        NULLIF(row_payload ->> 'nilaisatuan', '')::numeric(20,6) AS nilaisatuan,
        NULLIF(row_payload ->> 'jmlbarang', '')::numeric(20,6) AS jmlbarang,
        row_payload ->> 'satuanbarang' AS satuanbarang,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        NULLIF(row_payload ->> 'hargafix', '')::numeric(20,6) AS hargafix,
        NULLIF(row_payload ->> 'harga', '')::numeric(20,6) AS harga,
        NULLIF(row_payload ->> 'diskon', '')::numeric(20,6) AS diskon,
        NULLIF(row_payload ->> 'jmldiskon', '')::numeric(20,6) AS jmldiskon,
        NULLIF(row_payload ->> 'pajak1', '')::numeric(20,6) AS pajak1,
        NULLIF(row_payload ->> 'jmlpajak1', '')::numeric(20,6) AS jmlpajak1,
        NULLIF(row_payload ->> 'pajak2', '')::numeric(20,6) AS pajak2,
        NULLIF(row_payload ->> 'jmlpajak2', '')::numeric(20,6) AS jmlpajak2,
        row_payload ->> 'cabang' AS cabang,
        row_payload ->> 'lokasi' AS lokasi,
        row_payload ->> 'gudang' AS gudang,
        row_payload ->> 'rekpersediaan' AS rekpersediaan,
        NULLIF(row_payload ->> 'rekdiskonpembelian', '')::numeric(20,6) AS rekdiskonpembelian,
        row_payload ->> 'rekhutangsementara' AS rekhutangsementara,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'idprdetail', '')::bigint AS idprdetail,
        NULLIF(row_payload ->> 'idcsdetail', '')::bigint AS idcsdetail,
        NULLIF(row_payload ->> 'idrqdetail', '')::bigint AS idrqdetail,
        NULLIF(row_payload ->> 'idbsdetail', '')::bigint AS idbsdetail,
        NULLIF(row_payload ->> 'idpodetail', '')::bigint AS idpodetail,
        NULLIF(row_payload ->> 'idipcdetail', '')::bigint AS idipcdetail,
        NULLIF(row_payload ->> 'jmlri', '')::numeric(20,6) AS jmlri,
        NULLIF(row_payload ->> 'statusri', '')::bigint AS statusri,
        NULLIF(row_payload ->> 'jmldnr', '')::numeric(20,6) AS jmldnr,
        NULLIF(row_payload ->> 'statusdnr', '')::bigint AS statusdnr,
        NULLIF(row_payload ->> 'jmlprt', '')::numeric(20,6) AS jmlprt,
        NULLIF(row_payload ->> 'statusprt', '')::bigint AS statusprt,
        NULLIF(row_payload ->> 'jmlts', '')::numeric(20,6) AS jmlts,
        NULLIF(row_payload ->> 'statusts', '')::bigint AS statusts,
        NULLIF(row_payload ->> 'jmlrealisasi', '')::numeric(20,6) AS jmlrealisasi,
        NULLIF(row_payload ->> 'statusrealisasi', '')::bigint AS statusrealisasi,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idgrndetail') IS NOT NULL
) AS prepared
ON CONFLICT (idgrndetail) DO UPDATE
SET
    idgrn = EXCLUDED.idgrn,
    idbarang = EXCLUDED.idbarang,
    namabarang = EXCLUDED.namabarang,
    tipebarang = EXCLUDED.tipebarang,
    jml = EXCLUDED.jml,
    satuan = EXCLUDED.satuan,
    nilaisatuan = EXCLUDED.nilaisatuan,
    jmlbarang = EXCLUDED.jmlbarang,
    satuanbarang = EXCLUDED.satuanbarang,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    hargafix = EXCLUDED.hargafix,
    harga = EXCLUDED.harga,
    diskon = EXCLUDED.diskon,
    jmldiskon = EXCLUDED.jmldiskon,
    pajak1 = EXCLUDED.pajak1,
    jmlpajak1 = EXCLUDED.jmlpajak1,
    pajak2 = EXCLUDED.pajak2,
    jmlpajak2 = EXCLUDED.jmlpajak2,
    cabang = EXCLUDED.cabang,
    lokasi = EXCLUDED.lokasi,
    gudang = EXCLUDED.gudang,
    rekpersediaan = EXCLUDED.rekpersediaan,
    rekdiskonpembelian = EXCLUDED.rekdiskonpembelian,
    rekhutangsementara = EXCLUDED.rekhutangsementara,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    idprdetail = EXCLUDED.idprdetail,
    idcsdetail = EXCLUDED.idcsdetail,
    idrqdetail = EXCLUDED.idrqdetail,
    idbsdetail = EXCLUDED.idbsdetail,
    idpodetail = EXCLUDED.idpodetail,
    idipcdetail = EXCLUDED.idipcdetail,
    jmlri = EXCLUDED.jmlri,
    statusri = EXCLUDED.statusri,
    jmldnr = EXCLUDED.jmldnr,
    statusdnr = EXCLUDED.statusdnr,
    jmlprt = EXCLUDED.jmlprt,
    statusprt = EXCLUDED.statusprt,
    jmlts = EXCLUDED.jmlts,
    statusts = EXCLUDED.statusts,
    jmlrealisasi = EXCLUDED.jmlrealisasi,
    statusrealisasi = EXCLUDED.statusrealisasi,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m4_ri
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m4_ri'
)
INSERT INTO m4_ri (
    riid, ricabang, rilokasi, rigudang, riasalbarang, riasalbarangkategori, rijenispembelian, rijenispembeliankategori, risaldoawal, ricarabayar, risumber, riautonotransaksi, rinotransaksi, ritgl, rikodepa, risupplier, risupplierkontak, ri1alamat1, ri1alamat2, ri1alamat3, ri2alamat1, ri2alamat2, ri2alamat3, ribagianpembelian, ritermin, ritgljatuhtempo, riuraian, ricatatan, rinoref, ritglnoref, ritglpenutupan, rimatauang, rikurs, rihargatermasukpajak, ritotal, ridiskonpersen, rijmldiskon, ritotalpajak1detail, ritotalpajak2detail, ribiayalainpersen, ribiayalain, ritotaltransaksi, rijmlbayar, ristatuslunas, ritgllunas, rinofakturpajak, risdhbayarpajak, ritglbayarpajak, rirekdiskon, rirekpajak1, rirekpajak2, rirekbiayalain, rirekbayar, riidpr, riidcs, riidrq, riidbs, riidpo, riidipc, riidgrn, ristatusdnr, ristatusprt, ristatusrealisasi, ristatuspie, ritglpie, ristatusvpp, ristatus, ristatussebelumnya, rijmlrevisi, ricetakanke, riposting, ripostingtgl, ritutupperiode, riisclose, rijmluangmuka, rirekuangmuka, riidap, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    riid, ricabang, rilokasi, rigudang, riasalbarang, riasalbarangkategori, rijenispembelian, rijenispembeliankategori, risaldoawal, ricarabayar, risumber, riautonotransaksi, rinotransaksi, ritgl, rikodepa, risupplier, risupplierkontak, ri1alamat1, ri1alamat2, ri1alamat3, ri2alamat1, ri2alamat2, ri2alamat3, ribagianpembelian, ritermin, ritgljatuhtempo, riuraian, ricatatan, rinoref, ritglnoref, ritglpenutupan, rimatauang, rikurs, rihargatermasukpajak, ritotal, ridiskonpersen, rijmldiskon, ritotalpajak1detail, ritotalpajak2detail, ribiayalainpersen, ribiayalain, ritotaltransaksi, rijmlbayar, ristatuslunas, ritgllunas, rinofakturpajak, risdhbayarpajak, ritglbayarpajak, rirekdiskon, rirekpajak1, rirekpajak2, rirekbiayalain, rirekbayar, riidpr, riidcs, riidrq, riidbs, riidpo, riidipc, riidgrn, ristatusdnr, ristatusprt, ristatusrealisasi, ristatuspie, ritglpie, ristatusvpp, ristatus, ristatussebelumnya, rijmlrevisi, ricetakanke, riposting, ripostingtgl, ritutupperiode, riisclose, rijmluangmuka, rirekuangmuka, riidap, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'riid', '')::bigint AS riid,
        row_payload ->> 'ricabang' AS ricabang,
        row_payload ->> 'rilokasi' AS rilokasi,
        row_payload ->> 'rigudang' AS rigudang,
        row_payload ->> 'riasalbarang' AS riasalbarang,
        row_payload ->> 'riasalbarangkategori' AS riasalbarangkategori,
        row_payload ->> 'rijenispembelian' AS rijenispembelian,
        row_payload ->> 'rijenispembeliankategori' AS rijenispembeliankategori,
        NULLIF(row_payload ->> 'risaldoawal', '')::numeric(20,6) AS risaldoawal,
        row_payload ->> 'ricarabayar' AS ricarabayar,
        row_payload ->> 'risumber' AS risumber,
        row_payload ->> 'riautonotransaksi' AS riautonotransaksi,
        row_payload ->> 'rinotransaksi' AS rinotransaksi,
        NULLIF(row_payload ->> 'ritgl', '')::timestamptz AS ritgl,
        NULLIF(row_payload ->> 'rikodepa', '')::bigint AS rikodepa,
        NULLIF(row_payload ->> 'risupplier', '')::bigint AS risupplier,
        row_payload ->> 'risupplierkontak' AS risupplierkontak,
        row_payload ->> 'ri1alamat1' AS ri1alamat1,
        row_payload ->> 'ri1alamat2' AS ri1alamat2,
        row_payload ->> 'ri1alamat3' AS ri1alamat3,
        row_payload ->> 'ri2alamat1' AS ri2alamat1,
        row_payload ->> 'ri2alamat2' AS ri2alamat2,
        row_payload ->> 'ri2alamat3' AS ri2alamat3,
        NULLIF(row_payload ->> 'ribagianpembelian', '')::bigint AS ribagianpembelian,
        row_payload ->> 'ritermin' AS ritermin,
        NULLIF(row_payload ->> 'ritgljatuhtempo', '')::timestamptz AS ritgljatuhtempo,
        row_payload ->> 'riuraian' AS riuraian,
        row_payload ->> 'ricatatan' AS ricatatan,
        row_payload ->> 'rinoref' AS rinoref,
        NULLIF(row_payload ->> 'ritglnoref', '')::timestamptz AS ritglnoref,
        NULLIF(row_payload ->> 'ritglpenutupan', '')::timestamptz AS ritglpenutupan,
        row_payload ->> 'rimatauang' AS rimatauang,
        NULLIF(row_payload ->> 'rikurs', '')::numeric(20,6) AS rikurs,
        NULLIF(row_payload ->> 'rihargatermasukpajak', '')::numeric(20,6) AS rihargatermasukpajak,
        NULLIF(row_payload ->> 'ritotal', '')::numeric(20,6) AS ritotal,
        NULLIF(row_payload ->> 'ridiskonpersen', '')::bigint AS ridiskonpersen,
        NULLIF(row_payload ->> 'rijmldiskon', '')::numeric(20,6) AS rijmldiskon,
        NULLIF(row_payload ->> 'ritotalpajak1detail', '')::numeric(20,6) AS ritotalpajak1detail,
        NULLIF(row_payload ->> 'ritotalpajak2detail', '')::numeric(20,6) AS ritotalpajak2detail,
        NULLIF(row_payload ->> 'ribiayalainpersen', '')::numeric(20,6) AS ribiayalainpersen,
        NULLIF(row_payload ->> 'ribiayalain', '')::numeric(20,6) AS ribiayalain,
        NULLIF(row_payload ->> 'ritotaltransaksi', '')::numeric(20,6) AS ritotaltransaksi,
        NULLIF(row_payload ->> 'rijmlbayar', '')::numeric(20,6) AS rijmlbayar,
        NULLIF(row_payload ->> 'ristatuslunas', '')::bigint AS ristatuslunas,
        NULLIF(row_payload ->> 'ritgllunas', '')::timestamptz AS ritgllunas,
        row_payload ->> 'rinofakturpajak' AS rinofakturpajak,
        NULLIF(row_payload ->> 'risdhbayarpajak', '')::bigint AS risdhbayarpajak,
        NULLIF(row_payload ->> 'ritglbayarpajak', '')::timestamptz AS ritglbayarpajak,
        row_payload ->> 'rirekdiskon' AS rirekdiskon,
        row_payload ->> 'rirekpajak1' AS rirekpajak1,
        row_payload ->> 'rirekpajak2' AS rirekpajak2,
        row_payload ->> 'rirekbiayalain' AS rirekbiayalain,
        row_payload ->> 'rirekbayar' AS rirekbayar,
        NULLIF(row_payload ->> 'riidpr', '')::bigint AS riidpr,
        NULLIF(row_payload ->> 'riidcs', '')::bigint AS riidcs,
        NULLIF(row_payload ->> 'riidrq', '')::bigint AS riidrq,
        NULLIF(row_payload ->> 'riidbs', '')::bigint AS riidbs,
        NULLIF(row_payload ->> 'riidpo', '')::bigint AS riidpo,
        NULLIF(row_payload ->> 'riidipc', '')::bigint AS riidipc,
        NULLIF(row_payload ->> 'riidgrn', '')::bigint AS riidgrn,
        NULLIF(row_payload ->> 'ristatusdnr', '')::bigint AS ristatusdnr,
        NULLIF(row_payload ->> 'ristatusprt', '')::bigint AS ristatusprt,
        NULLIF(row_payload ->> 'ristatusrealisasi', '')::bigint AS ristatusrealisasi,
        NULLIF(row_payload ->> 'ristatuspie', '')::bigint AS ristatuspie,
        NULLIF(row_payload ->> 'ritglpie', '')::timestamptz AS ritglpie,
        NULLIF(row_payload ->> 'ristatusvpp', '')::bigint AS ristatusvpp,
        NULLIF(row_payload ->> 'ristatus', '')::bigint AS ristatus,
        NULLIF(row_payload ->> 'ristatussebelumnya', '')::bigint AS ristatussebelumnya,
        NULLIF(row_payload ->> 'rijmlrevisi', '')::numeric(20,6) AS rijmlrevisi,
        NULLIF(row_payload ->> 'ricetakanke', '')::bigint AS ricetakanke,
        NULLIF(row_payload ->> 'riposting', '')::bigint AS riposting,
        NULLIF(row_payload ->> 'ripostingtgl', '')::timestamptz AS ripostingtgl,
        NULLIF(row_payload ->> 'ritutupperiode', '')::bigint AS ritutupperiode,
        NULLIF(row_payload ->> 'riisclose', '')::bigint AS riisclose,
        NULLIF(row_payload ->> 'rijmluangmuka', '')::numeric(20,6) AS rijmluangmuka,
        row_payload ->> 'rirekuangmuka' AS rirekuangmuka,
        NULLIF(row_payload ->> 'riidap', '')::bigint AS riidap,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'riid') IS NOT NULL
) AS prepared
ON CONFLICT (riid) DO UPDATE
SET
    ricabang = EXCLUDED.ricabang,
    rilokasi = EXCLUDED.rilokasi,
    rigudang = EXCLUDED.rigudang,
    riasalbarang = EXCLUDED.riasalbarang,
    riasalbarangkategori = EXCLUDED.riasalbarangkategori,
    rijenispembelian = EXCLUDED.rijenispembelian,
    rijenispembeliankategori = EXCLUDED.rijenispembeliankategori,
    risaldoawal = EXCLUDED.risaldoawal,
    ricarabayar = EXCLUDED.ricarabayar,
    risumber = EXCLUDED.risumber,
    riautonotransaksi = EXCLUDED.riautonotransaksi,
    rinotransaksi = EXCLUDED.rinotransaksi,
    ritgl = EXCLUDED.ritgl,
    rikodepa = EXCLUDED.rikodepa,
    risupplier = EXCLUDED.risupplier,
    risupplierkontak = EXCLUDED.risupplierkontak,
    ri1alamat1 = EXCLUDED.ri1alamat1,
    ri1alamat2 = EXCLUDED.ri1alamat2,
    ri1alamat3 = EXCLUDED.ri1alamat3,
    ri2alamat1 = EXCLUDED.ri2alamat1,
    ri2alamat2 = EXCLUDED.ri2alamat2,
    ri2alamat3 = EXCLUDED.ri2alamat3,
    ribagianpembelian = EXCLUDED.ribagianpembelian,
    ritermin = EXCLUDED.ritermin,
    ritgljatuhtempo = EXCLUDED.ritgljatuhtempo,
    riuraian = EXCLUDED.riuraian,
    ricatatan = EXCLUDED.ricatatan,
    rinoref = EXCLUDED.rinoref,
    ritglnoref = EXCLUDED.ritglnoref,
    ritglpenutupan = EXCLUDED.ritglpenutupan,
    rimatauang = EXCLUDED.rimatauang,
    rikurs = EXCLUDED.rikurs,
    rihargatermasukpajak = EXCLUDED.rihargatermasukpajak,
    ritotal = EXCLUDED.ritotal,
    ridiskonpersen = EXCLUDED.ridiskonpersen,
    rijmldiskon = EXCLUDED.rijmldiskon,
    ritotalpajak1detail = EXCLUDED.ritotalpajak1detail,
    ritotalpajak2detail = EXCLUDED.ritotalpajak2detail,
    ribiayalainpersen = EXCLUDED.ribiayalainpersen,
    ribiayalain = EXCLUDED.ribiayalain,
    ritotaltransaksi = EXCLUDED.ritotaltransaksi,
    rijmlbayar = EXCLUDED.rijmlbayar,
    ristatuslunas = EXCLUDED.ristatuslunas,
    ritgllunas = EXCLUDED.ritgllunas,
    rinofakturpajak = EXCLUDED.rinofakturpajak,
    risdhbayarpajak = EXCLUDED.risdhbayarpajak,
    ritglbayarpajak = EXCLUDED.ritglbayarpajak,
    rirekdiskon = EXCLUDED.rirekdiskon,
    rirekpajak1 = EXCLUDED.rirekpajak1,
    rirekpajak2 = EXCLUDED.rirekpajak2,
    rirekbiayalain = EXCLUDED.rirekbiayalain,
    rirekbayar = EXCLUDED.rirekbayar,
    riidpr = EXCLUDED.riidpr,
    riidcs = EXCLUDED.riidcs,
    riidrq = EXCLUDED.riidrq,
    riidbs = EXCLUDED.riidbs,
    riidpo = EXCLUDED.riidpo,
    riidipc = EXCLUDED.riidipc,
    riidgrn = EXCLUDED.riidgrn,
    ristatusdnr = EXCLUDED.ristatusdnr,
    ristatusprt = EXCLUDED.ristatusprt,
    ristatusrealisasi = EXCLUDED.ristatusrealisasi,
    ristatuspie = EXCLUDED.ristatuspie,
    ritglpie = EXCLUDED.ritglpie,
    ristatusvpp = EXCLUDED.ristatusvpp,
    ristatus = EXCLUDED.ristatus,
    ristatussebelumnya = EXCLUDED.ristatussebelumnya,
    rijmlrevisi = EXCLUDED.rijmlrevisi,
    ricetakanke = EXCLUDED.ricetakanke,
    riposting = EXCLUDED.riposting,
    ripostingtgl = EXCLUDED.ripostingtgl,
    ritutupperiode = EXCLUDED.ritutupperiode,
    riisclose = EXCLUDED.riisclose,
    rijmluangmuka = EXCLUDED.rijmluangmuka,
    rirekuangmuka = EXCLUDED.rirekuangmuka,
    riidap = EXCLUDED.riidap,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m4_ri_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m4_ri_detail'
)
INSERT INTO m4_ri_detail (
    idridetail, idri, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, hargafix, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudang, rekpersediaan, rekdiskonpembelian, rekhutangsementara, costcenter, divisi, subdivisi, proyek, catatan, urutan, idprdetail, idcsdetail, idrqdetail, idbsdetail, idpodetail, idipcdetail, idgrndetail, jmldnr, statusdnr, jmlprt, statusprt, jmlrealisasi, statusrealisasi, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idridetail, idri, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, hargafix, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudang, rekpersediaan, rekdiskonpembelian, rekhutangsementara, costcenter, divisi, subdivisi, proyek, catatan, urutan, idprdetail, idcsdetail, idrqdetail, idbsdetail, idpodetail, idipcdetail, idgrndetail, jmldnr, statusdnr, jmlprt, statusprt, jmlrealisasi, statusrealisasi, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idridetail', '')::bigint AS idridetail,
        NULLIF(row_payload ->> 'idri', '')::bigint AS idri,
        NULLIF(row_payload ->> 'idbarang', '')::bigint AS idbarang,
        row_payload ->> 'namabarang' AS namabarang,
        row_payload ->> 'tipebarang' AS tipebarang,
        NULLIF(row_payload ->> 'jml', '')::numeric(20,6) AS jml,
        row_payload ->> 'satuan' AS satuan,
        NULLIF(row_payload ->> 'nilaisatuan', '')::numeric(20,6) AS nilaisatuan,
        NULLIF(row_payload ->> 'jmlbarang', '')::numeric(20,6) AS jmlbarang,
        row_payload ->> 'satuanbarang' AS satuanbarang,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        NULLIF(row_payload ->> 'hargafix', '')::numeric(20,6) AS hargafix,
        NULLIF(row_payload ->> 'harga', '')::numeric(20,6) AS harga,
        NULLIF(row_payload ->> 'diskon', '')::numeric(20,6) AS diskon,
        NULLIF(row_payload ->> 'jmldiskon', '')::numeric(20,6) AS jmldiskon,
        NULLIF(row_payload ->> 'pajak1', '')::numeric(20,6) AS pajak1,
        NULLIF(row_payload ->> 'jmlpajak1', '')::numeric(20,6) AS jmlpajak1,
        NULLIF(row_payload ->> 'pajak2', '')::numeric(20,6) AS pajak2,
        NULLIF(row_payload ->> 'jmlpajak2', '')::numeric(20,6) AS jmlpajak2,
        row_payload ->> 'cabang' AS cabang,
        row_payload ->> 'lokasi' AS lokasi,
        row_payload ->> 'gudang' AS gudang,
        row_payload ->> 'rekpersediaan' AS rekpersediaan,
        NULLIF(row_payload ->> 'rekdiskonpembelian', '')::numeric(20,6) AS rekdiskonpembelian,
        row_payload ->> 'rekhutangsementara' AS rekhutangsementara,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'idprdetail', '')::bigint AS idprdetail,
        NULLIF(row_payload ->> 'idcsdetail', '')::bigint AS idcsdetail,
        NULLIF(row_payload ->> 'idrqdetail', '')::bigint AS idrqdetail,
        NULLIF(row_payload ->> 'idbsdetail', '')::bigint AS idbsdetail,
        NULLIF(row_payload ->> 'idpodetail', '')::bigint AS idpodetail,
        NULLIF(row_payload ->> 'idipcdetail', '')::bigint AS idipcdetail,
        NULLIF(row_payload ->> 'idgrndetail', '')::bigint AS idgrndetail,
        NULLIF(row_payload ->> 'jmldnr', '')::numeric(20,6) AS jmldnr,
        NULLIF(row_payload ->> 'statusdnr', '')::bigint AS statusdnr,
        NULLIF(row_payload ->> 'jmlprt', '')::numeric(20,6) AS jmlprt,
        NULLIF(row_payload ->> 'statusprt', '')::bigint AS statusprt,
        NULLIF(row_payload ->> 'jmlrealisasi', '')::numeric(20,6) AS jmlrealisasi,
        NULLIF(row_payload ->> 'statusrealisasi', '')::bigint AS statusrealisasi,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idridetail') IS NOT NULL
) AS prepared
ON CONFLICT (idridetail) DO UPDATE
SET
    idri = EXCLUDED.idri,
    idbarang = EXCLUDED.idbarang,
    namabarang = EXCLUDED.namabarang,
    tipebarang = EXCLUDED.tipebarang,
    jml = EXCLUDED.jml,
    satuan = EXCLUDED.satuan,
    nilaisatuan = EXCLUDED.nilaisatuan,
    jmlbarang = EXCLUDED.jmlbarang,
    satuanbarang = EXCLUDED.satuanbarang,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    hargafix = EXCLUDED.hargafix,
    harga = EXCLUDED.harga,
    diskon = EXCLUDED.diskon,
    jmldiskon = EXCLUDED.jmldiskon,
    pajak1 = EXCLUDED.pajak1,
    jmlpajak1 = EXCLUDED.jmlpajak1,
    pajak2 = EXCLUDED.pajak2,
    jmlpajak2 = EXCLUDED.jmlpajak2,
    cabang = EXCLUDED.cabang,
    lokasi = EXCLUDED.lokasi,
    gudang = EXCLUDED.gudang,
    rekpersediaan = EXCLUDED.rekpersediaan,
    rekdiskonpembelian = EXCLUDED.rekdiskonpembelian,
    rekhutangsementara = EXCLUDED.rekhutangsementara,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    idprdetail = EXCLUDED.idprdetail,
    idcsdetail = EXCLUDED.idcsdetail,
    idrqdetail = EXCLUDED.idrqdetail,
    idbsdetail = EXCLUDED.idbsdetail,
    idpodetail = EXCLUDED.idpodetail,
    idipcdetail = EXCLUDED.idipcdetail,
    idgrndetail = EXCLUDED.idgrndetail,
    jmldnr = EXCLUDED.jmldnr,
    statusdnr = EXCLUDED.statusdnr,
    jmlprt = EXCLUDED.jmlprt,
    statusprt = EXCLUDED.statusprt,
    jmlrealisasi = EXCLUDED.jmlrealisasi,
    statusrealisasi = EXCLUDED.statusrealisasi,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m4_dnr
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m4_dnr'
)
INSERT INTO m4_dnr (
    dnrid, dnrcabang, dnrlokasi, dnrgudang, dnrasalbarang, dnrasalbarangkategori, dnrjenispembelian, dnrjenispembeliankategori, dnrcarabayar, dnrsumber, dnrautonotransaksi, dnrnotransaksi, dnrtgl, dnrkodepa, dnrsupplier, dnrsupplierkontak, dnr1alamat1, dnr1alamat2, dnr1alamat3, dnr2alamat1, dnr2alamat2, dnr2alamat3, dnrbagianpembelian, dnrtermin, dnrtgljatuhtempo, dnruraian, dnrcatatan, dnrnoref, dnrtglnoref, dnrtglpenutupan, dnrmatauang, dnrkurs, dnrhargatermasukpajak, dnrtotal, dnrdiskonpersen, dnrjmldiskon, dnrtotalpajak1detail, dnrtotalpajak2detail, dnrbiayalainpersen, dnrbiayalain, dnrtotaltransaksi, dnrjmlbayar, dnrstatuslunas, dnrtgllunas, dnrnofakturpajak, dnrsdhbayarpajak, dnrtglbayarpajak, dnrrekdiskon, dnrrekpajak1, dnrrekpajak2, dnrrekbiayalain, dnrrekbayar, dnridpr, dnridcs, dnridrq, dnridbs, dnridpo, dnridipc, dnridgrn, dnridri, dnrstatusprt, dnrstatusrealisasi, dnrstatus, dnrstatussebelumnya, dnrjmlrevisi, dnrcetakanke, dnrposting, dnrpostingtgl, dnrtutupperiode, dnrisclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    dnrid, dnrcabang, dnrlokasi, dnrgudang, dnrasalbarang, dnrasalbarangkategori, dnrjenispembelian, dnrjenispembeliankategori, dnrcarabayar, dnrsumber, dnrautonotransaksi, dnrnotransaksi, dnrtgl, dnrkodepa, dnrsupplier, dnrsupplierkontak, dnr1alamat1, dnr1alamat2, dnr1alamat3, dnr2alamat1, dnr2alamat2, dnr2alamat3, dnrbagianpembelian, dnrtermin, dnrtgljatuhtempo, dnruraian, dnrcatatan, dnrnoref, dnrtglnoref, dnrtglpenutupan, dnrmatauang, dnrkurs, dnrhargatermasukpajak, dnrtotal, dnrdiskonpersen, dnrjmldiskon, dnrtotalpajak1detail, dnrtotalpajak2detail, dnrbiayalainpersen, dnrbiayalain, dnrtotaltransaksi, dnrjmlbayar, dnrstatuslunas, dnrtgllunas, dnrnofakturpajak, dnrsdhbayarpajak, dnrtglbayarpajak, dnrrekdiskon, dnrrekpajak1, dnrrekpajak2, dnrrekbiayalain, dnrrekbayar, dnridpr, dnridcs, dnridrq, dnridbs, dnridpo, dnridipc, dnridgrn, dnridri, dnrstatusprt, dnrstatusrealisasi, dnrstatus, dnrstatussebelumnya, dnrjmlrevisi, dnrcetakanke, dnrposting, dnrpostingtgl, dnrtutupperiode, dnrisclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'dnrid', '')::bigint AS dnrid,
        row_payload ->> 'dnrcabang' AS dnrcabang,
        row_payload ->> 'dnrlokasi' AS dnrlokasi,
        row_payload ->> 'dnrgudang' AS dnrgudang,
        row_payload ->> 'dnrasalbarang' AS dnrasalbarang,
        row_payload ->> 'dnrasalbarangkategori' AS dnrasalbarangkategori,
        row_payload ->> 'dnrjenispembelian' AS dnrjenispembelian,
        row_payload ->> 'dnrjenispembeliankategori' AS dnrjenispembeliankategori,
        row_payload ->> 'dnrcarabayar' AS dnrcarabayar,
        row_payload ->> 'dnrsumber' AS dnrsumber,
        row_payload ->> 'dnrautonotransaksi' AS dnrautonotransaksi,
        row_payload ->> 'dnrnotransaksi' AS dnrnotransaksi,
        NULLIF(row_payload ->> 'dnrtgl', '')::timestamptz AS dnrtgl,
        row_payload ->> 'dnrkodepa' AS dnrkodepa,
        row_payload ->> 'dnrsupplier' AS dnrsupplier,
        row_payload ->> 'dnrsupplierkontak' AS dnrsupplierkontak,
        row_payload ->> 'dnr1alamat1' AS dnr1alamat1,
        row_payload ->> 'dnr1alamat2' AS dnr1alamat2,
        row_payload ->> 'dnr1alamat3' AS dnr1alamat3,
        row_payload ->> 'dnr2alamat1' AS dnr2alamat1,
        row_payload ->> 'dnr2alamat2' AS dnr2alamat2,
        row_payload ->> 'dnr2alamat3' AS dnr2alamat3,
        row_payload ->> 'dnrbagianpembelian' AS dnrbagianpembelian,
        row_payload ->> 'dnrtermin' AS dnrtermin,
        NULLIF(row_payload ->> 'dnrtgljatuhtempo', '')::timestamptz AS dnrtgljatuhtempo,
        row_payload ->> 'dnruraian' AS dnruraian,
        row_payload ->> 'dnrcatatan' AS dnrcatatan,
        row_payload ->> 'dnrnoref' AS dnrnoref,
        NULLIF(row_payload ->> 'dnrtglnoref', '')::timestamptz AS dnrtglnoref,
        NULLIF(row_payload ->> 'dnrtglpenutupan', '')::timestamptz AS dnrtglpenutupan,
        row_payload ->> 'dnrmatauang' AS dnrmatauang,
        NULLIF(row_payload ->> 'dnrkurs', '')::numeric(20,6) AS dnrkurs,
        NULLIF(row_payload ->> 'dnrhargatermasukpajak', '')::numeric(20,6) AS dnrhargatermasukpajak,
        NULLIF(row_payload ->> 'dnrtotal', '')::numeric(20,6) AS dnrtotal,
        NULLIF(row_payload ->> 'dnrdiskonpersen', '')::numeric(20,6) AS dnrdiskonpersen,
        NULLIF(row_payload ->> 'dnrjmldiskon', '')::numeric(20,6) AS dnrjmldiskon,
        NULLIF(row_payload ->> 'dnrtotalpajak1detail', '')::numeric(20,6) AS dnrtotalpajak1detail,
        NULLIF(row_payload ->> 'dnrtotalpajak2detail', '')::numeric(20,6) AS dnrtotalpajak2detail,
        NULLIF(row_payload ->> 'dnrbiayalainpersen', '')::numeric(20,6) AS dnrbiayalainpersen,
        row_payload ->> 'dnrbiayalain' AS dnrbiayalain,
        NULLIF(row_payload ->> 'dnrtotaltransaksi', '')::numeric(20,6) AS dnrtotaltransaksi,
        NULLIF(row_payload ->> 'dnrjmlbayar', '')::numeric(20,6) AS dnrjmlbayar,
        row_payload ->> 'dnrstatuslunas' AS dnrstatuslunas,
        NULLIF(row_payload ->> 'dnrtgllunas', '')::timestamptz AS dnrtgllunas,
        NULLIF(row_payload ->> 'dnrnofakturpajak', '')::numeric(20,6) AS dnrnofakturpajak,
        NULLIF(row_payload ->> 'dnrsdhbayarpajak', '')::numeric(20,6) AS dnrsdhbayarpajak,
        NULLIF(row_payload ->> 'dnrtglbayarpajak', '')::timestamptz AS dnrtglbayarpajak,
        NULLIF(row_payload ->> 'dnrrekdiskon', '')::numeric(20,6) AS dnrrekdiskon,
        NULLIF(row_payload ->> 'dnrrekpajak1', '')::numeric(20,6) AS dnrrekpajak1,
        NULLIF(row_payload ->> 'dnrrekpajak2', '')::numeric(20,6) AS dnrrekpajak2,
        row_payload ->> 'dnrrekbiayalain' AS dnrrekbiayalain,
        row_payload ->> 'dnrrekbayar' AS dnrrekbayar,
        NULLIF(row_payload ->> 'dnridpr', '')::bigint AS dnridpr,
        NULLIF(row_payload ->> 'dnridcs', '')::bigint AS dnridcs,
        NULLIF(row_payload ->> 'dnridrq', '')::bigint AS dnridrq,
        NULLIF(row_payload ->> 'dnridbs', '')::bigint AS dnridbs,
        NULLIF(row_payload ->> 'dnridpo', '')::bigint AS dnridpo,
        NULLIF(row_payload ->> 'dnridipc', '')::bigint AS dnridipc,
        NULLIF(row_payload ->> 'dnridgrn', '')::bigint AS dnridgrn,
        NULLIF(row_payload ->> 'dnridri', '')::bigint AS dnridri,
        row_payload ->> 'dnrstatusprt' AS dnrstatusprt,
        row_payload ->> 'dnrstatusrealisasi' AS dnrstatusrealisasi,
        row_payload ->> 'dnrstatus' AS dnrstatus,
        row_payload ->> 'dnrstatussebelumnya' AS dnrstatussebelumnya,
        NULLIF(row_payload ->> 'dnrjmlrevisi', '')::numeric(20,6) AS dnrjmlrevisi,
        row_payload ->> 'dnrcetakanke' AS dnrcetakanke,
        NULLIF(row_payload ->> 'dnrposting', '')::bigint AS dnrposting,
        NULLIF(row_payload ->> 'dnrpostingtgl', '')::timestamptz AS dnrpostingtgl,
        row_payload ->> 'dnrtutupperiode' AS dnrtutupperiode,
        NULLIF(row_payload ->> 'dnrisclose', '')::bigint AS dnrisclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'dnrid') IS NOT NULL
) AS prepared
ON CONFLICT (dnrid) DO UPDATE
SET
    dnrcabang = EXCLUDED.dnrcabang,
    dnrlokasi = EXCLUDED.dnrlokasi,
    dnrgudang = EXCLUDED.dnrgudang,
    dnrasalbarang = EXCLUDED.dnrasalbarang,
    dnrasalbarangkategori = EXCLUDED.dnrasalbarangkategori,
    dnrjenispembelian = EXCLUDED.dnrjenispembelian,
    dnrjenispembeliankategori = EXCLUDED.dnrjenispembeliankategori,
    dnrcarabayar = EXCLUDED.dnrcarabayar,
    dnrsumber = EXCLUDED.dnrsumber,
    dnrautonotransaksi = EXCLUDED.dnrautonotransaksi,
    dnrnotransaksi = EXCLUDED.dnrnotransaksi,
    dnrtgl = EXCLUDED.dnrtgl,
    dnrkodepa = EXCLUDED.dnrkodepa,
    dnrsupplier = EXCLUDED.dnrsupplier,
    dnrsupplierkontak = EXCLUDED.dnrsupplierkontak,
    dnr1alamat1 = EXCLUDED.dnr1alamat1,
    dnr1alamat2 = EXCLUDED.dnr1alamat2,
    dnr1alamat3 = EXCLUDED.dnr1alamat3,
    dnr2alamat1 = EXCLUDED.dnr2alamat1,
    dnr2alamat2 = EXCLUDED.dnr2alamat2,
    dnr2alamat3 = EXCLUDED.dnr2alamat3,
    dnrbagianpembelian = EXCLUDED.dnrbagianpembelian,
    dnrtermin = EXCLUDED.dnrtermin,
    dnrtgljatuhtempo = EXCLUDED.dnrtgljatuhtempo,
    dnruraian = EXCLUDED.dnruraian,
    dnrcatatan = EXCLUDED.dnrcatatan,
    dnrnoref = EXCLUDED.dnrnoref,
    dnrtglnoref = EXCLUDED.dnrtglnoref,
    dnrtglpenutupan = EXCLUDED.dnrtglpenutupan,
    dnrmatauang = EXCLUDED.dnrmatauang,
    dnrkurs = EXCLUDED.dnrkurs,
    dnrhargatermasukpajak = EXCLUDED.dnrhargatermasukpajak,
    dnrtotal = EXCLUDED.dnrtotal,
    dnrdiskonpersen = EXCLUDED.dnrdiskonpersen,
    dnrjmldiskon = EXCLUDED.dnrjmldiskon,
    dnrtotalpajak1detail = EXCLUDED.dnrtotalpajak1detail,
    dnrtotalpajak2detail = EXCLUDED.dnrtotalpajak2detail,
    dnrbiayalainpersen = EXCLUDED.dnrbiayalainpersen,
    dnrbiayalain = EXCLUDED.dnrbiayalain,
    dnrtotaltransaksi = EXCLUDED.dnrtotaltransaksi,
    dnrjmlbayar = EXCLUDED.dnrjmlbayar,
    dnrstatuslunas = EXCLUDED.dnrstatuslunas,
    dnrtgllunas = EXCLUDED.dnrtgllunas,
    dnrnofakturpajak = EXCLUDED.dnrnofakturpajak,
    dnrsdhbayarpajak = EXCLUDED.dnrsdhbayarpajak,
    dnrtglbayarpajak = EXCLUDED.dnrtglbayarpajak,
    dnrrekdiskon = EXCLUDED.dnrrekdiskon,
    dnrrekpajak1 = EXCLUDED.dnrrekpajak1,
    dnrrekpajak2 = EXCLUDED.dnrrekpajak2,
    dnrrekbiayalain = EXCLUDED.dnrrekbiayalain,
    dnrrekbayar = EXCLUDED.dnrrekbayar,
    dnridpr = EXCLUDED.dnridpr,
    dnridcs = EXCLUDED.dnridcs,
    dnridrq = EXCLUDED.dnridrq,
    dnridbs = EXCLUDED.dnridbs,
    dnridpo = EXCLUDED.dnridpo,
    dnridipc = EXCLUDED.dnridipc,
    dnridgrn = EXCLUDED.dnridgrn,
    dnridri = EXCLUDED.dnridri,
    dnrstatusprt = EXCLUDED.dnrstatusprt,
    dnrstatusrealisasi = EXCLUDED.dnrstatusrealisasi,
    dnrstatus = EXCLUDED.dnrstatus,
    dnrstatussebelumnya = EXCLUDED.dnrstatussebelumnya,
    dnrjmlrevisi = EXCLUDED.dnrjmlrevisi,
    dnrcetakanke = EXCLUDED.dnrcetakanke,
    dnrposting = EXCLUDED.dnrposting,
    dnrpostingtgl = EXCLUDED.dnrpostingtgl,
    dnrtutupperiode = EXCLUDED.dnrtutupperiode,
    dnrisclose = EXCLUDED.dnrisclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m4_dnr_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m4_dnr_detail'
)
INSERT INTO m4_dnr_detail (
    iddnrdetail, iddnr, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, hargafix, idhppkhususmasuk, idhppfifomasuk, hpp, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudangasal, gudangtransit, gudangtujuan, rekpersediaan, rekdiskonpembelian, rekhargapokok, rekreturpembelian, costcenter, divisi, subdivisi, proyek, catatan, urutan, idprdetail, idcsdetail, idrqdetail, idbsdetail, idpodetail, idipcdetail, idgrndetail, idridetail, jmlprt, statusprt, jmlrealisasi, statusrealisasi, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    iddnrdetail, iddnr, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, hargafix, idhppkhususmasuk, idhppfifomasuk, hpp, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudangasal, gudangtransit, gudangtujuan, rekpersediaan, rekdiskonpembelian, rekhargapokok, rekreturpembelian, costcenter, divisi, subdivisi, proyek, catatan, urutan, idprdetail, idcsdetail, idrqdetail, idbsdetail, idpodetail, idipcdetail, idgrndetail, idridetail, jmlprt, statusprt, jmlrealisasi, statusrealisasi, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'iddnrdetail', '')::bigint AS iddnrdetail,
        NULLIF(row_payload ->> 'iddnr', '')::bigint AS iddnr,
        NULLIF(row_payload ->> 'idbarang', '')::bigint AS idbarang,
        row_payload ->> 'namabarang' AS namabarang,
        row_payload ->> 'tipebarang' AS tipebarang,
        NULLIF(row_payload ->> 'jml', '')::numeric(20,6) AS jml,
        row_payload ->> 'satuan' AS satuan,
        NULLIF(row_payload ->> 'nilaisatuan', '')::numeric(20,6) AS nilaisatuan,
        NULLIF(row_payload ->> 'jmlbarang', '')::numeric(20,6) AS jmlbarang,
        row_payload ->> 'satuanbarang' AS satuanbarang,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        NULLIF(row_payload ->> 'hargafix', '')::numeric(20,6) AS hargafix,
        NULLIF(row_payload ->> 'idhppkhususmasuk', '')::bigint AS idhppkhususmasuk,
        NULLIF(row_payload ->> 'idhppfifomasuk', '')::bigint AS idhppfifomasuk,
        row_payload ->> 'hpp' AS hpp,
        NULLIF(row_payload ->> 'harga', '')::numeric(20,6) AS harga,
        NULLIF(row_payload ->> 'diskon', '')::numeric(20,6) AS diskon,
        NULLIF(row_payload ->> 'jmldiskon', '')::numeric(20,6) AS jmldiskon,
        NULLIF(row_payload ->> 'pajak1', '')::numeric(20,6) AS pajak1,
        NULLIF(row_payload ->> 'jmlpajak1', '')::numeric(20,6) AS jmlpajak1,
        NULLIF(row_payload ->> 'pajak2', '')::numeric(20,6) AS pajak2,
        NULLIF(row_payload ->> 'jmlpajak2', '')::numeric(20,6) AS jmlpajak2,
        row_payload ->> 'cabang' AS cabang,
        row_payload ->> 'lokasi' AS lokasi,
        row_payload ->> 'gudangasal' AS gudangasal,
        row_payload ->> 'gudangtransit' AS gudangtransit,
        row_payload ->> 'gudangtujuan' AS gudangtujuan,
        row_payload ->> 'rekpersediaan' AS rekpersediaan,
        NULLIF(row_payload ->> 'rekdiskonpembelian', '')::numeric(20,6) AS rekdiskonpembelian,
        NULLIF(row_payload ->> 'rekhargapokok', '')::numeric(20,6) AS rekhargapokok,
        row_payload ->> 'rekreturpembelian' AS rekreturpembelian,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'idprdetail', '')::bigint AS idprdetail,
        NULLIF(row_payload ->> 'idcsdetail', '')::bigint AS idcsdetail,
        NULLIF(row_payload ->> 'idrqdetail', '')::bigint AS idrqdetail,
        NULLIF(row_payload ->> 'idbsdetail', '')::bigint AS idbsdetail,
        NULLIF(row_payload ->> 'idpodetail', '')::bigint AS idpodetail,
        NULLIF(row_payload ->> 'idipcdetail', '')::bigint AS idipcdetail,
        NULLIF(row_payload ->> 'idgrndetail', '')::bigint AS idgrndetail,
        NULLIF(row_payload ->> 'idridetail', '')::bigint AS idridetail,
        NULLIF(row_payload ->> 'jmlprt', '')::numeric(20,6) AS jmlprt,
        NULLIF(row_payload ->> 'statusprt', '')::bigint AS statusprt,
        NULLIF(row_payload ->> 'jmlrealisasi', '')::numeric(20,6) AS jmlrealisasi,
        NULLIF(row_payload ->> 'statusrealisasi', '')::bigint AS statusrealisasi,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'iddnrdetail') IS NOT NULL
) AS prepared
ON CONFLICT (iddnrdetail) DO UPDATE
SET
    iddnr = EXCLUDED.iddnr,
    idbarang = EXCLUDED.idbarang,
    namabarang = EXCLUDED.namabarang,
    tipebarang = EXCLUDED.tipebarang,
    jml = EXCLUDED.jml,
    satuan = EXCLUDED.satuan,
    nilaisatuan = EXCLUDED.nilaisatuan,
    jmlbarang = EXCLUDED.jmlbarang,
    satuanbarang = EXCLUDED.satuanbarang,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    hargafix = EXCLUDED.hargafix,
    idhppkhususmasuk = EXCLUDED.idhppkhususmasuk,
    idhppfifomasuk = EXCLUDED.idhppfifomasuk,
    hpp = EXCLUDED.hpp,
    harga = EXCLUDED.harga,
    diskon = EXCLUDED.diskon,
    jmldiskon = EXCLUDED.jmldiskon,
    pajak1 = EXCLUDED.pajak1,
    jmlpajak1 = EXCLUDED.jmlpajak1,
    pajak2 = EXCLUDED.pajak2,
    jmlpajak2 = EXCLUDED.jmlpajak2,
    cabang = EXCLUDED.cabang,
    lokasi = EXCLUDED.lokasi,
    gudangasal = EXCLUDED.gudangasal,
    gudangtransit = EXCLUDED.gudangtransit,
    gudangtujuan = EXCLUDED.gudangtujuan,
    rekpersediaan = EXCLUDED.rekpersediaan,
    rekdiskonpembelian = EXCLUDED.rekdiskonpembelian,
    rekhargapokok = EXCLUDED.rekhargapokok,
    rekreturpembelian = EXCLUDED.rekreturpembelian,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    idprdetail = EXCLUDED.idprdetail,
    idcsdetail = EXCLUDED.idcsdetail,
    idrqdetail = EXCLUDED.idrqdetail,
    idbsdetail = EXCLUDED.idbsdetail,
    idpodetail = EXCLUDED.idpodetail,
    idipcdetail = EXCLUDED.idipcdetail,
    idgrndetail = EXCLUDED.idgrndetail,
    idridetail = EXCLUDED.idridetail,
    jmlprt = EXCLUDED.jmlprt,
    statusprt = EXCLUDED.statusprt,
    jmlrealisasi = EXCLUDED.jmlrealisasi,
    statusrealisasi = EXCLUDED.statusrealisasi,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m4_prt
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m4_prt'
)
INSERT INTO m4_prt (
    prtid, prtcabang, prtlokasi, prtjenis, prtgudang, prtasalbarang, prtasalbarangkategori, prtjenispembelian, prtjenispembeliankategori, prtsaldoawal, prtcarabayar, prtsumber, prtautonotransaksi, prtnotransaksi, prttgl, prtkodepa, prtsupplier, prtsupplierkontak, prt1alamat1, prt1alamat2, prt1alamat3, prt2alamat1, prt2alamat2, prt2alamat3, prtbagianpembelian, prttermin, prttgljatuhtempo, prturaian, prtcatatan, prtnoref, prttglnoref, prttglpenutupan, prtmatauang, prtkurs, prthargatermasukpajak, prttotal, prtdiskonpersen, prtjmldiskon, prttotalpajak1detail, prttotalpajak2detail, prtbiayalainpersen, prtbiayalain, prttotaltransaksi, prtsisatransaksi, prtjmlbayar, prtstatuslunas, prttgllunas, prtnofakturpajak, prtsdhbayarpajak, prttglbayarpajak, prtrekdiskon, prtrekpajak1, prtrekpajak2, prtrekbiayalain, prtrekbayar, prtreksisa, prtidpr, prtidcs, prtidrq, prtidbs, prtidpo, prtidipc, prtidgrn, prtidri, prtiddnr, prtstatuspie, prttglpie, prtstatusvpp, prtstatus, prtstatussebelumnya, prtjmlrevisi, prtcetakanke, prtposting, prtpostingtgl, prttutupperiode, prtisclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    prtid, prtcabang, prtlokasi, prtjenis, prtgudang, prtasalbarang, prtasalbarangkategori, prtjenispembelian, prtjenispembeliankategori, prtsaldoawal, prtcarabayar, prtsumber, prtautonotransaksi, prtnotransaksi, prttgl, prtkodepa, prtsupplier, prtsupplierkontak, prt1alamat1, prt1alamat2, prt1alamat3, prt2alamat1, prt2alamat2, prt2alamat3, prtbagianpembelian, prttermin, prttgljatuhtempo, prturaian, prtcatatan, prtnoref, prttglnoref, prttglpenutupan, prtmatauang, prtkurs, prthargatermasukpajak, prttotal, prtdiskonpersen, prtjmldiskon, prttotalpajak1detail, prttotalpajak2detail, prtbiayalainpersen, prtbiayalain, prttotaltransaksi, prtsisatransaksi, prtjmlbayar, prtstatuslunas, prttgllunas, prtnofakturpajak, prtsdhbayarpajak, prttglbayarpajak, prtrekdiskon, prtrekpajak1, prtrekpajak2, prtrekbiayalain, prtrekbayar, prtreksisa, prtidpr, prtidcs, prtidrq, prtidbs, prtidpo, prtidipc, prtidgrn, prtidri, prtiddnr, prtstatuspie, prttglpie, prtstatusvpp, prtstatus, prtstatussebelumnya, prtjmlrevisi, prtcetakanke, prtposting, prtpostingtgl, prttutupperiode, prtisclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'prtid', '')::bigint AS prtid,
        row_payload ->> 'prtcabang' AS prtcabang,
        row_payload ->> 'prtlokasi' AS prtlokasi,
        row_payload ->> 'prtjenis' AS prtjenis,
        row_payload ->> 'prtgudang' AS prtgudang,
        row_payload ->> 'prtasalbarang' AS prtasalbarang,
        row_payload ->> 'prtasalbarangkategori' AS prtasalbarangkategori,
        row_payload ->> 'prtjenispembelian' AS prtjenispembelian,
        row_payload ->> 'prtjenispembeliankategori' AS prtjenispembeliankategori,
        NULLIF(row_payload ->> 'prtsaldoawal', '')::numeric(20,6) AS prtsaldoawal,
        row_payload ->> 'prtcarabayar' AS prtcarabayar,
        row_payload ->> 'prtsumber' AS prtsumber,
        row_payload ->> 'prtautonotransaksi' AS prtautonotransaksi,
        row_payload ->> 'prtnotransaksi' AS prtnotransaksi,
        NULLIF(row_payload ->> 'prttgl', '')::timestamptz AS prttgl,
        row_payload ->> 'prtkodepa' AS prtkodepa,
        row_payload ->> 'prtsupplier' AS prtsupplier,
        row_payload ->> 'prtsupplierkontak' AS prtsupplierkontak,
        row_payload ->> 'prt1alamat1' AS prt1alamat1,
        row_payload ->> 'prt1alamat2' AS prt1alamat2,
        row_payload ->> 'prt1alamat3' AS prt1alamat3,
        row_payload ->> 'prt2alamat1' AS prt2alamat1,
        row_payload ->> 'prt2alamat2' AS prt2alamat2,
        row_payload ->> 'prt2alamat3' AS prt2alamat3,
        row_payload ->> 'prtbagianpembelian' AS prtbagianpembelian,
        row_payload ->> 'prttermin' AS prttermin,
        NULLIF(row_payload ->> 'prttgljatuhtempo', '')::timestamptz AS prttgljatuhtempo,
        row_payload ->> 'prturaian' AS prturaian,
        row_payload ->> 'prtcatatan' AS prtcatatan,
        row_payload ->> 'prtnoref' AS prtnoref,
        NULLIF(row_payload ->> 'prttglnoref', '')::timestamptz AS prttglnoref,
        NULLIF(row_payload ->> 'prttglpenutupan', '')::timestamptz AS prttglpenutupan,
        row_payload ->> 'prtmatauang' AS prtmatauang,
        NULLIF(row_payload ->> 'prtkurs', '')::numeric(20,6) AS prtkurs,
        NULLIF(row_payload ->> 'prthargatermasukpajak', '')::numeric(20,6) AS prthargatermasukpajak,
        NULLIF(row_payload ->> 'prttotal', '')::numeric(20,6) AS prttotal,
        NULLIF(row_payload ->> 'prtdiskonpersen', '')::numeric(20,6) AS prtdiskonpersen,
        NULLIF(row_payload ->> 'prtjmldiskon', '')::numeric(20,6) AS prtjmldiskon,
        NULLIF(row_payload ->> 'prttotalpajak1detail', '')::numeric(20,6) AS prttotalpajak1detail,
        NULLIF(row_payload ->> 'prttotalpajak2detail', '')::numeric(20,6) AS prttotalpajak2detail,
        NULLIF(row_payload ->> 'prtbiayalainpersen', '')::numeric(20,6) AS prtbiayalainpersen,
        row_payload ->> 'prtbiayalain' AS prtbiayalain,
        NULLIF(row_payload ->> 'prttotaltransaksi', '')::numeric(20,6) AS prttotaltransaksi,
        row_payload ->> 'prtsisatransaksi' AS prtsisatransaksi,
        NULLIF(row_payload ->> 'prtjmlbayar', '')::numeric(20,6) AS prtjmlbayar,
        row_payload ->> 'prtstatuslunas' AS prtstatuslunas,
        NULLIF(row_payload ->> 'prttgllunas', '')::timestamptz AS prttgllunas,
        NULLIF(row_payload ->> 'prtnofakturpajak', '')::numeric(20,6) AS prtnofakturpajak,
        NULLIF(row_payload ->> 'prtsdhbayarpajak', '')::numeric(20,6) AS prtsdhbayarpajak,
        NULLIF(row_payload ->> 'prttglbayarpajak', '')::timestamptz AS prttglbayarpajak,
        NULLIF(row_payload ->> 'prtrekdiskon', '')::numeric(20,6) AS prtrekdiskon,
        NULLIF(row_payload ->> 'prtrekpajak1', '')::numeric(20,6) AS prtrekpajak1,
        NULLIF(row_payload ->> 'prtrekpajak2', '')::numeric(20,6) AS prtrekpajak2,
        row_payload ->> 'prtrekbiayalain' AS prtrekbiayalain,
        row_payload ->> 'prtrekbayar' AS prtrekbayar,
        row_payload ->> 'prtreksisa' AS prtreksisa,
        NULLIF(row_payload ->> 'prtidpr', '')::bigint AS prtidpr,
        NULLIF(row_payload ->> 'prtidcs', '')::bigint AS prtidcs,
        NULLIF(row_payload ->> 'prtidrq', '')::bigint AS prtidrq,
        NULLIF(row_payload ->> 'prtidbs', '')::bigint AS prtidbs,
        NULLIF(row_payload ->> 'prtidpo', '')::bigint AS prtidpo,
        NULLIF(row_payload ->> 'prtidipc', '')::bigint AS prtidipc,
        NULLIF(row_payload ->> 'prtidgrn', '')::bigint AS prtidgrn,
        NULLIF(row_payload ->> 'prtidri', '')::bigint AS prtidri,
        NULLIF(row_payload ->> 'prtiddnr', '')::bigint AS prtiddnr,
        row_payload ->> 'prtstatuspie' AS prtstatuspie,
        NULLIF(row_payload ->> 'prttglpie', '')::timestamptz AS prttglpie,
        row_payload ->> 'prtstatusvpp' AS prtstatusvpp,
        row_payload ->> 'prtstatus' AS prtstatus,
        row_payload ->> 'prtstatussebelumnya' AS prtstatussebelumnya,
        NULLIF(row_payload ->> 'prtjmlrevisi', '')::numeric(20,6) AS prtjmlrevisi,
        row_payload ->> 'prtcetakanke' AS prtcetakanke,
        NULLIF(row_payload ->> 'prtposting', '')::bigint AS prtposting,
        NULLIF(row_payload ->> 'prtpostingtgl', '')::timestamptz AS prtpostingtgl,
        row_payload ->> 'prttutupperiode' AS prttutupperiode,
        NULLIF(row_payload ->> 'prtisclose', '')::bigint AS prtisclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'prtid') IS NOT NULL
) AS prepared
ON CONFLICT (prtid) DO UPDATE
SET
    prtcabang = EXCLUDED.prtcabang,
    prtlokasi = EXCLUDED.prtlokasi,
    prtjenis = EXCLUDED.prtjenis,
    prtgudang = EXCLUDED.prtgudang,
    prtasalbarang = EXCLUDED.prtasalbarang,
    prtasalbarangkategori = EXCLUDED.prtasalbarangkategori,
    prtjenispembelian = EXCLUDED.prtjenispembelian,
    prtjenispembeliankategori = EXCLUDED.prtjenispembeliankategori,
    prtsaldoawal = EXCLUDED.prtsaldoawal,
    prtcarabayar = EXCLUDED.prtcarabayar,
    prtsumber = EXCLUDED.prtsumber,
    prtautonotransaksi = EXCLUDED.prtautonotransaksi,
    prtnotransaksi = EXCLUDED.prtnotransaksi,
    prttgl = EXCLUDED.prttgl,
    prtkodepa = EXCLUDED.prtkodepa,
    prtsupplier = EXCLUDED.prtsupplier,
    prtsupplierkontak = EXCLUDED.prtsupplierkontak,
    prt1alamat1 = EXCLUDED.prt1alamat1,
    prt1alamat2 = EXCLUDED.prt1alamat2,
    prt1alamat3 = EXCLUDED.prt1alamat3,
    prt2alamat1 = EXCLUDED.prt2alamat1,
    prt2alamat2 = EXCLUDED.prt2alamat2,
    prt2alamat3 = EXCLUDED.prt2alamat3,
    prtbagianpembelian = EXCLUDED.prtbagianpembelian,
    prttermin = EXCLUDED.prttermin,
    prttgljatuhtempo = EXCLUDED.prttgljatuhtempo,
    prturaian = EXCLUDED.prturaian,
    prtcatatan = EXCLUDED.prtcatatan,
    prtnoref = EXCLUDED.prtnoref,
    prttglnoref = EXCLUDED.prttglnoref,
    prttglpenutupan = EXCLUDED.prttglpenutupan,
    prtmatauang = EXCLUDED.prtmatauang,
    prtkurs = EXCLUDED.prtkurs,
    prthargatermasukpajak = EXCLUDED.prthargatermasukpajak,
    prttotal = EXCLUDED.prttotal,
    prtdiskonpersen = EXCLUDED.prtdiskonpersen,
    prtjmldiskon = EXCLUDED.prtjmldiskon,
    prttotalpajak1detail = EXCLUDED.prttotalpajak1detail,
    prttotalpajak2detail = EXCLUDED.prttotalpajak2detail,
    prtbiayalainpersen = EXCLUDED.prtbiayalainpersen,
    prtbiayalain = EXCLUDED.prtbiayalain,
    prttotaltransaksi = EXCLUDED.prttotaltransaksi,
    prtsisatransaksi = EXCLUDED.prtsisatransaksi,
    prtjmlbayar = EXCLUDED.prtjmlbayar,
    prtstatuslunas = EXCLUDED.prtstatuslunas,
    prttgllunas = EXCLUDED.prttgllunas,
    prtnofakturpajak = EXCLUDED.prtnofakturpajak,
    prtsdhbayarpajak = EXCLUDED.prtsdhbayarpajak,
    prttglbayarpajak = EXCLUDED.prttglbayarpajak,
    prtrekdiskon = EXCLUDED.prtrekdiskon,
    prtrekpajak1 = EXCLUDED.prtrekpajak1,
    prtrekpajak2 = EXCLUDED.prtrekpajak2,
    prtrekbiayalain = EXCLUDED.prtrekbiayalain,
    prtrekbayar = EXCLUDED.prtrekbayar,
    prtreksisa = EXCLUDED.prtreksisa,
    prtidpr = EXCLUDED.prtidpr,
    prtidcs = EXCLUDED.prtidcs,
    prtidrq = EXCLUDED.prtidrq,
    prtidbs = EXCLUDED.prtidbs,
    prtidpo = EXCLUDED.prtidpo,
    prtidipc = EXCLUDED.prtidipc,
    prtidgrn = EXCLUDED.prtidgrn,
    prtidri = EXCLUDED.prtidri,
    prtiddnr = EXCLUDED.prtiddnr,
    prtstatuspie = EXCLUDED.prtstatuspie,
    prttglpie = EXCLUDED.prttglpie,
    prtstatusvpp = EXCLUDED.prtstatusvpp,
    prtstatus = EXCLUDED.prtstatus,
    prtstatussebelumnya = EXCLUDED.prtstatussebelumnya,
    prtjmlrevisi = EXCLUDED.prtjmlrevisi,
    prtcetakanke = EXCLUDED.prtcetakanke,
    prtposting = EXCLUDED.prtposting,
    prtpostingtgl = EXCLUDED.prtpostingtgl,
    prttutupperiode = EXCLUDED.prttutupperiode,
    prtisclose = EXCLUDED.prtisclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m4_prt_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m4_prt_detail'
)
INSERT INTO m4_prt_detail (
    idprtdetail, idprt, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, hargafix, idhppkhususmasuk, idhppfifomasuk, hpp, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudangasal, gudangtransit, gudangtujuan, rekpersediaan, rekdiskonpembelian, rekhargapokok, rekreturpembelian, costcenter, divisi, subdivisi, proyek, catatan, urutan, idprdetail, idcsdetail, idrqdetail, idbsdetail, idpodetail, idipcdetail, idgrndetail, idridetail, iddnrdetail, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idprtdetail, idprt, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, hargafix, idhppkhususmasuk, idhppfifomasuk, hpp, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudangasal, gudangtransit, gudangtujuan, rekpersediaan, rekdiskonpembelian, rekhargapokok, rekreturpembelian, costcenter, divisi, subdivisi, proyek, catatan, urutan, idprdetail, idcsdetail, idrqdetail, idbsdetail, idpodetail, idipcdetail, idgrndetail, idridetail, iddnrdetail, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idprtdetail', '')::bigint AS idprtdetail,
        NULLIF(row_payload ->> 'idprt', '')::bigint AS idprt,
        NULLIF(row_payload ->> 'idbarang', '')::bigint AS idbarang,
        row_payload ->> 'namabarang' AS namabarang,
        row_payload ->> 'tipebarang' AS tipebarang,
        NULLIF(row_payload ->> 'jml', '')::numeric(20,6) AS jml,
        row_payload ->> 'satuan' AS satuan,
        NULLIF(row_payload ->> 'nilaisatuan', '')::numeric(20,6) AS nilaisatuan,
        NULLIF(row_payload ->> 'jmlbarang', '')::numeric(20,6) AS jmlbarang,
        row_payload ->> 'satuanbarang' AS satuanbarang,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        NULLIF(row_payload ->> 'hargafix', '')::numeric(20,6) AS hargafix,
        NULLIF(row_payload ->> 'idhppkhususmasuk', '')::bigint AS idhppkhususmasuk,
        NULLIF(row_payload ->> 'idhppfifomasuk', '')::bigint AS idhppfifomasuk,
        row_payload ->> 'hpp' AS hpp,
        NULLIF(row_payload ->> 'harga', '')::numeric(20,6) AS harga,
        NULLIF(row_payload ->> 'diskon', '')::numeric(20,6) AS diskon,
        NULLIF(row_payload ->> 'jmldiskon', '')::numeric(20,6) AS jmldiskon,
        NULLIF(row_payload ->> 'pajak1', '')::numeric(20,6) AS pajak1,
        NULLIF(row_payload ->> 'jmlpajak1', '')::numeric(20,6) AS jmlpajak1,
        NULLIF(row_payload ->> 'pajak2', '')::numeric(20,6) AS pajak2,
        NULLIF(row_payload ->> 'jmlpajak2', '')::numeric(20,6) AS jmlpajak2,
        row_payload ->> 'cabang' AS cabang,
        row_payload ->> 'lokasi' AS lokasi,
        row_payload ->> 'gudangasal' AS gudangasal,
        row_payload ->> 'gudangtransit' AS gudangtransit,
        row_payload ->> 'gudangtujuan' AS gudangtujuan,
        row_payload ->> 'rekpersediaan' AS rekpersediaan,
        NULLIF(row_payload ->> 'rekdiskonpembelian', '')::numeric(20,6) AS rekdiskonpembelian,
        NULLIF(row_payload ->> 'rekhargapokok', '')::numeric(20,6) AS rekhargapokok,
        row_payload ->> 'rekreturpembelian' AS rekreturpembelian,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'idprdetail', '')::bigint AS idprdetail,
        NULLIF(row_payload ->> 'idcsdetail', '')::bigint AS idcsdetail,
        NULLIF(row_payload ->> 'idrqdetail', '')::bigint AS idrqdetail,
        NULLIF(row_payload ->> 'idbsdetail', '')::bigint AS idbsdetail,
        NULLIF(row_payload ->> 'idpodetail', '')::bigint AS idpodetail,
        NULLIF(row_payload ->> 'idipcdetail', '')::bigint AS idipcdetail,
        NULLIF(row_payload ->> 'idgrndetail', '')::bigint AS idgrndetail,
        NULLIF(row_payload ->> 'idridetail', '')::bigint AS idridetail,
        NULLIF(row_payload ->> 'iddnrdetail', '')::bigint AS iddnrdetail,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idprtdetail') IS NOT NULL
) AS prepared
ON CONFLICT (idprtdetail) DO UPDATE
SET
    idprt = EXCLUDED.idprt,
    idbarang = EXCLUDED.idbarang,
    namabarang = EXCLUDED.namabarang,
    tipebarang = EXCLUDED.tipebarang,
    jml = EXCLUDED.jml,
    satuan = EXCLUDED.satuan,
    nilaisatuan = EXCLUDED.nilaisatuan,
    jmlbarang = EXCLUDED.jmlbarang,
    satuanbarang = EXCLUDED.satuanbarang,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    hargafix = EXCLUDED.hargafix,
    idhppkhususmasuk = EXCLUDED.idhppkhususmasuk,
    idhppfifomasuk = EXCLUDED.idhppfifomasuk,
    hpp = EXCLUDED.hpp,
    harga = EXCLUDED.harga,
    diskon = EXCLUDED.diskon,
    jmldiskon = EXCLUDED.jmldiskon,
    pajak1 = EXCLUDED.pajak1,
    jmlpajak1 = EXCLUDED.jmlpajak1,
    pajak2 = EXCLUDED.pajak2,
    jmlpajak2 = EXCLUDED.jmlpajak2,
    cabang = EXCLUDED.cabang,
    lokasi = EXCLUDED.lokasi,
    gudangasal = EXCLUDED.gudangasal,
    gudangtransit = EXCLUDED.gudangtransit,
    gudangtujuan = EXCLUDED.gudangtujuan,
    rekpersediaan = EXCLUDED.rekpersediaan,
    rekdiskonpembelian = EXCLUDED.rekdiskonpembelian,
    rekhargapokok = EXCLUDED.rekhargapokok,
    rekreturpembelian = EXCLUDED.rekreturpembelian,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    idprdetail = EXCLUDED.idprdetail,
    idcsdetail = EXCLUDED.idcsdetail,
    idrqdetail = EXCLUDED.idrqdetail,
    idbsdetail = EXCLUDED.idbsdetail,
    idpodetail = EXCLUDED.idpodetail,
    idipcdetail = EXCLUDED.idipcdetail,
    idgrndetail = EXCLUDED.idgrndetail,
    idridetail = EXCLUDED.idridetail,
    iddnrdetail = EXCLUDED.iddnrdetail,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m4_vp
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m4_vp'
)
INSERT INTO m4_vp (
    vpid, vpcabang, vplokasi, vpgudang, vpsumber, vpautonotransaksi, vpnotransaksi, vptgl, vpkodepa, vpsupplier, vpsupplierkontak, vp1alamat1, vp1alamat2, vp1alamat3, vp2alamat1, vp2alamat2, vp2alamat3, vpbagianpembayaran, vpuraian, vpcatatan, vpnoref, vptglnoref, vpcarabayar, vptglbayar, vpmatauang, vpkurs, vptotalap, vptotalapvalas, vptotalar, vptotalarvalas, vpbayar, vpbayarvalas, vpselisihkurs, vprekselisihkurs, vpdiskontermin, vpdiskonterminvalas, vprekdiskontermin, vpidvpp, vpstatus, vpstatussebelumnya, vpjmlrevisi, vpcetakanke, vpposting, vppostingtgl, vpisclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    vpid, vpcabang, vplokasi, vpgudang, vpsumber, vpautonotransaksi, vpnotransaksi, vptgl, vpkodepa, vpsupplier, vpsupplierkontak, vp1alamat1, vp1alamat2, vp1alamat3, vp2alamat1, vp2alamat2, vp2alamat3, vpbagianpembayaran, vpuraian, vpcatatan, vpnoref, vptglnoref, vpcarabayar, vptglbayar, vpmatauang, vpkurs, vptotalap, vptotalapvalas, vptotalar, vptotalarvalas, vpbayar, vpbayarvalas, vpselisihkurs, vprekselisihkurs, vpdiskontermin, vpdiskonterminvalas, vprekdiskontermin, vpidvpp, vpstatus, vpstatussebelumnya, vpjmlrevisi, vpcetakanke, vpposting, vppostingtgl, vpisclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'vpid', '')::bigint AS vpid,
        row_payload ->> 'vpcabang' AS vpcabang,
        row_payload ->> 'vplokasi' AS vplokasi,
        row_payload ->> 'vpgudang' AS vpgudang,
        row_payload ->> 'vpsumber' AS vpsumber,
        row_payload ->> 'vpautonotransaksi' AS vpautonotransaksi,
        row_payload ->> 'vpnotransaksi' AS vpnotransaksi,
        NULLIF(row_payload ->> 'vptgl', '')::timestamptz AS vptgl,
        NULLIF(row_payload ->> 'vpkodepa', '')::bigint AS vpkodepa,
        NULLIF(row_payload ->> 'vpsupplier', '')::bigint AS vpsupplier,
        NULLIF(row_payload ->> 'vpsupplierkontak', '')::bigint AS vpsupplierkontak,
        row_payload ->> 'vp1alamat1' AS vp1alamat1,
        row_payload ->> 'vp1alamat2' AS vp1alamat2,
        row_payload ->> 'vp1alamat3' AS vp1alamat3,
        row_payload ->> 'vp2alamat1' AS vp2alamat1,
        row_payload ->> 'vp2alamat2' AS vp2alamat2,
        row_payload ->> 'vp2alamat3' AS vp2alamat3,
        NULLIF(row_payload ->> 'vpbagianpembayaran', '')::bigint AS vpbagianpembayaran,
        row_payload ->> 'vpuraian' AS vpuraian,
        row_payload ->> 'vpcatatan' AS vpcatatan,
        row_payload ->> 'vpnoref' AS vpnoref,
        NULLIF(row_payload ->> 'vptglnoref', '')::timestamptz AS vptglnoref,
        NULLIF(row_payload ->> 'vpcarabayar', '')::bigint AS vpcarabayar,
        NULLIF(row_payload ->> 'vptglbayar', '')::timestamptz AS vptglbayar,
        row_payload ->> 'vpmatauang' AS vpmatauang,
        NULLIF(row_payload ->> 'vpkurs', '')::numeric(20,6) AS vpkurs,
        NULLIF(row_payload ->> 'vptotalap', '')::numeric(20,6) AS vptotalap,
        NULLIF(row_payload ->> 'vptotalapvalas', '')::numeric(20,6) AS vptotalapvalas,
        NULLIF(row_payload ->> 'vptotalar', '')::numeric(20,6) AS vptotalar,
        NULLIF(row_payload ->> 'vptotalarvalas', '')::numeric(20,6) AS vptotalarvalas,
        row_payload ->> 'vpbayar' AS vpbayar,
        row_payload ->> 'vpbayarvalas' AS vpbayarvalas,
        NULLIF(row_payload ->> 'vpselisihkurs', '')::numeric(20,6) AS vpselisihkurs,
        NULLIF(row_payload ->> 'vprekselisihkurs', '')::numeric(20,6) AS vprekselisihkurs,
        NULLIF(row_payload ->> 'vpdiskontermin', '')::numeric(20,6) AS vpdiskontermin,
        NULLIF(row_payload ->> 'vpdiskonterminvalas', '')::numeric(20,6) AS vpdiskonterminvalas,
        NULLIF(row_payload ->> 'vprekdiskontermin', '')::numeric(20,6) AS vprekdiskontermin,
        NULLIF(row_payload ->> 'vpidvpp', '')::bigint AS vpidvpp,
        NULLIF(row_payload ->> 'vpstatus', '')::bigint AS vpstatus,
        NULLIF(row_payload ->> 'vpstatussebelumnya', '')::bigint AS vpstatussebelumnya,
        NULLIF(row_payload ->> 'vpjmlrevisi', '')::bigint AS vpjmlrevisi,
        NULLIF(row_payload ->> 'vpcetakanke', '')::bigint AS vpcetakanke,
        NULLIF(row_payload ->> 'vpposting', '')::bigint AS vpposting,
        NULLIF(row_payload ->> 'vppostingtgl', '')::timestamptz AS vppostingtgl,
        NULLIF(row_payload ->> 'vpisclose', '')::bigint AS vpisclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'vpid') IS NOT NULL
) AS prepared
ON CONFLICT (vpid) DO UPDATE
SET
    vpcabang = EXCLUDED.vpcabang,
    vplokasi = EXCLUDED.vplokasi,
    vpgudang = EXCLUDED.vpgudang,
    vpsumber = EXCLUDED.vpsumber,
    vpautonotransaksi = EXCLUDED.vpautonotransaksi,
    vpnotransaksi = EXCLUDED.vpnotransaksi,
    vptgl = EXCLUDED.vptgl,
    vpkodepa = EXCLUDED.vpkodepa,
    vpsupplier = EXCLUDED.vpsupplier,
    vpsupplierkontak = EXCLUDED.vpsupplierkontak,
    vp1alamat1 = EXCLUDED.vp1alamat1,
    vp1alamat2 = EXCLUDED.vp1alamat2,
    vp1alamat3 = EXCLUDED.vp1alamat3,
    vp2alamat1 = EXCLUDED.vp2alamat1,
    vp2alamat2 = EXCLUDED.vp2alamat2,
    vp2alamat3 = EXCLUDED.vp2alamat3,
    vpbagianpembayaran = EXCLUDED.vpbagianpembayaran,
    vpuraian = EXCLUDED.vpuraian,
    vpcatatan = EXCLUDED.vpcatatan,
    vpnoref = EXCLUDED.vpnoref,
    vptglnoref = EXCLUDED.vptglnoref,
    vpcarabayar = EXCLUDED.vpcarabayar,
    vptglbayar = EXCLUDED.vptglbayar,
    vpmatauang = EXCLUDED.vpmatauang,
    vpkurs = EXCLUDED.vpkurs,
    vptotalap = EXCLUDED.vptotalap,
    vptotalapvalas = EXCLUDED.vptotalapvalas,
    vptotalar = EXCLUDED.vptotalar,
    vptotalarvalas = EXCLUDED.vptotalarvalas,
    vpbayar = EXCLUDED.vpbayar,
    vpbayarvalas = EXCLUDED.vpbayarvalas,
    vpselisihkurs = EXCLUDED.vpselisihkurs,
    vprekselisihkurs = EXCLUDED.vprekselisihkurs,
    vpdiskontermin = EXCLUDED.vpdiskontermin,
    vpdiskonterminvalas = EXCLUDED.vpdiskonterminvalas,
    vprekdiskontermin = EXCLUDED.vprekdiskontermin,
    vpidvpp = EXCLUDED.vpidvpp,
    vpstatus = EXCLUDED.vpstatus,
    vpstatussebelumnya = EXCLUDED.vpstatussebelumnya,
    vpjmlrevisi = EXCLUDED.vpjmlrevisi,
    vpcetakanke = EXCLUDED.vpcetakanke,
    vpposting = EXCLUDED.vpposting,
    vppostingtgl = EXCLUDED.vppostingtgl,
    vpisclose = EXCLUDED.vpisclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m4_vp_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m4_vp_detail'
)
INSERT INTO m4_vp_detail (
    idvpdetail, idvp, sumber, idtransaksi, matauang, kurs, totaltransaksi, terbayar, rencana, sisa, jmlbayar, jmlbayarvalas, diskontermin, jmldiskontermin, jmldiskonterminvalas, rekhutangpiutang, catatan, costcenter, divisi, subdivisi, proyek, idvppdetail, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idvpdetail, idvp, sumber, idtransaksi, matauang, kurs, totaltransaksi, terbayar, rencana, sisa, jmlbayar, jmlbayarvalas, diskontermin, jmldiskontermin, jmldiskonterminvalas, rekhutangpiutang, catatan, costcenter, divisi, subdivisi, proyek, idvppdetail, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idvpdetail', '')::bigint AS idvpdetail,
        NULLIF(row_payload ->> 'idvp', '')::bigint AS idvp,
        row_payload ->> 'sumber' AS sumber,
        NULLIF(row_payload ->> 'idtransaksi', '')::bigint AS idtransaksi,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        NULLIF(row_payload ->> 'totaltransaksi', '')::numeric(20,6) AS totaltransaksi,
        row_payload ->> 'terbayar' AS terbayar,
        NULLIF(row_payload ->> 'rencana', '')::timestamptz AS rencana,
        row_payload ->> 'sisa' AS sisa,
        NULLIF(row_payload ->> 'jmlbayar', '')::numeric(20,6) AS jmlbayar,
        NULLIF(row_payload ->> 'jmlbayarvalas', '')::numeric(20,6) AS jmlbayarvalas,
        NULLIF(row_payload ->> 'diskontermin', '')::numeric(20,6) AS diskontermin,
        NULLIF(row_payload ->> 'jmldiskontermin', '')::numeric(20,6) AS jmldiskontermin,
        NULLIF(row_payload ->> 'jmldiskonterminvalas', '')::numeric(20,6) AS jmldiskonterminvalas,
        row_payload ->> 'rekhutangpiutang' AS rekhutangpiutang,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        NULLIF(row_payload ->> 'idvppdetail', '')::bigint AS idvppdetail,
        NULLIF(row_payload ->> 'urutan', '')::bigint AS urutan,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idvpdetail') IS NOT NULL
) AS prepared
ON CONFLICT (idvpdetail) DO UPDATE
SET
    idvp = EXCLUDED.idvp,
    sumber = EXCLUDED.sumber,
    idtransaksi = EXCLUDED.idtransaksi,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    totaltransaksi = EXCLUDED.totaltransaksi,
    terbayar = EXCLUDED.terbayar,
    rencana = EXCLUDED.rencana,
    sisa = EXCLUDED.sisa,
    jmlbayar = EXCLUDED.jmlbayar,
    jmlbayarvalas = EXCLUDED.jmlbayarvalas,
    diskontermin = EXCLUDED.diskontermin,
    jmldiskontermin = EXCLUDED.jmldiskontermin,
    jmldiskonterminvalas = EXCLUDED.jmldiskonterminvalas,
    rekhutangpiutang = EXCLUDED.rekhutangpiutang,
    catatan = EXCLUDED.catatan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    idvppdetail = EXCLUDED.idvppdetail,
    urutan = EXCLUDED.urutan,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m4_vpp
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m4_vpp'
)
INSERT INTO m4_vpp (
    vppid, vppcabang, vpplokasi, vppgudang, vppsumber, vppautonotransaksi, vppnotransaksi, vpptgl, vppkodepa, vppsupplier, vppsupplierkontak, vpp1alamat1, vpp1alamat2, vpp1alamat3, vpp2alamat1, vpp2alamat2, vpp2alamat3, vppbagianpembayaran, vppuraian, vppcatatan, vppnoref, vpptglnoref, vppcarabayar, vpptglbayar, vppmatauang, vppkurs, vpptotalap, vpptotalapvalas, vpptotalar, vpptotalarvalas, vppbayar, vppbayarvalas, vppselisihkurs, vpprekselisihkurs, vppdiskontermin, vppdiskonterminvalas, vpprekdiskontermin, vppstatusvp, vppstatus, vppstatussebelumnya, vppjmlrevisi, vppcetakanke, vppposting, vpppostingtgl, vppisclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    vppid, vppcabang, vpplokasi, vppgudang, vppsumber, vppautonotransaksi, vppnotransaksi, vpptgl, vppkodepa, vppsupplier, vppsupplierkontak, vpp1alamat1, vpp1alamat2, vpp1alamat3, vpp2alamat1, vpp2alamat2, vpp2alamat3, vppbagianpembayaran, vppuraian, vppcatatan, vppnoref, vpptglnoref, vppcarabayar, vpptglbayar, vppmatauang, vppkurs, vpptotalap, vpptotalapvalas, vpptotalar, vpptotalarvalas, vppbayar, vppbayarvalas, vppselisihkurs, vpprekselisihkurs, vppdiskontermin, vppdiskonterminvalas, vpprekdiskontermin, vppstatusvp, vppstatus, vppstatussebelumnya, vppjmlrevisi, vppcetakanke, vppposting, vpppostingtgl, vppisclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'vppid', '')::bigint AS vppid,
        row_payload ->> 'vppcabang' AS vppcabang,
        row_payload ->> 'vpplokasi' AS vpplokasi,
        row_payload ->> 'vppgudang' AS vppgudang,
        row_payload ->> 'vppsumber' AS vppsumber,
        row_payload ->> 'vppautonotransaksi' AS vppautonotransaksi,
        row_payload ->> 'vppnotransaksi' AS vppnotransaksi,
        NULLIF(row_payload ->> 'vpptgl', '')::timestamptz AS vpptgl,
        NULLIF(row_payload ->> 'vppkodepa', '')::bigint AS vppkodepa,
        NULLIF(row_payload ->> 'vppsupplier', '')::bigint AS vppsupplier,
        NULLIF(row_payload ->> 'vppsupplierkontak', '')::bigint AS vppsupplierkontak,
        row_payload ->> 'vpp1alamat1' AS vpp1alamat1,
        row_payload ->> 'vpp1alamat2' AS vpp1alamat2,
        row_payload ->> 'vpp1alamat3' AS vpp1alamat3,
        row_payload ->> 'vpp2alamat1' AS vpp2alamat1,
        row_payload ->> 'vpp2alamat2' AS vpp2alamat2,
        row_payload ->> 'vpp2alamat3' AS vpp2alamat3,
        NULLIF(row_payload ->> 'vppbagianpembayaran', '')::bigint AS vppbagianpembayaran,
        row_payload ->> 'vppuraian' AS vppuraian,
        row_payload ->> 'vppcatatan' AS vppcatatan,
        row_payload ->> 'vppnoref' AS vppnoref,
        NULLIF(row_payload ->> 'vpptglnoref', '')::timestamptz AS vpptglnoref,
        NULLIF(row_payload ->> 'vppcarabayar', '')::bigint AS vppcarabayar,
        NULLIF(row_payload ->> 'vpptglbayar', '')::timestamptz AS vpptglbayar,
        row_payload ->> 'vppmatauang' AS vppmatauang,
        NULLIF(row_payload ->> 'vppkurs', '')::numeric(20,6) AS vppkurs,
        NULLIF(row_payload ->> 'vpptotalap', '')::numeric(20,6) AS vpptotalap,
        NULLIF(row_payload ->> 'vpptotalapvalas', '')::numeric(20,6) AS vpptotalapvalas,
        NULLIF(row_payload ->> 'vpptotalar', '')::numeric(20,6) AS vpptotalar,
        NULLIF(row_payload ->> 'vpptotalarvalas', '')::numeric(20,6) AS vpptotalarvalas,
        row_payload ->> 'vppbayar' AS vppbayar,
        row_payload ->> 'vppbayarvalas' AS vppbayarvalas,
        NULLIF(row_payload ->> 'vppselisihkurs', '')::numeric(20,6) AS vppselisihkurs,
        NULLIF(row_payload ->> 'vpprekselisihkurs', '')::numeric(20,6) AS vpprekselisihkurs,
        NULLIF(row_payload ->> 'vppdiskontermin', '')::numeric(20,6) AS vppdiskontermin,
        NULLIF(row_payload ->> 'vppdiskonterminvalas', '')::numeric(20,6) AS vppdiskonterminvalas,
        NULLIF(row_payload ->> 'vpprekdiskontermin', '')::numeric(20,6) AS vpprekdiskontermin,
        NULLIF(row_payload ->> 'vppstatusvp', '')::bigint AS vppstatusvp,
        NULLIF(row_payload ->> 'vppstatus', '')::bigint AS vppstatus,
        NULLIF(row_payload ->> 'vppstatussebelumnya', '')::bigint AS vppstatussebelumnya,
        NULLIF(row_payload ->> 'vppjmlrevisi', '')::bigint AS vppjmlrevisi,
        NULLIF(row_payload ->> 'vppcetakanke', '')::bigint AS vppcetakanke,
        NULLIF(row_payload ->> 'vppposting', '')::bigint AS vppposting,
        NULLIF(row_payload ->> 'vpppostingtgl', '')::timestamptz AS vpppostingtgl,
        NULLIF(row_payload ->> 'vppisclose', '')::bigint AS vppisclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'vppid') IS NOT NULL
) AS prepared
ON CONFLICT (vppid) DO UPDATE
SET
    vppcabang = EXCLUDED.vppcabang,
    vpplokasi = EXCLUDED.vpplokasi,
    vppgudang = EXCLUDED.vppgudang,
    vppsumber = EXCLUDED.vppsumber,
    vppautonotransaksi = EXCLUDED.vppautonotransaksi,
    vppnotransaksi = EXCLUDED.vppnotransaksi,
    vpptgl = EXCLUDED.vpptgl,
    vppkodepa = EXCLUDED.vppkodepa,
    vppsupplier = EXCLUDED.vppsupplier,
    vppsupplierkontak = EXCLUDED.vppsupplierkontak,
    vpp1alamat1 = EXCLUDED.vpp1alamat1,
    vpp1alamat2 = EXCLUDED.vpp1alamat2,
    vpp1alamat3 = EXCLUDED.vpp1alamat3,
    vpp2alamat1 = EXCLUDED.vpp2alamat1,
    vpp2alamat2 = EXCLUDED.vpp2alamat2,
    vpp2alamat3 = EXCLUDED.vpp2alamat3,
    vppbagianpembayaran = EXCLUDED.vppbagianpembayaran,
    vppuraian = EXCLUDED.vppuraian,
    vppcatatan = EXCLUDED.vppcatatan,
    vppnoref = EXCLUDED.vppnoref,
    vpptglnoref = EXCLUDED.vpptglnoref,
    vppcarabayar = EXCLUDED.vppcarabayar,
    vpptglbayar = EXCLUDED.vpptglbayar,
    vppmatauang = EXCLUDED.vppmatauang,
    vppkurs = EXCLUDED.vppkurs,
    vpptotalap = EXCLUDED.vpptotalap,
    vpptotalapvalas = EXCLUDED.vpptotalapvalas,
    vpptotalar = EXCLUDED.vpptotalar,
    vpptotalarvalas = EXCLUDED.vpptotalarvalas,
    vppbayar = EXCLUDED.vppbayar,
    vppbayarvalas = EXCLUDED.vppbayarvalas,
    vppselisihkurs = EXCLUDED.vppselisihkurs,
    vpprekselisihkurs = EXCLUDED.vpprekselisihkurs,
    vppdiskontermin = EXCLUDED.vppdiskontermin,
    vppdiskonterminvalas = EXCLUDED.vppdiskonterminvalas,
    vpprekdiskontermin = EXCLUDED.vpprekdiskontermin,
    vppstatusvp = EXCLUDED.vppstatusvp,
    vppstatus = EXCLUDED.vppstatus,
    vppstatussebelumnya = EXCLUDED.vppstatussebelumnya,
    vppjmlrevisi = EXCLUDED.vppjmlrevisi,
    vppcetakanke = EXCLUDED.vppcetakanke,
    vppposting = EXCLUDED.vppposting,
    vpppostingtgl = EXCLUDED.vpppostingtgl,
    vppisclose = EXCLUDED.vppisclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m4_vpp_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m4_vpp_detail'
)
INSERT INTO m4_vpp_detail (
    idvppdetail, idvpp, sumber, idtransaksi, matauang, kurs, totaltransaksi, terbayar, rencana, sisa, jmlbayar, jmlbayarvalas, diskontermin, jmldiskontermin, jmldiskonterminvalas, rekhutangpiutang, catatan, costcenter, divisi, subdivisi, proyek, jmlvp, jmlvpvalas, statusvp, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idvppdetail, idvpp, sumber, idtransaksi, matauang, kurs, totaltransaksi, terbayar, rencana, sisa, jmlbayar, jmlbayarvalas, diskontermin, jmldiskontermin, jmldiskonterminvalas, rekhutangpiutang, catatan, costcenter, divisi, subdivisi, proyek, jmlvp, jmlvpvalas, statusvp, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idvppdetail', '')::bigint AS idvppdetail,
        NULLIF(row_payload ->> 'idvpp', '')::bigint AS idvpp,
        row_payload ->> 'sumber' AS sumber,
        NULLIF(row_payload ->> 'idtransaksi', '')::bigint AS idtransaksi,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        NULLIF(row_payload ->> 'totaltransaksi', '')::numeric(20,6) AS totaltransaksi,
        row_payload ->> 'terbayar' AS terbayar,
        NULLIF(row_payload ->> 'rencana', '')::timestamptz AS rencana,
        row_payload ->> 'sisa' AS sisa,
        NULLIF(row_payload ->> 'jmlbayar', '')::numeric(20,6) AS jmlbayar,
        NULLIF(row_payload ->> 'jmlbayarvalas', '')::numeric(20,6) AS jmlbayarvalas,
        NULLIF(row_payload ->> 'diskontermin', '')::numeric(20,6) AS diskontermin,
        NULLIF(row_payload ->> 'jmldiskontermin', '')::numeric(20,6) AS jmldiskontermin,
        NULLIF(row_payload ->> 'jmldiskonterminvalas', '')::numeric(20,6) AS jmldiskonterminvalas,
        row_payload ->> 'rekhutangpiutang' AS rekhutangpiutang,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        NULLIF(row_payload ->> 'jmlvp', '')::numeric(20,6) AS jmlvp,
        NULLIF(row_payload ->> 'jmlvpvalas', '')::numeric(20,6) AS jmlvpvalas,
        NULLIF(row_payload ->> 'statusvp', '')::bigint AS statusvp,
        NULLIF(row_payload ->> 'urutan', '')::bigint AS urutan,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idvppdetail') IS NOT NULL
) AS prepared
ON CONFLICT (idvppdetail) DO UPDATE
SET
    idvpp = EXCLUDED.idvpp,
    sumber = EXCLUDED.sumber,
    idtransaksi = EXCLUDED.idtransaksi,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    totaltransaksi = EXCLUDED.totaltransaksi,
    terbayar = EXCLUDED.terbayar,
    rencana = EXCLUDED.rencana,
    sisa = EXCLUDED.sisa,
    jmlbayar = EXCLUDED.jmlbayar,
    jmlbayarvalas = EXCLUDED.jmlbayarvalas,
    diskontermin = EXCLUDED.diskontermin,
    jmldiskontermin = EXCLUDED.jmldiskontermin,
    jmldiskonterminvalas = EXCLUDED.jmldiskonterminvalas,
    rekhutangpiutang = EXCLUDED.rekhutangpiutang,
    catatan = EXCLUDED.catatan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    jmlvp = EXCLUDED.jmlvp,
    jmlvpvalas = EXCLUDED.jmlvpvalas,
    statusvp = EXCLUDED.statusvp,
    urutan = EXCLUDED.urutan,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m5_sq
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m5_sq'
)
INSERT INTO m5_sq (
    sqid, sqcabang, sqlokasi, sqgudang, sqasalbarang, sqasalbarangkategori, sqjenispenjualan, sqjenispenjualankategori, sqcarabayar, sqsumber, sqautonotransaksi, sqnotransaksi, sqtgl, sqkodepa, sqcustomer, sqcustomerkontak, sq1alamat1, sq1alamat2, sq1alamat3, sq2alamat1, sq2alamat2, sq2alamat3, sqbagianpenjualan, sqtglkirim, sqtermin, sqtgljatuhtempo, squraian, sqcatatan, sqnoref, sqtglnoref, sqtglpenutupan, sqmatauang, sqkurs, sqhargatermasukpajak, sqtotal, sqdiskonpersen, sqjmldiskon, sqtotalpajak1detail, sqtotalpajak2detail, sqbiayalainpersen, sqbiayalain, sqtotaltransaksi, sqidpr, sqstatuspr, sqstatusso, sqstatuspi, sqstatuspl, sqstatusdo, sqstatusdr, sqstatussi, sqstatusrnr, sqstatussr, sqstatusrealisasi, sqstatus, sqstatussebelumnya, sqjmlrevisi, sqcetakanke, sqposting, sqpostingtgl, sqisclose, sqinputtgl, sqmodifikasiuser, sqmodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    sqid, sqcabang, sqlokasi, sqgudang, sqasalbarang, sqasalbarangkategori, sqjenispenjualan, sqjenispenjualankategori, sqcarabayar, sqsumber, sqautonotransaksi, sqnotransaksi, sqtgl, sqkodepa, sqcustomer, sqcustomerkontak, sq1alamat1, sq1alamat2, sq1alamat3, sq2alamat1, sq2alamat2, sq2alamat3, sqbagianpenjualan, sqtglkirim, sqtermin, sqtgljatuhtempo, squraian, sqcatatan, sqnoref, sqtglnoref, sqtglpenutupan, sqmatauang, sqkurs, sqhargatermasukpajak, sqtotal, sqdiskonpersen, sqjmldiskon, sqtotalpajak1detail, sqtotalpajak2detail, sqbiayalainpersen, sqbiayalain, sqtotaltransaksi, sqidpr, sqstatuspr, sqstatusso, sqstatuspi, sqstatuspl, sqstatusdo, sqstatusdr, sqstatussi, sqstatusrnr, sqstatussr, sqstatusrealisasi, sqstatus, sqstatussebelumnya, sqjmlrevisi, sqcetakanke, sqposting, sqpostingtgl, sqisclose, sqinputtgl, sqmodifikasiuser, sqmodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'sqid', '')::bigint AS sqid,
        row_payload ->> 'sqcabang' AS sqcabang,
        row_payload ->> 'sqlokasi' AS sqlokasi,
        row_payload ->> 'sqgudang' AS sqgudang,
        row_payload ->> 'sqasalbarang' AS sqasalbarang,
        row_payload ->> 'sqasalbarangkategori' AS sqasalbarangkategori,
        row_payload ->> 'sqjenispenjualan' AS sqjenispenjualan,
        row_payload ->> 'sqjenispenjualankategori' AS sqjenispenjualankategori,
        row_payload ->> 'sqcarabayar' AS sqcarabayar,
        row_payload ->> 'sqsumber' AS sqsumber,
        row_payload ->> 'sqautonotransaksi' AS sqautonotransaksi,
        row_payload ->> 'sqnotransaksi' AS sqnotransaksi,
        NULLIF(row_payload ->> 'sqtgl', '')::timestamptz AS sqtgl,
        row_payload ->> 'sqkodepa' AS sqkodepa,
        row_payload ->> 'sqcustomer' AS sqcustomer,
        row_payload ->> 'sqcustomerkontak' AS sqcustomerkontak,
        row_payload ->> 'sq1alamat1' AS sq1alamat1,
        row_payload ->> 'sq1alamat2' AS sq1alamat2,
        row_payload ->> 'sq1alamat3' AS sq1alamat3,
        row_payload ->> 'sq2alamat1' AS sq2alamat1,
        row_payload ->> 'sq2alamat2' AS sq2alamat2,
        row_payload ->> 'sq2alamat3' AS sq2alamat3,
        row_payload ->> 'sqbagianpenjualan' AS sqbagianpenjualan,
        NULLIF(row_payload ->> 'sqtglkirim', '')::timestamptz AS sqtglkirim,
        row_payload ->> 'sqtermin' AS sqtermin,
        NULLIF(row_payload ->> 'sqtgljatuhtempo', '')::timestamptz AS sqtgljatuhtempo,
        row_payload ->> 'squraian' AS squraian,
        row_payload ->> 'sqcatatan' AS sqcatatan,
        row_payload ->> 'sqnoref' AS sqnoref,
        NULLIF(row_payload ->> 'sqtglnoref', '')::timestamptz AS sqtglnoref,
        NULLIF(row_payload ->> 'sqtglpenutupan', '')::timestamptz AS sqtglpenutupan,
        row_payload ->> 'sqmatauang' AS sqmatauang,
        NULLIF(row_payload ->> 'sqkurs', '')::numeric(20,6) AS sqkurs,
        NULLIF(row_payload ->> 'sqhargatermasukpajak', '')::numeric(20,6) AS sqhargatermasukpajak,
        NULLIF(row_payload ->> 'sqtotal', '')::numeric(20,6) AS sqtotal,
        NULLIF(row_payload ->> 'sqdiskonpersen', '')::numeric(20,6) AS sqdiskonpersen,
        NULLIF(row_payload ->> 'sqjmldiskon', '')::numeric(20,6) AS sqjmldiskon,
        NULLIF(row_payload ->> 'sqtotalpajak1detail', '')::numeric(20,6) AS sqtotalpajak1detail,
        NULLIF(row_payload ->> 'sqtotalpajak2detail', '')::numeric(20,6) AS sqtotalpajak2detail,
        NULLIF(row_payload ->> 'sqbiayalainpersen', '')::numeric(20,6) AS sqbiayalainpersen,
        row_payload ->> 'sqbiayalain' AS sqbiayalain,
        NULLIF(row_payload ->> 'sqtotaltransaksi', '')::numeric(20,6) AS sqtotaltransaksi,
        NULLIF(row_payload ->> 'sqidpr', '')::bigint AS sqidpr,
        row_payload ->> 'sqstatuspr' AS sqstatuspr,
        row_payload ->> 'sqstatusso' AS sqstatusso,
        row_payload ->> 'sqstatuspi' AS sqstatuspi,
        row_payload ->> 'sqstatuspl' AS sqstatuspl,
        row_payload ->> 'sqstatusdo' AS sqstatusdo,
        row_payload ->> 'sqstatusdr' AS sqstatusdr,
        row_payload ->> 'sqstatussi' AS sqstatussi,
        row_payload ->> 'sqstatusrnr' AS sqstatusrnr,
        row_payload ->> 'sqstatussr' AS sqstatussr,
        row_payload ->> 'sqstatusrealisasi' AS sqstatusrealisasi,
        row_payload ->> 'sqstatus' AS sqstatus,
        row_payload ->> 'sqstatussebelumnya' AS sqstatussebelumnya,
        NULLIF(row_payload ->> 'sqjmlrevisi', '')::numeric(20,6) AS sqjmlrevisi,
        row_payload ->> 'sqcetakanke' AS sqcetakanke,
        NULLIF(row_payload ->> 'sqposting', '')::bigint AS sqposting,
        NULLIF(row_payload ->> 'sqpostingtgl', '')::timestamptz AS sqpostingtgl,
        NULLIF(row_payload ->> 'sqisclose', '')::bigint AS sqisclose,
        NULLIF(row_payload ->> 'sqinputtgl', '')::timestamptz AS sqinputtgl,
        row_payload ->> 'sqmodifikasiuser' AS sqmodifikasiuser,
        NULLIF(row_payload ->> 'sqmodifikasitgl', '')::timestamptz AS sqmodifikasitgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'sqid') IS NOT NULL
) AS prepared
ON CONFLICT (sqid) DO UPDATE
SET
    sqcabang = EXCLUDED.sqcabang,
    sqlokasi = EXCLUDED.sqlokasi,
    sqgudang = EXCLUDED.sqgudang,
    sqasalbarang = EXCLUDED.sqasalbarang,
    sqasalbarangkategori = EXCLUDED.sqasalbarangkategori,
    sqjenispenjualan = EXCLUDED.sqjenispenjualan,
    sqjenispenjualankategori = EXCLUDED.sqjenispenjualankategori,
    sqcarabayar = EXCLUDED.sqcarabayar,
    sqsumber = EXCLUDED.sqsumber,
    sqautonotransaksi = EXCLUDED.sqautonotransaksi,
    sqnotransaksi = EXCLUDED.sqnotransaksi,
    sqtgl = EXCLUDED.sqtgl,
    sqkodepa = EXCLUDED.sqkodepa,
    sqcustomer = EXCLUDED.sqcustomer,
    sqcustomerkontak = EXCLUDED.sqcustomerkontak,
    sq1alamat1 = EXCLUDED.sq1alamat1,
    sq1alamat2 = EXCLUDED.sq1alamat2,
    sq1alamat3 = EXCLUDED.sq1alamat3,
    sq2alamat1 = EXCLUDED.sq2alamat1,
    sq2alamat2 = EXCLUDED.sq2alamat2,
    sq2alamat3 = EXCLUDED.sq2alamat3,
    sqbagianpenjualan = EXCLUDED.sqbagianpenjualan,
    sqtglkirim = EXCLUDED.sqtglkirim,
    sqtermin = EXCLUDED.sqtermin,
    sqtgljatuhtempo = EXCLUDED.sqtgljatuhtempo,
    squraian = EXCLUDED.squraian,
    sqcatatan = EXCLUDED.sqcatatan,
    sqnoref = EXCLUDED.sqnoref,
    sqtglnoref = EXCLUDED.sqtglnoref,
    sqtglpenutupan = EXCLUDED.sqtglpenutupan,
    sqmatauang = EXCLUDED.sqmatauang,
    sqkurs = EXCLUDED.sqkurs,
    sqhargatermasukpajak = EXCLUDED.sqhargatermasukpajak,
    sqtotal = EXCLUDED.sqtotal,
    sqdiskonpersen = EXCLUDED.sqdiskonpersen,
    sqjmldiskon = EXCLUDED.sqjmldiskon,
    sqtotalpajak1detail = EXCLUDED.sqtotalpajak1detail,
    sqtotalpajak2detail = EXCLUDED.sqtotalpajak2detail,
    sqbiayalainpersen = EXCLUDED.sqbiayalainpersen,
    sqbiayalain = EXCLUDED.sqbiayalain,
    sqtotaltransaksi = EXCLUDED.sqtotaltransaksi,
    sqidpr = EXCLUDED.sqidpr,
    sqstatuspr = EXCLUDED.sqstatuspr,
    sqstatusso = EXCLUDED.sqstatusso,
    sqstatuspi = EXCLUDED.sqstatuspi,
    sqstatuspl = EXCLUDED.sqstatuspl,
    sqstatusdo = EXCLUDED.sqstatusdo,
    sqstatusdr = EXCLUDED.sqstatusdr,
    sqstatussi = EXCLUDED.sqstatussi,
    sqstatusrnr = EXCLUDED.sqstatusrnr,
    sqstatussr = EXCLUDED.sqstatussr,
    sqstatusrealisasi = EXCLUDED.sqstatusrealisasi,
    sqstatus = EXCLUDED.sqstatus,
    sqstatussebelumnya = EXCLUDED.sqstatussebelumnya,
    sqjmlrevisi = EXCLUDED.sqjmlrevisi,
    sqcetakanke = EXCLUDED.sqcetakanke,
    sqposting = EXCLUDED.sqposting,
    sqpostingtgl = EXCLUDED.sqpostingtgl,
    sqisclose = EXCLUDED.sqisclose,
    sqinputtgl = EXCLUDED.sqinputtgl,
    sqmodifikasiuser = EXCLUDED.sqmodifikasiuser,
    sqmodifikasitgl = EXCLUDED.sqmodifikasitgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m5_sq_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m5_sq_detail'
)
INSERT INTO m5_sq_detail (
    idsqdetail, idsq, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudang, costcenter, divisi, subdivisi, proyek, catatan, urutan, idprdetail, jmlpr, statuspr, jmlso, statusso, jmlpi, statuspi, jmlpl, statuspl, jmldo, statusdo, jmldr, statusdr, jmlsi, statussi, jmlrnr, statusrnr, jmlsr, statussr, jmlrealisasi, statusrealisasi, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idsqdetail, idsq, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudang, costcenter, divisi, subdivisi, proyek, catatan, urutan, idprdetail, jmlpr, statuspr, jmlso, statusso, jmlpi, statuspi, jmlpl, statuspl, jmldo, statusdo, jmldr, statusdr, jmlsi, statussi, jmlrnr, statusrnr, jmlsr, statussr, jmlrealisasi, statusrealisasi, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idsqdetail', '')::bigint AS idsqdetail,
        NULLIF(row_payload ->> 'idsq', '')::bigint AS idsq,
        NULLIF(row_payload ->> 'idbarang', '')::bigint AS idbarang,
        row_payload ->> 'namabarang' AS namabarang,
        row_payload ->> 'tipebarang' AS tipebarang,
        NULLIF(row_payload ->> 'jml', '')::numeric(20,6) AS jml,
        row_payload ->> 'satuan' AS satuan,
        NULLIF(row_payload ->> 'nilaisatuan', '')::numeric(20,6) AS nilaisatuan,
        NULLIF(row_payload ->> 'jmlbarang', '')::numeric(20,6) AS jmlbarang,
        row_payload ->> 'satuanbarang' AS satuanbarang,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        NULLIF(row_payload ->> 'harga', '')::numeric(20,6) AS harga,
        NULLIF(row_payload ->> 'diskon', '')::numeric(20,6) AS diskon,
        NULLIF(row_payload ->> 'jmldiskon', '')::numeric(20,6) AS jmldiskon,
        NULLIF(row_payload ->> 'pajak1', '')::numeric(20,6) AS pajak1,
        NULLIF(row_payload ->> 'jmlpajak1', '')::numeric(20,6) AS jmlpajak1,
        NULLIF(row_payload ->> 'pajak2', '')::numeric(20,6) AS pajak2,
        NULLIF(row_payload ->> 'jmlpajak2', '')::numeric(20,6) AS jmlpajak2,
        row_payload ->> 'cabang' AS cabang,
        row_payload ->> 'lokasi' AS lokasi,
        row_payload ->> 'gudang' AS gudang,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'idprdetail', '')::bigint AS idprdetail,
        NULLIF(row_payload ->> 'jmlpr', '')::numeric(20,6) AS jmlpr,
        NULLIF(row_payload ->> 'statuspr', '')::bigint AS statuspr,
        NULLIF(row_payload ->> 'jmlso', '')::numeric(20,6) AS jmlso,
        NULLIF(row_payload ->> 'statusso', '')::bigint AS statusso,
        NULLIF(row_payload ->> 'jmlpi', '')::numeric(20,6) AS jmlpi,
        NULLIF(row_payload ->> 'statuspi', '')::bigint AS statuspi,
        NULLIF(row_payload ->> 'jmlpl', '')::numeric(20,6) AS jmlpl,
        NULLIF(row_payload ->> 'statuspl', '')::bigint AS statuspl,
        NULLIF(row_payload ->> 'jmldo', '')::numeric(20,6) AS jmldo,
        NULLIF(row_payload ->> 'statusdo', '')::bigint AS statusdo,
        NULLIF(row_payload ->> 'jmldr', '')::numeric(20,6) AS jmldr,
        NULLIF(row_payload ->> 'statusdr', '')::bigint AS statusdr,
        NULLIF(row_payload ->> 'jmlsi', '')::numeric(20,6) AS jmlsi,
        NULLIF(row_payload ->> 'statussi', '')::bigint AS statussi,
        NULLIF(row_payload ->> 'jmlrnr', '')::numeric(20,6) AS jmlrnr,
        NULLIF(row_payload ->> 'statusrnr', '')::bigint AS statusrnr,
        NULLIF(row_payload ->> 'jmlsr', '')::numeric(20,6) AS jmlsr,
        NULLIF(row_payload ->> 'statussr', '')::bigint AS statussr,
        NULLIF(row_payload ->> 'jmlrealisasi', '')::numeric(20,6) AS jmlrealisasi,
        NULLIF(row_payload ->> 'statusrealisasi', '')::bigint AS statusrealisasi,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idsqdetail') IS NOT NULL
) AS prepared
ON CONFLICT (idsqdetail) DO UPDATE
SET
    idsq = EXCLUDED.idsq,
    idbarang = EXCLUDED.idbarang,
    namabarang = EXCLUDED.namabarang,
    tipebarang = EXCLUDED.tipebarang,
    jml = EXCLUDED.jml,
    satuan = EXCLUDED.satuan,
    nilaisatuan = EXCLUDED.nilaisatuan,
    jmlbarang = EXCLUDED.jmlbarang,
    satuanbarang = EXCLUDED.satuanbarang,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    harga = EXCLUDED.harga,
    diskon = EXCLUDED.diskon,
    jmldiskon = EXCLUDED.jmldiskon,
    pajak1 = EXCLUDED.pajak1,
    jmlpajak1 = EXCLUDED.jmlpajak1,
    pajak2 = EXCLUDED.pajak2,
    jmlpajak2 = EXCLUDED.jmlpajak2,
    cabang = EXCLUDED.cabang,
    lokasi = EXCLUDED.lokasi,
    gudang = EXCLUDED.gudang,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    idprdetail = EXCLUDED.idprdetail,
    jmlpr = EXCLUDED.jmlpr,
    statuspr = EXCLUDED.statuspr,
    jmlso = EXCLUDED.jmlso,
    statusso = EXCLUDED.statusso,
    jmlpi = EXCLUDED.jmlpi,
    statuspi = EXCLUDED.statuspi,
    jmlpl = EXCLUDED.jmlpl,
    statuspl = EXCLUDED.statuspl,
    jmldo = EXCLUDED.jmldo,
    statusdo = EXCLUDED.statusdo,
    jmldr = EXCLUDED.jmldr,
    statusdr = EXCLUDED.statusdr,
    jmlsi = EXCLUDED.jmlsi,
    statussi = EXCLUDED.statussi,
    jmlrnr = EXCLUDED.jmlrnr,
    statusrnr = EXCLUDED.statusrnr,
    jmlsr = EXCLUDED.jmlsr,
    statussr = EXCLUDED.statussr,
    jmlrealisasi = EXCLUDED.jmlrealisasi,
    statusrealisasi = EXCLUDED.statusrealisasi,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m5_so
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m5_so'
)
INSERT INTO m5_so (
    soid, socabang, solokasi, sogudang, soasalbarang, soasalbarangkategori, sojenispenjualan, sojenispenjualankategori, socarabayar, sosumber, soautonotransaksi, sonotransaksi, sotgl, sokodepa, socustomer, socustomerkontak, so1alamat1, so1alamat2, so1alamat3, so2alamat1, so2alamat2, so2alamat3, sobagianpenjualan, soekspedisi, sotglkirim, sotermin, sotgljatuhtempo, souraian, socatatan, sonoref, sotglnoref, sotglpenutupan, somatauang, sokurs, sohargatermasukpajak, sototal, sodiskonpersen, sojmldiskon, sototalpajak1detail, sototalpajak2detail, sobiayalainpersen, sobiayalain, sototaltransaksi, sojmlbayar, sorekdiskon, sorekpajak1, sorekpajak2, sorekbiayalain, sorekbayar, soidsq, sostatuspi, sostatuspl, sostatusdo, sostatusdr, sostatussi, sostatusrnr, sostatussr, sostatusrealisasi, sostatus, sostatussebelumnya, sojmlrevisi, socetakanke, soposting, sopostingtgl, soisclose, souploaded, somodifikasiuser, somodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    soid, socabang, solokasi, sogudang, soasalbarang, soasalbarangkategori, sojenispenjualan, sojenispenjualankategori, socarabayar, sosumber, soautonotransaksi, sonotransaksi, sotgl, sokodepa, socustomer, socustomerkontak, so1alamat1, so1alamat2, so1alamat3, so2alamat1, so2alamat2, so2alamat3, sobagianpenjualan, soekspedisi, sotglkirim, sotermin, sotgljatuhtempo, souraian, socatatan, sonoref, sotglnoref, sotglpenutupan, somatauang, sokurs, sohargatermasukpajak, sototal, sodiskonpersen, sojmldiskon, sototalpajak1detail, sototalpajak2detail, sobiayalainpersen, sobiayalain, sototaltransaksi, sojmlbayar, sorekdiskon, sorekpajak1, sorekpajak2, sorekbiayalain, sorekbayar, soidsq, sostatuspi, sostatuspl, sostatusdo, sostatusdr, sostatussi, sostatusrnr, sostatussr, sostatusrealisasi, sostatus, sostatussebelumnya, sojmlrevisi, socetakanke, soposting, sopostingtgl, soisclose, souploaded, somodifikasiuser, somodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'soid', '')::bigint AS soid,
        row_payload ->> 'socabang' AS socabang,
        row_payload ->> 'solokasi' AS solokasi,
        row_payload ->> 'sogudang' AS sogudang,
        row_payload ->> 'soasalbarang' AS soasalbarang,
        row_payload ->> 'soasalbarangkategori' AS soasalbarangkategori,
        row_payload ->> 'sojenispenjualan' AS sojenispenjualan,
        row_payload ->> 'sojenispenjualankategori' AS sojenispenjualankategori,
        row_payload ->> 'socarabayar' AS socarabayar,
        row_payload ->> 'sosumber' AS sosumber,
        row_payload ->> 'soautonotransaksi' AS soautonotransaksi,
        row_payload ->> 'sonotransaksi' AS sonotransaksi,
        NULLIF(row_payload ->> 'sotgl', '')::timestamptz AS sotgl,
        row_payload ->> 'sokodepa' AS sokodepa,
        row_payload ->> 'socustomer' AS socustomer,
        row_payload ->> 'socustomerkontak' AS socustomerkontak,
        row_payload ->> 'so1alamat1' AS so1alamat1,
        row_payload ->> 'so1alamat2' AS so1alamat2,
        row_payload ->> 'so1alamat3' AS so1alamat3,
        row_payload ->> 'so2alamat1' AS so2alamat1,
        row_payload ->> 'so2alamat2' AS so2alamat2,
        row_payload ->> 'so2alamat3' AS so2alamat3,
        row_payload ->> 'sobagianpenjualan' AS sobagianpenjualan,
        row_payload ->> 'soekspedisi' AS soekspedisi,
        NULLIF(row_payload ->> 'sotglkirim', '')::timestamptz AS sotglkirim,
        row_payload ->> 'sotermin' AS sotermin,
        NULLIF(row_payload ->> 'sotgljatuhtempo', '')::timestamptz AS sotgljatuhtempo,
        row_payload ->> 'souraian' AS souraian,
        row_payload ->> 'socatatan' AS socatatan,
        row_payload ->> 'sonoref' AS sonoref,
        NULLIF(row_payload ->> 'sotglnoref', '')::timestamptz AS sotglnoref,
        NULLIF(row_payload ->> 'sotglpenutupan', '')::timestamptz AS sotglpenutupan,
        row_payload ->> 'somatauang' AS somatauang,
        NULLIF(row_payload ->> 'sokurs', '')::numeric(20,6) AS sokurs,
        NULLIF(row_payload ->> 'sohargatermasukpajak', '')::numeric(20,6) AS sohargatermasukpajak,
        NULLIF(row_payload ->> 'sototal', '')::numeric(20,6) AS sototal,
        NULLIF(row_payload ->> 'sodiskonpersen', '')::numeric(20,6) AS sodiskonpersen,
        NULLIF(row_payload ->> 'sojmldiskon', '')::numeric(20,6) AS sojmldiskon,
        NULLIF(row_payload ->> 'sototalpajak1detail', '')::numeric(20,6) AS sototalpajak1detail,
        NULLIF(row_payload ->> 'sototalpajak2detail', '')::numeric(20,6) AS sototalpajak2detail,
        NULLIF(row_payload ->> 'sobiayalainpersen', '')::numeric(20,6) AS sobiayalainpersen,
        row_payload ->> 'sobiayalain' AS sobiayalain,
        NULLIF(row_payload ->> 'sototaltransaksi', '')::numeric(20,6) AS sototaltransaksi,
        NULLIF(row_payload ->> 'sojmlbayar', '')::numeric(20,6) AS sojmlbayar,
        NULLIF(row_payload ->> 'sorekdiskon', '')::numeric(20,6) AS sorekdiskon,
        NULLIF(row_payload ->> 'sorekpajak1', '')::numeric(20,6) AS sorekpajak1,
        NULLIF(row_payload ->> 'sorekpajak2', '')::numeric(20,6) AS sorekpajak2,
        row_payload ->> 'sorekbiayalain' AS sorekbiayalain,
        row_payload ->> 'sorekbayar' AS sorekbayar,
        NULLIF(row_payload ->> 'soidsq', '')::bigint AS soidsq,
        row_payload ->> 'sostatuspi' AS sostatuspi,
        row_payload ->> 'sostatuspl' AS sostatuspl,
        row_payload ->> 'sostatusdo' AS sostatusdo,
        row_payload ->> 'sostatusdr' AS sostatusdr,
        row_payload ->> 'sostatussi' AS sostatussi,
        row_payload ->> 'sostatusrnr' AS sostatusrnr,
        row_payload ->> 'sostatussr' AS sostatussr,
        row_payload ->> 'sostatusrealisasi' AS sostatusrealisasi,
        row_payload ->> 'sostatus' AS sostatus,
        row_payload ->> 'sostatussebelumnya' AS sostatussebelumnya,
        NULLIF(row_payload ->> 'sojmlrevisi', '')::numeric(20,6) AS sojmlrevisi,
        row_payload ->> 'socetakanke' AS socetakanke,
        NULLIF(row_payload ->> 'soposting', '')::bigint AS soposting,
        NULLIF(row_payload ->> 'sopostingtgl', '')::timestamptz AS sopostingtgl,
        NULLIF(row_payload ->> 'soisclose', '')::bigint AS soisclose,
        row_payload ->> 'souploaded' AS souploaded,
        row_payload ->> 'somodifikasiuser' AS somodifikasiuser,
        NULLIF(row_payload ->> 'somodifikasitgl', '')::timestamptz AS somodifikasitgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'soid') IS NOT NULL
) AS prepared
ON CONFLICT (soid) DO UPDATE
SET
    socabang = EXCLUDED.socabang,
    solokasi = EXCLUDED.solokasi,
    sogudang = EXCLUDED.sogudang,
    soasalbarang = EXCLUDED.soasalbarang,
    soasalbarangkategori = EXCLUDED.soasalbarangkategori,
    sojenispenjualan = EXCLUDED.sojenispenjualan,
    sojenispenjualankategori = EXCLUDED.sojenispenjualankategori,
    socarabayar = EXCLUDED.socarabayar,
    sosumber = EXCLUDED.sosumber,
    soautonotransaksi = EXCLUDED.soautonotransaksi,
    sonotransaksi = EXCLUDED.sonotransaksi,
    sotgl = EXCLUDED.sotgl,
    sokodepa = EXCLUDED.sokodepa,
    socustomer = EXCLUDED.socustomer,
    socustomerkontak = EXCLUDED.socustomerkontak,
    so1alamat1 = EXCLUDED.so1alamat1,
    so1alamat2 = EXCLUDED.so1alamat2,
    so1alamat3 = EXCLUDED.so1alamat3,
    so2alamat1 = EXCLUDED.so2alamat1,
    so2alamat2 = EXCLUDED.so2alamat2,
    so2alamat3 = EXCLUDED.so2alamat3,
    sobagianpenjualan = EXCLUDED.sobagianpenjualan,
    soekspedisi = EXCLUDED.soekspedisi,
    sotglkirim = EXCLUDED.sotglkirim,
    sotermin = EXCLUDED.sotermin,
    sotgljatuhtempo = EXCLUDED.sotgljatuhtempo,
    souraian = EXCLUDED.souraian,
    socatatan = EXCLUDED.socatatan,
    sonoref = EXCLUDED.sonoref,
    sotglnoref = EXCLUDED.sotglnoref,
    sotglpenutupan = EXCLUDED.sotglpenutupan,
    somatauang = EXCLUDED.somatauang,
    sokurs = EXCLUDED.sokurs,
    sohargatermasukpajak = EXCLUDED.sohargatermasukpajak,
    sototal = EXCLUDED.sototal,
    sodiskonpersen = EXCLUDED.sodiskonpersen,
    sojmldiskon = EXCLUDED.sojmldiskon,
    sototalpajak1detail = EXCLUDED.sototalpajak1detail,
    sototalpajak2detail = EXCLUDED.sototalpajak2detail,
    sobiayalainpersen = EXCLUDED.sobiayalainpersen,
    sobiayalain = EXCLUDED.sobiayalain,
    sototaltransaksi = EXCLUDED.sototaltransaksi,
    sojmlbayar = EXCLUDED.sojmlbayar,
    sorekdiskon = EXCLUDED.sorekdiskon,
    sorekpajak1 = EXCLUDED.sorekpajak1,
    sorekpajak2 = EXCLUDED.sorekpajak2,
    sorekbiayalain = EXCLUDED.sorekbiayalain,
    sorekbayar = EXCLUDED.sorekbayar,
    soidsq = EXCLUDED.soidsq,
    sostatuspi = EXCLUDED.sostatuspi,
    sostatuspl = EXCLUDED.sostatuspl,
    sostatusdo = EXCLUDED.sostatusdo,
    sostatusdr = EXCLUDED.sostatusdr,
    sostatussi = EXCLUDED.sostatussi,
    sostatusrnr = EXCLUDED.sostatusrnr,
    sostatussr = EXCLUDED.sostatussr,
    sostatusrealisasi = EXCLUDED.sostatusrealisasi,
    sostatus = EXCLUDED.sostatus,
    sostatussebelumnya = EXCLUDED.sostatussebelumnya,
    sojmlrevisi = EXCLUDED.sojmlrevisi,
    socetakanke = EXCLUDED.socetakanke,
    soposting = EXCLUDED.soposting,
    sopostingtgl = EXCLUDED.sopostingtgl,
    soisclose = EXCLUDED.soisclose,
    souploaded = EXCLUDED.souploaded,
    somodifikasiuser = EXCLUDED.somodifikasiuser,
    somodifikasitgl = EXCLUDED.somodifikasitgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m5_so_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m5_so_detail'
)
INSERT INTO m5_so_detail (
    idsodetail, idso, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudang, costcenter, divisi, subdivisi, proyek, catatan, urutan, idsqdetail, jmlpi, statuspi, jmlpl, statuspl, jmldo, statusdo, jmldr, statusdr, jmlsi, statussi, jmlrnr, statusrnr, jmlsr, statussr, jmlrealisasi, statusrealisasi, isclose, customtext3, customdbl3, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idsodetail, idso, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudang, costcenter, divisi, subdivisi, proyek, catatan, urutan, idsqdetail, jmlpi, statuspi, jmlpl, statuspl, jmldo, statusdo, jmldr, statusdr, jmlsi, statussi, jmlrnr, statusrnr, jmlsr, statussr, jmlrealisasi, statusrealisasi, isclose, customtext3, customdbl3, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idsodetail', '')::bigint AS idsodetail,
        NULLIF(row_payload ->> 'idso', '')::bigint AS idso,
        NULLIF(row_payload ->> 'idbarang', '')::bigint AS idbarang,
        row_payload ->> 'namabarang' AS namabarang,
        row_payload ->> 'tipebarang' AS tipebarang,
        NULLIF(row_payload ->> 'jml', '')::numeric(20,6) AS jml,
        row_payload ->> 'satuan' AS satuan,
        NULLIF(row_payload ->> 'nilaisatuan', '')::numeric(20,6) AS nilaisatuan,
        NULLIF(row_payload ->> 'jmlbarang', '')::numeric(20,6) AS jmlbarang,
        row_payload ->> 'satuanbarang' AS satuanbarang,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        NULLIF(row_payload ->> 'harga', '')::numeric(20,6) AS harga,
        NULLIF(row_payload ->> 'diskon', '')::numeric(20,6) AS diskon,
        NULLIF(row_payload ->> 'jmldiskon', '')::numeric(20,6) AS jmldiskon,
        NULLIF(row_payload ->> 'pajak1', '')::numeric(20,6) AS pajak1,
        NULLIF(row_payload ->> 'jmlpajak1', '')::numeric(20,6) AS jmlpajak1,
        NULLIF(row_payload ->> 'pajak2', '')::numeric(20,6) AS pajak2,
        NULLIF(row_payload ->> 'jmlpajak2', '')::numeric(20,6) AS jmlpajak2,
        row_payload ->> 'cabang' AS cabang,
        row_payload ->> 'lokasi' AS lokasi,
        row_payload ->> 'gudang' AS gudang,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'idsqdetail', '')::bigint AS idsqdetail,
        NULLIF(row_payload ->> 'jmlpi', '')::numeric(20,6) AS jmlpi,
        NULLIF(row_payload ->> 'statuspi', '')::bigint AS statuspi,
        NULLIF(row_payload ->> 'jmlpl', '')::numeric(20,6) AS jmlpl,
        NULLIF(row_payload ->> 'statuspl', '')::bigint AS statuspl,
        NULLIF(row_payload ->> 'jmldo', '')::numeric(20,6) AS jmldo,
        NULLIF(row_payload ->> 'statusdo', '')::bigint AS statusdo,
        NULLIF(row_payload ->> 'jmldr', '')::numeric(20,6) AS jmldr,
        NULLIF(row_payload ->> 'statusdr', '')::bigint AS statusdr,
        NULLIF(row_payload ->> 'jmlsi', '')::numeric(20,6) AS jmlsi,
        NULLIF(row_payload ->> 'statussi', '')::bigint AS statussi,
        NULLIF(row_payload ->> 'jmlrnr', '')::numeric(20,6) AS jmlrnr,
        NULLIF(row_payload ->> 'statusrnr', '')::bigint AS statusrnr,
        NULLIF(row_payload ->> 'jmlsr', '')::numeric(20,6) AS jmlsr,
        NULLIF(row_payload ->> 'statussr', '')::bigint AS statussr,
        NULLIF(row_payload ->> 'jmlrealisasi', '')::numeric(20,6) AS jmlrealisasi,
        NULLIF(row_payload ->> 'statusrealisasi', '')::bigint AS statusrealisasi,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        row_payload ->> 'customtext3' AS customtext3,
        row_payload ->> 'customdbl3' AS customdbl3,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idsodetail') IS NOT NULL
) AS prepared
ON CONFLICT (idsodetail) DO UPDATE
SET
    idso = EXCLUDED.idso,
    idbarang = EXCLUDED.idbarang,
    namabarang = EXCLUDED.namabarang,
    tipebarang = EXCLUDED.tipebarang,
    jml = EXCLUDED.jml,
    satuan = EXCLUDED.satuan,
    nilaisatuan = EXCLUDED.nilaisatuan,
    jmlbarang = EXCLUDED.jmlbarang,
    satuanbarang = EXCLUDED.satuanbarang,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    harga = EXCLUDED.harga,
    diskon = EXCLUDED.diskon,
    jmldiskon = EXCLUDED.jmldiskon,
    pajak1 = EXCLUDED.pajak1,
    jmlpajak1 = EXCLUDED.jmlpajak1,
    pajak2 = EXCLUDED.pajak2,
    jmlpajak2 = EXCLUDED.jmlpajak2,
    cabang = EXCLUDED.cabang,
    lokasi = EXCLUDED.lokasi,
    gudang = EXCLUDED.gudang,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    idsqdetail = EXCLUDED.idsqdetail,
    jmlpi = EXCLUDED.jmlpi,
    statuspi = EXCLUDED.statuspi,
    jmlpl = EXCLUDED.jmlpl,
    statuspl = EXCLUDED.statuspl,
    jmldo = EXCLUDED.jmldo,
    statusdo = EXCLUDED.statusdo,
    jmldr = EXCLUDED.jmldr,
    statusdr = EXCLUDED.statusdr,
    jmlsi = EXCLUDED.jmlsi,
    statussi = EXCLUDED.statussi,
    jmlrnr = EXCLUDED.jmlrnr,
    statusrnr = EXCLUDED.statusrnr,
    jmlsr = EXCLUDED.jmlsr,
    statussr = EXCLUDED.statussr,
    jmlrealisasi = EXCLUDED.jmlrealisasi,
    statusrealisasi = EXCLUDED.statusrealisasi,
    isclose = EXCLUDED.isclose,
    customtext3 = EXCLUDED.customtext3,
    customdbl3 = EXCLUDED.customdbl3,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m5_as
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m5_as'
)
INSERT INTO m5_as (
    asid, ascabang, aslokasi, asjenis, assumber, asautonotransaksi, asnotransaksi, astgl, askodepa, askontak, askontakperson, as1alamat1, as1alamat2, as1alamat3, as2alamat1, as2alamat2, as2alamat3, asbagianterima, astermin, astgljatuhtempo, asidso, asidip, asnorek, asuraian, ascatatan, asnoref, astglnoref, asmatauang, askurs, asjumlah, asjumlahvalas, asjumlahbayar, asjumlahbayarvalas, asstatusbayar, astgllunas, ascostcenter, asdivisi, assubdivisi, asproyek, asstatus, asstatussebelumnya, asjmlrevisi, ascetakanke, asposting, aspostingtgl, asisclose, asmodifikasiuser, asmodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    asid, ascabang, aslokasi, asjenis, assumber, asautonotransaksi, asnotransaksi, astgl, askodepa, askontak, askontakperson, as1alamat1, as1alamat2, as1alamat3, as2alamat1, as2alamat2, as2alamat3, asbagianterima, astermin, astgljatuhtempo, asidso, asidip, asnorek, asuraian, ascatatan, asnoref, astglnoref, asmatauang, askurs, asjumlah, asjumlahvalas, asjumlahbayar, asjumlahbayarvalas, asstatusbayar, astgllunas, ascostcenter, asdivisi, assubdivisi, asproyek, asstatus, asstatussebelumnya, asjmlrevisi, ascetakanke, asposting, aspostingtgl, asisclose, asmodifikasiuser, asmodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'asid', '')::bigint AS asid,
        row_payload ->> 'ascabang' AS ascabang,
        row_payload ->> 'aslokasi' AS aslokasi,
        row_payload ->> 'asjenis' AS asjenis,
        row_payload ->> 'assumber' AS assumber,
        row_payload ->> 'asautonotransaksi' AS asautonotransaksi,
        row_payload ->> 'asnotransaksi' AS asnotransaksi,
        NULLIF(row_payload ->> 'astgl', '')::timestamptz AS astgl,
        row_payload ->> 'askodepa' AS askodepa,
        NULLIF(row_payload ->> 'askontak', '')::bigint AS askontak,
        NULLIF(row_payload ->> 'askontakperson', '')::bigint AS askontakperson,
        row_payload ->> 'as1alamat1' AS as1alamat1,
        row_payload ->> 'as1alamat2' AS as1alamat2,
        row_payload ->> 'as1alamat3' AS as1alamat3,
        row_payload ->> 'as2alamat1' AS as2alamat1,
        row_payload ->> 'as2alamat2' AS as2alamat2,
        row_payload ->> 'as2alamat3' AS as2alamat3,
        NULLIF(row_payload ->> 'asbagianterima', '')::bigint AS asbagianterima,
        row_payload ->> 'astermin' AS astermin,
        NULLIF(row_payload ->> 'astgljatuhtempo', '')::timestamptz AS astgljatuhtempo,
        NULLIF(row_payload ->> 'asidso', '')::bigint AS asidso,
        NULLIF(row_payload ->> 'asidip', '')::bigint AS asidip,
        row_payload ->> 'asnorek' AS asnorek,
        row_payload ->> 'asuraian' AS asuraian,
        row_payload ->> 'ascatatan' AS ascatatan,
        row_payload ->> 'asnoref' AS asnoref,
        NULLIF(row_payload ->> 'astglnoref', '')::timestamptz AS astglnoref,
        row_payload ->> 'asmatauang' AS asmatauang,
        NULLIF(row_payload ->> 'askurs', '')::numeric(20,6) AS askurs,
        row_payload ->> 'asjumlah' AS asjumlah,
        row_payload ->> 'asjumlahvalas' AS asjumlahvalas,
        row_payload ->> 'asjumlahbayar' AS asjumlahbayar,
        row_payload ->> 'asjumlahbayarvalas' AS asjumlahbayarvalas,
        NULLIF(row_payload ->> 'asstatusbayar', '')::bigint AS asstatusbayar,
        NULLIF(row_payload ->> 'astgllunas', '')::timestamptz AS astgllunas,
        row_payload ->> 'ascostcenter' AS ascostcenter,
        row_payload ->> 'asdivisi' AS asdivisi,
        row_payload ->> 'assubdivisi' AS assubdivisi,
        row_payload ->> 'asproyek' AS asproyek,
        NULLIF(row_payload ->> 'asstatus', '')::bigint AS asstatus,
        NULLIF(row_payload ->> 'asstatussebelumnya', '')::bigint AS asstatussebelumnya,
        NULLIF(row_payload ->> 'asjmlrevisi', '')::bigint AS asjmlrevisi,
        NULLIF(row_payload ->> 'ascetakanke', '')::bigint AS ascetakanke,
        NULLIF(row_payload ->> 'asposting', '')::bigint AS asposting,
        NULLIF(row_payload ->> 'aspostingtgl', '')::timestamptz AS aspostingtgl,
        NULLIF(row_payload ->> 'asisclose', '')::bigint AS asisclose,
        NULLIF(row_payload ->> 'asmodifikasiuser', '')::bigint AS asmodifikasiuser,
        NULLIF(row_payload ->> 'asmodifikasitgl', '')::timestamptz AS asmodifikasitgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'asid') IS NOT NULL
) AS prepared
ON CONFLICT (asid) DO UPDATE
SET
    ascabang = EXCLUDED.ascabang,
    aslokasi = EXCLUDED.aslokasi,
    asjenis = EXCLUDED.asjenis,
    assumber = EXCLUDED.assumber,
    asautonotransaksi = EXCLUDED.asautonotransaksi,
    asnotransaksi = EXCLUDED.asnotransaksi,
    astgl = EXCLUDED.astgl,
    askodepa = EXCLUDED.askodepa,
    askontak = EXCLUDED.askontak,
    askontakperson = EXCLUDED.askontakperson,
    as1alamat1 = EXCLUDED.as1alamat1,
    as1alamat2 = EXCLUDED.as1alamat2,
    as1alamat3 = EXCLUDED.as1alamat3,
    as2alamat1 = EXCLUDED.as2alamat1,
    as2alamat2 = EXCLUDED.as2alamat2,
    as2alamat3 = EXCLUDED.as2alamat3,
    asbagianterima = EXCLUDED.asbagianterima,
    astermin = EXCLUDED.astermin,
    astgljatuhtempo = EXCLUDED.astgljatuhtempo,
    asidso = EXCLUDED.asidso,
    asidip = EXCLUDED.asidip,
    asnorek = EXCLUDED.asnorek,
    asuraian = EXCLUDED.asuraian,
    ascatatan = EXCLUDED.ascatatan,
    asnoref = EXCLUDED.asnoref,
    astglnoref = EXCLUDED.astglnoref,
    asmatauang = EXCLUDED.asmatauang,
    askurs = EXCLUDED.askurs,
    asjumlah = EXCLUDED.asjumlah,
    asjumlahvalas = EXCLUDED.asjumlahvalas,
    asjumlahbayar = EXCLUDED.asjumlahbayar,
    asjumlahbayarvalas = EXCLUDED.asjumlahbayarvalas,
    asstatusbayar = EXCLUDED.asstatusbayar,
    astgllunas = EXCLUDED.astgllunas,
    ascostcenter = EXCLUDED.ascostcenter,
    asdivisi = EXCLUDED.asdivisi,
    assubdivisi = EXCLUDED.assubdivisi,
    asproyek = EXCLUDED.asproyek,
    asstatus = EXCLUDED.asstatus,
    asstatussebelumnya = EXCLUDED.asstatussebelumnya,
    asjmlrevisi = EXCLUDED.asjmlrevisi,
    ascetakanke = EXCLUDED.ascetakanke,
    asposting = EXCLUDED.asposting,
    aspostingtgl = EXCLUDED.aspostingtgl,
    asisclose = EXCLUDED.asisclose,
    asmodifikasiuser = EXCLUDED.asmodifikasiuser,
    asmodifikasitgl = EXCLUDED.asmodifikasitgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m5_ip
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m5_ip'
)
INSERT INTO m5_ip (
    ipid, ipcabang, iplokasi, ipjenis, ipsumber, ipautonotransaksi, ipnotransaksi, iptgl, ipkodepa, ipkontak, ipkontakperson, ip1alamat1, ip1alamat2, ip1alamat3, ip2alamat1, ip2alamat2, ip2alamat3, ipbagianterima, iptermin, iptgljatuhtempo, ipidso, ipnorek, ipuraian, ipcatatan, ipnoref, iptglnoref, ipmatauang, ipkurs, ipjumlah, ipjumlahvalas, ipjumlahbayar, ipjumlahbayarvalas, ipstatusbayar, iptgllunas, ipcostcenter, ipdivisi, ipsubdivisi, ipproyek, ipstatus, ipstatussebelumnya, ipjmlrevisi, ipcetakanke, ipposting, ippostingtgl, ipisclose, ipmodifikasiuser, ipmodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    ipid, ipcabang, iplokasi, ipjenis, ipsumber, ipautonotransaksi, ipnotransaksi, iptgl, ipkodepa, ipkontak, ipkontakperson, ip1alamat1, ip1alamat2, ip1alamat3, ip2alamat1, ip2alamat2, ip2alamat3, ipbagianterima, iptermin, iptgljatuhtempo, ipidso, ipnorek, ipuraian, ipcatatan, ipnoref, iptglnoref, ipmatauang, ipkurs, ipjumlah, ipjumlahvalas, ipjumlahbayar, ipjumlahbayarvalas, ipstatusbayar, iptgllunas, ipcostcenter, ipdivisi, ipsubdivisi, ipproyek, ipstatus, ipstatussebelumnya, ipjmlrevisi, ipcetakanke, ipposting, ippostingtgl, ipisclose, ipmodifikasiuser, ipmodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'ipid', '')::bigint AS ipid,
        row_payload ->> 'ipcabang' AS ipcabang,
        row_payload ->> 'iplokasi' AS iplokasi,
        row_payload ->> 'ipjenis' AS ipjenis,
        row_payload ->> 'ipsumber' AS ipsumber,
        row_payload ->> 'ipautonotransaksi' AS ipautonotransaksi,
        row_payload ->> 'ipnotransaksi' AS ipnotransaksi,
        NULLIF(row_payload ->> 'iptgl', '')::timestamptz AS iptgl,
        row_payload ->> 'ipkodepa' AS ipkodepa,
        NULLIF(row_payload ->> 'ipkontak', '')::bigint AS ipkontak,
        NULLIF(row_payload ->> 'ipkontakperson', '')::bigint AS ipkontakperson,
        row_payload ->> 'ip1alamat1' AS ip1alamat1,
        row_payload ->> 'ip1alamat2' AS ip1alamat2,
        row_payload ->> 'ip1alamat3' AS ip1alamat3,
        row_payload ->> 'ip2alamat1' AS ip2alamat1,
        row_payload ->> 'ip2alamat2' AS ip2alamat2,
        row_payload ->> 'ip2alamat3' AS ip2alamat3,
        NULLIF(row_payload ->> 'ipbagianterima', '')::bigint AS ipbagianterima,
        row_payload ->> 'iptermin' AS iptermin,
        NULLIF(row_payload ->> 'iptgljatuhtempo', '')::timestamptz AS iptgljatuhtempo,
        NULLIF(row_payload ->> 'ipidso', '')::bigint AS ipidso,
        row_payload ->> 'ipnorek' AS ipnorek,
        row_payload ->> 'ipuraian' AS ipuraian,
        row_payload ->> 'ipcatatan' AS ipcatatan,
        row_payload ->> 'ipnoref' AS ipnoref,
        NULLIF(row_payload ->> 'iptglnoref', '')::timestamptz AS iptglnoref,
        row_payload ->> 'ipmatauang' AS ipmatauang,
        NULLIF(row_payload ->> 'ipkurs', '')::numeric(20,6) AS ipkurs,
        row_payload ->> 'ipjumlah' AS ipjumlah,
        row_payload ->> 'ipjumlahvalas' AS ipjumlahvalas,
        row_payload ->> 'ipjumlahbayar' AS ipjumlahbayar,
        row_payload ->> 'ipjumlahbayarvalas' AS ipjumlahbayarvalas,
        NULLIF(row_payload ->> 'ipstatusbayar', '')::bigint AS ipstatusbayar,
        NULLIF(row_payload ->> 'iptgllunas', '')::timestamptz AS iptgllunas,
        row_payload ->> 'ipcostcenter' AS ipcostcenter,
        row_payload ->> 'ipdivisi' AS ipdivisi,
        row_payload ->> 'ipsubdivisi' AS ipsubdivisi,
        row_payload ->> 'ipproyek' AS ipproyek,
        NULLIF(row_payload ->> 'ipstatus', '')::bigint AS ipstatus,
        NULLIF(row_payload ->> 'ipstatussebelumnya', '')::bigint AS ipstatussebelumnya,
        NULLIF(row_payload ->> 'ipjmlrevisi', '')::bigint AS ipjmlrevisi,
        NULLIF(row_payload ->> 'ipcetakanke', '')::bigint AS ipcetakanke,
        NULLIF(row_payload ->> 'ipposting', '')::bigint AS ipposting,
        NULLIF(row_payload ->> 'ippostingtgl', '')::timestamptz AS ippostingtgl,
        NULLIF(row_payload ->> 'ipisclose', '')::bigint AS ipisclose,
        NULLIF(row_payload ->> 'ipmodifikasiuser', '')::bigint AS ipmodifikasiuser,
        NULLIF(row_payload ->> 'ipmodifikasitgl', '')::timestamptz AS ipmodifikasitgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'ipid') IS NOT NULL
) AS prepared
ON CONFLICT (ipid) DO UPDATE
SET
    ipcabang = EXCLUDED.ipcabang,
    iplokasi = EXCLUDED.iplokasi,
    ipjenis = EXCLUDED.ipjenis,
    ipsumber = EXCLUDED.ipsumber,
    ipautonotransaksi = EXCLUDED.ipautonotransaksi,
    ipnotransaksi = EXCLUDED.ipnotransaksi,
    iptgl = EXCLUDED.iptgl,
    ipkodepa = EXCLUDED.ipkodepa,
    ipkontak = EXCLUDED.ipkontak,
    ipkontakperson = EXCLUDED.ipkontakperson,
    ip1alamat1 = EXCLUDED.ip1alamat1,
    ip1alamat2 = EXCLUDED.ip1alamat2,
    ip1alamat3 = EXCLUDED.ip1alamat3,
    ip2alamat1 = EXCLUDED.ip2alamat1,
    ip2alamat2 = EXCLUDED.ip2alamat2,
    ip2alamat3 = EXCLUDED.ip2alamat3,
    ipbagianterima = EXCLUDED.ipbagianterima,
    iptermin = EXCLUDED.iptermin,
    iptgljatuhtempo = EXCLUDED.iptgljatuhtempo,
    ipidso = EXCLUDED.ipidso,
    ipnorek = EXCLUDED.ipnorek,
    ipuraian = EXCLUDED.ipuraian,
    ipcatatan = EXCLUDED.ipcatatan,
    ipnoref = EXCLUDED.ipnoref,
    iptglnoref = EXCLUDED.iptglnoref,
    ipmatauang = EXCLUDED.ipmatauang,
    ipkurs = EXCLUDED.ipkurs,
    ipjumlah = EXCLUDED.ipjumlah,
    ipjumlahvalas = EXCLUDED.ipjumlahvalas,
    ipjumlahbayar = EXCLUDED.ipjumlahbayar,
    ipjumlahbayarvalas = EXCLUDED.ipjumlahbayarvalas,
    ipstatusbayar = EXCLUDED.ipstatusbayar,
    iptgllunas = EXCLUDED.iptgllunas,
    ipcostcenter = EXCLUDED.ipcostcenter,
    ipdivisi = EXCLUDED.ipdivisi,
    ipsubdivisi = EXCLUDED.ipsubdivisi,
    ipproyek = EXCLUDED.ipproyek,
    ipstatus = EXCLUDED.ipstatus,
    ipstatussebelumnya = EXCLUDED.ipstatussebelumnya,
    ipjmlrevisi = EXCLUDED.ipjmlrevisi,
    ipcetakanke = EXCLUDED.ipcetakanke,
    ipposting = EXCLUDED.ipposting,
    ippostingtgl = EXCLUDED.ippostingtgl,
    ipisclose = EXCLUDED.ipisclose,
    ipmodifikasiuser = EXCLUDED.ipmodifikasiuser,
    ipmodifikasitgl = EXCLUDED.ipmodifikasitgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m5_pi
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m5_pi'
)
INSERT INTO m5_pi (
    piid, picabang, pilokasi, pigudang, piasalbarang, piasalbarangkategori, pijenispenjualan, pijenispenjualankategori, picarabayar, pisumber, piautonotransaksi, pinotransaksi, pitgl, pikodepa, picustomer, picustomerkontak, pi1alamat1, pi1alamat2, pi1alamat3, pi2alamat1, pi2alamat2, pi2alamat3, pibagianpenjualan, piekspedisi, pitglkirim, pitermin, pitgljatuhtempo, piuraian, picatatan, pinoref, pitglnoref, pitglpenutupan, pimatauang, pikurs, pihargatermasukpajak, pitotal, pidiskonpersen, pijmldiskon, pitotalpajak1detail, pitotalpajak2detail, pibiayalainpersen, pibiayalain, pitotaltransaksi, pijmlbayar, pirekdiskon, pirekpajak1, pirekpajak2, pirekbiayalain, pirekbayar, piidsq, piidso, pistatuspl, pistatusdo, pistatusdr, pistatussi, pistatusrnr, pistatussr, pistatusrealisasi, pistatus, pistatussebelumnya, pijmlrevisi, picetakanke, piposting, pipostingtgl, piisclose, pitutupperiode, pimodifikasiuser, pimodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    piid, picabang, pilokasi, pigudang, piasalbarang, piasalbarangkategori, pijenispenjualan, pijenispenjualankategori, picarabayar, pisumber, piautonotransaksi, pinotransaksi, pitgl, pikodepa, picustomer, picustomerkontak, pi1alamat1, pi1alamat2, pi1alamat3, pi2alamat1, pi2alamat2, pi2alamat3, pibagianpenjualan, piekspedisi, pitglkirim, pitermin, pitgljatuhtempo, piuraian, picatatan, pinoref, pitglnoref, pitglpenutupan, pimatauang, pikurs, pihargatermasukpajak, pitotal, pidiskonpersen, pijmldiskon, pitotalpajak1detail, pitotalpajak2detail, pibiayalainpersen, pibiayalain, pitotaltransaksi, pijmlbayar, pirekdiskon, pirekpajak1, pirekpajak2, pirekbiayalain, pirekbayar, piidsq, piidso, pistatuspl, pistatusdo, pistatusdr, pistatussi, pistatusrnr, pistatussr, pistatusrealisasi, pistatus, pistatussebelumnya, pijmlrevisi, picetakanke, piposting, pipostingtgl, piisclose, pitutupperiode, pimodifikasiuser, pimodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'piid', '')::bigint AS piid,
        row_payload ->> 'picabang' AS picabang,
        row_payload ->> 'pilokasi' AS pilokasi,
        row_payload ->> 'pigudang' AS pigudang,
        row_payload ->> 'piasalbarang' AS piasalbarang,
        row_payload ->> 'piasalbarangkategori' AS piasalbarangkategori,
        row_payload ->> 'pijenispenjualan' AS pijenispenjualan,
        row_payload ->> 'pijenispenjualankategori' AS pijenispenjualankategori,
        row_payload ->> 'picarabayar' AS picarabayar,
        row_payload ->> 'pisumber' AS pisumber,
        row_payload ->> 'piautonotransaksi' AS piautonotransaksi,
        row_payload ->> 'pinotransaksi' AS pinotransaksi,
        NULLIF(row_payload ->> 'pitgl', '')::timestamptz AS pitgl,
        row_payload ->> 'pikodepa' AS pikodepa,
        row_payload ->> 'picustomer' AS picustomer,
        row_payload ->> 'picustomerkontak' AS picustomerkontak,
        row_payload ->> 'pi1alamat1' AS pi1alamat1,
        row_payload ->> 'pi1alamat2' AS pi1alamat2,
        row_payload ->> 'pi1alamat3' AS pi1alamat3,
        row_payload ->> 'pi2alamat1' AS pi2alamat1,
        row_payload ->> 'pi2alamat2' AS pi2alamat2,
        row_payload ->> 'pi2alamat3' AS pi2alamat3,
        row_payload ->> 'pibagianpenjualan' AS pibagianpenjualan,
        row_payload ->> 'piekspedisi' AS piekspedisi,
        NULLIF(row_payload ->> 'pitglkirim', '')::timestamptz AS pitglkirim,
        row_payload ->> 'pitermin' AS pitermin,
        NULLIF(row_payload ->> 'pitgljatuhtempo', '')::timestamptz AS pitgljatuhtempo,
        row_payload ->> 'piuraian' AS piuraian,
        row_payload ->> 'picatatan' AS picatatan,
        row_payload ->> 'pinoref' AS pinoref,
        NULLIF(row_payload ->> 'pitglnoref', '')::timestamptz AS pitglnoref,
        NULLIF(row_payload ->> 'pitglpenutupan', '')::timestamptz AS pitglpenutupan,
        row_payload ->> 'pimatauang' AS pimatauang,
        NULLIF(row_payload ->> 'pikurs', '')::numeric(20,6) AS pikurs,
        NULLIF(row_payload ->> 'pihargatermasukpajak', '')::numeric(20,6) AS pihargatermasukpajak,
        NULLIF(row_payload ->> 'pitotal', '')::numeric(20,6) AS pitotal,
        NULLIF(row_payload ->> 'pidiskonpersen', '')::bigint AS pidiskonpersen,
        NULLIF(row_payload ->> 'pijmldiskon', '')::numeric(20,6) AS pijmldiskon,
        NULLIF(row_payload ->> 'pitotalpajak1detail', '')::numeric(20,6) AS pitotalpajak1detail,
        NULLIF(row_payload ->> 'pitotalpajak2detail', '')::numeric(20,6) AS pitotalpajak2detail,
        NULLIF(row_payload ->> 'pibiayalainpersen', '')::numeric(20,6) AS pibiayalainpersen,
        row_payload ->> 'pibiayalain' AS pibiayalain,
        NULLIF(row_payload ->> 'pitotaltransaksi', '')::numeric(20,6) AS pitotaltransaksi,
        NULLIF(row_payload ->> 'pijmlbayar', '')::numeric(20,6) AS pijmlbayar,
        NULLIF(row_payload ->> 'pirekdiskon', '')::numeric(20,6) AS pirekdiskon,
        NULLIF(row_payload ->> 'pirekpajak1', '')::numeric(20,6) AS pirekpajak1,
        NULLIF(row_payload ->> 'pirekpajak2', '')::numeric(20,6) AS pirekpajak2,
        row_payload ->> 'pirekbiayalain' AS pirekbiayalain,
        row_payload ->> 'pirekbayar' AS pirekbayar,
        NULLIF(row_payload ->> 'piidsq', '')::bigint AS piidsq,
        NULLIF(row_payload ->> 'piidso', '')::bigint AS piidso,
        row_payload ->> 'pistatuspl' AS pistatuspl,
        row_payload ->> 'pistatusdo' AS pistatusdo,
        row_payload ->> 'pistatusdr' AS pistatusdr,
        row_payload ->> 'pistatussi' AS pistatussi,
        row_payload ->> 'pistatusrnr' AS pistatusrnr,
        row_payload ->> 'pistatussr' AS pistatussr,
        row_payload ->> 'pistatusrealisasi' AS pistatusrealisasi,
        row_payload ->> 'pistatus' AS pistatus,
        row_payload ->> 'pistatussebelumnya' AS pistatussebelumnya,
        NULLIF(row_payload ->> 'pijmlrevisi', '')::numeric(20,6) AS pijmlrevisi,
        row_payload ->> 'picetakanke' AS picetakanke,
        NULLIF(row_payload ->> 'piposting', '')::bigint AS piposting,
        NULLIF(row_payload ->> 'pipostingtgl', '')::timestamptz AS pipostingtgl,
        NULLIF(row_payload ->> 'piisclose', '')::bigint AS piisclose,
        row_payload ->> 'pitutupperiode' AS pitutupperiode,
        row_payload ->> 'pimodifikasiuser' AS pimodifikasiuser,
        NULLIF(row_payload ->> 'pimodifikasitgl', '')::timestamptz AS pimodifikasitgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'piid') IS NOT NULL
) AS prepared
ON CONFLICT (piid) DO UPDATE
SET
    picabang = EXCLUDED.picabang,
    pilokasi = EXCLUDED.pilokasi,
    pigudang = EXCLUDED.pigudang,
    piasalbarang = EXCLUDED.piasalbarang,
    piasalbarangkategori = EXCLUDED.piasalbarangkategori,
    pijenispenjualan = EXCLUDED.pijenispenjualan,
    pijenispenjualankategori = EXCLUDED.pijenispenjualankategori,
    picarabayar = EXCLUDED.picarabayar,
    pisumber = EXCLUDED.pisumber,
    piautonotransaksi = EXCLUDED.piautonotransaksi,
    pinotransaksi = EXCLUDED.pinotransaksi,
    pitgl = EXCLUDED.pitgl,
    pikodepa = EXCLUDED.pikodepa,
    picustomer = EXCLUDED.picustomer,
    picustomerkontak = EXCLUDED.picustomerkontak,
    pi1alamat1 = EXCLUDED.pi1alamat1,
    pi1alamat2 = EXCLUDED.pi1alamat2,
    pi1alamat3 = EXCLUDED.pi1alamat3,
    pi2alamat1 = EXCLUDED.pi2alamat1,
    pi2alamat2 = EXCLUDED.pi2alamat2,
    pi2alamat3 = EXCLUDED.pi2alamat3,
    pibagianpenjualan = EXCLUDED.pibagianpenjualan,
    piekspedisi = EXCLUDED.piekspedisi,
    pitglkirim = EXCLUDED.pitglkirim,
    pitermin = EXCLUDED.pitermin,
    pitgljatuhtempo = EXCLUDED.pitgljatuhtempo,
    piuraian = EXCLUDED.piuraian,
    picatatan = EXCLUDED.picatatan,
    pinoref = EXCLUDED.pinoref,
    pitglnoref = EXCLUDED.pitglnoref,
    pitglpenutupan = EXCLUDED.pitglpenutupan,
    pimatauang = EXCLUDED.pimatauang,
    pikurs = EXCLUDED.pikurs,
    pihargatermasukpajak = EXCLUDED.pihargatermasukpajak,
    pitotal = EXCLUDED.pitotal,
    pidiskonpersen = EXCLUDED.pidiskonpersen,
    pijmldiskon = EXCLUDED.pijmldiskon,
    pitotalpajak1detail = EXCLUDED.pitotalpajak1detail,
    pitotalpajak2detail = EXCLUDED.pitotalpajak2detail,
    pibiayalainpersen = EXCLUDED.pibiayalainpersen,
    pibiayalain = EXCLUDED.pibiayalain,
    pitotaltransaksi = EXCLUDED.pitotaltransaksi,
    pijmlbayar = EXCLUDED.pijmlbayar,
    pirekdiskon = EXCLUDED.pirekdiskon,
    pirekpajak1 = EXCLUDED.pirekpajak1,
    pirekpajak2 = EXCLUDED.pirekpajak2,
    pirekbiayalain = EXCLUDED.pirekbiayalain,
    pirekbayar = EXCLUDED.pirekbayar,
    piidsq = EXCLUDED.piidsq,
    piidso = EXCLUDED.piidso,
    pistatuspl = EXCLUDED.pistatuspl,
    pistatusdo = EXCLUDED.pistatusdo,
    pistatusdr = EXCLUDED.pistatusdr,
    pistatussi = EXCLUDED.pistatussi,
    pistatusrnr = EXCLUDED.pistatusrnr,
    pistatussr = EXCLUDED.pistatussr,
    pistatusrealisasi = EXCLUDED.pistatusrealisasi,
    pistatus = EXCLUDED.pistatus,
    pistatussebelumnya = EXCLUDED.pistatussebelumnya,
    pijmlrevisi = EXCLUDED.pijmlrevisi,
    picetakanke = EXCLUDED.picetakanke,
    piposting = EXCLUDED.piposting,
    pipostingtgl = EXCLUDED.pipostingtgl,
    piisclose = EXCLUDED.piisclose,
    pitutupperiode = EXCLUDED.pitutupperiode,
    pimodifikasiuser = EXCLUDED.pimodifikasiuser,
    pimodifikasitgl = EXCLUDED.pimodifikasitgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m5_pi_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m5_pi_detail'
)
INSERT INTO m5_pi_detail (
    idpidetail, idpi, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudang, costcenter, divisi, subdivisi, proyek, catatan, urutan, idsqdetail, idsodetail, jmlpl, statuspl, jmldo, statusdo, jmldr, statusdr, jmlsi, statussi, jmlrnr, statusrnr, jmlsr, statussr, jmlrealisasi, statusrealisasi, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idpidetail, idpi, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudang, costcenter, divisi, subdivisi, proyek, catatan, urutan, idsqdetail, idsodetail, jmlpl, statuspl, jmldo, statusdo, jmldr, statusdr, jmlsi, statussi, jmlrnr, statusrnr, jmlsr, statussr, jmlrealisasi, statusrealisasi, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idpidetail', '')::bigint AS idpidetail,
        NULLIF(row_payload ->> 'idpi', '')::bigint AS idpi,
        NULLIF(row_payload ->> 'idbarang', '')::bigint AS idbarang,
        row_payload ->> 'namabarang' AS namabarang,
        row_payload ->> 'tipebarang' AS tipebarang,
        NULLIF(row_payload ->> 'jml', '')::numeric(20,6) AS jml,
        row_payload ->> 'satuan' AS satuan,
        NULLIF(row_payload ->> 'nilaisatuan', '')::numeric(20,6) AS nilaisatuan,
        NULLIF(row_payload ->> 'jmlbarang', '')::numeric(20,6) AS jmlbarang,
        row_payload ->> 'satuanbarang' AS satuanbarang,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        NULLIF(row_payload ->> 'harga', '')::numeric(20,6) AS harga,
        NULLIF(row_payload ->> 'diskon', '')::numeric(20,6) AS diskon,
        NULLIF(row_payload ->> 'jmldiskon', '')::numeric(20,6) AS jmldiskon,
        NULLIF(row_payload ->> 'pajak1', '')::numeric(20,6) AS pajak1,
        NULLIF(row_payload ->> 'jmlpajak1', '')::numeric(20,6) AS jmlpajak1,
        NULLIF(row_payload ->> 'pajak2', '')::numeric(20,6) AS pajak2,
        NULLIF(row_payload ->> 'jmlpajak2', '')::numeric(20,6) AS jmlpajak2,
        row_payload ->> 'cabang' AS cabang,
        row_payload ->> 'lokasi' AS lokasi,
        row_payload ->> 'gudang' AS gudang,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'idsqdetail', '')::bigint AS idsqdetail,
        NULLIF(row_payload ->> 'idsodetail', '')::bigint AS idsodetail,
        NULLIF(row_payload ->> 'jmlpl', '')::numeric(20,6) AS jmlpl,
        NULLIF(row_payload ->> 'statuspl', '')::bigint AS statuspl,
        NULLIF(row_payload ->> 'jmldo', '')::numeric(20,6) AS jmldo,
        NULLIF(row_payload ->> 'statusdo', '')::bigint AS statusdo,
        NULLIF(row_payload ->> 'jmldr', '')::numeric(20,6) AS jmldr,
        NULLIF(row_payload ->> 'statusdr', '')::bigint AS statusdr,
        NULLIF(row_payload ->> 'jmlsi', '')::numeric(20,6) AS jmlsi,
        NULLIF(row_payload ->> 'statussi', '')::bigint AS statussi,
        NULLIF(row_payload ->> 'jmlrnr', '')::numeric(20,6) AS jmlrnr,
        NULLIF(row_payload ->> 'statusrnr', '')::bigint AS statusrnr,
        NULLIF(row_payload ->> 'jmlsr', '')::numeric(20,6) AS jmlsr,
        NULLIF(row_payload ->> 'statussr', '')::bigint AS statussr,
        NULLIF(row_payload ->> 'jmlrealisasi', '')::numeric(20,6) AS jmlrealisasi,
        NULLIF(row_payload ->> 'statusrealisasi', '')::bigint AS statusrealisasi,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idpidetail') IS NOT NULL
) AS prepared
ON CONFLICT (idpidetail) DO UPDATE
SET
    idpi = EXCLUDED.idpi,
    idbarang = EXCLUDED.idbarang,
    namabarang = EXCLUDED.namabarang,
    tipebarang = EXCLUDED.tipebarang,
    jml = EXCLUDED.jml,
    satuan = EXCLUDED.satuan,
    nilaisatuan = EXCLUDED.nilaisatuan,
    jmlbarang = EXCLUDED.jmlbarang,
    satuanbarang = EXCLUDED.satuanbarang,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    harga = EXCLUDED.harga,
    diskon = EXCLUDED.diskon,
    jmldiskon = EXCLUDED.jmldiskon,
    pajak1 = EXCLUDED.pajak1,
    jmlpajak1 = EXCLUDED.jmlpajak1,
    pajak2 = EXCLUDED.pajak2,
    jmlpajak2 = EXCLUDED.jmlpajak2,
    cabang = EXCLUDED.cabang,
    lokasi = EXCLUDED.lokasi,
    gudang = EXCLUDED.gudang,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    idsqdetail = EXCLUDED.idsqdetail,
    idsodetail = EXCLUDED.idsodetail,
    jmlpl = EXCLUDED.jmlpl,
    statuspl = EXCLUDED.statuspl,
    jmldo = EXCLUDED.jmldo,
    statusdo = EXCLUDED.statusdo,
    jmldr = EXCLUDED.jmldr,
    statusdr = EXCLUDED.statusdr,
    jmlsi = EXCLUDED.jmlsi,
    statussi = EXCLUDED.statussi,
    jmlrnr = EXCLUDED.jmlrnr,
    statusrnr = EXCLUDED.statusrnr,
    jmlsr = EXCLUDED.jmlsr,
    statussr = EXCLUDED.statussr,
    jmlrealisasi = EXCLUDED.jmlrealisasi,
    statusrealisasi = EXCLUDED.statusrealisasi,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m5_pl
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m5_pl'
)
INSERT INTO m5_pl (
    plid, plcabang, pllokasi, plgudang, plasalbarang, plasalbarangkategori, pljenispenjualan, pljenispenjualankategori, plcarabayar, plsumber, plautonotransaksi, plnotransaksi, pltgl, plkodepa, plcustomer, plcustomerkontak, pl1alamat1, pl1alamat2, pl1alamat3, pl2alamat1, pl2alamat2, pl2alamat3, plbagianpenjualan, plbagianpengepakan, plekspedisi, pltglkirim, pltermin, pltgljatuhtempo, pluraian, plcatatan, plnoref, pltglnoref, pltglpenutupan, plmatauang, plkurs, plhargatermasukpajak, pltotal, pldiskonpersen, pljmldiskon, pltotalpajak1detail, pltotalpajak2detail, plbiayalainpersen, plbiayalain, pltotaltransaksi, plrekdiskon, plrekpajak1, plrekpajak2, plrekbiayalain, plidsq, plidso, plidpi, plstatusdo, plstatusdr, plstatussi, plstatusrnr, plstatussr, plstatusrealisasi, plstatus, plstatussebelumnya, pljmlrevisi, plcetakanke, plposting, plpostingtgl, plisclose, plmodifikasiuser, plmodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    plid, plcabang, pllokasi, plgudang, plasalbarang, plasalbarangkategori, pljenispenjualan, pljenispenjualankategori, plcarabayar, plsumber, plautonotransaksi, plnotransaksi, pltgl, plkodepa, plcustomer, plcustomerkontak, pl1alamat1, pl1alamat2, pl1alamat3, pl2alamat1, pl2alamat2, pl2alamat3, plbagianpenjualan, plbagianpengepakan, plekspedisi, pltglkirim, pltermin, pltgljatuhtempo, pluraian, plcatatan, plnoref, pltglnoref, pltglpenutupan, plmatauang, plkurs, plhargatermasukpajak, pltotal, pldiskonpersen, pljmldiskon, pltotalpajak1detail, pltotalpajak2detail, plbiayalainpersen, plbiayalain, pltotaltransaksi, plrekdiskon, plrekpajak1, plrekpajak2, plrekbiayalain, plidsq, plidso, plidpi, plstatusdo, plstatusdr, plstatussi, plstatusrnr, plstatussr, plstatusrealisasi, plstatus, plstatussebelumnya, pljmlrevisi, plcetakanke, plposting, plpostingtgl, plisclose, plmodifikasiuser, plmodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'plid', '')::bigint AS plid,
        row_payload ->> 'plcabang' AS plcabang,
        row_payload ->> 'pllokasi' AS pllokasi,
        row_payload ->> 'plgudang' AS plgudang,
        row_payload ->> 'plasalbarang' AS plasalbarang,
        row_payload ->> 'plasalbarangkategori' AS plasalbarangkategori,
        row_payload ->> 'pljenispenjualan' AS pljenispenjualan,
        row_payload ->> 'pljenispenjualankategori' AS pljenispenjualankategori,
        row_payload ->> 'plcarabayar' AS plcarabayar,
        row_payload ->> 'plsumber' AS plsumber,
        row_payload ->> 'plautonotransaksi' AS plautonotransaksi,
        row_payload ->> 'plnotransaksi' AS plnotransaksi,
        NULLIF(row_payload ->> 'pltgl', '')::timestamptz AS pltgl,
        row_payload ->> 'plkodepa' AS plkodepa,
        row_payload ->> 'plcustomer' AS plcustomer,
        row_payload ->> 'plcustomerkontak' AS plcustomerkontak,
        row_payload ->> 'pl1alamat1' AS pl1alamat1,
        row_payload ->> 'pl1alamat2' AS pl1alamat2,
        row_payload ->> 'pl1alamat3' AS pl1alamat3,
        row_payload ->> 'pl2alamat1' AS pl2alamat1,
        row_payload ->> 'pl2alamat2' AS pl2alamat2,
        row_payload ->> 'pl2alamat3' AS pl2alamat3,
        row_payload ->> 'plbagianpenjualan' AS plbagianpenjualan,
        row_payload ->> 'plbagianpengepakan' AS plbagianpengepakan,
        row_payload ->> 'plekspedisi' AS plekspedisi,
        NULLIF(row_payload ->> 'pltglkirim', '')::timestamptz AS pltglkirim,
        row_payload ->> 'pltermin' AS pltermin,
        NULLIF(row_payload ->> 'pltgljatuhtempo', '')::timestamptz AS pltgljatuhtempo,
        row_payload ->> 'pluraian' AS pluraian,
        row_payload ->> 'plcatatan' AS plcatatan,
        row_payload ->> 'plnoref' AS plnoref,
        NULLIF(row_payload ->> 'pltglnoref', '')::timestamptz AS pltglnoref,
        NULLIF(row_payload ->> 'pltglpenutupan', '')::timestamptz AS pltglpenutupan,
        row_payload ->> 'plmatauang' AS plmatauang,
        NULLIF(row_payload ->> 'plkurs', '')::numeric(20,6) AS plkurs,
        NULLIF(row_payload ->> 'plhargatermasukpajak', '')::numeric(20,6) AS plhargatermasukpajak,
        NULLIF(row_payload ->> 'pltotal', '')::numeric(20,6) AS pltotal,
        NULLIF(row_payload ->> 'pldiskonpersen', '')::numeric(20,6) AS pldiskonpersen,
        NULLIF(row_payload ->> 'pljmldiskon', '')::numeric(20,6) AS pljmldiskon,
        NULLIF(row_payload ->> 'pltotalpajak1detail', '')::numeric(20,6) AS pltotalpajak1detail,
        NULLIF(row_payload ->> 'pltotalpajak2detail', '')::numeric(20,6) AS pltotalpajak2detail,
        NULLIF(row_payload ->> 'plbiayalainpersen', '')::numeric(20,6) AS plbiayalainpersen,
        row_payload ->> 'plbiayalain' AS plbiayalain,
        NULLIF(row_payload ->> 'pltotaltransaksi', '')::numeric(20,6) AS pltotaltransaksi,
        NULLIF(row_payload ->> 'plrekdiskon', '')::numeric(20,6) AS plrekdiskon,
        NULLIF(row_payload ->> 'plrekpajak1', '')::numeric(20,6) AS plrekpajak1,
        NULLIF(row_payload ->> 'plrekpajak2', '')::numeric(20,6) AS plrekpajak2,
        row_payload ->> 'plrekbiayalain' AS plrekbiayalain,
        NULLIF(row_payload ->> 'plidsq', '')::bigint AS plidsq,
        NULLIF(row_payload ->> 'plidso', '')::bigint AS plidso,
        NULLIF(row_payload ->> 'plidpi', '')::bigint AS plidpi,
        row_payload ->> 'plstatusdo' AS plstatusdo,
        row_payload ->> 'plstatusdr' AS plstatusdr,
        row_payload ->> 'plstatussi' AS plstatussi,
        row_payload ->> 'plstatusrnr' AS plstatusrnr,
        row_payload ->> 'plstatussr' AS plstatussr,
        row_payload ->> 'plstatusrealisasi' AS plstatusrealisasi,
        row_payload ->> 'plstatus' AS plstatus,
        row_payload ->> 'plstatussebelumnya' AS plstatussebelumnya,
        NULLIF(row_payload ->> 'pljmlrevisi', '')::numeric(20,6) AS pljmlrevisi,
        row_payload ->> 'plcetakanke' AS plcetakanke,
        NULLIF(row_payload ->> 'plposting', '')::bigint AS plposting,
        NULLIF(row_payload ->> 'plpostingtgl', '')::timestamptz AS plpostingtgl,
        NULLIF(row_payload ->> 'plisclose', '')::bigint AS plisclose,
        row_payload ->> 'plmodifikasiuser' AS plmodifikasiuser,
        NULLIF(row_payload ->> 'plmodifikasitgl', '')::timestamptz AS plmodifikasitgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'plid') IS NOT NULL
) AS prepared
ON CONFLICT (plid) DO UPDATE
SET
    plcabang = EXCLUDED.plcabang,
    pllokasi = EXCLUDED.pllokasi,
    plgudang = EXCLUDED.plgudang,
    plasalbarang = EXCLUDED.plasalbarang,
    plasalbarangkategori = EXCLUDED.plasalbarangkategori,
    pljenispenjualan = EXCLUDED.pljenispenjualan,
    pljenispenjualankategori = EXCLUDED.pljenispenjualankategori,
    plcarabayar = EXCLUDED.plcarabayar,
    plsumber = EXCLUDED.plsumber,
    plautonotransaksi = EXCLUDED.plautonotransaksi,
    plnotransaksi = EXCLUDED.plnotransaksi,
    pltgl = EXCLUDED.pltgl,
    plkodepa = EXCLUDED.plkodepa,
    plcustomer = EXCLUDED.plcustomer,
    plcustomerkontak = EXCLUDED.plcustomerkontak,
    pl1alamat1 = EXCLUDED.pl1alamat1,
    pl1alamat2 = EXCLUDED.pl1alamat2,
    pl1alamat3 = EXCLUDED.pl1alamat3,
    pl2alamat1 = EXCLUDED.pl2alamat1,
    pl2alamat2 = EXCLUDED.pl2alamat2,
    pl2alamat3 = EXCLUDED.pl2alamat3,
    plbagianpenjualan = EXCLUDED.plbagianpenjualan,
    plbagianpengepakan = EXCLUDED.plbagianpengepakan,
    plekspedisi = EXCLUDED.plekspedisi,
    pltglkirim = EXCLUDED.pltglkirim,
    pltermin = EXCLUDED.pltermin,
    pltgljatuhtempo = EXCLUDED.pltgljatuhtempo,
    pluraian = EXCLUDED.pluraian,
    plcatatan = EXCLUDED.plcatatan,
    plnoref = EXCLUDED.plnoref,
    pltglnoref = EXCLUDED.pltglnoref,
    pltglpenutupan = EXCLUDED.pltglpenutupan,
    plmatauang = EXCLUDED.plmatauang,
    plkurs = EXCLUDED.plkurs,
    plhargatermasukpajak = EXCLUDED.plhargatermasukpajak,
    pltotal = EXCLUDED.pltotal,
    pldiskonpersen = EXCLUDED.pldiskonpersen,
    pljmldiskon = EXCLUDED.pljmldiskon,
    pltotalpajak1detail = EXCLUDED.pltotalpajak1detail,
    pltotalpajak2detail = EXCLUDED.pltotalpajak2detail,
    plbiayalainpersen = EXCLUDED.plbiayalainpersen,
    plbiayalain = EXCLUDED.plbiayalain,
    pltotaltransaksi = EXCLUDED.pltotaltransaksi,
    plrekdiskon = EXCLUDED.plrekdiskon,
    plrekpajak1 = EXCLUDED.plrekpajak1,
    plrekpajak2 = EXCLUDED.plrekpajak2,
    plrekbiayalain = EXCLUDED.plrekbiayalain,
    plidsq = EXCLUDED.plidsq,
    plidso = EXCLUDED.plidso,
    plidpi = EXCLUDED.plidpi,
    plstatusdo = EXCLUDED.plstatusdo,
    plstatusdr = EXCLUDED.plstatusdr,
    plstatussi = EXCLUDED.plstatussi,
    plstatusrnr = EXCLUDED.plstatusrnr,
    plstatussr = EXCLUDED.plstatussr,
    plstatusrealisasi = EXCLUDED.plstatusrealisasi,
    plstatus = EXCLUDED.plstatus,
    plstatussebelumnya = EXCLUDED.plstatussebelumnya,
    pljmlrevisi = EXCLUDED.pljmlrevisi,
    plcetakanke = EXCLUDED.plcetakanke,
    plposting = EXCLUDED.plposting,
    plpostingtgl = EXCLUDED.plpostingtgl,
    plisclose = EXCLUDED.plisclose,
    plmodifikasiuser = EXCLUDED.plmodifikasiuser,
    plmodifikasitgl = EXCLUDED.plmodifikasitgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m5_pl_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m5_pl_detail'
)
INSERT INTO m5_pl_detail (
    idpldetail, idpl, idbarang, namabarang, tipebarang, nopack, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudang, costcenter, divisi, subdivisi, proyek, catatan, urutan, idsqdetail, idsodetail, idpidetail, jmldo, statusdo, jmldr, statusdr, jmlsi, statussi, jmlrnr, statusrnr, jmlsr, statussr, jmlrealisasi, statusrealisasi, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idpldetail, idpl, idbarang, namabarang, tipebarang, nopack, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudang, costcenter, divisi, subdivisi, proyek, catatan, urutan, idsqdetail, idsodetail, idpidetail, jmldo, statusdo, jmldr, statusdr, jmlsi, statussi, jmlrnr, statusrnr, jmlsr, statussr, jmlrealisasi, statusrealisasi, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idpldetail', '')::bigint AS idpldetail,
        NULLIF(row_payload ->> 'idpl', '')::bigint AS idpl,
        NULLIF(row_payload ->> 'idbarang', '')::bigint AS idbarang,
        row_payload ->> 'namabarang' AS namabarang,
        row_payload ->> 'tipebarang' AS tipebarang,
        row_payload ->> 'nopack' AS nopack,
        NULLIF(row_payload ->> 'jml', '')::numeric(20,6) AS jml,
        row_payload ->> 'satuan' AS satuan,
        NULLIF(row_payload ->> 'nilaisatuan', '')::numeric(20,6) AS nilaisatuan,
        NULLIF(row_payload ->> 'jmlbarang', '')::numeric(20,6) AS jmlbarang,
        row_payload ->> 'satuanbarang' AS satuanbarang,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        NULLIF(row_payload ->> 'harga', '')::numeric(20,6) AS harga,
        NULLIF(row_payload ->> 'diskon', '')::numeric(20,6) AS diskon,
        NULLIF(row_payload ->> 'jmldiskon', '')::numeric(20,6) AS jmldiskon,
        NULLIF(row_payload ->> 'pajak1', '')::numeric(20,6) AS pajak1,
        NULLIF(row_payload ->> 'jmlpajak1', '')::numeric(20,6) AS jmlpajak1,
        NULLIF(row_payload ->> 'pajak2', '')::numeric(20,6) AS pajak2,
        NULLIF(row_payload ->> 'jmlpajak2', '')::numeric(20,6) AS jmlpajak2,
        row_payload ->> 'cabang' AS cabang,
        row_payload ->> 'lokasi' AS lokasi,
        row_payload ->> 'gudang' AS gudang,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'idsqdetail', '')::bigint AS idsqdetail,
        NULLIF(row_payload ->> 'idsodetail', '')::bigint AS idsodetail,
        NULLIF(row_payload ->> 'idpidetail', '')::bigint AS idpidetail,
        NULLIF(row_payload ->> 'jmldo', '')::numeric(20,6) AS jmldo,
        NULLIF(row_payload ->> 'statusdo', '')::bigint AS statusdo,
        NULLIF(row_payload ->> 'jmldr', '')::numeric(20,6) AS jmldr,
        NULLIF(row_payload ->> 'statusdr', '')::bigint AS statusdr,
        NULLIF(row_payload ->> 'jmlsi', '')::numeric(20,6) AS jmlsi,
        NULLIF(row_payload ->> 'statussi', '')::bigint AS statussi,
        NULLIF(row_payload ->> 'jmlrnr', '')::numeric(20,6) AS jmlrnr,
        NULLIF(row_payload ->> 'statusrnr', '')::bigint AS statusrnr,
        NULLIF(row_payload ->> 'jmlsr', '')::numeric(20,6) AS jmlsr,
        NULLIF(row_payload ->> 'statussr', '')::bigint AS statussr,
        NULLIF(row_payload ->> 'jmlrealisasi', '')::numeric(20,6) AS jmlrealisasi,
        NULLIF(row_payload ->> 'statusrealisasi', '')::bigint AS statusrealisasi,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idpldetail') IS NOT NULL
) AS prepared
ON CONFLICT (idpldetail) DO UPDATE
SET
    idpl = EXCLUDED.idpl,
    idbarang = EXCLUDED.idbarang,
    namabarang = EXCLUDED.namabarang,
    tipebarang = EXCLUDED.tipebarang,
    nopack = EXCLUDED.nopack,
    jml = EXCLUDED.jml,
    satuan = EXCLUDED.satuan,
    nilaisatuan = EXCLUDED.nilaisatuan,
    jmlbarang = EXCLUDED.jmlbarang,
    satuanbarang = EXCLUDED.satuanbarang,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    harga = EXCLUDED.harga,
    diskon = EXCLUDED.diskon,
    jmldiskon = EXCLUDED.jmldiskon,
    pajak1 = EXCLUDED.pajak1,
    jmlpajak1 = EXCLUDED.jmlpajak1,
    pajak2 = EXCLUDED.pajak2,
    jmlpajak2 = EXCLUDED.jmlpajak2,
    cabang = EXCLUDED.cabang,
    lokasi = EXCLUDED.lokasi,
    gudang = EXCLUDED.gudang,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    idsqdetail = EXCLUDED.idsqdetail,
    idsodetail = EXCLUDED.idsodetail,
    idpidetail = EXCLUDED.idpidetail,
    jmldo = EXCLUDED.jmldo,
    statusdo = EXCLUDED.statusdo,
    jmldr = EXCLUDED.jmldr,
    statusdr = EXCLUDED.statusdr,
    jmlsi = EXCLUDED.jmlsi,
    statussi = EXCLUDED.statussi,
    jmlrnr = EXCLUDED.jmlrnr,
    statusrnr = EXCLUDED.statusrnr,
    jmlsr = EXCLUDED.jmlsr,
    statussr = EXCLUDED.statussr,
    jmlrealisasi = EXCLUDED.jmlrealisasi,
    statusrealisasi = EXCLUDED.statusrealisasi,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m5_do
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m5_do'
)
INSERT INTO m5_do (
    doid, docabang, dolokasi, dogudang, doasalbarang, doasalbarangkategori, dojenispenjualan, dojenispenjualankategori, docarabayar, dosumber, doautonotransaksi, donotransaksi, dotgl, dokodepa, docustomer, docustomerkontak, do1alamat1, do1alamat2, do1alamat3, do2alamat1, do2alamat2, do2alamat3, dobagianpenjualan, dobagianpengiriman, doekspedisi, dotglkirim, dotermin, dotgljatuhtempo, douraian, docatatan, donoref, dotglnoref, dotglpenutupan, domatauang, dokurs, dohargatermasukpajak, dototal, dodiskonpersen, dojmldiskon, dototalpajak1detail, dototalpajak2detail, dobiayalainpersen, dobiayalain, dototaltransaksi, dorekdiskon, dorekpajak1, dorekpajak2, dorekbiayalain, doidsq, doidso, doidpi, doidpl, dostatusdr, dostatussi, dostatusrnr, dostatussr, dostatusrealisasi, dostatus, dostatussebelumnya, dojmlrevisi, docetakanke, doposting, dopostingtgl, dotutupperiode, doisclose, domodifikasiuser, domodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    doid, docabang, dolokasi, dogudang, doasalbarang, doasalbarangkategori, dojenispenjualan, dojenispenjualankategori, docarabayar, dosumber, doautonotransaksi, donotransaksi, dotgl, dokodepa, docustomer, docustomerkontak, do1alamat1, do1alamat2, do1alamat3, do2alamat1, do2alamat2, do2alamat3, dobagianpenjualan, dobagianpengiriman, doekspedisi, dotglkirim, dotermin, dotgljatuhtempo, douraian, docatatan, donoref, dotglnoref, dotglpenutupan, domatauang, dokurs, dohargatermasukpajak, dototal, dodiskonpersen, dojmldiskon, dototalpajak1detail, dototalpajak2detail, dobiayalainpersen, dobiayalain, dototaltransaksi, dorekdiskon, dorekpajak1, dorekpajak2, dorekbiayalain, doidsq, doidso, doidpi, doidpl, dostatusdr, dostatussi, dostatusrnr, dostatussr, dostatusrealisasi, dostatus, dostatussebelumnya, dojmlrevisi, docetakanke, doposting, dopostingtgl, dotutupperiode, doisclose, domodifikasiuser, domodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'doid', '')::bigint AS doid,
        row_payload ->> 'docabang' AS docabang,
        row_payload ->> 'dolokasi' AS dolokasi,
        row_payload ->> 'dogudang' AS dogudang,
        row_payload ->> 'doasalbarang' AS doasalbarang,
        row_payload ->> 'doasalbarangkategori' AS doasalbarangkategori,
        row_payload ->> 'dojenispenjualan' AS dojenispenjualan,
        row_payload ->> 'dojenispenjualankategori' AS dojenispenjualankategori,
        row_payload ->> 'docarabayar' AS docarabayar,
        row_payload ->> 'dosumber' AS dosumber,
        row_payload ->> 'doautonotransaksi' AS doautonotransaksi,
        row_payload ->> 'donotransaksi' AS donotransaksi,
        NULLIF(row_payload ->> 'dotgl', '')::timestamptz AS dotgl,
        row_payload ->> 'dokodepa' AS dokodepa,
        row_payload ->> 'docustomer' AS docustomer,
        row_payload ->> 'docustomerkontak' AS docustomerkontak,
        row_payload ->> 'do1alamat1' AS do1alamat1,
        row_payload ->> 'do1alamat2' AS do1alamat2,
        row_payload ->> 'do1alamat3' AS do1alamat3,
        row_payload ->> 'do2alamat1' AS do2alamat1,
        row_payload ->> 'do2alamat2' AS do2alamat2,
        row_payload ->> 'do2alamat3' AS do2alamat3,
        row_payload ->> 'dobagianpenjualan' AS dobagianpenjualan,
        row_payload ->> 'dobagianpengiriman' AS dobagianpengiriman,
        row_payload ->> 'doekspedisi' AS doekspedisi,
        NULLIF(row_payload ->> 'dotglkirim', '')::timestamptz AS dotglkirim,
        row_payload ->> 'dotermin' AS dotermin,
        NULLIF(row_payload ->> 'dotgljatuhtempo', '')::timestamptz AS dotgljatuhtempo,
        row_payload ->> 'douraian' AS douraian,
        row_payload ->> 'docatatan' AS docatatan,
        row_payload ->> 'donoref' AS donoref,
        NULLIF(row_payload ->> 'dotglnoref', '')::timestamptz AS dotglnoref,
        NULLIF(row_payload ->> 'dotglpenutupan', '')::timestamptz AS dotglpenutupan,
        row_payload ->> 'domatauang' AS domatauang,
        NULLIF(row_payload ->> 'dokurs', '')::numeric(20,6) AS dokurs,
        NULLIF(row_payload ->> 'dohargatermasukpajak', '')::numeric(20,6) AS dohargatermasukpajak,
        NULLIF(row_payload ->> 'dototal', '')::numeric(20,6) AS dototal,
        NULLIF(row_payload ->> 'dodiskonpersen', '')::numeric(20,6) AS dodiskonpersen,
        NULLIF(row_payload ->> 'dojmldiskon', '')::numeric(20,6) AS dojmldiskon,
        NULLIF(row_payload ->> 'dototalpajak1detail', '')::numeric(20,6) AS dototalpajak1detail,
        NULLIF(row_payload ->> 'dototalpajak2detail', '')::numeric(20,6) AS dototalpajak2detail,
        NULLIF(row_payload ->> 'dobiayalainpersen', '')::numeric(20,6) AS dobiayalainpersen,
        row_payload ->> 'dobiayalain' AS dobiayalain,
        NULLIF(row_payload ->> 'dototaltransaksi', '')::numeric(20,6) AS dototaltransaksi,
        NULLIF(row_payload ->> 'dorekdiskon', '')::numeric(20,6) AS dorekdiskon,
        NULLIF(row_payload ->> 'dorekpajak1', '')::numeric(20,6) AS dorekpajak1,
        NULLIF(row_payload ->> 'dorekpajak2', '')::numeric(20,6) AS dorekpajak2,
        row_payload ->> 'dorekbiayalain' AS dorekbiayalain,
        NULLIF(row_payload ->> 'doidsq', '')::bigint AS doidsq,
        NULLIF(row_payload ->> 'doidso', '')::bigint AS doidso,
        NULLIF(row_payload ->> 'doidpi', '')::bigint AS doidpi,
        NULLIF(row_payload ->> 'doidpl', '')::bigint AS doidpl,
        row_payload ->> 'dostatusdr' AS dostatusdr,
        row_payload ->> 'dostatussi' AS dostatussi,
        row_payload ->> 'dostatusrnr' AS dostatusrnr,
        row_payload ->> 'dostatussr' AS dostatussr,
        row_payload ->> 'dostatusrealisasi' AS dostatusrealisasi,
        row_payload ->> 'dostatus' AS dostatus,
        row_payload ->> 'dostatussebelumnya' AS dostatussebelumnya,
        NULLIF(row_payload ->> 'dojmlrevisi', '')::numeric(20,6) AS dojmlrevisi,
        row_payload ->> 'docetakanke' AS docetakanke,
        NULLIF(row_payload ->> 'doposting', '')::bigint AS doposting,
        NULLIF(row_payload ->> 'dopostingtgl', '')::timestamptz AS dopostingtgl,
        row_payload ->> 'dotutupperiode' AS dotutupperiode,
        NULLIF(row_payload ->> 'doisclose', '')::bigint AS doisclose,
        row_payload ->> 'domodifikasiuser' AS domodifikasiuser,
        NULLIF(row_payload ->> 'domodifikasitgl', '')::timestamptz AS domodifikasitgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'doid') IS NOT NULL
) AS prepared
ON CONFLICT (doid) DO UPDATE
SET
    docabang = EXCLUDED.docabang,
    dolokasi = EXCLUDED.dolokasi,
    dogudang = EXCLUDED.dogudang,
    doasalbarang = EXCLUDED.doasalbarang,
    doasalbarangkategori = EXCLUDED.doasalbarangkategori,
    dojenispenjualan = EXCLUDED.dojenispenjualan,
    dojenispenjualankategori = EXCLUDED.dojenispenjualankategori,
    docarabayar = EXCLUDED.docarabayar,
    dosumber = EXCLUDED.dosumber,
    doautonotransaksi = EXCLUDED.doautonotransaksi,
    donotransaksi = EXCLUDED.donotransaksi,
    dotgl = EXCLUDED.dotgl,
    dokodepa = EXCLUDED.dokodepa,
    docustomer = EXCLUDED.docustomer,
    docustomerkontak = EXCLUDED.docustomerkontak,
    do1alamat1 = EXCLUDED.do1alamat1,
    do1alamat2 = EXCLUDED.do1alamat2,
    do1alamat3 = EXCLUDED.do1alamat3,
    do2alamat1 = EXCLUDED.do2alamat1,
    do2alamat2 = EXCLUDED.do2alamat2,
    do2alamat3 = EXCLUDED.do2alamat3,
    dobagianpenjualan = EXCLUDED.dobagianpenjualan,
    dobagianpengiriman = EXCLUDED.dobagianpengiriman,
    doekspedisi = EXCLUDED.doekspedisi,
    dotglkirim = EXCLUDED.dotglkirim,
    dotermin = EXCLUDED.dotermin,
    dotgljatuhtempo = EXCLUDED.dotgljatuhtempo,
    douraian = EXCLUDED.douraian,
    docatatan = EXCLUDED.docatatan,
    donoref = EXCLUDED.donoref,
    dotglnoref = EXCLUDED.dotglnoref,
    dotglpenutupan = EXCLUDED.dotglpenutupan,
    domatauang = EXCLUDED.domatauang,
    dokurs = EXCLUDED.dokurs,
    dohargatermasukpajak = EXCLUDED.dohargatermasukpajak,
    dototal = EXCLUDED.dototal,
    dodiskonpersen = EXCLUDED.dodiskonpersen,
    dojmldiskon = EXCLUDED.dojmldiskon,
    dototalpajak1detail = EXCLUDED.dototalpajak1detail,
    dototalpajak2detail = EXCLUDED.dototalpajak2detail,
    dobiayalainpersen = EXCLUDED.dobiayalainpersen,
    dobiayalain = EXCLUDED.dobiayalain,
    dototaltransaksi = EXCLUDED.dototaltransaksi,
    dorekdiskon = EXCLUDED.dorekdiskon,
    dorekpajak1 = EXCLUDED.dorekpajak1,
    dorekpajak2 = EXCLUDED.dorekpajak2,
    dorekbiayalain = EXCLUDED.dorekbiayalain,
    doidsq = EXCLUDED.doidsq,
    doidso = EXCLUDED.doidso,
    doidpi = EXCLUDED.doidpi,
    doidpl = EXCLUDED.doidpl,
    dostatusdr = EXCLUDED.dostatusdr,
    dostatussi = EXCLUDED.dostatussi,
    dostatusrnr = EXCLUDED.dostatusrnr,
    dostatussr = EXCLUDED.dostatussr,
    dostatusrealisasi = EXCLUDED.dostatusrealisasi,
    dostatus = EXCLUDED.dostatus,
    dostatussebelumnya = EXCLUDED.dostatussebelumnya,
    dojmlrevisi = EXCLUDED.dojmlrevisi,
    docetakanke = EXCLUDED.docetakanke,
    doposting = EXCLUDED.doposting,
    dopostingtgl = EXCLUDED.dopostingtgl,
    dotutupperiode = EXCLUDED.dotutupperiode,
    doisclose = EXCLUDED.doisclose,
    domodifikasiuser = EXCLUDED.domodifikasiuser,
    domodifikasitgl = EXCLUDED.domodifikasitgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m5_do_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m5_do_detail'
)
INSERT INTO m5_do_detail (
    iddodetail, iddo, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, idhppkhususmasuk, idhppfifomasuk, harga, hpp, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudangasal, gudangtransit, gudangtujuan, rekpersediaan, rekhargapokok, rekdiskonpenjualan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idsqdetail, idsodetail, idpidetail, idpldetail, jmldr, statusdr, jmlsi, statussi, jmlrnr, statusrnr, jmlsr, statussr, jmlrealisasi, statusrealisasi, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    iddodetail, iddo, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, idhppkhususmasuk, idhppfifomasuk, harga, hpp, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudangasal, gudangtransit, gudangtujuan, rekpersediaan, rekhargapokok, rekdiskonpenjualan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idsqdetail, idsodetail, idpidetail, idpldetail, jmldr, statusdr, jmlsi, statussi, jmlrnr, statusrnr, jmlsr, statussr, jmlrealisasi, statusrealisasi, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'iddodetail', '')::bigint AS iddodetail,
        NULLIF(row_payload ->> 'iddo', '')::bigint AS iddo,
        NULLIF(row_payload ->> 'idbarang', '')::bigint AS idbarang,
        row_payload ->> 'namabarang' AS namabarang,
        row_payload ->> 'tipebarang' AS tipebarang,
        NULLIF(row_payload ->> 'jml', '')::numeric(20,6) AS jml,
        row_payload ->> 'satuan' AS satuan,
        NULLIF(row_payload ->> 'nilaisatuan', '')::numeric(20,6) AS nilaisatuan,
        NULLIF(row_payload ->> 'jmlbarang', '')::numeric(20,6) AS jmlbarang,
        row_payload ->> 'satuanbarang' AS satuanbarang,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        NULLIF(row_payload ->> 'idhppkhususmasuk', '')::bigint AS idhppkhususmasuk,
        NULLIF(row_payload ->> 'idhppfifomasuk', '')::bigint AS idhppfifomasuk,
        NULLIF(row_payload ->> 'harga', '')::numeric(20,6) AS harga,
        row_payload ->> 'hpp' AS hpp,
        NULLIF(row_payload ->> 'diskon', '')::numeric(20,6) AS diskon,
        NULLIF(row_payload ->> 'jmldiskon', '')::numeric(20,6) AS jmldiskon,
        NULLIF(row_payload ->> 'pajak1', '')::numeric(20,6) AS pajak1,
        NULLIF(row_payload ->> 'jmlpajak1', '')::numeric(20,6) AS jmlpajak1,
        NULLIF(row_payload ->> 'pajak2', '')::numeric(20,6) AS pajak2,
        NULLIF(row_payload ->> 'jmlpajak2', '')::numeric(20,6) AS jmlpajak2,
        row_payload ->> 'cabang' AS cabang,
        row_payload ->> 'lokasi' AS lokasi,
        row_payload ->> 'gudangasal' AS gudangasal,
        row_payload ->> 'gudangtransit' AS gudangtransit,
        row_payload ->> 'gudangtujuan' AS gudangtujuan,
        row_payload ->> 'rekpersediaan' AS rekpersediaan,
        NULLIF(row_payload ->> 'rekhargapokok', '')::numeric(20,6) AS rekhargapokok,
        NULLIF(row_payload ->> 'rekdiskonpenjualan', '')::numeric(20,6) AS rekdiskonpenjualan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'idsqdetail', '')::bigint AS idsqdetail,
        NULLIF(row_payload ->> 'idsodetail', '')::bigint AS idsodetail,
        NULLIF(row_payload ->> 'idpidetail', '')::bigint AS idpidetail,
        NULLIF(row_payload ->> 'idpldetail', '')::bigint AS idpldetail,
        NULLIF(row_payload ->> 'jmldr', '')::numeric(20,6) AS jmldr,
        NULLIF(row_payload ->> 'statusdr', '')::bigint AS statusdr,
        NULLIF(row_payload ->> 'jmlsi', '')::numeric(20,6) AS jmlsi,
        NULLIF(row_payload ->> 'statussi', '')::bigint AS statussi,
        NULLIF(row_payload ->> 'jmlrnr', '')::numeric(20,6) AS jmlrnr,
        NULLIF(row_payload ->> 'statusrnr', '')::bigint AS statusrnr,
        NULLIF(row_payload ->> 'jmlsr', '')::numeric(20,6) AS jmlsr,
        NULLIF(row_payload ->> 'statussr', '')::bigint AS statussr,
        NULLIF(row_payload ->> 'jmlrealisasi', '')::numeric(20,6) AS jmlrealisasi,
        NULLIF(row_payload ->> 'statusrealisasi', '')::bigint AS statusrealisasi,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'iddodetail') IS NOT NULL
) AS prepared
ON CONFLICT (iddodetail) DO UPDATE
SET
    iddo = EXCLUDED.iddo,
    idbarang = EXCLUDED.idbarang,
    namabarang = EXCLUDED.namabarang,
    tipebarang = EXCLUDED.tipebarang,
    jml = EXCLUDED.jml,
    satuan = EXCLUDED.satuan,
    nilaisatuan = EXCLUDED.nilaisatuan,
    jmlbarang = EXCLUDED.jmlbarang,
    satuanbarang = EXCLUDED.satuanbarang,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    idhppkhususmasuk = EXCLUDED.idhppkhususmasuk,
    idhppfifomasuk = EXCLUDED.idhppfifomasuk,
    harga = EXCLUDED.harga,
    hpp = EXCLUDED.hpp,
    diskon = EXCLUDED.diskon,
    jmldiskon = EXCLUDED.jmldiskon,
    pajak1 = EXCLUDED.pajak1,
    jmlpajak1 = EXCLUDED.jmlpajak1,
    pajak2 = EXCLUDED.pajak2,
    jmlpajak2 = EXCLUDED.jmlpajak2,
    cabang = EXCLUDED.cabang,
    lokasi = EXCLUDED.lokasi,
    gudangasal = EXCLUDED.gudangasal,
    gudangtransit = EXCLUDED.gudangtransit,
    gudangtujuan = EXCLUDED.gudangtujuan,
    rekpersediaan = EXCLUDED.rekpersediaan,
    rekhargapokok = EXCLUDED.rekhargapokok,
    rekdiskonpenjualan = EXCLUDED.rekdiskonpenjualan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    idsqdetail = EXCLUDED.idsqdetail,
    idsodetail = EXCLUDED.idsodetail,
    idpidetail = EXCLUDED.idpidetail,
    idpldetail = EXCLUDED.idpldetail,
    jmldr = EXCLUDED.jmldr,
    statusdr = EXCLUDED.statusdr,
    jmlsi = EXCLUDED.jmlsi,
    statussi = EXCLUDED.statussi,
    jmlrnr = EXCLUDED.jmlrnr,
    statusrnr = EXCLUDED.statusrnr,
    jmlsr = EXCLUDED.jmlsr,
    statussr = EXCLUDED.statussr,
    jmlrealisasi = EXCLUDED.jmlrealisasi,
    statusrealisasi = EXCLUDED.statusrealisasi,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m5_dr
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m5_dr'
)
INSERT INTO m5_dr (
    drid, drcabang, drlokasi, drgudang, drasalbarang, drasalbarangkategori, drjenispenjualan, drjenispenjualankategori, drcarabayar, drsumber, drautonotransaksi, drnotransaksi, drtgl, drkodepa, drcustomer, drcustomerkontak, dr1alamat1, dr1alamat2, dr1alamat3, dr2alamat1, dr2alamat2, dr2alamat3, drbagianpenjualan, drbagianpengiriman, drekspedisi, drtglkirim, drtermin, drtgljatuhtempo, druraian, drcatatan, drnoref, drtglnoref, drtglpenutupan, drmatauang, drkurs, drhargatermasukpajak, drtotal, drdiskonpersen, drjmldiskon, drtotalpajak1detail, drtotalpajak2detail, drbiayalainpersen, drbiayalain, drtotaltransaksi, drrekdiskon, drrekpajak1, drrekpajak2, drrekbiayalain, dridsq, dridso, dridpi, dridpl, driddo, drstatussi, drstatusrnr, drstatussr, drstatusrealisasi, drstatus, drstatussebelumnya, drjmlrevisi, drcetakanke, drposting, drpostingtgl, drtutupperiode, drisclose, drinputtgl, drmodifikasiuser, drmodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    drid, drcabang, drlokasi, drgudang, drasalbarang, drasalbarangkategori, drjenispenjualan, drjenispenjualankategori, drcarabayar, drsumber, drautonotransaksi, drnotransaksi, drtgl, drkodepa, drcustomer, drcustomerkontak, dr1alamat1, dr1alamat2, dr1alamat3, dr2alamat1, dr2alamat2, dr2alamat3, drbagianpenjualan, drbagianpengiriman, drekspedisi, drtglkirim, drtermin, drtgljatuhtempo, druraian, drcatatan, drnoref, drtglnoref, drtglpenutupan, drmatauang, drkurs, drhargatermasukpajak, drtotal, drdiskonpersen, drjmldiskon, drtotalpajak1detail, drtotalpajak2detail, drbiayalainpersen, drbiayalain, drtotaltransaksi, drrekdiskon, drrekpajak1, drrekpajak2, drrekbiayalain, dridsq, dridso, dridpi, dridpl, driddo, drstatussi, drstatusrnr, drstatussr, drstatusrealisasi, drstatus, drstatussebelumnya, drjmlrevisi, drcetakanke, drposting, drpostingtgl, drtutupperiode, drisclose, drinputtgl, drmodifikasiuser, drmodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'drid', '')::bigint AS drid,
        row_payload ->> 'drcabang' AS drcabang,
        row_payload ->> 'drlokasi' AS drlokasi,
        row_payload ->> 'drgudang' AS drgudang,
        row_payload ->> 'drasalbarang' AS drasalbarang,
        row_payload ->> 'drasalbarangkategori' AS drasalbarangkategori,
        row_payload ->> 'drjenispenjualan' AS drjenispenjualan,
        row_payload ->> 'drjenispenjualankategori' AS drjenispenjualankategori,
        row_payload ->> 'drcarabayar' AS drcarabayar,
        row_payload ->> 'drsumber' AS drsumber,
        row_payload ->> 'drautonotransaksi' AS drautonotransaksi,
        row_payload ->> 'drnotransaksi' AS drnotransaksi,
        NULLIF(row_payload ->> 'drtgl', '')::timestamptz AS drtgl,
        row_payload ->> 'drkodepa' AS drkodepa,
        row_payload ->> 'drcustomer' AS drcustomer,
        row_payload ->> 'drcustomerkontak' AS drcustomerkontak,
        row_payload ->> 'dr1alamat1' AS dr1alamat1,
        row_payload ->> 'dr1alamat2' AS dr1alamat2,
        row_payload ->> 'dr1alamat3' AS dr1alamat3,
        row_payload ->> 'dr2alamat1' AS dr2alamat1,
        row_payload ->> 'dr2alamat2' AS dr2alamat2,
        row_payload ->> 'dr2alamat3' AS dr2alamat3,
        row_payload ->> 'drbagianpenjualan' AS drbagianpenjualan,
        row_payload ->> 'drbagianpengiriman' AS drbagianpengiriman,
        row_payload ->> 'drekspedisi' AS drekspedisi,
        NULLIF(row_payload ->> 'drtglkirim', '')::timestamptz AS drtglkirim,
        row_payload ->> 'drtermin' AS drtermin,
        NULLIF(row_payload ->> 'drtgljatuhtempo', '')::timestamptz AS drtgljatuhtempo,
        row_payload ->> 'druraian' AS druraian,
        row_payload ->> 'drcatatan' AS drcatatan,
        row_payload ->> 'drnoref' AS drnoref,
        NULLIF(row_payload ->> 'drtglnoref', '')::timestamptz AS drtglnoref,
        NULLIF(row_payload ->> 'drtglpenutupan', '')::timestamptz AS drtglpenutupan,
        row_payload ->> 'drmatauang' AS drmatauang,
        NULLIF(row_payload ->> 'drkurs', '')::numeric(20,6) AS drkurs,
        NULLIF(row_payload ->> 'drhargatermasukpajak', '')::numeric(20,6) AS drhargatermasukpajak,
        NULLIF(row_payload ->> 'drtotal', '')::numeric(20,6) AS drtotal,
        NULLIF(row_payload ->> 'drdiskonpersen', '')::numeric(20,6) AS drdiskonpersen,
        NULLIF(row_payload ->> 'drjmldiskon', '')::numeric(20,6) AS drjmldiskon,
        NULLIF(row_payload ->> 'drtotalpajak1detail', '')::numeric(20,6) AS drtotalpajak1detail,
        NULLIF(row_payload ->> 'drtotalpajak2detail', '')::numeric(20,6) AS drtotalpajak2detail,
        NULLIF(row_payload ->> 'drbiayalainpersen', '')::numeric(20,6) AS drbiayalainpersen,
        row_payload ->> 'drbiayalain' AS drbiayalain,
        NULLIF(row_payload ->> 'drtotaltransaksi', '')::numeric(20,6) AS drtotaltransaksi,
        NULLIF(row_payload ->> 'drrekdiskon', '')::numeric(20,6) AS drrekdiskon,
        NULLIF(row_payload ->> 'drrekpajak1', '')::numeric(20,6) AS drrekpajak1,
        NULLIF(row_payload ->> 'drrekpajak2', '')::numeric(20,6) AS drrekpajak2,
        row_payload ->> 'drrekbiayalain' AS drrekbiayalain,
        NULLIF(row_payload ->> 'dridsq', '')::bigint AS dridsq,
        NULLIF(row_payload ->> 'dridso', '')::bigint AS dridso,
        NULLIF(row_payload ->> 'dridpi', '')::bigint AS dridpi,
        NULLIF(row_payload ->> 'dridpl', '')::bigint AS dridpl,
        NULLIF(row_payload ->> 'driddo', '')::bigint AS driddo,
        row_payload ->> 'drstatussi' AS drstatussi,
        row_payload ->> 'drstatusrnr' AS drstatusrnr,
        row_payload ->> 'drstatussr' AS drstatussr,
        row_payload ->> 'drstatusrealisasi' AS drstatusrealisasi,
        row_payload ->> 'drstatus' AS drstatus,
        row_payload ->> 'drstatussebelumnya' AS drstatussebelumnya,
        NULLIF(row_payload ->> 'drjmlrevisi', '')::numeric(20,6) AS drjmlrevisi,
        row_payload ->> 'drcetakanke' AS drcetakanke,
        NULLIF(row_payload ->> 'drposting', '')::bigint AS drposting,
        NULLIF(row_payload ->> 'drpostingtgl', '')::timestamptz AS drpostingtgl,
        row_payload ->> 'drtutupperiode' AS drtutupperiode,
        NULLIF(row_payload ->> 'drisclose', '')::bigint AS drisclose,
        NULLIF(row_payload ->> 'drinputtgl', '')::timestamptz AS drinputtgl,
        row_payload ->> 'drmodifikasiuser' AS drmodifikasiuser,
        NULLIF(row_payload ->> 'drmodifikasitgl', '')::timestamptz AS drmodifikasitgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'drid') IS NOT NULL
) AS prepared
ON CONFLICT (drid) DO UPDATE
SET
    drcabang = EXCLUDED.drcabang,
    drlokasi = EXCLUDED.drlokasi,
    drgudang = EXCLUDED.drgudang,
    drasalbarang = EXCLUDED.drasalbarang,
    drasalbarangkategori = EXCLUDED.drasalbarangkategori,
    drjenispenjualan = EXCLUDED.drjenispenjualan,
    drjenispenjualankategori = EXCLUDED.drjenispenjualankategori,
    drcarabayar = EXCLUDED.drcarabayar,
    drsumber = EXCLUDED.drsumber,
    drautonotransaksi = EXCLUDED.drautonotransaksi,
    drnotransaksi = EXCLUDED.drnotransaksi,
    drtgl = EXCLUDED.drtgl,
    drkodepa = EXCLUDED.drkodepa,
    drcustomer = EXCLUDED.drcustomer,
    drcustomerkontak = EXCLUDED.drcustomerkontak,
    dr1alamat1 = EXCLUDED.dr1alamat1,
    dr1alamat2 = EXCLUDED.dr1alamat2,
    dr1alamat3 = EXCLUDED.dr1alamat3,
    dr2alamat1 = EXCLUDED.dr2alamat1,
    dr2alamat2 = EXCLUDED.dr2alamat2,
    dr2alamat3 = EXCLUDED.dr2alamat3,
    drbagianpenjualan = EXCLUDED.drbagianpenjualan,
    drbagianpengiriman = EXCLUDED.drbagianpengiriman,
    drekspedisi = EXCLUDED.drekspedisi,
    drtglkirim = EXCLUDED.drtglkirim,
    drtermin = EXCLUDED.drtermin,
    drtgljatuhtempo = EXCLUDED.drtgljatuhtempo,
    druraian = EXCLUDED.druraian,
    drcatatan = EXCLUDED.drcatatan,
    drnoref = EXCLUDED.drnoref,
    drtglnoref = EXCLUDED.drtglnoref,
    drtglpenutupan = EXCLUDED.drtglpenutupan,
    drmatauang = EXCLUDED.drmatauang,
    drkurs = EXCLUDED.drkurs,
    drhargatermasukpajak = EXCLUDED.drhargatermasukpajak,
    drtotal = EXCLUDED.drtotal,
    drdiskonpersen = EXCLUDED.drdiskonpersen,
    drjmldiskon = EXCLUDED.drjmldiskon,
    drtotalpajak1detail = EXCLUDED.drtotalpajak1detail,
    drtotalpajak2detail = EXCLUDED.drtotalpajak2detail,
    drbiayalainpersen = EXCLUDED.drbiayalainpersen,
    drbiayalain = EXCLUDED.drbiayalain,
    drtotaltransaksi = EXCLUDED.drtotaltransaksi,
    drrekdiskon = EXCLUDED.drrekdiskon,
    drrekpajak1 = EXCLUDED.drrekpajak1,
    drrekpajak2 = EXCLUDED.drrekpajak2,
    drrekbiayalain = EXCLUDED.drrekbiayalain,
    dridsq = EXCLUDED.dridsq,
    dridso = EXCLUDED.dridso,
    dridpi = EXCLUDED.dridpi,
    dridpl = EXCLUDED.dridpl,
    driddo = EXCLUDED.driddo,
    drstatussi = EXCLUDED.drstatussi,
    drstatusrnr = EXCLUDED.drstatusrnr,
    drstatussr = EXCLUDED.drstatussr,
    drstatusrealisasi = EXCLUDED.drstatusrealisasi,
    drstatus = EXCLUDED.drstatus,
    drstatussebelumnya = EXCLUDED.drstatussebelumnya,
    drjmlrevisi = EXCLUDED.drjmlrevisi,
    drcetakanke = EXCLUDED.drcetakanke,
    drposting = EXCLUDED.drposting,
    drpostingtgl = EXCLUDED.drpostingtgl,
    drtutupperiode = EXCLUDED.drtutupperiode,
    drisclose = EXCLUDED.drisclose,
    drinputtgl = EXCLUDED.drinputtgl,
    drmodifikasiuser = EXCLUDED.drmodifikasiuser,
    drmodifikasitgl = EXCLUDED.drmodifikasitgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m5_dr_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m5_dr_detail'
)
INSERT INTO m5_dr_detail (
    iddrdetail, iddr, idbarang, namabarang, tipebarang, jml, jmlkembali, satuan, nilaisatuan, jmlbarang, jmlbarangkembali, satuanbarang, matauang, kurs, idhppkhususmasuk, idhppfifomasuk, harga, hpp, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudangasal, gudangtransit, gudangtujuan, gudangkembali, rekpersediaan, rekhargapokok, rekdiskonpenjualan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idsqdetail, idsodetail, idpidetail, idpldetail, iddodetail, jmlsi, statussi, jmlrnr, statusrnr, jmlsr, statussr, jmlrealisasi, statusrealisasi, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    iddrdetail, iddr, idbarang, namabarang, tipebarang, jml, jmlkembali, satuan, nilaisatuan, jmlbarang, jmlbarangkembali, satuanbarang, matauang, kurs, idhppkhususmasuk, idhppfifomasuk, harga, hpp, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudangasal, gudangtransit, gudangtujuan, gudangkembali, rekpersediaan, rekhargapokok, rekdiskonpenjualan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idsqdetail, idsodetail, idpidetail, idpldetail, iddodetail, jmlsi, statussi, jmlrnr, statusrnr, jmlsr, statussr, jmlrealisasi, statusrealisasi, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'iddrdetail', '')::bigint AS iddrdetail,
        NULLIF(row_payload ->> 'iddr', '')::bigint AS iddr,
        NULLIF(row_payload ->> 'idbarang', '')::bigint AS idbarang,
        row_payload ->> 'namabarang' AS namabarang,
        row_payload ->> 'tipebarang' AS tipebarang,
        NULLIF(row_payload ->> 'jml', '')::numeric(20,6) AS jml,
        NULLIF(row_payload ->> 'jmlkembali', '')::numeric(20,6) AS jmlkembali,
        row_payload ->> 'satuan' AS satuan,
        NULLIF(row_payload ->> 'nilaisatuan', '')::numeric(20,6) AS nilaisatuan,
        NULLIF(row_payload ->> 'jmlbarang', '')::numeric(20,6) AS jmlbarang,
        NULLIF(row_payload ->> 'jmlbarangkembali', '')::numeric(20,6) AS jmlbarangkembali,
        row_payload ->> 'satuanbarang' AS satuanbarang,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        NULLIF(row_payload ->> 'idhppkhususmasuk', '')::bigint AS idhppkhususmasuk,
        NULLIF(row_payload ->> 'idhppfifomasuk', '')::bigint AS idhppfifomasuk,
        NULLIF(row_payload ->> 'harga', '')::numeric(20,6) AS harga,
        row_payload ->> 'hpp' AS hpp,
        NULLIF(row_payload ->> 'diskon', '')::numeric(20,6) AS diskon,
        NULLIF(row_payload ->> 'jmldiskon', '')::numeric(20,6) AS jmldiskon,
        NULLIF(row_payload ->> 'pajak1', '')::numeric(20,6) AS pajak1,
        NULLIF(row_payload ->> 'jmlpajak1', '')::numeric(20,6) AS jmlpajak1,
        NULLIF(row_payload ->> 'pajak2', '')::numeric(20,6) AS pajak2,
        NULLIF(row_payload ->> 'jmlpajak2', '')::numeric(20,6) AS jmlpajak2,
        row_payload ->> 'cabang' AS cabang,
        row_payload ->> 'lokasi' AS lokasi,
        row_payload ->> 'gudangasal' AS gudangasal,
        row_payload ->> 'gudangtransit' AS gudangtransit,
        row_payload ->> 'gudangtujuan' AS gudangtujuan,
        row_payload ->> 'gudangkembali' AS gudangkembali,
        row_payload ->> 'rekpersediaan' AS rekpersediaan,
        NULLIF(row_payload ->> 'rekhargapokok', '')::numeric(20,6) AS rekhargapokok,
        NULLIF(row_payload ->> 'rekdiskonpenjualan', '')::numeric(20,6) AS rekdiskonpenjualan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'idsqdetail', '')::bigint AS idsqdetail,
        NULLIF(row_payload ->> 'idsodetail', '')::bigint AS idsodetail,
        NULLIF(row_payload ->> 'idpidetail', '')::bigint AS idpidetail,
        NULLIF(row_payload ->> 'idpldetail', '')::bigint AS idpldetail,
        NULLIF(row_payload ->> 'iddodetail', '')::bigint AS iddodetail,
        NULLIF(row_payload ->> 'jmlsi', '')::numeric(20,6) AS jmlsi,
        NULLIF(row_payload ->> 'statussi', '')::bigint AS statussi,
        NULLIF(row_payload ->> 'jmlrnr', '')::numeric(20,6) AS jmlrnr,
        NULLIF(row_payload ->> 'statusrnr', '')::bigint AS statusrnr,
        NULLIF(row_payload ->> 'jmlsr', '')::numeric(20,6) AS jmlsr,
        NULLIF(row_payload ->> 'statussr', '')::bigint AS statussr,
        NULLIF(row_payload ->> 'jmlrealisasi', '')::numeric(20,6) AS jmlrealisasi,
        NULLIF(row_payload ->> 'statusrealisasi', '')::bigint AS statusrealisasi,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'iddrdetail') IS NOT NULL
) AS prepared
ON CONFLICT (iddrdetail) DO UPDATE
SET
    iddr = EXCLUDED.iddr,
    idbarang = EXCLUDED.idbarang,
    namabarang = EXCLUDED.namabarang,
    tipebarang = EXCLUDED.tipebarang,
    jml = EXCLUDED.jml,
    jmlkembali = EXCLUDED.jmlkembali,
    satuan = EXCLUDED.satuan,
    nilaisatuan = EXCLUDED.nilaisatuan,
    jmlbarang = EXCLUDED.jmlbarang,
    jmlbarangkembali = EXCLUDED.jmlbarangkembali,
    satuanbarang = EXCLUDED.satuanbarang,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    idhppkhususmasuk = EXCLUDED.idhppkhususmasuk,
    idhppfifomasuk = EXCLUDED.idhppfifomasuk,
    harga = EXCLUDED.harga,
    hpp = EXCLUDED.hpp,
    diskon = EXCLUDED.diskon,
    jmldiskon = EXCLUDED.jmldiskon,
    pajak1 = EXCLUDED.pajak1,
    jmlpajak1 = EXCLUDED.jmlpajak1,
    pajak2 = EXCLUDED.pajak2,
    jmlpajak2 = EXCLUDED.jmlpajak2,
    cabang = EXCLUDED.cabang,
    lokasi = EXCLUDED.lokasi,
    gudangasal = EXCLUDED.gudangasal,
    gudangtransit = EXCLUDED.gudangtransit,
    gudangtujuan = EXCLUDED.gudangtujuan,
    gudangkembali = EXCLUDED.gudangkembali,
    rekpersediaan = EXCLUDED.rekpersediaan,
    rekhargapokok = EXCLUDED.rekhargapokok,
    rekdiskonpenjualan = EXCLUDED.rekdiskonpenjualan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    idsqdetail = EXCLUDED.idsqdetail,
    idsodetail = EXCLUDED.idsodetail,
    idpidetail = EXCLUDED.idpidetail,
    idpldetail = EXCLUDED.idpldetail,
    iddodetail = EXCLUDED.iddodetail,
    jmlsi = EXCLUDED.jmlsi,
    statussi = EXCLUDED.statussi,
    jmlrnr = EXCLUDED.jmlrnr,
    statusrnr = EXCLUDED.statusrnr,
    jmlsr = EXCLUDED.jmlsr,
    statussr = EXCLUDED.statussr,
    jmlrealisasi = EXCLUDED.jmlrealisasi,
    statusrealisasi = EXCLUDED.statusrealisasi,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m5_ic
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m5_ic'
)
INSERT INTO m5_ic (
    icid, iccabang, iclokasi, icgudang, icsumber, icautonotransaksi, icnotransaksi, ictgl, ickodepa, iccustomer, iccustomerkontak, ic1alamat1, ic1alamat2, ic1alamat3, ic2alamat1, ic2alamat2, ic2alamat3, icbagianpenjualan, icbagianpenagihan, icuraian, iccatatan, icnoref, ictglnoref, iccarabayar, ictglbayar, icmatauang, ickurs, ictotalap, ictotalapvalas, ictotalar, ictotalarvalas, icjmltagih, icjmltagihvalas, icbayar, icbayarvalas, icselisihkurs, icrekselisihkurs, icdiskontermin, icdiskonterminvalas, icrekdiskontermin, icstatuspv, icstatus, icstatussebelumnya, icjmlrevisi, iccetakanke, icposting, icpostingtgl, icisclose, icmodifikasiuser, icmodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    icid, iccabang, iclokasi, icgudang, icsumber, icautonotransaksi, icnotransaksi, ictgl, ickodepa, iccustomer, iccustomerkontak, ic1alamat1, ic1alamat2, ic1alamat3, ic2alamat1, ic2alamat2, ic2alamat3, icbagianpenjualan, icbagianpenagihan, icuraian, iccatatan, icnoref, ictglnoref, iccarabayar, ictglbayar, icmatauang, ickurs, ictotalap, ictotalapvalas, ictotalar, ictotalarvalas, icjmltagih, icjmltagihvalas, icbayar, icbayarvalas, icselisihkurs, icrekselisihkurs, icdiskontermin, icdiskonterminvalas, icrekdiskontermin, icstatuspv, icstatus, icstatussebelumnya, icjmlrevisi, iccetakanke, icposting, icpostingtgl, icisclose, icmodifikasiuser, icmodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'icid', '')::bigint AS icid,
        row_payload ->> 'iccabang' AS iccabang,
        row_payload ->> 'iclokasi' AS iclokasi,
        row_payload ->> 'icgudang' AS icgudang,
        row_payload ->> 'icsumber' AS icsumber,
        row_payload ->> 'icautonotransaksi' AS icautonotransaksi,
        row_payload ->> 'icnotransaksi' AS icnotransaksi,
        NULLIF(row_payload ->> 'ictgl', '')::timestamptz AS ictgl,
        row_payload ->> 'ickodepa' AS ickodepa,
        NULLIF(row_payload ->> 'iccustomer', '')::bigint AS iccustomer,
        NULLIF(row_payload ->> 'iccustomerkontak', '')::bigint AS iccustomerkontak,
        row_payload ->> 'ic1alamat1' AS ic1alamat1,
        row_payload ->> 'ic1alamat2' AS ic1alamat2,
        row_payload ->> 'ic1alamat3' AS ic1alamat3,
        row_payload ->> 'ic2alamat1' AS ic2alamat1,
        row_payload ->> 'ic2alamat2' AS ic2alamat2,
        row_payload ->> 'ic2alamat3' AS ic2alamat3,
        NULLIF(row_payload ->> 'icbagianpenjualan', '')::bigint AS icbagianpenjualan,
        NULLIF(row_payload ->> 'icbagianpenagihan', '')::bigint AS icbagianpenagihan,
        row_payload ->> 'icuraian' AS icuraian,
        row_payload ->> 'iccatatan' AS iccatatan,
        row_payload ->> 'icnoref' AS icnoref,
        NULLIF(row_payload ->> 'ictglnoref', '')::timestamptz AS ictglnoref,
        NULLIF(row_payload ->> 'iccarabayar', '')::bigint AS iccarabayar,
        NULLIF(row_payload ->> 'ictglbayar', '')::timestamptz AS ictglbayar,
        row_payload ->> 'icmatauang' AS icmatauang,
        NULLIF(row_payload ->> 'ickurs', '')::numeric(20,6) AS ickurs,
        NULLIF(row_payload ->> 'ictotalap', '')::numeric(20,6) AS ictotalap,
        NULLIF(row_payload ->> 'ictotalapvalas', '')::numeric(20,6) AS ictotalapvalas,
        NULLIF(row_payload ->> 'ictotalar', '')::numeric(20,6) AS ictotalar,
        NULLIF(row_payload ->> 'ictotalarvalas', '')::numeric(20,6) AS ictotalarvalas,
        NULLIF(row_payload ->> 'icjmltagih', '')::numeric(20,6) AS icjmltagih,
        NULLIF(row_payload ->> 'icjmltagihvalas', '')::numeric(20,6) AS icjmltagihvalas,
        row_payload ->> 'icbayar' AS icbayar,
        row_payload ->> 'icbayarvalas' AS icbayarvalas,
        NULLIF(row_payload ->> 'icselisihkurs', '')::numeric(20,6) AS icselisihkurs,
        NULLIF(row_payload ->> 'icrekselisihkurs', '')::numeric(20,6) AS icrekselisihkurs,
        NULLIF(row_payload ->> 'icdiskontermin', '')::numeric(20,6) AS icdiskontermin,
        NULLIF(row_payload ->> 'icdiskonterminvalas', '')::numeric(20,6) AS icdiskonterminvalas,
        NULLIF(row_payload ->> 'icrekdiskontermin', '')::numeric(20,6) AS icrekdiskontermin,
        NULLIF(row_payload ->> 'icstatuspv', '')::bigint AS icstatuspv,
        NULLIF(row_payload ->> 'icstatus', '')::bigint AS icstatus,
        NULLIF(row_payload ->> 'icstatussebelumnya', '')::bigint AS icstatussebelumnya,
        NULLIF(row_payload ->> 'icjmlrevisi', '')::bigint AS icjmlrevisi,
        NULLIF(row_payload ->> 'iccetakanke', '')::bigint AS iccetakanke,
        NULLIF(row_payload ->> 'icposting', '')::bigint AS icposting,
        NULLIF(row_payload ->> 'icpostingtgl', '')::timestamptz AS icpostingtgl,
        NULLIF(row_payload ->> 'icisclose', '')::bigint AS icisclose,
        NULLIF(row_payload ->> 'icmodifikasiuser', '')::bigint AS icmodifikasiuser,
        NULLIF(row_payload ->> 'icmodifikasitgl', '')::timestamptz AS icmodifikasitgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'icid') IS NOT NULL
) AS prepared
ON CONFLICT (icid) DO UPDATE
SET
    iccabang = EXCLUDED.iccabang,
    iclokasi = EXCLUDED.iclokasi,
    icgudang = EXCLUDED.icgudang,
    icsumber = EXCLUDED.icsumber,
    icautonotransaksi = EXCLUDED.icautonotransaksi,
    icnotransaksi = EXCLUDED.icnotransaksi,
    ictgl = EXCLUDED.ictgl,
    ickodepa = EXCLUDED.ickodepa,
    iccustomer = EXCLUDED.iccustomer,
    iccustomerkontak = EXCLUDED.iccustomerkontak,
    ic1alamat1 = EXCLUDED.ic1alamat1,
    ic1alamat2 = EXCLUDED.ic1alamat2,
    ic1alamat3 = EXCLUDED.ic1alamat3,
    ic2alamat1 = EXCLUDED.ic2alamat1,
    ic2alamat2 = EXCLUDED.ic2alamat2,
    ic2alamat3 = EXCLUDED.ic2alamat3,
    icbagianpenjualan = EXCLUDED.icbagianpenjualan,
    icbagianpenagihan = EXCLUDED.icbagianpenagihan,
    icuraian = EXCLUDED.icuraian,
    iccatatan = EXCLUDED.iccatatan,
    icnoref = EXCLUDED.icnoref,
    ictglnoref = EXCLUDED.ictglnoref,
    iccarabayar = EXCLUDED.iccarabayar,
    ictglbayar = EXCLUDED.ictglbayar,
    icmatauang = EXCLUDED.icmatauang,
    ickurs = EXCLUDED.ickurs,
    ictotalap = EXCLUDED.ictotalap,
    ictotalapvalas = EXCLUDED.ictotalapvalas,
    ictotalar = EXCLUDED.ictotalar,
    ictotalarvalas = EXCLUDED.ictotalarvalas,
    icjmltagih = EXCLUDED.icjmltagih,
    icjmltagihvalas = EXCLUDED.icjmltagihvalas,
    icbayar = EXCLUDED.icbayar,
    icbayarvalas = EXCLUDED.icbayarvalas,
    icselisihkurs = EXCLUDED.icselisihkurs,
    icrekselisihkurs = EXCLUDED.icrekselisihkurs,
    icdiskontermin = EXCLUDED.icdiskontermin,
    icdiskonterminvalas = EXCLUDED.icdiskonterminvalas,
    icrekdiskontermin = EXCLUDED.icrekdiskontermin,
    icstatuspv = EXCLUDED.icstatuspv,
    icstatus = EXCLUDED.icstatus,
    icstatussebelumnya = EXCLUDED.icstatussebelumnya,
    icjmlrevisi = EXCLUDED.icjmlrevisi,
    iccetakanke = EXCLUDED.iccetakanke,
    icposting = EXCLUDED.icposting,
    icpostingtgl = EXCLUDED.icpostingtgl,
    icisclose = EXCLUDED.icisclose,
    icmodifikasiuser = EXCLUDED.icmodifikasiuser,
    icmodifikasitgl = EXCLUDED.icmodifikasitgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m5_ic_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m5_ic_detail'
)
INSERT INTO m5_ic_detail (
    idicdetail, idic, sumber, idtransaksi, matauang, kurs, totaltransaksi, terbayar, rencana, sisa, jmlbayar, jmlbayarvalas, diskontermin, jmldiskontermin, jmldiskonterminvalas, nogiro, rekhutangpiutang, catatan, costcenter, divisi, subdivisi, proyek, jmlpv, jmlpvvalas, statuspv, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idicdetail, idic, sumber, idtransaksi, matauang, kurs, totaltransaksi, terbayar, rencana, sisa, jmlbayar, jmlbayarvalas, diskontermin, jmldiskontermin, jmldiskonterminvalas, nogiro, rekhutangpiutang, catatan, costcenter, divisi, subdivisi, proyek, jmlpv, jmlpvvalas, statuspv, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idicdetail', '')::bigint AS idicdetail,
        NULLIF(row_payload ->> 'idic', '')::bigint AS idic,
        row_payload ->> 'sumber' AS sumber,
        NULLIF(row_payload ->> 'idtransaksi', '')::bigint AS idtransaksi,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        NULLIF(row_payload ->> 'totaltransaksi', '')::numeric(20,6) AS totaltransaksi,
        row_payload ->> 'terbayar' AS terbayar,
        NULLIF(row_payload ->> 'rencana', '')::timestamptz AS rencana,
        row_payload ->> 'sisa' AS sisa,
        NULLIF(row_payload ->> 'jmlbayar', '')::numeric(20,6) AS jmlbayar,
        NULLIF(row_payload ->> 'jmlbayarvalas', '')::numeric(20,6) AS jmlbayarvalas,
        NULLIF(row_payload ->> 'diskontermin', '')::numeric(20,6) AS diskontermin,
        NULLIF(row_payload ->> 'jmldiskontermin', '')::numeric(20,6) AS jmldiskontermin,
        NULLIF(row_payload ->> 'jmldiskonterminvalas', '')::numeric(20,6) AS jmldiskonterminvalas,
        row_payload ->> 'nogiro' AS nogiro,
        row_payload ->> 'rekhutangpiutang' AS rekhutangpiutang,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        NULLIF(row_payload ->> 'jmlpv', '')::numeric(20,6) AS jmlpv,
        NULLIF(row_payload ->> 'jmlpvvalas', '')::numeric(20,6) AS jmlpvvalas,
        NULLIF(row_payload ->> 'statuspv', '')::bigint AS statuspv,
        NULLIF(row_payload ->> 'urutan', '')::bigint AS urutan,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idicdetail') IS NOT NULL
) AS prepared
ON CONFLICT (idicdetail) DO UPDATE
SET
    idic = EXCLUDED.idic,
    sumber = EXCLUDED.sumber,
    idtransaksi = EXCLUDED.idtransaksi,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    totaltransaksi = EXCLUDED.totaltransaksi,
    terbayar = EXCLUDED.terbayar,
    rencana = EXCLUDED.rencana,
    sisa = EXCLUDED.sisa,
    jmlbayar = EXCLUDED.jmlbayar,
    jmlbayarvalas = EXCLUDED.jmlbayarvalas,
    diskontermin = EXCLUDED.diskontermin,
    jmldiskontermin = EXCLUDED.jmldiskontermin,
    jmldiskonterminvalas = EXCLUDED.jmldiskonterminvalas,
    nogiro = EXCLUDED.nogiro,
    rekhutangpiutang = EXCLUDED.rekhutangpiutang,
    catatan = EXCLUDED.catatan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    jmlpv = EXCLUDED.jmlpv,
    jmlpvvalas = EXCLUDED.jmlpvvalas,
    statuspv = EXCLUDED.statuspv,
    urutan = EXCLUDED.urutan,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m5_pv
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m5_pv'
)
INSERT INTO m5_pv (
    pvid, pvcabang, pvlokasi, pvgudang, pvsumber, pvautonotransaksi, pvnotransaksi, pvtgl, pvkodepa, pvcustomer, pvcustomerkontak, pv1alamat1, pv1alamat2, pv1alamat3, pv2alamat1, pv2alamat2, pv2alamat3, pvbagianpenjualan, pvbagianterima, pvuraian, pvcatatan, pvnoref, pvtglnoref, pvcarabayar, pvtglbayar, pvmatauang, pvkurs, pvtotalap, pvtotalapvalas, pvtotalar, pvtotalarvalas, pvbayar, pvbayarvalas, pvselisihkurs, pvrekselisihkurs, pvdiskontermin, pvdiskonterminvalas, pvrekdiskontermin, pvidic, pvstatus, pvstatussebelumnya, pvjmlrevisi, pvcetakanke, pvposting, pvpostingtgl, pvisclose, pvmodifikasiuser, pvmodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    pvid, pvcabang, pvlokasi, pvgudang, pvsumber, pvautonotransaksi, pvnotransaksi, pvtgl, pvkodepa, pvcustomer, pvcustomerkontak, pv1alamat1, pv1alamat2, pv1alamat3, pv2alamat1, pv2alamat2, pv2alamat3, pvbagianpenjualan, pvbagianterima, pvuraian, pvcatatan, pvnoref, pvtglnoref, pvcarabayar, pvtglbayar, pvmatauang, pvkurs, pvtotalap, pvtotalapvalas, pvtotalar, pvtotalarvalas, pvbayar, pvbayarvalas, pvselisihkurs, pvrekselisihkurs, pvdiskontermin, pvdiskonterminvalas, pvrekdiskontermin, pvidic, pvstatus, pvstatussebelumnya, pvjmlrevisi, pvcetakanke, pvposting, pvpostingtgl, pvisclose, pvmodifikasiuser, pvmodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'pvid', '')::bigint AS pvid,
        row_payload ->> 'pvcabang' AS pvcabang,
        row_payload ->> 'pvlokasi' AS pvlokasi,
        row_payload ->> 'pvgudang' AS pvgudang,
        row_payload ->> 'pvsumber' AS pvsumber,
        row_payload ->> 'pvautonotransaksi' AS pvautonotransaksi,
        row_payload ->> 'pvnotransaksi' AS pvnotransaksi,
        NULLIF(row_payload ->> 'pvtgl', '')::timestamptz AS pvtgl,
        row_payload ->> 'pvkodepa' AS pvkodepa,
        NULLIF(row_payload ->> 'pvcustomer', '')::bigint AS pvcustomer,
        NULLIF(row_payload ->> 'pvcustomerkontak', '')::bigint AS pvcustomerkontak,
        row_payload ->> 'pv1alamat1' AS pv1alamat1,
        row_payload ->> 'pv1alamat2' AS pv1alamat2,
        row_payload ->> 'pv1alamat3' AS pv1alamat3,
        row_payload ->> 'pv2alamat1' AS pv2alamat1,
        row_payload ->> 'pv2alamat2' AS pv2alamat2,
        row_payload ->> 'pv2alamat3' AS pv2alamat3,
        NULLIF(row_payload ->> 'pvbagianpenjualan', '')::bigint AS pvbagianpenjualan,
        NULLIF(row_payload ->> 'pvbagianterima', '')::bigint AS pvbagianterima,
        row_payload ->> 'pvuraian' AS pvuraian,
        row_payload ->> 'pvcatatan' AS pvcatatan,
        row_payload ->> 'pvnoref' AS pvnoref,
        NULLIF(row_payload ->> 'pvtglnoref', '')::timestamptz AS pvtglnoref,
        NULLIF(row_payload ->> 'pvcarabayar', '')::bigint AS pvcarabayar,
        NULLIF(row_payload ->> 'pvtglbayar', '')::timestamptz AS pvtglbayar,
        row_payload ->> 'pvmatauang' AS pvmatauang,
        NULLIF(row_payload ->> 'pvkurs', '')::numeric(20,6) AS pvkurs,
        NULLIF(row_payload ->> 'pvtotalap', '')::numeric(20,6) AS pvtotalap,
        NULLIF(row_payload ->> 'pvtotalapvalas', '')::numeric(20,6) AS pvtotalapvalas,
        NULLIF(row_payload ->> 'pvtotalar', '')::numeric(20,6) AS pvtotalar,
        NULLIF(row_payload ->> 'pvtotalarvalas', '')::numeric(20,6) AS pvtotalarvalas,
        row_payload ->> 'pvbayar' AS pvbayar,
        row_payload ->> 'pvbayarvalas' AS pvbayarvalas,
        NULLIF(row_payload ->> 'pvselisihkurs', '')::numeric(20,6) AS pvselisihkurs,
        NULLIF(row_payload ->> 'pvrekselisihkurs', '')::numeric(20,6) AS pvrekselisihkurs,
        NULLIF(row_payload ->> 'pvdiskontermin', '')::numeric(20,6) AS pvdiskontermin,
        NULLIF(row_payload ->> 'pvdiskonterminvalas', '')::numeric(20,6) AS pvdiskonterminvalas,
        NULLIF(row_payload ->> 'pvrekdiskontermin', '')::numeric(20,6) AS pvrekdiskontermin,
        NULLIF(row_payload ->> 'pvidic', '')::bigint AS pvidic,
        NULLIF(row_payload ->> 'pvstatus', '')::bigint AS pvstatus,
        NULLIF(row_payload ->> 'pvstatussebelumnya', '')::bigint AS pvstatussebelumnya,
        NULLIF(row_payload ->> 'pvjmlrevisi', '')::bigint AS pvjmlrevisi,
        NULLIF(row_payload ->> 'pvcetakanke', '')::bigint AS pvcetakanke,
        NULLIF(row_payload ->> 'pvposting', '')::bigint AS pvposting,
        NULLIF(row_payload ->> 'pvpostingtgl', '')::timestamptz AS pvpostingtgl,
        NULLIF(row_payload ->> 'pvisclose', '')::bigint AS pvisclose,
        NULLIF(row_payload ->> 'pvmodifikasiuser', '')::bigint AS pvmodifikasiuser,
        NULLIF(row_payload ->> 'pvmodifikasitgl', '')::timestamptz AS pvmodifikasitgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'pvid') IS NOT NULL
) AS prepared
ON CONFLICT (pvid) DO UPDATE
SET
    pvcabang = EXCLUDED.pvcabang,
    pvlokasi = EXCLUDED.pvlokasi,
    pvgudang = EXCLUDED.pvgudang,
    pvsumber = EXCLUDED.pvsumber,
    pvautonotransaksi = EXCLUDED.pvautonotransaksi,
    pvnotransaksi = EXCLUDED.pvnotransaksi,
    pvtgl = EXCLUDED.pvtgl,
    pvkodepa = EXCLUDED.pvkodepa,
    pvcustomer = EXCLUDED.pvcustomer,
    pvcustomerkontak = EXCLUDED.pvcustomerkontak,
    pv1alamat1 = EXCLUDED.pv1alamat1,
    pv1alamat2 = EXCLUDED.pv1alamat2,
    pv1alamat3 = EXCLUDED.pv1alamat3,
    pv2alamat1 = EXCLUDED.pv2alamat1,
    pv2alamat2 = EXCLUDED.pv2alamat2,
    pv2alamat3 = EXCLUDED.pv2alamat3,
    pvbagianpenjualan = EXCLUDED.pvbagianpenjualan,
    pvbagianterima = EXCLUDED.pvbagianterima,
    pvuraian = EXCLUDED.pvuraian,
    pvcatatan = EXCLUDED.pvcatatan,
    pvnoref = EXCLUDED.pvnoref,
    pvtglnoref = EXCLUDED.pvtglnoref,
    pvcarabayar = EXCLUDED.pvcarabayar,
    pvtglbayar = EXCLUDED.pvtglbayar,
    pvmatauang = EXCLUDED.pvmatauang,
    pvkurs = EXCLUDED.pvkurs,
    pvtotalap = EXCLUDED.pvtotalap,
    pvtotalapvalas = EXCLUDED.pvtotalapvalas,
    pvtotalar = EXCLUDED.pvtotalar,
    pvtotalarvalas = EXCLUDED.pvtotalarvalas,
    pvbayar = EXCLUDED.pvbayar,
    pvbayarvalas = EXCLUDED.pvbayarvalas,
    pvselisihkurs = EXCLUDED.pvselisihkurs,
    pvrekselisihkurs = EXCLUDED.pvrekselisihkurs,
    pvdiskontermin = EXCLUDED.pvdiskontermin,
    pvdiskonterminvalas = EXCLUDED.pvdiskonterminvalas,
    pvrekdiskontermin = EXCLUDED.pvrekdiskontermin,
    pvidic = EXCLUDED.pvidic,
    pvstatus = EXCLUDED.pvstatus,
    pvstatussebelumnya = EXCLUDED.pvstatussebelumnya,
    pvjmlrevisi = EXCLUDED.pvjmlrevisi,
    pvcetakanke = EXCLUDED.pvcetakanke,
    pvposting = EXCLUDED.pvposting,
    pvpostingtgl = EXCLUDED.pvpostingtgl,
    pvisclose = EXCLUDED.pvisclose,
    pvmodifikasiuser = EXCLUDED.pvmodifikasiuser,
    pvmodifikasitgl = EXCLUDED.pvmodifikasitgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m5_pv_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m5_pv_detail'
)
INSERT INTO m5_pv_detail (
    idpvdetail, idpv, sumber, idtransaksi, matauang, kurs, totaltransaksi, terbayar, rencana, sisa, jmlbayar, jmlbayarvalas, diskontermin, jmldiskontermin, jmldiskonterminvalas, nogiro, rekhutangpiutang, catatan, costcenter, divisi, subdivisi, proyek, idicdetail, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idpvdetail, idpv, sumber, idtransaksi, matauang, kurs, totaltransaksi, terbayar, rencana, sisa, jmlbayar, jmlbayarvalas, diskontermin, jmldiskontermin, jmldiskonterminvalas, nogiro, rekhutangpiutang, catatan, costcenter, divisi, subdivisi, proyek, idicdetail, urutan, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idpvdetail', '')::bigint AS idpvdetail,
        NULLIF(row_payload ->> 'idpv', '')::bigint AS idpv,
        row_payload ->> 'sumber' AS sumber,
        NULLIF(row_payload ->> 'idtransaksi', '')::bigint AS idtransaksi,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        NULLIF(row_payload ->> 'totaltransaksi', '')::numeric(20,6) AS totaltransaksi,
        row_payload ->> 'terbayar' AS terbayar,
        NULLIF(row_payload ->> 'rencana', '')::timestamptz AS rencana,
        row_payload ->> 'sisa' AS sisa,
        NULLIF(row_payload ->> 'jmlbayar', '')::numeric(20,6) AS jmlbayar,
        NULLIF(row_payload ->> 'jmlbayarvalas', '')::numeric(20,6) AS jmlbayarvalas,
        NULLIF(row_payload ->> 'diskontermin', '')::numeric(20,6) AS diskontermin,
        NULLIF(row_payload ->> 'jmldiskontermin', '')::numeric(20,6) AS jmldiskontermin,
        NULLIF(row_payload ->> 'jmldiskonterminvalas', '')::numeric(20,6) AS jmldiskonterminvalas,
        row_payload ->> 'nogiro' AS nogiro,
        row_payload ->> 'rekhutangpiutang' AS rekhutangpiutang,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        NULLIF(row_payload ->> 'idicdetail', '')::bigint AS idicdetail,
        NULLIF(row_payload ->> 'urutan', '')::bigint AS urutan,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idpvdetail') IS NOT NULL
) AS prepared
ON CONFLICT (idpvdetail) DO UPDATE
SET
    idpv = EXCLUDED.idpv,
    sumber = EXCLUDED.sumber,
    idtransaksi = EXCLUDED.idtransaksi,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    totaltransaksi = EXCLUDED.totaltransaksi,
    terbayar = EXCLUDED.terbayar,
    rencana = EXCLUDED.rencana,
    sisa = EXCLUDED.sisa,
    jmlbayar = EXCLUDED.jmlbayar,
    jmlbayarvalas = EXCLUDED.jmlbayarvalas,
    diskontermin = EXCLUDED.diskontermin,
    jmldiskontermin = EXCLUDED.jmldiskontermin,
    jmldiskonterminvalas = EXCLUDED.jmldiskonterminvalas,
    nogiro = EXCLUDED.nogiro,
    rekhutangpiutang = EXCLUDED.rekhutangpiutang,
    catatan = EXCLUDED.catatan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    idicdetail = EXCLUDED.idicdetail,
    urutan = EXCLUDED.urutan,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m5_rp
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m5_rp'
)
INSERT INTO m5_rp (
    rpid, rpcabang, rplokasi, rpjenis, rpsumber, rpautonotransaksi, rpnotransaksi, rptgl, rpkodepa, rpkontak, rpkontakperson, rp1alamat1, rp1alamat2, rp1alamat3, rp2alamat1, rp2alamat2, rp2alamat3, rpbagianterima, rptermin, rptgljatuhtempo, rpidsi, rpnorek, rpuraian, rpcatatan, rpnoref, rptglnoref, rpmatauang, rpkurs, rpjumlah, rpjumlahvalas, rpjumlahbayar, rpjumlahbayarvalas, rpstatusbayar, rptgllunas, rpcostcenter, rpdivisi, rpsubdivisi, rpproyek, rpstatus, rpstatussebelumnya, rpjmlrevisi, rpcetakanke, rpposting, rppostingtgl, rpisclose, rpmodifikasiuser, rpmodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    rpid, rpcabang, rplokasi, rpjenis, rpsumber, rpautonotransaksi, rpnotransaksi, rptgl, rpkodepa, rpkontak, rpkontakperson, rp1alamat1, rp1alamat2, rp1alamat3, rp2alamat1, rp2alamat2, rp2alamat3, rpbagianterima, rptermin, rptgljatuhtempo, rpidsi, rpnorek, rpuraian, rpcatatan, rpnoref, rptglnoref, rpmatauang, rpkurs, rpjumlah, rpjumlahvalas, rpjumlahbayar, rpjumlahbayarvalas, rpstatusbayar, rptgllunas, rpcostcenter, rpdivisi, rpsubdivisi, rpproyek, rpstatus, rpstatussebelumnya, rpjmlrevisi, rpcetakanke, rpposting, rppostingtgl, rpisclose, rpmodifikasiuser, rpmodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'rpid', '')::bigint AS rpid,
        row_payload ->> 'rpcabang' AS rpcabang,
        row_payload ->> 'rplokasi' AS rplokasi,
        row_payload ->> 'rpjenis' AS rpjenis,
        row_payload ->> 'rpsumber' AS rpsumber,
        row_payload ->> 'rpautonotransaksi' AS rpautonotransaksi,
        row_payload ->> 'rpnotransaksi' AS rpnotransaksi,
        NULLIF(row_payload ->> 'rptgl', '')::timestamptz AS rptgl,
        row_payload ->> 'rpkodepa' AS rpkodepa,
        NULLIF(row_payload ->> 'rpkontak', '')::bigint AS rpkontak,
        NULLIF(row_payload ->> 'rpkontakperson', '')::bigint AS rpkontakperson,
        row_payload ->> 'rp1alamat1' AS rp1alamat1,
        row_payload ->> 'rp1alamat2' AS rp1alamat2,
        row_payload ->> 'rp1alamat3' AS rp1alamat3,
        row_payload ->> 'rp2alamat1' AS rp2alamat1,
        row_payload ->> 'rp2alamat2' AS rp2alamat2,
        row_payload ->> 'rp2alamat3' AS rp2alamat3,
        NULLIF(row_payload ->> 'rpbagianterima', '')::bigint AS rpbagianterima,
        row_payload ->> 'rptermin' AS rptermin,
        NULLIF(row_payload ->> 'rptgljatuhtempo', '')::timestamptz AS rptgljatuhtempo,
        NULLIF(row_payload ->> 'rpidsi', '')::bigint AS rpidsi,
        row_payload ->> 'rpnorek' AS rpnorek,
        row_payload ->> 'rpuraian' AS rpuraian,
        row_payload ->> 'rpcatatan' AS rpcatatan,
        row_payload ->> 'rpnoref' AS rpnoref,
        NULLIF(row_payload ->> 'rptglnoref', '')::timestamptz AS rptglnoref,
        row_payload ->> 'rpmatauang' AS rpmatauang,
        NULLIF(row_payload ->> 'rpkurs', '')::numeric(20,6) AS rpkurs,
        row_payload ->> 'rpjumlah' AS rpjumlah,
        row_payload ->> 'rpjumlahvalas' AS rpjumlahvalas,
        row_payload ->> 'rpjumlahbayar' AS rpjumlahbayar,
        row_payload ->> 'rpjumlahbayarvalas' AS rpjumlahbayarvalas,
        NULLIF(row_payload ->> 'rpstatusbayar', '')::bigint AS rpstatusbayar,
        NULLIF(row_payload ->> 'rptgllunas', '')::timestamptz AS rptgllunas,
        row_payload ->> 'rpcostcenter' AS rpcostcenter,
        row_payload ->> 'rpdivisi' AS rpdivisi,
        row_payload ->> 'rpsubdivisi' AS rpsubdivisi,
        row_payload ->> 'rpproyek' AS rpproyek,
        NULLIF(row_payload ->> 'rpstatus', '')::bigint AS rpstatus,
        NULLIF(row_payload ->> 'rpstatussebelumnya', '')::bigint AS rpstatussebelumnya,
        NULLIF(row_payload ->> 'rpjmlrevisi', '')::bigint AS rpjmlrevisi,
        NULLIF(row_payload ->> 'rpcetakanke', '')::bigint AS rpcetakanke,
        NULLIF(row_payload ->> 'rpposting', '')::bigint AS rpposting,
        NULLIF(row_payload ->> 'rppostingtgl', '')::timestamptz AS rppostingtgl,
        NULLIF(row_payload ->> 'rpisclose', '')::bigint AS rpisclose,
        NULLIF(row_payload ->> 'rpmodifikasiuser', '')::bigint AS rpmodifikasiuser,
        NULLIF(row_payload ->> 'rpmodifikasitgl', '')::timestamptz AS rpmodifikasitgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'rpid') IS NOT NULL
) AS prepared
ON CONFLICT (rpid) DO UPDATE
SET
    rpcabang = EXCLUDED.rpcabang,
    rplokasi = EXCLUDED.rplokasi,
    rpjenis = EXCLUDED.rpjenis,
    rpsumber = EXCLUDED.rpsumber,
    rpautonotransaksi = EXCLUDED.rpautonotransaksi,
    rpnotransaksi = EXCLUDED.rpnotransaksi,
    rptgl = EXCLUDED.rptgl,
    rpkodepa = EXCLUDED.rpkodepa,
    rpkontak = EXCLUDED.rpkontak,
    rpkontakperson = EXCLUDED.rpkontakperson,
    rp1alamat1 = EXCLUDED.rp1alamat1,
    rp1alamat2 = EXCLUDED.rp1alamat2,
    rp1alamat3 = EXCLUDED.rp1alamat3,
    rp2alamat1 = EXCLUDED.rp2alamat1,
    rp2alamat2 = EXCLUDED.rp2alamat2,
    rp2alamat3 = EXCLUDED.rp2alamat3,
    rpbagianterima = EXCLUDED.rpbagianterima,
    rptermin = EXCLUDED.rptermin,
    rptgljatuhtempo = EXCLUDED.rptgljatuhtempo,
    rpidsi = EXCLUDED.rpidsi,
    rpnorek = EXCLUDED.rpnorek,
    rpuraian = EXCLUDED.rpuraian,
    rpcatatan = EXCLUDED.rpcatatan,
    rpnoref = EXCLUDED.rpnoref,
    rptglnoref = EXCLUDED.rptglnoref,
    rpmatauang = EXCLUDED.rpmatauang,
    rpkurs = EXCLUDED.rpkurs,
    rpjumlah = EXCLUDED.rpjumlah,
    rpjumlahvalas = EXCLUDED.rpjumlahvalas,
    rpjumlahbayar = EXCLUDED.rpjumlahbayar,
    rpjumlahbayarvalas = EXCLUDED.rpjumlahbayarvalas,
    rpstatusbayar = EXCLUDED.rpstatusbayar,
    rptgllunas = EXCLUDED.rptgllunas,
    rpcostcenter = EXCLUDED.rpcostcenter,
    rpdivisi = EXCLUDED.rpdivisi,
    rpsubdivisi = EXCLUDED.rpsubdivisi,
    rpproyek = EXCLUDED.rpproyek,
    rpstatus = EXCLUDED.rpstatus,
    rpstatussebelumnya = EXCLUDED.rpstatussebelumnya,
    rpjmlrevisi = EXCLUDED.rpjmlrevisi,
    rpcetakanke = EXCLUDED.rpcetakanke,
    rpposting = EXCLUDED.rpposting,
    rppostingtgl = EXCLUDED.rppostingtgl,
    rpisclose = EXCLUDED.rpisclose,
    rpmodifikasiuser = EXCLUDED.rpmodifikasiuser,
    rpmodifikasitgl = EXCLUDED.rpmodifikasitgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m5_si
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m5_si'
)
INSERT INTO m5_si (
    siid, sicabang, silokasi, sigudang, siasalbarang, siasalbarangkategori, sijenispenjualan, sijenispenjualankategori, sisaldoawal, sicarabayar, sisumber, siautonotransaksi, sinotransaksi, sitgl, sikodepa, sicustomer, sicustomerkontak, si1alamat1, si1alamat2, si1alamat3, si2alamat1, si2alamat2, si2alamat3, sibagianpenjualan, siekspedisi, sitglkirim, sitermin, sitgljatuhtempo, siuraian, sicatatan, sinoref, sitglnoref, sitglpenutupan, simatauang, sikurs, sihargatermasukpajak, sitotal, sidiskonpersen, sijmldiskon, sitotalpajak1detail, sitotalpajak2detail, sibiayalainpersen, sibiayalain, sitotaltransaksi, sijmluangmuka, sijmlbayar, sibayartunai, sibayarkkredit, sibayarkdebit, sibayarvoucher, sibayarpoin, sibayarjmlpoin, sichargepersen, sicharge, sijmlkembali, sipoinsebelumnya, sipoindidapat, sistatuslunas, sitgllunas, sinofakturpajak, sisdhbayarpajak, sitglbayarpajak, sirekdiskon, sirekpajak1, sirekpajak2, sirekbiayalain, sirekuangmuka, sirekbayar, sirekcharge, sirekkembali, siidsq, siidso, siidas, siidpi, siidpl, siiddo, siiddr, sistatusrnr, sistatussr, sistatusrealisasi, sistatussie, sitglsie, sistatus, sistatussebelumnya, sijmlrevisi, sicetakanke, siposting, sipostingtgl, situtupperiode, siisclose, siuploaded, sicustomarea, siinputtgl, simodifikasiuser, simodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    siid, sicabang, silokasi, sigudang, siasalbarang, siasalbarangkategori, sijenispenjualan, sijenispenjualankategori, sisaldoawal, sicarabayar, sisumber, siautonotransaksi, sinotransaksi, sitgl, sikodepa, sicustomer, sicustomerkontak, si1alamat1, si1alamat2, si1alamat3, si2alamat1, si2alamat2, si2alamat3, sibagianpenjualan, siekspedisi, sitglkirim, sitermin, sitgljatuhtempo, siuraian, sicatatan, sinoref, sitglnoref, sitglpenutupan, simatauang, sikurs, sihargatermasukpajak, sitotal, sidiskonpersen, sijmldiskon, sitotalpajak1detail, sitotalpajak2detail, sibiayalainpersen, sibiayalain, sitotaltransaksi, sijmluangmuka, sijmlbayar, sibayartunai, sibayarkkredit, sibayarkdebit, sibayarvoucher, sibayarpoin, sibayarjmlpoin, sichargepersen, sicharge, sijmlkembali, sipoinsebelumnya, sipoindidapat, sistatuslunas, sitgllunas, sinofakturpajak, sisdhbayarpajak, sitglbayarpajak, sirekdiskon, sirekpajak1, sirekpajak2, sirekbiayalain, sirekuangmuka, sirekbayar, sirekcharge, sirekkembali, siidsq, siidso, siidas, siidpi, siidpl, siiddo, siiddr, sistatusrnr, sistatussr, sistatusrealisasi, sistatussie, sitglsie, sistatus, sistatussebelumnya, sijmlrevisi, sicetakanke, siposting, sipostingtgl, situtupperiode, siisclose, siuploaded, sicustomarea, siinputtgl, simodifikasiuser, simodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'siid', '')::bigint AS siid,
        row_payload ->> 'sicabang' AS sicabang,
        row_payload ->> 'silokasi' AS silokasi,
        row_payload ->> 'sigudang' AS sigudang,
        row_payload ->> 'siasalbarang' AS siasalbarang,
        row_payload ->> 'siasalbarangkategori' AS siasalbarangkategori,
        row_payload ->> 'sijenispenjualan' AS sijenispenjualan,
        row_payload ->> 'sijenispenjualankategori' AS sijenispenjualankategori,
        NULLIF(row_payload ->> 'sisaldoawal', '')::numeric(20,6) AS sisaldoawal,
        row_payload ->> 'sicarabayar' AS sicarabayar,
        row_payload ->> 'sisumber' AS sisumber,
        row_payload ->> 'siautonotransaksi' AS siautonotransaksi,
        row_payload ->> 'sinotransaksi' AS sinotransaksi,
        NULLIF(row_payload ->> 'sitgl', '')::timestamptz AS sitgl,
        row_payload ->> 'sikodepa' AS sikodepa,
        NULLIF(row_payload ->> 'sicustomer', '')::bigint AS sicustomer,
        row_payload ->> 'sicustomerkontak' AS sicustomerkontak,
        row_payload ->> 'si1alamat1' AS si1alamat1,
        row_payload ->> 'si1alamat2' AS si1alamat2,
        row_payload ->> 'si1alamat3' AS si1alamat3,
        row_payload ->> 'si2alamat1' AS si2alamat1,
        row_payload ->> 'si2alamat2' AS si2alamat2,
        row_payload ->> 'si2alamat3' AS si2alamat3,
        NULLIF(row_payload ->> 'sibagianpenjualan', '')::bigint AS sibagianpenjualan,
        row_payload ->> 'siekspedisi' AS siekspedisi,
        NULLIF(row_payload ->> 'sitglkirim', '')::timestamptz AS sitglkirim,
        row_payload ->> 'sitermin' AS sitermin,
        NULLIF(row_payload ->> 'sitgljatuhtempo', '')::timestamptz AS sitgljatuhtempo,
        row_payload ->> 'siuraian' AS siuraian,
        row_payload ->> 'sicatatan' AS sicatatan,
        row_payload ->> 'sinoref' AS sinoref,
        NULLIF(row_payload ->> 'sitglnoref', '')::timestamptz AS sitglnoref,
        NULLIF(row_payload ->> 'sitglpenutupan', '')::timestamptz AS sitglpenutupan,
        row_payload ->> 'simatauang' AS simatauang,
        NULLIF(row_payload ->> 'sikurs', '')::numeric(20,6) AS sikurs,
        NULLIF(row_payload ->> 'sihargatermasukpajak', '')::numeric(20,6) AS sihargatermasukpajak,
        NULLIF(row_payload ->> 'sitotal', '')::numeric(20,6) AS sitotal,
        NULLIF(row_payload ->> 'sidiskonpersen', '')::bigint AS sidiskonpersen,
        NULLIF(row_payload ->> 'sijmldiskon', '')::numeric(20,6) AS sijmldiskon,
        NULLIF(row_payload ->> 'sitotalpajak1detail', '')::numeric(20,6) AS sitotalpajak1detail,
        NULLIF(row_payload ->> 'sitotalpajak2detail', '')::numeric(20,6) AS sitotalpajak2detail,
        NULLIF(row_payload ->> 'sibiayalainpersen', '')::numeric(20,6) AS sibiayalainpersen,
        NULLIF(row_payload ->> 'sibiayalain', '')::numeric(20,6) AS sibiayalain,
        NULLIF(row_payload ->> 'sitotaltransaksi', '')::numeric(20,6) AS sitotaltransaksi,
        NULLIF(row_payload ->> 'sijmluangmuka', '')::numeric(20,6) AS sijmluangmuka,
        NULLIF(row_payload ->> 'sijmlbayar', '')::numeric(20,6) AS sijmlbayar,
        NULLIF(row_payload ->> 'sibayartunai', '')::numeric(20,6) AS sibayartunai,
        NULLIF(row_payload ->> 'sibayarkkredit', '')::numeric(20,6) AS sibayarkkredit,
        NULLIF(row_payload ->> 'sibayarkdebit', '')::numeric(20,6) AS sibayarkdebit,
        NULLIF(row_payload ->> 'sibayarvoucher', '')::numeric(20,6) AS sibayarvoucher,
        NULLIF(row_payload ->> 'sibayarpoin', '')::numeric(20,6) AS sibayarpoin,
        NULLIF(row_payload ->> 'sibayarjmlpoin', '')::numeric(20,6) AS sibayarjmlpoin,
        NULLIF(row_payload ->> 'sichargepersen', '')::numeric(20,6) AS sichargepersen,
        NULLIF(row_payload ->> 'sicharge', '')::numeric(20,6) AS sicharge,
        NULLIF(row_payload ->> 'sijmlkembali', '')::numeric(20,6) AS sijmlkembali,
        NULLIF(row_payload ->> 'sipoinsebelumnya', '')::numeric(20,6) AS sipoinsebelumnya,
        NULLIF(row_payload ->> 'sipoindidapat', '')::numeric(20,6) AS sipoindidapat,
        NULLIF(row_payload ->> 'sistatuslunas', '')::bigint AS sistatuslunas,
        NULLIF(row_payload ->> 'sitgllunas', '')::timestamptz AS sitgllunas,
        row_payload ->> 'sinofakturpajak' AS sinofakturpajak,
        NULLIF(row_payload ->> 'sisdhbayarpajak', '')::bigint AS sisdhbayarpajak,
        NULLIF(row_payload ->> 'sitglbayarpajak', '')::timestamptz AS sitglbayarpajak,
        row_payload ->> 'sirekdiskon' AS sirekdiskon,
        row_payload ->> 'sirekpajak1' AS sirekpajak1,
        row_payload ->> 'sirekpajak2' AS sirekpajak2,
        row_payload ->> 'sirekbiayalain' AS sirekbiayalain,
        row_payload ->> 'sirekuangmuka' AS sirekuangmuka,
        row_payload ->> 'sirekbayar' AS sirekbayar,
        row_payload ->> 'sirekcharge' AS sirekcharge,
        row_payload ->> 'sirekkembali' AS sirekkembali,
        NULLIF(row_payload ->> 'siidsq', '')::bigint AS siidsq,
        NULLIF(row_payload ->> 'siidso', '')::bigint AS siidso,
        NULLIF(row_payload ->> 'siidas', '')::bigint AS siidas,
        NULLIF(row_payload ->> 'siidpi', '')::bigint AS siidpi,
        NULLIF(row_payload ->> 'siidpl', '')::bigint AS siidpl,
        NULLIF(row_payload ->> 'siiddo', '')::bigint AS siiddo,
        NULLIF(row_payload ->> 'siiddr', '')::bigint AS siiddr,
        NULLIF(row_payload ->> 'sistatusrnr', '')::bigint AS sistatusrnr,
        NULLIF(row_payload ->> 'sistatussr', '')::bigint AS sistatussr,
        NULLIF(row_payload ->> 'sistatusrealisasi', '')::bigint AS sistatusrealisasi,
        NULLIF(row_payload ->> 'sistatussie', '')::bigint AS sistatussie,
        NULLIF(row_payload ->> 'sitglsie', '')::timestamptz AS sitglsie,
        NULLIF(row_payload ->> 'sistatus', '')::bigint AS sistatus,
        NULLIF(row_payload ->> 'sistatussebelumnya', '')::bigint AS sistatussebelumnya,
        NULLIF(row_payload ->> 'sijmlrevisi', '')::numeric(20,6) AS sijmlrevisi,
        NULLIF(row_payload ->> 'sicetakanke', '')::bigint AS sicetakanke,
        NULLIF(row_payload ->> 'siposting', '')::bigint AS siposting,
        NULLIF(row_payload ->> 'sipostingtgl', '')::timestamptz AS sipostingtgl,
        row_payload ->> 'situtupperiode' AS situtupperiode,
        NULLIF(row_payload ->> 'siisclose', '')::bigint AS siisclose,
        NULLIF(row_payload ->> 'siuploaded', '')::bigint AS siuploaded,
        row_payload ->> 'sicustomarea' AS sicustomarea,
        NULLIF(row_payload ->> 'siinputtgl', '')::timestamptz AS siinputtgl,
        NULLIF(row_payload ->> 'simodifikasiuser', '')::bigint AS simodifikasiuser,
        NULLIF(row_payload ->> 'simodifikasitgl', '')::timestamptz AS simodifikasitgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'siid') IS NOT NULL
) AS prepared
ON CONFLICT (siid) DO UPDATE
SET
    sicabang = EXCLUDED.sicabang,
    silokasi = EXCLUDED.silokasi,
    sigudang = EXCLUDED.sigudang,
    siasalbarang = EXCLUDED.siasalbarang,
    siasalbarangkategori = EXCLUDED.siasalbarangkategori,
    sijenispenjualan = EXCLUDED.sijenispenjualan,
    sijenispenjualankategori = EXCLUDED.sijenispenjualankategori,
    sisaldoawal = EXCLUDED.sisaldoawal,
    sicarabayar = EXCLUDED.sicarabayar,
    sisumber = EXCLUDED.sisumber,
    siautonotransaksi = EXCLUDED.siautonotransaksi,
    sinotransaksi = EXCLUDED.sinotransaksi,
    sitgl = EXCLUDED.sitgl,
    sikodepa = EXCLUDED.sikodepa,
    sicustomer = EXCLUDED.sicustomer,
    sicustomerkontak = EXCLUDED.sicustomerkontak,
    si1alamat1 = EXCLUDED.si1alamat1,
    si1alamat2 = EXCLUDED.si1alamat2,
    si1alamat3 = EXCLUDED.si1alamat3,
    si2alamat1 = EXCLUDED.si2alamat1,
    si2alamat2 = EXCLUDED.si2alamat2,
    si2alamat3 = EXCLUDED.si2alamat3,
    sibagianpenjualan = EXCLUDED.sibagianpenjualan,
    siekspedisi = EXCLUDED.siekspedisi,
    sitglkirim = EXCLUDED.sitglkirim,
    sitermin = EXCLUDED.sitermin,
    sitgljatuhtempo = EXCLUDED.sitgljatuhtempo,
    siuraian = EXCLUDED.siuraian,
    sicatatan = EXCLUDED.sicatatan,
    sinoref = EXCLUDED.sinoref,
    sitglnoref = EXCLUDED.sitglnoref,
    sitglpenutupan = EXCLUDED.sitglpenutupan,
    simatauang = EXCLUDED.simatauang,
    sikurs = EXCLUDED.sikurs,
    sihargatermasukpajak = EXCLUDED.sihargatermasukpajak,
    sitotal = EXCLUDED.sitotal,
    sidiskonpersen = EXCLUDED.sidiskonpersen,
    sijmldiskon = EXCLUDED.sijmldiskon,
    sitotalpajak1detail = EXCLUDED.sitotalpajak1detail,
    sitotalpajak2detail = EXCLUDED.sitotalpajak2detail,
    sibiayalainpersen = EXCLUDED.sibiayalainpersen,
    sibiayalain = EXCLUDED.sibiayalain,
    sitotaltransaksi = EXCLUDED.sitotaltransaksi,
    sijmluangmuka = EXCLUDED.sijmluangmuka,
    sijmlbayar = EXCLUDED.sijmlbayar,
    sibayartunai = EXCLUDED.sibayartunai,
    sibayarkkredit = EXCLUDED.sibayarkkredit,
    sibayarkdebit = EXCLUDED.sibayarkdebit,
    sibayarvoucher = EXCLUDED.sibayarvoucher,
    sibayarpoin = EXCLUDED.sibayarpoin,
    sibayarjmlpoin = EXCLUDED.sibayarjmlpoin,
    sichargepersen = EXCLUDED.sichargepersen,
    sicharge = EXCLUDED.sicharge,
    sijmlkembali = EXCLUDED.sijmlkembali,
    sipoinsebelumnya = EXCLUDED.sipoinsebelumnya,
    sipoindidapat = EXCLUDED.sipoindidapat,
    sistatuslunas = EXCLUDED.sistatuslunas,
    sitgllunas = EXCLUDED.sitgllunas,
    sinofakturpajak = EXCLUDED.sinofakturpajak,
    sisdhbayarpajak = EXCLUDED.sisdhbayarpajak,
    sitglbayarpajak = EXCLUDED.sitglbayarpajak,
    sirekdiskon = EXCLUDED.sirekdiskon,
    sirekpajak1 = EXCLUDED.sirekpajak1,
    sirekpajak2 = EXCLUDED.sirekpajak2,
    sirekbiayalain = EXCLUDED.sirekbiayalain,
    sirekuangmuka = EXCLUDED.sirekuangmuka,
    sirekbayar = EXCLUDED.sirekbayar,
    sirekcharge = EXCLUDED.sirekcharge,
    sirekkembali = EXCLUDED.sirekkembali,
    siidsq = EXCLUDED.siidsq,
    siidso = EXCLUDED.siidso,
    siidas = EXCLUDED.siidas,
    siidpi = EXCLUDED.siidpi,
    siidpl = EXCLUDED.siidpl,
    siiddo = EXCLUDED.siiddo,
    siiddr = EXCLUDED.siiddr,
    sistatusrnr = EXCLUDED.sistatusrnr,
    sistatussr = EXCLUDED.sistatussr,
    sistatusrealisasi = EXCLUDED.sistatusrealisasi,
    sistatussie = EXCLUDED.sistatussie,
    sitglsie = EXCLUDED.sitglsie,
    sistatus = EXCLUDED.sistatus,
    sistatussebelumnya = EXCLUDED.sistatussebelumnya,
    sijmlrevisi = EXCLUDED.sijmlrevisi,
    sicetakanke = EXCLUDED.sicetakanke,
    siposting = EXCLUDED.siposting,
    sipostingtgl = EXCLUDED.sipostingtgl,
    situtupperiode = EXCLUDED.situtupperiode,
    siisclose = EXCLUDED.siisclose,
    siuploaded = EXCLUDED.siuploaded,
    sicustomarea = EXCLUDED.sicustomarea,
    siinputtgl = EXCLUDED.siinputtgl,
    simodifikasiuser = EXCLUDED.simodifikasiuser,
    simodifikasitgl = EXCLUDED.simodifikasitgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m5_si_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m5_si_detail'
)
INSERT INTO m5_si_detail (
    idsidetail, idsi, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, idhppkhususmasuk, idhppfifomasuk, harga, hargapricelist, hpp, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudangasal, gudangtransit, gudangtujuan, rekpersediaan, rekhargapokok, rekdiskonpenjualan, rekpenjualan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idsqdetail, idsodetail, idpidetail, idpldetail, iddodetail, iddrdetail, jmlrnr, statusrnr, jmlsr, statussr, jmlrealisasi, statusrealisasi, isbonus, isbonusfrom, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idsidetail, idsi, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, idhppkhususmasuk, idhppfifomasuk, harga, hargapricelist, hpp, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudangasal, gudangtransit, gudangtujuan, rekpersediaan, rekhargapokok, rekdiskonpenjualan, rekpenjualan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idsqdetail, idsodetail, idpidetail, idpldetail, iddodetail, iddrdetail, jmlrnr, statusrnr, jmlsr, statussr, jmlrealisasi, statusrealisasi, isbonus, isbonusfrom, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idsidetail', '')::bigint AS idsidetail,
        NULLIF(row_payload ->> 'idsi', '')::bigint AS idsi,
        NULLIF(row_payload ->> 'idbarang', '')::bigint AS idbarang,
        row_payload ->> 'namabarang' AS namabarang,
        row_payload ->> 'tipebarang' AS tipebarang,
        NULLIF(row_payload ->> 'jml', '')::numeric(20,6) AS jml,
        row_payload ->> 'satuan' AS satuan,
        NULLIF(row_payload ->> 'nilaisatuan', '')::numeric(20,6) AS nilaisatuan,
        NULLIF(row_payload ->> 'jmlbarang', '')::numeric(20,6) AS jmlbarang,
        row_payload ->> 'satuanbarang' AS satuanbarang,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        NULLIF(row_payload ->> 'idhppkhususmasuk', '')::bigint AS idhppkhususmasuk,
        NULLIF(row_payload ->> 'idhppfifomasuk', '')::bigint AS idhppfifomasuk,
        NULLIF(row_payload ->> 'harga', '')::numeric(20,6) AS harga,
        NULLIF(row_payload ->> 'hargapricelist', '')::numeric(20,6) AS hargapricelist,
        row_payload ->> 'hpp' AS hpp,
        NULLIF(row_payload ->> 'diskon', '')::numeric(20,6) AS diskon,
        NULLIF(row_payload ->> 'jmldiskon', '')::numeric(20,6) AS jmldiskon,
        NULLIF(row_payload ->> 'pajak1', '')::numeric(20,6) AS pajak1,
        NULLIF(row_payload ->> 'jmlpajak1', '')::numeric(20,6) AS jmlpajak1,
        NULLIF(row_payload ->> 'pajak2', '')::numeric(20,6) AS pajak2,
        NULLIF(row_payload ->> 'jmlpajak2', '')::numeric(20,6) AS jmlpajak2,
        row_payload ->> 'cabang' AS cabang,
        row_payload ->> 'lokasi' AS lokasi,
        row_payload ->> 'gudangasal' AS gudangasal,
        row_payload ->> 'gudangtransit' AS gudangtransit,
        row_payload ->> 'gudangtujuan' AS gudangtujuan,
        row_payload ->> 'rekpersediaan' AS rekpersediaan,
        NULLIF(row_payload ->> 'rekhargapokok', '')::numeric(20,6) AS rekhargapokok,
        NULLIF(row_payload ->> 'rekdiskonpenjualan', '')::numeric(20,6) AS rekdiskonpenjualan,
        row_payload ->> 'rekpenjualan' AS rekpenjualan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'catatan' AS catatan,
        NULLIF(row_payload ->> 'urutan', '')::bigint AS urutan,
        NULLIF(row_payload ->> 'idsqdetail', '')::bigint AS idsqdetail,
        NULLIF(row_payload ->> 'idsodetail', '')::bigint AS idsodetail,
        NULLIF(row_payload ->> 'idpidetail', '')::bigint AS idpidetail,
        NULLIF(row_payload ->> 'idpldetail', '')::bigint AS idpldetail,
        NULLIF(row_payload ->> 'iddodetail', '')::bigint AS iddodetail,
        NULLIF(row_payload ->> 'iddrdetail', '')::bigint AS iddrdetail,
        NULLIF(row_payload ->> 'jmlrnr', '')::numeric(20,6) AS jmlrnr,
        NULLIF(row_payload ->> 'statusrnr', '')::bigint AS statusrnr,
        NULLIF(row_payload ->> 'jmlsr', '')::numeric(20,6) AS jmlsr,
        NULLIF(row_payload ->> 'statussr', '')::bigint AS statussr,
        NULLIF(row_payload ->> 'jmlrealisasi', '')::numeric(20,6) AS jmlrealisasi,
        NULLIF(row_payload ->> 'statusrealisasi', '')::bigint AS statusrealisasi,
        NULLIF(row_payload ->> 'isbonus', '')::bigint AS isbonus,
        NULLIF(row_payload ->> 'isbonusfrom', '')::bigint AS isbonusfrom,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idsidetail') IS NOT NULL
) AS prepared
ON CONFLICT (idsidetail) DO UPDATE
SET
    idsi = EXCLUDED.idsi,
    idbarang = EXCLUDED.idbarang,
    namabarang = EXCLUDED.namabarang,
    tipebarang = EXCLUDED.tipebarang,
    jml = EXCLUDED.jml,
    satuan = EXCLUDED.satuan,
    nilaisatuan = EXCLUDED.nilaisatuan,
    jmlbarang = EXCLUDED.jmlbarang,
    satuanbarang = EXCLUDED.satuanbarang,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    idhppkhususmasuk = EXCLUDED.idhppkhususmasuk,
    idhppfifomasuk = EXCLUDED.idhppfifomasuk,
    harga = EXCLUDED.harga,
    hargapricelist = EXCLUDED.hargapricelist,
    hpp = EXCLUDED.hpp,
    diskon = EXCLUDED.diskon,
    jmldiskon = EXCLUDED.jmldiskon,
    pajak1 = EXCLUDED.pajak1,
    jmlpajak1 = EXCLUDED.jmlpajak1,
    pajak2 = EXCLUDED.pajak2,
    jmlpajak2 = EXCLUDED.jmlpajak2,
    cabang = EXCLUDED.cabang,
    lokasi = EXCLUDED.lokasi,
    gudangasal = EXCLUDED.gudangasal,
    gudangtransit = EXCLUDED.gudangtransit,
    gudangtujuan = EXCLUDED.gudangtujuan,
    rekpersediaan = EXCLUDED.rekpersediaan,
    rekhargapokok = EXCLUDED.rekhargapokok,
    rekdiskonpenjualan = EXCLUDED.rekdiskonpenjualan,
    rekpenjualan = EXCLUDED.rekpenjualan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    idsqdetail = EXCLUDED.idsqdetail,
    idsodetail = EXCLUDED.idsodetail,
    idpidetail = EXCLUDED.idpidetail,
    idpldetail = EXCLUDED.idpldetail,
    iddodetail = EXCLUDED.iddodetail,
    iddrdetail = EXCLUDED.iddrdetail,
    jmlrnr = EXCLUDED.jmlrnr,
    statusrnr = EXCLUDED.statusrnr,
    jmlsr = EXCLUDED.jmlsr,
    statussr = EXCLUDED.statussr,
    jmlrealisasi = EXCLUDED.jmlrealisasi,
    statusrealisasi = EXCLUDED.statusrealisasi,
    isbonus = EXCLUDED.isbonus,
    isbonusfrom = EXCLUDED.isbonusfrom,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m5_rnr
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m5_rnr'
)
INSERT INTO m5_rnr (
    rnrid, rnrcabang, rnrlokasi, rnrgudang, rnrasalbarang, rnrasalbarangkategori, rnrjenispenjualan, rnrjenispenjualankategori, rnrcarabayar, rnrsumber, rnrautonotransaksi, rnrnotransaksi, rnrtgl, rnrkodepa, rnrcustomer, rnrcustomerkontak, rnr1alamat1, rnr1alamat2, rnr1alamat3, rnr2alamat1, rnr2alamat2, rnr2alamat3, rnrbagianpenjualan, rnrekspedisi, rnrtglkirim, rnrtermin, rnrtgljatuhtempo, rnruraian, rnrcatatan, rnrnoref, rnrtglnoref, rnrtglpenutupan, rnrmatauang, rnrkurs, rnrhargatermasukpajak, rnrtotal, rnrdiskonpersen, rnrjmldiskon, rnrtotalpajak1detail, rnrtotalpajak2detail, rnrbiayalainpersen, rnrbiayalain, rnrtotaltransaksi, rnrjmlbayar, rnrstatuslunas, rnrtgllunas, rnrnofakturpajak, rnrsdhbayarpajak, rnrtglbayarpajak, rnrrekdiskon, rnrrekpajak1, rnrrekpajak2, rnrrekbiayalain, rnrrekbayar, rnridsq, rnridso, rnridpi, rnridpl, rnriddo, rnriddr, rnridsi, rnrstatussr, rnrstatusrealisasi, rnrstatus, rnrstatussebelumnya, rnrjmlrevisi, rnrcetakanke, rnrposting, rnrpostingtgl, rnrtutupperiode, rnrisclose, rnrinputtgl, rnrmodifikasiuser, rnrmodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    rnrid, rnrcabang, rnrlokasi, rnrgudang, rnrasalbarang, rnrasalbarangkategori, rnrjenispenjualan, rnrjenispenjualankategori, rnrcarabayar, rnrsumber, rnrautonotransaksi, rnrnotransaksi, rnrtgl, rnrkodepa, rnrcustomer, rnrcustomerkontak, rnr1alamat1, rnr1alamat2, rnr1alamat3, rnr2alamat1, rnr2alamat2, rnr2alamat3, rnrbagianpenjualan, rnrekspedisi, rnrtglkirim, rnrtermin, rnrtgljatuhtempo, rnruraian, rnrcatatan, rnrnoref, rnrtglnoref, rnrtglpenutupan, rnrmatauang, rnrkurs, rnrhargatermasukpajak, rnrtotal, rnrdiskonpersen, rnrjmldiskon, rnrtotalpajak1detail, rnrtotalpajak2detail, rnrbiayalainpersen, rnrbiayalain, rnrtotaltransaksi, rnrjmlbayar, rnrstatuslunas, rnrtgllunas, rnrnofakturpajak, rnrsdhbayarpajak, rnrtglbayarpajak, rnrrekdiskon, rnrrekpajak1, rnrrekpajak2, rnrrekbiayalain, rnrrekbayar, rnridsq, rnridso, rnridpi, rnridpl, rnriddo, rnriddr, rnridsi, rnrstatussr, rnrstatusrealisasi, rnrstatus, rnrstatussebelumnya, rnrjmlrevisi, rnrcetakanke, rnrposting, rnrpostingtgl, rnrtutupperiode, rnrisclose, rnrinputtgl, rnrmodifikasiuser, rnrmodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'rnrid', '')::bigint AS rnrid,
        row_payload ->> 'rnrcabang' AS rnrcabang,
        row_payload ->> 'rnrlokasi' AS rnrlokasi,
        row_payload ->> 'rnrgudang' AS rnrgudang,
        row_payload ->> 'rnrasalbarang' AS rnrasalbarang,
        row_payload ->> 'rnrasalbarangkategori' AS rnrasalbarangkategori,
        row_payload ->> 'rnrjenispenjualan' AS rnrjenispenjualan,
        row_payload ->> 'rnrjenispenjualankategori' AS rnrjenispenjualankategori,
        row_payload ->> 'rnrcarabayar' AS rnrcarabayar,
        row_payload ->> 'rnrsumber' AS rnrsumber,
        row_payload ->> 'rnrautonotransaksi' AS rnrautonotransaksi,
        row_payload ->> 'rnrnotransaksi' AS rnrnotransaksi,
        NULLIF(row_payload ->> 'rnrtgl', '')::timestamptz AS rnrtgl,
        row_payload ->> 'rnrkodepa' AS rnrkodepa,
        row_payload ->> 'rnrcustomer' AS rnrcustomer,
        row_payload ->> 'rnrcustomerkontak' AS rnrcustomerkontak,
        row_payload ->> 'rnr1alamat1' AS rnr1alamat1,
        row_payload ->> 'rnr1alamat2' AS rnr1alamat2,
        row_payload ->> 'rnr1alamat3' AS rnr1alamat3,
        row_payload ->> 'rnr2alamat1' AS rnr2alamat1,
        row_payload ->> 'rnr2alamat2' AS rnr2alamat2,
        row_payload ->> 'rnr2alamat3' AS rnr2alamat3,
        row_payload ->> 'rnrbagianpenjualan' AS rnrbagianpenjualan,
        row_payload ->> 'rnrekspedisi' AS rnrekspedisi,
        NULLIF(row_payload ->> 'rnrtglkirim', '')::timestamptz AS rnrtglkirim,
        row_payload ->> 'rnrtermin' AS rnrtermin,
        NULLIF(row_payload ->> 'rnrtgljatuhtempo', '')::timestamptz AS rnrtgljatuhtempo,
        row_payload ->> 'rnruraian' AS rnruraian,
        row_payload ->> 'rnrcatatan' AS rnrcatatan,
        row_payload ->> 'rnrnoref' AS rnrnoref,
        NULLIF(row_payload ->> 'rnrtglnoref', '')::timestamptz AS rnrtglnoref,
        NULLIF(row_payload ->> 'rnrtglpenutupan', '')::timestamptz AS rnrtglpenutupan,
        row_payload ->> 'rnrmatauang' AS rnrmatauang,
        NULLIF(row_payload ->> 'rnrkurs', '')::numeric(20,6) AS rnrkurs,
        NULLIF(row_payload ->> 'rnrhargatermasukpajak', '')::numeric(20,6) AS rnrhargatermasukpajak,
        NULLIF(row_payload ->> 'rnrtotal', '')::numeric(20,6) AS rnrtotal,
        NULLIF(row_payload ->> 'rnrdiskonpersen', '')::numeric(20,6) AS rnrdiskonpersen,
        NULLIF(row_payload ->> 'rnrjmldiskon', '')::numeric(20,6) AS rnrjmldiskon,
        NULLIF(row_payload ->> 'rnrtotalpajak1detail', '')::numeric(20,6) AS rnrtotalpajak1detail,
        NULLIF(row_payload ->> 'rnrtotalpajak2detail', '')::numeric(20,6) AS rnrtotalpajak2detail,
        NULLIF(row_payload ->> 'rnrbiayalainpersen', '')::numeric(20,6) AS rnrbiayalainpersen,
        row_payload ->> 'rnrbiayalain' AS rnrbiayalain,
        NULLIF(row_payload ->> 'rnrtotaltransaksi', '')::numeric(20,6) AS rnrtotaltransaksi,
        NULLIF(row_payload ->> 'rnrjmlbayar', '')::numeric(20,6) AS rnrjmlbayar,
        row_payload ->> 'rnrstatuslunas' AS rnrstatuslunas,
        NULLIF(row_payload ->> 'rnrtgllunas', '')::timestamptz AS rnrtgllunas,
        NULLIF(row_payload ->> 'rnrnofakturpajak', '')::numeric(20,6) AS rnrnofakturpajak,
        NULLIF(row_payload ->> 'rnrsdhbayarpajak', '')::numeric(20,6) AS rnrsdhbayarpajak,
        NULLIF(row_payload ->> 'rnrtglbayarpajak', '')::timestamptz AS rnrtglbayarpajak,
        NULLIF(row_payload ->> 'rnrrekdiskon', '')::numeric(20,6) AS rnrrekdiskon,
        NULLIF(row_payload ->> 'rnrrekpajak1', '')::numeric(20,6) AS rnrrekpajak1,
        NULLIF(row_payload ->> 'rnrrekpajak2', '')::numeric(20,6) AS rnrrekpajak2,
        row_payload ->> 'rnrrekbiayalain' AS rnrrekbiayalain,
        row_payload ->> 'rnrrekbayar' AS rnrrekbayar,
        NULLIF(row_payload ->> 'rnridsq', '')::bigint AS rnridsq,
        NULLIF(row_payload ->> 'rnridso', '')::bigint AS rnridso,
        NULLIF(row_payload ->> 'rnridpi', '')::bigint AS rnridpi,
        NULLIF(row_payload ->> 'rnridpl', '')::bigint AS rnridpl,
        NULLIF(row_payload ->> 'rnriddo', '')::bigint AS rnriddo,
        NULLIF(row_payload ->> 'rnriddr', '')::bigint AS rnriddr,
        NULLIF(row_payload ->> 'rnridsi', '')::bigint AS rnridsi,
        row_payload ->> 'rnrstatussr' AS rnrstatussr,
        row_payload ->> 'rnrstatusrealisasi' AS rnrstatusrealisasi,
        row_payload ->> 'rnrstatus' AS rnrstatus,
        row_payload ->> 'rnrstatussebelumnya' AS rnrstatussebelumnya,
        NULLIF(row_payload ->> 'rnrjmlrevisi', '')::numeric(20,6) AS rnrjmlrevisi,
        row_payload ->> 'rnrcetakanke' AS rnrcetakanke,
        NULLIF(row_payload ->> 'rnrposting', '')::bigint AS rnrposting,
        NULLIF(row_payload ->> 'rnrpostingtgl', '')::timestamptz AS rnrpostingtgl,
        row_payload ->> 'rnrtutupperiode' AS rnrtutupperiode,
        NULLIF(row_payload ->> 'rnrisclose', '')::bigint AS rnrisclose,
        NULLIF(row_payload ->> 'rnrinputtgl', '')::timestamptz AS rnrinputtgl,
        row_payload ->> 'rnrmodifikasiuser' AS rnrmodifikasiuser,
        NULLIF(row_payload ->> 'rnrmodifikasitgl', '')::timestamptz AS rnrmodifikasitgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'rnrid') IS NOT NULL
) AS prepared
ON CONFLICT (rnrid) DO UPDATE
SET
    rnrcabang = EXCLUDED.rnrcabang,
    rnrlokasi = EXCLUDED.rnrlokasi,
    rnrgudang = EXCLUDED.rnrgudang,
    rnrasalbarang = EXCLUDED.rnrasalbarang,
    rnrasalbarangkategori = EXCLUDED.rnrasalbarangkategori,
    rnrjenispenjualan = EXCLUDED.rnrjenispenjualan,
    rnrjenispenjualankategori = EXCLUDED.rnrjenispenjualankategori,
    rnrcarabayar = EXCLUDED.rnrcarabayar,
    rnrsumber = EXCLUDED.rnrsumber,
    rnrautonotransaksi = EXCLUDED.rnrautonotransaksi,
    rnrnotransaksi = EXCLUDED.rnrnotransaksi,
    rnrtgl = EXCLUDED.rnrtgl,
    rnrkodepa = EXCLUDED.rnrkodepa,
    rnrcustomer = EXCLUDED.rnrcustomer,
    rnrcustomerkontak = EXCLUDED.rnrcustomerkontak,
    rnr1alamat1 = EXCLUDED.rnr1alamat1,
    rnr1alamat2 = EXCLUDED.rnr1alamat2,
    rnr1alamat3 = EXCLUDED.rnr1alamat3,
    rnr2alamat1 = EXCLUDED.rnr2alamat1,
    rnr2alamat2 = EXCLUDED.rnr2alamat2,
    rnr2alamat3 = EXCLUDED.rnr2alamat3,
    rnrbagianpenjualan = EXCLUDED.rnrbagianpenjualan,
    rnrekspedisi = EXCLUDED.rnrekspedisi,
    rnrtglkirim = EXCLUDED.rnrtglkirim,
    rnrtermin = EXCLUDED.rnrtermin,
    rnrtgljatuhtempo = EXCLUDED.rnrtgljatuhtempo,
    rnruraian = EXCLUDED.rnruraian,
    rnrcatatan = EXCLUDED.rnrcatatan,
    rnrnoref = EXCLUDED.rnrnoref,
    rnrtglnoref = EXCLUDED.rnrtglnoref,
    rnrtglpenutupan = EXCLUDED.rnrtglpenutupan,
    rnrmatauang = EXCLUDED.rnrmatauang,
    rnrkurs = EXCLUDED.rnrkurs,
    rnrhargatermasukpajak = EXCLUDED.rnrhargatermasukpajak,
    rnrtotal = EXCLUDED.rnrtotal,
    rnrdiskonpersen = EXCLUDED.rnrdiskonpersen,
    rnrjmldiskon = EXCLUDED.rnrjmldiskon,
    rnrtotalpajak1detail = EXCLUDED.rnrtotalpajak1detail,
    rnrtotalpajak2detail = EXCLUDED.rnrtotalpajak2detail,
    rnrbiayalainpersen = EXCLUDED.rnrbiayalainpersen,
    rnrbiayalain = EXCLUDED.rnrbiayalain,
    rnrtotaltransaksi = EXCLUDED.rnrtotaltransaksi,
    rnrjmlbayar = EXCLUDED.rnrjmlbayar,
    rnrstatuslunas = EXCLUDED.rnrstatuslunas,
    rnrtgllunas = EXCLUDED.rnrtgllunas,
    rnrnofakturpajak = EXCLUDED.rnrnofakturpajak,
    rnrsdhbayarpajak = EXCLUDED.rnrsdhbayarpajak,
    rnrtglbayarpajak = EXCLUDED.rnrtglbayarpajak,
    rnrrekdiskon = EXCLUDED.rnrrekdiskon,
    rnrrekpajak1 = EXCLUDED.rnrrekpajak1,
    rnrrekpajak2 = EXCLUDED.rnrrekpajak2,
    rnrrekbiayalain = EXCLUDED.rnrrekbiayalain,
    rnrrekbayar = EXCLUDED.rnrrekbayar,
    rnridsq = EXCLUDED.rnridsq,
    rnridso = EXCLUDED.rnridso,
    rnridpi = EXCLUDED.rnridpi,
    rnridpl = EXCLUDED.rnridpl,
    rnriddo = EXCLUDED.rnriddo,
    rnriddr = EXCLUDED.rnriddr,
    rnridsi = EXCLUDED.rnridsi,
    rnrstatussr = EXCLUDED.rnrstatussr,
    rnrstatusrealisasi = EXCLUDED.rnrstatusrealisasi,
    rnrstatus = EXCLUDED.rnrstatus,
    rnrstatussebelumnya = EXCLUDED.rnrstatussebelumnya,
    rnrjmlrevisi = EXCLUDED.rnrjmlrevisi,
    rnrcetakanke = EXCLUDED.rnrcetakanke,
    rnrposting = EXCLUDED.rnrposting,
    rnrpostingtgl = EXCLUDED.rnrpostingtgl,
    rnrtutupperiode = EXCLUDED.rnrtutupperiode,
    rnrisclose = EXCLUDED.rnrisclose,
    rnrinputtgl = EXCLUDED.rnrinputtgl,
    rnrmodifikasiuser = EXCLUDED.rnrmodifikasiuser,
    rnrmodifikasitgl = EXCLUDED.rnrmodifikasitgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m5_rnr_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m5_rnr_detail'
)
INSERT INTO m5_rnr_detail (
    idrnrdetail, idrnr, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, idhppkhususkeluar, idhppfifokeluar, harga, hargapricelist, hpp, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudangasal, gudangtransit, gudangtujuan, rekpersediaan, rekhargapokok, rekdiskonpenjualan, rekreturpenjualan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idsqdetail, idsodetail, idpidetail, idpldetail, iddodetail, iddrdetail, idsidetail, jmlsr, statussr, jmlrealisasi, statusrealisasi, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idrnrdetail, idrnr, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, idhppkhususkeluar, idhppfifokeluar, harga, hargapricelist, hpp, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudangasal, gudangtransit, gudangtujuan, rekpersediaan, rekhargapokok, rekdiskonpenjualan, rekreturpenjualan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idsqdetail, idsodetail, idpidetail, idpldetail, iddodetail, iddrdetail, idsidetail, jmlsr, statussr, jmlrealisasi, statusrealisasi, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idrnrdetail', '')::bigint AS idrnrdetail,
        NULLIF(row_payload ->> 'idrnr', '')::bigint AS idrnr,
        NULLIF(row_payload ->> 'idbarang', '')::bigint AS idbarang,
        row_payload ->> 'namabarang' AS namabarang,
        row_payload ->> 'tipebarang' AS tipebarang,
        NULLIF(row_payload ->> 'jml', '')::numeric(20,6) AS jml,
        row_payload ->> 'satuan' AS satuan,
        NULLIF(row_payload ->> 'nilaisatuan', '')::numeric(20,6) AS nilaisatuan,
        NULLIF(row_payload ->> 'jmlbarang', '')::numeric(20,6) AS jmlbarang,
        row_payload ->> 'satuanbarang' AS satuanbarang,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        NULLIF(row_payload ->> 'idhppkhususkeluar', '')::bigint AS idhppkhususkeluar,
        NULLIF(row_payload ->> 'idhppfifokeluar', '')::bigint AS idhppfifokeluar,
        NULLIF(row_payload ->> 'harga', '')::numeric(20,6) AS harga,
        NULLIF(row_payload ->> 'hargapricelist', '')::numeric(20,6) AS hargapricelist,
        row_payload ->> 'hpp' AS hpp,
        NULLIF(row_payload ->> 'diskon', '')::numeric(20,6) AS diskon,
        NULLIF(row_payload ->> 'jmldiskon', '')::numeric(20,6) AS jmldiskon,
        NULLIF(row_payload ->> 'pajak1', '')::numeric(20,6) AS pajak1,
        NULLIF(row_payload ->> 'jmlpajak1', '')::numeric(20,6) AS jmlpajak1,
        NULLIF(row_payload ->> 'pajak2', '')::numeric(20,6) AS pajak2,
        NULLIF(row_payload ->> 'jmlpajak2', '')::numeric(20,6) AS jmlpajak2,
        row_payload ->> 'cabang' AS cabang,
        row_payload ->> 'lokasi' AS lokasi,
        row_payload ->> 'gudangasal' AS gudangasal,
        row_payload ->> 'gudangtransit' AS gudangtransit,
        row_payload ->> 'gudangtujuan' AS gudangtujuan,
        row_payload ->> 'rekpersediaan' AS rekpersediaan,
        NULLIF(row_payload ->> 'rekhargapokok', '')::numeric(20,6) AS rekhargapokok,
        NULLIF(row_payload ->> 'rekdiskonpenjualan', '')::numeric(20,6) AS rekdiskonpenjualan,
        row_payload ->> 'rekreturpenjualan' AS rekreturpenjualan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'idsqdetail', '')::bigint AS idsqdetail,
        NULLIF(row_payload ->> 'idsodetail', '')::bigint AS idsodetail,
        NULLIF(row_payload ->> 'idpidetail', '')::bigint AS idpidetail,
        NULLIF(row_payload ->> 'idpldetail', '')::bigint AS idpldetail,
        NULLIF(row_payload ->> 'iddodetail', '')::bigint AS iddodetail,
        NULLIF(row_payload ->> 'iddrdetail', '')::bigint AS iddrdetail,
        NULLIF(row_payload ->> 'idsidetail', '')::bigint AS idsidetail,
        NULLIF(row_payload ->> 'jmlsr', '')::numeric(20,6) AS jmlsr,
        NULLIF(row_payload ->> 'statussr', '')::bigint AS statussr,
        NULLIF(row_payload ->> 'jmlrealisasi', '')::numeric(20,6) AS jmlrealisasi,
        NULLIF(row_payload ->> 'statusrealisasi', '')::bigint AS statusrealisasi,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idrnrdetail') IS NOT NULL
) AS prepared
ON CONFLICT (idrnrdetail) DO UPDATE
SET
    idrnr = EXCLUDED.idrnr,
    idbarang = EXCLUDED.idbarang,
    namabarang = EXCLUDED.namabarang,
    tipebarang = EXCLUDED.tipebarang,
    jml = EXCLUDED.jml,
    satuan = EXCLUDED.satuan,
    nilaisatuan = EXCLUDED.nilaisatuan,
    jmlbarang = EXCLUDED.jmlbarang,
    satuanbarang = EXCLUDED.satuanbarang,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    idhppkhususkeluar = EXCLUDED.idhppkhususkeluar,
    idhppfifokeluar = EXCLUDED.idhppfifokeluar,
    harga = EXCLUDED.harga,
    hargapricelist = EXCLUDED.hargapricelist,
    hpp = EXCLUDED.hpp,
    diskon = EXCLUDED.diskon,
    jmldiskon = EXCLUDED.jmldiskon,
    pajak1 = EXCLUDED.pajak1,
    jmlpajak1 = EXCLUDED.jmlpajak1,
    pajak2 = EXCLUDED.pajak2,
    jmlpajak2 = EXCLUDED.jmlpajak2,
    cabang = EXCLUDED.cabang,
    lokasi = EXCLUDED.lokasi,
    gudangasal = EXCLUDED.gudangasal,
    gudangtransit = EXCLUDED.gudangtransit,
    gudangtujuan = EXCLUDED.gudangtujuan,
    rekpersediaan = EXCLUDED.rekpersediaan,
    rekhargapokok = EXCLUDED.rekhargapokok,
    rekdiskonpenjualan = EXCLUDED.rekdiskonpenjualan,
    rekreturpenjualan = EXCLUDED.rekreturpenjualan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    idsqdetail = EXCLUDED.idsqdetail,
    idsodetail = EXCLUDED.idsodetail,
    idpidetail = EXCLUDED.idpidetail,
    idpldetail = EXCLUDED.idpldetail,
    iddodetail = EXCLUDED.iddodetail,
    iddrdetail = EXCLUDED.iddrdetail,
    idsidetail = EXCLUDED.idsidetail,
    jmlsr = EXCLUDED.jmlsr,
    statussr = EXCLUDED.statussr,
    jmlrealisasi = EXCLUDED.jmlrealisasi,
    statusrealisasi = EXCLUDED.statusrealisasi,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m5_sr
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m5_sr'
)
INSERT INTO m5_sr (
    srid, srcabang, srlokasi, srjenis, srgudang, srasalbarang, srasalbarangkategori, srjenispenjulan, srjenispenjualankategori, srsaldoawal, srcarabayar, srsumber, srautonotransaksi, srnotransaksi, srtgl, srkodepa, srcustomer, srcustomerkontak, sr1alamat1, sr1alamat2, sr1alamat3, sr2alamat1, sr2alamat2, sr2alamat3, srbagianpenjualan, srekspedisi, srtglkirim, srtermin, srtgljatuhtempo, sruraian, srcatatan, srnoref, srtglnoref, srtglpenutupan, srmatauang, srkurs, srhargatermasukpajak, srtotal, srdiskonpersen, srjmldiskon, srtotalpajak1detail, srtotalpajak2detail, srbiayalainpersen, srbiayalain, srtotaltransaksi, srsisatransaksi, srjmlbayar, srstatuslunas, srtgllunas, srnofakturpajak, srsdhbayarpajak, srtglbayarpajak, srrekdiskon, srrekpajak1, srrekpajak2, srrekbiayalain, srreksisa, srrekbayar, sridsq, sridso, sridpi, sridpl, sriddo, sriddr, sridsi, sridrnr, srstatussie, srtglsie, srstatus, srstatussebelumnya, srjmlrevisi, srcetakanke, srposting, srpostingtgl, srtutupperiode, srisclose, srinputtgl, srmodifikasiuser, srmodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    srid, srcabang, srlokasi, srjenis, srgudang, srasalbarang, srasalbarangkategori, srjenispenjulan, srjenispenjualankategori, srsaldoawal, srcarabayar, srsumber, srautonotransaksi, srnotransaksi, srtgl, srkodepa, srcustomer, srcustomerkontak, sr1alamat1, sr1alamat2, sr1alamat3, sr2alamat1, sr2alamat2, sr2alamat3, srbagianpenjualan, srekspedisi, srtglkirim, srtermin, srtgljatuhtempo, sruraian, srcatatan, srnoref, srtglnoref, srtglpenutupan, srmatauang, srkurs, srhargatermasukpajak, srtotal, srdiskonpersen, srjmldiskon, srtotalpajak1detail, srtotalpajak2detail, srbiayalainpersen, srbiayalain, srtotaltransaksi, srsisatransaksi, srjmlbayar, srstatuslunas, srtgllunas, srnofakturpajak, srsdhbayarpajak, srtglbayarpajak, srrekdiskon, srrekpajak1, srrekpajak2, srrekbiayalain, srreksisa, srrekbayar, sridsq, sridso, sridpi, sridpl, sriddo, sriddr, sridsi, sridrnr, srstatussie, srtglsie, srstatus, srstatussebelumnya, srjmlrevisi, srcetakanke, srposting, srpostingtgl, srtutupperiode, srisclose, srinputtgl, srmodifikasiuser, srmodifikasitgl, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'srid', '')::bigint AS srid,
        row_payload ->> 'srcabang' AS srcabang,
        row_payload ->> 'srlokasi' AS srlokasi,
        row_payload ->> 'srjenis' AS srjenis,
        row_payload ->> 'srgudang' AS srgudang,
        row_payload ->> 'srasalbarang' AS srasalbarang,
        row_payload ->> 'srasalbarangkategori' AS srasalbarangkategori,
        row_payload ->> 'srjenispenjulan' AS srjenispenjulan,
        row_payload ->> 'srjenispenjualankategori' AS srjenispenjualankategori,
        NULLIF(row_payload ->> 'srsaldoawal', '')::numeric(20,6) AS srsaldoawal,
        row_payload ->> 'srcarabayar' AS srcarabayar,
        row_payload ->> 'srsumber' AS srsumber,
        row_payload ->> 'srautonotransaksi' AS srautonotransaksi,
        row_payload ->> 'srnotransaksi' AS srnotransaksi,
        NULLIF(row_payload ->> 'srtgl', '')::timestamptz AS srtgl,
        row_payload ->> 'srkodepa' AS srkodepa,
        NULLIF(row_payload ->> 'srcustomer', '')::bigint AS srcustomer,
        row_payload ->> 'srcustomerkontak' AS srcustomerkontak,
        row_payload ->> 'sr1alamat1' AS sr1alamat1,
        row_payload ->> 'sr1alamat2' AS sr1alamat2,
        row_payload ->> 'sr1alamat3' AS sr1alamat3,
        row_payload ->> 'sr2alamat1' AS sr2alamat1,
        row_payload ->> 'sr2alamat2' AS sr2alamat2,
        row_payload ->> 'sr2alamat3' AS sr2alamat3,
        NULLIF(row_payload ->> 'srbagianpenjualan', '')::bigint AS srbagianpenjualan,
        row_payload ->> 'srekspedisi' AS srekspedisi,
        NULLIF(row_payload ->> 'srtglkirim', '')::timestamptz AS srtglkirim,
        row_payload ->> 'srtermin' AS srtermin,
        NULLIF(row_payload ->> 'srtgljatuhtempo', '')::timestamptz AS srtgljatuhtempo,
        row_payload ->> 'sruraian' AS sruraian,
        row_payload ->> 'srcatatan' AS srcatatan,
        row_payload ->> 'srnoref' AS srnoref,
        NULLIF(row_payload ->> 'srtglnoref', '')::timestamptz AS srtglnoref,
        NULLIF(row_payload ->> 'srtglpenutupan', '')::timestamptz AS srtglpenutupan,
        row_payload ->> 'srmatauang' AS srmatauang,
        NULLIF(row_payload ->> 'srkurs', '')::numeric(20,6) AS srkurs,
        NULLIF(row_payload ->> 'srhargatermasukpajak', '')::numeric(20,6) AS srhargatermasukpajak,
        NULLIF(row_payload ->> 'srtotal', '')::numeric(20,6) AS srtotal,
        NULLIF(row_payload ->> 'srdiskonpersen', '')::numeric(20,6) AS srdiskonpersen,
        NULLIF(row_payload ->> 'srjmldiskon', '')::numeric(20,6) AS srjmldiskon,
        NULLIF(row_payload ->> 'srtotalpajak1detail', '')::numeric(20,6) AS srtotalpajak1detail,
        NULLIF(row_payload ->> 'srtotalpajak2detail', '')::numeric(20,6) AS srtotalpajak2detail,
        NULLIF(row_payload ->> 'srbiayalainpersen', '')::numeric(20,6) AS srbiayalainpersen,
        NULLIF(row_payload ->> 'srbiayalain', '')::numeric(20,6) AS srbiayalain,
        NULLIF(row_payload ->> 'srtotaltransaksi', '')::numeric(20,6) AS srtotaltransaksi,
        NULLIF(row_payload ->> 'srsisatransaksi', '')::numeric(20,6) AS srsisatransaksi,
        NULLIF(row_payload ->> 'srjmlbayar', '')::numeric(20,6) AS srjmlbayar,
        NULLIF(row_payload ->> 'srstatuslunas', '')::bigint AS srstatuslunas,
        NULLIF(row_payload ->> 'srtgllunas', '')::timestamptz AS srtgllunas,
        row_payload ->> 'srnofakturpajak' AS srnofakturpajak,
        NULLIF(row_payload ->> 'srsdhbayarpajak', '')::bigint AS srsdhbayarpajak,
        NULLIF(row_payload ->> 'srtglbayarpajak', '')::timestamptz AS srtglbayarpajak,
        row_payload ->> 'srrekdiskon' AS srrekdiskon,
        row_payload ->> 'srrekpajak1' AS srrekpajak1,
        row_payload ->> 'srrekpajak2' AS srrekpajak2,
        row_payload ->> 'srrekbiayalain' AS srrekbiayalain,
        row_payload ->> 'srreksisa' AS srreksisa,
        row_payload ->> 'srrekbayar' AS srrekbayar,
        NULLIF(row_payload ->> 'sridsq', '')::bigint AS sridsq,
        NULLIF(row_payload ->> 'sridso', '')::bigint AS sridso,
        NULLIF(row_payload ->> 'sridpi', '')::bigint AS sridpi,
        NULLIF(row_payload ->> 'sridpl', '')::bigint AS sridpl,
        NULLIF(row_payload ->> 'sriddo', '')::bigint AS sriddo,
        NULLIF(row_payload ->> 'sriddr', '')::bigint AS sriddr,
        NULLIF(row_payload ->> 'sridsi', '')::bigint AS sridsi,
        NULLIF(row_payload ->> 'sridrnr', '')::bigint AS sridrnr,
        NULLIF(row_payload ->> 'srstatussie', '')::bigint AS srstatussie,
        NULLIF(row_payload ->> 'srtglsie', '')::timestamptz AS srtglsie,
        NULLIF(row_payload ->> 'srstatus', '')::bigint AS srstatus,
        NULLIF(row_payload ->> 'srstatussebelumnya', '')::bigint AS srstatussebelumnya,
        NULLIF(row_payload ->> 'srjmlrevisi', '')::numeric(20,6) AS srjmlrevisi,
        NULLIF(row_payload ->> 'srcetakanke', '')::bigint AS srcetakanke,
        NULLIF(row_payload ->> 'srposting', '')::bigint AS srposting,
        NULLIF(row_payload ->> 'srpostingtgl', '')::timestamptz AS srpostingtgl,
        row_payload ->> 'srtutupperiode' AS srtutupperiode,
        NULLIF(row_payload ->> 'srisclose', '')::bigint AS srisclose,
        NULLIF(row_payload ->> 'srinputtgl', '')::timestamptz AS srinputtgl,
        row_payload ->> 'srmodifikasiuser' AS srmodifikasiuser,
        NULLIF(row_payload ->> 'srmodifikasitgl', '')::timestamptz AS srmodifikasitgl,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'srid') IS NOT NULL
) AS prepared
ON CONFLICT (srid) DO UPDATE
SET
    srcabang = EXCLUDED.srcabang,
    srlokasi = EXCLUDED.srlokasi,
    srjenis = EXCLUDED.srjenis,
    srgudang = EXCLUDED.srgudang,
    srasalbarang = EXCLUDED.srasalbarang,
    srasalbarangkategori = EXCLUDED.srasalbarangkategori,
    srjenispenjulan = EXCLUDED.srjenispenjulan,
    srjenispenjualankategori = EXCLUDED.srjenispenjualankategori,
    srsaldoawal = EXCLUDED.srsaldoawal,
    srcarabayar = EXCLUDED.srcarabayar,
    srsumber = EXCLUDED.srsumber,
    srautonotransaksi = EXCLUDED.srautonotransaksi,
    srnotransaksi = EXCLUDED.srnotransaksi,
    srtgl = EXCLUDED.srtgl,
    srkodepa = EXCLUDED.srkodepa,
    srcustomer = EXCLUDED.srcustomer,
    srcustomerkontak = EXCLUDED.srcustomerkontak,
    sr1alamat1 = EXCLUDED.sr1alamat1,
    sr1alamat2 = EXCLUDED.sr1alamat2,
    sr1alamat3 = EXCLUDED.sr1alamat3,
    sr2alamat1 = EXCLUDED.sr2alamat1,
    sr2alamat2 = EXCLUDED.sr2alamat2,
    sr2alamat3 = EXCLUDED.sr2alamat3,
    srbagianpenjualan = EXCLUDED.srbagianpenjualan,
    srekspedisi = EXCLUDED.srekspedisi,
    srtglkirim = EXCLUDED.srtglkirim,
    srtermin = EXCLUDED.srtermin,
    srtgljatuhtempo = EXCLUDED.srtgljatuhtempo,
    sruraian = EXCLUDED.sruraian,
    srcatatan = EXCLUDED.srcatatan,
    srnoref = EXCLUDED.srnoref,
    srtglnoref = EXCLUDED.srtglnoref,
    srtglpenutupan = EXCLUDED.srtglpenutupan,
    srmatauang = EXCLUDED.srmatauang,
    srkurs = EXCLUDED.srkurs,
    srhargatermasukpajak = EXCLUDED.srhargatermasukpajak,
    srtotal = EXCLUDED.srtotal,
    srdiskonpersen = EXCLUDED.srdiskonpersen,
    srjmldiskon = EXCLUDED.srjmldiskon,
    srtotalpajak1detail = EXCLUDED.srtotalpajak1detail,
    srtotalpajak2detail = EXCLUDED.srtotalpajak2detail,
    srbiayalainpersen = EXCLUDED.srbiayalainpersen,
    srbiayalain = EXCLUDED.srbiayalain,
    srtotaltransaksi = EXCLUDED.srtotaltransaksi,
    srsisatransaksi = EXCLUDED.srsisatransaksi,
    srjmlbayar = EXCLUDED.srjmlbayar,
    srstatuslunas = EXCLUDED.srstatuslunas,
    srtgllunas = EXCLUDED.srtgllunas,
    srnofakturpajak = EXCLUDED.srnofakturpajak,
    srsdhbayarpajak = EXCLUDED.srsdhbayarpajak,
    srtglbayarpajak = EXCLUDED.srtglbayarpajak,
    srrekdiskon = EXCLUDED.srrekdiskon,
    srrekpajak1 = EXCLUDED.srrekpajak1,
    srrekpajak2 = EXCLUDED.srrekpajak2,
    srrekbiayalain = EXCLUDED.srrekbiayalain,
    srreksisa = EXCLUDED.srreksisa,
    srrekbayar = EXCLUDED.srrekbayar,
    sridsq = EXCLUDED.sridsq,
    sridso = EXCLUDED.sridso,
    sridpi = EXCLUDED.sridpi,
    sridpl = EXCLUDED.sridpl,
    sriddo = EXCLUDED.sriddo,
    sriddr = EXCLUDED.sriddr,
    sridsi = EXCLUDED.sridsi,
    sridrnr = EXCLUDED.sridrnr,
    srstatussie = EXCLUDED.srstatussie,
    srtglsie = EXCLUDED.srtglsie,
    srstatus = EXCLUDED.srstatus,
    srstatussebelumnya = EXCLUDED.srstatussebelumnya,
    srjmlrevisi = EXCLUDED.srjmlrevisi,
    srcetakanke = EXCLUDED.srcetakanke,
    srposting = EXCLUDED.srposting,
    srpostingtgl = EXCLUDED.srpostingtgl,
    srtutupperiode = EXCLUDED.srtutupperiode,
    srisclose = EXCLUDED.srisclose,
    srinputtgl = EXCLUDED.srinputtgl,
    srmodifikasiuser = EXCLUDED.srmodifikasiuser,
    srmodifikasitgl = EXCLUDED.srmodifikasitgl,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m5_sr_detail
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m5_sr_detail'
)
INSERT INTO m5_sr_detail (
    idsrdetail, idsr, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, idhppkhususkeluar, idhppfifokeluar, harga, hargapricelist, hpp, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudangasal, gudangtransit, gudangtujuan, rekpersediaan, rekhargapokok, rekdiskonpenjualan, rekreturpenjualan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idsqdetail, idsodetail, idpidetail, idpldetail, iddodetail, iddrdetail, idsidetail, idrnrdetail, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    idsrdetail, idsr, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, idhppkhususkeluar, idhppfifokeluar, harga, hargapricelist, hpp, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudangasal, gudangtransit, gudangtujuan, rekpersediaan, rekhargapokok, rekdiskonpenjualan, rekreturpenjualan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idsqdetail, idsodetail, idpidetail, idpldetail, iddodetail, iddrdetail, idsidetail, idrnrdetail, isclose, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'idsrdetail', '')::bigint AS idsrdetail,
        NULLIF(row_payload ->> 'idsr', '')::bigint AS idsr,
        NULLIF(row_payload ->> 'idbarang', '')::bigint AS idbarang,
        row_payload ->> 'namabarang' AS namabarang,
        row_payload ->> 'tipebarang' AS tipebarang,
        NULLIF(row_payload ->> 'jml', '')::numeric(20,6) AS jml,
        row_payload ->> 'satuan' AS satuan,
        NULLIF(row_payload ->> 'nilaisatuan', '')::numeric(20,6) AS nilaisatuan,
        NULLIF(row_payload ->> 'jmlbarang', '')::numeric(20,6) AS jmlbarang,
        row_payload ->> 'satuanbarang' AS satuanbarang,
        row_payload ->> 'matauang' AS matauang,
        NULLIF(row_payload ->> 'kurs', '')::numeric(20,6) AS kurs,
        NULLIF(row_payload ->> 'idhppkhususkeluar', '')::bigint AS idhppkhususkeluar,
        NULLIF(row_payload ->> 'idhppfifokeluar', '')::bigint AS idhppfifokeluar,
        NULLIF(row_payload ->> 'harga', '')::numeric(20,6) AS harga,
        NULLIF(row_payload ->> 'hargapricelist', '')::numeric(20,6) AS hargapricelist,
        row_payload ->> 'hpp' AS hpp,
        NULLIF(row_payload ->> 'diskon', '')::numeric(20,6) AS diskon,
        NULLIF(row_payload ->> 'jmldiskon', '')::numeric(20,6) AS jmldiskon,
        NULLIF(row_payload ->> 'pajak1', '')::numeric(20,6) AS pajak1,
        NULLIF(row_payload ->> 'jmlpajak1', '')::numeric(20,6) AS jmlpajak1,
        NULLIF(row_payload ->> 'pajak2', '')::numeric(20,6) AS pajak2,
        NULLIF(row_payload ->> 'jmlpajak2', '')::numeric(20,6) AS jmlpajak2,
        row_payload ->> 'cabang' AS cabang,
        row_payload ->> 'lokasi' AS lokasi,
        row_payload ->> 'gudangasal' AS gudangasal,
        row_payload ->> 'gudangtransit' AS gudangtransit,
        row_payload ->> 'gudangtujuan' AS gudangtujuan,
        row_payload ->> 'rekpersediaan' AS rekpersediaan,
        NULLIF(row_payload ->> 'rekhargapokok', '')::numeric(20,6) AS rekhargapokok,
        NULLIF(row_payload ->> 'rekdiskonpenjualan', '')::numeric(20,6) AS rekdiskonpenjualan,
        row_payload ->> 'rekreturpenjualan' AS rekreturpenjualan,
        row_payload ->> 'costcenter' AS costcenter,
        row_payload ->> 'divisi' AS divisi,
        row_payload ->> 'subdivisi' AS subdivisi,
        row_payload ->> 'proyek' AS proyek,
        row_payload ->> 'catatan' AS catatan,
        row_payload ->> 'urutan' AS urutan,
        NULLIF(row_payload ->> 'idsqdetail', '')::bigint AS idsqdetail,
        NULLIF(row_payload ->> 'idsodetail', '')::bigint AS idsodetail,
        NULLIF(row_payload ->> 'idpidetail', '')::bigint AS idpidetail,
        NULLIF(row_payload ->> 'idpldetail', '')::bigint AS idpldetail,
        NULLIF(row_payload ->> 'iddodetail', '')::bigint AS iddodetail,
        NULLIF(row_payload ->> 'iddrdetail', '')::bigint AS iddrdetail,
        NULLIF(row_payload ->> 'idsidetail', '')::bigint AS idsidetail,
        NULLIF(row_payload ->> 'idrnrdetail', '')::bigint AS idrnrdetail,
        NULLIF(row_payload ->> 'isclose', '')::bigint AS isclose,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'idsrdetail') IS NOT NULL
) AS prepared
ON CONFLICT (idsrdetail) DO UPDATE
SET
    idsr = EXCLUDED.idsr,
    idbarang = EXCLUDED.idbarang,
    namabarang = EXCLUDED.namabarang,
    tipebarang = EXCLUDED.tipebarang,
    jml = EXCLUDED.jml,
    satuan = EXCLUDED.satuan,
    nilaisatuan = EXCLUDED.nilaisatuan,
    jmlbarang = EXCLUDED.jmlbarang,
    satuanbarang = EXCLUDED.satuanbarang,
    matauang = EXCLUDED.matauang,
    kurs = EXCLUDED.kurs,
    idhppkhususkeluar = EXCLUDED.idhppkhususkeluar,
    idhppfifokeluar = EXCLUDED.idhppfifokeluar,
    harga = EXCLUDED.harga,
    hargapricelist = EXCLUDED.hargapricelist,
    hpp = EXCLUDED.hpp,
    diskon = EXCLUDED.diskon,
    jmldiskon = EXCLUDED.jmldiskon,
    pajak1 = EXCLUDED.pajak1,
    jmlpajak1 = EXCLUDED.jmlpajak1,
    pajak2 = EXCLUDED.pajak2,
    jmlpajak2 = EXCLUDED.jmlpajak2,
    cabang = EXCLUDED.cabang,
    lokasi = EXCLUDED.lokasi,
    gudangasal = EXCLUDED.gudangasal,
    gudangtransit = EXCLUDED.gudangtransit,
    gudangtujuan = EXCLUDED.gudangtujuan,
    rekpersediaan = EXCLUDED.rekpersediaan,
    rekhargapokok = EXCLUDED.rekhargapokok,
    rekdiskonpenjualan = EXCLUDED.rekdiskonpenjualan,
    rekreturpenjualan = EXCLUDED.rekreturpenjualan,
    costcenter = EXCLUDED.costcenter,
    divisi = EXCLUDED.divisi,
    subdivisi = EXCLUDED.subdivisi,
    proyek = EXCLUDED.proyek,
    catatan = EXCLUDED.catatan,
    urutan = EXCLUDED.urutan,
    idsqdetail = EXCLUDED.idsqdetail,
    idsodetail = EXCLUDED.idsodetail,
    idpidetail = EXCLUDED.idpidetail,
    idpldetail = EXCLUDED.idpldetail,
    iddodetail = EXCLUDED.iddodetail,
    iddrdetail = EXCLUDED.iddrdetail,
    idsidetail = EXCLUDED.idsidetail,
    idrnrdetail = EXCLUDED.idrnrdetail,
    isclose = EXCLUDED.isclose,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m_12_pos_category
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m_12_pos_category'
)
INSERT INTO m_12_pos_category (
    pcaktif, pccatatan, pccustomdate1, pccustomdate2, pccustomdate3, pccustomdbl1, pccustomdbl2, pccustomdbl3, pccustomint1, pccustomint2, pccustomint3, pccustomtext1, pccustomtext2, pccustomtext3, pccustomtext4, pccustomtext5, pcidhistory, pcindeksharga, pcinputtgl, pcinputuser, pckode, pcmodifikasitgl, pcmodifikasiuser, pcnama, pctipepos, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    pcaktif, pccatatan, pccustomdate1, pccustomdate2, pccustomdate3, pccustomdbl1, pccustomdbl2, pccustomdbl3, pccustomint1, pccustomint2, pccustomint3, pccustomtext1, pccustomtext2, pccustomtext3, pccustomtext4, pccustomtext5, pcidhistory, pcindeksharga, pcinputtgl, pcinputuser, pckode, pcmodifikasitgl, pcmodifikasiuser, pcnama, pctipepos, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'pcaktif', '')::bigint AS pcaktif,
        row_payload ->> 'pccatatan' AS pccatatan,
        NULLIF(row_payload ->> 'pccustomdate1', '')::timestamptz AS pccustomdate1,
        NULLIF(row_payload ->> 'pccustomdate2', '')::timestamptz AS pccustomdate2,
        NULLIF(row_payload ->> 'pccustomdate3', '')::timestamptz AS pccustomdate3,
        row_payload ->> 'pccustomdbl1' AS pccustomdbl1,
        row_payload ->> 'pccustomdbl2' AS pccustomdbl2,
        row_payload ->> 'pccustomdbl3' AS pccustomdbl3,
        row_payload ->> 'pccustomint1' AS pccustomint1,
        row_payload ->> 'pccustomint2' AS pccustomint2,
        row_payload ->> 'pccustomint3' AS pccustomint3,
        row_payload ->> 'pccustomtext1' AS pccustomtext1,
        row_payload ->> 'pccustomtext2' AS pccustomtext2,
        row_payload ->> 'pccustomtext3' AS pccustomtext3,
        row_payload ->> 'pccustomtext4' AS pccustomtext4,
        row_payload ->> 'pccustomtext5' AS pccustomtext5,
        NULLIF(row_payload ->> 'pcidhistory', '')::bigint AS pcidhistory,
        NULLIF(row_payload ->> 'pcindeksharga', '')::numeric(20,6) AS pcindeksharga,
        NULLIF(row_payload ->> 'pcinputtgl', '')::timestamptz AS pcinputtgl,
        row_payload ->> 'pcinputuser' AS pcinputuser,
        row_payload ->> 'pckode' AS pckode,
        NULLIF(row_payload ->> 'pcmodifikasitgl', '')::timestamptz AS pcmodifikasitgl,
        row_payload ->> 'pcmodifikasiuser' AS pcmodifikasiuser,
        row_payload ->> 'pcnama' AS pcnama,
        row_payload ->> 'pctipepos' AS pctipepos,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'pckode') IS NOT NULL
) AS prepared
ON CONFLICT (pckode) DO UPDATE
SET
    pcaktif = EXCLUDED.pcaktif,
    pccatatan = EXCLUDED.pccatatan,
    pccustomdate1 = EXCLUDED.pccustomdate1,
    pccustomdate2 = EXCLUDED.pccustomdate2,
    pccustomdate3 = EXCLUDED.pccustomdate3,
    pccustomdbl1 = EXCLUDED.pccustomdbl1,
    pccustomdbl2 = EXCLUDED.pccustomdbl2,
    pccustomdbl3 = EXCLUDED.pccustomdbl3,
    pccustomint1 = EXCLUDED.pccustomint1,
    pccustomint2 = EXCLUDED.pccustomint2,
    pccustomint3 = EXCLUDED.pccustomint3,
    pccustomtext1 = EXCLUDED.pccustomtext1,
    pccustomtext2 = EXCLUDED.pccustomtext2,
    pccustomtext3 = EXCLUDED.pccustomtext3,
    pccustomtext4 = EXCLUDED.pccustomtext4,
    pccustomtext5 = EXCLUDED.pccustomtext5,
    pcidhistory = EXCLUDED.pcidhistory,
    pcindeksharga = EXCLUDED.pcindeksharga,
    pcinputtgl = EXCLUDED.pcinputtgl,
    pcinputuser = EXCLUDED.pcinputuser,
    pcmodifikasitgl = EXCLUDED.pcmodifikasitgl,
    pcmodifikasiuser = EXCLUDED.pcmodifikasiuser,
    pcnama = EXCLUDED.pcnama,
    pctipepos = EXCLUDED.pctipepos,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m_12_pos_voucher_in
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m_12_pos_voucher_in'
)
INSERT INTO m_12_pos_voucher_in (
    picustomdate1, picustomdate2, picustomdate3, picustomdbl1, picustomdbl2, picustomdbl3, picustomint1, picustomint2, picustomint3, picustomtext1, picustomtext2, picustomtext3, picustomtext4, picustomtext5, pidiskonjual1, pidiskonjual2, pidiskonjual3, pidiskonjual4, pidiskonjual5, pihargaedited, pihargajual1, pihargajual2, pihargajual3, pihargajual4, pihargajual5, piid, piidbarang, pijml1, pijml2, pijmlpoint, pikategori, pinotransaksi, pioperator, pistokmaksimal, pistokminimal, pistokminorder, pistokreorder, vicabang, vicustomdate1, vicustomdate2, vicustomdate3, vicustomdbl1, vicustomdbl2, vicustomdbl3, vicustomtext1, vicustomtext2, vicustomtext3, viid, viisclose, vijml, vijmlbayar, vijmlbayarvalas, vijmlvalas, vikategori, vikode, vilokasi, vimatauang, vitglbuat, vitglexpired, vitgllunas, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    picustomdate1, picustomdate2, picustomdate3, picustomdbl1, picustomdbl2, picustomdbl3, picustomint1, picustomint2, picustomint3, picustomtext1, picustomtext2, picustomtext3, picustomtext4, picustomtext5, pidiskonjual1, pidiskonjual2, pidiskonjual3, pidiskonjual4, pidiskonjual5, pihargaedited, pihargajual1, pihargajual2, pihargajual3, pihargajual4, pihargajual5, piid, piidbarang, pijml1, pijml2, pijmlpoint, pikategori, pinotransaksi, pioperator, pistokmaksimal, pistokminimal, pistokminorder, pistokreorder, vicabang, vicustomdate1, vicustomdate2, vicustomdate3, vicustomdbl1, vicustomdbl2, vicustomdbl3, vicustomtext1, vicustomtext2, vicustomtext3, viid, viisclose, vijml, vijmlbayar, vijmlbayarvalas, vijmlvalas, vikategori, vikode, vilokasi, vimatauang, vitglbuat, vitglexpired, vitgllunas, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'picustomdate1', '')::timestamptz AS picustomdate1,
        NULLIF(row_payload ->> 'picustomdate2', '')::timestamptz AS picustomdate2,
        NULLIF(row_payload ->> 'picustomdate3', '')::timestamptz AS picustomdate3,
        row_payload ->> 'picustomdbl1' AS picustomdbl1,
        row_payload ->> 'picustomdbl2' AS picustomdbl2,
        row_payload ->> 'picustomdbl3' AS picustomdbl3,
        row_payload ->> 'picustomint1' AS picustomint1,
        row_payload ->> 'picustomint2' AS picustomint2,
        row_payload ->> 'picustomint3' AS picustomint3,
        row_payload ->> 'picustomtext1' AS picustomtext1,
        row_payload ->> 'picustomtext2' AS picustomtext2,
        row_payload ->> 'picustomtext3' AS picustomtext3,
        row_payload ->> 'picustomtext4' AS picustomtext4,
        row_payload ->> 'picustomtext5' AS picustomtext5,
        NULLIF(row_payload ->> 'pidiskonjual1', '')::bigint AS pidiskonjual1,
        NULLIF(row_payload ->> 'pidiskonjual2', '')::bigint AS pidiskonjual2,
        NULLIF(row_payload ->> 'pidiskonjual3', '')::bigint AS pidiskonjual3,
        NULLIF(row_payload ->> 'pidiskonjual4', '')::bigint AS pidiskonjual4,
        NULLIF(row_payload ->> 'pidiskonjual5', '')::bigint AS pidiskonjual5,
        NULLIF(row_payload ->> 'pihargaedited', '')::numeric(20,6) AS pihargaedited,
        NULLIF(row_payload ->> 'pihargajual1', '')::numeric(20,6) AS pihargajual1,
        NULLIF(row_payload ->> 'pihargajual2', '')::numeric(20,6) AS pihargajual2,
        NULLIF(row_payload ->> 'pihargajual3', '')::numeric(20,6) AS pihargajual3,
        NULLIF(row_payload ->> 'pihargajual4', '')::numeric(20,6) AS pihargajual4,
        NULLIF(row_payload ->> 'pihargajual5', '')::numeric(20,6) AS pihargajual5,
        NULLIF(row_payload ->> 'piid', '')::bigint AS piid,
        NULLIF(row_payload ->> 'piidbarang', '')::bigint AS piidbarang,
        NULLIF(row_payload ->> 'pijml1', '')::numeric(20,6) AS pijml1,
        NULLIF(row_payload ->> 'pijml2', '')::numeric(20,6) AS pijml2,
        NULLIF(row_payload ->> 'pijmlpoint', '')::numeric(20,6) AS pijmlpoint,
        row_payload ->> 'pikategori' AS pikategori,
        row_payload ->> 'pinotransaksi' AS pinotransaksi,
        row_payload ->> 'pioperator' AS pioperator,
        row_payload ->> 'pistokmaksimal' AS pistokmaksimal,
        row_payload ->> 'pistokminimal' AS pistokminimal,
        row_payload ->> 'pistokminorder' AS pistokminorder,
        row_payload ->> 'pistokreorder' AS pistokreorder,
        row_payload ->> 'vicabang' AS vicabang,
        NULLIF(row_payload ->> 'vicustomdate1', '')::timestamptz AS vicustomdate1,
        NULLIF(row_payload ->> 'vicustomdate2', '')::timestamptz AS vicustomdate2,
        NULLIF(row_payload ->> 'vicustomdate3', '')::timestamptz AS vicustomdate3,
        row_payload ->> 'vicustomdbl1' AS vicustomdbl1,
        row_payload ->> 'vicustomdbl2' AS vicustomdbl2,
        row_payload ->> 'vicustomdbl3' AS vicustomdbl3,
        row_payload ->> 'vicustomtext1' AS vicustomtext1,
        row_payload ->> 'vicustomtext2' AS vicustomtext2,
        row_payload ->> 'vicustomtext3' AS vicustomtext3,
        NULLIF(row_payload ->> 'viid', '')::bigint AS viid,
        NULLIF(row_payload ->> 'viisclose', '')::bigint AS viisclose,
        NULLIF(row_payload ->> 'vijml', '')::numeric(20,6) AS vijml,
        NULLIF(row_payload ->> 'vijmlbayar', '')::numeric(20,6) AS vijmlbayar,
        NULLIF(row_payload ->> 'vijmlbayarvalas', '')::numeric(20,6) AS vijmlbayarvalas,
        NULLIF(row_payload ->> 'vijmlvalas', '')::numeric(20,6) AS vijmlvalas,
        row_payload ->> 'vikategori' AS vikategori,
        row_payload ->> 'vikode' AS vikode,
        row_payload ->> 'vilokasi' AS vilokasi,
        row_payload ->> 'vimatauang' AS vimatauang,
        NULLIF(row_payload ->> 'vitglbuat', '')::timestamptz AS vitglbuat,
        NULLIF(row_payload ->> 'vitglexpired', '')::timestamptz AS vitglexpired,
        NULLIF(row_payload ->> 'vitgllunas', '')::timestamptz AS vitgllunas,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'viid') IS NOT NULL
) AS prepared
ON CONFLICT (viid) DO UPDATE
SET
    picustomdate1 = EXCLUDED.picustomdate1,
    picustomdate2 = EXCLUDED.picustomdate2,
    picustomdate3 = EXCLUDED.picustomdate3,
    picustomdbl1 = EXCLUDED.picustomdbl1,
    picustomdbl2 = EXCLUDED.picustomdbl2,
    picustomdbl3 = EXCLUDED.picustomdbl3,
    picustomint1 = EXCLUDED.picustomint1,
    picustomint2 = EXCLUDED.picustomint2,
    picustomint3 = EXCLUDED.picustomint3,
    picustomtext1 = EXCLUDED.picustomtext1,
    picustomtext2 = EXCLUDED.picustomtext2,
    picustomtext3 = EXCLUDED.picustomtext3,
    picustomtext4 = EXCLUDED.picustomtext4,
    picustomtext5 = EXCLUDED.picustomtext5,
    pidiskonjual1 = EXCLUDED.pidiskonjual1,
    pidiskonjual2 = EXCLUDED.pidiskonjual2,
    pidiskonjual3 = EXCLUDED.pidiskonjual3,
    pidiskonjual4 = EXCLUDED.pidiskonjual4,
    pidiskonjual5 = EXCLUDED.pidiskonjual5,
    pihargaedited = EXCLUDED.pihargaedited,
    pihargajual1 = EXCLUDED.pihargajual1,
    pihargajual2 = EXCLUDED.pihargajual2,
    pihargajual3 = EXCLUDED.pihargajual3,
    pihargajual4 = EXCLUDED.pihargajual4,
    pihargajual5 = EXCLUDED.pihargajual5,
    piid = EXCLUDED.piid,
    piidbarang = EXCLUDED.piidbarang,
    pijml1 = EXCLUDED.pijml1,
    pijml2 = EXCLUDED.pijml2,
    pijmlpoint = EXCLUDED.pijmlpoint,
    pikategori = EXCLUDED.pikategori,
    pinotransaksi = EXCLUDED.pinotransaksi,
    pioperator = EXCLUDED.pioperator,
    pistokmaksimal = EXCLUDED.pistokmaksimal,
    pistokminimal = EXCLUDED.pistokminimal,
    pistokminorder = EXCLUDED.pistokminorder,
    pistokreorder = EXCLUDED.pistokreorder,
    vicabang = EXCLUDED.vicabang,
    vicustomdate1 = EXCLUDED.vicustomdate1,
    vicustomdate2 = EXCLUDED.vicustomdate2,
    vicustomdate3 = EXCLUDED.vicustomdate3,
    vicustomdbl1 = EXCLUDED.vicustomdbl1,
    vicustomdbl2 = EXCLUDED.vicustomdbl2,
    vicustomdbl3 = EXCLUDED.vicustomdbl3,
    vicustomtext1 = EXCLUDED.vicustomtext1,
    vicustomtext2 = EXCLUDED.vicustomtext2,
    vicustomtext3 = EXCLUDED.vicustomtext3,
    viisclose = EXCLUDED.viisclose,
    vijml = EXCLUDED.vijml,
    vijmlbayar = EXCLUDED.vijmlbayar,
    vijmlbayarvalas = EXCLUDED.vijmlbayarvalas,
    vijmlvalas = EXCLUDED.vijmlvalas,
    vikategori = EXCLUDED.vikategori,
    vikode = EXCLUDED.vikode,
    vilokasi = EXCLUDED.vilokasi,
    vimatauang = EXCLUDED.vimatauang,
    vitglbuat = EXCLUDED.vitglbuat,
    vitglexpired = EXCLUDED.vitglexpired,
    vitgllunas = EXCLUDED.vitgllunas,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;

-- Auto-generated upsert from cdc_current_state into m_12_pos_voucher_out
WITH normalized AS (
    SELECT
        record_key,
        source_table,
        updated_at,
        COALESCE(payload -> 'payload', payload) AS row_payload
    FROM cdc_current_state
    WHERE source_table = 'myerpplus.m_12_pos_voucher_out'
)
INSERT INTO m_12_pos_voucher_out (
    void, voidtransaksi, voidvi, voisclose, vojmlbayar, vojmlbayarvalas, vomatauang, vosumber, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
)
SELECT
    void, voidtransaksi, voidvi, voisclose, vojmlbayar, vojmlbayarvalas, vomatauang, vosumber, _cdc_record_key, _cdc_source_table, _cdc_updated_at, _cdc_deleted, _cdc_payload
FROM (
    SELECT
        NULLIF(row_payload ->> 'void', '')::bigint AS void,
        NULLIF(row_payload ->> 'voidtransaksi', '')::bigint AS voidtransaksi,
        NULLIF(row_payload ->> 'voidvi', '')::bigint AS voidvi,
        NULLIF(row_payload ->> 'voisclose', '')::bigint AS voisclose,
        NULLIF(row_payload ->> 'vojmlbayar', '')::numeric(20,6) AS vojmlbayar,
        NULLIF(row_payload ->> 'vojmlbayarvalas', '')::numeric(20,6) AS vojmlbayarvalas,
        row_payload ->> 'vomatauang' AS vomatauang,
        row_payload ->> 'vosumber' AS vosumber,
        record_key AS _cdc_record_key,
        source_table AS _cdc_source_table,
        updated_at AS _cdc_updated_at,
        COALESCE(LOWER(row_payload ->> '__deleted') = 'true', false) AS _cdc_deleted,
        row_payload AS _cdc_payload
    FROM normalized
    WHERE (row_payload ->> 'void') IS NOT NULL
) AS prepared
ON CONFLICT (void) DO UPDATE
SET
    voidtransaksi = EXCLUDED.voidtransaksi,
    voidvi = EXCLUDED.voidvi,
    voisclose = EXCLUDED.voisclose,
    vojmlbayar = EXCLUDED.vojmlbayar,
    vojmlbayarvalas = EXCLUDED.vojmlbayarvalas,
    vomatauang = EXCLUDED.vomatauang,
    vosumber = EXCLUDED.vosumber,
    _cdc_record_key = EXCLUDED._cdc_record_key,
    _cdc_source_table = EXCLUDED._cdc_source_table,
    _cdc_updated_at = EXCLUDED._cdc_updated_at,
    _cdc_deleted = EXCLUDED._cdc_deleted,
    _cdc_payload = EXCLUDED._cdc_payload;
