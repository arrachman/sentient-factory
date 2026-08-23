import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { readSession } from '@/lib/auth';
import { recordAudit, requestIp } from '@/lib/audit';
import { castId, coerce, delegateFor, listRows, serialize } from '@/lib/crud/engine';
import { getEntity } from '@/lib/crud/registry';

const idSchema = z.string().regex(/^\d+$/);

async function authorize(entityKey: string) {
  const session = await readSession();
  const entity = getEntity(entityKey);
  if (!session || !entity) return { session: null, entity: null, denied: true };
  const granted = entity.menu === 'dashboard' || await prisma.menuPeran.count({ where: { menu: { key: entity.menu }, peran: { key: { in: session.peran } } } });
  return { session, entity, denied: granted === 0 };
}

function responseError(message: string, status: number) {
  return Response.json({ success: false, data: null, error: { code: status === 403 ? 'FORBIDDEN' : 'VALIDATION_ERROR', message } }, { status });
}

export async function GET(_request: Request, context: { params: Promise<{ entity: string }> }) {
  const { entity: key } = await context.params;
  const auth = await authorize(key);
  if (auth.denied || !auth.entity) return responseError('Tidak berwenang.', auth.entity ? 403 : 404);
  return Response.json({ success: true, data: await listRows(auth.entity), error: null });
}

export async function POST(request: Request, context: { params: Promise<{ entity: string }> }) {
  const { entity: key } = await context.params;
  const auth = await authorize(key);
  if (auth.denied || !auth.entity || !auth.session) return responseError('Tidak berwenang.', auth.entity ? 403 : 404);
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return responseError('Data tidak valid.', 400);
  const parsed = coerce(auth.entity, body as Record<string, unknown>);
  if (parsed.errors.length) return responseError(parsed.errors[0], 400);
  try {
    const row = await delegateFor(auth.entity).create({ data: parsed.data });
    await recordAudit({ aksi: 'CRUD_CREATE', entitas: auth.entity.model, entitasId: String(row.id), ringkasan: `Membuat ${auth.entity.label}`, perubahan: parsed.data, aktor: { id: auth.session.userId, nama: auth.session.nama }, ip: requestIp(request) });
    return Response.json({ success: true, data: serialize(row), error: null }, { status: 201 });
  } catch (error) {
    return responseError(error instanceof Error ? error.message : 'Gagal menyimpan data.', 400);
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ entity: string }> }) {
  return updateOrDelete(request, context, 'update');
}

export async function DELETE(request: Request, context: { params: Promise<{ entity: string }> }) {
  return updateOrDelete(request, context, 'delete');
}

async function updateOrDelete(request: Request, context: { params: Promise<{ entity: string }> }, action: 'update' | 'delete') {
  const { entity: key } = await context.params;
  const auth = await authorize(key);
  if (auth.denied || !auth.entity || !auth.session) return responseError('Tidak berwenang.', auth.entity ? 403 : 404);
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const idResult = idSchema.safeParse(body?.id);
  if (!idResult.success) return responseError('ID tidak valid.', 400);
  const delegate = delegateFor(auth.entity);
  try {
    const data = action === 'delete' ? await delegate.delete({ where: { id: castId(auth.entity, idResult.data) } }) : (() => { const parsed = coerce(auth.entity, body ?? {}, true); if (parsed.errors.length) throw new Error(parsed.errors[0]); return delegate.update({ where: { id: castId(auth.entity, idResult.data) }, data: parsed.data }); })();
    const row = await data;
    await recordAudit({ aksi: action === 'delete' ? 'CRUD_DELETE' : 'CRUD_UPDATE', entitas: auth.entity.model, entitasId: idResult.data, ringkasan: `${action === 'delete' ? 'Menghapus' : 'Mengubah'} ${auth.entity.label}`, aktor: { id: auth.session.userId, nama: auth.session.nama }, ip: requestIp(request) });
    return Response.json({ success: true, data: serialize(row), error: null });
  } catch (error) {
    return responseError(pesanGagal(error, auth.entity.label, action), 400);
  }
}

/**
 * Prisma melempar P2003 saat baris masih dirujuk tabel lain (mis. mata pelajaran
 * yang dipakai capaian pembelajaran). Tampilkan alasannya, bukan pesan internal.
 */
function pesanGagal(error: unknown, label: string, action: 'update' | 'delete'): string {
  const teks = error instanceof Error ? error.message : '';
  if (teks.includes('Foreign key constraint')) {
    return `${label} ini masih dipakai data lain, jadi tidak bisa dihapus. Hapus atau alihkan data yang merujuknya lebih dulu.`;
  }
  if (teks.includes('Record to') && teks.includes('not found')) return `${label} tidak ditemukan.`;
  return teks || (action === 'delete' ? 'Gagal menghapus data.' : 'Gagal mengubah data.');
}
