// AdminShell — shared sidebar + header for all desktop screens.
// Supports two roles via the `role` prop:
//   - "admin"     (default) — full menu access, brand "A" mark, "Sinta · Admin"
//   - "psikolog"  — limited menu (no Layanan/Notif WA/Pengaturan), adds Catatan klinis,
//                   "Vina · Psikolog" footer
// Pass `active` (one of 'dashboard' | 'schedule' | 'clients' | 'rooms' | 'psikolog' |
// 'layanan' | 'notif' | 'catatan' | 'profil') and `breadcrumb` + `title` for header.

const NAV_ADMIN = {
  Operasional: [
    ['schedule', 'cal', 'Penjadwalan'],
    ['clients', 'users', 'Klien'],
    ['rooms', 'door', 'Ruangan'],
  ],
  Manajemen: [
    ['psikolog', 'user', 'Psikolog'],
    ['layanan', 'list', 'Layanan'],
    ['notif', 'wa', 'Notifikasi WA', { badge: 'aktif' }],
  ],
  Sistem: [
    ['laporan', 'list', 'Laporan'],
    ['audit', 'clock', 'Audit log'],
    ['users-roles', 'user', 'User & Role'],
    ['settings', 'settings', 'Pengaturan'],
  ],
};

// NAV_PSIKOLOG — view psikolog hanya melihat data sendiri, bukan tim.
// "Jadwal tim" & "Tim psikolog" di-hide karena privasi: psikolog tidak perlu
// (& tidak boleh) melihat detail klien / sesi psikolog lain.
const NAV_PSIKOLOG = {
  Praktik: [
    ['dashboard', 'home', 'Dashboard'],
    ['schedule-mine', 'cal', 'Jadwal saya'],
    ['clients-mine', 'users', 'Klien saya'],
  ],
  Klinis: [
    ['catatan', 'list', 'Catatan klinis'],
    ['rooms-view', 'door', 'Ruangan'],
  ],
  Akun: [
    ['profil', 'user', 'Profil saya'],
  ],
};

function AdminShell({ role = 'admin', active = 'schedule', breadcrumb, title, headerActions, children }) {
  const isAdmin = role === 'admin';
  const nav = isAdmin ? NAV_ADMIN : NAV_PSIKOLOG;
  const user = isAdmin
    ? { initial: 'S', name: 'Sinta', role: 'Admin', color: '#5b8a66', greet: 'Sinta' }
    : { initial: 'V', name: 'Vina', role: 'Psikolog', color: '#7a8556', greet: 'Vina' };

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 880, background: 'var(--bg)' }}>
      <aside style={{ width: 240, background: 'var(--bg-elev)', borderRight: '1px solid var(--border)', padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0 }}>
        <div className="row gap-2" style={{ padding: '0 6px 6px' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--sage-500)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 16 }}>A</div>
          <div className="col">
            <span className="brand-mark" style={{ fontSize: 17, color: 'var(--teal-800)' }}>Althea</span>
            <span style={{ fontSize: 10.5, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>Psychology</span>
          </div>
        </div>

        {/* Role badge */}
        <div className="row gap-2" style={{ padding: '6px 10px', background: isAdmin ? 'var(--sage-50)' : 'var(--cream-100)', borderRadius: 8, border: '1px solid ' + (isAdmin ? 'var(--sage-200)' : 'var(--border)') }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: isAdmin ? 'var(--sage-500)' : 'var(--teal-700)' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--teal-800)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{isAdmin ? 'Admin · Klinik' : 'Staff Psikolog'}</span>
        </div>

        {Object.entries(nav).map(([groupName, items]) => (
          <div key={groupName} className="col gap-1">
            <div className="eyebrow" style={{ padding: '4px 10px' }}>{groupName}</div>
            {items.map(([k, ic, lbl, opts]) => (
              <div key={k} className={'nav-item ' + (active === k ? 'active' : '')}>
                <Icon name={ic} size={17} /> <span>{lbl}</span>
                {opts && opts.badge && <span className="badge badge-success" style={{ marginLeft: 'auto', height: 18, fontSize: 10 }}>{opts.badge}</span>}
              </div>
            ))}
          </div>
        ))}

        <div style={{ marginTop: 'auto', padding: 12, background: 'var(--cream-100)', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
          <Avatar name={user.name} color={user.color} size="md" />
          <div className="col" style={{ minWidth: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>{user.name}</span>
            <span style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>{user.role}</span>
          </div>
          <Icon name="logout" size={15} stroke="var(--fg-muted)" />
        </div>
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ height: 64, padding: '0 28px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-elev)', flexShrink: 0 }}>
          <div className="col">
            <span className="caption">{breadcrumb}</span>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 500, color: 'var(--teal-800)', letterSpacing: '-0.01em' }}>{title}</h1>
          </div>
          <div className="row gap-3">
            <div style={{ position: 'relative', width: 240 }}>
              <span style={{ position: 'absolute', left: 11, top: 10 }}><Icon name="search" size={15} stroke="var(--fg-muted)" /></span>
              <input className="input" placeholder={isAdmin ? 'Cari klien, psikolog…' : 'Cari klien saya…'} style={{ paddingLeft: 34, height: 36, fontSize: 13 }} />
            </div>
            <button className="btn btn-icon btn-ghost"><Icon name="bell" size={17} /></button>
            <Avatar name={user.greet} color={user.color} size="md" />
          </div>
        </header>

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </main>
    </div>
  );
}

window.AdminShell = AdminShell;
