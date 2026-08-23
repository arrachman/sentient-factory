'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { readSession } from '@/lib/auth';

/** Santri hanya boleh mengajukan izin untuk dirinya sendiri, diambil dari sesi — bukan dari form. */
export async function ajukanIzin(formData: FormData) {
  const session = await readSession();
  if (!session) throw new Error('Sesi tidak valid.');
  const user = await prisma.user.findUnique({ where: { id: BigInt(session.userId) }, include: { orang: { include: { santri: true } } } });
  const santri = user?.orang.santri;
  if (!santri) throw new Error('Akun ini tidak tertaut ke data santri.');

  const jenis = String(formData.get('jenis') ?? '').trim();
  const mulai = String(formData.get('mulai') ?? '');
  const selesai = String(formData.get('selesai') ?? '');
  const alasan = String(formData.get('alasan') ?? '').trim();
  const penjemput = String(formData.get('penjemput') ?? '').trim();
  if (!jenis || !mulai || !alasan || !penjemput) return;

  const kode = `IZN-${Date.now().toString(36).toUpperCase()}`;
  await prisma.izin.create({
    data: {
      kode,
      santriId: santri.id,
      jenis,
      alasan,
      penjemput,
      keluarAt: new Date(mulai),
      kembaliAt: selesai ? new Date(selesai) : null,
      status: 'Menunggu',
    },
  });

  revalidatePath('/portal/santri');
}
