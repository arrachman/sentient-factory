/**
 * Tambah menu "Kepegawaian" (Fase 6: piket, jurnal mengajar, presensi
 * pegawai, beban jam, arsip SK) beserta grant `menu_peran`-nya.
 *
 * Ditaruh di skrip terpisah, BUKAN di `prisma/seed.ts`, karena file itu
 * sedang diubah paralel oleh agent lain untuk Fase 4. Idempoten (upsert).
 *
 * Jalankan: `npm exec tsx prisma/import/menu-kepegawaian.ts`.
 */
import { prisma } from '@/lib/prisma';

const PERAN_DIBERI_AKSES = ['superadmin', 'kepsmp', 'kepma', 'tata-usaha'];

async function jalankan(): Promise<void> {
  const menu = await prisma.menu.upsert({
    where: { key: 'kepegawaian' },
    create: { key: 'kepegawaian', label: 'Kepegawaian', urutan: 14 },
    update: { label: 'Kepegawaian' },
  });

  for (const key of PERAN_DIBERI_AKSES) {
    const peran = await prisma.peran.findUnique({ where: { key } });
    if (!peran) {
      console.warn(`Peran "${key}" tidak ditemukan — dilewati.`);
      continue;
    }
    await prisma.menuPeran.upsert({
      where: { menuId_peranId: { menuId: menu.id, peranId: peran.id } },
      create: { menuId: menu.id, peranId: peran.id },
      update: {},
    });
  }

  console.log(`Menu "kepegawaian" siap (id ${menu.id}), diberi akses ke: ${PERAN_DIBERI_AKSES.join(', ')}.`);
}

jalankan()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
