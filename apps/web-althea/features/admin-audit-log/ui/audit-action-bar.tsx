'use client';

/**
 * Action bar atas halaman Audit Log:
 *   [pill "Audit aktif"] · counter event hari ini  ····  [search] [Rentang waktu] [Ekspor CSV]
 */
import { Download, RefreshCw, Search, ShieldCheck } from 'lucide-react';

export function AuditActionBar({
  totalLabel,
  search,
  onChangeSearch,
  onRefetch,
  onExport,
  exportDisabled,
}: {
  totalLabel: string;
  search: string;
  onChangeSearch: (next: string) => void;
  onRefetch: () => void;
  onExport: () => void;
  exportDisabled: boolean;
}) {
  return (
    <div className="px-7 pt-2 pb-3 flex items-center justify-between flex-wrap gap-3">
      <div className="row gap-3 flex-wrap">
        <div
          className="row gap-2"
          style={{
            background: 'var(--sage-50)',
            border: '1px solid var(--sage-200)',
            borderRadius: 999,
            padding: '6px 14px',
          }}
        >
          <ShieldCheck size={14} style={{ color: 'var(--sage-700)' }} />
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: 'var(--sage-700)',
            }}
          >
            Audit aktif · retensi 12 bulan
          </span>
        </div>
        <span className="caption">{totalLabel}</span>
      </div>
      <div className="row gap-2">
        <div style={{ position: 'relative', width: 240 }}>
          <span style={{ position: 'absolute', left: 11, top: 9 }}>
            <Search size={14} style={{ color: 'var(--fg-muted)' }} />
          </span>
          <input
            className="input-althea"
            placeholder="Cari user, target, atau aksi…"
            value={search}
            onChange={(e) => onChangeSearch(e.target.value)}
            style={{ paddingLeft: 32, height: 34, fontSize: 13 }}
          />
        </div>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onRefetch}
        >
          <RefreshCw size={13} /> Refresh
        </button>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onExport}
          disabled={exportDisabled}
        >
          <Download size={13} /> Ekspor CSV
        </button>
      </div>
    </div>
  );
}
