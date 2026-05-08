// Admin · Psikolog — daftar psikolog dengan kartu profil + statistik mingguan.

const PSY_DETAILS = [
  // todayClients = klien hari ini (kuota harian = 4 default per BR-01).
  // recentlyFreed = true kalau ada cancel/reschedule yang baru saja membuka slot — admin
  //                 bisa langsung tambah klien lain ke psikolog ini.
  { id: 'p1', name: 'Vina Permatasari, M.Psi', short: 'Vina', specialty: 'Klinis Dewasa', color: '#5b8a66', clients: 18, weekSessions: 14, weekCap: 20, todayClients: 4, todayMax: 4, recentlyFreed: false, rating: 4.9, since: '2021', tags: ['Anxiety', 'Burnout', 'Trauma'] },
  { id: 'p2', name: 'Diah Ayu, M.Psi', short: 'Diah', specialty: 'Anak & Remaja', color: '#c97a5d', clients: 22, weekSessions: 18, weekCap: 20, todayClients: 4, todayMax: 4, recentlyFreed: false, rating: 4.8, since: '2020', tags: ['Anak', 'Remaja', 'Tumbuh Kembang'] },
  { id: 'p3', name: 'Rina Hartono, M.Psi', short: 'Rina', specialty: 'Pasangan & Keluarga', color: '#6f8aa3', clients: 12, weekSessions: 9, weekCap: 16, todayClients: 3, todayMax: 4, recentlyFreed: true,  rating: 4.9, since: '2019', tags: ['Pasangan', 'Konflik', 'Komunikasi'] },
  { id: 'p4', name: 'Bagus Wicaksono, M.Psi', short: 'Bagus', specialty: 'Klinis Dewasa', color: '#9c7c3c', clients: 14, weekSessions: 12, weekCap: 18, todayClients: 3, todayMax: 4, recentlyFreed: false, rating: 4.7, since: '2022', tags: ['Depresi', 'Stres Kerja'] },
  { id: 'p5', name: 'Sari Lestari, M.Psi', short: 'Sari', specialty: 'Anak', color: '#b3493b', clients: 16, weekSessions: 13, weekCap: 16, todayClients: 3, todayMax: 4, recentlyFreed: false, rating: 4.9, since: '2020', tags: ['Anak', 'Behavioral'] },
  { id: 'p6', name: 'Tomi Pradana, M.Psi', short: 'Tomi', specialty: 'Tes Psikologi', color: '#4a7090', clients: 24, weekSessions: 16, weekCap: 20, todayClients: 4, todayMax: 4, recentlyFreed: false, rating: 4.8, since: '2018', tags: ['Tes IQ', 'MHCU', 'Bakat Minat'] },
  { id: 'p7', name: 'Mira Anggraini, M.Psi', short: 'Mira', specialty: 'Keluarga', color: '#467053', clients: 9, weekSessions: 7, weekCap: 14, todayClients: 1, todayMax: 4, recentlyFreed: false, rating: 4.9, since: '2021', tags: ['Keluarga', 'Parenting'] },
];

function AdminPsikolog() {
  const [selected, setSelected] = React.useState('p1');
  const sel = PSY_DETAILS.find(p => p.id === selected);

  return (
    <AdminShell active="psikolog" breadcrumb="Manajemen · Psikolog" title="Tim Psikolog">
      <div style={{ padding: '18px 28px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="row gap-2">
          <div className="row gap-1" style={{ background: 'var(--cream-100)', borderRadius: 8, padding: 3 }}>
            {['Semua', 'Klinis Dewasa', 'Anak & Remaja', 'Tes', 'Keluarga'].map((t, i) => (
              <button key={t} className="btn btn-sm" style={{ height: 30, padding: '0 12px',
                background: i === 0 ? 'var(--bg-elev)' : 'transparent',
                boxShadow: i === 0 ? 'var(--shadow-xs)' : 'none',
                color: i === 0 ? 'var(--teal-800)' : 'var(--fg-muted)' }}>{t}</button>
            ))}
          </div>
        </div>
        <div className="row gap-2">
          <button className="btn btn-outline btn-sm"><Icon name="filter" size={14} /> Sortir</button>
          <button className="btn btn-primary btn-sm"><Icon name="plus" size={15} stroke="#fff" /> Tambah Psikolog</button>
        </div>
      </div>

      {/* BR-01 quota explainer */}
      <div style={{ padding: '0 28px 12px' }}> 
        <div className="card-flat" style={{ padding: 12, background: 'var(--info-soft)', borderColor: '#cfdde8', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Icon name="bell" size={14} stroke="var(--info)" />
          <div className="col">
            <span className="caption" style={{ fontWeight: 600, color: '#2c4a60' }}>Kuota harian psikolog (BR-01)</span>
            <span className="caption" style={{ fontSize: 11.5, color: '#2c4a60', lineHeight: 1.5, marginTop: 2 }}>
              Tiap psikolog default maksimal <strong>4 klien per hari</strong>. Begitu sesi <em>reschedule</em> atau <em>dibatalkan</em>,
              kuota terbuka otomatis — admin bisa langsung menambah klien lain ke psikolog tersebut tanpa unblock manual.
            </span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, padding: '0 28px 28px', display: 'flex', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, alignContent: 'start', overflowY: 'auto' }}>
          {PSY_DETAILS.map(p => {
            const isSel = p.id === selected;
            const util = Math.round((p.weekSessions / p.weekCap) * 100);
            const dayFull = p.todayClients >= p.todayMax;
            return (
              <div key={p.id} onClick={() => setSelected(p.id)}
                className="card" style={{ padding: 16, cursor: 'pointer', position: 'relative',
                  borderColor: isSel ? p.color : 'var(--border)',
                  boxShadow: isSel ? `0 0 0 2px ${p.color}33` : 'none' }}>
                {/* Status kuota harian */}
                <div className="row gap-1" style={{ position: 'absolute', top: 12, right: 12 }}>
                  {p.recentlyFreed && (
                    <span className="badge badge-success" style={{ height: 20, fontSize: 10 }} title="Slot baru terbuka karena reschedule/cancel">
                      slot baru terbuka
                    </span>
                  )}
                  <span className="badge" style={{ height: 20, fontSize: 10,
                    background: dayFull ? 'var(--danger-soft)' : 'var(--cream-100)',
                    color: dayFull ? 'var(--danger)' : 'var(--fg-muted)',
                    fontWeight: 600 }}>
                    hari ini {p.todayClients}/{p.todayMax}
                  </span>
                </div>

                <div className="row gap-3" style={{ marginBottom: 12, paddingRight: 90 }}>
                  <Avatar name={p.short} color={p.color} size="lg" />
                  <div className="col grow">
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--teal-800)' }}>{p.name}</span>
                    <span className="caption" style={{ marginTop: 2 }}>{p.specialty}</span>
                  </div>
                </div>
                <div className="row gap-1" style={{ flexWrap: 'wrap', marginBottom: 12 }}>
                  {p.tags.map(t => <span key={t} className="badge badge-neutral" style={{ height: 20 }}>{t}</span>)}
                </div>
                <div className="hr" style={{ margin: '0 -16px 12px' }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  <div><div className="caption">Klien</div><div style={{ fontSize: 18, fontWeight: 600, color: 'var(--teal-800)', fontFamily: 'var(--font-serif)' }}>{p.clients}</div></div>
                  <div><div className="caption">Minggu ini</div><div style={{ fontSize: 18, fontWeight: 600, color: 'var(--teal-800)', fontFamily: 'var(--font-serif)' }}>{p.weekSessions}</div></div>
                  <div><div className="caption">Utilisasi</div><div style={{ fontSize: 18, fontWeight: 600, color: util > 90 ? 'var(--danger)' : 'var(--teal-800)', fontFamily: 'var(--font-serif)' }}>{util}%</div></div>
                </div>
                <div style={{ height: 4, background: 'var(--cream-200)', borderRadius: 999, marginTop: 10 }}>
                  <div style={{ width: `${util}%`, height: '100%', background: util > 90 ? 'var(--danger)' : p.color, borderRadius: 999 }} />
                </div>
              </div>
            );
          })}
        </div>

        {sel && (
          <aside className="card" style={{ width: 320, flexShrink: 0, padding: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="eyebrow">Profil</span>
              <button className="btn btn-icon btn-ghost btn-sm"><Icon name="edit" size={14} /></button>
            </div>
            <div className="col gap-2" style={{ alignItems: 'center', textAlign: 'center', padding: '0 0 6px' }}>
              <Avatar name={sel.short} color={sel.color} size="lg" />
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--teal-800)', fontFamily: 'var(--font-serif)' }}>{sel.name}</div>
                <div className="caption">{sel.specialty} · sejak {sel.since}</div>
              </div>
              <div className="row gap-1">
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>★ {sel.rating}</span>
                <span className="caption">· {sel.clients} klien aktif</span>
              </div>
            </div>

            <div className="hr" />

            <div className="col gap-2">
              <span className="eyebrow">Sesi minggu ini</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
                {['Sen','Sel','Rab','Kam','Jum','Sab'].map((d, i) => {
                  const v = [4, 3, 2, 4, 3, 2][i];
                  return (
                    <div key={d} className="col gap-1" style={{ alignItems: 'center' }}>
                      <div style={{ width: '100%', height: 56, background: 'var(--cream-100)', borderRadius: 4, display: 'flex', alignItems: 'flex-end' }}>
                        <div style={{ width: '100%', height: `${(v/4)*100}%`, background: sel.color, borderRadius: 4, opacity: 0.85 }} />
                      </div>
                      <span style={{ fontSize: 10.5, color: 'var(--fg-muted)' }}>{d}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--teal-800)' }}>{v}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="hr" />

            <div className="col gap-2">
              <span className="eyebrow">Spesialisasi</span>
              <div className="row gap-1" style={{ flexWrap: 'wrap' }}>
                {sel.tags.map(t => <span key={t} className="badge badge-sage">{t}</span>)}
              </div>
            </div>

            <div className="col gap-2">
              <span className="eyebrow">Layanan tersedia</span>
              <div className="col gap-1">
                {['Konseling Individu', 'Terapi Dewasa', 'Konseling Pasangan'].map(s => (
                  <div key={s} className="row gap-2" style={{ padding: '6px 0' }}>
                    <Icon name="check" size={13} stroke="var(--success)" sw={2.5} />
                    <span className="body-sm">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn btn-outline btn-sm" style={{ marginTop: 'auto' }}>Lihat profil lengkap</button>
          </aside>
        )}
      </div>
    </AdminShell>
  );
}

window.AdminPsikolog = AdminPsikolog;
