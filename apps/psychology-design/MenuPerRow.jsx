// Menu per-row — navigasi flat ke semua artboard, dirender sebagai artboard sendiri
// di kanvas. Versi standalone HTML ada di index-menu-per-row.html.

const MENU_ROWS = [
  {
    num: '01 · Desktop',
    title: 'Operasional',
    desc: 'Penjadwalan harian, manajemen klien, dan utilisasi ruangan.',
    tone: 'sage',
    items: [
      ['admin-schedule', 'Penjadwalan harian'],
      ['admin-wizard',   'Wizard klien baru'],
      ['admin-clients',  'Daftar & detail klien'],
      ['admin-rooms',    'Timeline ruangan'],
    ],
  },
  {
    num: '02 · Desktop',
    title: 'Manajemen',
    desc: 'Tim psikolog, katalog layanan, otomasi WhatsApp, pengaturan klinik & user.',
    tone: 'sage',
    items: [
      ['admin-psikolog',     'Tim psikolog'],
      ['admin-layanan',      'Katalog layanan'],
      ['admin-notif',        'Notifikasi WA'],
      ['admin-pengaturan',   'Pengaturan klinik'],
      ['admin-audit',        'Audit log'],
      ['admin-users-roles',  'User & Role'],
    ],
  },
  {
    num: '03 · Desktop',
    title: 'Role Lain (Owner, Resepsionis, Marketing)',
    desc: 'Dashboard view-only untuk 3 role tambahan dari PRD § 3.',
    tone: 'olive',
    items: [
      ['owner-dashboard',     'Owner · Ringkasan'],
      ['resep-dashboard',     'Resepsionis · Klien hari ini'],
      ['marketing-dashboard', 'Marketing · Insight layanan'],
    ],
  },
  {
    num: '04 · Desktop',
    title: 'Dialog & aksi',
    desc: 'Modal, popover, panel detail, reschedule/cancel, dan notifikasi center.',
    tone: 'olive',
    items: [
      ['dlg-filter-klien',   'Filter klien'],
      ['dlg-sortir',         'Sortir'],
      ['dlg-add-klien',      'Tambah klien'],
      ['dlg-add-psikolog',   'Tambah psikolog'],
      ['dlg-add-layanan',    'Tambah layanan'],
      ['dlg-add-ruangan',    'Tambah ruangan'],
      ['dlg-booking-detail', 'Detail sesi'],
      ['dlg-new-template',   'Template WA baru'],
      ['dlg-reschedule',     'Reschedule sesi'],
      ['dlg-cancel',         'Batalkan sesi'],
      ['dlg-notif',          'Notifikasi center'],
    ],
  },
  {
    num: '05 · Desktop',
    title: 'Role Staff Psikolog',
    desc: 'Sidebar dengan menu yang dipangkas + landing dashboard pribadi.',
    tone: 'sage',
    items: [
      ['psk-dashboard', 'Dashboard psikolog'],
      ['psk-jadwal',    'Jadwal saya'],
      ['psk-klien',     'Klien saya'],
      ['psk-catatan',   'Catatan klinis (SOAP)'],
      ['psk-profil',    'Profil & availability'],
    ],
  },
  {
    num: '06 · Mobile',
    title: 'Admin Klinik',
    desc: 'Aplikasi admin di lapangan — pantau jadwal, klien, ruangan, log WhatsApp.',
    tone: 'tan',
    items: [
      ['ma-schedule', 'Penjadwalan hari ini'],
      ['ma-clients',  'Klien'],
      ['ma-rooms',    'Ruangan'],
      ['ma-notif',    'Notifikasi WA'],
    ],
  },
  {
    num: '07 · Mobile',
    title: 'Staff Psikolog',
    desc: 'Aplikasi untuk psikolog — jadwal, klien, catatan klinis, availability, recovery.',
    tone: 'tan',
    items: [
      ['m-today',        '01 · Hari ini'],
      ['mp-klien',       '02 · Klien saya'],
      ['mp-jadwal',      '02b · Jadwal mingguan'],
      ['mp-detail',      '03 · Detail & catatan'],
      ['m-availability', '04 · Availability'],
      ['mp-profil',      '05 · Profil'],
      ['m-login',        '06 · Login'],
      ['m-forgot',       '07 · Lupa kata sandi'],
    ],
  },
];

const TONE = {
  sage:  'var(--sage-500)',
  olive: '#7a8556',
  tan:   '#b8956a',
};

function MenuPerRow() {
  return (
    <div style={{ height: '100%', overflowY: 'auto', background: 'var(--bg)', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 40px 60px' }}>

        <div className="row gap-3" style={{ alignItems: 'center', marginBottom: 6 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--sage-500)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 30 }}>A</div>
          <div className="col">
            <h1 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 28, color: 'var(--teal-800)', letterSpacing: '-0.01em' }}>Althea Psychology — App Concept</h1>
            <span style={{ color: 'var(--fg-muted)', fontSize: 13.5, marginTop: 2 }}>Sistem penjadwalan klinik psikologi · Malang. Menu navigasi per-baris ke semua artboard.</span>
          </div>
        </div>

        <div className="row gap-2" style={{ margin: '20px 0 28px', flexWrap: 'wrap' }}>
          <a href="#overview"     style={pillStyle}>Overview</a>
          <a href="#operasional"  style={pillStyle}>Operasional</a>
          <a href="#manajemen"    style={pillStyle}>Manajemen</a>
          <a href="#role-dashboards" style={pillStyle}>Role Lain</a>
          <a href="#dialogs"      style={pillStyle}>Dialog</a>
          <a href="#role-psikolog" style={pillStyle}>Role Psikolog</a>
          <a href="#mobile-admin" style={pillStyle}>Mobile Admin</a>
          <a href="#mobile-psikolog" style={pillStyle}>Mobile Psikolog</a>
        </div>

        {MENU_ROWS.map((r, i) => (
          <div
            key={r.title}
            style={{
              display: 'grid',
              gridTemplateColumns: '220px 1fr',
              gap: 28,
              padding: '20px 0',
              borderBottom: i === MENU_ROWS.length - 1 ? 'none' : '1px solid var(--border)',
              alignItems: 'start',
            }}
          >
            <div className="col">
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--sage-700)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{r.num}</span>
              <h2 style={{ margin: '4px 0 6px', fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 19, color: 'var(--teal-800)' }}>{r.title}</h2>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg-muted)', lineHeight: 1.5 }}>{r.desc}</p>
            </div>
            <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
              {r.items.map(([id, label]) => (
                <a key={id} href={'#' + id} style={chipStyle}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: TONE[r.tone] }} />
                  {label}
                </a>
              ))}
            </div>
          </div>
        ))}

        <div style={{ marginTop: 36, fontSize: 12, color: 'var(--fg-muted)' }}>
          Menu ini juga tersedia sebagai halaman terpisah: <code style={{ background: 'var(--cream-100)', padding: '2px 6px', borderRadius: 4 }}>index-menu-per-row.html</code>
        </div>
      </div>
    </div>
  );
}

const pillStyle = {
  fontSize: 13,
  padding: '7px 14px',
  borderRadius: 999,
  background: '#fff',
  border: '1px solid var(--border)',
  color: 'var(--teal-800)',
  textDecoration: 'none',
  fontWeight: 600,
};

const chipStyle = {
  fontSize: 13,
  padding: '9px 14px',
  borderRadius: 10,
  background: '#fff',
  border: '1px solid var(--border)',
  color: 'var(--fg)',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
};

window.MenuPerRow = MenuPerRow;
