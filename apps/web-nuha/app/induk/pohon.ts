import { prisma } from '@/lib/prisma';
import { whereFilter, type FilterInduk } from './filter';

export type SimpulKelas = { id: number; nama: string; jumlah: number };
export type SimpulTingkat = { tingkat: string; jumlah: number; kelas: SimpulKelas[] };
export type SimpulUnit = { id: number; nama: string; jumlah: number; tingkat: SimpulTingkat[] };

export type PohonInduk = {
  total: number;
  tanpaKelas: number;
  unit: SimpulUnit[];
};

/** Susunan lembaga → tingkat → kelas beserta cacah santri.
 * Cacah menghormati filter selain unit/kelas (status, JK, angkatan, pencarian),
 * supaya angka di pohon = angka yang benar-benar akan muncul saat simpul diklik. */
export async function ambilPohon(f: FilterInduk): Promise<PohonInduk> {
  const whereDasar = whereFilter({ ...f, unitId: undefined, kelasId: undefined });

  const [unitRows, kelasRows, cacah, total, tanpaKelas] = await Promise.all([
    // Poskestren bukan lembaga tempat santri terdaftar (layanan kesehatan,
    // bukan jenjang) — dikeluarkan dari pohon induk santri.
    prisma.unit.findMany({ where: { aktif: true, key: { not: 'Poskestren' } }, orderBy: { nama: 'asc' } }),
    prisma.kelas.findMany({ orderBy: [{ tingkat: 'asc' }, { nama: 'asc' }] }),
    prisma.santri.groupBy({ by: ['kelasId'], where: whereDasar, _count: { _all: true } }),
    prisma.santri.count({ where: whereDasar }),
    prisma.santri.count({ where: { AND: [whereDasar, { kelasId: null }] } }),
  ]);

  const perKelas = new Map<number, number>();
  for (const b of cacah) if (b.kelasId !== null) perKelas.set(b.kelasId, b._count._all);

  const unit: SimpulUnit[] = unitRows.map((u) => {
    const perTingkat = new Map<string, SimpulKelas[]>();
    for (const k of kelasRows) {
      if (k.unitId !== u.id) continue;
      const list = perTingkat.get(k.tingkat) ?? [];
      list.push({ id: k.id, nama: k.nama, jumlah: perKelas.get(k.id) ?? 0 });
      perTingkat.set(k.tingkat, list);
    }
    const tingkat: SimpulTingkat[] = [...perTingkat.entries()]
      .map(([nama, kelas]) => ({
        tingkat: nama,
        kelas,
        jumlah: kelas.reduce((a, k) => a + k.jumlah, 0),
      }))
      .sort((a, b) => a.tingkat.localeCompare(b.tingkat, 'id', { numeric: true }));
    return {
      id: u.id,
      nama: u.nama,
      jumlah: tingkat.reduce((a, t) => a + t.jumlah, 0),
      tingkat,
    };
  });

  return { total, tanpaKelas, unit };
}

/** Angkatan (tahun masuk) yang benar-benar ada di data, untuk mengisi penyaring. */
export async function ambilAngkatan(): Promise<string[]> {
  const rows = await prisma.santri.findMany({
    where: { tahunMasuk: { not: null } },
    distinct: ['tahunMasuk'],
    select: { tahunMasuk: true },
    orderBy: { tahunMasuk: 'desc' },
  });
  return rows.map((r) => r.tahunMasuk!).filter(Boolean);
}
