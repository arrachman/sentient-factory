import { prisma } from '@/lib/prisma';

const ID_WILAYAH = /^\d+$/;

export function parseIdWilayah(value: unknown): bigint | null {
  const raw = String(value ?? '').trim();
  if (!ID_WILAYAH.test(raw)) return null;
  return BigInt(raw);
}

export async function validasiDesaAktif(value: unknown): Promise<string | null> {
  if (value === null || value === undefined || value === '') return null;
  const id = typeof value === 'bigint' ? value : parseIdWilayah(value);
  if (id === null) return 'Wilayah harus dipilih dari daftar desa yang tersedia.';

  const wilayah = await prisma.wilayah.findUnique({
    where: { id },
    select: { tingkat: true, aktif: true },
  });

  if (!wilayah || !wilayah.aktif || wilayah.tingkat !== 'Desa') {
    return 'Wilayah harus berupa desa atau kelurahan aktif.';
  }

  return null;
}
