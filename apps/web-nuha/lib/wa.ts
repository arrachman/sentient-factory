import { prisma } from '@/lib/prisma';
import { log } from '@/lib/logger';
import { recordAudit, type AuditActor } from '@/lib/audit';
import { tokenPengirim } from '@/lib/wa-gateway';

export function normalizeTarget(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) throw new Error('Nomor WhatsApp tidak valid.');
  return digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
}

export function renderTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/{{\s*([\w.]+)\s*}}/g, (_, key: string) => String(values[key] ?? ''));
}

type SendWaParams = {
  nomor: string;
  tujuan: string;
  isi: string;
  templateId?: number;
  actor?: AuditActor | null;
  ip?: string | null;
};

type GatewayResponse = { status?: boolean; id?: string; reason?: string };

export async function kirimWa(params: SendWaParams) {
  const nomor = normalizeTarget(params.nomor);
  const dryRun = (process.env.WA_DRY_RUN ?? 'true').toLowerCase() === 'true';
  let status = dryRun ? 'Dry-run' : 'Gagal';
  let messageId: string | undefined;
  let error: string | undefined;

  if (!dryRun) {
    const url = process.env.WA_GATEWAY_URL;
    // Token perangkat boleh datang dari QR yang baru saja dipindai, bukan hanya
    // dari env — lihat `tokenPengirim`.
    const token = await tokenPengirim();
    if (!url) error = 'WA_GATEWAY_URL belum dikonfigurasi.';
    else if (!token) error = 'Belum ada perangkat WhatsApp yang terhubung. Pindai QR di Notifikasi → Perangkat.';
    else {
      try {
        const form = new URLSearchParams({ target: nomor, message: params.isi });
        const response = await fetch(`${url.replace(/\/$/, '')}/send`, {
          method: 'POST',
          headers: { Authorization: token, 'Content-Type': 'application/x-www-form-urlencoded' },
          body: form.toString(),
          signal: AbortSignal.timeout(15_000),
        });
        const payload = await response.json() as GatewayResponse;
        if (response.ok && payload.status === true) {
          status = 'Terkirim';
          messageId = payload.id;
        } else error = payload.reason ?? `Gateway HTTP ${response.status}`;
      } catch (caught) {
        error = caught instanceof Error ? caught.message : String(caught);
      }
    }
  }

  const entry = await prisma.logWa.create({
    data: { templateId: params.templateId, tujuan: params.tujuan, nomor, isi: params.isi, status, messageId, error },
  });
  await recordAudit({
    aksi: 'KIRIM_WA',
    entitas: 'log_wa',
    entitasId: String(entry.id),
    ringkasan: `${status}: WA ke ${nomor} untuk ${params.tujuan}`,
    perubahan: { status, messageId, error },
    aktor: params.actor,
    ip: params.ip,
  });
  log(error ? 'warn' : 'info', 'Pengiriman WhatsApp selesai', { nomor, status, messageId, error });
  return { entry, ok: status === 'Terkirim' || status === 'Dry-run', error };
}
