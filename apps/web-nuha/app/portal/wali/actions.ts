'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { readSession } from '@/lib/auth';

/**
 * Pastikan santriId yang dikirim form benar-benar anak dari wali yang sedang
 * login — form field bisa dipalsukan klien, jadi validasi ulang di server
 * terhadap RelasiWali, jangan percaya nilai yang dikirim begitu saja.
 */
async function santriMilikWaliSesi(santriId: bigint) {
  const session = await readSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { id: BigInt(session.userId) } });
  if (!user) return null;
  const relasi = await prisma.relasiWali.findFirst({
    where: { waliId: user.orangId, anak: { santri: { id: santriId } } },
    include: { anak: { include: { santri: true } } },
  });
  return relasi?.anak.santri ?? null;
}

/** Wali mengajukan kunjungan untuk anaknya. */
export async function ajukanKunjunganWali(formData: FormData) {
  const santriId = BigInt(String(formData.get('santriId')));
  const santri = await santriMilikWaliSesi(santriId);
  if (!santri) throw new Error('Santri bukan anak dari akun wali ini.');

  const namaWali = String(formData.get('namaWali') ?? '').trim();
  const tgl = String(formData.get('tgl') ?? '');
  const jam = String(formData.get('jam') ?? '');
  const keperluan = String(formData.get('keperluan') ?? '').trim();
  if (!namaWali || !tgl || !keperluan) return;

  await prisma.kunjungan.create({
    data: {
      santriId: santri.id,
      namaWali,
      hubungan: String(formData.get('hubungan') ?? ''),
      tgl: new Date(tgl),
      jamMasuk: jam,
      keperluan,
      status: 'Terjadwal',
    },
  });

  revalidatePath('/portal/wali');
}

/** Wali mengonfirmasi pembayaran atas satu tagihan anaknya. Nominal ditambahkan ke Tagihan.dibayar. */
export async function konfirmasiPembayaranWali(formData: FormData) {
  const santriId = BigInt(String(formData.get('santriId')));
  const santri = await santriMilikWaliSesi(santriId);
  if (!santri) throw new Error('Santri bukan anak dari akun wali ini.');

  const tagihanId = BigInt(String(formData.get('tagihanId')));
  const nominal = Number(formData.get('nominal') ?? 0);
  const metode = String(formData.get('metode') ?? 'Transfer bank');
  const bukti = String(formData.get('bukti') ?? '').trim();
  if (!(nominal > 0)) return;

  // Tagihan yang dibayar wajib milik santri yang sama — cegah wali membayar tagihan santri lain.
  const tagihan = await prisma.tagihan.findFirst({ where: { id: tagihanId, santriId: santri.id } });
  if (!tagihan) throw new Error('Tagihan tidak ditemukan untuk santri ini.');

  await prisma.$transaction([
    prisma.pembayaran.create({ data: { tagihanId: tagihan.id, tgl: new Date(), nominal, metode, ref: bukti || null } }),
    prisma.tagihan.update({ where: { id: tagihan.id }, data: { dibayar: { increment: nominal } } }),
  ]);

  revalidatePath('/portal/wali');
}
