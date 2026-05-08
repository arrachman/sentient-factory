// Mobile · Admin views — penjadwalan, klien, ruangan, notif WA in iPhone width.
// Uses a shared MobileAdminShell (header + bottom tabbar) for consistency.

function MobileAdminShell({ title, subtitle, active = 'schedule', children, fab }) {
  const tabs = [
    ['schedule', 'cal', 'Jadwal'],
    ['clients', 'users', 'Klien'],
    ['rooms', 'door', 'Ruangan'],
    ['notif', 'wa', 'WA'],
    ['more', 'more', 'Lainnya'],
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <header style={{ padding: '12px 16px 14px', background: 'var(--bg-elev)', borderBottom: '1px solid var(--border)' }}>
        <div className="row gap-2" style={{ marginBottom: subtitle ? 6 : 0 }}>
          <Avatar name="Sinta" color="#5b8a66" size="sm" />
          <div className="col grow">
            <span className="caption" style={{ fontSize: 10.5 }}>Sinta · Admin</span>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--teal-800)' }}>{title}</span>
          </div>
          <button className="btn btn-icon btn-ghost btn-sm"><Icon name="search" size={16} /></button>
          <button className="btn btn-icon btn-ghost btn-sm"><Icon name="bell" size={16} /></button>
        </div>
        {subtitle && <span className="caption">{subtitle}</span>}
      </header>
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {children}
        {fab && (
          <button style={{
            position: 'sticky', bottom: 16, marginLeft: 'auto', marginRight: 16, marginBottom: 16,
            display: 'flex', float: 'right', clear: 'both',
            width: 52, height: 52, borderRadius: 999, border: 'none', cursor: 'pointer',
            background: 'var(--sage-500)', color: '#fff',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
          }}>{fab}</button>
        )}
      </div>
      <nav className="tabbar">
        {tabs.map(([k, ic, lbl]) => (
          <div key={k} className={'tab ' + (active === k ? 'active' : '')}>
            <Icon name={ic} size={18} /> {lbl}
          </div>
        ))}
      </nav>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Mobile Admin · Penjadwalan
// ────────────────────────────────────────────────────────────
function MobileAdminSchedule() {
  const today = [
    { time: '09.00', client: 'Rina A.', psy: 'Vina', room: 'K2', status: 'done' },
    { time: '09.30', client: 'Andi K.', psy: 'Sari', room: 'K1', status: 'done' },
    { time: '10.30', client: 'Bayu S.', psy: 'Vina', room: 'K2', status: 'now' },
    { time: '11.00', client: 'Lila R.', psy: 'Sari', room: 'K3', status: 'now' },
    { time: '13.00', client: 'Dito P.', psy: 'Vina', room: 'K1', status: 'next' },
    { time: '14.00', client: 'Tina H.', psy: 'Mira', room: 'K3', status: 'next' },
    { time: '15.00', client: 'Maya & Hadi', psy: 'Vina', room: 'K4', status: 'next' },
    { time: '16.00', client: 'Sari W.', psy: 'Diah', room: 'KA', status: 'next' },
  ];
  return (
    <MobileAdminShell title="Penjadwalan" subtitle="Senin, 20 Mei · 4 psikolog aktif" active="schedule"
      fab={<Icon name="plus" size={22} stroke="#fff" sw={2.5} />}>
      <div style={{ padding: '12px 16px 100px' }}>
        {/* Day strip */}
        <div className="row gap-2" style={{ overflowX: 'auto', paddingBottom: 8, marginBottom: 12 }}>
          {[['Sn','20','today'], ['Sl','21'], ['Rb','22'], ['Km','23'], ['Jm','24'], ['Sb','25']].map(([d, n, t], i) => {
            const sel = i === 0;
            return (
              <div key={n} style={{ minWidth: 52, padding: '10px 0', textAlign: 'center', borderRadius: 10,
                background: sel ? 'var(--sage-500)' : 'var(--bg-elev)',
                color: sel ? '#fff' : 'var(--teal-800)',
                border: '1px solid ' + (sel ? 'var(--sage-500)' : 'var(--border)'),
                fontWeight: 600, fontSize: 12,
              }}>
                <div style={{ fontSize: 10, opacity: 0.85, marginBottom: 2 }}>{d}</div>
                <div style={{ fontSize: 16, fontFamily: 'var(--font-serif)' }}>{n}</div>
              </div>
            );
          })}
        </div>

        {/* Stat strip */}
        <div className="row gap-2" style={{ marginBottom: 14 }}>
          {[['28', 'sesi'], ['4', 'psikolog'], ['83%', 'isi']].map(([n, l]) => (
            <div key={l} className="card-flat" style={{ flex: 1, padding: 10, textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 600, color: 'var(--teal-800)' }}>{n}</div>
              <span className="caption" style={{ fontSize: 10.5 }}>{l}</span>
            </div>
          ))}
        </div>

        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
          <span className="eyebrow">Sesi hari ini</span>
          <button className="btn btn-ghost btn-sm" style={{ height: 24, padding: '0 8px', fontSize: 11, color: 'var(--sage-700)' }}><Icon name="filter" size={11} /> Filter</button>
        </div>

        <div className="col gap-2">
          {today.map((s, i) => {
            const tone = s.status === 'now' ? 'sage' : s.status === 'done' ? 'cream' : 'teal';
            const isNow = s.status === 'now';
            return (
              <div key={i} className="card" style={{
                padding: 12, display: 'flex', gap: 10,
                background: isNow ? 'var(--sage-50)' : 'var(--bg-elev)',
                border: '1px solid ' + (isNow ? 'var(--sage-300)' : 'var(--border)'),
                opacity: s.status === 'done' ? 0.62 : 1,
              }}>
                <div className="col" style={{ width: 46 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--teal-800)' }}>{s.time}</span>
                </div>
                <div style={{ width: 3, background: tone === 'sage' ? 'var(--sage-500)' : tone === 'cream' ? 'var(--cream-300)' : 'var(--teal-700)', borderRadius: 2 }} />
                <div className="col grow">
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--teal-800)' }}>{s.client}</span>
                  <span className="caption" style={{ fontSize: 11, marginTop: 1 }}>{s.psy} · {s.room}</span>
                </div>
                {isNow && <span className="badge badge-sage" style={{ height: 20, alignSelf: 'flex-start' }}>● now</span>}
                {s.status === 'done' && <Icon name="check" size={14} stroke="var(--fg-muted)" sw={2.4} />}
              </div>
            );
          })}
        </div>
      </div>
    </MobileAdminShell>
  );
}

// ────────────────────────────────────────────────────────────
// Mobile Admin · Klien (list)
// ────────────────────────────────────────────────────────────
function MobileAdminClients() {
  const list = [
    ['Rina Andreyani', 'RA', 'Dewasa', 'Sesi 3/4', '21 Mei · Vina', 'aktif', 'sage'],
    ['Bayu Saputra', 'BS', 'Dewasa', 'Sesi 1/4', '21 Mei · Vina', 'baru', 'teal'],
    ['Lila Ramadhani', 'LR', 'Remaja', 'Sesi 2/4', '22 Mei · Sari', 'aktif', 'sage'],
    ['Maya & Hadi', 'MH', 'Pasangan', 'Sesi 1/6', '21 Mei · Vina', 'aktif', 'sage'],
    ['Dito Pranata', 'DP', 'Dewasa', 'Sesi 2/4', '21 Mei · Vina', 'aktif', 'sage'],
    ['Tina Hapsari', 'TH', 'Dewasa', 'Sesi 1/4', '23 Mei · Mira', 'baru', 'teal'],
    ['Sari Wulandari', 'SW', 'Dewasa', 'Selesai', 'paket habis', 'selesai', 'cream'],
    ['Doni Pratama', 'DnP', 'Dewasa', 'Sesi 4/4', '24 Mei · Diah', 'aktif', 'sage'],
  ];
  return (
    <MobileAdminShell title="Klien" subtitle="42 total · 28 aktif" active="clients"
      fab={<Icon name="plus" size={22} stroke="#fff" sw={2.5} />}>
      <div style={{ padding: '12px 16px 100px' }}>
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <span style={{ position: 'absolute', left: 11, top: 11 }}><Icon name="search" size={14} stroke="var(--fg-muted)" /></span>
          <input className="input" placeholder="Cari nama klien…" style={{ paddingLeft: 32, height: 38, fontSize: 13 }} />
        </div>

        <div className="row gap-2" style={{ overflowX: 'auto', paddingBottom: 6, marginBottom: 12 }}>
          {[['Semua', 42, true], ['Aktif', 28, false], ['Baru', 5, false], ['Selesai', 9, false]].map(([t, n, sel]) => (
            <button key={t} className="btn btn-sm" style={{
              height: 30, padding: '0 12px', fontSize: 12,
              background: sel ? 'var(--sage-500)' : 'var(--bg-elev)',
              color: sel ? '#fff' : 'var(--teal-800)',
              border: '1px solid ' + (sel ? 'var(--sage-500)' : 'var(--border)'),
              flexShrink: 0,
            }}>{t} <span style={{ marginLeft: 4, opacity: 0.8 }}>{n}</span></button>
          ))}
        </div>

        <div className="col gap-2">
          {list.map(([name, ini, kat, sesi, next, st, tone], i) => (
            <div key={i} className="card" style={{ padding: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 38, height: 38, borderRadius: 999, background: 'var(--sage-200)', color: 'var(--sage-800)', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{ini}</div>
              <div className="col grow" style={{ minWidth: 0 }}>
                <div className="row gap-2" style={{ alignItems: 'center' }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--teal-800)' }}>{name}</span>
                  <span className="badge" style={{
                    background: tone === 'sage' ? 'var(--sage-100)' : tone === 'teal' ? 'var(--teal-700)' : 'var(--cream-200)',
                    color: tone === 'sage' ? 'var(--sage-800)' : tone === 'teal' ? '#fff' : 'var(--fg-muted)',
                    height: 18, fontSize: 9.5,
                  }}>{st}</span>
                </div>
                <span className="caption" style={{ fontSize: 11, marginTop: 1 }}>{kat} · {sesi}</span>
                <span className="caption" style={{ fontSize: 10.5, marginTop: 2, color: 'var(--sage-700)' }}>→ {next}</span>
              </div>
              <Icon name="chevR" size={15} stroke="var(--fg-muted)" />
            </div>
          ))}
        </div>
      </div>
    </MobileAdminShell>
  );
}

// ────────────────────────────────────────────────────────────
// Mobile Admin · Ruangan (status)
// ────────────────────────────────────────────────────────────
function MobileAdminRooms() {
  const rooms = [
    ['Sky Room',    'SK', 'Lt. 2 · 2 orang', 'Mira W. · Tina H.', '14.00 – 15.00', 'occupied'],
    ['Sage Room',   'SG', 'Lt. 2 · 2 orang', 'Vina P. · Bayu S.', '10.30 – 11.30', 'occupied'],
    ['Forest Room', 'FR', 'Lt. 2 · 2 orang', 'Sari L. · Lila R.', '11.00 – 12.00', 'occupied'],
    ['Sunset Room', 'SU', 'Lt. 2 · 4 orang', 'Tersedia', 'sesi berikutnya 15.00', 'free'],
    ['Konseling Anak', 'KA', 'Lt. 1 · play area', 'Diah S. · Lala A.', '13.00 – 14.00', 'occupied'],
    ['Tes Psikologi', 'TP', 'Lt. 1 · 1 orang', 'Tersedia', 'tidak ada booking', 'free'],
    ['Seminar', 'S1', 'Lt. 1 · 30 orang', 'Tersedia', 'belum ada booking', 'free'],
  ];
  return (
    <MobileAdminShell title="Ruangan" subtitle="11 ruangan · 4 sedang dipakai" active="rooms">
      <div style={{ padding: '12px 16px 24px' }}>
        <div className="row gap-2" style={{ marginBottom: 14 }}>
          {[['4', 'dipakai', 'sage'], ['7', 'kosong', 'cream']].map(([n, l, c]) => (
            <div key={l} className="card-flat" style={{ flex: 1, padding: 10, textAlign: 'center', background: c === 'sage' ? 'var(--sage-50)' : 'var(--bg-elev)' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 600, color: 'var(--teal-800)' }}>{n}</div>
              <span className="caption" style={{ fontSize: 10.5 }}>{l}</span>
            </div>
          ))}
        </div>

        <span className="eyebrow" style={{ marginBottom: 8 }}>Status sekarang · 10.45</span>
        <div className="col gap-2">
          {rooms.map(([name, ini, meta, who, when, st], i) => {
            const c = st === 'occupied' ? { bg: 'var(--sage-100)', col: 'var(--sage-800)', dot: 'var(--sage-500)', lbl: 'dipakai' }
                   : { bg: 'var(--cream-100)', col: 'var(--fg-muted)', dot: 'var(--cream-300)', lbl: 'kosong' };
            return (
              <div key={i} className="card" style={{ padding: 12, display: 'flex', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, background: c.bg, color: c.col, display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: 12, fontFamily: 'var(--font-serif)', flexShrink: 0 }}>{ini}</div>
                <div className="col grow" style={{ minWidth: 0 }}>
                  <div className="row gap-2">
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--teal-800)' }}>{name}</span>
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: c.dot, alignSelf: 'center' }} />
                    <span className="caption" style={{ fontSize: 10.5, color: c.col, fontWeight: 600 }}>{c.lbl}</span>
                  </div>
                  <span className="caption" style={{ fontSize: 10.5, marginTop: 1 }}>{meta}</span>
                  <span style={{ fontSize: 12, color: 'var(--fg)', marginTop: 4 }}>{who}</span>
                  <span className="caption" style={{ fontSize: 10.5, marginTop: 1 }}>{when}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MobileAdminShell>
  );
}

// ────────────────────────────────────────────────────────────
// Mobile Admin · Notifikasi WA (log)
// ────────────────────────────────────────────────────────────
function MobileAdminNotifWA() {
  const log = [
    ['10.32', 'Pengingat H-1', 'Rina A.', 'sent'],
    ['10.30', 'Pengingat H-1', 'Bayu S.', 'sent'],
    ['10.28', 'Pengingat H-1', 'Lila R.', 'sent'],
    ['09.45', 'Konfirmasi booking', 'Tina H.', 'sent'],
    ['09.20', 'Selamat datang', 'Andi K.', 'sent'],
    ['08.10', 'Pengingat H-1', 'Doni P.', 'failed'],
    ['07.30', 'Feedback paket', 'Sari W.', 'read'],
  ];
  return (
    <MobileAdminShell title="Notifikasi WhatsApp" subtitle="142 terkirim · 1 gagal hari ini" active="notif">
      <div style={{ padding: '12px 16px 24px' }}>
        <div className="row gap-2" style={{ marginBottom: 14 }}>
          {[['142', 'sent', 'sage'], ['98', 'read', 'teal'], ['1', 'failed', 'warn']].map(([n, l, c]) => (
            <div key={l} className="card-flat" style={{ flex: 1, padding: 10, textAlign: 'center', background: c === 'warn' ? 'var(--warn-soft)' : 'var(--bg-elev)' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 600, color: 'var(--teal-800)' }}>{n}</div>
              <span className="caption" style={{ fontSize: 10.5 }}>{l}</span>
            </div>
          ))}
        </div>

        <span className="eyebrow" style={{ marginBottom: 8 }}>Template aktif</span>
        <div className="col gap-2" style={{ marginBottom: 18 }}>
          {[
            ['Pengingat H-1', '14 dijadwal hari ini', true],
            ['Konfirmasi booking', 'otomatis', true],
            ['Feedback selesai paket', 'otomatis', true],
            ['Selamat datang', 'otomatis', false],
          ].map(([n, sub, on], i) => (
            <div key={i} className="card-flat" style={{ padding: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: on ? 'var(--sage-100)' : 'var(--cream-100)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icon name="wa" size={14} stroke={on ? 'var(--sage-700)' : 'var(--fg-muted)'} />
              </div>
              <div className="col grow">
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>{n}</span>
                <span className="caption" style={{ fontSize: 10.5 }}>{sub}</span>
              </div>
              <div style={{ width: 30, height: 17, borderRadius: 999, background: on ? 'var(--sage-500)' : 'var(--cream-200)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 2, left: on ? 15 : 2, width: 13, height: 13, borderRadius: 999, background: '#fff', transition: 'left 0.2s' }} />
              </div>
            </div>
          ))}
        </div>

        <span className="eyebrow" style={{ marginBottom: 8 }}>Log hari ini</span>
        <div className="col gap-1">
          {log.map(([t, tpl, who, st], i) => (
            <div key={i} className="row gap-3" style={{ padding: '10px 4px', borderTop: i ? '1px solid var(--border)' : 'none', alignItems: 'center' }}>
              <span className="caption" style={{ fontSize: 11, fontVariantNumeric: 'tabular-nums', width: 38 }}>{t}</span>
              <div className="col grow">
                <span style={{ fontSize: 12.5, color: 'var(--fg)', fontWeight: 500 }}>{tpl}</span>
                <span className="caption" style={{ fontSize: 10.5 }}>→ {who}</span>
              </div>
              <span className="badge" style={{
                background: st === 'sent' ? 'var(--sage-100)' : st === 'read' ? 'var(--teal-50, var(--sage-50))' : 'var(--warn-soft)',
                color: st === 'sent' ? 'var(--sage-800)' : st === 'read' ? 'var(--teal-700)' : '#7a5a1f',
                height: 18, fontSize: 9.5,
              }}>
                {st === 'sent' ? '✓ terkirim' : st === 'read' ? '✓✓ dibaca' : '✗ gagal'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </MobileAdminShell>
  );
}

Object.assign(window, { MobileAdminShell, MobileAdminSchedule, MobileAdminClients, MobileAdminRooms, MobileAdminNotifWA });
