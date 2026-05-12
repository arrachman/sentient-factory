'use client';

/**
 * Editor catatan klinis untuk sesi terpilih:
 *   - Header: ID sesi, tanggal, nama klien, layanan, savedAt + tombol Cetak/Simpan
 *   - Category toggle (manual override service kind)
 *   - Status row (4-6 metric per kind)
 *   - SOAP textarea (4 sections per kind)
 *   - Confidentiality footnote
 */
import { Bell, Printer } from 'lucide-react';
import type { Booking } from '@/features/admin-booking/model/types';
import { SERVICE_OPTIONS, SOAP_LABELS, STATUS_FIELDS } from '../model/constants';
import { formatSessionTime } from '../model/format';
import type { ServiceKind } from '../model/types';

export function SessionEditor({
  selected,
  kind,
  setKind,
  soap,
  setSoap,
  savedAt,
  saving,
  onSave,
}: {
  selected: Booking;
  kind: ServiceKind;
  setKind: (next: ServiceKind) => void;
  soap: Record<string, string>;
  setSoap: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  savedAt: string | null;
  saving: boolean;
  onSave: () => void;
}) {
  const fields = STATUS_FIELDS[kind];
  const soapLabels = SOAP_LABELS[kind];

  return (
    <>
      <EditorHeader
        booking={selected}
        savedAt={savedAt}
        saving={saving}
        onSave={onSave}
      />
      <CategoryToggle kind={kind} onChangeKind={setKind} />
      <StatusRow fields={fields} />
      <SoapForm
        labels={soapLabels}
        soap={soap}
        onChange={(key, value) =>
          setSoap((prev) => ({ ...prev, [key]: value }))
        }
      />
      <ConfidentialityNote />
    </>
  );
}

// =====================================================================
// Sub-components
// =====================================================================

function EditorHeader({
  booking,
  savedAt,
  saving,
  onSave,
}: {
  booking: Booking;
  savedAt: string | null;
  saving: boolean;
  onSave: () => void;
}) {
  return (
    <div
      className="flex items-start justify-between"
      style={{ marginBottom: 14, gap: 16, flexWrap: 'wrap' }}
    >
      <div className="flex flex-col" style={{ minWidth: 0 }}>
        <span className="eyebrow">
          Sesi #{booking.id} ·{' '}
          {formatSessionTime(booking.scheduledStart)}
        </span>
        <h2
          style={{
            margin: '4px 0 6px',
            fontFamily: 'var(--font-serif)',
            fontSize: 21,
            fontWeight: 500,
            color: 'var(--teal-800)',
          }}
        >
          Catatan klinis · {booking.client.name}
        </h2>
        <span className="caption" style={{ fontSize: 11.5 }}>
          {booking.service.name}
          {booking.sessionTotal > 1
            ? ` · sesi ${booking.sessionN}/${booking.sessionTotal}`
            : ''}
        </span>
      </div>
      <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
        {savedAt ? (
          <span className="caption" style={{ fontSize: 11.5 }}>
            Tersimpan otomatis · {savedAt}
          </span>
        ) : null}
        <button type="button" className="btn btn-outline btn-sm">
          <Printer size={13} /> Cetak
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="btn btn-primary btn-sm"
        >
          {saving ? 'Menyimpan...' : 'Simpan catatan'}
        </button>
      </div>
    </div>
  );
}

function CategoryToggle({
  kind,
  onChangeKind,
}: {
  kind: ServiceKind;
  onChangeKind: (next: ServiceKind) => void;
}) {
  return (
    <div
      style={{
        padding: 10,
        background: 'var(--cream-50)',
        borderRadius: 8,
        marginBottom: 14,
      }}
    >
      <div
        className="flex items-center"
        style={{ gap: 8, flexWrap: 'wrap' }}
      >
        <span
          className="caption"
          style={{ fontSize: 11.5, fontWeight: 600 }}
        >
          Field Status & SOAP menyesuaikan kategori layanan:
        </span>
        <div
          style={{
            display: 'inline-flex',
            background: 'var(--bg-elev, #fff)',
            borderRadius: 8,
            padding: 3,
            gap: 2,
          }}
        >
          {SERVICE_OPTIONS.map((o) => {
            const active = kind === o.key;
            return (
              <button
                key={o.key}
                type="button"
                onClick={() => onChangeKind(o.key)}
                className="btn btn-sm"
                style={{
                  height: 28,
                  padding: '0 12px',
                  fontSize: 11.5,
                  background: active ? 'var(--sage-500)' : 'transparent',
                  color: active ? '#fff' : 'var(--fg-muted)',
                  fontWeight: active ? 600 : 500,
                }}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatusRow({
  fields,
}: {
  fields: Array<[string, string, string]>;
}) {
  return (
    <div
      className="card-althea-flat"
      style={{
        padding: 14,
        marginBottom: 16,
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(fields.length, 6)}, 1fr)`,
        gap: 12,
      }}
    >
      {fields.map(([lbl, val, sub], i) => (
        <div key={i} className="flex flex-col">
          <span className="caption" style={{ fontSize: 11 }}>
            {lbl}
          </span>
          <span
            style={{
              fontSize: 14.5,
              fontWeight: 600,
              color: 'var(--teal-800)',
              marginTop: 2,
            }}
          >
            {val}
          </span>
          <span className="caption" style={{ fontSize: 10.5 }}>
            {sub}
          </span>
        </div>
      ))}
    </div>
  );
}

function SoapForm({
  labels,
  soap,
  onChange,
}: {
  labels: Array<{ key: string; label: string; placeholder: string }>;
  soap: Record<string, string>;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <>
      {labels.map((l) => (
        <div
          key={l.key}
          className="flex flex-col gap-2"
          style={{ marginBottom: 14 }}
        >
          <span className="eyebrow">{l.label}</span>
          <textarea
            className="input-althea"
            value={soap[l.key] ?? ''}
            onChange={(e) => onChange(l.key, e.target.value)}
            placeholder={l.placeholder}
            style={{
              minHeight: 80,
              height: 'auto',
              padding: 12,
              resize: 'vertical',
              lineHeight: 1.55,
              fontSize: 13,
            }}
          />
        </div>
      ))}
    </>
  );
}

function ConfidentialityNote() {
  return (
    <div
      className="flex items-start gap-2"
      style={{
        padding: 12,
        background: 'var(--info-soft, #e6f0f7)',
        borderRadius: 8,
        border: '1px solid #cfdde8',
      }}
    >
      <Bell
        size={14}
        style={{
          color: 'var(--info, #4a90c0)',
          flexShrink: 0,
          marginTop: 2,
        }}
      />
      <span className="caption" style={{ color: '#2c4a60' }}>
        Catatan klinis bersifat rahasia. Hanya psikolog penanggung & klien
        (atas izin) yang dapat mengakses.
      </span>
    </div>
  );
}
