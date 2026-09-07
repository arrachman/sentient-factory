-- ============================================================================
-- SIMTERPADU: identitas tunggal untuk yayasan multi-lembaga
--
-- Cakupan lembaga: pondok, SMP, MA (dan lembaga yayasan lain di masa depan).
-- Prinsip utama:
--   1. people adalah identitas tunggal seseorang, bukan identitas per lembaga.
--   2. Afiliasi ke lembaga, peran, jabatan, dan status disimpan pada tabel relasi.
--   3. Satu orang dapat aktif di beberapa lembaga dan beberapa peran sekaligus.
--   4. Wali adalah people biasa yang dihubungkan ke peserta didik melalui relasi.
--
-- Target: MySQL 8.x
-- Jalankan sebagai baseline pada database baru. Untuk database yang sudah
-- berjalan, pecah menjadi Prisma migration sesuai urutan dependensi tabel.
-- ============================================================================

-- -----------------------------------------------------------------------------
-- 1. MASTER LEMBAGA
-- -----------------------------------------------------------------------------
CREATE TABLE institutions (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    parent_id       BIGINT UNSIGNED NULL,
    code            VARCHAR(40) NOT NULL,
    name            VARCHAR(150) NOT NULL,
    type            ENUM('foundation','pondok','school','madrasah','unit','other') NOT NULL,
    education_level ENUM('smp','ma') NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_institutions_parent
        FOREIGN KEY (parent_id) REFERENCES institutions(id) ON DELETE RESTRICT,
    UNIQUE KEY uq_institutions_code (code),
    INDEX idx_institutions_parent (parent_id, is_active),
    INDEX idx_institutions_type (type, education_level, is_active)
);

-- Contoh struktur yayasan. Jangan mengandalkan id; aplikasi selalu pakai code.
INSERT INTO institutions (parent_id, code, name, type, education_level) VALUES
(NULL, 'yayasan', 'Yayasan Pendidikan Islam Nuha', 'foundation', NULL),
((SELECT id FROM (SELECT id FROM institutions WHERE code = 'yayasan') AS x), 'pondok', 'Pondok Pesantren Nuha', 'pondok', NULL),
((SELECT id FROM (SELECT id FROM institutions WHERE code = 'yayasan') AS x), 'smp', 'SMP Islam Nuha', 'school', 'smp'),
((SELECT id FROM (SELECT id FROM institutions WHERE code = 'yayasan') AS x), 'ma', 'MA Nuha', 'madrasah', 'ma');

-- -----------------------------------------------------------------------------
-- 2. IDENTITAS DAN KONTAK
--
-- NIK/NISN/NUPTK disimpan terpisah sebagai nomor identitas agar satu people
-- dapat memiliki beberapa nomor resmi dan jenis nomor baru dapat ditambah tanpa
-- perubahan kolom. Nomor sensitif tidak dijadikan primary key.
-- -----------------------------------------------------------------------------
CREATE TABLE people (
    id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name         VARCHAR(150) NOT NULL,
    preferred_name    VARCHAR(100) NULL,
    gender            ENUM('male','female') NULL,
    birth_place       VARCHAR(120) NULL,
    birth_date        DATE NULL,
    blood_type        ENUM('A','B','AB','O') NULL,
    photo_path        VARCHAR(500) NULL,
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    deceased_at       DATE NULL,
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at        TIMESTAMP NULL,

    INDEX idx_people_name (full_name),
    INDEX idx_people_birth (birth_date),
    INDEX idx_people_active (is_active, deleted_at)
);

CREATE TABLE person_identifiers (
    id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    person_id         BIGINT UNSIGNED NOT NULL,
    type              ENUM('nik','kk','nisn','npsn','nuptk','passport','family_card','other') NOT NULL,
    value             VARCHAR(80) NOT NULL,
    issuer            VARCHAR(120) NULL,
    issued_at         DATE NULL,
    expires_at        DATE NULL,
    is_verified       BOOLEAN NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_person_identifiers_person
        FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE,
    UNIQUE KEY uq_identifier_type_value (type, value),
    INDEX idx_person_identifiers_person (person_id, type)
);

CREATE TABLE person_contacts (
    id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    person_id         BIGINT UNSIGNED NOT NULL,
    type              ENUM('mobile','whatsapp','email','telephone','other') NOT NULL,
    value             VARCHAR(255) NOT NULL,
    label             VARCHAR(60) NULL,
    is_primary        BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified       BOOLEAN NOT NULL DEFAULT FALSE,
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_person_contacts_person
        FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE,
    UNIQUE KEY uq_person_contact (person_id, type, value),
    INDEX idx_person_contacts_lookup (type, value),
    INDEX idx_person_contacts_person (person_id, is_primary, is_active)
);

-- Aturan "satu kontak utama per tipe" dipastikan pada service/application layer,
-- karena MySQL tidak punya partial unique index.

-- -----------------------------------------------------------------------------
-- 3. KAMUS PERAN DAN JABATAN
--
-- roles menjelaskan fungsi operasional (santri, siswa, guru, staff, pengasuh).
-- positions menjelaskan jabatan formal (kepala sekolah, wali kelas, musyrif).
-- Seseorang dapat memiliki banyak role dan banyak position pada periode sama.
-- -----------------------------------------------------------------------------
CREATE TABLE roles (
    id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code              VARCHAR(50) NOT NULL,
    name              VARCHAR(100) NOT NULL,
    category          ENUM('learner','educator','employee','guardian','leadership','other') NOT NULL,
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,

    UNIQUE KEY uq_roles_code (code),
    INDEX idx_roles_category (category, is_active)
);

INSERT INTO roles (code, name, category) VALUES
('santri', 'Santri', 'learner'),
('siswa', 'Siswa', 'learner'),
('guru', 'Guru', 'educator'),
('staff', 'Staf', 'employee'),
('pengasuh', 'Pengasuh', 'leadership'),
('wali', 'Wali Peserta Didik', 'guardian');

CREATE TABLE positions (
    id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code              VARCHAR(60) NOT NULL,
    name              VARCHAR(120) NOT NULL,
    category          ENUM('structural','teaching','caregiving','administrative','other') NOT NULL,
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,

    UNIQUE KEY uq_positions_code (code),
    INDEX idx_positions_category (category, is_active)
);

-- -----------------------------------------------------------------------------
-- 4. AFILIASI ORANG DENGAN LEMBAGA
--
-- Satu baris menyatakan bahwa people menjalankan satu role pada satu lembaga
-- dalam suatu periode. Contoh satu anak aktif sebagai santri di pondok dan
-- siswa di MA: dua row aktif dengan person_id yang sama.
-- -----------------------------------------------------------------------------
CREATE TABLE person_institution_roles (
    id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    person_id         BIGINT UNSIGNED NOT NULL,
    institution_id    BIGINT UNSIGNED NOT NULL,
    role_id           BIGINT UNSIGNED NOT NULL,
    started_on        DATE NOT NULL,
    ended_on          DATE NULL,
    status            ENUM('active','inactive','graduated','transferred','resigned','suspended') NOT NULL DEFAULT 'active',
    reference_number  VARCHAR(80) NULL,
    notes             VARCHAR(500) NULL,
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_pir_person FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE RESTRICT,
    CONSTRAINT fk_pir_institution FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE RESTRICT,
    CONSTRAINT fk_pir_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
    CONSTRAINT chk_pir_period CHECK (ended_on IS NULL OR ended_on >= started_on),
    UNIQUE KEY uq_pir_period (person_id, institution_id, role_id, started_on),
    INDEX idx_pir_active (institution_id, role_id, status, ended_on),
    INDEX idx_pir_person (person_id, status, ended_on)
);

-- Jabatan selalu melekat pada afiliasi. Dengan ini "wali kelas SMP" tidak
-- tertukar dengan jabatan orang yang sama di MA atau pondok.
CREATE TABLE person_role_positions (
    id                        BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    person_institution_role_id BIGINT UNSIGNED NOT NULL,
    position_id               BIGINT UNSIGNED NOT NULL,
    started_on                DATE NOT NULL,
    ended_on                  DATE NULL,
    appointment_number        VARCHAR(80) NULL,
    is_primary                BOOLEAN NOT NULL DEFAULT FALSE,
    created_at                TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_prp_affiliation
        FOREIGN KEY (person_institution_role_id) REFERENCES person_institution_roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_prp_position FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE RESTRICT,
    CONSTRAINT chk_prp_period CHECK (ended_on IS NULL OR ended_on >= started_on),
    UNIQUE KEY uq_prp_period (person_institution_role_id, position_id, started_on),
    INDEX idx_prp_position (position_id, ended_on)
);

-- -----------------------------------------------------------------------------
-- 5. PROFIL PESERTA DIDIK
--
-- Satu people bisa memiliki enrolment siswa di SMP/MA dan santri di pondok
-- secara bersamaan. Nomor induk bersifat spesifik terhadap lembaga + role.
-- -----------------------------------------------------------------------------
CREATE TABLE learner_enrollments (
    id                        BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    person_institution_role_id BIGINT UNSIGNED NOT NULL,
    academic_year             VARCHAR(9) NOT NULL,
    registration_number       VARCHAR(60) NULL,
    institution_student_number VARCHAR(60) NULL,
    entry_date                DATE NOT NULL,
    exit_date                 DATE NULL,
    status                    ENUM('active','graduated','transferred','withdrawn','suspended') NOT NULL DEFAULT 'active',
    created_at                TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_learner_enrollment_affiliation
        FOREIGN KEY (person_institution_role_id) REFERENCES person_institution_roles(id) ON DELETE RESTRICT,
    CONSTRAINT chk_learner_period CHECK (exit_date IS NULL OR exit_date >= entry_date),
    UNIQUE KEY uq_enrollment_year (person_institution_role_id, academic_year),
    UNIQUE KEY uq_enrollment_number (institution_student_number),
    INDEX idx_enrollment_active (academic_year, status)
);

-- -----------------------------------------------------------------------------
-- 6. RELASI WALI DENGAN PESERTA DIDIK
--
-- Relasi diarahkan ke people peserta didik, bukan enrolment tertentu, sebab
-- hubungan keluarga tidak berhenti saat anak pindah dari SMP ke MA atau pondok.
-- scope institution_id opsional dipakai bila mandat wali hanya berlaku pada satu
-- lembaga, misalnya wali asrama. NULL berarti berlaku lintas semua lembaga.
-- -----------------------------------------------------------------------------
CREATE TABLE guardian_relationships (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    guardian_person_id      BIGINT UNSIGNED NOT NULL,
    learner_person_id       BIGINT UNSIGNED NOT NULL,
    institution_id          BIGINT UNSIGNED NULL,
    relationship            ENUM('father','mother','grandfather','grandmother','sibling','relative','guardian','other') NOT NULL,
    is_primary              BOOLEAN NOT NULL DEFAULT FALSE,
    is_financial_responsible BOOLEAN NOT NULL DEFAULT FALSE,
    receives_notifications  BOOLEAN NOT NULL DEFAULT TRUE,
    lives_with_learner      BOOLEAN NULL,
    started_on              DATE NULL,
    ended_on                DATE NULL,
    notes                   VARCHAR(500) NULL,
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_gr_guardian FOREIGN KEY (guardian_person_id) REFERENCES people(id) ON DELETE RESTRICT,
    CONSTRAINT fk_gr_learner FOREIGN KEY (learner_person_id) REFERENCES people(id) ON DELETE RESTRICT,
    CONSTRAINT fk_gr_institution FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE RESTRICT,
    CONSTRAINT chk_gr_not_self CHECK (guardian_person_id <> learner_person_id),
    CONSTRAINT chk_gr_period CHECK (ended_on IS NULL OR started_on IS NULL OR ended_on >= started_on),
    UNIQUE KEY uq_guardian_relation (guardian_person_id, learner_person_id, institution_id, relationship),
    INDEX idx_gr_learner (learner_person_id, institution_id, is_primary),
    INDEX idx_gr_guardian (guardian_person_id, is_financial_responsible)
);

-- -----------------------------------------------------------------------------
-- 7. VIEW OPERASIONAL
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_active_person_roles AS
SELECT
    pir.id AS affiliation_id,
    p.id AS person_id,
    p.full_name,
    i.code AS institution_code,
    i.name AS institution_name,
    r.code AS role_code,
    r.name AS role_name,
    pir.started_on,
    pir.status
FROM person_institution_roles pir
JOIN people p ON p.id = pir.person_id AND p.deleted_at IS NULL
JOIN institutions i ON i.id = pir.institution_id
JOIN roles r ON r.id = pir.role_id
WHERE pir.status = 'active'
  AND (pir.ended_on IS NULL OR pir.ended_on >= CURRENT_DATE());

-- -----------------------------------------------------------------------------
-- 8. CONTOH QUERY
-- -----------------------------------------------------------------------------

-- Semua status seorang anak lintas lembaga.
-- SELECT * FROM v_active_person_roles WHERE person_id = :person_id;

-- Semua peserta didik yang menjadi santri di pondok sekaligus siswa di MA.
-- SELECT p.id, p.full_name
-- FROM people p
-- JOIN v_active_person_roles pondok ON pondok.person_id = p.id
-- JOIN v_active_person_roles ma ON ma.person_id = p.id
-- WHERE pondok.institution_code = 'pondok' AND pondok.role_code = 'santri'
--   AND ma.institution_code = 'ma' AND ma.role_code = 'siswa';

-- Wali utama dan penanggung jawab pembayaran seorang peserta didik.
-- SELECT guardian.full_name, gr.relationship, gr.is_primary, gr.is_financial_responsible
-- FROM guardian_relationships gr
-- JOIN people guardian ON guardian.id = gr.guardian_person_id
-- WHERE gr.learner_person_id = :learner_person_id
--   AND (gr.institution_id IS NULL OR gr.institution_id = :institution_id)
--   AND (gr.ended_on IS NULL OR gr.ended_on >= CURRENT_DATE())
-- ORDER BY gr.is_primary DESC, gr.is_financial_responsible DESC;

-- ============================================================================
-- ATURAN IMPLEMENTASI
-- ============================================================================
-- 1. Validasi pada NestJS wajib memastikan learner_enrollments hanya menunjuk
--    person_institution_roles yang role.category = 'learner'. MySQL FK tidak
--    dapat memvalidasi aturan lintas tabel ini.
-- 2. Validasi serupa memastikan person_role_positions hanya dibuat untuk
--    afiliasi yang sesuai dengan kebutuhan jabatan.
-- 3. Sebelum membuat guardian_relationships, aplikasi wajib memastikan learner
--    masih atau pernah mempunyai role siswa/santri; wali sendiri boleh memiliki
--    role lain (misalnya seorang guru sekaligus wali murid).
-- 4. Jangan menghapus people yang sudah punya riwayat. Gunakan deleted_at atau
--    tandai relasi/afiliasinya berakhir agar data akademik, kepesantrenan, dan
--    keuangan tetap terhubung.
-- 5. "Satu wali utama" dan "satu jabatan utama" per cakupan perlu dijaga oleh
--    transaksi/service layer atau trigger; MySQL tidak mendukung partial unique
--    index berdasarkan nilai TRUE.
