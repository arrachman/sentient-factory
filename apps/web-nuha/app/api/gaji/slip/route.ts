import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { readSession } from '@/lib/auth';
import { hitungGaji } from '@/lib/gaji';
import { recordAudit, requestIp } from '@/lib/audit';

const schema = z.object({
  pegawaiId: z.string().min(1),
  periode: z.string().regex(/^\d{4}-\d{2}$/, 'Periode memakai format YYYY-MM.'),
  aksi: z.enum(['terbitkan', 'bayar', 'revisi']),
  catatan: z.string().max(255).optional(),
});

export async function POST(request: Request) {
  const session = await readSession();
  if (!session) return Response.json({ success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Sesi wajib diisi.' } }, { status: 401 });

  // Authority is data-driven: whoever the menu grants may manage slips, no hardcoded role list.
  const granted = await prisma.menuPeran.count({ where: { menu: { key: 'gaji' }, peran: { key: { in: session.peran } } } });
  if (!granted) return Response.json({ success: false, data: null, error: { code: 'FORBIDDEN', message: 'Tidak berwenang mengatur slip gaji.' } }, { status: 403 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ success: false, data: null, error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0].message } }, { status: 400 });

  const pegawaiId = BigInt(parsed.data.pegawaiId);
  const { periode, aksi } = parsed.data;
  const actor = { id: session.userId, nama: session.nama };
  const ip = requestIp(request);

  const pegawai = await prisma.pegawai.findUnique({ where: { id: pegawaiId }, include: { orang: true, komponen: true } });
  if (!pegawai) return Response.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Pegawai tidak ditemukan.' } }, { status: 404 });

  const existing = await prisma.slipGaji.findUnique({ where: { pegawaiId_periode: { pegawaiId, periode } } });

  if (aksi === 'bayar') {
    if (!existing) return Response.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Slip belum diterbitkan.' } }, { status: 404 });
    const slip = await prisma.slipGaji.update({ where: { id: existing.id }, data: { status: 'Dibayar', dibayarAt: new Date() } });
    await recordAudit({ aksi: 'SLIP_DIBAYAR', entitas: 'slip_gaji', entitasId: String(slip.id), ringkasan: `Slip ${periode} ${pegawai.orang.nama} dibayar`, aktor: actor, ip });
    return Response.json({ success: true, data: serialize(slip), error: null });
  }

  const { bruto, potongan, netto } = hitungGaji(pegawai.komponen);

  if (aksi === 'terbitkan') {
    if (existing) return Response.json({ success: false, data: null, error: { code: 'CONFLICT', message: 'Slip periode ini sudah ada — gunakan revisi.' } }, { status: 409 });
    const slip = await prisma.slipGaji.create({
      data: { pegawaiId, periode, bruto, potongan, netto, status: 'Terbit', diterbitkanOleh: BigInt(session.userId) },
    });
    await recordAudit({ aksi: 'SLIP_TERBIT', entitas: 'slip_gaji', entitasId: String(slip.id), ringkasan: `Slip ${periode} ${pegawai.orang.nama} diterbitkan`, perubahan: { bruto, potongan, netto }, aktor: actor, ip });
    return Response.json({ success: true, data: serialize(slip), error: null }, { status: 201 });
  }

  // Revision stays allowed after payment; the audit diff is what keeps it accountable.
  if (!existing) return Response.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Slip belum diterbitkan.' } }, { status: 404 });
  const slip = await prisma.slipGaji.update({
    where: { id: existing.id },
    data: { bruto, potongan, netto, revisi: existing.revisi + 1, status: 'Revisi', catatanRevisi: parsed.data.catatan, diterbitkanOleh: BigInt(session.userId) },
  });
  await recordAudit({
    aksi: 'SLIP_REVISI',
    entitas: 'slip_gaji',
    entitasId: String(slip.id),
    ringkasan: `Slip ${periode} ${pegawai.orang.nama} direvisi ke-${slip.revisi}${existing.dibayarAt ? ' setelah dibayar' : ''}`,
    perubahan: {
      bruto: { from: Number(existing.bruto), to: bruto },
      potongan: { from: Number(existing.potongan), to: potongan },
      netto: { from: Number(existing.netto), to: netto },
      sudahDibayar: Boolean(existing.dibayarAt),
      catatan: parsed.data.catatan ?? null,
    },
    aktor: actor,
    ip,
  });
  return Response.json({ success: true, data: serialize(slip), error: null });
}

function serialize(slip: { id: bigint; pegawaiId: bigint; periode: string; bruto: unknown; potongan: unknown; netto: unknown; status: string; revisi: number; dibayarAt: Date | null }) {
  return {
    id: String(slip.id),
    pegawaiId: String(slip.pegawaiId),
    periode: slip.periode,
    bruto: Number(slip.bruto),
    potongan: Number(slip.potongan),
    netto: Number(slip.netto),
    status: slip.status,
    revisi: slip.revisi,
    dibayarAt: slip.dibayarAt,
  };
}
