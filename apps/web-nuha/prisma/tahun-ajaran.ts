import type { PrismaClient } from '@prisma/client';

const TAHUN_MULAI_AWAL = 2024;

/**
 * Daftar tahun pelajaran dari 2024/2025 sampai tahun pelajaran berjalan,
 * lengkap Gasal + Genap. Dihitung dari tanggal (tahun pelajaran mulai Juli)
 * supaya tidak perlu diedit tiap tahun. Yang aktif = semester berjalan.
 */
export function daftarTahunAjaran(now = new Date()) {
  const bulan = now.getMonth() + 1;
  const tahunMulaiKini = bulan >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  const semesterKini = bulan >= 7 ? 'Gasal' : 'Genap';
  const kodeKini = `${tahunMulaiKini}/${tahunMulaiKini + 1}`;

  const rows: Array<{ kode: string; semester: string; aktif: boolean }> = [];
  for (let tahun = TAHUN_MULAI_AWAL; tahun <= tahunMulaiKini; tahun += 1) {
    const kode = `${tahun}/${tahun + 1}`;
    for (const semester of ['Gasal', 'Genap']) {
      rows.push({ kode, semester, aktif: kode === kodeKini && semester === semesterKini });
    }
  }
  return rows;
}

/** Idempoten: upsert semua tahun pelajaran, kembalikan yang aktif. */
export async function seedTahunAjaran(prisma: PrismaClient, now = new Date()) {
  const rows = daftarTahunAjaran(now);
  const hasil = await Promise.all(rows.map((row) => prisma.tahunAjaran.upsert({
    where: { kode_semester: { kode: row.kode, semester: row.semester } },
    create: row,
    update: { aktif: row.aktif },
  })));
  return hasil.find((ta) => ta.aktif) ?? hasil[hasil.length - 1];
}
