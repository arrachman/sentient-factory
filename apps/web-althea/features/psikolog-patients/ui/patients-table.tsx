'use client';

/**
 * Tabel klien (kanan dari sidebar di halaman Klien saya).
 *
 * Setiap row: Avatar+nama+badges, kategori, layanan, progres bar,
 * sesi berikutnya, badge risiko, action icons (WA + edit catatan) yang
 * di-fade saat baris tidak hovered/selected.
 */
import { Edit, Eye, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import {
  RISK_TONE,
  STATUS_TONE,
  type AggregatedClient,
  type CategoryOption,
  type StatusTab,
} from '../model/types';
import { ClientAvatar } from './client-avatar';

const COL_TPL = '1.8fr 0.8fr 1.4fr 1.5fr 1.6fr 0.9fr 0.5fr';

const HEADERS = [
  'Klien',
  'Kategori',
  'Layanan',
  'Progres sesi',
  'Sesi berikutnya',
  'Risiko',
  '',
];

export function PatientsTable({
  visible,
  isLoading,
  selected,
  query,
  katFilter,
  statusTab,
  onSelect,
  onResetFilters,
}: {
  visible: AggregatedClient[];
  isLoading: boolean;
  selected: AggregatedClient | null;
  query: string;
  katFilter: CategoryOption;
  statusTab: StatusTab;
  onSelect: (id: number) => void;
  onResetFilters: () => void;
}) {
  return (
    <div
      className="card-althea"
      style={{
        padding: 0,
        overflow: 'hidden',
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: COL_TPL,
          padding: '12px 16px',
          background: 'var(--cream-50)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {HEADERS.map((h, i) => (
          <span key={i} className="eyebrow" style={{ fontSize: 10.5 }}>
            {h}
          </span>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {isLoading ? (
          <div
            className="caption"
            style={{ padding: 32, textAlign: 'center' }}
          >
            Memuat klien...
          </div>
        ) : visible.length === 0 ? (
          <EmptyState
            query={query}
            hasFilter={
              query !== '' ||
              katFilter !== 'Semua' ||
              statusTab !== 'Semua'
            }
            onResetFilters={onResetFilters}
          />
        ) : (
          visible.map((c, i) => (
            <PatientRow
              key={c.id}
              client={c}
              isFirst={i === 0}
              isSelected={c.id === selected?.id}
              onSelect={() => onSelect(c.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function EmptyState({
  query,
  hasFilter,
  onResetFilters,
}: {
  query: string;
  hasFilter: boolean;
  onResetFilters: () => void;
}) {
  return (
    <div
      className="flex flex-col items-center"
      style={{ padding: '60px 24px', textAlign: 'center', gap: 8 }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 999,
          background: 'var(--cream-100)',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Eye size={20} style={{ color: 'var(--fg-muted)' }} />
      </div>
      <span
        style={{ fontSize: 14, fontWeight: 600, color: 'var(--teal-800)' }}
      >
        Tidak ada klien yang cocok
      </span>
      <span
        className="caption"
        style={{ maxWidth: 320, lineHeight: 1.45 }}
      >
        {query
          ? `Tidak ada klien dengan kata kunci "${query}".`
          : 'Belum ada klien dengan filter saat ini.'}{' '}
        Coba ubah filter atau hapus pencarian.
      </span>
      {hasFilter ? (
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onResetFilters}
          style={{ marginTop: 6 }}
        >
          Reset filter
        </button>
      ) : null}
    </div>
  );
}

function PatientRow({
  client: c,
  isFirst,
  isSelected,
  onSelect,
}: {
  client: AggregatedClient;
  isFirst: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const pct =
    c.sessionTotal > 0 ? Math.round((c.sessionN / c.sessionTotal) * 100) : 0;
  const rt = RISK_TONE[c.risk];
  const st = STATUS_TONE[c.status];
  const isToday = c.next.startsWith('Hari ini');

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: COL_TPL,
        padding: '14px 16px',
        borderTop: isFirst ? 'none' : '1px solid var(--border)',
        alignItems: 'center',
        cursor: 'pointer',
        background: isSelected
          ? 'var(--sage-50)'
          : hovered
          ? 'var(--cream-50)'
          : 'transparent',
        borderLeft: isSelected
          ? '3px solid var(--sage-500)'
          : '3px solid transparent',
        paddingLeft: isSelected ? 13 : 16,
      }}
    >
      <div className="flex items-center gap-2">
        <ClientAvatar initial={c.initial} risk={c.risk} />
        <div className="flex flex-col" style={{ minWidth: 0 }}>
          <span
            style={{
              fontSize: 13.5,
              fontWeight: 500,
              color: 'var(--teal-800)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={c.name}
          >
            {c.name}
          </span>
          <div
            className="flex items-center gap-1"
            style={{ marginTop: 1, flexWrap: 'wrap' }}
          >
            <span
              className="badge"
              style={{
                background: st.bg,
                color: st.fg,
                height: 16,
                fontSize: 9.5,
                padding: '0 6px',
              }}
            >
              {c.status}
            </span>
            {c.flags.map((f) => (
              <span
                key={f}
                className="badge"
                style={{
                  background: 'var(--cream-200)',
                  color: 'var(--fg-muted)',
                  height: 16,
                  fontSize: 9.5,
                  padding: '0 6px',
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
      <span className="caption">{c.category}</span>
      <div className="flex flex-col" style={{ gap: 2 }}>
        <span style={{ fontSize: 12.5, color: 'var(--fg)' }}>
          {c.lastService ?? c.service}
        </span>
        {c.lastService && c.lastSession ? (
          <span className="caption" style={{ fontSize: 10.5 }}>
            sesi terakhir: {c.lastSession}
          </span>
        ) : null}
      </div>
      <ProgressCol n={c.sessionN} total={c.sessionTotal} pct={pct} />
      <NextSessionCol next={c.next} room={c.nextRoom} isToday={isToday} />
      <span
        className="badge"
        style={{
          background: rt.bg,
          color: rt.fg,
          height: 20,
          fontSize: 10.5,
          textTransform: 'capitalize',
        }}
      >
        {c.risk}
      </span>
      <RowActions visible={hovered || isSelected} wa={c.wa} />
    </div>
  );
}

function ProgressCol({
  n,
  total,
  pct,
}: {
  n: number;
  total: number;
  pct: number;
}) {
  return (
    <div className="flex flex-col" style={{ gap: 4 }}>
      <div className="flex items-baseline justify-between">
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--sage-700)',
            fontFamily: 'var(--font-serif)',
          }}
        >
          {n} dari {total || '?'}
        </span>
        <span className="caption" style={{ fontSize: 10.5 }}>
          {pct}%
        </span>
      </div>
      <div
        style={{
          height: 4,
          background: 'var(--cream-200)',
          borderRadius: 999,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background:
              pct === 100 ? 'var(--cream-300)' : 'var(--sage-500)',
          }}
        />
      </div>
    </div>
  );
}

function NextSessionCol({
  next,
  room,
  isToday,
}: {
  next: string;
  room: string | null;
  isToday: boolean;
}) {
  return (
    <div className="flex flex-col" style={{ gap: 2 }}>
      <span
        style={{
          fontSize: 12.5,
          color: isToday ? 'var(--sage-700)' : 'var(--fg)',
          fontWeight: isToday ? 600 : 400,
        }}
      >
        {next}
      </span>
      {room ? (
        <span className="caption" style={{ fontSize: 10.5 }}>
          📍 {room}
        </span>
      ) : null}
    </div>
  );
}

function RowActions({ visible, wa }: { visible: boolean; wa: string }) {
  return (
    <div
      className="flex items-center justify-end gap-1"
      style={{
        opacity: visible ? 1 : 0.15,
        transition: 'opacity .15s',
      }}
    >
      <button
        type="button"
        onClick={(e) => e.stopPropagation()}
        className="btn btn-icon btn-ghost btn-sm"
        title={`WA: ${wa}`}
      >
        <MessageSquare size={13} />
      </button>
      <button
        type="button"
        onClick={(e) => e.stopPropagation()}
        className="btn btn-icon btn-ghost btn-sm"
        title="Buka catatan klinis"
      >
        <Edit size={13} />
      </button>
    </div>
  );
}
