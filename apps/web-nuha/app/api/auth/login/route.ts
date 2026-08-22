import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';

const schema = z.object({
  email: z.string().email('Format email tidak valid.'),
  password: z.string().min(1, 'Kata sandi wajib diisi.'),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ success: false, data: null, error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0].message } }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    include: { orang: true, peran: { include: { peran: true } } },
  });

  const invalid = Response.json(
    { success: false, data: null, error: { code: 'INVALID_CREDENTIALS', message: 'Email atau kata sandi salah.' } },
    { status: 401 },
  );

  // Always run a hash comparison so response timing does not reveal account existence.
  const hash = user?.passwordHash ?? '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvaliduu';
  const ok = await bcrypt.compare(parsed.data.password, hash);
  if (!user || !ok || !user.aktif) return invalid;

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await createSession({
    userId: String(user.id),
    nama: user.orang.nama,
    email: user.email,
    peran: user.peran.map((row) => row.peran.key),
  });

  return Response.json({ success: true, data: { nama: user.orang.nama }, error: null });
}
