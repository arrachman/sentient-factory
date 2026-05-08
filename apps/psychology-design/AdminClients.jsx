// Admin · Klien — daftar klien dengan filter, tabel, dan side panel detail.

const CLIENTS = [
  { id: 'c1', name: 'Anita Wulandari', phone: '+62 813 5544 8821', age: 32, cat: 'dewasa', psy: 'Vina', service: 'Konseling Individu', total: 4, last: '11 Mei 2026', next: 'Hari ini · 08.30', status: 'aktif' },
  { id: 'c2', name: 'Bayu Saputra', phone: '+62 821 9988 4412', age: 28, cat: 'dewasa', psy: 'Vina', service: 'Terapi Dewasa', total: 8, last: '12 Mei 2026', next: 'Hari ini · 12.00', status: 'aktif', sessionN: 2, sessionTotal: 4 },
  { id: 'c3', name: 'Citra Anggraini', phone: '+62 856 7733 9921', age: 29, cat: 'pasangan', psy: 'Vina', service: 'Konseling Pasangan', total: 1, last: '—', next: 'Hari ini · 15.15', status: 'baru' },
  { id: 'c4', name: 'Davi Pratama', phone: '+62 813 4421 7700', age: 8, cat: 'anak', psy: 'Diah', service: 'Terapi Anak Lengkap', total: 12, last: '13 Mei 2026', next: 'Hari ini · 08.30', status: 'aktif', sessionN: 6, sessionTotal: 10 },
  { id: 'c5', name: 'Eka Putri', phone: '+62 822 1144 5566', age: 5, cat: 'anak', psy: 'Diah', service: 'Tes Kesiapan Sekolah', total: 1, last: '—', next: 'Hari ini · 10.00', status: 'baru' },
  { id: 'c6', name: 'Gita Maharani & Hadi', phone: '+62 877 8899 1122', age: 31, cat: 'pasangan', psy: 'Rina', service: 'Terapi Pasangan', total: 2, last: '08 Mei 2026', next: 'Hari ini · 10.00', status: 'aktif', sessionN: 1, sessionTotal: 3 },
  { id: 'c7', name: 'Indra Kurniawan', phone: '+62 813 9988 7766', age: 45, cat: 'dewasa', psy: 'Rina', service: 'Konseling Individu', total: 3, last: '04 Mei 2026', next: '—', status: 'selesai' },
  { id: 'c8', name: 'Joko Mahendra', phone: '+62 856 2233 4455', age: 38, cat: 'dewasa', psy: 'Bagus', service: 'Konseling Individu', total: 2, last: '14 Mei 2026', next: 'Hari ini · 08.30', status: 'aktif' },
  { id: 'c9', name: 'Lina Permata', phone: '+62 822 5544 3322', age: 6, cat: 'anak', psy: 'Sari', service: 'Tes Tumbuh Kembang', total: 2, last: '12 Mei 2026', next: 'Hari ini · 12.00', status: 'aktif', sessionN: 2, sessionTotal: 2 },
  { id: 'c10', name: 'Maya Salsabila', phone: '+62 813 1199 8877', age: 9, cat: 'anak', psy: 'Sari', service: 'Konseling Anak', total: 1, last: '—', next: 'Hari ini · 15.15', status: 'baru' },
  { id: 'c11', name: 'Keluarga Oka', phone: '+62 821 6677 8899', age: 0, cat: 'keluarga', psy: 'Mira', service: 'Konseling Keluarga', total: 1, last: '—', next: 'Hari ini · 08.30', status: 'aktif' },
  { id: 'c12', name: 'Nadia Pertiwi', phone: '+62 877 4433 2211', age: 17, cat: 'remaja', psy: 'Tomi', service: 'Tes Bakat Minat', total: 1, last: '—', next: 'Hari ini · 13.30', status: 'baru' },
];

const catBadge = (cat) => ({
  dewasa:   { bg: 'var(--sage-100)',        fg: 'var(--sage-700)' },
  remaja:   { bg: 'var(--info-soft)',       fg: '#2c4a60' },
  anak:     { bg: 'var(--rose-100)',        fg: '#8b3d2a' },
  pasangan: { bg: 'var(--svc-terapi-soft)', fg: '#3d556d' },
  keluarga: { bg: 'var(--svc-tes-soft)',    fg: '#6b5320' },
}[cat]);

function AdminClients() {
  const [selected, setSelected] = React.useState('c2');
  const [filter, setFilter] = React.useState('semua');
  const sel = CLIENTS.find(c => c.id === selected);

  const filters = [
    { k: 'semua', lbl: 'Semua', count: CLIENTS.length },
    { k: 'aktif', lbl: 'Aktif', count: CLIENTS.filter(c => c.status === 'aktif').length },
    { k: 'baru', lbl: 'Baru', count: CLIENTS.filter(c => c.status === 'baru').length },
    { k: 'selesai', lbl: 'Selesai', count: CLIENTS.filter(c => c.status === 'selesai').length },
  ];
  const visible = filter === 'semua' ? CLIENTS : CLIENTS.filter(c => c.status === filter);

  return (
    <AdminShell active="clients" breadcrumb="Operasional · Klien" title="Daftar Klien">
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {/* Main list */}
        <div style={{ flex: 1, minWidth: 0, padding: '20px 28px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="row gap-1" style={{ background: 'var(--cream-100)', borderRadius: 8, padding: 3 }}>
              {filters.map(f => (
                <button key={f.k} onClick={() => setFilter(f.k)} className="btn btn-sm" style={{ height: 30, padding: '0 12px',
                  background: filter === f.k ? 'var(--bg-elev)' : 'transparent',
                  boxShadow: filter === f.k ? 'var(--shadow-xs)' : 'none',
                  color: filter === f.k ? 'var(--teal-800)' : 'var(--fg-muted)' }}>
                  {f.lbl} <span style={{ marginLeft: 4, fontSize: 11, opacity: 0.7 }}>{f.count}</span>
                </button>
              ))}
            </div>
            <div className="row gap-2">
              <button className="btn btn-outline btn-sm"><Icon name="filter" size={14} /> Kategori</button>
              <button className="btn btn-primary btn-sm"><Icon name="plus" size={15} stroke="#fff" /> Klien Baru</button>
            </div>
          </div>

          <div className="card" style={{ overflow: 'hidden', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.3fr 1.4fr 1.4fr 90px', padding: '10px 18px', borderBottom: '1px solid var(--border)', background: 'var(--cream-50)', fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span>Nama</span><span>Layanan aktif</span><span>Psikolog</span><span>Sesi terakhir</span><span>Sesi berikutnya</span><span>Status</span>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {visible.map((c) => {
                const cb = catBadge(c.cat);
                const isSel = c.id === selected;
                return (
                  <div key={c.id} onClick={() => setSelected(c.id)}
                    style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.3fr 1.4fr 1.4fr 90px', padding: '12px 18px', borderBottom: '1px solid var(--border)', alignItems: 'center', cursor: 'pointer', background: isSel ? 'var(--sage-50)' : 'transparent', borderLeft: isSel ? '3px solid var(--sage-500)' : '3px solid transparent', paddingLeft: isSel ? 15 : 18 }}>
                    <div className="row gap-3">
                      <Avatar name={c.name} color={cb.fg} size="md" />
                      <div className="col" style={{ minWidth: 0 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--teal-800)' }}>{c.name}</span>
                        <span className="caption">{c.age > 0 ? c.age + ' thn · ' : ''}<span style={{ background: cb.bg, color: cb.fg, padding: '1px 6px', borderRadius: 4, fontSize: 10.5, fontWeight: 500, textTransform: 'capitalize' }}>{c.cat}</span></span>
                      </div>
                    </div>
                    <span style={{ fontSize: 12.5, color: 'var(--fg)' }}>{c.service}{c.sessionTotal && <span className="caption"> · {c.sessionN}/{c.sessionTotal}</span>}</span>
                    <span style={{ fontSize: 12.5, color: 'var(--fg)' }}>{c.psy}</span>
                    <span style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>{c.last}</span>
                    <span style={{ fontSize: 12.5, color: c.next === '—' ? 'var(--fg-muted)' : 'var(--teal-800)', fontWeight: c.next === '—' ? 400 : 500 }}>{c.next}</span>
                    <span className={'badge ' + (c.status === 'aktif' ? 'badge-sage' : c.status === 'baru' ? 'badge-warn' : 'badge-neutral')} style={{ textTransform: 'capitalize' }}>{c.status}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="caption">Menampilkan {visible.length} dari {CLIENTS.length} klien</span>
              <div className="row gap-1">
                <button className="btn btn-outline btn-sm btn-icon"><Icon name="chevL" size={14} /></button>
                <button className="btn btn-outline btn-sm" style={{ background: 'var(--sage-100)', color: 'var(--sage-800)', borderColor: 'var(--sage-300)' }}>1</button>
                <button className="btn btn-outline btn-sm">2</button>
                <button className="btn btn-outline btn-sm btn-icon"><Icon name="chevR" size={14} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Detail panel */}
        {sel && (
          <aside style={{ width: 360, borderLeft: '1px solid var(--border)', background: 'var(--bg-elev)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ padding: 20, borderBottom: '1px solid var(--border)' }}>
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
                <span className="eyebrow">Detail klien</span>
                <button className="btn btn-icon btn-ghost btn-sm"><Icon name="x" size={15} /></button>
              </div>
              <div className="row gap-3" style={{ marginBottom: 14 }}>
                <Avatar name={sel.name} color={catBadge(sel.cat).fg} size="lg" />
                <div className="col grow">
                  <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--teal-800)', fontFamily: 'var(--font-serif)' }}>{sel.name}</span>
                  <span className="caption">{sel.age > 0 ? sel.age + ' tahun · ' : ''}<span style={{ textTransform: 'capitalize' }}>{sel.cat}</span></span>
                </div>
              </div>
              <div className="row gap-2">
                <button className="btn btn-primary btn-sm" style={{ flex: 1 }}><Icon name="cal" size={14} stroke="#fff" /> Jadwalkan</button>
                <button className="btn btn-outline btn-sm btn-icon"><Icon name="msg" size={14} /></button>
                <button className="btn btn-outline btn-sm btn-icon"><Icon name="edit" size={14} /></button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="col gap-2">
                <span className="eyebrow">Kontak</span>
                <div className="row gap-2"><Icon name="wa" size={14} stroke="var(--success)" /><span className="body-sm">{sel.phone}</span></div>
              </div>

              <div className="col gap-2">
                <span className="eyebrow">Layanan saat ini</span>
                <div className="card-flat" style={{ padding: 12, background: 'var(--cream-50)' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--teal-800)' }}>{sel.service}</div>
                  <div className="caption" style={{ marginTop: 2 }}>Psikolog: {sel.psy}</div>
                  {sel.sessionTotal && (
                    <div style={{ marginTop: 10 }}>
                      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
                        <span className="caption">Progres</span>
                        <span className="caption" style={{ fontWeight: 600, color: 'var(--teal-800)' }}>sesi {sel.sessionN}/{sel.sessionTotal}</span>
                      </div>
                      <div style={{ height: 4, background: 'var(--cream-200)', borderRadius: 999 }}>
                        <div style={{ width: `${(sel.sessionN / sel.sessionTotal) * 100}%`, height: '100%', background: 'var(--sage-500)', borderRadius: 999 }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="col gap-2">
                <span className="eyebrow">Riwayat sesi</span>
                <div className="col gap-2">
                  {[
                    { date: '12 Mei 2026', service: sel.service, psy: sel.psy, status: 'selesai' },
                    { date: '05 Mei 2026', service: sel.service, psy: sel.psy, status: 'selesai' },
                    { date: '28 Apr 2026', service: 'Konsultasi Awal', psy: sel.psy, status: 'selesai' },
                  ].map((s, i) => (
                    <div key={i} className="card-flat" style={{ padding: 10 }}>
                      <div className="row" style={{ justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--teal-800)' }}>{s.date}</span>
                        <span className="badge badge-success" style={{ height: 18, fontSize: 10 }}>{s.status}</span>
                      </div>
                      <span className="caption" style={{ marginTop: 2 }}>{s.service} · {s.psy}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col gap-2">
                <span className="eyebrow">Catatan internal</span>
                <p className="body-sm" style={{ margin: 0, color: 'var(--fg-muted)', padding: 12, background: 'var(--cream-50)', borderRadius: 8, lineHeight: 1.55 }}>
                  Klien proaktif, hadir tepat waktu di seluruh sesi sebelumnya. Preferensi sesi pagi.
                </p>
              </div>
            </div>
          </aside>
        )}
      </div>
    </AdminShell>
  );
}

window.AdminClients = AdminClients;
