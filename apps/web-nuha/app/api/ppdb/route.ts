import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { readSession } from '@/lib/auth';

const schema = z.object({
  nama: z.string().trim().min(3, 'Nama minimal 3 karakter.').max(160),
  jk: z.enum(['L', 'P']),
  pilihan: z.string().trim().min(1, 'Pilihan unit wajib diisi.').max(64),
  asalSekolah: z.string().trim().max(160).optional(),
  hpWali: z.string().trim().regex(/^[0-9+\-\s]{8,20}$/, 'Nomor HP wali tidak valid.'),
});

export async function GET() {
  const session = await readSession();
  if (!session) {
    return Response.json({ success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Perlu masuk.' } }, { status: 401 });
  }
  const rows = await prisma.pendaftar.findMany({ orderBy: { tglDaftar: 'desc' } });
  // MySQL IDs are Prisma BigInt values, which JSON.stringify cannot serialize.
  const data = rows.map((row) => ({ ...row, id: String(row.id) }));
  return Response.json({ success: true, data, error: null });
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ success: false, data: null, error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0].message } }, { status: 400 });
  }

  const year = new Date().getFullYear();
  const total = await prisma.pendaftar.count();
  const noReg = `PPDB-${year}-${String(total + 1).padStart(5, '0')}`;

  const pendaftar = await prisma.pendaftar.create({
    data: { ...parsed.data, noReg, tglDaftar: new Date(), status: 'Baru' },
  });

  return Response.json({ success: true, data: { noReg: pendaftar.noReg }, error: null }, { status: 201 });
}
