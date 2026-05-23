import type { UpdateSettingsInput } from '../../../api/settings.api';
import { FieldRow } from '../../shared/field-row';
import { MicroSelect } from '../../shared/micro-select';
import { NotifEventRow } from '../../shared/notif-event-row';

export function PengingatSection({
  form,
  set,
}: {
  form: UpdateSettingsInput;
  set: <K extends keyof UpdateSettingsInput>(key: K, value: UpdateSettingsInput[K]) => void;
}) {
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
              on: form.notifConfirmKlien ?? true,
              onChange: (v) => set('notifConfirmKlien', v),
            },
            {
              id: 'psikolog',
              label: 'WA psikolog',
              on: form.notifConfirmPsikolog ?? true,
              onChange: (v) => set('notifConfirmPsikolog', v),
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
              on: form.notifH1Klien ?? true,
              onChange: (v) => set('notifH1Klien', v),
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
              on: form.notifM30Klien ?? true,
              onChange: (v) => set('notifM30Klien', v),
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
              on: form.notifFollowupKlien ?? true,
              onChange: (v) => set('notifFollowupKlien', v),
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
              on: form.notifFeedbackKlien ?? true,
              onChange: (v) => set('notifFeedbackKlien', v),
            },
          ]}
        />
        <NotifEventRow
          title="Pengingat sesi lanjutan"
          hint="Untuk paket multi-sesi yang sesinya belum dijadwal"
          templates={[{ id: 't-lanjutan' }]}
          extra={
            <MicroSelect
              value={String(form.notifSesiLanjutanDays ?? 7)}
              options={[
                ['3', 'H+3'],
                ['7', 'H+7'],
                ['14', 'H+14'],
              ]}
              width={90}
              onChange={(v) => set('notifSesiLanjutanDays', Number(v))}
            />
          }
          recipients={[
            {
              id: 'klien',
              label: 'WA klien',
              on: form.notifSesiLanjutanKlien ?? false,
              onChange: (v) => set('notifSesiLanjutanKlien', v),
            },
          ]}
        />
        <NotifEventRow
          title="Paket akan habis"
          hint="Trigger: saat sesi tersisa ≤ 1 dari paket — tawarkan paket lanjutan"
          templates={[{ id: 't-paket-habis' }]}
          recipients={[
            {
              id: 'klien',
              label: 'WA klien',
              on: form.notifPaketHabisKlien ?? true,
              onChange: (v) => set('notifPaketHabisKlien', v),
            },
          ]}
        />
        <NotifEventRow
          title="Pengingat minggu kosong (psikolog)"
          hint="Kirim WA ke psikolog kalau minggu kerja mendatang masih banyak slot kosong."
          badge="psikolog"
          templates={[{ id: 't-week-empty' }]}
          extra={
            <div className="flex items-center gap-1 flex-wrap">
              <span className="caption" style={{ fontSize: 11 }}>
                kirim
              </span>
              <MicroSelect
                value={String(form.notifMingguKosongDaysBefore ?? 3)}
                options={[
                  ['1', 'H-1'],
                  ['3', 'H-3'],
                  ['5', 'H-5'],
                  ['7', 'H-7'],
                ]}
                width={78}
                onChange={(v) => set('notifMingguKosongDaysBefore', Number(v))}
              />
              <span className="caption" style={{ fontSize: 11 }}>
                jika kosong ≥
              </span>
              <MicroSelect
                value={String(form.notifMingguKosongThreshold ?? 50)}
                options={[
                  ['30', '30%'],
                  ['50', '50%'],
                  ['70', '70%'],
                  ['80', '80%'],
                ]}
                width={78}
                onChange={(v) => set('notifMingguKosongThreshold', Number(v))}
              />
            </div>
          }
          recipients={[
            {
              id: 'psikolog',
              label: 'WA psikolog',
              on: form.notifMingguKosongPsikolog ?? true,
              onChange: (v) => set('notifMingguKosongPsikolog', v),
            },
          ]}
        />
      </div>
    </FieldRow>
  );
}
