'use client';

import { Edit, Eye, MessageSquare, Search } from 'lucide-react';
import {
  CATEGORY_OPTIONS,
  RISK_TONE,
  STATUS_TONE,
  type AggregatedClient,
  type ClientStatus,
  type RiskLevel,
} from '../_lib/patients-model';
import { ClientAvatar } from './client-avatar';

type StatusTab = 'Semua' | 'Aktif' | 'Baru' | 'Selesai';
type SortBy = 'next' | 'name' | 'risk';

export function PatientListTable({
  allClients,
  visible,
  counts,
  todayCount,
  isLoading,
  statusTab,
  katFilter,
  sortBy,
  query,
  onSelectTab,
  onKatFilter,
  onSortBy,
  onQuery,
  onSelect,
  onResetFilters,
}: {
  allClients: AggregatedClient[];
  visible: AggregatedClient[];
  counts: Record<StatusTab, number>;
  todayCount: number;
  isLoading: boolean;
  statusTab: StatusTab;
  katFilter: (typeof CATEGORY_OPTIONS)[number];
  sortBy: SortBy;
  query: string;
  onSelectTab: (t: StatusTab) => void;
  onKatFilter: (v: (typeof CATEGORY_OPTIONS)[number]) => void;
  onSortBy: (v: SortBy) => void;
  onQuery: (v: string) => void;
  onSelect: (id: number) => void;
  onResetFilters: () => void;
}) {
  return (
    <div
      style={{
        flex: 1,
        padding: 20,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        minWidth: 0,
      }}
    >
      {/* Privacy banner */}
      <div
        className="flex items-center gap-2"
        style={{
          padding: '8px 12px',
          background: 'var(--info-soft, #e6f0f7)',
          border: '1px solid #cfdde8',
          borderRadius: 8,
        }}
      >
        <Eye size={14} style={{ color: 'var(--info, #4a90c0)', flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: '#2c4a60', lineHeight: 1.4 }}>
          Menampilkan <strong>hanya klien Anda</strong> ({allClients.length} klien). Data klien
          psikolog lain tidak bisa diakses sesuai kebijakan privasi.
        </span>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center" style={{ gap: 12 }}>
        <div
          className="flex items-center"
          style={{
            background: 'var(--bg-elev, #fff)',
            padding: 4,
            borderRadius: 8,
            border: '1px solid var(--border)',
            gap: 2,
          }}
        >
          {(['Semua', 'Aktif', 'Baru', 'Selesai'] as const).map((t) => {
            const sel = t === statusTab;
            return (
              <button
                key={t}
                type="button"
                onClick={() => onSelectTab(t)}
                className="btn btn-sm"
                style={{
                  height: 28,
                  padding: '0 12px',
                  background: sel ? 'var(--sage-500)' : 'transparent',
                  color: sel ? '#fff' : 'var(--fg)',
                  fontWeight: sel ? 600 : 500,
                }}
              >
                {t} <span style={{ marginLeft: 4, opacity: 0.8 }}>{counts[t]}</span>
              </button>
            );
          })}
        </div>

        <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 280 }}>
          <Search
            size={14}
            style={{ position: 'absolute', left: 11, top: 10, color: 'var(--fg-muted)', pointerEvents: 'none' }}
          />
          <input
            className="input-althea"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Cari nama klien atau layanan…"
            style={{ paddingLeft: 32, height: 34, fontSize: 13 }}
          />
        </div>

        <select
          className="input-althea"
          value={katFilter}
          onChange={(e) => onKatFilter(e.target.value as typeof katFilter)}
          style={{ height: 34, fontSize: 12.5, width: 'auto', minWidth: 150 }}
        >
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>{c === 'Semua' ? 'Semua kategori' : c}</option>
          ))}
        </select>

        <select
          className="input-althea"
          value={sortBy}
          onChange={(e) => onSortBy(e.target.value as SortBy)}
          style={{ height: 34, fontSize: 12.5, width: 'auto', minWidth: 180 }}
        >
          <option value="next">Urut: sesi terdekat</option>
          <option value="name">Urut: nama A–Z</option>
          <option value="risk">Urut: risiko tertinggi</option>
        </select>

        <span style={{ flex: 1 }} />
        <span className="caption" style={{ fontVariantNumeric: 'tabular-nums' }}>
          <strong style={{ color: 'var(--sage-700)' }}>{todayCount} hari ini</strong> ·{' '}
          {visible.length}/{allClients.length} klien
        </span>
      </div>

      {/* Table */}
      <div
        className="card-althea"
        style={{ padding: 0, overflow: 'hidden', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.8fr 0.8fr 1.4fr 1.5fr 1.6fr 0.9fr 0.5fr',
            padding: '12px 16px',
            background: 'var(--cream-50)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {['Klien', 'Kategori', 'Layanan', 'Progres sesi', 'Sesi berikutnya', 'Risiko', ''].map((h, i) => (
            <span key={i} className="eyebrow" style={{ fontSize: 10.5 }}>{h}</span>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {isLoading ? (
            <div className="caption" style={{ padding: 32, textAlign: 'center' }}>Memuat klien...</div>
          ) : visible.length === 0 ? (
            <EmptyState
              query={query}
              hasFilter={katFilter !== 'Semua' || statusTab !== 'Semua'}
              onReset={onResetFilters}
            />
          ) : (
            visible.map((c, i) => (
              <PatientRow
                key={c.id}
                client={c}
                index={i}
                onSelect={() => onSelect(c.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  query,
  hasFilter,
  onReset,
}: {
  query: string;
  hasFilter: boolean;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center" style={{ padding: '60px 24px', textAlign: 'center', gap: 8 }}>
      <div
        style={{
          width: 48, height: 48, borderRadius: 999,
          background: 'var(--cream-100)', display: 'grid', placeItems: 'center',
        }}
      >
        <Eye size={20} style={{ color: 'var(--fg-muted)' }} />
      </div>
      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--teal-800)' }}>
        Tidak ada klien yang cocok
      </span>
      <span className="caption" style={{ maxWidth: 320, lineHeight: 1.45 }}>
        {query
          ? `Tidak ada klien dengan kata kunci "${query}".`
          : 'Belum ada klien dengan filter saat ini.'}{' '}
        Coba ubah filter atau hapus pencarian.
      </span>
      {(query || hasFilter) && (
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onReset}
          style={{ marginTop: 6 }}
        >
          Reset filter
        </button>
      )}
    </div>
  );
}

function PatientRow({
  client: c,
  index,
  onSelect,
}: {
  client: AggregatedClient;
  index: number;
  onSelect: () => void;
}) {
  const pct = c.sessionTotal > 0 ? Math.round((c.sessionN / c.sessionTotal) * 100) : 0;
  const rt = RISK_TONE[c.risk];
  const st = STATUS_TONE[c.status];
  const isToday = c.next.startsWith('Hari ini');

  return (
    <div
      onClick={onSelect}
      style={{
        display: 'grid',
        gridTemplateColumns: '1.8fr 0.8fr 1.4fr 1.5fr 1.6fr 0.9fr 0.5fr',
        padding: '14px 16px',
        borderTop: index ? '1px solid var(--border)' : 'none',
        alignItems: 'center',
        cursor: 'pointer',
        borderLeft: '3px solid transparent',
        transition: 'background 0.12s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--sage-50)';
        e.currentTarget.style.borderLeftColor = 'var(--sage-500)';
        e.currentTarget.style.paddingLeft = '13px';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.borderLeftColor = 'transparent';
        e.currentTarget.style.paddingLeft = '16px';
      }}
    >
      <div className="flex items-center gap-2">
        <ClientAvatar initial={c.initial} risk={c.risk} />
        <div className="flex flex-col" style={{ minWidth: 0 }}>
          <span
            style={{
              fontSize: 13.5, fontWeight: 500, color: 'var(--teal-800)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}
            title={c.name}
          >
            {c.name}
          </span>
          <div className="flex items-center gap-1" style={{ marginTop: 1, flexWrap: 'wrap' }}>
            <span className="badge" style={{ background: st.bg, color: st.fg, height: 16, fontSize: 9.5, padding: '0 6px' }}>
              {c.status}
            </span>
            {c.flags.map((f) => (
              <span key={f} className="badge" style={{ background: 'var(--cream-200)', color: 'var(--fg-muted)', height: 16, fontSize: 9.5, padding: '0 6px' }}>
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
        {c.hasCompletedSession && c.lastSession ? (
          <span className="caption" style={{ fontSize: 10.5 }}>
            sesi terakhir: {c.lastSession}
          </span>
        ) : !c.hasCompletedSession && c.next !== '—' ? (
          <span className="caption" style={{ fontSize: 10.5 }}>
            sesi berikutnya: {c.next}
          </span>
        ) : null}
      </div>
      <div className="flex flex-col" style={{ gap: 4 }}>
        <div className="flex items-baseline justify-between">
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--sage-700)', fontFamily: 'var(--font-serif)' }}>
            {c.sessionN} dari {c.sessionTotal || '?'}
          </span>
          <span className="caption" style={{ fontSize: 10.5 }}>{pct}%</span>
        </div>
        <div style={{ height: 4, background: 'var(--cream-200)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? 'var(--cream-300)' : 'var(--sage-500)' }} />
        </div>
      </div>
      <div className="flex flex-col" style={{ gap: 2 }}>
        <span style={{ fontSize: 12.5, color: isToday ? 'var(--sage-700)' : 'var(--fg)', fontWeight: isToday ? 600 : 400 }}>
          {c.next}
        </span>
        {c.nextRoom && <span className="caption" style={{ fontSize: 10.5 }}>📍 {c.nextRoom}</span>}
      </div>
      <span className="badge" style={{ background: rt.bg, color: rt.fg, height: 20, fontSize: 10.5, textTransform: 'capitalize' }}>
        {c.risk}
      </span>
      <div className="flex items-center justify-end gap-1">
        <button type="button" onClick={(e) => e.stopPropagation()} className="btn btn-icon btn-ghost btn-sm" title={`WA: ${c.wa}`}>
          <MessageSquare size={13} />
        </button>
        <button type="button" onClick={(e) => e.stopPropagation()} className="btn btn-icon btn-ghost btn-sm" title="Buka catatan klinis">
          <Edit size={13} />
        </button>
      </div>
    </div>
  );
}
