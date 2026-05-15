import { FieldRow } from '../../shared/field-row';
import { MicroSelect } from '../../shared/micro-select';
import { NotifEventRow } from '../../shared/notif-event-row';

/**
 * Bagian "Pengingat sesi otomatis" — 7 event yang dijadwalkan otomatis
 * berdasarkan booking. Beberapa punya control tambahan (waktu kirim,
 * threshold, dll) lewat prop `extra`.
 */
export function PengingatSection() {
  return (
    <FieldRow
      label="Pengingat sesi otomatis"
      hint="Dijadwalkan otomatis berdasarkan booking. Edit isi pesan via Notifikasi WA · Template."
    >
      <div className="flex flex-col gap-2" style={{ maxWidth: 580 }}>
        <NotifEventRow
          title="Konfirmasi booking"
          hint="Trigger: saat admin selesai jadwalkan klien"
          templates={[{ id: 't-konfirm' }]}
          recipients={[
            { id: 'klien', label: 'WA klien', on: true },
            { id: 'psikolog', label: 'WA psikolog', on: true },
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
                defaultValue="18:00"
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
            { id: 'klien', label: 'WA klien', on: true },
            { id: 'psikolog', label: 'WA psikolog', on: true },
          ]}
        />
        <NotifEventRow
          title="Pengingat 30 menit"
          hint="Trigger: 30 menit sebelum sesi"
          templates={[{ id: 't-30m' }]}
          recipients={[
            { id: 'klien', label: 'WA klien', on: true },
            { id: 'psikolog', label: 'WA psikolog', on: true },
          ]}
        />
        <NotifEventRow
          title="Follow-up pasca sesi"
          hint="Ucapan terima kasih + permintaan feedback (opsi: lampirkan bukti pembayaran)"
          templates={[{ id: 't-followup' }]}
          extra={
            <MicroSelect
              defaultValue="3"
              options={[
                ['1', '1 jam setelah'],
                ['3', '3 jam setelah'],
                ['24', '1 hari setelah'],
              ]}
            />
          }
          recipients={[{ id: 'klien', label: 'WA klien', on: true }]}
        />
        <NotifEventRow
          title="Pengingat sesi lanjutan"
          hint="Untuk paket multi-sesi yang sesinya belum dijadwal"
          templates={[{ id: 't-lanjutan' }]}
          extra={
            <MicroSelect
              defaultValue="7"
              options={[
                ['3', 'H+3'],
                ['7', 'H+7'],
                ['14', 'H+14'],
              ]}
              width={90}
            />
          }
          recipients={[{ id: 'klien', label: 'WA klien', on: false }]}
        />
        <NotifEventRow
          title="Paket akan habis"
          hint="Trigger: saat sesi tersisa ≤ 1 dari paket — tawarkan paket lanjutan"
          templates={[{ id: 't-paket-habis' }]}
          recipients={[{ id: 'klien', label: 'WA klien', on: true }]}
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
                defaultValue="3"
                options={[
                  ['1', 'H-1'],
                  ['3', 'H-3'],
                  ['5', 'H-5'],
                  ['7', 'H-7'],
                ]}
                width={78}
              />
              <span className="caption" style={{ fontSize: 11 }}>
                jika kosong ≥
              </span>
              <MicroSelect
                defaultValue="50"
                options={[
                  ['30', '30%'],
                  ['50', '50%'],
                  ['70', '70%'],
                  ['80', '80%'],
                ]}
                width={78}
              />
            </div>
          }
          recipients={[{ id: 'psikolog', label: 'WA psikolog', on: true }]}
        />
      </div>
    </FieldRow>
  );
}
