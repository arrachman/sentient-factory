/* AuditTrail — CDN React 18, no bundler, globals only */
/* eslint-disable no-undef */

const AUDIT_EVENTS = [
  { id:1,  ts:'18/05/2026 07:02:11', user:'adi.s',    action:'Login',    module:'User',              docCode:null,           detail:'Login dari 192.168.1.10',                     severity:'info'   },
  { id:2,  ts:'18/05/2026 07:15:33', user:'fitri.h',  action:'Login',    module:'User',              docCode:null,           detail:'Login dari 192.168.1.22',                     severity:'info'   },
  { id:3,  ts:'18/05/2026 07:31:05', user:'adi.s',    action:'Buat',     module:'Item',              docCode:'ITM-0521-001', detail:'Item baru: Bearing SKF 6204',                 severity:'info'   },
  { id:4,  ts:'18/05/2026 07:44:18', user:'fitri.h',  action:'Buat',     module:'Kas Masuk',         docCode:'CR-2605-0120', detail:'Kas masuk Rp 5.000.000 dari PT Maju Jaya',   severity:'info'   },
  { id:5,  ts:'18/05/2026 07:58:42', user:'rendra.w', action:'Login',    module:'User',              docCode:null,           detail:'Login dari 192.168.1.35',                     severity:'info'   },
  { id:6,  ts:'18/05/2026 08:10:09', user:'adi.s',    action:'Edit',     module:'Item',              docCode:'ITM-0521-001', detail:"Nama: 'Bearing 6204' → 'Bearing SKF 6204'",  severity:'warn'   },
  { id:7,  ts:'18/05/2026 08:22:54', user:'rendra.w', action:'Buat',     module:'Faktur Pembelian',  docCode:'PI-2605-0451', detail:'Vendor: PT Komponen Utama, Total Rp 12.750.000', severity:'info' },
  { id:8,  ts:'18/05/2026 08:35:17', user:'maya.p',   action:'Login',    module:'User',              docCode:null,           detail:'Login dari 192.168.1.41',                     severity:'info'   },
  { id:9,  ts:'18/05/2026 08:47:30', user:'fitri.h',  action:'Posting',  module:'Kas Masuk',         docCode:'CR-2605-0120', detail:'Status: Draft → Posted',                      severity:'info'   },
  { id:10, ts:'18/05/2026 09:02:15', user:'maya.p',   action:'Buat',     module:'Partner',           docCode:null,           detail:'Partner baru: CV Bintang Teknik',             severity:'info'   },
  { id:11, ts:'18/05/2026 09:14:22', user:'adi.s',    action:'Edit',     module:'Faktur Pembelian',  docCode:'PI-2605-0451', detail:'Total: Rp 12.750.000 → Rp 13.200.000',        severity:'warn'   },
  { id:12, ts:'18/05/2026 09:28:48', user:'budi.t',   action:'Login',    module:'User',              docCode:null,           detail:'Login dari 192.168.1.50',                     severity:'info'   },
  { id:13, ts:'18/05/2026 09:41:03', user:'rendra.w', action:'Setujui',  module:'Faktur Pembelian',  docCode:'PI-2605-0451', detail:'Status: Menunggu → Disetujui',                severity:'info'   },
  { id:14, ts:'18/05/2026 09:55:37', user:'budi.t',   action:'Buat',     module:'Work Order',        docCode:'WO-2605-0088', detail:'WO baru: Produksi Gear Box 10 unit',          severity:'info'   },
  { id:15, ts:'18/05/2026 10:08:12', user:'maya.p',   action:'Edit',     module:'Partner',           docCode:null,           detail:"Alamat: 'Jl. Industri 12' → 'Jl. Industri 12A'", severity:'warn' },
  { id:16, ts:'18/05/2026 10:22:50', user:'fitri.h',  action:'Buat',     module:'Kas Keluar',        docCode:'CP-2605-0075', detail:'Kas keluar Rp 3.500.000 ke PT Supplier',      severity:'info'   },
  { id:17, ts:'18/05/2026 10:36:19', user:'adi.s',    action:'Hapus',    module:'Item',              docCode:'ITM-0521-009', detail:'Item dihapus: Bolt M8 (stok nol)',             severity:'danger' },
  { id:18, ts:'18/05/2026 10:50:44', user:'rendra.w', action:'Posting',  module:'Faktur Pembelian',  docCode:'PI-2605-0451', detail:'Status: Disetujui → Posted',                  severity:'info'   },
  { id:19, ts:'18/05/2026 11:03:28', user:'budi.t',   action:'Edit',     module:'Work Order',        docCode:'WO-2605-0088', detail:'Qty target: 10 → 12 unit',                    severity:'warn'   },
  { id:20, ts:'18/05/2026 11:17:55', user:'maya.p',   action:'Ekspor',   module:'Laporan',           docCode:null,           detail:'Ekspor laporan stok ke CSV',                  severity:'info'   },
  { id:21, ts:'18/05/2026 11:32:10', user:'fitri.h',  action:'Tolak',    module:'Kas Keluar',        docCode:'CP-2605-0074', detail:'Ditolak: anggaran bulan ini sudah penuh',      severity:'danger' },
  { id:22, ts:'18/05/2026 11:46:33', user:'adi.s',    action:'Buat',     module:'Jurnal',            docCode:'JE-2605-0033', detail:'Jurnal penyesuaian stok Rp 450.000',           severity:'info'   },
  { id:23, ts:'18/05/2026 12:01:07', user:'rendra.w', action:'Logout',   module:'User',              docCode:null,           detail:'Sesi berakhir (timeout)',                      severity:'info'   },
  { id:24, ts:'18/05/2026 12:15:42', user:'budi.t',   action:'Batal',    module:'Work Order',        docCode:'WO-2605-0085', detail:'WO dibatalkan: material tidak tersedia',       severity:'danger' },
  { id:25, ts:'18/05/2026 13:04:18', user:'maya.p',   action:'Edit',     module:'Jurnal',            docCode:'JE-2605-0033', detail:'Keterangan: diperbarui setelah verifikasi',    severity:'warn'   },
  { id:26, ts:'18/05/2026 13:22:55', user:'fitri.h',  action:'Posting',  module:'Kas Keluar',        docCode:'CP-2605-0075', detail:'Status: Draft → Posted',                      severity:'info'   },
  { id:27, ts:'18/05/2026 13:40:30', user:'adi.s',    action:'Setujui',  module:'Jurnal',            docCode:'JE-2605-0033', detail:'Status: Draft → Disetujui',                   severity:'info'   },
  { id:28, ts:'18/05/2026 14:05:14', user:'budi.t',   action:'Buat',     module:'Work Order',        docCode:'WO-2605-0089', detail:'WO baru: Maintenance mesin press',             severity:'info'   },
  { id:29, ts:'18/05/2026 14:28:47', user:'maya.p',   action:'Logout',   module:'User',              docCode:null,           detail:'Logout manual',                               severity:'info'   },
  { id:30, ts:'18/05/2026 14:55:02', user:'fitri.h',  action:'Ekspor',   module:'Laporan',           docCode:null,           detail:'Ekspor laporan piutang ke Excel',              severity:'info'   },
];

const ACTION_BADGE = {
  Buat:    'approved',
  Edit:    'pending',
  Hapus:   'cancelled',
  Posting: 'posted',
  Setujui: 'approved',
  Tolak:   'rejected',
  Batal:   'cancelled',
  Login:   'draft',
  Logout:  'draft',
  Ekspor:  'pending',
};

const SEV_COLOR = { info: 'var(--info)', warn: 'var(--warn)', danger: 'var(--danger)' };
const PAGE_SIZE = 15;

function SummaryCard({ icon, label, value, color }) {
  const { useState: _, useEffect: __, useMemo: _m, useCallback: _c } = React;
  return (
    React.createElement('div', {
      style: {
        background: 'var(--panel)', border: '1px solid var(--border)',
        borderRadius: 8, padding: '12px 16px', flex: '1 1 160px',
        display: 'flex', flexDirection: 'column', gap: 4,
      }
    },
      React.createElement('span', { style: { color: 'var(--fg-muted)', fontSize: 12 } }, label),
      React.createElement('span', { style: { color: color || 'var(--fg)', fontSize: 22, fontWeight: 700 } }, value),
      React.createElement(Icon, { name: icon, size: 16, style: { color: 'var(--fg-faint)', marginTop: 2 } })
    )
  );
}

function AuditTrail({ t }) {
  const { useState, useMemo } = React;

  const [search, setSearch]     = useState('');
  const [fAction, setFAction]   = useState('');
  const [fModule, setFModule]   = useState('');
  const [fUser, setFUser]       = useState('');
  const [page, setPage]         = useState(1);
  const [view, setView]         = useState('table');
  const [focused, setFocused]   = useState(0);

  const USERS   = window.USERS   || ['adi.s','fitri.h','rendra.w','maya.p','budi.t'];
  const actions = useMemo(() => [...new Set(AUDIT_EVENTS.map(e => e.action))].sort(), []);
  const modules = useMemo(() => [...new Set(AUDIT_EVENTS.map(e => e.module))].sort(), []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return AUDIT_EVENTS.filter(e => {
      if (fAction && e.action !== fAction) return false;
      if (fModule && e.module !== fModule) return false;
      if (fUser   && e.user   !== fUser)   return false;
      if (q && ![e.user, e.docCode || '', e.detail, e.module].some(s => s.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [search, fAction, fModule, fUser]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = useMemo(() => ({
    total:     AUDIT_EVENTS.length,
    changes:   AUDIT_EVENTS.filter(e => e.action === 'Edit' || e.action === 'Hapus').length,
    posted:    AUDIT_EVENTS.filter(e => e.action === 'Posting').length,
    sessions:  AUDIT_EVENTS.filter(e => e.action === 'Login' || e.action === 'Logout').length,
  }), []);

  const resetFilters = () => { setSearch(''); setFAction(''); setFModule(''); setFUser(''); setPage(1); };

  const copyRow = (e) => {
    const text = [e.ts, e.user, e.action, e.module, e.docCode || '-', e.detail].join(' | ');
    navigator.clipboard?.writeText(text).catch(() => {});
    window.toast?.('Disalin', { type: 'success' });
  };

  const exportCSV = () => {
    window.toast?.('Ekspor berhasil (audit_log_20260518.csv)', { type: 'success' });
  };

  const goPage = (n) => setPage(Math.max(1, Math.min(totalPages, n)));

  useKey((e) => {
    if (window.__overlay) return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
    if (e.key === 'j' || e.key === 'ArrowDown') { e.preventDefault(); setFocused(f => Math.min(paginated.length - 1, f + 1)); }
    else if (e.key === 'k' || e.key === 'ArrowUp') { e.preventDefault(); setFocused(f => Math.max(0, f - 1)); }
    else if (e.key.toLowerCase() === 'c' && paginated[focused]) { e.preventDefault(); copyRow(paginated[focused]); }
  });

  /* ── grouped for timeline ── */
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(e => {
      const day = e.ts.split(' ')[0];
      if (!map[day]) map[day] = [];
      map[day].push(e);
    });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const sel = (val, set) => (ev) => { set(ev.target.value); setPage(1); };

  return (
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 20px' } },

      /* ── Header ── */
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 } },
        React.createElement('div', null,
          React.createElement('h2', { style: { margin: 0, color: 'var(--fg)', fontWeight: 700, fontSize: 20 } }, 'Jejak Audit'),
          React.createElement('p',  { className: 'muted', style: { margin: '2px 0 0', fontSize: 13 } }, 'Menampilkan aktivitas sistem dalam 30 hari terakhir'),
        ),
        React.createElement('button', { className: 'btn sm', onClick: exportCSV, style: { display: 'flex', alignItems: 'center', gap: 6 } },
          React.createElement(Icon, { name: 'download', size: 14 }), 'Ekspor CSV'
        )
      ),

      /* ── Summary cards ── */
      React.createElement('div', { style: { display: 'flex', gap: 12, flexWrap: 'wrap' } },
        React.createElement(SummaryCard, { icon: 'activity', label: 'Total Event (hari ini)',  value: stats.total,    color: 'var(--info)'    }),
        React.createElement(SummaryCard, { icon: 'edit',     label: 'Perubahan Data',          value: stats.changes,  color: 'var(--warn)'    }),
        React.createElement(SummaryCard, { icon: 'check',    label: 'Transaksi Diposting',     value: stats.posted,   color: 'var(--success)' }),
        React.createElement(SummaryCard, { icon: 'log-in',   label: 'Login / Logout',          value: stats.sessions, color: 'var(--fg-muted)' }),
      ),

      /* ── Filter bar ── */
      React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' } },
        React.createElement('input', {
          className: 'input', placeholder: 'Cari user, dokumen, detail…',
          value: search, onChange: e => { setSearch(e.target.value); setPage(1); },
          style: { flex: '1 1 200px', minWidth: 180 }
        }),
        React.createElement('select', { className: 'select', value: fAction, onChange: sel(fAction, setFAction), style: { flex: '0 0 auto' } },
          React.createElement('option', { value: '' }, 'Semua Aksi'),
          actions.map(a => React.createElement('option', { key: a, value: a }, a))
        ),
        React.createElement('select', { className: 'select', value: fModule, onChange: sel(fModule, setFModule), style: { flex: '0 0 auto' } },
          React.createElement('option', { value: '' }, 'Semua Modul'),
          modules.map(m => React.createElement('option', { key: m, value: m }, m))
        ),
        React.createElement('select', { className: 'select', value: fUser, onChange: sel(fUser, setFUser), style: { flex: '0 0 auto' } },
          React.createElement('option', { value: '' }, 'Semua User'),
          USERS.map(u => React.createElement('option', { key: u, value: u }, u))
        ),
        React.createElement('button', { className: 'btn sm ghost', onClick: resetFilters }, 'Reset'),
      ),

      /* ── View toggle ── */
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
        React.createElement('span', { className: 'muted', style: { fontSize: 13 } },
          `${filtered.length} event ditemukan`
        ),
        React.createElement('div', { className: 'tabs', style: { gap: 4 } },
          React.createElement('button', { className: `tab${view === 'table' ? ' active' : ''}`, onClick: () => setView('table') },
            React.createElement(Icon, { name: 'list', size: 13 }), ' Tabel'
          ),
          React.createElement('button', { className: `tab${view === 'timeline' ? ' active' : ''}`, onClick: () => setView('timeline') },
            React.createElement(Icon, { name: 'clock', size: 13 }), ' Timeline'
          ),
        ),
      ),

      /* ── Empty state ── */
      filtered.length === 0 && React.createElement('div', { className: 'cm-empty', style: { padding: '48px 0', textAlign: 'center' } },
        React.createElement(Icon, { name: 'file', size: 36, style: { color: 'var(--fg-faint)', display: 'block', margin: '0 auto 12px' } }),
        React.createElement('p', { className: 'muted' }, 'Tidak ada event yang cocok')
      ),

      /* ── Table view ── */
      view === 'table' && filtered.length > 0 && React.createElement('div', { style: { overflowX: 'auto' } },
        React.createElement('table', { className: 'table', style: { width: '100%', borderCollapse: 'collapse' } },
          React.createElement('thead', null,
            React.createElement('tr', null,
              ['Waktu','User','Aksi','Modul','No Dokumen','Detail',''].map(h =>
                React.createElement('th', { key: h, className: 'th', style: { textAlign: 'left', padding: '8px 10px', fontSize: 12, color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' } }, h)
              )
            )
          ),
          React.createElement('tbody', null,
            paginated.map((e, idx) =>
              React.createElement('tr', { key: e.id, className: `tr${idx === focused ? ' focused' : ''}`, style: { borderBottom: '1px solid var(--border)' }, onClick: () => setFocused(idx) },
                React.createElement('td', { className: 'td ti', style: { padding: '8px 10px', fontSize: 12, whiteSpace: 'nowrap', color: 'var(--fg-muted)' } }, e.ts),
                React.createElement('td', { className: 'td', style: { padding: '8px 10px', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' } }, e.user),
                React.createElement('td', { className: 'td', style: { padding: '8px 10px' } },
                  React.createElement('span', { className: `status ${ACTION_BADGE[e.action] || 'draft'}`, style: { fontSize: 11 } }, e.action)
                ),
                React.createElement('td', { className: 'td', style: { padding: '8px 10px', fontSize: 13 } }, e.module),
                React.createElement('td', { className: 'td ti', style: { padding: '8px 10px', fontSize: 12, whiteSpace: 'nowrap' } }, e.docCode || '—'),
                React.createElement('td', { className: 'td', style: { padding: '8px 10px', fontSize: 13, color: 'var(--fg-muted)', maxWidth: 280 } }, e.detail),
                React.createElement('td', { className: 'td', style: { padding: '8px 10px' } },
                  React.createElement('button', { className: 'iconbtn', title: 'Salin', onClick: () => copyRow(e) },
                    React.createElement(Icon, { name: 'copy', size: 14 })
                  )
                )
              )
            )
          )
        ),
        /* Pagination */
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginTop: 12, flexWrap: 'wrap' } },
          React.createElement('span', { className: 'muted', style: { fontSize: 12 } },
            'Pintasan: ', React.createElement(Kbd, null, 'J'), '/', React.createElement(Kbd, null, 'K'), ' navigasi · ', React.createElement(Kbd, null, 'C'), ' salin baris'
          ),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
            React.createElement('span', { className: 'muted', style: { fontSize: 12 } }, `Hal ${page} / ${totalPages}`),
            React.createElement('button', { className: 'btn sm ghost', disabled: page === 1, onClick: () => goPage(page - 1) }, '← Prev'),
            React.createElement('button', { className: 'btn sm ghost', disabled: page === totalPages, onClick: () => goPage(page + 1) }, 'Next →'),
          )
        )
      ),

      /* ── Timeline view ── */
      view === 'timeline' && filtered.length > 0 && React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 20 } },
        grouped.map(([day, events]) =>
          React.createElement('div', { key: day },
            React.createElement('p', { style: { fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' } },
              day === '18/05/2026' ? `Hari ini, 18 Mei 2026` : day
            ),
            React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 0 } },
              events.map((e, i) =>
                React.createElement('div', { key: e.id, style: { display: 'flex', gap: 12, paddingBottom: 12, position: 'relative' } },
                  React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                    React.createElement('div', { style: { width: 10, height: 10, borderRadius: '50%', background: SEV_COLOR[e.severity], flexShrink: 0, marginTop: 4 } }),
                    i < events.length - 1 && React.createElement('div', { style: { width: 1, flex: 1, background: 'var(--border)', marginTop: 2 } })
                  ),
                  React.createElement('div', { style: { flex: 1, paddingBottom: 4 } },
                    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } },
                      React.createElement('span', { style: { fontSize: 12, color: 'var(--fg-muted)', whiteSpace: 'nowrap' } }, e.ts.split(' ')[1]),
                      React.createElement('span', { style: { fontWeight: 600, fontSize: 13 } }, e.user),
                      React.createElement('span', { className: `status ${ACTION_BADGE[e.action] || 'draft'}`, style: { fontSize: 11 } }, e.action),
                      React.createElement('span', { className: 'muted', style: { fontSize: 12 } }, e.module),
                      e.docCode && React.createElement('span', { className: 'ti muted', style: { fontSize: 12 } }, e.docCode),
                    ),
                    React.createElement('p', { style: { margin: '3px 0 0', fontSize: 13, color: 'var(--fg-muted)' } }, e.detail)
                  )
                )
              )
            )
          )
        )
      ),
    )
  );
}

Object.assign(window, { AuditTrail });
