'use client';

import type { UpdateSettingsInput } from '../../../api/settings.api';
import { useWaTemplateRecipients } from '../../../hooks/use-wa-template-recipients';
import { FieldRow } from '../../shared/field-row';
import { MicroSelect } from '../../shared/micro-select';
import { NotifEventRow } from '../../shared/notif-event-row';

/**
 * Pengaturan WA — section "Kirim pesan otomatis".
 *
 * Recipient toggles ("WA klien" / "WA psikolog") bind langsung ke
 * ClinicWaTemplate.recipients via useWaTemplateRecipients() — bukan
 * ke ClinicSettings (SSOT pindah). Field timing (notifH1SendTime,
 * notifFollowupDelayHours, notifFeedbackSendTime) tetap di settings.
 */
export function PengingatSection({
  form,
  set,
}: {
  form: UpdateSettingsInput;
  set: <K extends keyof UpdateSettingsInput>(key: K, value: UpdateSettingsInput[K]) => void;
}) {
  const { hasRecipient, toggle, isLoading } = useWaTemplateRecipients();

  return (
    <FieldRow
      label="Kirim pesan otomatis"
      hint="Dijadwalkan otomatis berdasarkan booking. Edit isi pesan via Notifikasi WA · Template."
    >
      <div className="flex flex-col gap-2" style={{ maxWidth: 580 }}>
        <NotifEventRow
          title="Konfirmasi booking"
          hint="Trigger: saat admin selesai jadwalkan klien"
          templates={[{ id: 't-konfirm' }]}
          extra={null}
          recipients={[
            {
              id: 'klien',
              label: 'WA klien',
              on: !isLoading && hasRecipient('Konfirmasi Booking', 'klien'),
              onChange: () => toggle('Konfirmasi Booking', 'klien'),
            },
            {
              id: 'psikolog',
              label: 'WA psikolog',
              on: !isLoading && hasRecipient('Konfirmasi Booking', 'psikolog'),
              onChange: () => toggle('Konfirmasi Booking', 'psikolog'),
            },
          ]}
        />
        <NotifEventRow
          title="Pengingat H-1"
          hint="Trigger: 24 jam sebelum sesi"
          templates={[{ id: 't-h1' }]}
          extra={
            <div className="flex items-center gap-1">
              <span className="caption" style={{ fontSize: 11 }}>
                kirim pukul
              </span>
              <input
                className="input-althea"
                value={form.notifH1SendTime ?? '08:00'}
                onChange={(e) => set('notifH1SendTime', e.target.value)}
                style={{
                  width: 70,
                  height: 32,
                  fontSize: 12,
                  fontVariantNumeric: 'tabular-nums',
                  textAlign: 'center',
                }}
              />
            </div>
          }
          recipients={[
            {
              id: 'klien',
              label: 'WA klien',
              on: !isLoading && hasRecipient('Pengingat H-1 Booking', 'klien'),
              onChange: () => toggle('Pengingat H-1 Booking', 'klien'),
            },
          ]}
        />
        <NotifEventRow
          title="Pengingat 30 menit"
          hint="Trigger: 30 menit sebelum sesi"
          templates={[{ id: 't-30m' }]}
          recipients={[
            {
              id: 'klien',
              label: 'WA klien',
              on: !isLoading && hasRecipient('Pengingat 30 Menit Sebelum Sesi', 'klien'),
              onChange: () => toggle('Pengingat 30 Menit Sebelum Sesi', 'klien'),
            },
          ]}
        />
        <NotifEventRow
          title="Follow-up pasca sesi"
          hint="Ucapan terima kasih + permintaan feedback (opsi: lampirkan bukti pembayaran)"
          templates={[{ id: 't-followup' }]}
          extra={
            <MicroSelect
              value={String(form.notifFollowupDelayHours ?? 3)}
              options={[
                ['1', '1 jam setelah'],
                ['3', '3 jam setelah'],
                ['24', '1 hari setelah'],
              ]}
              onChange={(v) => set('notifFollowupDelayHours', Number(v))}
            />
          }
          recipients={[
            {
              id: 'klien',
              label: 'WA klien',
              on: !isLoading && hasRecipient('Follow-up Post Session', 'klien'),
              onChange: () => toggle('Follow-up Post Session', 'klien'),
            },
          ]}
        />
        <NotifEventRow
          title="Form Feedback H+1"
          hint="Trigger: H+1 jam 08.00 WIB setelah sesi completed — klien diminta balas WA langsung"
          templates={[{ id: 't-feedback' }]}
          extra={
            <div className="flex items-center gap-1">
              <span className="caption" style={{ fontSize: 11 }}>
                kirim pukul
              </span>
              <input
                className="input-althea"
                value={form.notifFeedbackSendTime ?? '08:00'}
                onChange={(e) => set('notifFeedbackSendTime', e.target.value)}
                style={{
                  width: 70,
                  height: 32,
                  fontSize: 12,
                  fontVariantNumeric: 'tabular-nums',
                  textAlign: 'center',
                }}
              />
            </div>
          }
          recipients={[
            {
              id: 'klien',
              label: 'WA klien',
              on: !isLoading && hasRecipient('Form Feedback', 'klien'),
              onChange: () => toggle('Form Feedback', 'klien'),
            },
          ]}
        />
      </div>
    </FieldRow>
  );
}
