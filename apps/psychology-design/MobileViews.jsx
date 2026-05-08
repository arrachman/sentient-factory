// Mobile views for Psikolog (iPhone width)

function MobileToday() {
  const psy = PSYCHOLOGISTS[0];
  const sessions = [
    { time: '08.30', client: 'Anita W.', service: 'Konseling Individu Dewasa', room: 'Sky Room', kind: 'konseling', status: 'next' },
    { time: '12.00', client: 'Bayu S.', service: 'Terapi Dewasa', room: 'Sage Room', kind: 'terapi', sessionN: 2, sessionTotal: 4 },
    { time: '15.15', client: 'Citra A. & Dimas', service: 'Konseling Pasangan', room: 'Mint Room', kind: 'konseling' },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <header style={{ padding: '14px 18px 10px', background: 'var(--bg-elev)', borderBottom: '1px solid var(--border)' }}>
        <div className="row gap-3">
          <Avatar name={psy.short} color={psy.color} size="md" />
          <div className="col grow">
            <span className="caption">Selamat pagi,</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--teal-800)' }}>{psy.short}</span>
          </div>
          <button className="btn btn-icon btn-ghost"><Icon name="bell" size={18} /></button>
        </div>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px 100px' }}>
        <div style={{ marginBottom: 16 }}>
          <h1 className="h1" style={{ fontSize: 24, marginBottom: 4 }}>Senin, 18 Mei</h1>
          <p className="caption" style={{ margin: 0 }}>3 sesi terjadwal · 1 slot kosong</p>
        </div>

        {/* Now playing */}
        <div className="card" style={{ padding: 16, marginBottom: 18, background: 'linear-gradient(135deg, var(--sage-500), var(--sage-700))', color: '#fff', border: 'none' }}>
          <div className="row gap-2" style={{ marginBottom: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: '#a7e8b3', boxShadow: '0 0 0 4px rgba(167,232,179,0.25)' }} />
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.85 }}>Sesi berikutnya · 32 menit lagi</span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Anita W.</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 12 }}>Konseling Individu Dewasa</div>
          <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.18)', padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500 }}>08.30 – 10.00</span>
            <span style={{ background: 'rgba(255,255,255,0.18)', padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500 }}>Sky Room</span>
          </div>
        </div>

        <div className="eyebrow" style={{ marginBottom: 10 }}>Sesi hari ini</div>
        <div className="col gap-2" style={{ marginBottom: 20 }}>
          {sessions.map((s, i) => {
            const c = kindBar(s.kind);
            return (
              <div key={i} className="card" style={{ padding: 14, display: 'flex', gap: 12 }}>
                <div className="col" style={{ width: 50, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--teal-800)' }}>{s.time}</span>
                  <span style={{ fontSize: 10, color: 'var(--fg-muted)' }}>WIB</span>
                </div>
                <div style={{ width: 3, background: c.bar, borderRadius: 2 }} />
                <div className="col grow">
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--teal-800)' }}>{s.client}</span>
                  <span className="caption" style={{ marginTop: 1 }}>{s.service}</span>
                  <div className="row gap-1" style={{ marginTop: 6, flexWrap: 'wrap' }}>
                    <span className="badge badge-neutral" style={{ height: 20 }}>{s.room}</span>
                    {s.sessionTotal && <span className="badge" style={{ background: c.fill, color: c.text, height: 20 }}>sesi {s.sessionN}/{s.sessionTotal}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card-flat" style={{ padding: 14, background: 'var(--cream-100)', display: 'flex', gap: 12, alignItems: 'center', border: '1px dashed var(--border-strong)' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg-elev)', display: 'grid', placeItems: 'center' }}>
            <Icon name="cal" size={17} stroke="var(--sage-600)" />
          </div>
          <div className="col grow">
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>Atur availability minggu depan</span>
            <span className="caption">Belum diset · pola minggu ini akan dipakai</span>
          </div>
          <Icon name="chevR" size={16} stroke="var(--fg-muted)" />
        </div>
      </div>

      <nav className="tabbar">
        <div className="tab active"><Icon name="home" size={20} /> Hari ini</div>
        <div className="tab"><Icon name="cal" size={20} /> Jadwal</div>
        <div className="tab"><Icon name="users" size={20} /> Klien</div>
        <div className="tab"><Icon name="user" size={20} /> Saya</div>
      </nav>
    </div>
  );
}

function MobileAvailability() {
  // Psikolog dapat memilih MAKS 4 dari 6 slot per hari (opt-in) — selaras dengan
  // BR-01 "kuota harian psikolog = 4 klien". Slot ke-5 dst. otomatis disabled.
  const MAX_PER_DAY = 4;
  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const [selectedDay, setSelectedDay] = React.useState(0);
  // Mock pick set — sengaja sebagian dibuat 4 (cap), sebagian < 4.
  const slotPicks = [[0, 1, 2], [0, 1, 3, 4], [2, 3], [0, 1, 4, 5], [1, 2], []];
  const picks = slotPicks[selectedDay] || [];
  const capReached = picks.length >= MAX_PER_DAY;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <header style={{ padding: '12px 18px', background: 'var(--bg-elev)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button className="btn btn-icon btn-ghost"><Icon name="chevL" size={18} /></button>
        <div className="col grow"><span style={{ fontSize: 15, fontWeight: 600, color: 'var(--teal-800)' }}>Availability Mingguan</span><span className="caption">Pola berulang · minggu 18 Mei · maks 4 slot/hari</span></div>
        <button className="btn btn-primary btn-sm">Simpan</button>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px 100px' }}>
        <div className="card-flat" style={{ padding: 12, background: 'var(--info-soft)', borderColor: '#cfdde8', display: 'flex', gap: 10, marginBottom: 18 }}>
          <Icon name="bell" size={16} stroke="var(--info)" />
          <p className="body-sm" style={{ margin: 0, color: '#2c4a60' }}>Pilih maks <b>4 dari 6 slot</b> di mana Anda tersedia menerima klien (BR-01). Pola berulang setiap minggu — bisa diedit per hari.</p>
        </div>

        <div className="eyebrow" style={{ marginBottom: 10 }}>Hari</div>
        <div className="row gap-2" style={{ marginBottom: 22, overflowX: 'auto', paddingBottom: 4 }}>
          {days.map((d, i) => {
            const dayPicks = (slotPicks[i] || []).length;
            return (
              <button key={d} onClick={() => setSelectedDay(i)}
                style={{ all: 'unset', cursor: 'pointer', minWidth: 56, textAlign: 'center', padding: '10px 0', borderRadius: 10,
                  background: selectedDay === i ? 'var(--sage-500)' : 'var(--bg-elev)',
                  color: selectedDay === i ? '#fff' : 'var(--teal-800)',
                  border: '1px solid ' + (selectedDay === i ? 'var(--sage-500)' : 'var(--border)'),
                  fontWeight: 600, fontSize: 12 }}>
                <div style={{ fontSize: 10.5, opacity: 0.8, marginBottom: 2 }}>{['18','19','20','21','22','23'][i]}</div>
                <div>{d}</div>
                <div style={{ fontSize: 9.5, marginTop: 2, opacity: selectedDay === i ? 0.85 : 0.65 }}>{dayPicks}/{MAX_PER_DAY}</div>
              </button>
            );
          })}
        </div>

        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
          <span className="eyebrow">Slot tersedia</span>
          <span className="caption" style={{ color: capReached ? 'var(--danger)' : 'var(--fg-muted)', fontWeight: capReached ? 600 : 400 }}>
            {picks.length}/{MAX_PER_DAY} dipilih{capReached ? ' · kuota penuh' : ''}
          </span>
        </div>
        <div className="col gap-2">
          {SLOTS.map((s, i) => {
            const on = picks.includes(i);
            // Slot tidak dipilih + sudah cap → disabled (psikolog harus uncheck dulu)
            const disabled = !on && capReached;
            return (
              <button key={s} disabled={disabled}
                style={{ all: 'unset',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 14px', borderRadius: 10,
                  background: on ? 'var(--sage-50)' : disabled ? 'var(--cream-100)' : 'var(--bg-elev)',
                  border: '1px solid ' + (on ? 'var(--sage-400)' : disabled ? 'var(--border)' : 'var(--border)'),
                  opacity: disabled ? 0.55 : 1 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, border: '1.5px solid ' + (on ? 'var(--sage-500)' : 'var(--border-strong)'), background: on ? 'var(--sage-500)' : 'transparent', display: 'grid', placeItems: 'center' }}>
                  {on && <Icon name="check" size={13} stroke="#fff" sw={2.5} />}
                </div>
                <Icon name="clock" size={16} stroke={on ? 'var(--sage-600)' : 'var(--fg-muted)'} />
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--teal-800)', flex: 1 }}>{s}</span>
                {on && <span className="badge badge-sage">tersedia</span>}
                {disabled && <span className="badge" style={{ background: 'var(--cream-200)', color: 'var(--fg-muted)', fontSize: 10, height: 20 }}>kuota penuh</span>}
              </button>
            );
          })}
        </div>

        <div className="card-flat" style={{ marginTop: 22, padding: 14, background: 'var(--cream-50)' }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div className="col"><span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>Maksimal 4 klien per hari (BR-01)</span><span className="caption" style={{ marginTop: 2 }}>Slot ke-5 dst. otomatis terblokir. Bisa diubah admin di pengaturan psikolog.</span></div>
            <span className="badge badge-success">aktif</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileLogin() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--cream-50)' }}>
      <div style={{ flex: 1, padding: '60px 24px 0', display: 'flex', flexDirection: 'column' }}>
        <div className="row gap-2" style={{ marginBottom: 56 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--sage-500)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 20 }}>A</div>
          <div className="col">
            <span className="brand-mark" style={{ fontSize: 19, color: 'var(--teal-800)' }}>Althea</span>
            <span style={{ fontSize: 11, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>Psychology</span>
          </div>
        </div>
        <h1 className="h1" style={{ fontSize: 28, marginBottom: 8 }}>Selamat datang<br/>kembali.</h1>
        <p className="body" style={{ color: 'var(--fg-muted)', marginBottom: 32, maxWidth: 280 }}>Masuk untuk melihat jadwal sesi Anda hari ini.</p>

        <div className="col gap-3" style={{ marginBottom: 20 }}>
          <div className="col gap-1">
            <label className="caption" style={{ fontWeight: 500, color: 'var(--teal-800)' }}>Email</label>
            <input className="input" placeholder="vina@altheapsychology.id" defaultValue="vina@altheapsychology.id" />
          </div>
          <div className="col gap-1">
            <label className="caption" style={{ fontWeight: 500, color: 'var(--teal-800)' }}>Kata sandi</label>
            <input className="input" type="password" defaultValue="••••••••••" />
          </div>
        </div>

        <button className="btn btn-primary" style={{ height: 46, fontSize: 14 }}>Masuk</button>
        <button className="btn btn-ghost" style={{ marginTop: 10, color: 'var(--sage-700)' }}>Lupa kata sandi?</button>

        <div style={{ marginTop: 'auto', padding: '24px 0 16px', textAlign: 'center' }}>
          <span className="caption">Althea Psychology — Malang, Jawa Timur</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MobileToday, MobileAvailability, MobileLogin });
