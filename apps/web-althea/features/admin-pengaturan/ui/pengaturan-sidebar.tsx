/**
 * Sidebar tab nav untuk halaman Pengaturan.
 * Tab disabled tetap tampil tapi pakai opacity rendah + cursor not-allowed.
 */
import { SETTINGS_TABS, type TabKey } from '../model/constants';

export function PengaturanSidebar({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (key: TabKey) => void;
}) {
  return (
    <nav
      className="flex flex-col gap-1"
      style={{ alignSelf: 'start', position: 'sticky', top: 0 }}
    >
      <div className="eyebrow" style={{ padding: '4px 10px' }}>
        Bagian
      </div>
      {SETTINGS_TABS.map((t) => {
        const isDisabled = 'disabled' in t && t.disabled;
        const isActive = active === t.key && !isDisabled;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={'nav-item' + (isActive ? ' active' : '')}
            style={{
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              alignItems: 'flex-start',
              padding: '10px 12px',
              opacity: isDisabled ? 0.55 : 1,
              position: 'relative',
              background: 'transparent',
              border: 'none',
              textAlign: 'left',
              width: '100%',
            }}
            title={isDisabled && 'reason' in t ? t.reason : ''}
          >
            <div className="flex flex-col" style={{ gap: 2 }}>
              <div className="flex items-center gap-2">
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: isDisabled ? 'var(--fg-muted)' : 'inherit',
                  }}
                >
                  {t.label}
                </span>
                {isDisabled ? (
                  <span
                    className="badge"
                    style={{
                      height: 16,
                      fontSize: 9,
                      padding: '0 6px',
                      background: 'var(--cream-200)',
                      color: 'var(--fg-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      fontWeight: 600,
                    }}
                  >
                    add-on
                  </span>
                ) : null}
              </div>
              <span className="caption" style={{ fontSize: 11.5 }}>
                {isDisabled && 'reason' in t ? t.reason : t.hint}
              </span>
            </div>
          </button>
        );
      })}
    </nav>
  );
}
