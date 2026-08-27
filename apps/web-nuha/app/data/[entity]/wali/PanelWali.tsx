import { prisma } from '@/lib/prisma';
import { FormRelasiWali } from './FormRelasiWali';

/**
 * Panel "Hubungkan wali ke santri" yang menempel di halaman Identitas orang.
 * Relasi wali↔anak adalah pasangan antar-baris `orang`, jadi tidak bisa jadi
 * entitas CRUD biasa — tapi tempatnya tetap di sini agar operator tidak
 * berpindah halaman untuk mengurus orang yang sama. Daftar relasinya sendiri
 * tidak ditampilkan di sini: tabel orang di atas sudah memuat kolom kaitnya.
 */
export async function PanelWali() {
  // Kandidat anak: hanya orang yang benar-benar terdaftar sebagai santri.
  const santri = await prisma.santri.findMany({
    select: { orangId: true, nis: true, orang: { select: { nama: true } } },
    orderBy: { orang: { nama: 'asc' } },
  });

  return <section id="wali" style={{ marginTop: 28 }}>
    <FormRelasiWali santri={santri.map((s) => ({ orangId: String(s.orangId), nama: s.orang.nama, nis: s.nis }))} />
  </section>;
}
