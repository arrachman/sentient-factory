import { prisma } from '@/lib/prisma';
import type { Entity, Keterkaitan, Row } from './types';

/**
 * Satu baris `orang` bisa dipakai ulang sebagai santri, pegawai, wali, dan
 * pemilik akun. Operator perlu tahu itu sebelum mengubah atau menghapus —
 * jadi kumpulkan perannya dalam satu query per relasi, bukan per baris.
 */
async function kaitOrang(rows: Row[]): Promise<Map<string, Keterkaitan[]>> {
  const ids = rows.map((row) => BigInt(row.id));
  if (!ids.length) return new Map();

  const [santri, pegawai, akun, wali] = await Promise.all([
    prisma.santri.findMany({ where: { orangId: { in: ids } }, select: { orangId: true, nis: true, status: true, kelas: { select: { nama: true } } } }),
    prisma.pegawai.findMany({ where: { orangId: { in: ids } }, select: { orangId: true, nip: true, jabatan: true } }),
    prisma.user.findMany({ where: { orangId: { in: ids } }, select: { orangId: true, username: true, email: true, aktif: true, peran: { select: { peran: { select: { nama: true } } } } } }),
    prisma.relasiWali.findMany({ where: { waliId: { in: ids } }, select: { waliId: true, hubungan: true, anak: { select: { nama: true } } } }),
  ]);

  const hasil = new Map<string, Keterkaitan[]>();
  const tambah = (orangId: bigint, kait: Keterkaitan) => {
    const key = String(orangId);
    hasil.set(key, [...(hasil.get(key) ?? []), kait]);
  };

  for (const s of santri) {
    tambah(s.orangId, { label: 'Santri', nada: 'hijau', href: '/induk', detail: [s.nis ? `NIS ${s.nis}` : null, s.kelas?.nama, s.status].filter(Boolean).join(' · ') || 'Terdaftar' });
  }
  for (const p of pegawai) {
    tambah(p.orangId, { label: 'Pegawai', nada: 'biru', href: '/kepegawaian', detail: `NIP ${p.nip} · ${p.jabatan}` });
  }
  for (const w of wali) {
    tambah(w.waliId, { label: 'Wali', nada: 'kuning', href: '/data/wali', detail: `${w.hubungan} dari ${w.anak.nama}` });
  }
  for (const a of akun) {
    const peran = a.peran.map((item) => item.peran.nama).join(', ');
    tambah(a.orangId, { label: 'Akun login', nada: a.aktif ? 'netral' : 'kuning', detail: [a.username ?? a.email, peran || 'tanpa peran', a.aktif ? null : 'nonaktif'].filter(Boolean).join(' · ') });
  }
  return hasil;
}

/** Lampirkan `_kait` bila entitasnya memang punya relasi lintas modul. */
export async function lampirkanKeterkaitan(entity: Entity, rows: Row[]): Promise<Row[]> {
  if (entity.key !== 'orang') return rows;
  const peta = await kaitOrang(rows);
  return rows.map((row) => ({ ...row, _kait: peta.get(row.id) ?? [] }));
}
