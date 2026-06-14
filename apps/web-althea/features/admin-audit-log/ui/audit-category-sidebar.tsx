'use client';

/**
 * Sidebar kiri halaman Audit Log — daftar 10 kategori dengan ikon + count,
 * plus tip footer tentang privasi klien.
 */
import { AUDIT_CATEGORIES, type AuditCategory } from '../model/types';

export function AuditCategorySidebar({
  active,
  counts,
  onChange,
}: {
  active: AuditCategory;
  counts: Partial<Record<AuditCategory, number>>;
  onChange: (next: AuditCategory) => void;
}) {
  return (
    <aside
      className="card-althea overflow-hidden flex flex-col"
      style={{ minHeight: 0 }}
    >
      <div
        className="row"
        style={{
          padding: '12px 14px',
          borderBottom: '1px solid var(--border)',
          justifyContent: 'space-between',
        }}
      >
        <span className="eyebrow">Kategori</span>
      </div>
      <div className="col" style={{ padding: 6, gap: 1, overflowY: 'auto' }}>
        {AUDIT_CATEGORIES.map((c) => {
          const Icon = c.icon;
          const isSel = c.k === active;
          const cnt = counts[c.k] ?? 0;
          return (
            <button
              type="button"
              key={c.k}
              onClick={() => onChange(c.k)}
              className={`nav-item ${isSel ? 'active' : ''}`}
              style={{
                cursor: 'pointer',
                justifyContent: 'space-between',
                padding: '8px 10px',
                border: 'none',
                background: isSel ? 'var(--sage-100)' : 'transparent',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <span
                className="row gap-2"
                style={{ alignItems: 'center', minWidth: 0 }}
              >
                {Icon ? (
                  <Icon size={14} />
                ) : (
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 4,
                      background: 'var(--cream-200)',
                      display: 'inline-block',
                    }}
                  />
                )}
                <span
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {c.label}
                </span>
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: 'var(--fg-muted)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {cnt}
              </span>
            </button>
          );
        })}
      </div>
      <div
        style={{
          padding: 12,
          borderTop: '1px solid var(--border)',
          background: 'var(--cream-100)',
        }}
      >
        <div
          className="caption"
          style={{
            marginBottom: 4,
            fontWeight: 600,
            color: 'var(--teal-800)',
          }}
        >
          Tip
        </div>
        <div
          className="caption"
          style={{ fontSize: 11.5, lineHeight: 1.45 }}
        >
          Event "Akses ditolak" menandai pelanggaran privasi antar psikolog
          (psikolog × data klien lain). Tinjau secara berkala.
        </div>
      </div>
    </aside>
  );
}
