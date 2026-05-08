// Role-specific dashboards: Owner, Resepsionis, Marketing.
// PRD US-O01 (Owner: ringkasan jadwal seluruh psikolog & ruangan)
// PRD US-O02 (Resepsionis: daftar klien yang datang hari ini + psikolog & ruangan)
// PRD § 3 Marketing: lihat data layanan & kapasitas

// Custom shell for non-admin/psikolog roles — kept minimal, view-only.
function RoleShell({ role, name, initial, color, breadcrumb, title, subtitle, children }) {
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

        <div className="row gap-2" style={{ padding: '6px 10px', background: color + '15', borderRadius: 8, border: '1px solid ' + color + '44' }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: color }} />
          <span style={{ fontSize: 11, fontWeight: 600, color, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{role} · view only</span>
        </div>

        <div className="col gap-1">
          <div className="eyebrow" style={{ padding: '4px 10px' }}>Hari ini</div>
          <div className="nav-item active"><Icon name="home" size={17} /> <span>Dashboard</span></div>
        </div>

        <div className="row gap-2" style={{ padding: '6px 10px', background: 'var(--info-soft)', borderRadius: 8, marginTop: 6 }}>
          <Icon name="bell" size={12} stroke="var(--info)" />
          <span style={{ fontSize: 10.5, color: '#2c4a60', lineHeight: 1.4 }}>Akses terbatas. Hubungi admin untuk perubahan data.</span>
        </div>

        <div style={{ marginTop: 'auto', padding: 12, background: 'var(--cream-100)', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: 999, background: color + '22', color, display: 'grid', placeItems: 'center', fontWeight: 600 }}>{initial}</div>
          <div className="col" style={{ minWidth: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>{name}</span>
            <span style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>{role}</span>
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
            <button className="btn btn-icon btn-ghost"><Icon name="bell" size={17} /></button>
            <div style={{ width: 36, height: 36, borderRadius: 999, background: color + '22', color, display: 'grid', placeItems: 'center', fontWeight: 600 }}>{initial}</div>
          </div>
        </header>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </main>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Owner — high-level overview, all psikolog & rooms snapshot.
// ────────────────────────────────────────────────────────────
function OwnerDashboard() {
  return (
    <RoleShell role="Owner" name="Adhy Pratama" initial="AP" color="#1f3a3a"
      breadcrumb="Owner · Ringkasan klinik"
      title="Ringkasan Operasional · Senin, 04 Mei 2026">
      <div style={{ flex: 1, padding: 28, overflow: 'auto' }}>
        {/* Top stats — KPI klinik */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
          {[
            ['Sesi hari ini',     '28', '↑ 12% vs minggu lalu'],
            ['Utilisasi psikolog','71%', '7 psikolog · rata-rata'],
            ['Utilisasi ruangan', '73%', '8 dari 11 ruangan terpakai'],
            ['Revenue bulan ini', 'Rp 87 jt', '↑ 8% target tercapai'],
          ].map(([lbl, val, sub]) => (
            <div key={lbl} className="card" style={{ padding: 18 }}>
              <span className="caption">{lbl}</span>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 500, color: 'var(--teal-800)', marginTop: 4 }}>{val}</div>
              <span className="caption" style={{ marginTop: 4, color: 'var(--sage-700)', fontSize: 11 }}>{sub}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* Psikolog overview */}
          <div className="card" style={{ padding: 20 }}>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: 19, fontWeight: 500, color: 'var(--teal-800)' }}>Performa psikolog · hari ini</h2>
              <span className="caption">7 psikolog aktif</span>
            </div>
            <div className="col gap-2">
              {[
                ['Vina P.',   'Klinis Dewasa',     '#5b8a66', 4, 4, 12],
                ['Diah A.',   'Anak & Remaja',     '#c97a5d', 4, 4, 18],
                ['Rina H.',   'Pasangan & Keluarga','#6f8aa3', 2, 4, 9],
                ['Bagus W.',  'Klinis Dewasa',     '#9c7c3c', 3, 4, 14],
                ['Sari L.',   'Anak',              '#b3493b', 3, 4, 16],
                ['Tomi P.',   'Tes Psikologi',     '#4a7090', 4, 4, 24],
                ['Mira A.',   'Keluarga',          '#467053', 1, 4, 7],
              ].map(([name, spec, color, today, max, total]) => {
                const pct = (today / max) * 100;
                return (
                  <div key={name} className="row gap-3" style={{ padding: '10px 12px', background: 'var(--cream-50)', borderRadius: 8, alignItems: 'center' }}>
                    <Avatar name={name} color={color} size="sm" />
                    <div className="col grow" style={{ minWidth: 0 }}>
                      <div className="row" style={{ justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>{name}</span>
                        <span style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums', color: 'var(--fg-muted)' }}>{today}/{max} hari ini · {total} klien aktif</span>
                      </div>
                      <div style={{ height: 4, background: 'var(--cream-200)', borderRadius: 999, marginTop: 5, overflow: 'hidden' }}>
                        <div style={{ width: pct + '%', height: '100%', background: pct === 100 ? 'var(--danger)' : color }} />
                      </div>
                      <span className="caption" style={{ fontSize: 10.5, marginTop: 3 }}>{spec}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trend chart sederhana */}
          <div className="col gap-3">
            <div className="card" style={{ padding: 20 }}>
              <h2 style={{ margin: '0 0 14px', fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 500, color: 'var(--teal-800)' }}>Sesi 7 hari terakhir</h2>
              <div className="row" style={{ alignItems: 'flex-end', gap: 8, height: 120 }}>
                {[22, 28, 24, 30, 26, 28, 28].map((v, i) => {
                  const max = 32;
                  const isToday = i === 6;
                  return (
                    <div key={i} className="col grow" style={{ alignItems: 'center', gap: 4 }}>
                      <div style={{ width: '100%', height: (v / max) * 100, background: isToday ? 'var(--sage-500)' : 'var(--sage-200)', borderRadius: 4 }} />
                      <span className="caption" style={{ fontSize: 10 }}>{['Sn','Sl','Rb','Km','Jm','Sb','Mg'][i]}</span>
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--teal-800)' }}>{v}</span>
                    </div>
                  );
                })}
              </div>
              <div className="row" style={{ marginTop: 12, justifyContent: 'space-between' }}>
                <span className="caption">Total · 186 sesi</span>
                <span className="caption" style={{ color: 'var(--sage-700)', fontWeight: 600 }}>+9% vs minggu lalu</span>
              </div>
            </div>
            <div className="card" style={{ padding: 16, background: 'var(--info-soft)', borderColor: '#cfdde8' }}>
              <span className="eyebrow" style={{ color: '#2c4a60' }}>Catatan owner</span>
              <p style={{ fontSize: 12.5, color: '#2c4a60', margin: '6px 0 0', lineHeight: 1.5 }}>
                Mira A. underutilized (25% kapasitas). Pertimbangkan penambahan klien Keluarga atau marketing khusus.
              </p>
            </div>
          </div>
        </div>

        {/* Ruangan & layanan */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div className="card" style={{ padding: 20 }}>
            <h2 style={{ margin: '0 0 14px', fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 500, color: 'var(--teal-800)' }}>Utilisasi ruangan</h2>
            <div className="col gap-2">
              {[
                ['Sky / Sage / Forest / Sunset', 4, 6, '#5b8a66'],
                ['Mint Room', 3, 6, '#5b8a66'],
                ['Terapi Anak 1–3', 3, 6, '#c97a5d'],
                ['Playground', 1, 6, '#c97a5d'],
                ['Tes Psikologi', 4, 6, '#9c7c3c'],
                ['Seminar', 1, 6, '#4a7090'],
              ].map(([n, used, max, color]) => {
                const pct = (used / max) * 100;
                return (
                  <div key={n} className="row gap-3" style={{ alignItems: 'center' }}>
                    <span style={{ fontSize: 12.5, color: 'var(--fg)', flex: 1 }}>{n}</span>
                    <div style={{ flex: 2, height: 6, background: 'var(--cream-200)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: pct + '%', height: '100%', background: color }} />
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontVariantNumeric: 'tabular-nums', width: 50, textAlign: 'right' }}>{used}/{max} slot</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h2 style={{ margin: '0 0 14px', fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 500, color: 'var(--teal-800)' }}>Layanan terlaris bulan ini</h2>
            <div className="col gap-2">
              {[
                ['Tes MHCU', 32, 'tes'],
                ['Konseling Individu Dewasa', 24, 'konseling'],
                ['Konsultasi Hasil Tes', 22, 'tes'],
                ['Konseling Individu Anak', 18, 'anak'],
                ['Tes Bakat Minat', 16, 'tes'],
                ['Terapi Anak Lengkap', 14, 'anak'],
              ].map(([n, count, kind]) => (
                <div key={n} className="row" style={{ justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <div className="row gap-2"><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--svc-' + kind + ')' }} /><span style={{ fontSize: 12.5, color: 'var(--fg)' }}>{n}</span></div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)', fontVariantNumeric: 'tabular-nums' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pemakaian Ruangan — grid read-only (US-O01: ringkasan ruangan untuk Owner) */}
        <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="row" style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div className="col">
              <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 500, color: 'var(--teal-800)' }}>Pemakaian Ruangan · Slot × Ruangan</h2>
              <span className="caption" style={{ marginTop: 2 }}>Read-only · ringkasan untuk pencarian ruangan kosong. Edit penjadwalan dilakukan oleh admin.</span>
            </div>
            <RoomUsageLegend compact />
          </div>
          <RoomUsageGrid editable={false} compact />
        </div>
      </div>
    </RoleShell>
  );
}

// ────────────────────────────────────────────────────────────
// Resepsionis — klien yang datang hari ini (US-O02).
// View only · daftar klien dengan jam, psikolog, ruangan.
// ────────────────────────────────────────────────────────────
function ResepsionisDashboard() {
  const [filter, setFilter] = React.useState('all'); // all | upcoming | done | now
  const list = [
    { time: '08.30', client: 'Anita Wulandari',  psy: 'Vina',  room: 'Sky Room',     svc: 'Konseling Dewasa',    status: 'done', note: 'datang on-time' },
    { time: '08.30', client: 'Davi Pratama',     psy: 'Diah',  room: 'Terapi Anak 1', svc: 'Terapi Anak Lengkap · 6/10', status: 'done', note: 'didampingi ibu' },
    { time: '10.00', client: 'Eka Putri',        psy: 'Diah',  room: 'Tes Psikologi', svc: 'Tes Kesiapan Sekolah', status: 'now', note: 'sedang berlangsung' },
    { time: '10.00', client: 'Gita & Hadi',      psy: 'Rina',  room: 'Mint Room',    svc: 'Terapi Pasangan · 1/3', status: 'now', note: 'sedang berlangsung' },
    { time: '10.30', client: 'Bayu Saputra',     psy: 'Vina',  room: 'Sage Room',    svc: 'Konseling Dewasa',    status: 'arrived', note: 'menunggu di lobby · 5 menit' },
    { time: '12.00', client: 'Lina Permata',     psy: 'Sari',  room: 'Tes Psikologi', svc: 'Tes Tumbuh Kembang · 2/2', status: 'upcoming', note: '—' },
    { time: '13.00', client: 'Dito Pranata',     psy: 'Vina',  room: 'Sky Room',     svc: 'Konseling Dewasa',    status: 'upcoming', note: '—' },
    { time: '13.30', client: 'Nadia Pertiwi',    psy: 'Tomi',  room: 'Tes Psikologi', svc: 'Tes Bakat Minat',     status: 'upcoming', note: 'remaja, 17 thn' },
    { time: '15.15', client: 'Citra Anggraini',  psy: 'Vina',  room: 'Mint Room',    svc: 'Konseling Pasangan', status: 'upcoming', note: 'klien baru' },
    { time: '15.15', client: 'Maya Salsabila',   psy: 'Sari',  room: 'Terapi Anak 2', svc: 'Konseling Anak',     status: 'upcoming', note: 'klien baru' },
  ];
  const counts = {
    all: list.length,
    upcoming: list.filter(l => l.status === 'upcoming').length,
    now: list.filter(l => l.status === 'now' || l.status === 'arrived').length,
    done: list.filter(l => l.status === 'done').length,
  };
  const visible = filter === 'all' ? list : filter === 'now' ? list.filter(l => l.status === 'now' || l.status === 'arrived') : list.filter(l => l.status === filter);

  const STAT = {
    done:     { bg: 'var(--cream-200)',    fg: 'var(--fg-muted)', label: 'selesai', dot: 'var(--cream-300)' },
    now:      { bg: 'var(--sage-100)',     fg: 'var(--sage-700)', label: 'berlangsung', dot: 'var(--sage-500)' },
    arrived:  { bg: 'var(--warning-soft)', fg: '#8a4a00',         label: 'menunggu', dot: '#c98a00' },
    upcoming: { bg: 'var(--info-soft)',    fg: '#2c4a60',         label: 'akan datang', dot: '#4a7090' },
  };

  return (
    <RoleShell role="Resepsionis" name="Lina Resepsionis" initial="LR" color="#4a7090"
      breadcrumb="Resepsionis · Penerimaan klien"
      title="Klien Hari Ini · Senin, 04 Mei 2026">
      <div style={{ padding: '18px 28px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="row gap-1" style={{ background: 'var(--cream-100)', borderRadius: 8, padding: 3 }}>
          {[['all', 'Semua'], ['upcoming', 'Akan datang'], ['now', 'Sedang & menunggu'], ['done', 'Selesai']].map(([k, lbl]) => (
            <button key={k} onClick={() => setFilter(k)} className="btn btn-sm" style={{ height: 30, padding: '0 14px',
              background: filter === k ? 'var(--bg-elev)' : 'transparent',
              boxShadow: filter === k ? 'var(--shadow-xs)' : 'none',
              color: filter === k ? 'var(--teal-800)' : 'var(--fg-muted)',
              fontWeight: filter === k ? 600 : 500 }}>
              {lbl} <span style={{ marginLeft: 4, fontSize: 11, opacity: 0.7 }}>{counts[k]}</span>
            </button>
          ))}
        </div>
        <div className="row gap-2">
          <div style={{ position: 'relative', width: 240 }}>
            <span style={{ position: 'absolute', left: 11, top: 9 }}><Icon name="search" size={14} stroke="var(--fg-muted)" /></span>
            <input className="input" placeholder="Cari nama klien…" style={{ paddingLeft: 32, height: 34, fontSize: 13 }} />
          </div>
          <button className="btn btn-outline btn-sm"><Icon name="msg" size={14} /> Hubungi admin</button>
        </div>
      </div>

      {/* Stat strip */}
      <div style={{ padding: '0 28px 16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          ['Total hari ini',  list.length, 'klien terjadwal'],
          ['Sudah datang',    list.filter(l => l.status !== 'upcoming').length, 'check-in'],
          ['Sedang menunggu', list.filter(l => l.status === 'arrived').length, 'di lobby'],
          ['Sesi berikutnya', list.find(l => l.status === 'upcoming')?.time || '—', 'jam datang'],
        ].map(([lbl, val, sub], i) => (
          <div key={i} className="card-flat" style={{ padding: 14 }}>
            <div className="caption" style={{ marginBottom: 6 }}>{lbl}</div>
            <div className="row gap-2" style={{ alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 500, color: 'var(--teal-800)' }}>{val}</span>
              <span className="caption">{sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline list */}
      <div style={{ flex: 1, minHeight: 0, padding: '0 28px 28px', overflow: 'auto' }}>
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="row" style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between' }}>
            <h2 className="h2" style={{ margin: 0 }}>Daftar kedatangan</h2>
            <span className="caption">{visible.length} klien · diurutkan jam datang</span>
          </div>
          {visible.map((c, i) => {
            const s = STAT[c.status];
            return (
              <div key={i} className="row gap-3" style={{ padding: '14px 18px', borderTop: i ? '1px solid var(--border)' : 'none', alignItems: 'center', background: c.status === 'arrived' ? 'var(--warning-soft)' : 'transparent' }}>
                <div className="col" style={{ width: 60, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--teal-800)', fontFamily: 'var(--font-serif)' }}>{c.time}</span>
                  <span className="caption" style={{ fontSize: 10 }}>WIB</span>
                </div>
                <div style={{ width: 3, alignSelf: 'stretch', background: s.dot, borderRadius: 2 }} />
                <div className="col grow" style={{ minWidth: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--teal-800)' }}>{c.client}</span>
                  <span className="caption" style={{ marginTop: 2 }}>{c.svc} · psikolog <strong>{c.psy}</strong> · 📍 {c.room}</span>
                  {c.note !== '—' && <span className="caption" style={{ marginTop: 2, fontSize: 11, fontStyle: 'italic', color: c.status === 'arrived' ? '#8a4a00' : 'var(--fg-muted)' }}>{c.note}</span>}
                </div>
                <span className="badge" style={{ background: s.bg, color: s.fg, height: 22 }}>{s.label}</span>
                {c.status === 'arrived' && <button className="btn btn-primary btn-sm">Antar ke ruangan</button>}
              </div>
            );
          })}
        </div>

        <div className="row gap-2" style={{ marginTop: 14, padding: 12, background: 'var(--info-soft)', borderRadius: 8, alignItems: 'flex-start' }}>
          <Icon name="bell" size={14} stroke="var(--info)" />
          <span className="caption" style={{ color: '#2c4a60', lineHeight: 1.5 }}>
            <strong>Akses Resepsionis (view only).</strong> Anda dapat melihat daftar klien, psikolog, dan ruangan.
            Untuk reschedule, pembatalan, atau perubahan jadwal — hubungi admin klinik.
          </span>
        </div>

        {/* Pemakaian Ruangan — grid read-only untuk resepsionis tahu klien
            yang akan datang dijadwalkan di ruangan mana, tanpa perlu nanya admin. */}
        <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', marginTop: 16 }}>
          <div className="row" style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div className="col">
              <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 500, color: 'var(--teal-800)' }}>Pemakaian Ruangan · Slot × Ruangan</h2>
              <span className="caption" style={{ marginTop: 2 }}>Read-only · resepsionis lihat psikolog mana di ruangan mana per slot. Untuk antar klien ke ruangan yang tepat.</span>
            </div>
            <RoomUsageLegend compact />
          </div>
          <RoomUsageGrid editable={false} compact />
        </div>
      </div>
    </RoleShell>
  );
}

// ────────────────────────────────────────────────────────────
// Marketing — layanan & kapasitas (PRD § 3 Marketing role).
// View terbatas: layanan terlaris, kapasitas, tren bulanan.
// ────────────────────────────────────────────────────────────
function MarketingDashboard() {
  const services = [
    { name: 'Tes MHCU',                     kind: 'tes',       price: 'Rp 350.000/org', month: 32, prev: 28, capacity: 80, growth: '+14%' },
    { name: 'Konseling Individu Dewasa',    kind: 'konseling', price: 'Rp 350.000',     month: 24, prev: 22, capacity: 60, growth: '+9%' },
    { name: 'Konsultasi Hasil Tes',         kind: 'tes',       price: 'Rp 250.000',     month: 22, prev: 20, capacity: 50, growth: '+10%' },
    { name: 'Konseling Individu Anak',      kind: 'anak',      price: 'Rp 350.000',     month: 18, prev: 17, capacity: 40, growth: '+6%' },
    { name: 'Tes Bakat Minat',              kind: 'tes',       price: 'Rp 650.000',     month: 16, prev: 12, capacity: 30, growth: '+33%' },
    { name: 'Terapi Anak Lengkap',          kind: 'anak',      price: 'Rp 3.250.000',   month: 14, prev: 16, capacity: 20, growth: '−13%' },
    { name: 'Terapi Dewasa',                kind: 'terapi',    price: 'Rp 1.300.000',   month: 12, prev: 10, capacity: 30, growth: '+20%' },
    { name: 'Tes Kesiapan Sekolah Anak',    kind: 'tes',       price: 'Rp 850.000',     month: 11, prev: 9,  capacity: 25, growth: '+22%' },
  ];

  return (
    <RoleShell role="Marketing" name="Intan Marketing" initial="IM" color="#8a6a3a"
      breadcrumb="Marketing · Layanan & kapasitas"
      title="Insight Layanan · Mei 2026">
      <div style={{ padding: '18px 28px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="row gap-3">
          <div className="row gap-2" style={{ background: 'var(--cream-100)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 14px', height: 36 }}>
            <Icon name="cal" size={15} stroke="var(--sage-600)" />
            <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--teal-800)' }}>Mei 2026 (bulan ini)</span>
          </div>
        </div>
        <div className="row gap-2">
          <button className="btn btn-outline btn-sm"><Icon name="arrowR" size={14} /> Ekspor laporan</button>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ padding: '0 28px 16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          ['Total booking', '186', '↑ 9% vs bulan lalu'],
          ['Layanan terlaris', 'Tes MHCU', '32 booking · korporat'],
          ['Konversi tes → konseling', '38%', 'follow-up 7 hari'],
          ['Kapasitas terpakai', '62%', 'rata-rata seluruh layanan'],
        ].map(([lbl, val, sub], i) => (
          <div key={i} className="card-flat" style={{ padding: 14 }}>
            <div className="caption" style={{ marginBottom: 6 }}>{lbl}</div>
            <div className="row gap-2" style={{ alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 500, color: 'var(--teal-800)' }}>{val}</span>
            </div>
            <span className="caption" style={{ fontSize: 11, color: 'var(--sage-700)', display: 'block', marginTop: 2 }}>{sub}</span>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0, padding: '0 28px 28px', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, overflow: 'hidden' }}>
        {/* Layanan table */}
        <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="row" style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between' }}>
            <h2 className="h2" style={{ margin: 0 }}>Performa layanan · bulan ini</h2>
            <span className="caption">8 dari 16 layanan · top picks</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 0.8fr 1.5fr 0.8fr', padding: '10px 18px', background: 'var(--cream-50)', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <span>Layanan</span><span>Harga</span><span>Booking</span><span>Kapasitas terpakai</span><span>Tren</span>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {services.map((s, i) => {
              const pct = Math.round((s.month / s.capacity) * 100);
              const up = s.growth.startsWith('+');
              return (
                <div key={s.name} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 0.8fr 1.5fr 0.8fr', padding: '12px 18px', borderTop: i ? '1px solid var(--border)' : 'none', alignItems: 'center' }}>
                  <div className="row gap-2">
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--svc-' + s.kind + ')' }} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--teal-800)' }}>{s.name}</span>
                  </div>
                  <span style={{ fontSize: 12.5, color: 'var(--fg)', fontVariantNumeric: 'tabular-nums' }}>{s.price}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)', fontVariantNumeric: 'tabular-nums' }}>{s.month}</span>
                  <div className="row gap-2" style={{ alignItems: 'center' }}>
                    <div style={{ flex: 1, height: 5, background: 'var(--cream-200)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: pct + '%', height: '100%', background: pct > 80 ? 'var(--danger)' : 'var(--svc-' + s.kind + ')' }} />
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontVariantNumeric: 'tabular-nums', minWidth: 30 }}>{pct}%</span>
                  </div>
                  <span className={'badge ' + (up ? 'badge-success' : 'badge-warn')} style={{ height: 18, fontSize: 10 }}>{s.growth}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insight panel */}
        <div className="col gap-3" style={{ overflow: 'auto' }}>
          <div className="card" style={{ padding: 18 }}>
            <h2 style={{ margin: '0 0 12px', fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 500, color: 'var(--teal-800)' }}>Tren 6 bulan</h2>
            <div className="row" style={{ alignItems: 'flex-end', gap: 10, height: 110 }}>
              {[140, 152, 163, 158, 170, 186].map((v, i) => {
                const max = 200;
                const isCur = i === 5;
                return (
                  <div key={i} className="col grow" style={{ alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--teal-800)' }}>{v}</span>
                    <div style={{ width: '100%', height: (v / max) * 80, background: isCur ? 'var(--sage-500)' : 'var(--sage-200)', borderRadius: 4 }} />
                    <span className="caption" style={{ fontSize: 10 }}>{['Des','Jan','Feb','Mar','Apr','Mei'][i]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card" style={{ padding: 18 }}>
            <h2 style={{ margin: '0 0 12px', fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 500, color: 'var(--teal-800)' }}>Layanan undersubscribed</h2>
            <p className="caption" style={{ margin: '0 0 12px', lineHeight: 1.5 }}>Kapasitas masih besar — peluang campaign:</p>
            <div className="col gap-2">
              {[
                ['Konseling Keluarga',     '4/15 booking',  '27%'],
                ['Terapi Pasangan',        '5/12 booking',  '42%'],
                ['Tes Lainnya',            '8/20 booking',  '40%'],
              ].map(([n, b, pct]) => (
                <div key={n} className="row" style={{ justifyContent: 'space-between', padding: '8px 10px', background: 'var(--cream-50)', borderRadius: 6 }}>
                  <div className="col">
                    <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--teal-800)' }}>{n}</span>
                    <span className="caption" style={{ fontSize: 10.5 }}>{b}</span>
                  </div>
                  <span className="badge badge-warn" style={{ height: 20 }}>{pct}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 14, background: 'var(--info-soft)', borderColor: '#cfdde8' }}>
            <span className="eyebrow" style={{ color: '#2c4a60' }}>Akses Marketing</span>
            <p className="body-sm" style={{ margin: '6px 0 0', color: '#2c4a60', lineHeight: 1.5, fontSize: 11.5 }}>
              View terbatas: layanan, kapasitas, tren. Tidak melihat data pribadi klien atau psikolog tertentu.
            </p>
          </div>
        </div>
      </div>
    </RoleShell>
  );
}

Object.assign(window, { OwnerDashboard, ResepsionisDashboard, MarketingDashboard });
