// Mobile · Psikolog views — extends existing MobileToday/Availability/Login.
// Adds: Klien saya list, Detail klien + catatan, Profil saya.

function MobilePsikologShell({ title, subtitle, active = 'klien', children }) {
  const tabs = [
    ['today', 'home', 'Hari ini'],
    ['jadwal', 'cal', 'Jadwal'],
    ['klien', 'users', 'Klien'],
    ['saya', 'user', 'Saya'],
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <header style={{ padding: '12px 16px 14px', background: 'var(--bg-elev)', borderBottom: '1px solid var(--border)' }}>
        <div className="row gap-2" style={{ marginBottom: subtitle ? 4 : 0 }}>
          <Avatar name="Vina" color="#7a8556" size="sm" />
          <div className="col grow">
            <span className="caption" style={{ fontSize: 10.5 }}>Vina · Psikolog</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--teal-800)' }}>{title}</span>
          </div>
          <button className="btn btn-icon btn-ghost btn-sm"><Icon name="search" size={16} /></button>
        </div>
        {subtitle && <span className="caption" style={{ fontSize: 11 }}>{subtitle}</span>}
      </header>
      <div style={{ flex: 1, overflowY: 'auto' }}>{children}</div>
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
// Mobile Psikolog · Klien saya
// ────────────────────────────────────────────────────────────
function MobilePsikologKlien() {
  const list = [
    ['Rina Andreyani', 'RA', 'Dewasa', '3/4', 'Hari ini · 09.00', 'aktif', 'sage'],
    ['Bayu Saputra', 'BS', 'Dewasa', '1/4', 'Hari ini · 10.30', 'baru', 'teal'],
    ['Dito Pranata', 'DP', 'Dewasa', '2/4', 'Hari ini · 13.00', 'aktif', 'sage'],
    ['Maya & Hadi W.', 'MH', 'Pasangan', '1/6', 'Hari ini · 15.00', 'aktif', 'sage'],
    ['Lila Ramadhani', 'LR', 'Remaja', '2/4', '22 Mei · 14.00', 'aktif', 'sage'],
    ['Tina Hapsari', 'TH', 'Dewasa', '1/4', '23 Mei · 10.00', 'baru', 'teal'],
    ['Sari Wulandari', 'SW', 'Dewasa', '4/4', 'paket selesai', 'selesai', 'cream'],
  ];
  return (
    <MobilePsikologShell title="Klien saya" subtitle="12 aktif · 2 baru bulan ini" active="klien">
      <div style={{ padding: '12px 16px 24px' }}>
        <div className="row gap-2" style={{ overflowX: 'auto', paddingBottom: 6, marginBottom: 12 }}>
          {[['Semua', 12, true], ['Aktif', 9, false], ['Baru', 1, false], ['Selesai', 2, false]].map(([t, n, sel]) => (
            <button key={t} style={{ all: 'unset', cursor: 'pointer',
              height: 30, padding: '0 12px', fontSize: 12, borderRadius: 999,
              background: sel ? 'var(--sage-500)' : 'var(--bg-elev)',
              color: sel ? '#fff' : 'var(--teal-800)',
              border: '1px solid ' + (sel ? 'var(--sage-500)' : 'var(--border)'),
              flexShrink: 0, display: 'flex', alignItems: 'center', fontWeight: 500,
            }}>{t} <span style={{ marginLeft: 4, opacity: 0.8 }}>{n}</span></button>
          ))}
        </div>

        <span className="eyebrow" style={{ marginBottom: 8 }}>Hari ini · 4 sesi</span>
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
                <span className="caption" style={{ fontSize: 11, marginTop: 1 }}>{kat} · sesi {sesi}</span>
                <span className="caption" style={{ fontSize: 10.5, marginTop: 2, color: 'var(--sage-700)' }}>→ {next}</span>
              </div>
              <Icon name="chevR" size={15} stroke="var(--fg-muted)" />
            </div>
          ))}
        </div>
      </div>
    </MobilePsikologShell>
  );
}

// ────────────────────────────────────────────────────────────
// Mobile Psikolog · Detail Klien + Catatan
// ────────────────────────────────────────────────────────────
function MobilePsikologDetail() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <header style={{ padding: '10px 12px', background: 'var(--bg-elev)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <button className="btn btn-icon btn-ghost btn-sm"><Icon name="chevL" size={18} /></button>
        <div className="col grow">
          <span className="caption" style={{ fontSize: 10.5 }}>Klien saya</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--teal-800)' }}>Rina Andreyani</span>
        </div>
        <button className="btn btn-icon btn-ghost btn-sm"><Icon name="msg" size={16} /></button>
        <button className="btn btn-icon btn-ghost btn-sm"><Icon name="more" size={16} /></button>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 24px' }}>
        {/* Profile card */}
        <div className="card" style={{ padding: 16, marginBottom: 14, display: 'flex', gap: 12 }}>
          <div style={{ width: 56, height: 56, borderRadius: 999, background: 'var(--sage-200)', color: 'var(--sage-800)', display: 'grid', placeItems: 'center', fontSize: 18, fontWeight: 600, flexShrink: 0 }}>RA</div>
          <div className="col grow">
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--teal-800)' }}>Rina Andreyani</span>
            <span className="caption" style={{ fontSize: 11 }}>Dewasa · 28 thn · sejak 14 Mar</span>
            <div className="row gap-2" style={{ marginTop: 8 }}>
              <span className="badge badge-sage" style={{ height: 20, fontSize: 10 }}>aktif</span>
              <span className="badge badge-neutral" style={{ height: 20, fontSize: 10 }}>Konseling Dewasa</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="card-flat" style={{ padding: 14, marginBottom: 14 }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="eyebrow">Progres paket</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--teal-800)', fontFamily: 'var(--font-serif)' }}>3 / 4</span>
          </div>
          <div style={{ height: 6, background: 'var(--cream-200)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: '75%', height: '100%', background: 'var(--sage-500)' }} />
          </div>
          <span className="caption" style={{ fontSize: 10.5, marginTop: 6, display: 'block' }}>Sesi terakhir 14 Mei · selanjutnya 21 Mei</span>
        </div>

        {/* Asesmen mini */}
        <div className="row gap-2" style={{ marginBottom: 14 }}>
          {[['GAD-7', '14', 'sedang'], ['PHQ-9', '8', 'ringan'], ['Mood', '6/10', 'naik']].map(([n, v, sub]) => (
            <div key={n} className="card-flat" style={{ flex: 1, padding: 10, textAlign: 'center' }}>
              <span className="caption" style={{ fontSize: 10 }}>{n}</span>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 600, color: 'var(--teal-800)', marginTop: 2 }}>{v}</div>
              <span className="caption" style={{ fontSize: 9.5 }}>{sub}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="row gap-1" style={{ marginBottom: 12, borderBottom: '1px solid var(--border)' }}>
          {[['Catatan', true], ['Riwayat', false], ['Info', false]].map(([t, sel]) => (
            <div key={t} style={{
              padding: '8px 12px', fontSize: 12.5, fontWeight: sel ? 600 : 500,
              color: sel ? 'var(--sage-700)' : 'var(--fg-muted)',
              borderBottom: '2px solid ' + (sel ? 'var(--sage-500)' : 'transparent'),
              marginBottom: -1,
            }}>{t}</div>
          ))}
        </div>

        {/* Catatan list */}
        <div className="col gap-2" style={{ marginBottom: 14 }}>
          {[
            ['Sesi 3 · 14 Mei', 'Latihan grounding 5-4-3-2-1 sangat membantu. Tidur membaik 6-7 jam. Lanjut journaling, mulai thought record sesi depan.', true],
            ['Sesi 2 · 07 Mei', 'Mulai mengidentifikasi pemicu kecemasan di tempat kerja. Diberi PR breathing 4-7-8.', false],
            ['Sesi 1 · 30 Apr', 'Asesmen awal: GAD-7 = 14 (sedang). Stres pekerjaan + sulit tidur. Setuju paket 4 sesi.', false],
          ].map(([t, body, latest], i) => (
            <div key={i} className="card-flat" style={{ padding: 12, borderLeft: latest ? '3px solid var(--sage-500)' : '3px solid transparent' }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className="caption" style={{ fontSize: 11, fontWeight: 600, color: 'var(--teal-800)' }}>{t}</span>
                {latest && <span className="badge badge-sage" style={{ height: 16, fontSize: 9 }}>terbaru</span>}
              </div>
              <p className="body-sm" style={{ margin: '6px 0 0', lineHeight: 1.5, fontSize: 12.5 }}>{body}</p>
            </div>
          ))}
        </div>

        <button className="btn btn-primary" style={{ width: '100%', height: 44 }}>
          + Tulis catatan sesi hari ini
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Mobile Psikolog · Profil saya
// ────────────────────────────────────────────────────────────
function MobilePsikologProfil() {
  return (
    <MobilePsikologShell title="Saya" active="saya">
      <div style={{ padding: '14px 16px 24px' }}>
        {/* Profile hero */}
        <div className="card" style={{ padding: 18, marginBottom: 14, textAlign: 'center' }}>
          <div style={{ width: 76, height: 76, borderRadius: 999, background: 'var(--sage-300)', color: 'var(--teal-800)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 500, margin: '0 auto 10px' }}>VP</div>
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--teal-800)', fontFamily: 'var(--font-serif)' }}>Vina Permatasari, M.Psi</span>
          <div className="caption" style={{ fontSize: 11, marginTop: 3 }}>Psikolog Klinis Dewasa</div>
          <div className="row gap-2" style={{ justifyContent: 'center', flexWrap: 'wrap', marginTop: 10 }}>
            {['Anxiety', 'Burnout', 'Trauma'].map(t => (
              <span key={t} className="badge badge-sage" style={{ height: 20, fontSize: 10 }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <span className="eyebrow" style={{ marginBottom: 8 }}>Statistik · 30 hari</span>
        <div className="row gap-2" style={{ marginBottom: 16 }}>
          {[['68', 'Sesi'], ['12', 'Klien'], ['96%', 'Hadir'], ['4.8', 'Rating']].map(([n, l]) => (
            <div key={l} className="card-flat" style={{ flex: 1, padding: 10, textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 600, color: 'var(--teal-800)' }}>{n}</div>
              <span className="caption" style={{ fontSize: 10 }}>{l}</span>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div className="card" style={{ padding: 0, marginBottom: 14, overflow: 'hidden' }}>
          {[
            ['cal', 'Atur availability', 'pola minggu ini · 5 hari aktif'],
            ['user', 'Edit profil', 'foto, kontak, spesialisasi'],
            ['list', 'SIPP & sertifikat', 'aktif · expired 12/2027'],
            ['bell', 'Notifikasi & jam tenang', '20.00 – 07.00 mute'],
          ].map(([ic, t, sub], i) => (
            <div key={t} className="row gap-3" style={{ padding: '14px 14px', borderTop: i ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--sage-100)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icon name={ic} size={14} stroke="var(--sage-700)" />
              </div>
              <div className="col grow">
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>{t}</span>
                <span className="caption" style={{ fontSize: 10.5, marginTop: 1 }}>{sub}</span>
              </div>
              <Icon name="chevR" size={14} stroke="var(--fg-muted)" />
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 0, marginBottom: 14, overflow: 'hidden' }}>
          {[
            ['settings', 'Pengaturan akun'],
            ['msg', 'Bantuan & dukungan'],
          ].map(([ic, t], i) => (
            <div key={t} className="row gap-3" style={{ padding: '14px 14px', borderTop: i ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--cream-100)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icon name={ic} size={14} stroke="var(--fg-muted)" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)', flex: 1 }}>{t}</span>
              <Icon name="chevR" size={14} stroke="var(--fg-muted)" />
            </div>
          ))}
        </div>

        <button className="btn btn-ghost" style={{ width: '100%', color: 'var(--danger)', justifyContent: 'center' }}>
          <Icon name="logout" size={14} stroke="var(--danger)" /> Keluar
        </button>
      </div>
    </MobilePsikologShell>
  );
}

Object.assign(window, { MobilePsikologShell, MobilePsikologKlien, MobilePsikologDetail, MobilePsikologProfil });
