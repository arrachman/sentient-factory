import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { readSession } from '@/lib/auth';

const BATAS = 10;

export async function GET(request: Request) {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHENTICATED', message: 'Sesi tidak ditemukan.' } }, { status: 401 });
  }

  const params = new URL(request.url).searchParams;
  const q = params.get('q')?.trim() ?? '';
  const ids = (params.get('ids') ?? '').split(',').map((item) => item.trim()).filter((item) => /^\d+$/.test(item));
  const rows = await prisma.wilayah.findMany({
    where: ids.length ? { id: { in: ids.map((item) => BigInt(item)) } } : {
      aktif: true,
      tingkat: 'Desa',
      ...(q ? {
        OR: [
          { nama: { contains: q } },
          { namaLengkap: { contains: q } },
          { alias: { some: { alias: { contains: q } } } },
        ],
      } : {}),
    },
    select: { id: true, nama: true, labelTipe: true, namaLengkap: true, kodePos: true, aktif: true, tingkat: true },
    orderBy: { nama: 'asc' },
    take: ids.length ? ids.length : BATAS,
  });

  return NextResponse.json({
    success: true,
    data: rows
      .filter((row) => ids.length || (row.aktif && row.tingkat === 'Desa'))
      .map((row) => ({
        id: String(row.id),
        nama: `${row.labelTipe ?? ''} ${row.nama}`.trim(),
        keterangan: [row.namaLengkap, row.kodePos ? `Kode pos ${row.kodePos}` : null].filter(Boolean).join(' · '),
      })),
  });
}
