// Admin · Audit Log — Sistem
// Catatan aktivitas seluruh sistem untuk akuntabilitas & investigasi.
// Konteks Althea: multi-role (Admin, Psikolog, Owner, Resepsionis, Marketing,
// Intern) dengan privasi data klien yang ketat (BR-04: psikolog tidak boleh
// melihat data psikolog lain). Audit log mencatat siapa-melakukan-apa-kapan
// untuk semua aksi sensitif: akses data klien, perubahan jadwal,
// availability, layanan, role/user, dan pengaturan.

const AUDIT_CATS = [
  { k: 'all',       label: 'Semua kategori', count: 247 },
  { k: 'auth',      label: 'Login & sesi',   count: 38,  ic: 'logout' },
  { k: 'klien',     label: 'Data klien',     count: 64,  ic: 'users' },
  { k: 'jadwal',    label: 'Penjadwalan',    count: 71,  ic: 'cal' },
  { k: 'avail',     label: 'Availability',   count: 19,  ic: 'clock' },
  { k: 'layanan',   label: 'Layanan & tarif',count: 12,  ic: 'list' },
  { k: 'ruangan',   label: 'Ruangan',        count: 7,   ic: 'door' },
  { k: 'user',      label: 'User & role',    count: 14,  ic: 'user' },
  { k: 'setting',   label: 'Pengaturan',     count: 9,   ic: 'settings' },
  { k: 'notif',     label: 'Notifikasi WA',  count: 13,  ic: 'wa' },
];

// severity → badge class
const SEV = {
  info:   { cls: 'badge-sage',   label: 'info' },
  ok:     { cls: 'badge-success',label: 'sukses' },
  warn:   { cls: 'badge-warn',   label: 'perhatian' },
  danger: { cls: 'badge-rose',   label: 'sensitif' },
};

// Mock log — 1 hari operasional klinik. Disusun terbalik (terbaru di atas).
const AUDIT_LOG = [
  { id: 'e042', t: '14:38', date: '03 Mei 2026', actor: 'Sinta',  role: 'Admin',       ic: 'cal',    cat: 'jadwal',  sev: 'info',   action: 'Reschedule sesi',         target: 'Klien Anita W. · sesi 2/4 Terapi Dewasa', meta: 'Senin 06 Mei 14:00 → Selasa 07 Mei 10:00 · ruangan tetap K-2',           ip: '10.10.20.4',  device: 'Chrome · macOS' },
  { id: 'e041', t: '14:31', date: '03 Mei 2026', actor: 'Vina',   role: 'Psikolog',    ic: 'clock',  cat: 'avail',   sev: 'info',   action: 'Override availability',  target: 'Hari Jumat 08 Mei 2026',                  meta: 'Slot 15:15–16:45 ditutup (alasan: izin pribadi)',                          ip: '10.10.20.18', device: 'Safari · iPhone' },
  { id: 'e040', t: '14:22', date: '03 Mei 2026', actor: 'Vina',   role: 'Psikolog',    ic: 'eye',    cat: 'klien',   sev: 'danger', action: 'Akses data klien ditolak', target: 'Klien #C-2014 (Davi P.)',                  meta: 'Klien terdaftar di psikolog lain (Bu Rara) · BR-04 enforced',              ip: '10.10.20.18', device: 'Safari · iPhone' },
  { id: 'e039', t: '14:05', date: '03 Mei 2026', actor: 'Sistem', role: 'Otomatis',    ic: 'wa',     cat: 'notif',   sev: 'ok',     action: 'Reminder WA terkirim',    target: '12 sesi · pukul 16:00 hari ini',          meta: 'Template "Pengingat 30 Menit" · 11 terbaca · 1 gagal (no. tidak aktif)',     ip: '—',           device: 'cron worker' },
  { id: 'e038', t: '13:48', date: '03 Mei 2026', actor: 'Sinta',  role: 'Admin',       ic: 'plus',   cat: 'klien',   sev: 'info',   action: 'Tambah klien baru',       target: 'Klien Putri R. (anak, 9 tahun)',         meta: 'Layanan: Tes Tumbuh Kembang Anak (2 sesi) · psikolog Bu Rara',            ip: '10.10.20.4',  device: 'Chrome · macOS' },
  { id: 'e037', t: '13:30', date: '03 Mei 2026', actor: 'Adhy',   role: 'Owner',       ic: 'settings',cat:'setting', sev: 'warn',   action: 'Ubah pengaturan keamanan', target: 'Sesi login: 8 jam → 4 jam',              meta: 'Berlaku untuk semua role · 12 user akan logout otomatis besok',           ip: '203.78.14.91',device: 'Chrome · Windows' },
  { id: 'e036', t: '13:12', date: '03 Mei 2026', actor: 'Sinta',  role: 'Admin',       ic: 'edit',   cat: 'layanan', sev: 'warn',   action: 'Ubah tarif layanan',      target: 'Konseling Individu Dewasa',              meta: 'Rp 350.000 → Rp 400.000 · efektif 01 Juni 2026',                          ip: '10.10.20.4',  device: 'Chrome · macOS' },
  { id: 'e035', t: '12:55', date: '03 Mei 2026', actor: 'Sistem', role: 'Otomatis',    ic: 'check',  cat: 'jadwal',  sev: 'ok',     action: 'Slot diblokir otomatis',  target: 'Bu Vina · Senin 06 Mei · slot 13:30',    meta: 'Kuota 4 klien/hari tercapai · BR-01',                                     ip: '—',           device: 'cron worker' },
  { id: 'e034', t: '12:44', date: '03 Mei 2026', actor: 'Resep.', role: 'Resepsionis', ic: 'eye',    cat: 'klien',   sev: 'info',   action: 'Lihat daftar klien hari ini', target: '14 klien terjadwal',                  meta: 'View only — sesuai hak akses role Resepsionis',                            ip: '10.10.20.7',  device: 'Edge · Windows' },
  { id: 'e033', t: '12:30', date: '03 Mei 2026', actor: 'Bu Rara',role: 'Psikolog',    ic: 'logout', cat: 'auth',    sev: 'info',   action: 'Login berhasil',          target: 'Sesi #s-9214',                            meta: 'Login dari perangkat dikenal',                                            ip: '10.10.20.21', device: 'Chrome · Android' },
  { id: 'e032', t: '12:18', date: '03 Mei 2026', actor: 'unknown',role: '—',           ic: 'logout', cat: 'auth',    sev: 'danger', action: 'Login gagal · 3× berturut', target: 'Akun: vina@althea.id',                   meta: 'Akun dikunci 15 menit · IP di luar kantor',                                ip: '36.91.220.14',device: 'Chrome · Windows' },
  { id: 'e031', t: '12:02', date: '03 Mei 2026', actor: 'Sinta',  role: 'Admin',       ic: 'door',   cat: 'ruangan', sev: 'info',   action: 'Pindah ruangan sesi',     target: 'Klien Bayu S. · Ruang K-3 → K-Besar',     meta: 'Ruangan K-3 dialihkan untuk sesi terapi anak',                            ip: '10.10.20.4',  device: 'Chrome · macOS' },
  { id: 'e030', t: '11:45', date: '03 Mei 2026', actor: 'Adhy',   role: 'Owner',       ic: 'user',   cat: 'user',    sev: 'warn',   action: 'Tambah user baru',        target: 'Akun: intan@althea.id (role Marketing)',  meta: 'Hak akses: View Terbatas · invite WA terkirim',                            ip: '203.78.14.91',device: 'Chrome · Windows' },
  { id: 'e029', t: '11:30', date: '03 Mei 2026', actor: 'Sinta',  role: 'Admin',       ic: 'x',      cat: 'jadwal',  sev: 'warn',   action: 'Pembatalan sesi',         target: 'Klien Eka P. · Konseling Pasangan',       meta: 'Alasan: klien sakit · refund DP diproses manual',                          ip: '10.10.20.4',  device: 'Chrome · macOS' },
  { id: 'e028', t: '10:15', date: '03 Mei 2026', actor: 'Sistem', role: 'Otomatis',    ic: 'wa',     cat: 'notif',   sev: 'ok',     action: 'Konfirmasi booking WA',   target: 'Klien Citra A.',                          meta: 'Template "Konfirmasi Booking" · status: terbaca',                          ip: '—',           device: 'cron worker' },
  { id: 'e027', t: '09:48', date: '03 Mei 2026', actor: 'Sinta',  role: 'Admin',       ic: 'edit',   cat: 'klien',   sev: 'danger', action: 'Ubah data sensitif klien',target: 'Klien Indra K. · no. WA & alamat',         meta: 'Lihat sebelum/sesudah →',                                                  ip: '10.10.20.4',  device: 'Chrome · macOS' },
  { id: 'e026', t: '09:20', date: '03 Mei 2026', actor: 'Sinta',  role: 'Admin',       ic: 'logout', cat: 'auth',    sev: 'info',   action: 'Login berhasil',          target: 'Sesi #s-9202',                            meta: '2FA OTP terverifikasi',                                                    ip: '10.10.20.4',  device: 'Chrome · macOS' },
];

const ROLE_COLOR = {
  'Admin':       '#5b8a66',
  'Psikolog':    '#7a8556',
  'Owner':       '#1f3a3a',
  'Resepsionis': '#4a7090',
  'Marketing':   '#8a6a3a',
  'Otomatis':    '#9a8c7a',
  '—':           '#9a8c7a',
};

function StatTile({ lbl, val, sub, tone }) {
  const tones = {
    base:   { bg: 'var(--bg-elev)',     fg: 'var(--teal-800)' },
    warn:   { bg: '#fff8ee',            fg: '#8a4a00' },
    danger: { bg: 'var(--danger-soft)', fg: 'var(--danger)' },
  };
  const t = tones[tone || 'base'];
  return (
    <div className="card-flat" style={{ padding: 14, background: t.bg }}>
      <div className="caption" style={{ marginBottom: 6 }}>{lbl}</div>
      <div className="row gap-2" style={{ alignItems: 'baseline' }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 500, color: t.fg }}>{val}</span>
        <span className="caption">{sub}</span>
      </div>
    </div>
  );
}

function AdminAuditLog() {
  const [cat, setCat] = React.useState('all');
  const [selectedId, setSelectedId] = React.useState('e040'); // start with the sensitive event
  const filtered = cat === 'all' ? AUDIT_LOG : AUDIT_LOG.filter(e => e.cat === cat);
  const selected = AUDIT_LOG.find(e => e.id === selectedId) || filtered[0];

  return (
    <AdminShell
      role="admin"
      active="audit"
      breadcrumb="Sistem · Audit Log"
      title="Audit Log"
    >
      {/* Action bar */}
      <div style={{ padding: '18px 28px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="row gap-3">
          <div className="row gap-2" style={{ background: 'var(--sage-50)', border: '1px solid var(--sage-200)', borderRadius: 999, padding: '6px 14px' }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--sage-500)', boxShadow: '0 0 0 4px rgba(91,138,102,0.18)' }} />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--sage-700)' }}>Audit aktif · retensi 12 bulan</span>
          </div>
          <span className="caption">247 event · 03 Mei 2026 (hari ini)</span>
        </div>
        <div className="row gap-2">
          <div style={{ position: 'relative', width: 240 }}>
            <span style={{ position: 'absolute', left: 11, top: 9 }}><Icon name="search" size={14} stroke="var(--fg-muted)" /></span>
            <input className="input" placeholder="Cari user, target, atau aksi…" style={{ paddingLeft: 32, height: 34, fontSize: 13 }} />
          </div>
          <button className="btn btn-outline btn-sm"><Icon name="filter" size={13} /> Rentang waktu</button>
          <button className="btn btn-outline btn-sm"><Icon name="arrowR" size={13} /> Ekspor CSV</button>
        </div>
      </div>

      {/* Stat tiles */}
      <div style={{ padding: '0 28px 16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <StatTile lbl="Event hari ini"        val="247" sub="↑ 18% vs kemarin" />
        <StatTile lbl="Akses ditolak (BR-04)" val="3"   sub="psikolog × klien lain" tone="danger" />
        <StatTile lbl="Login gagal"           val="2"   sub="1 akun terkunci 15′"    tone="warn" />
        <StatTile lbl="Perubahan data klien"  val="14"  sub="6 user aktif" />
      </div>

      {/* Main grid: kategori sidebar · timeline · detail panel */}
      <div style={{ flex: 1, minHeight: 0, padding: '0 28px 28px', display: 'grid', gridTemplateColumns: '210px 1fr 360px', gap: 16 }}>

        {/* Kategori filter */}
        <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="row" style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between' }}>
            <span className="eyebrow">Kategori</span>
          </div>
          <div className="col" style={{ padding: 6, gap: 1, overflowY: 'auto' }}>
            {AUDIT_CATS.map(c => {
              const isSel = c.k === cat;
              return (
                <div key={c.k} onClick={() => setCat(c.k)}
                  className={'nav-item ' + (isSel ? 'active' : '')}
                  style={{ cursor: 'pointer', justifyContent: 'space-between', padding: '8px 10px' }}>
                  <span className="row gap-2" style={{ alignItems: 'center', minWidth: 0 }}>
                    {c.ic ? <Icon name={c.ic} size={14} /> : <span style={{ width: 14, height: 14, borderRadius: 4, background: 'var(--cream-200)' }} />}
                    <span style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.label}</span>
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontVariantNumeric: 'tabular-nums' }}>{c.count}</span>
                </div>
              );
            })}
          </div>
          <div style={{ padding: 12, borderTop: '1px solid var(--border)', background: 'var(--cream-100)' }}>
            <div className="caption" style={{ marginBottom: 4, fontWeight: 600, color: 'var(--teal-800)' }}>Tip</div>
            <div className="caption" style={{ fontSize: 11.5, lineHeight: 1.45 }}>Event "Akses ditolak" menandai pelanggaran BR-04 (psikolog × data klien lain). Tinjau secara berkala.</div>
          </div>
        </div>

        {/* Timeline / table */}
        <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="row" style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between' }}>
            <h2 className="h2" style={{ margin: 0 }}>Aktivitas {cat === 'all' ? 'semua kategori' : '· ' + AUDIT_CATS.find(c => c.k === cat).label.toLowerCase()}</h2>
            <span className="caption">{filtered.length} event · diurutkan terbaru</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {/* Date divider */}
            <div className="row" style={{ padding: '10px 18px', background: 'var(--cream-100)', borderBottom: '1px solid var(--border)' }}>
              <span className="eyebrow">Hari ini · Jumat, 03 Mei 2026</span>
            </div>
            {filtered.map((e, i) => {
              const sev = SEV[e.sev];
              const isSel = e.id === (selected && selected.id);
              const isAuto = e.role === 'Otomatis' || e.role === '—';
              return (
                <div key={e.id} onClick={() => setSelectedId(e.id)}
                  className="row gap-3"
                  style={{
                    padding: '12px 18px',
                    borderBottom: i === filtered.length - 1 ? 'none' : '1px solid var(--border)',
                    alignItems: 'flex-start',
                    cursor: 'pointer',
                    background: isSel ? 'var(--sage-50)' : 'transparent',
                    borderLeft: isSel ? '3px solid var(--sage-500)' : '3px solid transparent',
                    paddingLeft: isSel ? 15 : 18,
                  }}>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--fg-muted)', fontVariantNumeric: 'tabular-nums', width: 38, flexShrink: 0, paddingTop: 2 }}>{e.t}</span>
                  <div style={{ width: 28, height: 28, borderRadius: 999, background: e.sev === 'danger' ? 'var(--danger-soft)' : e.sev === 'warn' ? 'var(--warning-soft)' : e.sev === 'ok' ? 'var(--success-soft)' : 'var(--sage-100)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <Icon name={e.ic} size={13} stroke={e.sev === 'danger' ? 'var(--danger)' : e.sev === 'warn' ? '#8a4a00' : e.sev === 'ok' ? 'var(--success)' : 'var(--sage-700)'} />
                  </div>
                  <div className="col grow" style={{ minWidth: 0, gap: 3 }}>
                    <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>{e.action}</span>
                      <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>· {e.target}</span>
                    </div>
                    <span className="caption" style={{ fontSize: 11.5 }}>{e.meta}</span>
                  </div>
                  <div className="col" style={{ alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                    <span className={'badge ' + sev.cls} style={{ height: 18, fontSize: 10, textTransform: 'capitalize' }}>{sev.label}</span>
                    {!isAuto ? (
                      <div className="row gap-1" style={{ alignItems: 'center' }}>
                        <Avatar name={e.actor} color={ROLE_COLOR[e.role]} size="sm" />
                        <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{e.actor}</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontStyle: 'italic' }}>sistem</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="row" style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between' }}>
            <h2 className="h2" style={{ margin: 0 }}>Detail event</h2>
            <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono, monospace)' }}>#{selected.id}</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 18 }}>
            {/* Header */}
            <div className="col gap-2" style={{ marginBottom: 16 }}>
              <span className={'badge ' + SEV[selected.sev].cls} style={{ alignSelf: 'flex-start', textTransform: 'capitalize' }}>{SEV[selected.sev].label}</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--teal-800)', lineHeight: 1.35 }}>{selected.action}</span>
              <span className="caption" style={{ lineHeight: 1.45 }}>{selected.target}</span>
            </div>

            {/* Actor */}
            <div className="row gap-2" style={{ padding: 12, background: 'var(--cream-100)', borderRadius: 8, marginBottom: 14, alignItems: 'center' }}>
              <Avatar name={selected.actor === 'Sistem' || selected.actor === 'unknown' ? '?' : selected.actor} color={ROLE_COLOR[selected.role]} size="md" />
              <div className="col" style={{ minWidth: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>{selected.actor}</span>
                <span style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>Role: {selected.role}</span>
              </div>
            </div>

            {/* Properties */}
            <div className="col" style={{ gap: 0 }}>
              {[
                ['Waktu',     selected.date + ' · ' + selected.t + ' WIB'],
                ['Kategori',  AUDIT_CATS.find(c => c.k === selected.cat).label],
                ['IP',        selected.ip],
                ['Perangkat', selected.device],
                ['Catatan',   selected.meta],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: '10px 0', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '90px 1fr', gap: 10 }}>
                  <span className="caption" style={{ paddingTop: 1 }}>{k}</span>
                  <span style={{ fontSize: 12.5, color: 'var(--teal-800)', lineHeight: 1.45, fontFamily: k === 'IP' ? 'var(--font-mono, monospace)' : 'inherit' }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Diff preview — shown when payload includes before/after */}
            {selected.id === 'e027' && (
              <div className="col gap-2" style={{ marginTop: 16 }}>
                <span className="eyebrow">Perubahan data</span>
                <div style={{ padding: 10, background: 'var(--danger-soft)', border: '1px solid #e6c8c0', borderRadius: 6, fontSize: 12, fontFamily: 'var(--font-mono, monospace)', color: '#7a3328' }}>
                  <div>− no_wa: <span style={{ textDecoration: 'line-through', opacity: .8 }}>+62 813 9988 7766</span></div>
                  <div>− alamat: <span style={{ textDecoration: 'line-through', opacity: .8 }}>Jl. Ijen No. 14, Malang</span></div>
                </div>
                <div style={{ padding: 10, background: 'var(--success-soft)', border: '1px solid #c8e0ce', borderRadius: 6, fontSize: 12, fontFamily: 'var(--font-mono, monospace)', color: '#2e5a37' }}>
                  <div>+ no_wa: +62 821 4455 1188</div>
                  <div>+ alamat: Jl. Bandung No. 7, Malang</div>
                </div>
              </div>
            )}

            {/* BR-04 enforcement note */}
            {selected.id === 'e040' && (
              <div className="col gap-1" style={{ marginTop: 16, padding: 12, background: 'var(--danger-soft)', border: '1px solid #e6c8c0', borderRadius: 8 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: '#7a3328' }}>BR-04 · Privasi antar psikolog</span>
                <span className="caption" style={{ color: '#7a3328', fontSize: 11.5, lineHeight: 1.45 }}>Akses ke data klien yang bukan miliknya diblokir oleh sistem. Event ini tercatat untuk audit dan tidak memerlukan tindakan kecuali pola berulang.</span>
              </div>
            )}

            {/* Actions */}
            <div className="row gap-2" style={{ marginTop: 18 }}>
              <button className="btn btn-outline btn-sm" style={{ flex: 1 }}><Icon name="eye" size={13} /> Lihat sumber</button>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}><Icon name="arrowR" size={13} /> Ekspor</button>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

window.AdminAuditLog = AdminAuditLog;
