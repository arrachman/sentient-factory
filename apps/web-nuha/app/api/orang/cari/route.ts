import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { readSession } from '@/lib/auth';

const BATAS = 15;

/**
 * Pencarian identitas untuk pemilih wali. Daftar `orang` bisa ribuan baris,
 * jadi jangan dikirim utuh ke browser — cari sesuai ketikan saja.
 */
export async function GET(request: Request) {
  const session = await readSession();
  if (!session) return NextResponse.json({ success: false, error: { code: 'UNAUTHENTICATED', message: 'Sesi tidak ditemukan.' } }, { status: 401 });

  const q = new URL(request.url).searchParams.get('q')?.trim() ?? '';
  if (q.length < 2) return NextResponse.json({ success: true, data: [] });

  const rows = await prisma.orang.findMany({
    where: { OR: [{ nama: { contains: q } }, { nik: { contains: q } }, { hp: { contains: q } }] },
    select: { id: true, nama: true, hp: true, nik: true, santri: { select: { nis: true } } },
    orderBy: { nama: 'asc' },
    take: BATAS,
  });

  return NextResponse.json({
    success: true,
    data: rows.map((row) => ({
      id: String(row.id),
      nama: row.nama,
      keterangan: [row.hp, row.nik ? `NIK ${row.nik}` : null, row.santri ? `santri ${row.santri.nis ?? ''}`.trim() : null].filter(Boolean).join(' · '),
    })),
  });
}
