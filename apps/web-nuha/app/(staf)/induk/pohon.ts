import { prisma } from '@/lib/prisma';
import { whereFilter, type FilterInduk } from './filter';

export type SimpulKelas = { id: number; nama: string; jumlah: number };
export type SimpulTingkat = { tingkat: string; label: string; jumlah: number; kelas: SimpulKelas[] };
export type SimpulUnit = { id: number; nama: string; jumlah: number; tingkat: SimpulTingkat[]; alumni: number };

/** Urutan tampil lembaga di pohon: SMP lebih dulu, lalu MA, lalu Madin. */
const URUTAN_UNIT = ['SMP', 'MA', 'Madin'];

/** Label tingkat per unit — SMP & MA memakai angka romawi tingkat sekolah,
 * unit lain (mis. Madin) memakai angka tingkat apa adanya. */
const LABEL_TINGKAT: Record<string, Record<string, string>> = {
  SMP: { '7': 'Tingkat VII', '8': 'Tingkat VIII', '9': 'Tingkat IX' },
  MA: { '10': 'Tingkat X', '11': 'Tingkat XI', '12': 'Tingkat XII' },
};

function labelTingkat(unitNama: string, tingkat: string): string {
  return LABEL_TINGKAT[unitNama]?.[tingkat] ?? `Tingkat ${tingkat}`;
}

export type PohonInduk = {
  total: number;
  tanpaKelas: number;
  unit: SimpulUnit[];
};

/** Susunan lembaga → tingkat → kelas beserta cacah santri.
 * Cacah menghormati filter selain unit/kelas (status, JK, angkatan, pencarian),
 * supaya angka di pohon = angka yang benar-benar akan muncul saat simpul diklik. */
export async function ambilPohon(f: FilterInduk): Promise<PohonInduk> {
  const whereDasar = whereFilter({ ...f, unitId: undefined, kelasId: undefined, alumniUnitId: undefined });

  const [unitRows, kelasRows, cacah, total, tanpaKelas] = await Promise.all([
    // Poskestren bukan lembaga tempat santri terdaftar (layanan kesehatan,
    // bukan jenjang) — dikeluarkan dari pohon induk santri.
    prisma.unit.findMany({ where: { aktif: true, key: { not: 'Poskestren' } } }),
    prisma.kelas.findMany({ orderBy: [{ tingkat: 'asc' }, { nama: 'asc' }] }),
    prisma.santri.groupBy({ by: ['kelasId'], where: whereDasar, _count: { _all: true } }),
    prisma.santri.count({ where: whereDasar }),
    prisma.santri.count({ where: { AND: [whereDasar, { kelasId: null }] } }),
  ]);

  const perKelas = new Map<number, number>();
  for (const b of cacah) if (b.kelasId !== null) perKelas.set(b.kelasId, b._count._all);

  // Cacah alumni per unit dihitung dengan `whereFilter` sendiri (bukan turunan
  // `whereDasar`) karena syarat alumni bersandar pada RiwayatPendidikan dan
  // sengaja tidak memaksa status Mukim — alumni SMP yang kini mukim di MA ikut.
  const alumniPerUnit = new Map<number, number>(
    await Promise.all(unitRows.map(async (u): Promise<[number, number]> => [
      u.id,
      await prisma.santri.count({ where: whereFilter({ ...f, unitId: undefined, kelasId: undefined, alumniUnitId: u.id }) }),
    ])),
  );

  const unit: SimpulUnit[] = unitRows
    .slice()
    .sort((a, b) => URUTAN_UNIT.indexOf(a.nama) - URUTAN_UNIT.indexOf(b.nama))
    .map((u) => {
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
          label: labelTingkat(u.nama, nama),
          kelas,
          jumlah: kelas.reduce((a, k) => a + k.jumlah, 0),
        }))
        .sort((a, b) => a.tingkat.localeCompare(b.tingkat, 'id', { numeric: true }));
      return {
        id: u.id,
        nama: u.nama,
        // Cacah unit tetap berisi penempatan aktif saja; alumni punya cacahnya
        // sendiri supaya santri yang alumni SMP + mukim MA tidak terhitung dobel.
        jumlah: tingkat.reduce((a, t) => a + t.jumlah, 0),
        tingkat,
        alumni: alumniPerUnit.get(u.id) ?? 0,
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
