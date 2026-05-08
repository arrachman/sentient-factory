// Admin · User & Role Management — PRD § 3 Daftar Role.
// 6 role: Admin, Psikolog, Owner, Resepsionis, Marketing, Intern.
// Hak akses berbeda — penting untuk privasi data klien (BR-04).

const ROLES = [
  { k: 'admin',    label: 'Admin',       count: 2, color: '#5b8a66', access: 'Full Access',        desc: 'Mengatur seluruh penjadwalan klien & ruangan' },
  { k: 'psikolog', label: 'Psikolog',    count: 7, color: '#7a8556', access: 'Terbatas (data sendiri)', desc: 'Input availability, lihat jadwal & klien sendiri saja (BR-04)' },
  { k: 'owner',    label: 'Owner',       count: 1, color: '#1f3a3a', access: 'View Only',          desc: 'Memantau sistem secara keseluruhan' },
  { k: 'resep',    label: 'Resepsionis', count: 2, color: '#4a7090', access: 'View Only',          desc: 'Lihat jadwal harian untuk penerimaan klien' },
  { k: 'mark',     label: 'Marketing',   count: 1, color: '#8a6a3a', access: 'View Terbatas',      desc: 'Lihat data layanan & kapasitas' },
  { k: 'intern',   label: 'Intern',      count: 2, color: '#9a8c7a', access: 'View Terbatas',      desc: 'Akses minimal sesuai kebutuhan' },
];

const USERS = [
  { id: 'u1',  name: 'Sinta Maharani',     email: 'sinta@althea.id',    role: 'admin',    last: 'Sekarang aktif',  device: 'Chrome · macOS',     twoFa: true,  status: 'active' },
  { id: 'u2',  name: 'Reni Kartika',       email: 'reni@althea.id',     role: 'admin',    last: '12 menit lalu',   device: 'Edge · Windows',     twoFa: true,  status: 'active' },
  { id: 'u3',  name: 'Vina Permatasari',   email: 'vina@althea.id',     role: 'psikolog', last: '5 menit lalu',    device: 'Safari · iPhone',    twoFa: true,  status: 'active' },
  { id: 'u4',  name: 'Diah Ayu',           email: 'diah@althea.id',     role: 'psikolog', last: 'Sekarang aktif',  device: 'Chrome · Android',   twoFa: true,  status: 'active' },
  { id: 'u5',  name: 'Bagus Wicaksono',    email: 'bagus@althea.id',    role: 'psikolog', last: '2 jam lalu',      device: 'Chrome · Windows',   twoFa: false, status: 'active' },
  { id: 'u6',  name: 'Sari Lestari',       email: 'sari@althea.id',     role: 'psikolog', last: '1 hari lalu',     device: 'Chrome · macOS',     twoFa: true,  status: 'active' },
  { id: 'u7',  name: 'Mira Anggraini',     email: 'mira@althea.id',     role: 'psikolog', last: '3 jam lalu',      device: 'Safari · iPad',      twoFa: true,  status: 'active' },
  { id: 'u8',  name: 'Tomi Pradana',       email: 'tomi@althea.id',     role: 'psikolog', last: '20 menit lalu',   device: 'Chrome · Windows',   twoFa: false, status: 'active' },
  { id: 'u9',  name: 'Rina Hartono',       email: 'rina@althea.id',     role: 'psikolog', last: '1 jam lalu',      device: 'Firefox · macOS',    twoFa: true,  status: 'active' },
  { id: 'u10', name: 'Adhy Pratama',       email: 'adhy@althea.id',     role: 'owner',    last: 'Kemarin · 17:30', device: 'Chrome · Windows',   twoFa: true,  status: 'active' },
  { id: 'u11', name: 'Lina Resepsionis',   email: 'lina@althea.id',     role: 'resep',    last: 'Sekarang aktif',  device: 'Edge · Windows',     twoFa: false, status: 'active' },
  { id: 'u12', name: 'Doni Rahmat',        email: 'doni@althea.id',     role: 'resep',    last: '4 jam lalu',      device: 'Chrome · Android',   twoFa: false, status: 'active' },
  { id: 'u13', name: 'Intan Marketing',    email: 'intan@althea.id',    role: 'mark',     last: '2 hari lalu',     device: 'Chrome · macOS',     twoFa: true,  status: 'active' },
  { id: 'u14', name: 'Putri Anwar',        email: 'putri@althea.id',    role: 'intern',   last: '1 minggu lalu',   device: 'Chrome · Windows',   twoFa: false, status: 'inactive' },
  { id: 'u15', name: 'Rizki Maulana',      email: 'rizki@althea.id',    role: 'intern',   last: '3 hari lalu',     device: 'Chrome · Android',   twoFa: false, status: 'active' },
];

// Permission matrix per role × modul
const MODULES = ['Penjadwalan', 'Klien (semua)', 'Klien (sendiri)', 'Ruangan', 'Psikolog', 'Layanan', 'Notif WA', 'Audit Log', 'Pengaturan', 'User & Role'];
const PERMS = {
  admin:    ['edit', 'edit', '—',    'edit', 'edit', 'edit', 'edit', 'view', 'edit', 'edit'],
  psikolog: ['view', '—',    'edit', 'view', 'view', 'view', '—',    '—',    '—',    '—'   ],
  owner:    ['view', 'view', 'view', 'view', 'view', 'view', 'view', 'view', 'view', 'view'],
  resep:    ['view', 'view', '—',    'view', 'view', '—',    '—',    '—',    '—',    '—'   ],
  mark:     ['—',    '—',    '—',    '—',    '—',    'view', '—',    '—',    '—',    '—'   ],
  intern:   ['view', '—',    '—',    'view', '—',    'view', '—',    '—',    '—',    '—'   ],
};

const PERM_STYLE = {
  edit: { bg: 'var(--sage-100)',     fg: 'var(--sage-700)', label: '✓ edit' },
  view: { bg: 'var(--info-soft)',    fg: '#2c4a60',         label: '👁 view' },
  '—':  { bg: 'var(--cream-100)',    fg: 'var(--fg-muted)', label: '—' },
};

function AdminUsersRoles() {
  const [tab, setTab] = React.useState('users'); // 'users' | 'roles' | 'matrix'
  const [roleFilter, setRoleFilter] = React.useState('all');

  const visibleUsers = roleFilter === 'all' ? USERS : USERS.filter(u => u.role === roleFilter);

  return (
    <AdminShell active="users-roles" breadcrumb="Sistem · User & Role" title="User & Role Management">
      <div style={{ padding: '18px 28px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="row gap-1" style={{ background: 'var(--cream-100)', borderRadius: 8, padding: 3 }}>
          {[['users', 'User aktif', USERS.length], ['roles', 'Role & hak akses', ROLES.length], ['matrix', 'Matriks permission', '—']].map(([k, lbl, n]) => (
            <button key={k} onClick={() => setTab(k)} className="btn btn-sm" style={{ height: 30, padding: '0 14px',
              background: tab === k ? 'var(--bg-elev)' : 'transparent',
              boxShadow: tab === k ? 'var(--shadow-xs)' : 'none',
              color: tab === k ? 'var(--teal-800)' : 'var(--fg-muted)',
              fontWeight: tab === k ? 600 : 500 }}>
              {lbl} {n !== '—' && <span style={{ marginLeft: 4, fontSize: 11, opacity: 0.7 }}>{n}</span>}
            </button>
          ))}
        </div>
        <div className="row gap-2">
          <button className="btn btn-outline btn-sm"><Icon name="filter" size={14} /> Ekspor</button>
          <button className="btn btn-primary btn-sm"><Icon name="plus" size={15} stroke="#fff" /> Undang user baru</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: '0 28px 16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { lbl: 'Total user', val: USERS.length, sub: USERS.filter(u => u.status === 'active').length + ' aktif · 1 nonaktif' },
          { lbl: 'Sedang login', val: USERS.filter(u => u.last === 'Sekarang aktif').length, sub: 'sesi aktif sekarang' },
          { lbl: '2FA aktif', val: USERS.filter(u => u.twoFa).length + '/' + USERS.length, sub: 'wajib untuk admin & psikolog' },
          { lbl: 'Role', val: ROLES.length, sub: '6 level akses berbeda' },
        ].map((s, i) => (
          <div key={i} className="card-flat" style={{ padding: 14 }}>
            <div className="caption" style={{ marginBottom: 6 }}>{s.lbl}</div>
            <div className="row gap-2" style={{ alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 500, color: 'var(--teal-800)' }}>{s.val}</span>
              <span className="caption">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0, padding: '0 28px 28px', overflow: 'auto' }}>
        {tab === 'users' && (
          <>
            {/* Role filter pill */}
            <div className="row gap-2" style={{ marginBottom: 12, flexWrap: 'wrap' }}>
              <button onClick={() => setRoleFilter('all')} className="btn btn-sm" style={{ height: 28, padding: '0 12px', background: roleFilter === 'all' ? 'var(--sage-500)' : 'var(--bg-elev)', color: roleFilter === 'all' ? '#fff' : 'var(--fg)', border: '1px solid ' + (roleFilter === 'all' ? 'var(--sage-500)' : 'var(--border)') }}>
                Semua role <span style={{ marginLeft: 4, opacity: 0.8 }}>{USERS.length}</span>
              </button>
              {ROLES.map(r => {
                const sel = roleFilter === r.k;
                return (
                  <button key={r.k} onClick={() => setRoleFilter(r.k)} className="btn btn-sm" style={{ height: 28, padding: '0 12px', background: sel ? r.color : 'var(--bg-elev)', color: sel ? '#fff' : 'var(--fg)', border: '1px solid ' + (sel ? r.color : 'var(--border)') }}>
                    {r.label} <span style={{ marginLeft: 4, opacity: 0.8 }}>{r.count}</span>
                  </button>
                );
              })}
            </div>

            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1.5fr 1fr 1.4fr 100px', padding: '10px 18px', borderBottom: '1px solid var(--border)', background: 'var(--cream-50)', fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <span>User</span><span>Role</span><span>Aktivitas terakhir</span><span>2FA</span><span>Status</span><span></span>
              </div>
              {visibleUsers.map((u, i) => {
                const r = ROLES.find(x => x.k === u.role);
                return (
                  <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1.5fr 1fr 1.4fr 100px', padding: '12px 18px', borderTop: i ? '1px solid var(--border)' : 'none', alignItems: 'center' }}>
                    <div className="row gap-2">
                      <Avatar name={u.name} color={r.color} size="md" />
                      <div className="col">
                        <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--teal-800)' }}>{u.name}</span>
                        <span className="caption" style={{ fontSize: 11 }}>{u.email}</span>
                      </div>
                    </div>
                    <span className="badge" style={{ background: r.color + '22', color: r.color, height: 20, fontSize: 11 }}>{r.label}</span>
                    <div className="col">
                      <span style={{ fontSize: 12.5, color: u.last === 'Sekarang aktif' ? 'var(--sage-700)' : 'var(--fg)', fontWeight: u.last === 'Sekarang aktif' ? 600 : 400 }}>{u.last}</span>
                      <span className="caption" style={{ fontSize: 10.5 }}>{u.device}</span>
                    </div>
                    <span className={'badge ' + (u.twoFa ? 'badge-success' : 'badge-warn')} style={{ height: 18, fontSize: 10 }}>
                      {u.twoFa ? '✓ aktif' : '⚠ belum'}
                    </span>
                    <span className={'badge ' + (u.status === 'active' ? 'badge-sage' : 'badge-neutral')} style={{ height: 20, textTransform: 'capitalize' }}>
                      {u.status === 'active' ? 'aktif' : 'nonaktif'}
                    </span>
                    <div className="row gap-1" style={{ justifyContent: 'flex-end' }}>
                      <button className="btn btn-icon btn-ghost btn-sm"><Icon name="edit" size={13} /></button>
                      <button className="btn btn-icon btn-ghost btn-sm"><Icon name="more" size={13} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === 'roles' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {ROLES.map(r => (
              <div key={r.k} className="card" style={{ padding: 18, borderLeft: `4px solid ${r.color}` }}>
                <div className="row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
                  <div className="col">
                    <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--teal-800)', fontFamily: 'var(--font-serif)' }}>{r.label}</span>
                    <span className="caption" style={{ marginTop: 2 }}>{r.count} user · akses: <strong style={{ color: r.color }}>{r.access}</strong></span>
                  </div>
                  <button className="btn btn-icon btn-ghost btn-sm"><Icon name="edit" size={13} /></button>
                </div>
                <p className="body-sm" style={{ margin: '6px 0 12px', color: 'var(--fg)', lineHeight: 1.5 }}>{r.desc}</p>
                <div className="col gap-1">
                  <span className="eyebrow" style={{ marginBottom: 4 }}>Modul yang dapat diakses</span>
                  <div className="row gap-1" style={{ flexWrap: 'wrap' }}>
                    {MODULES.map((m, mi) => {
                      const p = PERMS[r.k][mi];
                      if (p === '—') return null;
                      return <span key={m} className="badge" style={{ background: PERM_STYLE[p].bg, color: PERM_STYLE[p].fg, height: 20, fontSize: 10.5 }}>{m} · {p}</span>;
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'matrix' && (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="row" style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between' }}>
              <h2 className="h2" style={{ margin: 0 }}>Matriks permission · role × modul</h2>
              <span className="caption">edit / view / — (tidak akses)</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '160px repeat(' + ROLES.length + ', minmax(110px, 1fr))', minWidth: 'fit-content' }}>
                <div style={{ padding: '12px 14px', background: 'var(--cream-50)', borderBottom: '1px solid var(--border)' }}>
                  <span className="eyebrow">Modul</span>
                </div>
                {ROLES.map(r => (
                  <div key={r.k} style={{ padding: '12px 10px', background: 'var(--cream-50)', borderBottom: '1px solid var(--border)', borderLeft: '1px solid var(--border)', textAlign: 'center' }}>
                    <div className="col" style={{ alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 999, background: r.color }} />
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--teal-800)' }}>{r.label}</span>
                    </div>
                  </div>
                ))}
                {MODULES.map((m, mi) => (
                  <React.Fragment key={m}>
                    <div style={{ padding: '12px 14px', borderBottom: mi === MODULES.length - 1 ? 'none' : '1px solid var(--border)', background: mi % 2 ? 'transparent' : 'var(--cream-50)' }}>
                      <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg)' }}>{m}</span>
                    </div>
                    {ROLES.map(r => {
                      const p = PERMS[r.k][mi];
                      const ps = PERM_STYLE[p];
                      return (
                        <div key={r.k + m} style={{ padding: '12px 10px', borderBottom: mi === MODULES.length - 1 ? 'none' : '1px solid var(--border)', borderLeft: '1px solid var(--border)', background: mi % 2 ? 'transparent' : 'var(--cream-50)', textAlign: 'center' }}>
                          <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 999, background: ps.bg, color: ps.fg, fontSize: 11, fontWeight: 600 }}>{ps.label}</span>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="row gap-2" style={{ padding: 12, background: 'var(--info-soft)', borderTop: '1px solid var(--border)' }}>
              <Icon name="bell" size={14} stroke="var(--info)" />
              <span className="caption" style={{ color: '#2c4a60', fontSize: 11.5 }}><strong>BR-04:</strong> Psikolog hanya dapat edit data klien sendiri ("Klien sendiri"), tidak dapat melihat data klien psikolog lain ("Klien (semua)" = —).</span>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

window.AdminUsersRoles = AdminUsersRoles;
