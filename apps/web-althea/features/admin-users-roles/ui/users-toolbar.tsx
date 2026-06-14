'use client';

/**
 * Toolbar atas halaman User & Role:
 *   [tab pills: User aktif / Role & hak akses / Matriks permission]
 *                                                  [Ekspor] [User baru]
 */
import { Download, Plus } from 'lucide-react';
import type { Tab } from '../model/role-config';
import { ROLE_INFO } from '../model/role-config';

export function UsersToolbar({
  tab,
  onChangeTab,
  totalUsers,
  onExport,
  onCreate,
}: {
  tab: Tab;
  onChangeTab: (t: Tab) => void;
  totalUsers: number;
  onExport?: () => void;
  onCreate: () => void;
}) {
  const TABS: Array<{ key: Tab; label: string; count: string | number }> = [
    { key: 'users', label: 'User aktif', count: totalUsers },
    { key: 'roles', label: 'Role & hak akses', count: ROLE_INFO.length },
    { key: 'matrix', label: 'Matriks permission', count: '—' },
  ];

  return (
    <div
      style={{
        padding: '18px 28px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
      }}
    >
      <div
        className="flex items-center"
        style={{
          background: 'var(--cream-100)',
          borderRadius: 8,
          padding: 3,
          gap: 2,
        }}
      >
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChangeTab(t.key)}
              className="btn btn-sm"
              style={{
                padding: '0 14px',
                background: active ? 'var(--bg-elev, #fff)' : 'transparent',
                boxShadow: active
                  ? 'var(--shadow-xs, 0 1px 2px rgba(0,0,0,0.05))'
                  : 'none',
                color: active ? 'var(--teal-800)' : 'var(--fg-muted)',
                fontWeight: active ? 600 : 500,
              }}
            >
              {t.label}
              {t.count !== '—' ? (
                <span
                  style={{ marginLeft: 4, fontSize: 11, opacity: 0.7 }}
                >
                  {t.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onExport}
          disabled={!onExport}
        >
          <Download size={14} /> Ekspor
        </button>
        <button
          type="button"
          onClick={onCreate}
          className="btn btn-primary btn-sm"
        >
          <Plus size={15} style={{ stroke: '#fff' }} /> User baru
        </button>
      </div>
    </div>
  );
}
