/**
 * Impor daftar Asatidz & Asatidzah pondok (22 orang) → `Orang` + `Pegawai`.
 *
 * Sumber daftar hanya berisi NAMA + gelar kehormatan — tidak ada NIK, TTL,
 * HP, maupun NIP resmi. Karena itu:
 *   - NIP dibuat deterministik `AST-<urut 3 digit>` (label internal, bukan
 *     NIP Kemenag), urutan mengikuti daftar di bawah dan TIDAK boleh diubah
 *     agar impor ulang tetap mengenai baris yang sama.
 *   - `Orang` dikunci lewat email sintetis `pegawai.<nip>@nuha.local`,
 *     mengikuti pola `import-guru-ma.ts`.
 *   - Jenis kelamin ditulis eksplisit per baris, bukan disimpulkan dari gelar.
 *
 * SENGAJA TIDAK membuat `User`/akun login dan TIDAK menempelkan peran RBAC.
 * Penugasan peran (staf, pengasuh, bendahara, dst.) dilakukan lewat aplikasi;
 * satu orang boleh multi-peran (`UserPeran`) dan multi-jabatan
 * (`JabatanStruktural`), bahkan sekaligus jadi santri/siswa — karena
 * `Santri` dan `Pegawai` sama-sama menggantung ke satu `Orang`.
 *
 * Jalankan: `npm run import:asatidz`. Idempoten (upsert by NIP/email).
 */
import { prisma } from '@/lib/prisma';
import { recordAudit } from '@/lib/audit';
import { JenisKelamin } from '@prisma/client';

type BarisAsatidz = {
  /** Gelar/sapaan kehormatan di depan nama. */
  gelar: string;
  /** Nama tanpa gelar — kolom utama yang dipakai UI & pencocokan jadwal. */
  nama: string;
  /** Sapaan akrab sehari-hari. */
  panggilan: string;
  jk: JenisKelamin;
};

/** Urutan menentukan NIP (`AST-001`...). Jangan menyisipkan di tengah —
 *  tambahkan nama baru di akhir daftar supaya NIP lama tidak bergeser. */
const DAFTAR: readonly BarisAsatidz[] = [
  // Asatidz (18)
  { gelar: 'KH.', nama: 'M. Taqiyuddin Alawiy', panggilan: 'Kiai Taqi', jk: JenisKelamin.L },
  { gelar: 'KH.', nama: 'Sihabuddin Al-Hafidz', panggilan: 'Kiai Sihab', jk: JenisKelamin.L },
  { gelar: 'KH.', nama: 'Achmad Shampton', panggilan: 'Kiai Shampton', jk: JenisKelamin.L },
  { gelar: 'Gus', nama: 'Alfan Jamil', panggilan: 'Gus Alfan', jk: JenisKelamin.L },
  { gelar: 'Gus', nama: 'M. Faruq', panggilan: 'Gus Faruq', jk: JenisKelamin.L },
  { gelar: 'Gus', nama: 'Nabil Muhammad Niamillah', panggilan: 'Gus Nabil', jk: JenisKelamin.L },
  { gelar: 'Ustadz', nama: 'Achmad Ahdani Dzikron', panggilan: 'Ustadz Ahdani', jk: JenisKelamin.L },
  { gelar: 'Ustadz', nama: 'Achwanuri', panggilan: 'Ustadz Achwan', jk: JenisKelamin.L },
  { gelar: 'Ustadz', nama: 'Ahmad Sulhan', panggilan: 'Ustadz Sulhan', jk: JenisKelamin.L },
  { gelar: 'Ustadz', nama: 'Akmal Firdaus Sultra', panggilan: 'Ustadz Akmal', jk: JenisKelamin.L },
  { gelar: 'Ustadz', nama: 'Bisri Musthofa', panggilan: 'Ustadz Bisri', jk: JenisKelamin.L },
  { gelar: 'Ustadz', nama: 'Choirul Anam', panggilan: 'Ustadz Anam', jk: JenisKelamin.L },
  { gelar: 'Ustadz', nama: 'Fatah Rosuly', panggilan: 'Ustadz Fatah', jk: JenisKelamin.L },
  { gelar: 'Ustadz', nama: 'Hafidz Nasrullah', panggilan: 'Ustadz Hafidz', jk: JenisKelamin.L },
  { gelar: 'Ustadz', nama: 'Muhammad Ibrahim', panggilan: 'Ustadz Ibrahim', jk: JenisKelamin.L },
  { gelar: 'Ustadz', nama: 'Muhammad Ismail', panggilan: 'Ustadz Ismail', jk: JenisKelamin.L },
  { gelar: 'Ustadz', nama: 'Nur Robbi', panggilan: 'Ustadz Robbi', jk: JenisKelamin.L },
  { gelar: 'Ustadz', nama: 'Mufidurrosikhin', panggilan: 'Ustadz Mufid', jk: JenisKelamin.L },
  // Asatidzah (4)
  { gelar: 'Nyai Hj.', nama: 'Badiatus Shidqoh', panggilan: 'Nyai Badi', jk: JenisKelamin.P },
  { gelar: 'Nyai Hj.', nama: 'Raudhatul Hasanah', panggilan: 'Nyai Hasanah', jk: JenisKelamin.P },
  { gelar: 'Ning', nama: "Nisa Durratul Yatimah Mu'nisatudiniy", panggilan: 'Ning Nisa', jk: JenisKelamin.P },
  { gelar: 'Ustadzah', nama: "Khoirunnisa'", panggilan: 'Ustadzah Nisa', jk: JenisKelamin.P },
];

const AKTOR_SKRIP = { nama: 'Importir asatidz (skrip)' };

async function jalankan(): Promise<void> {
  const unit = await prisma.unit.findUnique({ where: { key: 'Pondok' } });
  if (!unit) {
    console.error('Unit "Pondok" tidak ditemukan di DB — jalankan seed lebih dulu.');
    process.exitCode = 1;
    return;
  }

  let dibuat = 0;
  for (const [index, baris] of DAFTAR.entries()) {
    const nip = `AST-${String(index + 1).padStart(3, '0')}`;
    const email = `pegawai.${nip.toLowerCase()}@nuha.local`;
    const namaLengkap = `${baris.gelar} ${baris.nama}`;
    // Kategori jabatan mengikuti gelar gender: filter Kategori di /data/orang
    // membedakan lewat teks jabatan, jadi nilainya harus stabil.
    const jabatan = baris.jk === JenisKelamin.P ? 'Asatidzah' : 'Asatidz';

    const identitas = {
      nama: baris.nama,
      gelar: baris.gelar,
      panggilan: baris.panggilan,
      namaLengkap,
      jk: baris.jk,
    };

    const orang = await prisma.orang.upsert({
      where: { email },
      create: { ...identitas, email },
      update: identitas,
    });

    const sebelum = await prisma.pegawai.findUnique({ where: { nip } });
    if (!sebelum) dibuat += 1;

    await prisma.pegawai.upsert({
      where: { nip },
      create: { orangId: orang.id, nip, unitId: unit.id, jabatan, status: 'Aktif' },
      // `jabatan`/`unitId` sengaja TIDAK ditimpa saat update: keduanya boleh
      // diubah operator lewat aplikasi (mis. dipromosikan jadi Pengasuh) dan
      // impor ulang tidak boleh mengembalikannya ke nilai awal.
      update: { orangId: orang.id },
    });
  }

  await recordAudit({
    aksi: 'import',
    entitas: 'Pegawai',
    entitasId: 'batch',
    ringkasan: `Impor daftar asatidz/asatidzah: ${DAFTAR.length} orang (${dibuat} baru) di unit Pondok.`,
    aktor: AKTOR_SKRIP,
  });

  console.log(`Selesai. ${DAFTAR.length} Pegawai di-upsert (${dibuat} baru), unit Pondok, tanpa akun login.`);
}

jalankan()
  .catch((error) => {
    console.error('Galat tak terduga saat impor asatidz:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
