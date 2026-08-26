/**
 * Helper bersama untuk menulis satu baris `RelasiWali` (Ayah/Ibu/Wali) dari
 * importir siswa MA maupun SMP. `Orang` milik wali dikunci lewat NIK bila
 * tersedia (unik di seluruh tabel `Orang`); bila NIK kosong dipakai email
 * sintetis per-anak-per-peran supaya tetap idempoten tanpa menabrak wali
 * anak lain yang kebetulan nama/NIK-nya sama-sama kosong.
 */
import { prisma } from '@/lib/prisma';
import { JenisKelamin } from '@prisma/client';

export type DataWali = {
  nama: string;
  nik?: string | null;
  ttl?: string | null;
  pekerjaan?: string | null;
  pendidikan?: string | null;
  pendapatan?: string | null;
  hp?: string | null;
};

/** Peran wali: menentukan `hubungan`/`peran` di RelasiWali dan `utama` (Ayah & Ibu = kontak utama). */
export type PeranWali = 'Ayah' | 'Ibu' | 'Wali';

/**
 * Upsert Orang (wali) + RelasiWali untuk satu anak. Dilewati (return null)
 * bila `data.nama` kosong — banyak baris client tidak mengisi blok Wali
 * pihak ketiga sama sekali, itu bukan galat.
 */
export async function tulisRelasiWali(
  anakOrangId: bigint,
  kunciAnakUntukEmail: string,
  peran: PeranWali,
  data: DataWali,
): Promise<void> {
  const nama = data.nama?.trim();
  if (!nama) return;

  const nik = data.nik?.trim() || null;
  const email = nik ? null : `wali.${kunciAnakUntukEmail}.${peran.toLowerCase()}@nuha.local`;

  const waliOrang = nik
    ? await prisma.orang.upsert({
        where: { nik },
        create: { nama, jk: peran === 'Ibu' ? JenisKelamin.P : JenisKelamin.L, nik, hp: data.hp?.trim() || null },
        update: { nama, hp: data.hp?.trim() || null },
      })
    : await prisma.orang.upsert({
        where: { email: email! },
        create: { nama, jk: peran === 'Ibu' ? JenisKelamin.P : JenisKelamin.L, email, hp: data.hp?.trim() || null },
        update: { nama, hp: data.hp?.trim() || null },
      });

  await prisma.relasiWali.upsert({
    where: { waliId_anakId: { waliId: waliOrang.id, anakId: anakOrangId } },
    create: {
      waliId: waliOrang.id,
      anakId: anakOrangId,
      hubungan: peran,
      peran,
      pekerjaan: data.pekerjaan?.trim() || null,
      pendidikan: data.pendidikan?.trim() || null,
      pendapatan: data.pendapatan?.trim() || null,
      nik,
      ttl: data.ttl?.trim() || null,
      utama: peran !== 'Wali',
    },
    update: {
      hubungan: peran,
      peran,
      pekerjaan: data.pekerjaan?.trim() || null,
      pendidikan: data.pendidikan?.trim() || null,
      pendapatan: data.pendapatan?.trim() || null,
      nik,
      ttl: data.ttl?.trim() || null,
      utama: peran !== 'Wali',
    },
  });
}
