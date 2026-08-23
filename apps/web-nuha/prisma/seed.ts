import { PrismaClient, JenisKelamin, StatusPendaftar, StatusSantri } from '@prisma/client';
import bcrypt from 'bcryptjs';
import data from './proto-data.json';

const prisma = new PrismaClient();
type PrototypeData = Record<string, Array<Record<string, unknown>>>;
const source = data as PrototypeData;

const BULAN: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, Mei: 4, Jun: 5, Jul: 6, Agu: 7, Sep: 8, Okt: 9, Nov: 10, Des: 11 };

/**
 * Prototype menulis tanggal dalam dua bentuk: "22 Agu 2026" dan "24 Agu" (tanpa
 * tahun, mis. pada agenda). Tanpa cabang kedua semua agenda jatuh ke tanggal
 * cadangan yang sama sehingga tabelnya hanya berisi satu baris.
 */
const parseDate = (value: unknown, tahunDefault = 2026): Date => {
  const text = String(value ?? '22 Agu 2026').replace(/–/g, '-');
  const lengkap = text.match(/(\d{1,2})\s+(Jan|Feb|Mar|Apr|Mei|Jun|Jul|Agu|Sep|Okt|Nov|Des)\s+(\d{4})/);
  if (lengkap) return new Date(Date.UTC(Number(lengkap[3]), BULAN[lengkap[2]], Number(lengkap[1])));
  const singkat = text.match(/(\d{1,2})\s+(Jan|Feb|Mar|Apr|Mei|Jun|Jul|Agu|Sep|Okt|Nov|Des)/);
  if (singkat) return new Date(Date.UTC(tahunDefault, BULAN[singkat[2]], Number(singkat[1])));
  return new Date('2026-08-22T00:00:00Z');
};

/**
 * Kolom `agenda.jam` hanya VarChar(16), sedangkan prototype menulis
 * "09.00 · Aula Utama". Ambil segmen jamnya saja lalu potong seaman kolom.
 */
const jamSingkat = (value: unknown): string => String(value ?? '').split('·')[0].trim().slice(0, 16);

/** Slug peran dari nama jabatan: "Musyrif Asrama" → "musyrif-asrama". */
const kunciPeran = (nama: string): string =>
  nama.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 32);

/** Peran tanpa grant menu apa pun — akses ditambahkan manual lewat Pengaturan. */
const perolehPeran = (nama: string) => {
  const key = kunciPeran(nama);
  return prisma.peran.upsert({ where: { key }, create: { key, nama }, update: { nama } });
};

const gender = (value: unknown): JenisKelamin => String(value) === 'P' ? JenisKelamin.P : JenisKelamin.L;
const pendaftarStatus = (value: unknown): StatusPendaftar => {
  const statuses: Record<string, StatusPendaftar> = { Baru: 'Baru', Verifikasi: 'Verifikasi', Seleksi: 'Seleksi', Lulus: 'Lulus', 'Tidak Lulus': 'TidakLulus', 'Daftar Ulang': 'DaftarUlang' };
  return statuses[String(value)] ?? 'Baru';
};

async function seedAcademicContent() {
  const mapelByName = new Map<string, { id: number }>();
  for (const [index, row] of source.strukturKurikulum.entries()) {
    const mapel = await prisma.mataPelajaran.upsert({
      where: { kode: `MAP-${String(index + 1).padStart(3, '0')}` },
      create: { kode: `MAP-${String(index + 1).padStart(3, '0')}`, nama: String(row.mapel), jp: Number(row.jp), kelompok: String(row.kelompok), guru: String(row.guru), kkm: Number(row.kkm), kurikulum: String(row.kur) },
      update: { nama: String(row.mapel), jp: Number(row.jp), kelompok: String(row.kelompok), guru: String(row.guru), kkm: Number(row.kkm), kurikulum: String(row.kur) },
    });
    mapelByName.set(mapel.nama, mapel);
  }
  for (const row of source.perangkatAjar) await prisma.perangkatAjar.upsert({ where: { kode: String(row.id) }, create: { kode: String(row.id), mapel: String(row.mapel), kelas: String(row.kelas), jenis: String(row.jenis), topik: String(row.topik), pertemuan: Number(row.pertemuan), guru: String(row.guru), status: String(row.status) }, update: { status: String(row.status) } });
  for (const row of source.capaianPembelajaran) {
    const mapel = mapelByName.get(String(row.mapel));
    await prisma.capaianPembelajaran.upsert({ where: { kode: String(row.kode) }, create: { kode: String(row.kode), mapelId: mapel?.id, mapel: String(row.mapel), fase: String(row.fase), capaian: String(row.capaian) }, update: { capaian: String(row.capaian) } });
  }
  for (const row of source.bankSoal) await prisma.bankSoal.upsert({ where: { kode: String(row.kode) }, create: { kode: String(row.kode), mapel: String(row.mapel), topik: String(row.topik), tipe: String(row.tipe), level: String(row.level), butir: Number(row.butir), dipakai: Number(row.dipakai), penulis: String(row.penulis) }, update: { butir: Number(row.butir), dipakai: Number(row.dipakai) } });
  for (const day of source.jadwalPelajaran) for (const [index, row] of (day.rows as unknown[][]).entries()) await prisma.jadwalPelajaran.upsert({ where: { hari_jamKe_kelas: { hari: String(day.hari), jamKe: index + 1, kelas: String(row[3]) } }, create: { hari: String(day.hari), jamKe: index + 1, waktu: String(row[0]), mapel: String(row[1]), guru: String(row[2]), kelas: String(row[3]) }, update: { waktu: String(row[0]), mapel: String(row[1]), guru: String(row[2]) } });
  for (const row of source.lmsKursus) await prisma.kursusLms.upsert({ where: { kode: String(row.kode) }, create: { kode: String(row.kode), nama: String(row.nama), guru: String(row.guru), modul: Number(row.modul), selesai: Number(row.selesai), tugasAktif: Number(row.tugasAktif), nilai: Number(row.nilai) }, update: { modul: Number(row.modul), selesai: Number(row.selesai), tugasAktif: Number(row.tugasAktif), nilai: Number(row.nilai) } });
  const courses = await prisma.kursusLms.findMany(); const courseByName = new Map(courses.map((course) => [course.nama, course]));
  // MateriLms has no natural key, so guard the append rather than upsert it.
  if (await prisma.materiLms.count() === 0) {
    for (const row of source.lmsMateri) { const course = courseByName.get(String(row.kursus)); if (course) await prisma.materiLms.create({ data: { kursusId: course.id, judul: String(row.judul), tipe: String(row.tipe), status: String(row.status), tgl: parseDate(row.tgl) } }); }
  }
  for (const row of source.lmsTugas) { const course = courseByName.get(String(row.kursus)); if (course) await prisma.tugasLms.upsert({ where: { kode: String(row.id) }, create: { kode: String(row.id), kursusId: course.id, judul: String(row.judul), deadline: parseDate(row.deadline), status: String(row.status) }, update: { status: String(row.status) } }); }
}

/**
 * Portal identities are ordinary `User` rows with a username, so santri and wali
 * reuse the same session, role, and menu machinery as staff. Runs before the
 * first-boot guard so an already-seeded database still gains the portals.
 */
/**
 * Super admin memegang seluruh menu dan boleh menyamar sebagai peran lain untuk
 * debugging. Sandinya diambil dari SUPERADMIN_PASSWORD bila diset, sehingga
 * deployment nyata tidak terpaku pada sandi seed bersama.
 */
async function seedSuperAdmin(passwordHashBawaan: string) {
  const sandi = process.env.SUPERADMIN_PASSWORD;
  const passwordHash = sandi ? await bcrypt.hash(sandi, 12) : passwordHashBawaan;
  const peran = await prisma.peran.upsert({
    where: { key: 'superadmin' },
    create: { key: 'superadmin', nama: 'Super Admin' },
    update: { nama: 'Super Admin' },
  });

  const orang = await prisma.orang.upsert({
    where: { email: 'superadmin@nuha.pesantren.web.id' },
    create: { nama: 'Super Admin', jk: JenisKelamin.L, email: 'superadmin@nuha.pesantren.web.id', aktif: true },
    update: { aktif: true },
  });
  const user = await prisma.user.upsert({
    where: { orangId: orang.id },
    create: { orangId: orang.id, email: orang.email!, username: 'superadmin', passwordHash, unitScope: 'Semua unit', aktif: true },
    update: { username: 'superadmin', passwordHash, aktif: true },
  });
  await prisma.userPeran.upsert({
    where: { userId_peranId: { userId: user.id, peranId: peran.id } },
    create: { userId: user.id, peranId: peran.id },
    update: {},
  });

  // Semua menu diberikan agar super admin bisa membuka layar mana pun tanpa
  // harus menyamar lebih dulu.
  for (const menu of await prisma.menu.findMany()) {
    await prisma.menuPeran.upsert({
      where: { menuId_peranId: { menuId: menu.id, peranId: peran.id } },
      create: { menuId: menu.id, peranId: peran.id },
      update: {},
    });
  }
}

async function seedPortalAccess() {
  const passwordHash = await bcrypt.hash('Nuha2026!', 12);
  const roleSantri = await prisma.peran.upsert({ where: { key: 'santri' }, create: { key: 'santri', nama: 'Santri' }, update: {} });
  const roleWali = await prisma.peran.upsert({ where: { key: 'wali' }, create: { key: 'wali', nama: 'Wali Santri' }, update: {} });

  const roleKetua = await prisma.peran.upsert({ where: { key: 'ketua' }, create: { key: 'ketua', nama: 'Ketua' }, update: {} });
  const menus = [
    { key: 'portal-santri', label: 'Portal Santri', urutan: 90, peranId: roleSantri.id },
    { key: 'portal-wali', label: 'Portal Wali', urutan: 91, peranId: roleWali.id },
    { key: 'data', label: 'Kelola Data', urutan: 92, peranId: roleKetua.id },
  ];
  for (const row of menus) {
    const menu = await prisma.menu.upsert({ where: { key: row.key }, create: { key: row.key, label: row.label, urutan: row.urutan }, update: { label: row.label } });
    await prisma.menuPeran.upsert({ where: { menuId_peranId: { menuId: menu.id, peranId: row.peranId } }, create: { menuId: menu.id, peranId: row.peranId }, update: {} });
  }

  // Staff share the Kelola Data entry; each entity is still gated by its own menu grant.
  const dataMenu = await prisma.menu.findUnique({ where: { key: 'data' } });
  const staffRoles = await prisma.peran.findMany({ where: { key: { notIn: ['santri', 'wali'] } } });
  if (dataMenu) for (const role of staffRoles) {
    await prisma.menuPeran.upsert({ where: { menuId_peranId: { menuId: dataMenu.id, peranId: role.id } }, create: { menuId: dataMenu.id, peranId: role.id }, update: {} });
  }

  await seedSuperAdmin(passwordHash);

  const santriRows = await prisma.santri.findMany({ include: { orang: true } });
  for (const santri of santriRows) {
    const user = await prisma.user.upsert({
      where: { orangId: santri.orangId },
      create: { orangId: santri.orangId, email: santri.orang.email ?? `santri.${santri.nis}@nuha.local`, username: `santri.${santri.nis}`, passwordHash },
      update: { username: `santri.${santri.nis}` },
    });
    await prisma.userPeran.upsert({ where: { userId_peranId: { userId: user.id, peranId: roleSantri.id } }, create: { userId: user.id, peranId: roleSantri.id }, update: {} });
  }

  const waliRows = await prisma.relasiWali.findMany({ where: { utama: true }, include: { wali: true, anak: { include: { santri: true } } } });
  for (const relasi of waliRows) {
    const nis = relasi.anak.santri?.nis;
    if (!nis) continue;
    const user = await prisma.user.upsert({
      where: { orangId: relasi.waliId },
      create: { orangId: relasi.waliId, email: relasi.wali.email ?? `wali.${nis}@nuha.local`, username: `wali.${nis}`, passwordHash },
      update: { username: `wali.${nis}` },
    });
    await prisma.userPeran.upsert({ where: { userId_peranId: { userId: user.id, peranId: roleWali.id } }, create: { userId: user.id, peranId: roleWali.id }, update: {} });
  }
}

/**
 * Presensi, nilai, agenda, dan berkas pendaftar tidak pernah terisi oleh importir
 * lama: agenda karena bug format tanggal, sisanya karena memang tidak ada di
 * blok awal. Diisi terpisah dan idempoten supaya aman dijalankan berulang di
 * basis data yang sudah berisi pengguna.
 */
async function seedOperational() {
  const santriList = await prisma.santri.findMany({ orderBy: { id: 'asc' } });
  const mapelList = await prisma.mataPelajaran.findMany({ orderBy: { id: 'asc' } });

  if (await prisma.presensi.count() === 0) {
    const statuses = ['Hadir', 'Sakit', 'Izin', 'Alpa'] as const;
    for (const [i, santri] of santriList.entries()) {
      for (const row of source.presensiAkademik) {
        const tgl = parseDate(row.tgl);
        // Variasi antar santri diambil dari pola prototype, digeser per santri
        // agar rekap kelas tidak seragam sempurna.
        const dasar = statuses.indexOf(String(row.status) as (typeof statuses)[number]);
        const status = statuses[(Math.max(dasar, 0) + (i % 3 === 0 ? 0 : i % 4)) % statuses.length];
        await prisma.presensi.upsert({
          where: { santriId_tgl_sesi: { santriId: santri.id, tgl, sesi: 'KBM' } },
          create: { santriId: santri.id, tgl, sesi: 'KBM', status, ket: String(row.ket ?? '-') },
          update: {},
        }).catch(() => undefined);
      }
    }
  }

  if (await prisma.nilai.count() === 0) {
    const predikat = (n: number) => n >= 90 ? 'A' : n >= 85 ? 'A-' : n >= 80 ? 'B+' : n >= 75 ? 'B' : n >= 70 ? 'B-' : 'C';
    for (const [i, santri] of santriList.entries()) {
      for (const row of source.nilaiRows) {
        const mapel = mapelList.find((m) => m.nama === String(row.mapel));
        if (!mapel) continue;
        const geser = (i % 5) - 2;
        const tugas = Number(row.tugas) + geser;
        const uts = Number(row.uts) + geser;
        const uas = Number(row.uas) + geser;
        const akhir = Math.round(((tugas + uts + uas) / 3) * 10) / 10;
        await prisma.nilai.upsert({
          where: { santriId_mapelId_periode: { santriId: santri.id, mapelId: mapel.id, periode: '2026/2027 Gasal' } },
          create: { santriId: santri.id, mapelId: mapel.id, periode: '2026/2027 Gasal', tugas, uts, uas, akhir, predikat: predikat(akhir) },
          update: {},
        }).catch(() => undefined);
      }
    }
  }

  if (await prisma.agenda.count() <= 1) {
    await prisma.agenda.deleteMany({});
    for (const row of source.agenda) {
      await prisma.agenda.create({ data: { tgl: parseDate(row.tgl), jam: jamSingkat(row.jam), judul: String(row.judul), unit: String(row.unit) } });
    }
  }

  if (await prisma.berkasPendaftar.count() === 0) {
    const wajib = ['Akta Kelahiran', 'Kartu Keluarga', 'Ijazah / SKL'];
    const opsional = ['Kartu Indonesia Pintar', 'Surat Keterangan Sehat'];
    for (const p of await prisma.pendaftar.findMany({ orderBy: { id: 'asc' } })) {
      const lengkap = p.status !== 'Baru';
      for (const nama of wajib) {
        await prisma.berkasPendaftar.create({ data: { pendaftarId: p.id, nama, wajib: true, terverifikasi: lengkap } }).catch(() => undefined);
      }
      if (lengkap) {
        for (const nama of opsional.slice(0, Number(p.id) % 2 + 1)) {
          await prisma.berkasPendaftar.create({ data: { pendaftarId: p.id, nama, wajib: false, terverifikasi: true } }).catch(() => undefined);
        }
      }
    }
  }
}

async function main() {
  await seedAcademicContent();
  // This is an initial demo-data importer, not a synchronization process. Once
  // users exist, preserve operational data entered through the application.
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    await seedPortalAccess();
    await seedOperational();
    console.log('Seed skipped: database already contains users; portal access and operational data synchronized.');
    return;
  }

  const passwordHash = await bcrypt.hash('Nuha2026!', 12);

  const roles = await Promise.all(source.roles.map((row) => prisma.peran.upsert({
    where: { key: String(row.key) },
    create: { key: String(row.key), nama: String(row.nama) },
    update: { nama: String(row.nama) },
  })));
  const roleByKey = new Map(roles.map((role) => [role.key, role]));

  const unitRows = [
    { key: 'SMP', nama: 'SMP Nurul Huda Mergosono', deskripsi: 'Kelas 7–9, Kurikulum Merdeka, 12 rombel.' },
    { key: 'MA', nama: 'MA Nurul Huda Mergosono', deskripsi: 'Kelas 10–12, IPA / IPS / Keagamaan.' },
    { key: 'Pondok', nama: 'Pondok Pesantren', deskripsi: 'Program Tahfidz dan Kitab Kuning.' },
    { key: 'Poskestren', nama: 'Poskestren', deskripsi: 'Layanan kesehatan santri.' },
  ];
  const units = await Promise.all(unitRows.map((row) => prisma.unit.upsert({ where: { key: row.key }, create: row, update: row })));
  const unitByKey = new Map(units.map((unit) => [unit.key, unit]));

  const asramaByName = new Map<string, { id: number }>();
  for (const row of source.asrama) {
    const asrama = await prisma.asrama.upsert({
      where: { nama: String(row.nama) },
      create: { nama: String(row.nama), jk: gender(row.jk), kapasitas: Number(row.kapasitas), musyrif: String(row.musyrif) },
      update: { kapasitas: Number(row.kapasitas), musyrif: String(row.musyrif) },
    });
    asramaByName.set(asrama.nama, asrama);
    for (const kamar of (row.kamarList as unknown[][]) ?? []) {
      await prisma.kamar.upsert({
        where: { asramaId_kode: { asramaId: asrama.id, kode: String(kamar[0]) } },
        create: { asramaId: asrama.id, kode: String(kamar[0]), kapasitas: Number(kamar[1]) },
        update: { kapasitas: Number(kamar[1]) },
      });
    }
  }

  const santriByName = new Map<string, { id: bigint }>();
  for (const row of source.santri) {
    const unit = unitByKey.get(String(row.unit));
    const kelas = unit ? await prisma.kelas.upsert({
      where: { unitId_nama: { unitId: unit.id, nama: String(row.kelas) } },
      create: { unitId: unit.id, nama: String(row.kelas), tingkat: String(row.kelas).replace(/[^0-9X]/g, '') || '-' },
      update: {},
    }) : null;
    const asrama = asramaByName.get(String(row.asrama));
    const kamar = asrama ? await prisma.kamar.findUnique({ where: { asramaId_kode: { asramaId: asrama.id, kode: String(row.kamar) } } }) : null;
    const orang = await prisma.orang.upsert({
      where: { email: `santri.${String(row.nis)}@nuha.local` },
      create: { nama: String(row.nama), jk: gender(row.jk), email: `santri.${String(row.nis)}@nuha.local`, alamat: String(row.alamat), hp: String(row.hpWali) },
      update: { nama: String(row.nama), alamat: String(row.alamat), hp: String(row.hpWali) },
    });
    const santri = await prisma.santri.upsert({
      where: { orangId: orang.id },
      create: { orangId: orang.id, nis: String(row.nis), nisn: String(row.nisn), unitId: unit?.id, kelasId: kelas?.id, kamarId: kamar?.id, status: String(row.status) === 'Mukim' ? StatusSantri.Mukim : StatusSantri.Kalong, program: String(row.program), tahunMasuk: String(row.masuk) },
      update: { unitId: unit?.id, kelasId: kelas?.id, kamarId: kamar?.id, program: String(row.program) },
    });
    santriByName.set(String(row.nama), santri);
    const wali = await prisma.orang.upsert({
      where: { email: `wali.${String(row.nis)}@nuha.local` },
      create: { nama: String(row.wali), jk: JenisKelamin.L, hp: String(row.hpWali), email: `wali.${String(row.nis)}@nuha.local` },
      update: { hp: String(row.hpWali) },
    });
    await prisma.relasiWali.upsert({ where: { waliId_anakId: { waliId: wali.id, anakId: orang.id } }, create: { waliId: wali.id, anakId: orang.id, hubungan: 'Orang Tua', pekerjaan: String(row.pekerjaan) }, update: {} });
  }

  for (const row of source.users) {
    // Jabatan yang belum punya peran (Musyrif, Tata Usaha) dibuatkan peran
    // sendiri tanpa grant menu. Sebelumnya jatuh ke `ketua`, sehingga staf biasa
    // otomatis memperoleh hak akses tertinggi.
    const role = roles.find((item) => item.nama === row.peran || String(row.peran).startsWith(item.nama))
      ?? await perolehPeran(String(row.peran));
    const orang = await prisma.orang.upsert({ where: { email: String(row.email) }, create: { nama: String(row.nama), jk: JenisKelamin.L, email: String(row.email), aktif: Boolean(row.aktif) }, update: { nama: String(row.nama), aktif: Boolean(row.aktif) } });
    const user = await prisma.user.upsert({ where: { orangId: orang.id }, create: { orangId: orang.id, email: String(row.email), passwordHash, unitScope: String(row.unit), aktif: Boolean(row.aktif) }, update: { passwordHash, aktif: Boolean(row.aktif) } });
    await prisma.userPeran.upsert({ where: { userId_peranId: { userId: user.id, peranId: role.id } }, create: { userId: user.id, peranId: role.id }, update: {} });
  }

  for (const [index, row] of source.menuDefs.entries()) {
    const menu = await prisma.menu.upsert({ where: { key: String(row.key) }, create: { key: String(row.key), label: String(row.label), icon: String(row.icon ?? ''), urutan: index }, update: { label: String(row.label), icon: String(row.icon ?? ''), urutan: index } });
    for (const key of (row.roles as string[]) ?? []) {
      const role = roleByKey.get(key);
      if (role) await prisma.menuPeran.upsert({ where: { menuId_peranId: { menuId: menu.id, peranId: role.id } }, create: { menuId: menu.id, peranId: role.id }, update: {} });
    }
  }

  for (const row of source.pegawai) {
    const unit = unitByKey.get(String(row.unit));
    const orang = await prisma.orang.upsert({ where: { email: `pegawai.${String(row.nip)}@nuha.local` }, create: { nama: String(row.nama), jk: JenisKelamin.L, email: `pegawai.${String(row.nip)}@nuha.local` }, update: { nama: String(row.nama) } });
    const pegawai = await prisma.pegawai.upsert({ where: { orangId: orang.id }, create: { orangId: orang.id, nip: String(row.nip), unitId: unit?.id, jabatan: String(row.jabatan), status: String(row.status), rekening: String(row.rek) }, update: { jabatan: String(row.jabatan), status: String(row.status), rekening: String(row.rek) } });
    await prisma.komponenGaji.upsert({ where: { pegawaiId: pegawai.id }, create: { pegawaiId: pegawai.id, pokok: Number(row.pokok), tunjJab: Number(row.tunjJab), tunjKel: Number(row.tunjKel), jamMengajar: Number(row.jam), tarifJam: Number(row.tarifJam), transport: Number(row.transport), bpjs: Number(row.bpjs), koperasi: Number(row.koperasi), pph: Number(row.pph) }, update: {} });
  }

  for (const row of source.pendaftar) await prisma.pendaftar.upsert({ where: { noReg: String(row.noReg) }, create: { noReg: String(row.noReg), nama: String(row.nama), pilihan: String(row.pilihan), asalSekolah: String(row.asal), tglDaftar: parseDate(row.tgl), nilai: Number(row.nilai), status: pendaftarStatus(row.status) }, update: { status: pendaftarStatus(row.status), nilai: Number(row.nilai) } });
  for (const row of source.obat) await prisma.obat.upsert({ where: { nama: String(row.nama) }, create: { nama: String(row.nama), satuan: String(row.satuan), kategori: String(row.kategori), stok: Number(row.stok), stokMin: Number(row.min), kadaluarsa: String(row.exp) }, update: { stok: Number(row.stok) } });
  for (const [index, row] of source.kegiatanHarian.entries()) await prisma.kegiatanHarian.upsert({ where: { id: index + 1 }, create: { id: index + 1, jam: String(row.jam), nama: String(row.nama), ket: String(row.ket), urutan: index }, update: { nama: String(row.nama) } });
  for (const row of source.halaqah) await prisma.halaqah.create({ data: { nama: String(row.nama), ustadz: String(row.ustadz), waktu: String(row.waktu), tempat: String(row.tempat), jenjang: String(row.jenjang), anggota: Number(row.anggota) } }).catch(() => undefined);
  for (const row of source.pengumumanSantri) await prisma.pengumuman.create({ data: { tgl: parseDate(row.tgl), judul: String(row.judul), isi: String(row.isi), target: 'Santri' } }).catch(() => undefined);
  for (const row of source.agenda) await prisma.agenda.create({ data: { tgl: parseDate(row.tgl), jam: jamSingkat(row.jam), judul: String(row.judul), unit: String(row.unit) } }).catch(() => undefined);
  for (const row of source.waCases) await prisma.templateWa.upsert({ where: { kode: String(row.kode) }, create: { kode: String(row.kode), role: String(row.role), judul: String(row.judul), pemicu: String(row.pemicu), waktu: String(row.waktu), isi: String(row.isi), aktif: Boolean(row.aktif) }, update: { aktif: Boolean(row.aktif) } });

  // Transactional records — only for santri that resolved by name.
  const findSantri = (value: unknown) => santriByName.get(String(value));

  for (const row of source.setoran) {
    const santri = findSantri(row.santri);
    if (santri) await prisma.hafalan.create({ data: { santriId: santri.id, tgl: parseDate(row.tgl), surat: String(row.surat), ayat: String(row.ayat), jenis: String(row.jenis), nilai: String(row.nilai), penguji: String(row.penguji) } });
  }
  for (const row of source.tazir) {
    const santri = findSantri(row.santri);
    if (santri) await prisma.tazir.create({ data: { santriId: santri.id, tgl: parseDate(row.tgl), pelanggaran: String(row.pelanggaran), poin: Number(row.poin), sanksi: String(row.sanksi), petugas: String(row.petugas) } });
  }
  for (const row of source.izinList) {
    const santri = findSantri(row.santri);
    if (santri) await prisma.izin.upsert({ where: { kode: String(row.id) }, create: { kode: String(row.id), santriId: santri.id, jenis: String(row.alasan).split('—')[0].trim(), alasan: String(row.alasan), penjemput: String(row.penjemput), keluarAt: parseDate(row.keluar), kembaliAt: parseDate(row.kembali), status: ['Menunggu', 'Disetujui', 'Ditolak', 'Selesai'].includes(String(row.status)) ? (String(row.status) as never) : 'Menunggu' }, update: {} });
  }
  for (const row of source.kunjungan) {
    const santri = findSantri(row.santri);
    if (santri) await prisma.rekamMedis.create({ data: { santriId: santri.id, tgl: parseDate(row.tgl), jam: String(row.jam), keluhan: String(row.keluhan), diagnosis: String(row.diagnosis), terapi: String(row.terapi), tindakLanjut: String(row.lanjut), petugas: String(row.petugas) } });
  }
  for (const row of source.kunjunganWali) {
    const santri = findSantri(row.santri);
    if (santri) await prisma.kunjungan.create({ data: { santriId: santri.id, namaWali: String(row.wali ?? row.penjenguk ?? 'Wali'), hubungan: String(row.hubungan ?? ''), tgl: parseDate(row.tgl), jamMasuk: String(row.jam ?? row.masuk ?? ''), keperluan: String(row.keperluan ?? ''), status: String(row.status ?? 'Terjadwal') } });
  }
  for (const row of source.tagihanRows) {
    const santri = findSantri(row.santri);
    if (!santri) continue;
    const tagihan = await prisma.tagihan.upsert({ where: { kode: String(row.id) }, create: { kode: String(row.id), santriId: santri.id, jenis: String(row.jenis), periode: String(row.periode), nominal: Number(row.nominal), dibayar: Number(row.bayar), jatuhTempo: parseDate(row.jatuh) }, update: { dibayar: Number(row.bayar) } });
    if (Number(row.bayar) > 0) await prisma.pembayaran.create({ data: { tagihanId: tagihan.id, tgl: parseDate(row.jatuh), nominal: Number(row.bayar), metode: 'Transfer BSI' } }).catch(() => undefined);
  }
  for (const row of source.transaksi) {
    await prisma.transaksiKas.upsert({ where: { kode: String(row.kode) }, create: { kode: String(row.kode), tgl: parseDate(row.tgl), uraian: String(row.uraian), kategori: String(row.kategori), metode: String(row.metode), arah: Number(row.nominal) >= 0 ? 'Masuk' : 'Keluar', nominal: Math.abs(Number(row.nominal)) }, update: {} });
  }

  // Run again now that santri and wali rows exist on a fresh database.
  await seedPortalAccess();
  await seedOperational();

  console.log('Seed complete: 20 santri, 12 pegawai, 18 pendaftar, and operational master data.');
  console.log('Demo login: ketua@nuha.pesantren.web.id / Nuha2026!');
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(() => prisma.$disconnect());
