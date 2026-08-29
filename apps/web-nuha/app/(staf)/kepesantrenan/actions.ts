'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

const SESI_VALID = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];
const STATUS_VALID = ['Hadir', 'Sakit', 'Izin', 'Alpa'] as const;

/** Simpan absensi jamaah satu sesi untuk seluruh santri mukim sekaligus. */
export async function simpanAbsenJamaah(formData: FormData) {
  const sesi = String(formData.get('sesi') ?? '');
  if (!SESI_VALID.includes(sesi)) return;

  const hariIni = new Date();
  hariIni.setHours(0, 0, 0, 0);

  const entri: Array<{ santriId: bigint; status: (typeof STATUS_VALID)[number] }> = [];
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith('status-')) continue;
    const status = String(value);
    if (!STATUS_VALID.includes(status as (typeof STATUS_VALID)[number])) continue;
    entri.push({ santriId: BigInt(key.slice('status-'.length)), status: status as (typeof STATUS_VALID)[number] });
  }

  await Promise.all(
    entri.map((e) =>
      prisma.presensi.upsert({
        where: { santriId_tgl_sesi: { santriId: e.santriId, tgl: hariIni, sesi } },
        create: { santriId: e.santriId, tgl: hariIni, sesi, status: e.status },
        update: { status: e.status },
      }),
    ),
  );

  revalidatePath('/kepesantrenan');
}

/** Ubah status pengajuan izin (Disetujui/Ditolak) atau tandai santri sudah kembali. */
export async function ubahStatusIzin(formData: FormData) {
  const id = BigInt(String(formData.get('id')));
  const aksi = String(formData.get('aksi'));

  if (aksi === 'setuju') {
    await prisma.izin.update({ where: { id }, data: { status: 'Disetujui' } });
  } else if (aksi === 'tolak') {
    await prisma.izin.update({ where: { id }, data: { status: 'Ditolak' } });
  } else if (aksi === 'kembali') {
    await prisma.izin.update({ where: { id }, data: { status: 'Selesai', kembaliAt: new Date() } });
  }

  revalidatePath('/kepesantrenan');
}
