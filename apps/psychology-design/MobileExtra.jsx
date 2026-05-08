// Mobile · Extra views — Psikolog Jadwal mingguan, Forgot password.
// Plus: rewrite MobilePsikologKlien dengan pattern desktop (state, search, kategori).

// ────────────────────────────────────────────────────────────
// Mobile Psikolog · Jadwal Mingguan
// ────────────────────────────────────────────────────────────
function MobilePsikologJadwal() {
  const [view, setView] = React.useState('week');  // week | day
  const [selectedDay, setSelectedDay] = React.useState(0);
  const days = [['Sn', '04'], ['Sl', '05'], ['Rb', '06'], ['Km', '07'], ['Jm', '08'], ['Sb', '09']];
  const dayCounts = [4, 3, 2, 4, 3, 0];

  const todayList = [
    { time: '09.00', client: 'Rina A.', svc: 'Konseling Dewasa · 3/4', room: 'K2', status: 'done' },
    { time: '10.30', client: 'Bayu S.', svc: 'Konseling Dewasa · 1/4', room: 'K2', status: 'now' },
    { time: '13.00', client: 'Dito P.', svc: 'Konseling Dewasa · 2/4', room: 'K1', status: 'next' },
    { time: '15.00', client: 'Maya & Hadi', svc: 'Konseling Pasangan · 1/6', room: 'K-Besar', status: 'next' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <header style={{ padding: '12px 16px', background: 'var(--bg-elev)', borderBottom: '1px solid var(--border)' }}>
        <div className="row gap-2" style={{ marginBottom: 6, alignItems: 'center' }}>
          <Avatar name="Vina" color="#7a8556" size="sm" />
          <div className="col grow">
            <span className="caption" style={{ fontSize: 10.5 }}>Vina · Psikolog</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--teal-800)' }}>Jadwal saya</span>
          </div>
          <button className="btn btn-icon btn-ghost btn-sm"><Icon name="bell" size={16} /></button>
        </div>
        {/* View toggle */}
        <div className="row gap-1" style={{ background: 'var(--cream-100)', borderRadius: 8, padding: 3, marginTop: 4 }}>
          {[['day', 'Hari'], ['week', 'Minggu']].map(([k, lbl]) => (
            <button key={k} onClick={() => setView(k)} className="btn btn-sm" style={{ flex: 1, height: 28, padding: '0 12px',
              background: view === k ? 'var(--bg-elev)' : 'transparent',
              boxShadow: view === k ? 'var(--shadow-xs)' : 'none',
              color: view === k ? 'var(--teal-800)' : 'var(--fg-muted)',
              fontWeight: view === k ? 600 : 500 }}>{lbl}</button>
          ))}
        </div>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 100px' }}>
        {/* Week strip */}
        <div className="row gap-2" style={{ overflowX: 'auto', paddingBottom: 8, marginBottom: 14 }}>
          {days.map(([d, n], i) => {
            const sel = selectedDay === i;
            const isToday = i === 0;
            const c = dayCounts[i];
            return (
              <button key={n} onClick={() => setSelectedDay(i)} style={{ all: 'unset', cursor: 'pointer', minWidth: 52, textAlign: 'center', padding: '10px 0', borderRadius: 10,
                background: sel ? 'var(--sage-500)' : isToday ? 'var(--sage-50)' : 'var(--bg-elev)',
                color: sel ? '#fff' : 'var(--teal-800)',
                border: '1px solid ' + (sel ? 'var(--sage-500)' : isToday ? 'var(--sage-300)' : 'var(--border)'),
                fontWeight: 600, fontSize: 12, position: 'relative' }}>
                <div style={{ fontSize: 10.5, opacity: 0.85, marginBottom: 2 }}>{d}</div>
                <div style={{ fontSize: 16, fontFamily: 'var(--font-serif)' }}>{n}</div>
                {c > 0 && <div style={{ position: 'absolute', top: 4, right: 6, width: 16, height: 16, borderRadius: 999, background: sel ? '#fff' : 'var(--sage-500)', color: sel ? 'var(--sage-700)' : '#fff', fontSize: 9, fontWeight: 700, display: 'grid', placeItems: 'center' }}>{c}</div>}
              </button>
            );
          })}
        </div>

        {/* Stats summary */}
        <div className="row gap-2" style={{ marginBottom: 14 }}>
          {[['17', 'sesi minggu'], ['71%', 'kapasitas'], ['12', 'klien aktif']].map(([n, l]) => (
            <div key={l} className="card-flat" style={{ flex: 1, padding: 10, textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600, color: 'var(--teal-800)' }}>{n}</div>
              <span className="caption" style={{ fontSize: 10 }}>{l}</span>
            </div>
          ))}
        </div>

        {selectedDay === 0 ? (
          <>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="eyebrow">Senin · {todayList.length} sesi hari ini</span>
              <span className="caption" style={{ fontSize: 10.5, color: 'var(--sage-700)' }}>● 1 berlangsung</span>
            </div>

            <div className="col gap-2">
              {todayList.map((s, i) => {
                const isNow = s.status === 'now';
                const isDone = s.status === 'done';
                return (
                  <div key={i} className="card" style={{ padding: 12, display: 'flex', gap: 10,
                    background: isNow ? 'var(--sage-50)' : 'var(--bg-elev)',
                    border: '1px solid ' + (isNow ? 'var(--sage-300)' : 'var(--border)'),
                    opacity: isDone ? 0.62 : 1 }}>
                    <div className="col" style={{ width: 50 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--teal-800)' }}>{s.time}</span>
                      <span style={{ fontSize: 9.5, color: 'var(--fg-muted)' }}>WIB</span>
                    </div>
                    <div style={{ width: 3, background: isNow ? 'var(--sage-500)' : isDone ? 'var(--cream-300)' : 'var(--sage-300)', borderRadius: 2 }} />
                    <div className="col grow" style={{ minWidth: 0 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--teal-800)' }}>{s.client}</span>
                      <span className="caption" style={{ fontSize: 11, marginTop: 1 }}>{s.svc}</span>
                      <div className="row gap-1" style={{ marginTop: 5 }}>
                        <span className="badge badge-neutral" style={{ height: 18, fontSize: 9.5 }}>📍 {s.room}</span>
                        {isNow && <span className="badge badge-sage" style={{ height: 18, fontSize: 9.5 }}>● now</span>}
                        {isDone && <span className="badge" style={{ background: 'var(--cream-200)', color: 'var(--fg-muted)', height: 18, fontSize: 9.5 }}>✓ selesai</span>}
                      </div>
                    </div>
                    {isDone && <button className="btn btn-ghost btn-sm" style={{ height: 28, padding: '0 8px', fontSize: 11 }}>Catatan</button>}
                    {!isDone && !isNow && <Icon name="chevR" size={14} stroke="var(--fg-muted)" />}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="eyebrow">{['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'][selectedDay]} · {dayCounts[selectedDay]} sesi</span>
            </div>
            {dayCounts[selectedDay] === 0 ? (
              <div className="col" style={{ alignItems: 'center', padding: '40px 20px', textAlign: 'center', gap: 8 }}>
                <div style={{ width: 48, height: 48, borderRadius: 999, background: 'var(--cream-100)', display: 'grid', placeItems: 'center' }}>
                  <Icon name="cal" size={20} stroke="var(--fg-muted)" />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>Tidak ada sesi</span>
                <span className="caption" style={{ fontSize: 11.5, lineHeight: 1.45 }}>Hari libur · belum ada booking</span>
              </div>
            ) : (
              <div className="col gap-2">
                {Array.from({ length: dayCounts[selectedDay] }).map((_, i) => (
                  <div key={i} className="card" style={{ padding: 12, display: 'flex', gap: 10 }}>
                    <div className="col" style={{ width: 50 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--teal-800)' }}>{['09.00','10.30','13.00','15.00'][i]}</span>
                    </div>
                    <div style={{ width: 3, background: 'var(--sage-300)', borderRadius: 2 }} />
                    <div className="col grow">
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--teal-800)' }}>{['Sari W.','Bayu S.','Maya & Hadi','Lila R.'][i]}</span>
                      <span className="caption" style={{ fontSize: 11, marginTop: 1 }}>Konseling · sesi mendatang</span>
                    </div>
                    <Icon name="chevR" size={14} stroke="var(--fg-muted)" />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Privacy footer */}
        <div className="row gap-2" style={{ marginTop: 16, padding: 10, background: 'var(--info-soft)', borderRadius: 6, alignItems: 'flex-start' }}>
          <Icon name="bell" size={12} stroke="var(--info)" />
          <span style={{ fontSize: 10.5, color: '#2c4a60', lineHeight: 1.45 }}>Untuk reschedule lintas-psikolog, hubungi admin (BR-04).</span>
        </div>
      </div>

      <nav className="tabbar">
        <div className="tab"><Icon name="home" size={18} /> Hari ini</div>
        <div className="tab active"><Icon name="cal" size={18} /> Jadwal</div>
        <div className="tab"><Icon name="users" size={18} /> Klien</div>
        <div className="tab"><Icon name="user" size={18} /> Saya</div>
      </nav>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Mobile Psikolog · Klien (rewrite — sync dengan desktop pattern)
// State management, search, kategori filter, BR-04 banner, risk dot
// ────────────────────────────────────────────────────────────
function MobilePsikologKlienV2() {
  const [tab, setTab] = React.useState('Semua');
  const [query, setQuery] = React.useState('');

  const list = [
    { id: 'rin', name: 'Rina Andreyani', ini: 'RA', kat: 'Dewasa',   sesiN: 3, sesiT: 4, next: 'Hari ini · 09.00', room: 'K2', risk: 'rendah',  status: 'aktif' },
    { id: 'bay', name: 'Bayu Saputra',   ini: 'BS', kat: 'Dewasa',   sesiN: 1, sesiT: 4, next: 'Hari ini · 10.30', room: 'K1', risk: 'sedang',  status: 'aktif' },
    { id: 'dit', name: 'Dito Pranata',   ini: 'DP', kat: 'Dewasa',   sesiN: 2, sesiT: 4, next: 'Hari ini · 13.00', room: 'K-Besar', risk: 'rendah', status: 'aktif' },
    { id: 'mah', name: 'Maya & Hadi W.', ini: 'MH', kat: 'Pasangan', sesiN: 1, sesiT: 6, next: 'Hari ini · 15.00', room: 'K-Besar', risk: 'sedang', status: 'aktif' },
    { id: 'lil', name: 'Lila Ramadhani', ini: 'LR', kat: 'Remaja',   sesiN: 2, sesiT: 4, next: '22 Mei · 14.00',  room: 'K3', risk: 'sedang', status: 'aktif' },
    { id: 'tin', name: 'Tina Hapsari',   ini: 'TH', kat: 'Dewasa',   sesiN: 1, sesiT: 4, next: '23 Mei · 10.00',  room: 'K2', risk: 'belum dinilai', status: 'baru' },
    { id: 'sar', name: 'Sari Wulandari', ini: 'SW', kat: 'Dewasa',   sesiN: 4, sesiT: 4, next: '—',                room: '—', risk: 'rendah', status: 'paket selesai' },
  ];
  const RISK_DOT = { 'rendah': 'var(--success)', 'sedang': '#c98a00', 'tinggi': 'var(--danger)', 'belum dinilai': 'var(--fg-muted)' };
  const STATUS_TONE = { 'aktif': { bg: 'var(--sage-100)', fg: 'var(--sage-800)' }, 'baru': { bg: 'var(--teal-700)', fg: '#fff' }, 'paket selesai': { bg: 'var(--cream-200)', fg: 'var(--fg-muted)' } };

  let visible = list;
  if (tab === 'Aktif')   visible = visible.filter(c => c.status === 'aktif');
  if (tab === 'Baru')    visible = visible.filter(c => c.status === 'baru');
  if (tab === 'Selesai') visible = visible.filter(c => c.status === 'paket selesai');
  if (query.trim()) visible = visible.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));

  const counts = { Semua: list.length, Aktif: list.filter(c => c.status === 'aktif').length, Baru: list.filter(c => c.status === 'baru').length, Selesai: list.filter(c => c.status === 'paket selesai').length };
  const todayCount = list.filter(c => c.next.startsWith('Hari ini')).length;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <header style={{ padding: '12px 16px', background: 'var(--bg-elev)', borderBottom: '1px solid var(--border)' }}>
        <div className="row gap-2" style={{ marginBottom: 8 }}>
          <Avatar name="Vina" color="#7a8556" size="sm" />
          <div className="col grow">
            <span className="caption" style={{ fontSize: 10.5 }}>Vina · Psikolog</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--teal-800)' }}>Klien saya</span>
          </div>
          <button className="btn btn-icon btn-ghost btn-sm"><Icon name="bell" size={16} /></button>
        </div>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 11, top: 11 }}><Icon name="search" size={14} stroke="var(--fg-muted)" /></span>
          <input className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari klien…" style={{ paddingLeft: 32, height: 36, fontSize: 13 }} />
        </div>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 100px' }}>
        {/* BR-04 banner */}
        <div className="row gap-2" style={{ padding: '8px 10px', background: 'var(--info-soft)', border: '1px solid #cfdde8', borderRadius: 6, marginBottom: 12, alignItems: 'flex-start' }}>
          <Icon name="eye" size={12} stroke="var(--info)" />
          <span style={{ fontSize: 10.5, color: '#2c4a60', lineHeight: 1.4 }}>
            Hanya klien Anda ({list.length}). Privasi BR-04.
          </span>
        </div>

        {/* Filter chips */}
        <div className="row gap-2" style={{ overflowX: 'auto', paddingBottom: 6, marginBottom: 12 }}>
          {Object.keys(counts).map(t => {
            const sel = tab === t;
            return (
              <button key={t} onClick={() => setTab(t)} style={{ all: 'unset', cursor: 'pointer',
                height: 30, padding: '0 12px', fontSize: 12, borderRadius: 999,
                background: sel ? 'var(--sage-500)' : 'var(--bg-elev)',
                color: sel ? '#fff' : 'var(--teal-800)',
                border: '1px solid ' + (sel ? 'var(--sage-500)' : 'var(--border)'),
                flexShrink: 0, display: 'flex', alignItems: 'center', fontWeight: 500,
              }}>{t} <span style={{ marginLeft: 4, opacity: 0.8 }}>{counts[t]}</span></button>
            );
          })}
        </div>

        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
          <span className="eyebrow">{visible.length} klien {tab !== 'Semua' && '· ' + tab.toLowerCase()}</span>
          <span className="caption" style={{ fontSize: 10.5, color: 'var(--sage-700)', fontWeight: 600 }}>{todayCount} hari ini</span>
        </div>

        {visible.length === 0 ? (
          <div className="col" style={{ alignItems: 'center', padding: '40px 20px', textAlign: 'center', gap: 8 }}>
            <Icon name="users" size={28} stroke="var(--fg-muted)" />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>Tidak ada klien</span>
            <span className="caption" style={{ fontSize: 11.5 }}>Coba ubah filter atau pencarian</span>
          </div>
        ) : (
          <div className="col gap-2">
            {visible.map(c => {
              const st = STATUS_TONE[c.status];
              const pct = Math.round((c.sesiN / c.sesiT) * 100);
              const isToday = c.next.startsWith('Hari ini');
              return (
                <div key={c.id} className="card" style={{ padding: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 999, background: 'var(--sage-200)', color: 'var(--sage-800)', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0, position: 'relative' }}>
                    {c.ini}
                    <span style={{ position: 'absolute', bottom: -1, right: -1, width: 11, height: 11, borderRadius: 999, background: RISK_DOT[c.risk], border: '2px solid var(--bg-elev)' }} />
                  </div>
                  <div className="col grow" style={{ minWidth: 0, gap: 4 }}>
                    <div className="row gap-2" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--teal-800)' }}>{c.name}</span>
                      <span className="badge" style={{ background: st.bg, color: st.fg, height: 16, fontSize: 9.5 }}>{c.status}</span>
                    </div>
                    <span className="caption" style={{ fontSize: 11 }}>{c.kat} · sesi {c.sesiN}/{c.sesiT}</span>
                    {/* progress */}
                    <div style={{ height: 3, background: 'var(--cream-200)', borderRadius: 999, overflow: 'hidden', marginTop: 1 }}>
                      <div style={{ width: pct + '%', height: '100%', background: pct === 100 ? 'var(--cream-300)' : 'var(--sage-500)' }} />
                    </div>
                    <span className="caption" style={{ fontSize: 10.5, marginTop: 3, color: isToday ? 'var(--sage-700)' : 'var(--fg-muted)', fontWeight: isToday ? 600 : 400 }}>
                      → {c.next}{c.room !== '—' && ' · 📍 ' + c.room}
                    </span>
                  </div>
                  <Icon name="chevR" size={14} stroke="var(--fg-muted)" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <nav className="tabbar">
        <div className="tab"><Icon name="home" size={18} /> Hari ini</div>
        <div className="tab"><Icon name="cal" size={18} /> Jadwal</div>
        <div className="tab active"><Icon name="users" size={18} /> Klien</div>
        <div className="tab"><Icon name="user" size={18} /> Saya</div>
      </nav>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Mobile · Forgot Password (recovery flow)
// ────────────────────────────────────────────────────────────
function MobileForgotPassword() {
  const [step, setStep] = React.useState(1);  // 1: input email, 2: OTP, 3: new password, 4: success

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--cream-50)' }}>
      <header style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <button className="btn btn-icon btn-ghost btn-sm" onClick={() => setStep(s => Math.max(1, s - 1))}><Icon name="chevL" size={18} /></button>
        <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>Langkah {step} dari 4</span>
      </header>

      {/* Step indicator */}
      <div className="row gap-1" style={{ padding: '0 16px 16px' }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: s <= step ? 'var(--sage-500)' : 'var(--cream-200)' }} />
        ))}
      </div>

      <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column' }}>
        {step === 1 && (
          <>
            <h1 className="h1" style={{ fontSize: 24, marginBottom: 8 }}>Lupa kata sandi?</h1>
            <p className="body" style={{ color: 'var(--fg-muted)', marginBottom: 24, lineHeight: 1.5 }}>
              Masukkan email akun Anda. Kami akan kirim kode OTP via WhatsApp.
            </p>
            <div className="col gap-1" style={{ marginBottom: 18 }}>
              <label className="caption" style={{ fontWeight: 500, color: 'var(--teal-800)' }}>Email</label>
              <input className="input" defaultValue="vina@altheapsychology.id" />
            </div>
            <button className="btn btn-primary" style={{ height: 46, fontSize: 14 }} onClick={() => setStep(2)}>
              Kirim kode OTP <Icon name="arrowR" size={14} stroke="#fff" />
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="h1" style={{ fontSize: 24, marginBottom: 8 }}>Kode OTP</h1>
            <p className="body" style={{ color: 'var(--fg-muted)', marginBottom: 18, lineHeight: 1.5 }}>
              Kode 6 digit telah dikirim ke <strong style={{ color: 'var(--teal-800)' }}>+62 813 ••• 5544</strong> via WhatsApp.
            </p>
            <div className="row gap-2" style={{ marginBottom: 14, justifyContent: 'space-between' }}>
              {[0,1,2,3,4,5].map(i => (
                <input key={i} className="input" maxLength={1} defaultValue={[2,8,4,1,'',''][i]} style={{ width: 44, height: 50, textAlign: 'center', fontSize: 20, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }} />
              ))}
            </div>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 24 }}>
              <span className="caption">Kode kadaluarsa dalam <strong style={{ color: 'var(--danger)' }}>04:23</strong></span>
              <a style={{ fontSize: 12, color: 'var(--sage-700)', cursor: 'pointer', fontWeight: 500 }}>Kirim ulang</a>
            </div>
            <button className="btn btn-primary" style={{ height: 46, fontSize: 14 }} onClick={() => setStep(3)}>
              Verifikasi <Icon name="arrowR" size={14} stroke="#fff" />
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="h1" style={{ fontSize: 24, marginBottom: 8 }}>Kata sandi baru</h1>
            <p className="body" style={{ color: 'var(--fg-muted)', marginBottom: 18, lineHeight: 1.5 }}>
              Buat kata sandi baru untuk akun Anda.
            </p>
            <div className="col gap-3" style={{ marginBottom: 18 }}>
              <div className="col gap-1">
                <label className="caption" style={{ fontWeight: 500, color: 'var(--teal-800)' }}>Kata sandi baru</label>
                <input className="input" type="password" defaultValue="••••••••••" />
              </div>
              <div className="col gap-1">
                <label className="caption" style={{ fontWeight: 500, color: 'var(--teal-800)' }}>Konfirmasi kata sandi</label>
                <input className="input" type="password" defaultValue="••••••••••" />
              </div>
            </div>
            <div className="col gap-1" style={{ marginBottom: 22, padding: 12, background: 'var(--bg-elev)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <span className="caption" style={{ fontWeight: 600, color: 'var(--teal-800)', fontSize: 11.5, marginBottom: 4 }}>Persyaratan kata sandi</span>
              {[
                ['Minimal 8 karakter', true],
                ['Mengandung angka', true],
                ['Mengandung huruf besar', true],
                ['Tidak sama dengan password lama', false],
              ].map(([t, ok]) => (
                <div key={t} className="row gap-2" style={{ alignItems: 'center' }}>
                  <Icon name={ok ? 'check' : 'x'} size={11} stroke={ok ? 'var(--success)' : 'var(--fg-subtle)'} sw={2.5} />
                  <span style={{ fontSize: 11, color: ok ? 'var(--success)' : 'var(--fg-subtle)' }}>{t}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" style={{ height: 46, fontSize: 14 }} onClick={() => setStep(4)}>
              Simpan kata sandi <Icon name="check" size={14} stroke="#fff" sw={2.5} />
            </button>
          </>
        )}

        {step === 4 && (
          <div className="col" style={{ flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 14 }}>
            <div style={{ width: 80, height: 80, borderRadius: 999, background: 'var(--success-soft)', display: 'grid', placeItems: 'center' }}>
              <Icon name="check" size={36} stroke="var(--success)" sw={2.5} />
            </div>
            <h1 className="h1" style={{ fontSize: 22 }}>Berhasil!</h1>
            <p className="body" style={{ color: 'var(--fg-muted)', maxWidth: 280, lineHeight: 1.5 }}>
              Kata sandi berhasil diubah. Silakan login dengan kata sandi baru Anda.
            </p>
            <button className="btn btn-primary" style={{ height: 46, fontSize: 14, width: '100%', marginTop: 16 }}>
              Kembali ke login
            </button>
          </div>
        )}
      </div>

      {step < 4 && (
        <div style={{ padding: '16px 24px', textAlign: 'center' }}>
          <span className="caption">Ingat kata sandi? <a style={{ color: 'var(--sage-700)', fontWeight: 600, cursor: 'pointer' }}>Login</a></span>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { MobilePsikologJadwal, MobilePsikologKlienV2, MobileForgotPassword });
