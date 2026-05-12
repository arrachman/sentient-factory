'use client';

/**
 * Filter section "Lanjutan" — pencarian klien, time-of-day, sesi-type,
 * service-specific multi-select.
 */
import { SVC_COLOR, TIME_OF_DAY_LABEL } from '../../model/constants';
import { toggleSet } from '../../model/filters';
import type { Filters, SesiType, TimeOfDay } from '../../model/types';

export function AdvancedFilterSection({
  filters,
  services,
  onChange,
}: {
  filters: Filters;
  services: Array<{ id: number; name: string; category: string }>;
  onChange: (next: Filters) => void;
}) {
  return (
    <>
      <div
        style={{
          marginTop: 4,
          marginBottom: 8,
          paddingTop: 12,
          borderTop: '1px solid var(--border)',
        }}
      >
        <span className="eyebrow" style={{ fontSize: 10.5 }}>
          Lanjutan
        </span>
      </div>

      <ClientQuerySubsection filters={filters} onChange={onChange} />
      <TimeOfDaySubsection filters={filters} onChange={onChange} />
      <SesiTypeSubsection filters={filters} onChange={onChange} />
      {services.length > 0 ? (
        <ServiceSubsection
          filters={filters}
          services={services}
          onChange={onChange}
        />
      ) : null}
    </>
  );
}

function ClientQuerySubsection({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <span
        className="caption"
        style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}
      >
        Cari nama klien
      </span>
      <input
        type="search"
        value={filters.clientQuery}
        onChange={(e) =>
          onChange({ ...filters, clientQuery: e.target.value })
        }
        placeholder="ketik nama klien..."
        className="input-althea"
        style={{ height: 30, fontSize: 12.5 }}
      />
    </div>
  );
}

const TIME_OF_DAY_KEYS: TimeOfDay[] = ['pagi', 'siang', 'sore'];

function TimeOfDaySubsection({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <span
        className="caption"
        style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}
      >
        Waktu sesi
      </span>
      <div className="flex flex-wrap" style={{ gap: 6 }}>
        {TIME_OF_DAY_KEYS.map((t) => {
          const active = filters.timeOfDay.has(t);
          const meta = TIME_OF_DAY_LABEL[t];
          return (
            <button
              key={t}
              type="button"
              onClick={() =>
                onChange({
                  ...filters,
                  timeOfDay: toggleSet(filters.timeOfDay, t),
                })
              }
              className="btn btn-sm"
              style={{
                height: 24,
                padding: '0 10px',
                fontSize: 11.5,
                background: active ? 'var(--sage-500)' : 'var(--cream-100)',
                color: active ? '#fff' : 'var(--fg)',
                border:
                  '1px solid ' +
                  (active ? 'var(--sage-500)' : 'var(--border)'),
              }}
              title={`${meta.label} (${meta.range})`}
            >
              {meta.label}
              <span style={{ opacity: 0.7, marginLeft: 4, fontSize: 10 }}>
                {meta.range}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const SESI_TYPE_OPTIONS: Array<[SesiType, string]> = [
  ['all', 'Semua'],
  ['tunggal', 'Tunggal'],
  ['multi', 'Paket'],
  ['last', 'Sesi akhir'],
];

const SESI_TYPE_TOOLTIP: Record<SesiType, string> = {
  all: 'Semua tipe',
  tunggal: 'Hanya sesi 1×',
  multi: 'Paket multi-sesi',
  last: 'Sesi terakhir di paket (sesiN === sesiTotal)',
};

function SesiTypeSubsection({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <span
        className="caption"
        style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}
      >
        Tipe sesi
      </span>
      <div
        style={{
          display: 'inline-flex',
          background: 'var(--cream-100)',
          borderRadius: 6,
          padding: 2,
        }}
      >
        {SESI_TYPE_OPTIONS.map(([k, label]) => {
          const active = filters.sesiType === k;
          return (
            <button
              key={k}
              type="button"
              onClick={() => onChange({ ...filters, sesiType: k })}
              className="btn btn-sm"
              style={{
                height: 24,
                padding: '0 10px',
                fontSize: 11.5,
                background: active ? 'var(--bg-elev, #fff)' : 'transparent',
                boxShadow: active
                  ? 'var(--shadow-xs, 0 1px 2px rgba(0,0,0,0.05))'
                  : 'none',
                color: active ? 'var(--teal-800)' : 'var(--fg-muted)',
                fontWeight: active ? 600 : 500,
              }}
              title={SESI_TYPE_TOOLTIP[k]}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ServiceSubsection({
  filters,
  services,
  onChange,
}: {
  filters: Filters;
  services: Array<{ id: number; name: string; category: string }>;
  onChange: (next: Filters) => void;
}) {
  return (
    <div>
      <span
        className="caption"
        style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}
      >
        Layanan spesifik ({filters.serviceIds.size}/{services.length})
      </span>
      <div
        className="flex flex-col"
        style={{ gap: 2, maxHeight: 140, overflowY: 'auto' }}
      >
        {services.map((s) => {
          const active = filters.serviceIds.has(s.id);
          const c = SVC_COLOR[s.category] ?? SVC_COLOR.konseling;
          return (
            <label
              key={s.id}
              className="flex items-center gap-2 cursor-pointer"
              style={{
                padding: '4px 8px',
                borderRadius: 6,
                fontSize: 12,
                background: active ? 'var(--sage-50)' : 'transparent',
              }}
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() =>
                  onChange({
                    ...filters,
                    serviceIds: toggleSet(filters.serviceIds, s.id),
                  })
                }
                className="h-3.5 w-3.5"
              />
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: c.bar,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={s.name}
              >
                {s.name}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
