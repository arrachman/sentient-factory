'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { readSession } from '@/lib/auth';
import { kirimWa, renderTemplate } from '@/lib/wa';

/** Aktif/nonaktifkan template — menghentikan/melanjutkan pengiriman otomatisnya. */
export async function toggleTemplateWa(formData: FormData) {
  const id = Number(formData.get('id'));
  const template = await prisma.templateWa.findUnique({ where: { id } });
  if (!template) return;
  await prisma.templateWa.update({ where: { id }, data: { aktif: !template.aktif } });
  revalidatePath('/notifikasi');
}

/** Kirim satu pemicu ke nomor tujuan, memakai jalur kirimWa yang sama dengan form uji (dry-run tetap berlaku). */
export async function kirimPemicu(formData: FormData) {
  const session = await readSession();
  if (!session) return;

  const templateKode = String(formData.get('templateKode') ?? '');
  const nomor = String(formData.get('nomor') ?? '');
  const tujuan = String(formData.get('tujuan') ?? '');
  if (!nomor || !tujuan) return;

  const template = templateKode ? await prisma.templateWa.findUnique({ where: { kode: templateKode } }) : null;
  const isiMentah = template?.isi ?? String(formData.get('isi') ?? '');
  if (!isiMentah) return;

  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('v.')) values[key.slice(2)] = String(value);
  }

  await kirimWa({
    nomor,
    tujuan,
    isi: renderTemplate(isiMentah, values),
    templateId: template?.id,
    actor: { id: session.userId, nama: session.nama },
    ip: null,
  });
  revalidatePath('/notifikasi');
}
