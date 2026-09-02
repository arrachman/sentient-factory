import { prisma } from '@/lib/prisma';
import type { Entity, Keterkaitan, Row } from './types';

/**
 * Satu baris `orang` bisa dipakai ulang sebagai santri, pegawai, dan wali.
 * Operator perlu tahu itu sebelum mengubah atau menghapus — jadi kumpulkan
 * perannya dalam satu query per relasi, bukan per baris. Akun login sengaja
 * tidak ditampilkan: semua orang di sini pasti punya akun.
 */
type PeranTersimpan = { kait: Keterkaitan[]; nilai: Record<string, string>; peran: Set<string> };

async function kaitOrang(rows: Row[]): Promise<Map<string, PeranTersimpan>> {
  const ids = rows.map((row) => BigInt(row.id));
  if (!ids.length) return new Map();

  const [santri, pegawai, wali, orangTua] = await Promise.all([
    prisma.santri.findMany({ where: { personId: { in: ids } }, select: { personId: true, nis: true, status: true, kelas: { select: { nama: true } } } }),
    prisma.pegawai.findMany({ where: { personId: { in: ids } }, select: { personId: true, nip: true, jabatan: true, tugasTambahan: true } }),
    prisma.relasiWali.findMany({ where: { waliId: { in: ids } }, select: { waliId: true, anakId: true, hubungan: true, anak: { select: { fullName: true } } } }),
    // Wali dari orang ini (dipakai saat identitasnya berperan santri).
    prisma.relasiWali.findMany({ where: { anakId: { in: ids } }, select: { anakId: true, waliId: true, hubungan: true, utama: true }, orderBy: [{ utama: 'desc' }, { id: 'asc' }] }),
  ]);

  const hasil = new Map<string, PeranTersimpan>();
  const entri = (orangId: bigint): PeranTersimpan => {
    const key = String(orangId);
    const ada = hasil.get(key) ?? { kait: [], nilai: {}, peran: new Set<string>() };
    hasil.set(key, ada);
    return ada;
  };
  const tambah = (orangId: bigint, kait: Keterkaitan) => { entri(orangId).kait.push(kait); };
  const setel = (orangId: bigint, nilai: Record<string, string>) => { Object.assign(entri(orangId).nilai, nilai); };
  // Peran bersifat kumulatif: satu orang bisa santri sekaligus guru dan wali.
  const tandai = (orangId: bigint, peran: string) => { entri(orangId).peran.add(peran); };

  for (const s of santri) {
    tambah(s.personId, { label: 'Santri', nada: 'hijau', href: '/induk', detail: [s.nis ? `NIS ${s.nis}` : null, s.kelas?.nama, s.status].filter(Boolean).join(' · ') || 'Terdaftar' });
    setel(s.personId, { peranNis: s.nis ?? '', peranStatusSantri: s.status });
    tandai(s.personId, 'santri');
  }
  for (const p of pegawai) {
    const detail = [`NIP ${p.nip}`, p.jabatan, p.tugasTambahan].filter(Boolean).join(' · ');
    tambah(p.personId, { label: 'Pegawai', nada: 'biru', href: '/kepegawaian', detail });
    setel(p.personId, { peranNip: p.nip, peranJabatan: p.jabatan, peranTugasTambahan: p.tugasTambahan ?? '' });
    tandai(p.personId, p.jabatan.includes('Guru') ? 'guru' : 'staf');
  }
  const relasiTeks = (items: { id: bigint; hubungan: string }[]) =>
    JSON.stringify(items.map((item) => ({ id: String(item.id), hubungan: item.hubungan })));

  const perWali = new Map<string, { id: bigint; hubungan: string }[]>();
  for (const w of wali) {
    tambah(w.waliId, { label: 'Wali', nada: 'kuning', href: '/data/orang#wali', detail: `${w.hubungan} dari ${w.anak.fullName}` });
    const key = String(w.waliId);
    perWali.set(key, [...(perWali.get(key) ?? []), { id: w.anakId, hubungan: w.hubungan }]);
  }
  for (const [key, anak] of perWali) {
    const orangId = BigInt(key);
    setel(orangId, { peranAnak: relasiTeks(anak) });
    tandai(orangId, 'wali');
  }

  const perAnak = new Map<string, { id: bigint; hubungan: string }[]>();
  for (const r of orangTua) {
    const key = String(r.anakId);
    perAnak.set(key, [...(perAnak.get(key) ?? []), { id: r.waliId, hubungan: r.hubungan }]);
  }
  for (const [key, waliList] of perAnak) setel(BigInt(key), { peranWali: relasiTeks(waliList) });

  return hasil;
}

/**
 * Lampirkan `_kait` dan nilai awal field peran. Nilainya ditaruh di baris
 * supaya form ubah bisa memuat peran yang sudah ada (`row[field.name]`).
 */
export async function lampirkanKeterkaitan(entity: Entity, rows: Row[]): Promise<Row[]> {
  // Berlaku untuk semua entitas yang barisnya adalah `orang` — termasuk
  // entitas persona (Santri, Guru, Staf, Wali) yang berbagi tabel yang sama.
  if (entity.model !== 'orang') return rows;
  const peta = await kaitOrang(rows);
  return rows.map((row) => {
    const info = peta.get(row.id);
    // Daftar dipisah koma — bentuk yang dibaca kontrol `pilihan-banyak`.
    return { ...row, ...(info?.nilai ?? {}), peranOrang: [...(info?.peran ?? [])].join(','), _kait: info?.kait ?? [] };
  });
}
