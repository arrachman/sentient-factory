/**
 * Tab "Role & hak akses" — 6 kartu role dengan modul access badges.
 * Modul ditampilkan kalau permission ≠ '—'.
 */
import { MODULES, PERMS, PERM_STYLE, ROLE_INFO } from '../model/role-config';

export function RoleCardsGrid({
  roleCounts,
}: {
  roleCounts: Record<string, number>;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: 14,
      }}
    >
      {ROLE_INFO.map((r) => {
        const moduleBadges = MODULES.map((m, mi) => ({
          m,
          p: PERMS[r.key][mi],
        })).filter((x) => x.p !== '—');
        return (
          <div
            key={r.key}
            className="card-althea"
            style={{ padding: 18, borderLeft: `4px solid ${r.color}` }}
          >
            <div
              className="flex items-start justify-between"
              style={{ marginBottom: 10 }}
            >
              <div className="flex flex-col">
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: 'var(--teal-800)',
                    fontFamily: 'var(--font-serif)',
                  }}
                >
                  {r.label}
                </span>
                <span className="caption" style={{ marginTop: 2 }}>
                  {roleCounts[r.key] ?? 0} user · akses:{' '}
                  <strong style={{ color: r.color }}>{r.access}</strong>
                </span>
              </div>
            </div>
            <p
              style={{
                margin: '6px 0 12px',
                color: 'var(--fg)',
                lineHeight: 1.5,
                fontSize: 13,
              }}
            >
              {r.desc}
            </p>
            <div className="flex flex-col gap-1">
              <span className="eyebrow" style={{ marginBottom: 4 }}>
                Modul yang dapat diakses
              </span>
              <div className="flex flex-wrap" style={{ gap: 4 }}>
                {moduleBadges.length === 0 ? (
                  <span className="caption">Tidak ada akses modul.</span>
                ) : (
                  moduleBadges.map(({ m, p }) => {
                    const ps = PERM_STYLE[p];
                    return (
                      <span
                        key={m}
                        className="badge"
                        style={{
                          background: ps.bg,
                          color: ps.fg,
                          height: 20,
                          fontSize: 10.5,
                        }}
                      >
                        {m} · {p}
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
