import { prisma } from '@/lib/prisma';

const REGION_ID = /^\d+$/;

export function parseRegionId(value: unknown): bigint | null {
  const raw = String(value ?? '').trim();
  if (!REGION_ID.test(raw)) return null;
  return BigInt(raw);
}

export async function validateActiveVillage(value: unknown): Promise<string | null> {
  if (value === null || value === undefined || value === '') return null;
  const id = typeof value === 'bigint' ? value : parseRegionId(value);
  if (id === null) return 'Wilayah harus dipilih dari daftar desa yang tersedia.';

  const region = await prisma.region.findUnique({
    where: { id },
    select: { level: true, isActive: true },
  });

  if (!region || !region.isActive || region.level !== 'Village') {
    return 'Wilayah harus berupa desa atau kelurahan aktif.';
  }

  return null;
}
