import { prisma } from '@/lib/prisma';
import { wherePegawai, TANPA_LEMBAGA, type FilterPegawai } from './filter';

export type SimpulLembaga = { key: string; nama: string; jumlah: number };

export type PohonPegawai = {
  total: number;
  lembaga: SimpulLembaga[];
  /** Nilai `status` yang benar-benar ada di data, beserta jumlahnya. */
  status: { nama: string; jumlah: number }[];
};

/**
 * Hitung sebaran pegawai per lembaga (SMP / MA / Pondok / Poskestren) dan per
 * status kepegawaian.
 *
 * Jumlah dihitung dengan filter lain tetap berlaku (pencarian, jenis kelamin)
 * tapi tanpa filter yang sedang dihitung itu sendiri — supaya angka di chip
 * menunjukkan "kalau saya klik ini, dapat berapa", bukan nol semua.
 */
export async function bacaPohonPegawai(f: FilterPegawai): Promise<PohonPegawai> {
  const [perUnit, perStatus, unitRows, total] = await Promise.all([
    prisma.pegawai.groupBy({
      by: ['unitId'],
      where: wherePegawai({ ...f, unit: undefined }),
      _count: { _all: true },
    }),
    prisma.pegawai.groupBy({
      by: ['status'],
      where: wherePegawai({ ...f, status: undefined }),
      _count: { _all: true },
    }),
    prisma.unit.findMany({ orderBy: { id: 'asc' } }),
    prisma.pegawai.count({ where: wherePegawai({ ...f, unit: undefined }) }),
  ]);

  const jumlahUnit = new Map(perUnit.map((r) => [r.unitId, r._count._all]));

  const lembaga: SimpulLembaga[] = unitRows
    .map((u) => ({
      key: u.key,
      nama: u.nama.replace(/ Nurul Huda Mergosono$/, ''),
      jumlah: jumlahUnit.get(u.id) ?? 0,
    }))
    .filter((u) => u.jumlah > 0)
    .sort((a, b) => b.jumlah - a.jumlah);

  const tanpa = jumlahUnit.get(null) ?? 0;
  if (tanpa > 0) lembaga.push({ key: TANPA_LEMBAGA, nama: 'Tanpa lembaga', jumlah: tanpa });

  const status = perStatus
    .map((r) => ({ nama: r.status, jumlah: r._count._all }))
    .sort((a, b) => b.jumlah - a.jumlah);

  return { total, lembaga, status };
}
