// PsikologDashboard — landing screen for staff psikolog after login.
// Personal: jadwal hari ini, stats minggu, action queue, klien aktif.

function PsikologDashboard() {
  const today = [
    { time: '09.00', client: 'Rina A.', service: 'Konseling Dewasa · Sesi 3/4', room: 'Sage Room', status: 'done' },
    { time: '10.30', client: 'Bayu S.', service: 'Konseling Dewasa · Sesi 1/4', room: 'Sage Room', status: 'now' },
    { time: '13.00', client: 'Dito P.', service: 'Konseling Dewasa · Sesi 2/4', room: 'Sky Room', status: 'next' },
    { time: '15.00', client: 'Maya & Hadi', service: 'Konseling Pasangan · Sesi 1/6', room: 'Sunset Room', status: 'next' },
  ];
  const queue = [
    ['Catatan sesi belum diisi', 'Rina A. · sesi pagi', 'cal'],
    ['Klien minta reschedule', 'Bayu S. → 24 Mei', 'msg'],
    ['Feedback klien baru', '"Sangat membantu, terima kasih"', 'check'],
    ['Paket Dito akan habis', 'Sesi 2/4 · tawarkan lanjut', 'bell'],
  ];

  return (
    <AdminShell role="psikolog" active="dashboard"
      breadcrumb="Dashboard"
      title="Selamat pagi, Vina">
      <div style={{ flex: 1, padding: 28, overflow: 'auto' }}>
        {/* Top stat strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
          {[
            ['Sesi hari ini', '4', '1 selesai · 1 berlangsung'],
            ['Sesi minggu ini', '17', 'dari kapasitas 24 (71%)'],
            ['Klien aktif', '12', '2 baru bulan ini'],
            ['Catatan tertunda', '3', 'isi sebelum akhir hari', 'warn'],
          ].map(([lbl, val, hint, tone]) => (
            <div key={lbl} className="card" style={{ padding: 18, background: tone === 'warn' ? 'var(--warn-soft)' : 'var(--bg-elev)', borderColor: tone === 'warn' ? '#e5d5a8' : undefined }}>
              <span className="caption">{lbl}</span>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 500, color: 'var(--teal-800)', lineHeight: 1.1, marginTop: 4 }}>{val}</div>
              <span className="caption" style={{ marginTop: 4, color: tone === 'warn' ? '#7a5a1f' : 'var(--fg-muted)' }}>{hint}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
          {/* Jadwal hari ini */}
          <div className="card" style={{ padding: 20 }}>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
              <div className="col">
                <span className="eyebrow">Senin · 20 Mei</span>
                <h2 style={{ margin: '2px 0 0', fontFamily: 'var(--font-serif)', fontSize: 19, fontWeight: 500, color: 'var(--teal-800)' }}>Jadwal hari ini</h2>
              </div>
              <button className="btn btn-outline btn-sm">Lihat semua →</button>
            </div>
            <div className="col gap-2">
              {today.map((s, i) => {
                const tone = s.status === 'done' ? 'cream' : s.status === 'now' ? 'sage' : 'teal';
                return (
                  <div key={i} className="row gap-3" style={{
                    padding: 14, borderRadius: 10,
                    background: tone === 'sage' ? 'var(--sage-50)' : 'var(--cream-50)',
                    border: '1px solid ' + (tone === 'sage' ? 'var(--sage-300)' : 'transparent'),
                    opacity: s.status === 'done' ? 0.62 : 1,
                  }}>
                    <div className="col" style={{ width: 60 }}>
                      <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--teal-800)', fontFamily: 'var(--font-serif)' }}>{s.time}</span>
                    </div>
                    <div className="col grow">
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--teal-800)' }}>{s.client}</span>
                      <span className="caption" style={{ marginTop: 2 }}>{s.service} · {s.room}</span>
                    </div>
                    {s.status === 'done' && <span className="badge" style={{ background: 'var(--cream-200)', color: 'var(--fg-muted)', height: 22 }}><Icon name="check" size={11} sw={2.5} /> Selesai</span>}
                    {s.status === 'now' && <span className="badge badge-sage" style={{ height: 22 }}>Berlangsung</span>}
                    {s.status === 'next' && <button className="btn btn-ghost btn-sm">Buka</button>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action queue + activity */}
          <div className="col gap-3">
            <div className="card" style={{ padding: 20 }}>
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
                <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 500, color: 'var(--teal-800)' }}>Perlu tindakan</h2>
                <span className="badge" style={{ background: 'var(--warn-soft)', color: '#7a5a1f', height: 20 }}>{queue.length}</span>
              </div>
              <div className="col gap-1">
                {queue.map(([t, sub, ic], i) => (
                  <div key={i} className="row gap-2" style={{ padding: '10px 4px', borderTop: i ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--cream-100)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <Icon name={ic} size={13} stroke="var(--teal-700)" />
                    </div>
                    <div className="col grow" style={{ minWidth: 0 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}>{t}</span>
                      <span className="caption" style={{ fontSize: 11, marginTop: 1 }}>{sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini chart sesi minggu */}
            <div className="card" style={{ padding: 20 }}>
              <h2 style={{ margin: '0 0 14px', fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 500, color: 'var(--teal-800)' }}>Sesi minggu ini</h2>
              <div className="row" style={{ alignItems: 'flex-end', gap: 8, height: 100 }}>
                {[3, 4, 4, 3, 2, 1, 0].map((v, i) => {
                  const max = 4;
                  const isToday = i === 0;
                  return (
                    <div key={i} className="col grow" style={{ alignItems: 'center', gap: 4 }}>
                      <div style={{ width: '100%', height: (v / max) * 80, background: isToday ? 'var(--sage-500)' : 'var(--sage-200)', borderRadius: 4 }} />
                      <span className="caption" style={{ fontSize: 10 }}>{['Sn','Sl','Rb','Km','Jm','Sb','Mg'][i]}</span>
                    </div>
                  );
                })}
              </div>
              <div className="row" style={{ marginTop: 12, justifyContent: 'space-between' }}>
                <span className="caption">Total · 17 sesi</span>
                <span className="caption" style={{ color: 'var(--sage-700)', fontWeight: 600 }}>+12% vs minggu lalu</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

window.PsikologDashboard = PsikologDashboard;
