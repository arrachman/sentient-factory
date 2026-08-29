import type { Prisma } from '@prisma/client';

/** Status santri yang ditampilkan di /induk tanpa filter alumni. Halaman ini
 * adalah **data induk aktif**: hanya santri mukim. Santri keluar sengaja tidak
 * bisa dijangkau lewat URL. Alumni dijangkau lewat cabang "Alumni" per unit
 * (`alumniUnitId`), bukan lewat status — lihat `whereFilter`. */
const STATUS_AKTIF = 'Mukim' as const;

export type FilterInduk = {
  q: string;
  unitId?: number;
  kelasId?: number | 'none';
  jk?: 'L' | 'P';
  angkatan?: string;
  alumniUnitId?: number;
};

const ambilSatu = (sp: Record<string, string | string[] | undefined>, k: string) => {
  const v = sp[k];
  const s = Array.isArray(v) ? v[0] : v;
  return s && s.trim() ? s.trim() : undefined;
};

const angkaPositif = (s?: string) => {
  const n = Number(s);
  return s && Number.isInteger(n) && n > 0 ? n : undefined;
};

export function bacaFilter(sp: Record<string, string | string[] | undefined>): FilterInduk {
  const jk = ambilSatu(sp, 'jk');
  return {
    q: ambilSatu(sp, 'q') ?? '',
    unitId: angkaPositif(ambilSatu(sp, 'unit')),
    kelasId: ambilSatu(sp, 'kelas') === 'none' ? 'none' : angkaPositif(ambilSatu(sp, 'kelas')),
    jk: jk === 'L' || jk === 'P' ? jk : undefined,
    angkatan: ambilSatu(sp, 'angkatan'),
    alumniUnitId: angkaPositif(ambilSatu(sp, 'alumni')),
  };
}

/** WHERE Prisma dari filter, disusun sebagai daftar AND supaya pencarian bebas
 * (OR nama/NIS/NISN) tidak bentrok dengan penyaring jenis kelamin di relasi yang sama.
 * Kelas menang atas unit karena kelas sudah menyiratkan unitnya. */
export function whereFilter(f: FilterInduk): Prisma.SantriWhereInput {
  const syarat: Prisma.SantriWhereInput[] = [];
  if (f.alumniUnitId) {
    syarat.push({ orang: { riwayatPendidikan: { some: { unitId: f.alumniUnitId, status: 'Alumni' } } } });
  } else {
    if (f.kelasId === 'none') syarat.push({ kelasId: null });
    else if (f.kelasId) syarat.push({ kelasId: f.kelasId });
    else if (f.unitId) syarat.push({ unitId: f.unitId });
    syarat.push({ status: STATUS_AKTIF });
  }
  if (f.angkatan) syarat.push({ tahunMasuk: f.angkatan });
  if (f.jk) syarat.push({ orang: { jk: f.jk } });
  if (f.q) {
    syarat.push({
      OR: [
        { orang: { nama: { contains: f.q } } },
        { nis: { contains: f.q } },
        { nisn: { contains: f.q } },
      ],
    });
  }
  return syarat.length ? { AND: syarat } : {};
}

/** Query-string kanonis: hanya kunci berisi, urutan tetap supaya URL stabil & bisa dibookmark. */
export function queryFilter(f: Partial<FilterInduk>): string {
  const p = new URLSearchParams();
  if (f.q) p.set('q', f.q);
  if (f.unitId) p.set('unit', String(f.unitId));
  if (f.kelasId) p.set('kelas', String(f.kelasId));
  if (f.alumniUnitId) p.set('alumni', String(f.alumniUnitId));
  if (f.jk) p.set('jk', f.jk);
  if (f.angkatan) p.set('angkatan', f.angkatan);
  return p.toString();
}

/** Tautan ke /induk dengan filter sekarang + perubahan. `sel`/`tab` opsional
 * karena mengganti filter harus mereset seleksi (santri lama bisa tersaring keluar).
 * `halaman` juga tidak ikut terbawa: penyaring baru selalu mulai dari halaman 1. */
export function hrefInduk(
  f: FilterInduk,
  ubah: Partial<FilterInduk> = {},
  extra: { sel?: bigint | string; tab?: string; halaman?: number } = {},
): string {
  // Simpul Alumni dan simpul unit/kelas saling meniadakan: keduanya menjawab
  // "santri mana", jadi memilih salah satu harus membersihkan yang lain.
  const bersih: Partial<FilterInduk> = 'alumniUnitId' in ubah
    ? { unitId: undefined, kelasId: undefined }
    : ('unitId' in ubah || 'kelasId' in ubah) ? { alumniUnitId: undefined } : {};
  const gabung = { ...f, ...bersih, ...ubah };
  const p = new URLSearchParams(queryFilter(gabung));
  if (extra.sel !== undefined) p.set('sel', String(extra.sel));
  if (extra.tab) p.set('tab', extra.tab);
  if (extra.halaman && extra.halaman > 1) p.set('halaman', String(extra.halaman));
  const s = p.toString();
  return s ? `/induk?${s}` : '/induk';
}

export function jumlahFilterAktif(f: FilterInduk): number {
  return [f.q, f.unitId, f.kelasId, f.alumniUnitId, f.jk, f.angkatan].filter(Boolean).length;
}
