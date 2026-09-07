-- =====================================================================
-- MASTER WILAYAH: desa -> kecamatan -> kab/kota -> provinsi -> negara
--
-- Pola: satu tabel regions yang menunjuk ke dirinya sendiri (parent_id),
--       ditambah kolom pintasan leluhur supaya tidak perlu 4x self-join.
--
-- Target: MySQL 8 / MariaDB 10.2+ (butuh recursive CTE)
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. countries -> negara. Dipisah karena atributnya beda jenis
--    (kode telepon, mata uang) dan jumlahnya tetap ~200.
-- ---------------------------------------------------------------------
CREATE TABLE countries (
    id            SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    iso2          CHAR(2)  NOT NULL UNIQUE,      -- 'ID'
    iso3          CHAR(3)  NOT NULL UNIQUE,      -- 'IDN'
    numeric_code  CHAR(3)  NULL,                 -- '360'
    name          VARCHAR(100) NOT NULL,         -- 'Indonesia'
    name_local    VARCHAR(100) NULL,
    phone_code    VARCHAR(8)   NULL,             -- '+62'
    currency_code CHAR(3)      NULL,             -- 'IDR'
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,

    INDEX idx_countries_name (name)
);

-- ---------------------------------------------------------------------
-- 2. province dan cities -> tabel referensi provinsi serta kabupaten/kota
--    untuk modul yang masih membutuhkan tabel wilayah terpisah.
--    IF NOT EXISTS membuat definisi ini aman saat tabel sudah tersedia.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS province (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    country_id  SMALLINT UNSIGNED NOT NULL,
    code        VARCHAR(20)  NOT NULL,              -- kode Kemendagri: '32'
    name        VARCHAR(120) NOT NULL,              -- 'Jawa Barat'
    name_local  VARCHAR(120) NULL,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_province_country FOREIGN KEY (country_id) REFERENCES countries(id),
    UNIQUE KEY uq_province_code (country_id, code),
    INDEX idx_province_name (name),
    INDEX idx_province_active (country_id, is_active)
);

CREATE TABLE IF NOT EXISTS cities (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    province_id  BIGINT UNSIGNED NOT NULL,
    code         VARCHAR(20)  NOT NULL,             -- kode Kemendagri: '32.04'
    name         VARCHAR(120) NOT NULL,             -- 'Bandung'
    type_label   ENUM('Kabupaten','Kota') NOT NULL,
    is_active    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_cities_province FOREIGN KEY (province_id) REFERENCES province(id),
    UNIQUE KEY uq_cities_code (code),
    INDEX idx_cities_province (province_id, is_active),
    INDEX idx_cities_name (name)
);

-- ---------------------------------------------------------------------
-- 3. regions -> SEMUA tingkat wilayah dalam satu tabel
--
--    parent_id membentuk hirarkinya. Kolom province_id/city_id/
--    district_id adalah PINTASAN yang diisi otomatis — tanpa itu,
--    menampilkan alamat lengkap butuh 4 self-join di setiap baris.
-- ---------------------------------------------------------------------
CREATE TABLE regions (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    country_id   SMALLINT UNSIGNED NOT NULL,
    parent_id    BIGINT UNSIGNED NULL,           -- NULL = tingkat teratas

    level        ENUM('province','city','district','village') NOT NULL,
    code         VARCHAR(20)  NOT NULL,          -- kode Kemendagri: '32.04.12.2001'
    name         VARCHAR(120) NOT NULL,          -- 'Cileunyi Wetan'
    type_label   VARCHAR(30)  NULL,              -- 'Kabupaten','Kota','Desa','Kelurahan'

    -- === PINTASAN LELUHUR (diisi otomatis, jangan diedit manual) ====
    province_id  BIGINT UNSIGNED NULL,
    city_id      BIGINT UNSIGNED NULL,
    district_id  BIGINT UNSIGNED NULL,
    depth        TINYINT UNSIGNED NOT NULL DEFAULT 1,
    full_name    VARCHAR(400) NULL,              -- 'Cileunyi Wetan, Cileunyi, Kab. Bandung, Jawa Barat'

    -- === DATA TAMBAHAN ==============================================
    postal_code  CHAR(5)       NULL,             -- kode pos (biasanya di desa)
    latitude     DECIMAL(10,7) NULL,
    longitude    DECIMAL(10,7) NULL,
    area_km2     DECIMAL(12,4) NULL,
    population   INT UNSIGNED  NULL,
    is_active    BOOLEAN NOT NULL DEFAULT TRUE,  -- FALSE kalau sudah dimekarkan
    replaced_by_id BIGINT UNSIGNED NULL,         -- kalau wilayahnya dilebur/pecah
    created_at   TIMESTAMP NULL,
    updated_at   TIMESTAMP NULL,

    CONSTRAINT fk_regions_country  FOREIGN KEY (country_id) REFERENCES countries(id),
    CONSTRAINT fk_regions_parent   FOREIGN KEY (parent_id)  REFERENCES regions(id) ON DELETE CASCADE,
    CONSTRAINT fk_regions_province FOREIGN KEY (province_id) REFERENCES regions(id) ON DELETE SET NULL,
    CONSTRAINT fk_regions_city     FOREIGN KEY (city_id)     REFERENCES regions(id) ON DELETE SET NULL,
    CONSTRAINT fk_regions_district FOREIGN KEY (district_id) REFERENCES regions(id) ON DELETE SET NULL,
    CONSTRAINT fk_regions_replaced FOREIGN KEY (replaced_by_id) REFERENCES regions(id) ON DELETE SET NULL,

    UNIQUE KEY uq_region_code (country_id, code),
    INDEX idx_regions_parent   (parent_id, level, is_active),
    INDEX idx_regions_level    (level, is_active),
    INDEX idx_regions_ancestor (province_id, city_id, district_id),
    INDEX idx_regions_postal   (postal_code),
    FULLTEXT KEY ft_regions (name, full_name)
);

-- ---------------------------------------------------------------------
-- 3. region_aliases -> nama lain & ejaan lama, supaya pencarian tetap
--    ketemu walau petugas menulis 'Bandoeng' atau 'Kab Bdg'
-- ---------------------------------------------------------------------
CREATE TABLE region_aliases (
    id        BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    region_id BIGINT UNSIGNED NOT NULL,
    alias     VARCHAR(120) NOT NULL,
    type      ENUM('nama_lama','ejaan_lain','singkatan','bahasa_lokal') NOT NULL,

    CONSTRAINT fk_ra_region FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE,
    INDEX idx_ra_alias (alias)
);

-- ---------------------------------------------------------------------
-- 4. foreign_addresses -> alamat luar negeri yang tidak punya master
--    wilayah. Dipakai untuk alumni yang kuliah/kerja di luar.
-- ---------------------------------------------------------------------
CREATE TABLE foreign_addresses (
    id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    person_id     BIGINT UNSIGNED NOT NULL,
    country_id    SMALLINT UNSIGNED NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255) NULL,
    city_name     VARCHAR(120) NULL,             -- teks bebas
    state_name    VARCHAR(120) NULL,
    postal_code   VARCHAR(20)  NULL,
    is_current    BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_fa_person  FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE,
    CONSTRAINT fk_fa_country FOREIGN KEY (country_id) REFERENCES countries(id),
    INDEX idx_fa_person (person_id, is_current)
);


-- =====================================================================
-- 5. UBAH PEOPLE: 5 kolom teks -> 1 kolom FK
-- =====================================================================
ALTER TABLE people
    ADD COLUMN village_id BIGINT UNSIGNED NULL AFTER address_hamlet,
    ADD CONSTRAINT fk_people_village FOREIGN KEY (village_id) REFERENCES regions(id) ON DELETE SET NULL,
    ADD INDEX idx_people_village (village_id);

-- Backfill dari kolom teks lama (jalankan sekali, cek hasilnya dulu)
-- UPDATE people p
-- JOIN regions r ON r.level = 'village'
--                AND r.name = p.village
--                AND r.full_name LIKE CONCAT('%', p.district, '%')
--                AND r.full_name LIKE CONCAT('%', p.city, '%')
-- SET p.village_id = r.id
-- WHERE p.village_id IS NULL;

-- Cek yang gagal dipetakan SEBELUM menghapus kolom lama
-- SELECT id, full_name, village, district, city, province
-- FROM people WHERE village_id IS NULL AND village IS NOT NULL;

-- Setelah semua terpetakan, kolom teks bisa dibuang:
-- ALTER TABLE people
--     DROP COLUMN village, DROP COLUMN village_code, DROP COLUMN district,
--     DROP COLUMN city, DROP COLUMN province;
-- postal_code sebaiknya DIPERTAHANKAN sebagai override, karena satu desa
-- kadang punya beberapa kode pos.

-- Sama untuk alamat tambahan
ALTER TABLE person_addresses
    ADD COLUMN village_id BIGINT UNSIGNED NULL AFTER address_street,
    ADD CONSTRAINT fk_pa_village FOREIGN KEY (village_id) REFERENCES regions(id) ON DELETE SET NULL;

-- Dan untuk lembaga
ALTER TABLE institutions
    ADD COLUMN village_id     BIGINT UNSIGNED NULL,
    ADD COLUMN address_street VARCHAR(255) NULL,
    ADD COLUMN latitude       DECIMAL(10,7) NULL,
    ADD COLUMN longitude      DECIMAL(10,7) NULL,
    ADD CONSTRAINT fk_inst_village FOREIGN KEY (village_id) REFERENCES regions(id) ON DELETE SET NULL;


-- =====================================================================
-- 6. PROCEDURE: isi pintasan leluhur & full_name
--    Jalankan setelah impor data wilayah, atau setelah menambah wilayah baru.
-- =====================================================================
-- DELIMITER $$
-- CREATE PROCEDURE sp_rebuild_region_paths()
-- BEGIN
--     -- provinsi
--     UPDATE regions SET depth = 1, province_id = id, city_id = NULL,
--            district_id = NULL, full_name = name
--     WHERE level = 'province';
--
--     -- kabupaten/kota
--     UPDATE regions c
--     JOIN regions p ON p.id = c.parent_id
--     SET c.depth = 2, c.province_id = p.id, c.city_id = c.id, c.district_id = NULL,
--         c.full_name = CONCAT(COALESCE(c.type_label,''), ' ', c.name, ', ', p.name)
--     WHERE c.level = 'city';
--
--     -- kecamatan
--     UPDATE regions d
--     JOIN regions c ON c.id = d.parent_id
--     SET d.depth = 3, d.province_id = c.province_id, d.city_id = c.id,
--         d.district_id = d.id,
--         d.full_name = CONCAT(d.name, ', ', c.full_name)
--     WHERE d.level = 'district';
--
--     -- desa/kelurahan
--     UPDATE regions v
--     JOIN regions d ON d.id = v.parent_id
--     SET v.depth = 4, v.province_id = d.province_id, v.city_id = d.city_id,
--         v.district_id = d.id,
--         v.full_name = CONCAT(COALESCE(v.type_label,''), ' ', v.name, ', ', d.full_name)
--     WHERE v.level = 'village';
-- END$$
-- DELIMITER ;

-- CALL sp_rebuild_region_paths();


-- =====================================================================
-- SEED
-- PENTING: kode di bawah ini CONTOH, bukan data resmi. Ganti dengan
-- dataset Kemendagri/BPS lengkap (~83.000 desa) sebelum produksi.
-- Sumber umum: Permendagri kode & data wilayah administrasi terbaru.
-- =====================================================================
INSERT INTO countries (id, iso2, iso3, numeric_code, name, phone_code, currency_code) VALUES
(1, 'ID', 'IDN', '360', 'Indonesia',     '+62',  'IDR'),
(2, 'MY', 'MYS', '458', 'Malaysia',      '+60',  'MYR'),
(3, 'EG', 'EGY', '818', 'Mesir',         '+20',  'EGP'),
(4, 'SA', 'SAU', '682', 'Arab Saudi',    '+966', 'SAR'),
(5, 'SG', 'SGP', '702', 'Singapura',     '+65',  'SGD');

-- Provinsi
INSERT INTO regions (id, country_id, parent_id, level, code, name, type_label) VALUES
(1, 1, NULL, 'province', '32', 'Jawa Barat',   'Provinsi'),
(2, 1, NULL, 'province', '33', 'Jawa Tengah',  'Provinsi'),
(3, 1, NULL, 'province', '35', 'Jawa Timur',   'Provinsi');

-- Kabupaten / Kota
INSERT INTO regions (id, country_id, parent_id, level, code, name, type_label) VALUES
(11, 1, 1, 'city', '32.04', 'Bandung',      'Kabupaten'),
(12, 1, 1, 'city', '32.73', 'Bandung',      'Kota'),
(13, 1, 1, 'city', '32.05', 'Garut',        'Kabupaten'),
(14, 1, 1, 'city', '32.03', 'Cianjur',      'Kabupaten'),
(15, 1, 1, 'city', '32.06', 'Tasikmalaya',  'Kabupaten');

-- Kecamatan
INSERT INTO regions (id, country_id, parent_id, level, code, name, type_label) VALUES
(101, 1, 11, 'district', '32.04.12', 'Cileunyi',  'Kecamatan'),
(102, 1, 11, 'district', '32.04.13', 'Cimenyan',  'Kecamatan'),
(103, 1, 12, 'district', '32.73.09', 'Coblong',   'Kecamatan'),
(104, 1, 14, 'district', '32.03.05', 'Cugenang',  'Kecamatan');

-- Desa / Kelurahan
INSERT INTO regions (id, country_id, parent_id, level, code, name, type_label, postal_code, latitude, longitude) VALUES
(1001, 1, 101, 'village', '32.04.12.2001', 'Cileunyi Wetan', 'Desa',      '40622', -6.9389, 107.7614),
(1002, 1, 101, 'village', '32.04.12.2002', 'Cileunyi Kulon', 'Desa',      '40622', -6.9421, 107.7489),
(1003, 1, 101, 'village', '32.04.12.2003', 'Cinunuk',        'Desa',      '40624', -6.9295, 107.7358),
(1004, 1, 101, 'village', '32.04.12.2004', 'Cimekar',        'Desa',      '40623', -6.9512, 107.7201),
(1005, 1, 103, 'village', '32.73.09.1001', 'Cipaganti',      'Kelurahan', '40131', -6.8955, 107.6075),
(1006, 1, 104, 'village', '32.03.05.2007', 'Cugenang',       'Desa',      '43252', -6.7889, 107.0912);

-- Alias untuk pencarian
INSERT INTO region_aliases (region_id, alias, type) VALUES
(12, 'Bandoeng',   'ejaan_lain'),
(12, 'Kota Bdg',   'singkatan'),
(11, 'Kab Bdg',    'singkatan'),
(1,  'Jabar',      'singkatan'),
(1,  'Pasundan',   'bahasa_lokal');

-- CALL sp_rebuild_region_paths();
-- Hasil full_name desa 1001:
--   'Desa Cileunyi Wetan, Cileunyi, Kabupaten Bandung, Jawa Barat'

-- Pasang alamat ke orang & lembaga
UPDATE people SET village_id = 1001 WHERE id IN (20, 21, 23, 24, 25);
UPDATE people SET village_id = 1005 WHERE id = 6;
UPDATE people SET village_id = 1006 WHERE id IN (27, 28, 29);

UPDATE institutions
SET village_id = 1001, address_street = 'Jl. Pesantren No. 1',
    latitude = -6.9391, longitude = 107.7620
WHERE code IN ('yayasan','pondok','smp','ma','diniah');

-- Alumni di luar negeri
INSERT INTO foreign_addresses (person_id, country_id, address_line1, city_name, postal_code) VALUES
(16, 3, 'Hay El-Asher, Building 12, Apt 4', 'Kairo', '11765');


-- =====================================================================
-- VIEW: alamat siap tampil
-- =====================================================================
-- CREATE OR REPLACE VIEW v_person_address AS
-- SELECT p.id AS person_id,
--        p.full_name,
--        p.address_street,
--        p.address_rt, p.address_rw, p.address_hamlet,
--        v.name        AS village,
--        v.type_label  AS village_type,
--        d.name        AS district,
--        c.name        AS city,
--        c.type_label  AS city_type,
--        pv.name       AS province,
--        co.name       AS country,
--        COALESCE(p.postal_code, v.postal_code) AS postal_code,
--        CONCAT_WS(', ',
--            NULLIF(p.address_street,''),
--            CONCAT_WS(' ', NULLIF(CONCAT('RT ', p.address_rt),'RT '),
--                           NULLIF(CONCAT('RW ', p.address_rw),'RW ')),
--            v.full_name,
--            COALESCE(p.postal_code, v.postal_code)
--        ) AS address_full
-- FROM people p
-- LEFT JOIN regions v    ON v.id  = p.village_id
-- LEFT JOIN regions d    ON d.id  = v.district_id
-- LEFT JOIN regions c    ON c.id  = v.city_id
-- LEFT JOIN regions pv   ON pv.id = v.province_id
-- LEFT JOIN countries co ON co.id = v.country_id;

-- Perhatikan: JOIN-nya rata, bukan berantai — karena pakai kolom pintasan.
-- Tanpa province_id/city_id/district_id, ini harus 4x self-join berurutan
-- yang jauh lebih lambat pada tabel besar.


-- =====================================================================
-- QUERY
-- =====================================================================

-- 1) Dropdown berjenjang (yang dipakai form pendaftaran)
-- SELECT id, name, type_label FROM regions
-- WHERE level = 'province' AND country_id = 1 AND is_active = TRUE ORDER BY name;
--
-- SELECT id, CONCAT(type_label,' ',name) AS name FROM regions
-- WHERE parent_id = 1 AND is_active = TRUE ORDER BY type_label DESC, name;
--
-- SELECT id, name FROM regions WHERE parent_id = 11 ORDER BY name;   -- kecamatan
-- SELECT id, name, postal_code FROM regions WHERE parent_id = 101 ORDER BY name; -- desa

-- 2) Autocomplete satu kotak: cari desa dari teks apa saja
-- SELECT r.id, r.full_name, r.postal_code
-- FROM regions r
-- WHERE r.level = 'village' AND r.is_active = TRUE
--   AND (r.name LIKE 'cileu%' OR r.full_name LIKE '%cileu%')
-- LIMIT 20;
--
-- Termasuk alias:
-- SELECT DISTINCT r.id, r.full_name FROM regions r
-- LEFT JOIN region_aliases a ON a.region_id = r.id
-- WHERE r.name LIKE '%bandoeng%' OR a.alias LIKE '%bandoeng%';

-- 3) Naik ke atas: leluhur satu desa (recursive CTE)
-- WITH RECURSIVE up AS (
--     SELECT id, parent_id, level, name, type_label, 0 AS jarak
--     FROM regions WHERE id = 1001
--     UNION ALL
--     SELECT r.id, r.parent_id, r.level, r.name, r.type_label, up.jarak + 1
--     FROM regions r JOIN up ON r.id = up.parent_id
-- )
-- SELECT level, type_label, name FROM up ORDER BY jarak DESC;

-- 4) Turun ke bawah: semua desa di bawah satu provinsi
-- SELECT COUNT(*) FROM regions WHERE province_id = 1 AND level = 'village';
--    ^ instan karena pakai pintasan, tanpa rekursi

-- 5) Sebaran asal santri per kabupaten (laporan yang paling sering diminta)
-- SELECT c.type_label, c.name AS kabupaten, pv.name AS provinsi,
--        COUNT(DISTINCT p.id) AS jumlah
-- FROM person_roles pr
-- JOIN people p     ON p.id = pr.person_id
-- JOIN regions v    ON v.id = p.village_id
-- JOIN regions c    ON c.id = v.city_id
-- JOIN regions pv   ON pv.id = v.province_id
-- WHERE pr.role_id = 1 AND pr.status = 'active'
-- GROUP BY c.id, c.type_label, c.name, pv.name
-- ORDER BY jumlah DESC;

-- 6) Sebaran per kecamatan dalam satu kabupaten (drill down)
-- SELECT d.name AS kecamatan, COUNT(DISTINCT p.id) AS jumlah
-- FROM person_roles pr
-- JOIN people p  ON p.id = pr.person_id
-- JOIN regions v ON v.id = p.village_id
-- JOIN regions d ON d.id = v.district_id
-- WHERE pr.status = 'active' AND v.city_id = 11
-- GROUP BY d.id, d.name ORDER BY jumlah DESC;

-- 7) Santri dari luar provinsi (untuk kuota asrama / tiket pulang)
-- SELECT pv.name AS provinsi, COUNT(DISTINCT p.id) AS jumlah
-- FROM person_roles pr
-- JOIN people p   ON p.id = pr.person_id
-- JOIN regions v  ON v.id = p.village_id
-- JOIN regions pv ON pv.id = v.province_id
-- WHERE pr.role_id = 1 AND pr.status = 'active' AND pv.id <> 1
-- GROUP BY pv.id, pv.name ORDER BY jumlah DESC;

-- 8) Jarak rumah ke pesantren (haversine), untuk verifikasi mukim
-- SELECT p.full_name,
--        ROUND(6371 * ACOS(
--            COS(RADIANS(i.latitude)) * COS(RADIANS(v.latitude)) *
--            COS(RADIANS(v.longitude) - RADIANS(i.longitude)) +
--            SIN(RADIANS(i.latitude)) * SIN(RADIANS(v.latitude))
--        ), 2) AS km
-- FROM people p
-- JOIN regions v ON v.id = p.village_id AND v.latitude IS NOT NULL
-- CROSS JOIN institutions i
-- WHERE i.code = 'pondok' AND p.id = 23;

-- 9) Alumni yang tinggal di luar negeri
-- SELECT p.full_name, co.name AS negara, fa.city_name
-- FROM foreign_addresses fa
-- JOIN people p     ON p.id = fa.person_id
-- JOIN countries co ON co.id = fa.country_id
-- WHERE fa.is_current = TRUE;

-- 10) Audit: orang yang belum punya wilayah terisi
-- SELECT COUNT(*) AS belum_lengkap FROM people
-- WHERE village_id IS NULL AND deleted_at IS NULL;


-- =====================================================================
-- CATATAN PENERAPAN
-- =====================================================================
-- 1. Kolom province_id/city_id/district_id adalah DENORMALISASI yang
--    disengaja. Tanpa itu, laporan sebaran wilayah harus 4x self-join
--    per baris. Jangan diisi manual — selalu lewat sp_rebuild_region_paths().
--    Kalau pakai Laravel, taruh di observer/event model Region.
--
-- 2. Jangan pernah hard-code region id di aplikasi. Cari lewat code
--    ('32.04.12.2001'), karena id auto-increment akan berbeda kalau
--    dataset diimpor ulang.
--
-- 3. PEMEKARAN WILAYAH itu nyata dan sering. Desa dipecah, kabupaten
--    baru dibentuk. Jangan UPDATE nama atau hapus barisnya — set
--    is_active = FALSE dan isi replaced_by_id. Alamat lama di ijazah
--    yang sudah dicetak harus tetap bisa dibaca apa adanya.
--
-- 4. Karena alasan di atas, untuk dokumen resmi (ijazah, akta, SK)
--    sebaiknya simpan SNAPSHOT teks alamat pada saat dokumen dibuat,
--    bukan hanya village_id. Contoh: tambahkan kolom
--    address_snapshot VARCHAR(400) di tabel graduations.
--
-- 5. Impor dataset resmi lewat LOAD DATA INFILE, jangan INSERT satu-satu.
--    83.000 desa dengan INSERT biasa bisa memakan waktu belasan menit:
--      SET foreign_key_checks = 0;
--      LOAD DATA INFILE '/tmp/villages.csv' INTO TABLE regions
--        FIELDS TERMINATED BY ',' IGNORE 1 LINES (code, name, parent_code, ...);
--      SET foreign_key_checks = 1;
--      CALL sp_rebuild_region_paths();
--
-- 6. postal_code ada di dua tempat dan itu memang disengaja:
--    regions.postal_code sebagai default desa, people.postal_code
--    sebagai override — karena satu desa besar bisa punya beberapa
--    kode pos, dan sebaliknya satu kode pos bisa mencakup banyak desa.
--
-- 7. Untuk PostgreSQL, pertimbangkan tipe ltree atau kolom path
--    ('32.04.12.2001') dengan operator pencocokan prefiks — lebih
--    ringkas daripada tiga kolom pintasan. Di MySQL, kolom pintasan
--    tetap pendekatan paling praktis.
