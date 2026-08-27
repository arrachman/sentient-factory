'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requirePage } from '@/lib/access';
import { recordAudit } from '@/lib/audit';

const JALUR = '/data/wali';

const teks = (form: FormData, key: string) => String(form.get(key) ?? '').trim();

/**
 * Tambah atau pindahkan wali seorang santri. `relasi_wali` unik per
 * (wali, anak), jadi pasangan yang sudah ada di-update alih-alih ditolak.
 */
export async function simpanRelasiWali(formData: FormData) {
  const session = await requirePage('induk');
  const waliId = BigInt(teks(formData, 'waliId') || '0');
  const anakId = BigInt(teks(formData, 'anakId') || '0');
  const hubungan = teks(formData, 'hubungan') || 'Wali';
  const pekerjaan = teks(formData, 'pekerjaan') || null;
  const utama = formData.get('utama') === 'on';
  if (!waliId || !anakId) return;
  if (waliId === anakId) return;

  const [wali, anak] = await Promise.all([
    prisma.orang.findUnique({ where: { id: waliId }, select: { nama: true } }),
    prisma.orang.findUnique({ where: { id: anakId }, select: { nama: true } }),
  ]);
  if (!wali || !anak) return;

  // Hanya satu wali utama per anak; turunkan yang lain lebih dulu.
  if (utama) await prisma.relasiWali.updateMany({ where: { anakId }, data: { utama: false } });

  await prisma.relasiWali.upsert({
    where: { waliId_anakId: { waliId, anakId } },
    create: { waliId, anakId, hubungan, pekerjaan, utama, peran: hubungan },
    update: { hubungan, pekerjaan, utama, peran: hubungan },
  });

  await recordAudit({
    aksi: 'simpan',
    entitas: 'relasi_wali',
    entitasId: `${waliId}-${anakId}`,
    ringkasan: `${wali.nama} ditetapkan sebagai ${hubungan} dari ${anak.nama}`,
    perubahan: { hubungan, pekerjaan, utama },
    aktor: { id: session.userId, nama: session.nama },
  });
  revalidatePath(JALUR);
}

/** Lepaskan wali dari seorang santri. Identitas orangnya sendiri tidak dihapus. */
export async function hapusRelasiWali(formData: FormData) {
  const session = await requirePage('induk');
  const id = BigInt(teks(formData, 'id') || '0');
  if (!id) return;

  const relasi = await prisma.relasiWali.findUnique({
    where: { id },
    select: { wali: { select: { nama: true } }, anak: { select: { nama: true } } },
  });
  if (!relasi) return;

  await prisma.relasiWali.delete({ where: { id } });
  await recordAudit({
    aksi: 'hapus',
    entitas: 'relasi_wali',
    entitasId: String(id),
    ringkasan: `${relasi.wali.nama} dilepas sebagai wali ${relasi.anak.nama}`,
    aktor: { id: session.userId, nama: session.nama },
  });
  revalidatePath(JALUR);
}

/** Jadikan satu relasi sebagai wali utama, sekaligus menurunkan yang lain. */
export async function jadikanWaliUtama(formData: FormData) {
  const session = await requirePage('induk');
  const id = BigInt(teks(formData, 'id') || '0');
  if (!id) return;

  const relasi = await prisma.relasiWali.findUnique({
    where: { id },
    select: { anakId: true, wali: { select: { nama: true } }, anak: { select: { nama: true } } },
  });
  if (!relasi) return;

  await prisma.$transaction([
    prisma.relasiWali.updateMany({ where: { anakId: relasi.anakId }, data: { utama: false } }),
    prisma.relasiWali.update({ where: { id }, data: { utama: true } }),
  ]);
  await recordAudit({
    aksi: 'ubah',
    entitas: 'relasi_wali',
    entitasId: String(id),
    ringkasan: `${relasi.wali.nama} jadi wali utama ${relasi.anak.nama}`,
    aktor: { id: session.userId, nama: session.nama },
  });
  revalidatePath(JALUR);
}
