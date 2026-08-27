import { prisma } from '@/lib/prisma';
import type { Entity, Keterkaitan, Row } from './types';

/**
 * Satu baris `orang` bisa dipakai ulang sebagai santri, pegawai, dan wali.
 * Operator perlu tahu itu sebelum mengubah atau menghapus — jadi kumpulkan
 * perannya dalam satu query per relasi, bukan per baris. Akun login sengaja
 * tidak ditampilkan: semua orang di sini pasti punya akun.
 */
type PeranTersimpan = { kait: Keterkaitan[]; nilai: Record<string, string> };

async function kaitOrang(rows: Row[]): Promise<Map<string, PeranTersimpan>> {
  const ids = rows.map((row) => BigInt(row.id));
  if (!ids.length) return new Map();

  const [santri, pegawai, wali, orangTua] = await Promise.all([
    prisma.santri.findMany({ where: { orangId: { in: ids } }, select: { orangId: true, nis: true, status: true, kelas: { select: { nama: true } } } }),
    prisma.pegawai.findMany({ where: { orangId: { in: ids } }, select: { orangId: true, nip: true, jabatan: true, tugasTambahan: true } }),
    prisma.relasiWali.findMany({ where: { waliId: { in: ids } }, select: { waliId: true, anakId: true, hubungan: true, anak: { select: { nama: true } } } }),
    // Wali dari orang ini (dipakai saat identitasnya berperan santri).
    prisma.relasiWali.findMany({ where: { anakId: { in: ids } }, select: { anakId: true, waliId: true, hubungan: true, utama: true }, orderBy: [{ utama: 'desc' }, { id: 'asc' }] }),
  ]);

  const hasil = new Map<string, PeranTersimpan>();
  const entri = (orangId: bigint): PeranTersimpan => {
    const key = String(orangId);
    const ada = hasil.get(key) ?? { kait: [], nilai: {} };
    hasil.set(key, ada);
    return ada;
  };
  const tambah = (orangId: bigint, kait: Keterkaitan) => { entri(orangId).kait.push(kait); };
  const setel = (orangId: bigint, nilai: Record<string, string>) => { Object.assign(entri(orangId).nilai, nilai); };

  for (const s of santri) {
    tambah(s.orangId, { label: 'Santri', nada: 'hijau', href: '/induk', detail: [s.nis ? `NIS ${s.nis}` : null, s.kelas?.nama, s.status].filter(Boolean).join(' · ') || 'Terdaftar' });
    setel(s.orangId, { peranOrang: 'santri', peranNis: s.nis ?? '', peranStatusSantri: s.status });
  }
  for (const p of pegawai) {
    const detail = [`NIP ${p.nip}`, p.jabatan, p.tugasTambahan].filter(Boolean).join(' · ');
    tambah(p.orangId, { label: 'Pegawai', nada: 'biru', href: '/kepegawaian', detail });
    const peran = p.jabatan.includes('Guru') ? 'guru' : 'staf';
    // Santri menang sebagai peran utama bila (jarang) keduanya ada.
    const nilai: Record<string, string> = { peranNip: p.nip, peranJabatan: p.jabatan, peranTugasTambahan: p.tugasTambahan ?? '' };
    if (!hasil.get(String(p.orangId))?.nilai.peranOrang) nilai.peranOrang = peran;
    setel(p.orangId, nilai);
  }
  const relasiTeks = (items: { id: bigint; hubungan: string }[]) =>
    JSON.stringify(items.map((item) => ({ id: String(item.id), hubungan: item.hubungan })));

  const perWali = new Map<string, { id: bigint; hubungan: string }[]>();
  for (const w of wali) {
    tambah(w.waliId, { label: 'Wali', nada: 'kuning', href: '/data/orang#wali', detail: `${w.hubungan} dari ${w.anak.nama}` });
    const key = String(w.waliId);
    perWali.set(key, [...(perWali.get(key) ?? []), { id: w.anakId, hubungan: w.hubungan }]);
  }
  for (const [key, anak] of perWali) {
    const orangId = BigInt(key);
    const nilai: Record<string, string> = { peranAnak: relasiTeks(anak) };
    if (!hasil.get(key)?.nilai.peranOrang) nilai.peranOrang = 'wali';
    setel(orangId, nilai);
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
  if (entity.key !== 'orang') return rows;
  const peta = await kaitOrang(rows);
  return rows.map((row) => {
    const info = peta.get(row.id);
    return { ...row, ...(info?.nilai ?? {}), peranOrang: info?.nilai.peranOrang ?? 'belum', _kait: info?.kait ?? [] };
  });
}
