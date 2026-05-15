/**
 * Tab "Matriks permission" — grid 6 role × 10 modul, cell = chip permission.
 * Footer note BR-04 (psikolog × klien-semua = —).
 */
import { Fragment } from 'react';
import { Bell } from 'lucide-react';
import { MODULES, PERMS, PERM_STYLE, ROLE_INFO } from '../model/role-config';

export function PermissionMatrix() {
  const colTpl = `160px repeat(${ROLE_INFO.length}, minmax(110px, 1fr))`;
  return (
    <div className="card-althea" style={{ overflow: 'hidden' }}>
      <div
        className="flex items-center justify-between"
        style={{
          padding: '12px 18px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <h2 className="h2" style={{ margin: 0 }}>
          Matriks permission · role × modul
        </h2>
        <span className="caption">edit / view / — (tidak akses)</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: colTpl,
            minWidth: 'fit-content',
          }}
        >
          <HeaderCell label="Modul" />
          {ROLE_INFO.map((r) => (
            <RoleHeaderCell
              key={r.key}
              label={r.label}
              color={r.color}
            />
          ))}
          {MODULES.map((m, mi) => (
            <Fragment key={m}>
              <ModuleCell name={m} striped={mi % 2 === 0} isLast={mi === MODULES.length - 1} />
              {ROLE_INFO.map((r) => {
                const p = PERMS[r.key][mi];
                const ps = PERM_STYLE[p];
                return (
                  <PermCell
                    key={r.key + m}
                    label={ps.label}
                    bg={ps.bg}
                    fg={ps.fg}
                    striped={mi % 2 === 0}
                    isLast={mi === MODULES.length - 1}
                  />
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>

      <div
        className="flex items-start gap-2"
        style={{
          padding: 12,
          background: 'var(--info-soft, #e6f0f7)',
          borderTop: '1px solid var(--border)',
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
        <span
          className="caption"
          style={{ color: '#2c4a60', fontSize: 11.5 }}
        >
          <strong>Privasi antar psikolog:</strong> Psikolog hanya dapat edit
          data klien sendiri (&ldquo;Klien sendiri&rdquo;), tidak dapat melihat
          data klien psikolog lain (&ldquo;Klien (semua)&rdquo; = —).
        </span>
      </div>
    </div>
  );
}

function HeaderCell({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: '12px 14px',
        background: 'var(--cream-50)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <span className="eyebrow">{label}</span>
    </div>
  );
}

function RoleHeaderCell({ label, color }: { label: string; color: string }) {
  return (
    <div
      style={{
        padding: '12px 10px',
        background: 'var(--cream-50)',
        borderBottom: '1px solid var(--border)',
        borderLeft: '1px solid var(--border)',
        textAlign: 'center',
      }}
    >
      <div className="flex flex-col items-center" style={{ gap: 4 }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: color,
          }}
        />
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            color: 'var(--teal-800)',
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function ModuleCell({
  name,
  striped,
  isLast,
}: {
  name: string;
  striped: boolean;
  isLast: boolean;
}) {
  return (
    <div
      style={{
        padding: '12px 14px',
        borderBottom: isLast ? 'none' : '1px solid var(--border)',
        background: striped ? 'var(--cream-50)' : 'transparent',
      }}
    >
      <span
        style={{
          fontSize: 12.5,
          fontWeight: 500,
          color: 'var(--fg)',
        }}
      >
        {name}
      </span>
    </div>
  );
}

function PermCell({
  label,
  bg,
  fg,
  striped,
  isLast,
}: {
  label: string;
  bg: string;
  fg: string;
  striped: boolean;
  isLast: boolean;
}) {
  return (
    <div
      style={{
        padding: '12px 10px',
        borderBottom: isLast ? 'none' : '1px solid var(--border)',
        borderLeft: '1px solid var(--border)',
        background: striped ? 'var(--cream-50)' : 'transparent',
        textAlign: 'center',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          padding: '3px 10px',
          borderRadius: 999,
          background: bg,
          color: fg,
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        {label}
      </span>
    </div>
  );
}
