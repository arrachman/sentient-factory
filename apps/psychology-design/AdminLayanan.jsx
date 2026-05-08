// Admin · Layanan — katalog layanan dikelompokkan per kategori.

const SVC_CATALOG = [
  { name: 'Konseling Individu Dewasa',  sessions: 1,  duration: '90 menit', kind: 'konseling', price: 'Rp 350.000', booked: 24 },
  { name: 'Konseling Individu Remaja',  sessions: 1,  duration: '90 menit', kind: 'konseling', price: 'Rp 350.000', booked: 9 },
  { name: 'Konseling Individu Anak',    sessions: 1,  duration: '60 menit', kind: 'anak',      price: 'Rp 350.000', booked: 18 },
  { name: 'Konseling Pasangan',         sessions: 1,  duration: '90 menit', kind: 'konseling', price: 'Rp 500.000', booked: 7 },
  { name: 'Konseling Keluarga',         sessions: 1,  duration: '90 menit', kind: 'konseling', price: 'Rp 600.000', booked: 4 },

  { name: 'Terapi Dewasa',              sessions: 4,  duration: '90 menit', kind: 'terapi', price: 'Rp 1.300.000', booked: 12 },
  { name: 'Terapi Pasangan',            sessions: 3,  duration: '90 menit', kind: 'terapi', price: 'Rp 1.450.000', booked: 5 },
  { name: 'Terapi Anak Singkat',        sessions: 4,  duration: '60 menit', kind: 'anak',   price: 'Rp 1.300.000', booked: 8 },
  { name: 'Terapi Anak Lengkap',        sessions: 10, duration: '60 menit', kind: 'anak',   price: 'Rp 3.250.000', booked: 14 },

  { name: 'Tes Kesiapan Sekolah Anak',  sessions: 2, duration: '120 menit', kind: 'tes', price: 'Rp 850.000', booked: 11 },
  { name: 'Tes Tumbuh Kembang Anak',    sessions: 2, duration: '120 menit', kind: 'tes', price: 'Rp 950.000', booked: 9 },
  { name: 'Tes Lengkap Anak',           sessions: 2, duration: '180 menit', kind: 'tes', price: 'Rp 1.500.000', booked: 6 },
  { name: 'Tes MHCU',                   sessions: 2, duration: '180 menit', kind: 'tes', price: 'Rp 350.000 / org', booked: 32 },
  { name: 'Tes Bakat Minat',            sessions: '1 atau 2', duration: '120 menit', kind: 'tes', price: 'Rp 650.000 / 1.100.000', booked: 16, note: 'BR-09: opsi paket 1 atau 2 sesi' },
  { name: 'Tes Lainnya',                sessions: 1, duration: '90–120 menit', kind: 'tes', price: 'Rp 450.000', booked: 8 },
  { name: 'Konsultasi Hasil Tes',       sessions: 1, duration: '60 menit',  kind: 'tes', price: 'Rp 250.000', booked: 22 },
];

const GROUPS = [
  { kind: 'konseling', label: 'Konseling',  desc: 'Sesi tunggal dengan psikolog' },
  { kind: 'terapi',    label: 'Terapi',     desc: 'Paket sesi terstruktur' },
  { kind: 'anak',      label: 'Layanan Anak', desc: 'Konseling, terapi, dan tes khusus anak' },
  { kind: 'tes',       label: 'Tes Psikologi', desc: 'Asesmen individu maupun korporat' },
];

function AdminLayanan() {
  return (
    <AdminShell active="layanan" breadcrumb="Manajemen · Layanan" title="Katalog Layanan">
      <div style={{ padding: '18px 28px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="row gap-2">
          <div style={{ position: 'relative', width: 280 }}>
            <span style={{ position: 'absolute', left: 11, top: 10 }}><Icon name="search" size={14} stroke="var(--fg-muted)" /></span>
            <input className="input" placeholder="Cari layanan…" style={{ paddingLeft: 32, height: 36, fontSize: 13 }} />
          </div>
        </div>
        <div className="row gap-2">
          <button className="btn btn-outline btn-sm"><Icon name="settings" size={14} /> Kelola Kategori</button>
          <button className="btn btn-primary btn-sm"><Icon name="plus" size={15} stroke="#fff" /> Layanan Baru</button>
        </div>
      </div>

      <div style={{ padding: '0 28px 16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {GROUPS.map(g => {
          const items = SVC_CATALOG.filter(s => s.kind === g.kind);
          const c = kindBar(g.kind);
          const totalBooked = items.reduce((s, i) => s + i.booked, 0);
          return (
            <div key={g.kind} className="card-flat" style={{ padding: 14 }}>
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="caption">{g.label}</span>
                <span style={{ width: 8, height: 8, background: c.bar, borderRadius: 2 }} />
              </div>
              <div className="row gap-2" style={{ alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 500, color: 'var(--teal-800)' }}>{items.length}</span>
                <span className="caption">{totalBooked} booking bulan ini</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1, minHeight: 0, padding: '0 28px 28px', overflowY: 'auto' }}>
        <div className="col gap-5">
          {GROUPS.map(g => {
            const items = SVC_CATALOG.filter(s => s.kind === g.kind);
            const c = kindBar(g.kind);
            return (
              <div key={g.kind} className="card" style={{ overflow: 'hidden' }}>
                <div className="row" style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between', borderLeft: `3px solid ${c.bar}` }}>
                  <div className="col">
                    <h2 className="h2" style={{ margin: 0 }}>{g.label}</h2>
                    <span className="caption" style={{ marginTop: 2 }}>{g.desc} · {items.length} layanan</span>
                  </div>
                  <button className="btn btn-ghost btn-sm">Tambah ke {g.label.toLowerCase()} <Icon name="plus" size={13} /></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1.3fr 1fr 80px', padding: '10px 18px', borderBottom: '1px solid var(--border)', background: 'var(--cream-50)', fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <span>Layanan</span><span>Sesi</span><span>Durasi</span><span>Harga</span><span>Booking</span><span></span>
                </div>
                {items.map((s, i) => (
                  <div key={s.name} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1.3fr 1fr 80px', padding: '12px 18px', borderBottom: i === items.length - 1 ? 'none' : '1px solid var(--border)', alignItems: 'center' }}>
                    <div className="col">
                      <div className="row gap-2" style={{ alignItems: 'center' }}>
                        <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--teal-800)' }}>{s.name}</span>
                        {s.note && <span className="badge" style={{ background: 'var(--info-soft)', color: '#2c4a60', height: 16, fontSize: 9.5 }}>flex</span>}
                      </div>
                      <span className="caption">{s.sessions === 1 ? 'sesi tunggal' : typeof s.sessions === 'string' ? 'paket ' + s.sessions + ' sesi' : 'paket ' + s.sessions + ' sesi'}{s.note && ' · ' + s.note}</span>
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--fg)' }}>{s.sessions}</span>
                    <span style={{ fontSize: 13, color: 'var(--fg)' }}>{s.duration}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)', fontVariantNumeric: 'tabular-nums' }}>{s.price}</span>
                    <div className="row gap-2">
                      <span style={{ fontSize: 13, color: 'var(--fg)', fontVariantNumeric: 'tabular-nums' }}>{s.booked}</span>
                      <div style={{ flex: 1, height: 4, background: 'var(--cream-200)', borderRadius: 999, maxWidth: 50 }}>
                        <div style={{ width: `${Math.min(100, s.booked * 3)}%`, height: '100%', background: c.bar, borderRadius: 999 }} />
                      </div>
                    </div>
                    <div className="row gap-1" style={{ justifyContent: 'flex-end' }}>
                      <button className="btn btn-icon btn-ghost btn-sm"><Icon name="edit" size={13} /></button>
                      <button className="btn btn-icon btn-ghost btn-sm"><Icon name="more" size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </AdminShell>
  );
}

window.AdminLayanan = AdminLayanan;
