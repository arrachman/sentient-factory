import type { PrismaClient } from '@prisma/client';

/**
 * Isi ulang pintasan leluhur (provinsiId/kotaId/kecamatanId/kedalaman/namaLengkap)
 * untuk satu negara. Wajib dijalankan setelah impor atau penambahan wilayah baru —
 * kolom ini tidak boleh diisi manual karena mengganti pola 4x self-join per baris
 * jadi filter langsung.
 */
export async function bangunUlangJalurWilayah(prisma: PrismaClient, negaraId: number): Promise<void> {
  const semua = await prisma.wilayah.findMany({
    where: { negaraId },
    select: { id: true, indukId: true, tingkat: true, nama: true, labelTipe: true },
  });
  const provinsi = new Map<bigint, { provinsiId: bigint; kotaId: null; kecamatanId: null; kedalaman: number; namaLengkap: string }>();
  const kota = new Map<bigint, { provinsiId: bigint; kotaId: bigint; kecamatanId: null; kedalaman: number; namaLengkap: string }>();
  const kecamatan = new Map<bigint, { provinsiId: bigint; kotaId: bigint; kecamatanId: bigint; kedalaman: number; namaLengkap: string }>();

  for (const w of semua) {
    if (w.tingkat === 'Provinsi') provinsi.set(w.id, { provinsiId: w.id, kotaId: null, kecamatanId: null, kedalaman: 1, namaLengkap: w.nama });
  }
  for (const w of semua) {
    if (w.tingkat !== 'Kota' || !w.indukId) continue;
    const induk = provinsi.get(w.indukId);
    if (!induk) continue;
    kota.set(w.id, { provinsiId: induk.provinsiId, kotaId: w.id, kecamatanId: null, kedalaman: 2, namaLengkap: `${w.labelTipe ?? ''} ${w.nama}, ${induk.namaLengkap}`.trim() });
  }
  for (const w of semua) {
    if (w.tingkat !== 'Kecamatan' || !w.indukId) continue;
    const induk = kota.get(w.indukId);
    if (!induk) continue;
    kecamatan.set(w.id, { provinsiId: induk.provinsiId, kotaId: induk.kotaId, kecamatanId: w.id, kedalaman: 3, namaLengkap: `${w.nama}, ${induk.namaLengkap}` });
  }

  const pembaruan: { id: bigint; data: Record<string, unknown> }[] = [];
  for (const w of semua) {
    if (w.tingkat === 'Provinsi') {
      const jalur = provinsi.get(w.id)!;
      pembaruan.push({ id: w.id, data: { provinsiId: jalur.provinsiId, kotaId: null, kecamatanId: null, kedalaman: jalur.kedalaman, namaLengkap: jalur.namaLengkap } });
    } else if (w.tingkat === 'Kota') {
      const jalur = kota.get(w.id);
      if (jalur) pembaruan.push({ id: w.id, data: { provinsiId: jalur.provinsiId, kotaId: jalur.kotaId, kecamatanId: null, kedalaman: jalur.kedalaman, namaLengkap: jalur.namaLengkap } });
    } else if (w.tingkat === 'Kecamatan') {
      const jalur = kecamatan.get(w.id);
      if (jalur) pembaruan.push({ id: w.id, data: { provinsiId: jalur.provinsiId, kotaId: jalur.kotaId, kecamatanId: jalur.kecamatanId, kedalaman: jalur.kedalaman, namaLengkap: jalur.namaLengkap } });
    } else if (w.tingkat === 'Desa' && w.indukId) {
      const induk = kecamatan.get(w.indukId);
      if (!induk) continue;
      const namaLengkap = `${w.labelTipe ?? ''} ${w.nama}, ${induk.namaLengkap}`.trim();
      pembaruan.push({ id: w.id, data: { provinsiId: induk.provinsiId, kotaId: induk.kotaId, kecamatanId: induk.kecamatanId, kedalaman: 4, namaLengkap } });
    }
  }

  for (const item of pembaruan) {
    await prisma.wilayah.update({ where: { id: item.id }, data: item.data });
  }
}
