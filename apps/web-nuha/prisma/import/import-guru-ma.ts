/**
 * Impor `DATA GURU.xlsx` (17 baris) → `Pegawai` unit MA.
 *
 * Sumber TIDAK menyediakan NIP maupun NIK/HP guru (lihat "Yang masih perlu
 * dari client" di RENCANA-IMPORT.md poin 9). NIP dibuat deterministik dari
 * nomor urut di kolom "No": `GTT-MA-<urut 3 digit>` — label internal, bukan
 * NIP resmi Kemenag/Kemendikbud (belum tersedia dari client). `Orang`
 * dikunci lewat email sintetis `pegawai.<nip>@nuha.local`, mengikuti pola
 * `prisma/seed.ts` untuk data pegawai tanpa email asli.
 *
 * Jalankan: `npm run import:guru-ma -- --file "docs/DATA GURU.xlsx"`.
 * Idempoten (upsert by NIP/email), validasi seluruh baris dulu baru tulis.
 */
import { prisma } from '@/lib/prisma';
import { recordAudit } from '@/lib/audit';
import { JenisKelamin } from '@prisma/client';
import { bacaXlsx } from './lib/xlsx';
import { parseTtl } from './lib/tanggal-id';

type Galat = { baris: number; pesan: string };
const AKTOR_SKRIP = { nama: 'Importir guru MA (skrip)' };

type SiapGuru = {
  urut: number;
  nip: string;
  nama: string;
  tmpLahir: string;
  tglLahir: Date;
  pendidikanTerakhir: string;
  mapelDiampu: string;
  jabatan: string;
};

const bacaArgumen = (argv: string[]): Record<string, string> => {
  const hasil: Record<string, string> = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i].startsWith('--')) {
      hasil[argv[i].slice(2)] = argv[i + 1] ?? '';
      i += 1;
    }
  }
  return hasil;
};

/** Validasi + siapkan seluruh baris dari sheet DATA GURU MA. Mengumpulkan galat, tidak melempar. */
function siapkanGuru(path: string): { siap: SiapGuru[]; galat: Galat[] } {
  const galat: Galat[] = [];
  const siap: SiapGuru[] = [];

  const wb = bacaXlsx(path);
  const sheet = wb.ambilSheet(wb.namaSheet[0]);
  const header = sheet.get(4);
  if (!header || header.C !== 'Nama Lengkap' || header.D !== 'TTL' || header.E !== 'Pendidikan Terakhir') {
    throw new Error(
      `"${path}": header baris ke-4 tidak sesuai dugaan (Nama Lengkap/TTL/Pendidikan Terakhir) — ` +
        'struktur berkas mungkin sudah berubah, importir dihentikan tanpa menebak.',
    );
  }

  // Data mulai baris 5, satu baris per guru, sampai baris terakhir bernomor urut.
  const nomorBaris = [...sheet.keys()].filter((r) => r >= 5).sort((a, b) => a - b);
  for (const r of nomorBaris) {
    const row = sheet.get(r)!;
    const noBaris = r; // sudah nomor baris Excel asli, dipakai langsung untuk pesan galat
    try {
      const urutMentah = row.B?.trim();
      if (!urutMentah) throw new Error('kolom No kosong');
      const urut = Number(urutMentah);
      if (!Number.isInteger(urut) || urut < 1) throw new Error(`kolom No "${urutMentah}" bukan angka urut valid`);

      const nama = row.C?.trim();
      if (!nama) throw new Error('Nama Lengkap kosong');

      const ttlMentah = row.D?.trim();
      if (!ttlMentah) throw new Error('TTL kosong');
      const { tempat, tanggal } = parseTtl(ttlMentah, 'TTL');

      const pendidikanTerakhir = row.E?.trim();
      if (!pendidikanTerakhir) throw new Error('Pendidikan Terakhir kosong');

      const mapelDiampu = row.F?.trim() ?? '';
      const jabatan = row.G?.trim() ?? '';
      if (!mapelDiampu && !jabatan) throw new Error('kolom Mata Pelajaran dan Jabatan dua-duanya kosong');

      const nip = `GTT-MA-${String(urut).padStart(3, '0')}`;

      siap.push({ urut, nip, nama, tmpLahir: tempat, tglLahir: tanggal, pendidikanTerakhir, mapelDiampu, jabatan: jabatan || mapelDiampu });
    } catch (error) {
      galat.push({ baris: noBaris, pesan: error instanceof Error ? error.message : String(error) });
    }
  }

  if (siap.length === 0 && galat.length === 0) {
    galat.push({ baris: 0, pesan: 'tidak ada baris data ditemukan mulai baris ke-5 — struktur berkas mungkin sudah berubah' });
  }

  return { siap, galat };
}

async function jalankan(): Promise<void> {
  const argumen = bacaArgumen(process.argv.slice(2));
  const path = argumen.file;
  if (!path) {
    console.error('Pakai --file "docs/DATA GURU.xlsx"');
    process.exitCode = 1;
    return;
  }

  const { siap, galat } = siapkanGuru(path);

  if (galat.length > 0) {
    console.error(`Ditemukan ${galat.length} galat validasi di "${path}". Tidak ada data yang ditulis ke DB.\n`);
    for (const g of galat) console.error(`  - [baris ${g.baris}] ${g.pesan}`);
    process.exitCode = 1;
    return;
  }

  const unit = await prisma.unit.findUnique({ where: { key: 'MA' } });
  if (!unit) {
    console.error('Unit "MA" tidak ditemukan di DB — jalankan seed lebih dulu.');
    process.exitCode = 1;
    return;
  }

  console.log(`Validasi lolos: ${siap.length} guru. Menulis ke database...`);

  for (const g of siap) {
    const email = `pegawai.${g.nip.toLowerCase()}@nuha.local`;
    const orang = await prisma.orang.upsert({
      where: { email },
      create: { nama: g.nama, jk: JenisKelamin.L, tglLahir: g.tglLahir, tmpLahir: g.tmpLahir, email },
      update: { nama: g.nama, tglLahir: g.tglLahir, tmpLahir: g.tmpLahir },
    });

    await prisma.pegawai.upsert({
      where: { nip: g.nip },
      create: {
        orangId: orang.id,
        nip: g.nip,
        unitId: unit.id,
        jabatan: g.jabatan,
        status: 'Aktif',
        pendidikanTerakhir: g.pendidikanTerakhir,
        mapelDiampu: g.mapelDiampu || null,
        tmpTglLahir: `${g.tmpLahir}, ${g.tglLahir.toISOString().slice(0, 10)}`,
      },
      update: {
        orangId: orang.id,
        unitId: unit.id,
        jabatan: g.jabatan,
        pendidikanTerakhir: g.pendidikanTerakhir,
        mapelDiampu: g.mapelDiampu || null,
        tmpTglLahir: `${g.tmpLahir}, ${g.tglLahir.toISOString().slice(0, 10)}`,
      },
    });
  }

  await recordAudit({
    aksi: 'import',
    entitas: 'Pegawai',
    entitasId: 'batch',
    ringkasan: `Impor XLSX: ${siap.length} guru MA (${path}).`,
    aktor: AKTOR_SKRIP,
  });

  console.log(`Selesai. ${siap.length} Pegawai unit MA di-upsert.`);
}

jalankan()
  .catch((error) => {
    console.error('Galat tak terduga saat impor guru MA:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
