// Psikolog · Klien Saya, Catatan Klinis, Profil — combined.

// ────────────────────────────────────────────────────────────
// Klien Saya — only own clients (BR-04), edit catatan klinis allowed.
// PRD US-P03: lihat klien hari ini + ruangan + jam.
// PRD BR-06: tracking sesi ke-n dari total sesi (multi-sesi).
// PRD US-P06: psikolog HANYA lihat data klien sendiri.
// ────────────────────────────────────────────────────────────
const PSK_KLIEN = [
  { id: 'rin', name: 'Rina Andreyani',     ini: 'RA', kat: 'Dewasa',   age: 28, sejak: '14 Mar',  layanan: 'Konseling Dewasa',   sesiNum: 3, sesiTot: 4, next: 'Hari ini · 09.00', nextRoom: 'K-2',       status: 'aktif',         risk: 'rendah',  wa: '+62 813 5544 8821', email: 'rina.a@mail.com',   gad7: 14, phq9: 8,  lastSession: '14 Mei',   lastGap: 7,  flags: ['follow-up'], notes: [
      ['Sesi 3 · 14 Mei', 'Latihan grounding membantu. Tidur membaik 2 hari terakhir. Lanjut journaling.'],
      ['Sesi 2 · 07 Mei', 'Mulai mengidentifikasi pemicu kecemasan di tempat kerja. Diberi PR breathing 4-7-8.'],
      ['Sesi 1 · 30 Apr', 'Asesmen awal: GAD-7 = 14 (sedang). Stres pekerjaan + sulit tidur. Setuju paket 4 sesi.'],
    ] },
  { id: 'bay', name: 'Bayu Saputra',       ini: 'BS', kat: 'Dewasa',   age: 34, sejak: '02 Apr',  layanan: 'Konseling Dewasa',   sesiNum: 1, sesiTot: 4, next: 'Hari ini · 10.30', nextRoom: 'K-1',       status: 'aktif',         risk: 'sedang',  wa: '+62 821 9988 4412', email: 'bayu.s@mail.com',   gad7: 11, phq9: 12, lastSession: '21 Apr',   lastGap: 14, flags: [], notes: [
      ['Sesi 1 · 21 Apr', 'Asesmen awal: stres karir, konflik dengan atasan. PHQ-9 sedang. Mulai psikoedukasi.'],
    ] },
  { id: 'dit', name: 'Dito Pranata',       ini: 'DP', kat: 'Dewasa',   age: 31, sejak: '08 Apr',  layanan: 'Konseling Dewasa',   sesiNum: 2, sesiTot: 4, next: 'Hari ini · 13.00', nextRoom: 'K-Besar',   status: 'aktif',         risk: 'rendah',  wa: '+62 856 7733 9921', email: 'dito.p@mail.com',   gad7: 9,  phq9: 6,  lastSession: '07 Mei',   lastGap: 14, flags: [], notes: [
      ['Sesi 2 · 07 Mei', 'Diskusi pola pikir negatif. Klien antusias mencoba thought record minggu depan.'],
      ['Sesi 1 · 23 Apr', 'Keluhan utama: kecemasan presentasi. GAD-7 = 9 (ringan).'],
    ] },
  { id: 'mah', name: 'Maya & Hadi Wibowo', ini: 'MH', kat: 'Pasangan', age: 32, sejak: '01 Apr',  layanan: 'Konseling Pasangan', sesiNum: 1, sesiTot: 6, next: 'Hari ini · 15.00', nextRoom: 'K-Besar',   status: 'aktif',         risk: 'sedang',  wa: '+62 877 2233 4488', email: 'maya.h@mail.com',   gad7: null, phq9: null, lastSession: '24 Apr', lastGap: 13, flags: ['high-engagement'], notes: [
      ['Sesi 1 · 24 Apr', 'Sesi awal pasangan. Identifikasi pola komunikasi. Setuju komitmen 6 sesi.'],
    ] },
  { id: 'sar', name: 'Sari Wulandari',     ini: 'SW', kat: 'Dewasa',   age: 41, sejak: '03 Feb',  layanan: 'Konseling Dewasa',   sesiNum: 4, sesiTot: 4, next: '—',                nextRoom: '—',         status: 'paket selesai', risk: 'rendah',  wa: '+62 813 4421 7700', email: 'sari.w@mail.com',   gad7: 4,  phq9: 3,  lastSession: '21 Mei',   lastGap: 0,  flags: ['terminasi'], notes: [
      ['Sesi 4 · 21 Mei', 'Sesi terminasi. Outcome baik: GAD-7 turun 11→4. Diskusi maintenance.'],
    ] },
  { id: 'lil', name: 'Lila Ramadhani',     ini: 'LR', kat: 'Remaja',   age: 16, sejak: '15 Apr',  layanan: 'Konseling Remaja',   sesiNum: 2, sesiTot: 4, next: '22 Mei · 14.00',  nextRoom: 'K-3',       status: 'aktif',         risk: 'sedang',  wa: '+62 822 1144 5566', email: 'lila.r@mail.com',   gad7: 12, phq9: 10, lastSession: '15 Mei',   lastGap: 5,  flags: ['parent-consent'], notes: [
      ['Sesi 2 · 15 Mei', 'Eksplorasi tekanan akademik. Klien lebih terbuka dari sesi 1.'],
      ['Sesi 1 · 30 Apr', 'Asesmen awal. Tekanan ujian + konflik teman. Orang tua menyetujui pendekatan.'],
    ] },
  { id: 'tin', name: 'Tina Hapsari',       ini: 'TH', kat: 'Dewasa',   age: 26, sejak: '02 Mei',  layanan: 'Konseling Dewasa',   sesiNum: 1, sesiTot: 4, next: '23 Mei · 10.00',  nextRoom: 'K-2',       status: 'baru',          risk: 'belum dinilai', wa: '+62 813 9988 7766', email: 'tina.h@mail.com', gad7: null, phq9: null, lastSession: null, lastGap: null, flags: ['intake'], notes: [] },
];

const RISK_TONE = {
  'rendah':         { bg: 'var(--success-soft)', fg: 'var(--success)', dot: 'var(--success)' },
  'sedang':         { bg: 'var(--warning-soft)', fg: '#8a4a00',        dot: '#c98a00' },
  'tinggi':         { bg: 'var(--danger-soft)',  fg: 'var(--danger)',  dot: 'var(--danger)' },
  'belum dinilai':  { bg: 'var(--cream-200)',    fg: 'var(--fg-muted)', dot: 'var(--fg-muted)' },
};

const STATUS_TONE = {
  'aktif':         { bg: 'var(--sage-100)',  fg: 'var(--sage-800)' },
  'baru':          { bg: 'var(--teal-700)',  fg: '#fff' },
  'paket selesai': { bg: 'var(--cream-200)', fg: 'var(--fg-muted)' },
};

function PsikologKlienSaya() {
  const [statusTab, setStatusTab] = React.useState('Semua');
  const [katFilter, setKatFilter] = React.useState('Semua');
  const [sortBy, setSortBy] = React.useState('next');
  const [query, setQuery] = React.useState('');
  const [selectedId, setSelectedId] = React.useState('rin');
  const [hoveredId, setHoveredId] = React.useState(null);

  // Filter pipeline
  let rows = PSK_KLIEN.slice();
  if (statusTab === 'Aktif')   rows = rows.filter(c => c.status === 'aktif');
  if (statusTab === 'Baru')    rows = rows.filter(c => c.status === 'baru');
  if (statusTab === 'Selesai') rows = rows.filter(c => c.status === 'paket selesai');
  if (katFilter !== 'Semua')   rows = rows.filter(c => c.kat === katFilter);
  if (query.trim()) {
    const q = query.toLowerCase();
    rows = rows.filter(c => c.name.toLowerCase().includes(q) || c.layanan.toLowerCase().includes(q));
  }
  // Sort
  if (sortBy === 'next')  rows.sort((a, b) => (a.next === '—' ? 1 : b.next === '—' ? -1 : a.next.localeCompare(b.next)));
  if (sortBy === 'name')  rows.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === 'risk')  { const o = { 'tinggi':0,'sedang':1,'rendah':2,'belum dinilai':3 }; rows.sort((a,b) => o[a.risk]-o[b.risk]); }

  const counts = {
    Semua:   PSK_KLIEN.length,
    Aktif:   PSK_KLIEN.filter(c => c.status === 'aktif').length,
    Baru:    PSK_KLIEN.filter(c => c.status === 'baru').length,
    Selesai: PSK_KLIEN.filter(c => c.status === 'paket selesai').length,
  };
  const todayCount = PSK_KLIEN.filter(c => c.next.startsWith('Hari ini')).length;

  const selected = PSK_KLIEN.find(c => c.id === selectedId) || rows[0] || PSK_KLIEN[0];
  const sesiPct = selected ? Math.round((selected.sesiNum / selected.sesiTot) * 100) : 0;

  return (
    <AdminShell role="psikolog" active="clients-mine"
      breadcrumb="Praktik · Klien"
      title="Klien saya">
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div style={{ flex: 1.5, padding: 20, overflow: 'auto', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Privacy banner — BR-04 */}
          <div className="row gap-2" style={{ padding: '8px 12px', background: 'var(--info-soft)', border: '1px solid #cfdde8', borderRadius: 8, alignItems: 'center' }}>
            <Icon name="eye" size={14} stroke="var(--info)" />
            <span style={{ fontSize: 12, color: '#2c4a60', lineHeight: 1.4 }}>
              Menampilkan <strong>hanya klien Anda</strong> ({PSK_KLIEN.length} klien). Data klien psikolog lain tidak bisa diakses sesuai kebijakan privasi (BR-04).
            </span>
          </div>

          {/* Toolbar: status tabs + search */}
          <div className="row" style={{ gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="row gap-1" style={{ background: 'var(--bg-elev)', padding: 4, borderRadius: 8, border: '1px solid var(--border)' }}>
              {['Semua', 'Aktif', 'Baru', 'Selesai'].map(t => {
                const sel = t === statusTab;
                return (
                  <button key={t} onClick={() => setStatusTab(t)} className="btn btn-sm" style={{ height: 28, padding: '0 12px', background: sel ? 'var(--sage-500)' : 'transparent', color: sel ? '#fff' : 'var(--fg)', fontWeight: sel ? 600 : 500, cursor: 'pointer' }}>
                    {t} <span style={{ marginLeft: 4, opacity: 0.8 }}>{counts[t]}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 280 }}>
              <span style={{ position: 'absolute', left: 11, top: 9 }}><Icon name="search" size={14} stroke="var(--fg-muted)" /></span>
              <input className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama klien atau layanan…" style={{ paddingLeft: 32, height: 34, fontSize: 13, width: '100%' }} />
            </div>

            <select className="input" value={katFilter} onChange={(e) => setKatFilter(e.target.value)} style={{ height: 34, fontSize: 12.5, padding: '0 10px' }}>
              <option value="Semua">Semua kategori</option>
              <option value="Anak">Anak</option>
              <option value="Remaja">Remaja</option>
              <option value="Dewasa">Dewasa</option>
              <option value="Pasangan">Pasangan</option>
              <option value="Keluarga">Keluarga</option>
            </select>

            <select className="input" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ height: 34, fontSize: 12.5, padding: '0 10px' }}>
              <option value="next">Urut: sesi terdekat</option>
              <option value="name">Urut: nama A–Z</option>
              <option value="risk">Urut: risiko tertinggi</option>
            </select>

            <span className="grow" />
            <span className="caption" style={{ fontVariantNumeric: 'tabular-nums' }}>
              <strong style={{ color: 'var(--sage-700)' }}>{todayCount} hari ini</strong> · {rows.length}/{PSK_KLIEN.length} klien
            </span>
          </div>

          {/* Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 0.8fr 1.4fr 1.5fr 1.6fr 0.9fr 0.5fr', padding: '12px 16px', background: 'var(--cream-50)', borderBottom: '1px solid var(--border)' }}>
              {['Klien', 'Kategori', 'Layanan', 'Progres sesi', 'Sesi berikutnya', 'Risiko', ''].map((h, i) => (
                <span key={i} className="eyebrow" style={{ fontSize: 10.5 }}>{h}</span>
              ))}
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {rows.length === 0 ? (
                <div className="col" style={{ padding: '60px 24px', alignItems: 'center', textAlign: 'center', gap: 8 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 999, background: 'var(--cream-100)', display: 'grid', placeItems: 'center' }}>
                    <Icon name="users" size={20} stroke="var(--fg-muted)" />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--teal-800)' }}>Tidak ada klien yang cocok</span>
                  <span className="caption" style={{ maxWidth: 320, lineHeight: 1.45 }}>
                    {query ? `Tidak ada klien dengan kata kunci "${query}".` : `Belum ada klien dengan filter saat ini.`}
                    {' '}Coba ubah filter atau hapus pencarian.
                  </span>
                  {(query || katFilter !== 'Semua' || statusTab !== 'Semua') && (
                    <button className="btn btn-outline btn-sm" onClick={() => { setQuery(''); setKatFilter('Semua'); setStatusTab('Semua'); }} style={{ marginTop: 6 }}>Reset filter</button>
                  )}
                </div>
              ) : rows.map((c, i) => {
                const isSel = c.id === selected.id;
                const isHov = c.id === hoveredId;
                const pct = Math.round((c.sesiNum / c.sesiTot) * 100);
                const rt = RISK_TONE[c.risk];
                const st = STATUS_TONE[c.status];
                const isToday = c.next.startsWith('Hari ini');
                return (
                  <div key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    onMouseEnter={() => setHoveredId(c.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      display: 'grid', gridTemplateColumns: '1.8fr 0.8fr 1.4fr 1.5fr 1.6fr 0.9fr 0.5fr',
                      padding: '14px 16px', borderTop: i ? '1px solid var(--border)' : 'none',
                      alignItems: 'center', cursor: 'pointer',
                      background: isSel ? 'var(--sage-50)' : isHov ? 'var(--cream-50)' : 'transparent',
                      borderLeft: isSel ? '3px solid var(--sage-500)' : '3px solid transparent',
                      paddingLeft: isSel ? 13 : 16,
                    }}>
                    <div className="row gap-2">
                      <div style={{ width: 32, height: 32, borderRadius: 999, background: 'var(--sage-200)', color: 'var(--sage-800)', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600, position: 'relative' }}>
                        {c.ini}
                        <span style={{ position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderRadius: 999, background: rt.dot, border: '2px solid var(--bg-elev)' }} title={'Risiko: ' + c.risk} />
                      </div>
                      <div className="col" style={{ minWidth: 0 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--teal-800)' }}>{c.name}</span>
                        <div className="row gap-1" style={{ alignItems: 'center', marginTop: 1 }}>
                          <span className="badge" style={{ background: st.bg, color: st.fg, height: 16, fontSize: 9.5, padding: '0 6px' }}>{c.status}</span>
                          {c.flags.map(f => (
                            <span key={f} className="badge" style={{ background: 'var(--cream-200)', color: 'var(--fg-muted)', height: 16, fontSize: 9.5, padding: '0 6px' }}>{f}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="caption">{c.kat}</span>
                    <span style={{ fontSize: 12.5, color: 'var(--fg)' }}>{c.layanan}</span>
                    <div className="col" style={{ gap: 4 }}>
                      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--sage-700)', fontFamily: 'var(--font-serif)' }}>{c.sesiNum} dari {c.sesiTot}</span>
                        <span className="caption" style={{ fontSize: 10.5 }}>{pct}%</span>
                      </div>
                      <div style={{ height: 4, background: 'var(--cream-200)', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ width: pct + '%', height: '100%', background: pct === 100 ? 'var(--cream-300)' : 'var(--sage-500)' }} />
                      </div>
                    </div>
                    <div className="col" style={{ gap: 2 }}>
                      <span style={{ fontSize: 12.5, color: isToday ? 'var(--sage-700)' : 'var(--fg)', fontWeight: isToday ? 600 : 400 }}>{c.next}</span>
                      {c.nextRoom !== '—' && <span className="caption" style={{ fontSize: 10.5 }}>📍 {c.nextRoom}</span>}
                    </div>
                    <span className="badge" style={{ background: rt.bg, color: rt.fg, height: 20, fontSize: 10.5, textTransform: 'capitalize' }}>{c.risk}</span>
                    {/* Quick actions on hover */}
                    <div className="row gap-1" style={{ opacity: isHov || isSel ? 1 : 0.15, transition: 'opacity .15s', justifyContent: 'flex-end' }}>
                      <button onClick={(e) => { e.stopPropagation(); }} className="btn btn-icon btn-ghost btn-sm" title={'WA: ' + c.wa}><Icon name="wa" size={13} /></button>
                      <button onClick={(e) => { e.stopPropagation(); }} className="btn btn-icon btn-ghost btn-sm" title="Buka catatan klinis"><Icon name="edit" size={13} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detail panel — dynamic per selected client */}
        <aside style={{ width: 380, padding: 22, background: 'var(--cream-50)', overflow: 'auto' }}>
          <div className="row gap-3" style={{ marginBottom: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: 999, background: 'var(--sage-200)', color: 'var(--sage-800)', display: 'grid', placeItems: 'center', fontSize: 19, fontWeight: 600, flexShrink: 0, position: 'relative' }}>
              {selected.ini}
              <span style={{ position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderRadius: 999, background: RISK_TONE[selected.risk].dot, border: '2.5px solid var(--cream-50)' }} />
            </div>
            <div className="col grow" style={{ minWidth: 0 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--teal-800)' }}>{selected.name}</span>
              <span className="caption">{selected.kat} · {selected.age} thn · klien sejak {selected.sejak}</span>
              <div className="row gap-1" style={{ marginTop: 4 }}>
                <span className="badge" style={{ background: STATUS_TONE[selected.status].bg, color: STATUS_TONE[selected.status].fg, height: 18, fontSize: 10 }}>{selected.status}</span>
                <span className="badge" style={{ background: RISK_TONE[selected.risk].bg, color: RISK_TONE[selected.risk].fg, height: 18, fontSize: 10, textTransform: 'capitalize' }}>risiko {selected.risk}</span>
              </div>
            </div>
          </div>

          {/* Kontak */}
          <div className="card-flat" style={{ padding: 12, marginBottom: 12 }}>
            <span className="eyebrow" style={{ marginBottom: 6 }}>Kontak</span>
            <div className="col gap-1" style={{ marginTop: 4 }}>
              <div className="row gap-2" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="row gap-2" style={{ alignItems: 'center' }}><Icon name="wa" size={12} stroke="var(--success)" /><span style={{ fontSize: 12.5, color: 'var(--fg)', fontFamily: 'var(--font-mono, monospace)' }}>{selected.wa}</span></span>
                <button className="btn btn-ghost btn-sm" style={{ height: 24, padding: '0 8px', fontSize: 11 }}>Salin</button>
              </div>
              <div className="row gap-2" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="row gap-2" style={{ alignItems: 'center' }}><Icon name="msg" size={12} stroke="var(--info)" /><span style={{ fontSize: 12.5, color: 'var(--fg)' }}>{selected.email}</span></span>
                <button className="btn btn-ghost btn-sm" style={{ height: 24, padding: '0 8px', fontSize: 11 }}>Salin</button>
              </div>
            </div>
          </div>

          {/* Sesi mendatang */}
          <div className="card-flat" style={{ padding: 12, marginBottom: 12 }}>
            <span className="eyebrow">Sesi berikutnya</span>
            {selected.next === '—' ? (
              <div className="col" style={{ marginTop: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-muted)' }}>Belum dijadwalkan</span>
                <span className="caption" style={{ marginTop: 2 }}>Hubungi admin untuk menjadwalkan sesi lanjutan</span>
              </div>
            ) : (
              <div className="row" style={{ marginTop: 8, justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="col">
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--teal-800)' }}>{selected.next}</span>
                  <span className="caption" style={{ marginTop: 2 }}>📍 Ruangan {selected.nextRoom} · sesi {selected.sesiNum + 1}/{selected.sesiTot}</span>
                </div>
                <button className="btn btn-outline btn-sm" style={{ height: 28 }}>Request reschedule</button>
              </div>
            )}
          </div>

          {/* Progres paket */}
          <div className="card-flat" style={{ padding: 14, marginBottom: 12 }}>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="eyebrow">Progres paket</span>
              <span className="caption" style={{ fontSize: 10.5 }}>{selected.layanan}</span>
            </div>
            <div className="row" style={{ marginTop: 8, alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 22, fontWeight: 600, color: 'var(--teal-800)', fontFamily: 'var(--font-serif)' }}>{selected.sesiNum} dari {selected.sesiTot}</span>
              <span className="caption">sesi</span>
            </div>
            <div style={{ height: 6, background: 'var(--cream-200)', borderRadius: 999, marginTop: 8, overflow: 'hidden' }}>
              <div style={{ width: sesiPct + '%', height: '100%', background: sesiPct === 100 ? 'var(--cream-300)' : 'var(--sage-500)' }} />
            </div>
            {selected.lastSession && (
              <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
                <span className="caption">Sesi terakhir</span>
                <span style={{ fontSize: 11.5, color: 'var(--teal-800)', fontWeight: 500 }}>{selected.lastSession}{selected.lastGap > 0 && ` · ${selected.lastGap} hari lalu`}</span>
              </div>
            )}
          </div>

          {/* Asesmen */}
          {(selected.gad7 != null || selected.phq9 != null) && (
            <div className="card-flat" style={{ padding: 12, marginBottom: 12 }}>
              <span className="eyebrow">Asesmen terbaru</span>
              <div className="row gap-2" style={{ marginTop: 8 }}>
                {selected.gad7 != null && (
                  <div className="col" style={{ flex: 1, padding: 10, background: 'var(--bg-elev)', borderRadius: 6 }}>
                    <span className="caption" style={{ fontSize: 10.5 }}>GAD-7</span>
                    <div className="row gap-2" style={{ alignItems: 'baseline', marginTop: 2 }}>
                      <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--sage-700)', fontFamily: 'var(--font-serif)' }}>{selected.gad7}</span>
                      <span className="caption" style={{ fontSize: 10 }}>/ 21 · {selected.gad7 < 5 ? 'minimal' : selected.gad7 < 10 ? 'ringan' : selected.gad7 < 15 ? 'sedang' : 'berat'}</span>
                    </div>
                  </div>
                )}
                {selected.phq9 != null && (
                  <div className="col" style={{ flex: 1, padding: 10, background: 'var(--bg-elev)', borderRadius: 6 }}>
                    <span className="caption" style={{ fontSize: 10.5 }}>PHQ-9</span>
                    <div className="row gap-2" style={{ alignItems: 'baseline', marginTop: 2 }}>
                      <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--sage-700)', fontFamily: 'var(--font-serif)' }}>{selected.phq9}</span>
                      <span className="caption" style={{ fontSize: 10 }}>/ 27 · {selected.phq9 < 5 ? 'minimal' : selected.phq9 < 10 ? 'ringan' : selected.phq9 < 15 ? 'sedang' : 'berat'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Catatan klinis */}
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <span className="eyebrow">Catatan klinis</span>
            <a style={{ fontSize: 11, color: 'var(--sage-700)', cursor: 'pointer', fontWeight: 500 }}>Buka editor lengkap →</a>
          </div>
          <div className="col gap-2" style={{ marginBottom: 14 }}>
            {selected.notes.length === 0 ? (
              <div className="card-flat" style={{ padding: 14, background: 'var(--bg-elev)', textAlign: 'center' }}>
                <span className="caption" style={{ fontSize: 11.5, lineHeight: 1.45 }}>Belum ada catatan. Sesi pertama akan diisi setelah intake awal.</span>
              </div>
            ) : selected.notes.map(([t, body], i) => (
              <div key={i} className="card-flat" style={{ padding: 12, background: 'var(--bg-elev)' }}>
                <span className="caption" style={{ fontSize: 11 }}>{t}</span>
                <p className="body-sm" style={{ margin: '4px 0 0', lineHeight: 1.5 }}>{body}</p>
              </div>
            ))}
          </div>

          <button className="btn btn-primary" style={{ width: '100%' }}>+ Tulis catatan sesi hari ini</button>

          {/* Privacy note */}
          <div className="row gap-2" style={{ marginTop: 12, padding: 10, background: 'var(--info-soft)', borderRadius: 6, alignItems: 'flex-start' }}>
            <Icon name="bell" size={12} stroke="var(--info)" />
            <span style={{ fontSize: 11, color: '#2c4a60', lineHeight: 1.45 }}>Data klien ini hanya dapat diakses oleh Anda sebagai psikolog penanggung. BR-04.</span>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}

// ────────────────────────────────────────────────────────────
// Catatan Klinis — full clinical record editor.
// Field "Status" di-kondisi-kan per kategori layanan (mapping default):
//   dewasa    — mood / tidur / kepatuhan PR / risiko (self-harm)
//   anak      — mood / tidur / perilaku makan / kepatuhan PR / observasi ortu / risiko
//   pasangan  — mood A & B / dinamika / kepatuhan latihan / risiko KDRT
//   tes       — skor mentah / klasifikasi / interpretasi / rekomendasi (tanpa mood/tidur)
// ────────────────────────────────────────────────────────────
const CLINIC_STATUS_FIELDS = {
  dewasa: [
    ['Mood klien',     '6 / 10',  'naik dari 4'],
    ['Tidur',          'Membaik', '6–7 jam'],
    ['Kepatuhan PR',   'Tinggi',  'breathing 5×/mgg'],
    ['Risiko self-harm', 'Rendah', 'tidak ada flag'],
  ],
  anak: [
    ['Mood',           '7 / 10',  'lebih ceria'],
    ['Tidur',          'Cukup',   '8–9 jam'],
    ['Perilaku makan', 'Normal',  '3× sehari'],
    ['Kepatuhan PR',   'Sedang',  'kadang lupa'],
    ['Observasi ortu', 'Positif', 'lebih komunikatif'],
    ['Risiko',         'Rendah',  '—'],
  ],
  pasangan: [
    ['Mood — pasangan A', '6 / 10', 'sedikit naik'],
    ['Mood — pasangan B', '7 / 10', 'stabil'],
    ['Dinamika hubungan', 'Membaik', 'komunikasi terbuka'],
    ['Kepatuhan latihan', 'Tinggi',  'date night 2×/mgg'],
    ['Risiko KDRT',       'Rendah',  'tidak ada flag'],
  ],
  tes: [
    ['Skor mentah',    '142',       'IQ Wechsler'],
    ['Klasifikasi',    'Above Avg', '> 120'],
    ['Interpretasi',   'Selesai',   'lihat narasi'],
    ['Rekomendasi',    '3 poin',    'lihat narasi'],
  ],
};

const CLINIC_SOAP = {
  dewasa: [
    ['S · Subjective', 'Klien melaporkan tidur sudah membaik, 6–7 jam per malam selama seminggu terakhir. Latihan grounding 5-4-3-2-1 dirasa sangat membantu saat panik di kantor. Masih ada kekhawatiran tentang deadline minggu depan.'],
    ['O · Objective',  'Klien tampak lebih rileks, kontak mata baik, postur terbuka. Berbicara dengan tempo normal (sesi sebelumnya cepat). Tidak ada tanda flat affect.'],
    ['A · Assessment', 'Respons baik terhadap intervensi grounding & breathing. Gejala kecemasan menurun (estimasi GAD-7 saat ini ~10, dari 14). Masih perlu kerja pada cognitive restructuring untuk pikiran katastrofik seputar pekerjaan.'],
    ['P · Plan',       'Sesi 4 (final): introduce thought record. PR: lanjut breathing + mulai isi thought record 3×/minggu. Diskusi terminasi paket vs perpanjangan tergantung outcome sesi depan.'],
  ],
  anak: [
    ['S · Subjective (laporan ortu & anak)', 'Ibu melaporkan tantrum di rumah berkurang dari 4-5×/hari menjadi 1-2×. Anak senang main puzzle bersama ayah. Masih sulit transisi dari main ke makan.'],
    ['O · Objective (observasi sesi)',       'Anak datang dengan ortu, langsung memilih boneka tangan, bermain peran "rumah-rumahan". Kontak mata membaik, mau bicara langsung saat ditanya. Tidak menempel ke ibu seperti sesi 1.'],
    ['A · Assessment',                       'Adaptasi sosial membaik. Skill regulasi emosi pre-tantrum mulai terbentuk. Bonding ayah-anak meningkat (homework efektif).'],
    ['P · Plan',                             'Sesi 4: latihan transisi aktivitas dengan timer. PR ortu: konsisten timer 5 menit + pujian saat berhasil transisi. Cek kembali skor CBCL minggu depan.'],
  ],
  pasangan: [
    ['S · Subjective', 'Pasangan melaporkan minggu ini sudah 2× date night sesuai homework. Konflik soal keuangan masih muncul, tapi sudah pakai I-statement (latihan sesi 2).'],
    ['O · Objective',  'Saat sesi, keduanya duduk berdekatan (sesi 1 saling menjauh). Masih ada interupsi saat satu pihak bicara, tapi sudah lebih sering minta maaf. Eye contact saat bicara: meningkat.'],
    ['A · Assessment', 'Komunikasi membaik. Skill listening masih perlu kerja. Trigger keuangan = laten — perlu dibahas terpisah.'],
    ['P · Plan',       'Sesi 4: financial roleplay + active listening exercise. PR: lanjut date night + journal pikiran negatif harian.'],
  ],
  tes: [
    ['Riwayat administrasi',  'Tes Wechsler Adult Intelligence Scale (WAIS-IV) administrasi pada 14 Mei 2026, 10.00–12.00, di ruangan Tes (Lt. 1). Rapport baik, kooperatif, tidak ada gangguan.'],
    ['Hasil per skala',        'Verbal Comprehension: 145 (Very Superior). Perceptual Reasoning: 138 (Superior). Working Memory: 128 (Above Avg). Processing Speed: 119 (High Avg). Full Scale IQ: 142.'],
    ['Interpretasi narasi',    'Profil kognitif menunjukkan kekuatan dominan di area verbal-konseptual dan reasoning visual. Working memory & processing speed memadai untuk tuntutan akademik kompetitif. Tidak terdeteksi disparitas signifikan antar-skala.'],
    ['Rekomendasi',            '1) Jalur akademik gifted/akselerasi sesuai dengan profil kognitif. 2) Eksplorasi minat: STEM, riset, atau humanities tingkat lanjut. 3) Follow-up tes minat-bakat saat usia 15+ untuk arah karir lebih spesifik.'],
  ],
};

const LAYANAN_OPTIONS = [
  ['dewasa',   'Konseling/Terapi Dewasa', 'Konseling Individu Dewasa · Sesi 3/4'],
  ['anak',     'Konseling/Terapi Anak',   'Terapi Anak Lengkap · Sesi 3/10'],
  ['pasangan', 'Konseling Pasangan/Keluarga', 'Terapi Pasangan · Sesi 3/3'],
  ['tes',      'Tes Psikologi',           'WAIS-IV (Tes Bakat) · Sesi 1/2'],
];

function PsikologCatatan() {
  const [layanan, setLayanan] = React.useState('dewasa');
  const fields = CLINIC_STATUS_FIELDS[layanan];
  const soap = CLINIC_SOAP[layanan];
  const opt = LAYANAN_OPTIONS.find(o => o[0] === layanan);

  // Title menyesuaikan layanan untuk tampilan demo
  const titleMap = {
    dewasa:   'Catatan klinis · Rina Andreyani',
    anak:     'Catatan klinis · Davi Pratama (8 thn)',
    pasangan: 'Catatan klinis · Gita & Hadi',
    tes:      'Catatan klinis · Nadia Pertiwi',
  };

  return (
    <AdminShell role="psikolog" active="catatan"
      breadcrumb="Klinis · Catatan"
      title={titleMap[layanan]}
      headerActions={null}>
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Left: timeline of sessions */}
        <aside style={{ width: 260, borderRight: '1px solid var(--border)', padding: '20px 16px', background: 'var(--cream-50)', overflow: 'auto' }}>
          <span className="eyebrow" style={{ marginBottom: 10 }}>Riwayat sesi</span>
          <div className="col gap-1">
            {[
              ['Sesi 3 · Selasa 14 Mei', '10.00 · Sage Room', 'Selesai · catatan ada', 'sage'],
              ['Sesi 2 · Selasa 07 Mei', '10.00 · Sage Room', 'Selesai · catatan ada', 'sage'],
              ['Sesi 1 · Selasa 30 Apr', '10.00 · Sage Room', 'Selesai · asesmen awal', 'sage'],
            ].map(([t, sub, st, c], i) => (
              <div key={i} className="card-flat" style={{ padding: 12, background: i === 0 ? 'var(--sage-50)' : 'var(--bg-elev)', border: '1px solid ' + (i === 0 ? 'var(--sage-300)' : 'var(--border)'), cursor: 'pointer' }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--teal-800)' }}>{t}</span>
                <div className="caption" style={{ fontSize: 11, marginTop: 2 }}>{sub}</div>
                <div className="caption" style={{ fontSize: 10.5, marginTop: 4, color: 'var(--sage-700)' }}>● {st}</div>
              </div>
            ))}
            <div className="card-flat" style={{ padding: 12, background: 'var(--cream-100)', border: '1px dashed var(--border-strong)', marginTop: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg-muted)' }}>Sesi 4 · belum dijadwal</span>
            </div>
          </div>

          <span className="eyebrow" style={{ marginTop: 18, marginBottom: 8 }}>Asesmen</span>
          <div className="col gap-1">
            {[['GAD-7 · 30 Apr', '14 / 21', 'sedang'], ['PHQ-9 · 30 Apr', '8 / 27', 'ringan']].map(([t, score, sev], i) => (
              <div key={i} className="card-flat" style={{ padding: 10, background: 'var(--bg-elev)' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--teal-800)' }}>{t}</span>
                <div className="row" style={{ justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--sage-700)', fontFamily: 'var(--font-serif)' }}>{score}</span>
                  <span className="badge" style={{ background: 'var(--cream-200)', color: 'var(--fg-muted)', height: 18, fontSize: 10 }}>{sev}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center: editor */}
        <div style={{ flex: 1, padding: '20px 28px', overflow: 'auto' }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14, alignItems: 'flex-start' }}>
            <div className="col">
              <span className="eyebrow">Sesi 3 · Selasa, 14 Mei 2026 · 10.00 – 11.00</span>
              <h2 style={{ margin: '4px 0 6px', fontFamily: 'var(--font-serif)', fontSize: 21, fontWeight: 500, color: 'var(--teal-800)' }}>Catatan sesi</h2>
              <span className="caption" style={{ fontSize: 11.5 }}>{opt && opt[2]}</span>
            </div>
            <div className="row gap-2">
              <span className="caption">Tersimpan otomatis · 14.32</span>
              <button className="btn btn-outline btn-sm">Cetak</button>
              <button className="btn btn-primary btn-sm">Tandai final</button>
            </div>
          </div>

          {/* Layanan selector — demo switcher untuk lihat field per kategori */}
          <div style={{ padding: 10, background: 'var(--cream-50)', borderRadius: 8, marginBottom: 14 }}>
            <div className="row gap-2" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="caption" style={{ fontSize: 11.5, fontWeight: 600 }}>Field Status & SOAP menyesuaikan kategori layanan:</span>
              <div style={{ display: 'inline-flex', background: 'var(--bg-elev)', borderRadius: 8, padding: 3 }}>
                {LAYANAN_OPTIONS.map(([k, lbl]) => (
                  <button key={k} onClick={() => setLayanan(k)} className="btn btn-sm" style={{
                    height: 28, padding: '0 12px', fontSize: 11.5,
                    background: layanan === k ? 'var(--sage-500)' : 'transparent',
                    color: layanan === k ? '#fff' : 'var(--fg-muted)',
                    fontWeight: layanan === k ? 600 : 500,
                  }}>{lbl}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Status row — kondisional per kategori */}
          <div className="card-flat" style={{
            padding: 14, marginBottom: 16,
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(fields.length, 6)}, 1fr)`,
            gap: 12,
          }}>
            {fields.map(([lbl, val, sub], i) => (
              <div key={i} className="col">
                <span className="caption" style={{ fontSize: 11 }}>{lbl}</span>
                <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--teal-800)', marginTop: 2 }}>{val}</span>
                <span className="caption" style={{ fontSize: 10.5 }}>{sub}</span>
              </div>
            ))}
          </div>

          {/* SOAP / narasi sections — kondisional juga */}
          {soap.map(([head, body], i) => (
            <div key={head} className="col gap-2" style={{ marginBottom: 14 }}>
              <span className="eyebrow">{head}</span>
              <textarea className="input" defaultValue={body} style={{ minHeight: 80, padding: 12, resize: 'vertical', lineHeight: 1.55, fontSize: 13 }} />
            </div>
          ))}

          <div className="row gap-2" style={{ padding: 12, background: 'var(--info-soft)', borderRadius: 8, border: '1px solid #cfdde8' }}>
            <Icon name="bell" size={14} stroke="var(--info)" />
            <span className="caption" style={{ color: '#2c4a60' }}>Catatan klinis bersifat rahasia. Hanya psikolog penanggung & klien (atas izin) yang dapat mengakses.</span>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

// ────────────────────────────────────────────────────────────
// Profil Saya — own profile + availability
// ────────────────────────────────────────────────────────────
function PsikologProfil() {
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const slots = ['08','09','10','11','12','13','14','15','16','17'];
  // 1 = available, 0 = blocked, 2 = booked
  const grid = [
    [1,1,1,1,0,1,1,1,1,0],
    [1,1,1,1,0,1,1,1,0,0],
    [1,1,1,1,0,1,1,1,1,0],
    [1,1,1,1,0,1,1,1,1,0],
    [1,1,1,1,0,1,1,0,0,0],
    [0,1,1,1,0,0,0,0,0,0],
  ];
  return (
    <AdminShell role="psikolog" active="profil"
      breadcrumb="Tim · Profil"
      title="Profil saya">
      <div style={{ flex: 1, padding: 28, overflow: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
          {/* Left: profile card */}
          <div className="col gap-3">
            <div className="card" style={{ padding: 22 }}>
              <div className="col" style={{ alignItems: 'center', textAlign: 'center', marginBottom: 18 }}>
                <div style={{ width: 88, height: 88, borderRadius: 999, background: 'var(--sage-300)', color: 'var(--teal-800)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 500, marginBottom: 12 }}>VP</div>
                <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--teal-800)', fontFamily: 'var(--font-serif)' }}>Vina Permatasari, M.Psi</span>
                <span className="caption" style={{ marginTop: 4 }}>Psikolog Klinis Dewasa</span>
                <button className="btn btn-outline btn-sm" style={{ marginTop: 10 }}>Edit profil</button>
              </div>

              <div className="col gap-2" style={{ paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                {[
                  ['Email', 'vina@altheapsychology.id'],
                  ['WhatsApp', '+62 813 1122 5544'],
                  ['SIPP', 'Aktif · expired 12/2027'],
                  ['Bergabung', '01 Juni 2024'],
                ].map(([k, v]) => (
                  <div key={k} className="row" style={{ justifyContent: 'space-between' }}>
                    <span className="caption">{k}</span>
                    <span style={{ fontSize: 12.5, color: 'var(--fg)', fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                <span className="eyebrow" style={{ marginBottom: 8 }}>Spesialisasi</span>
                <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
                  {['Anxiety', 'Burnout', 'Trauma', 'Stres pekerjaan'].map(t => (
                    <span key={t} className="badge badge-sage" style={{ height: 24 }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="card" style={{ padding: 18 }}>
              <span className="eyebrow">Statistik · 30 hari</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 10 }}>
                {[
                  ['68', 'Sesi total'],
                  ['12', 'Klien aktif'],
                  ['96%', 'Kehadiran'],
                  ['4.8', 'Rating klien'],
                ].map(([n, l]) => (
                  <div key={l} className="col">
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 500, color: 'var(--teal-800)' }}>{n}</span>
                    <span className="caption" style={{ fontSize: 11 }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: availability grid */}
          <div className="card" style={{ padding: 22 }}>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
              <div className="col">
                <span className="eyebrow">Availability mingguan</span>
                <h2 style={{ margin: '2px 0 0', fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 500, color: 'var(--teal-800)' }}>Jam praktik default</h2>
              </div>
              <div className="row gap-2">
                <button className="btn btn-outline btn-sm">Atur cuti</button>
                <button className="btn btn-primary btn-sm">Simpan</button>
              </div>
            </div>

            <div className="row gap-3" style={{ marginBottom: 12, fontSize: 11 }}>
              <span className="row gap-1"><span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--sage-300)' }} />Tersedia</span>
              <span className="row gap-1"><span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--sage-500)' }} />Sudah ada booking</span>
              <span className="row gap-1"><span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--cream-200)', border: '1px solid var(--border-strong)' }} />Tidak tersedia</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(10, 1fr)', gap: 4 }}>
              <div />
              {slots.map(s => <div key={s} className="caption" style={{ textAlign: 'center', fontSize: 10.5, fontWeight: 600 }}>{s}.00</div>)}
              {grid.map((row, di) => (
                <React.Fragment key={di}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--teal-800)', display: 'flex', alignItems: 'center' }}>{days[di]}</div>
                  {row.map((v, si) => {
                    const isBooked = (di < 4 && [1,2,5,7].includes(si));
                    const display = isBooked ? 2 : v;
                    return (
                      <div key={si} style={{
                        height: 38, borderRadius: 4, cursor: 'pointer',
                        background: display === 2 ? 'var(--sage-500)' : display === 1 ? 'var(--sage-300)' : 'var(--cream-100)',
                        border: '1px solid ' + (display === 0 ? 'var(--border-strong)' : 'transparent'),
                      }} />
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
              <span className="eyebrow" style={{ marginBottom: 8 }}>Pengaturan kapasitas</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 10 }}>
                {[
                  ['Maks sesi/hari', '4', 'BR-01'],
                  ['Jeda antar sesi', '15 menit', null],
                  ['Booking dibuka', 'H-14', null],
                ].map(([k, v, note]) => (
                  <div key={k} className="card-flat" style={{ padding: 12 }}>
                    <span className="caption" style={{ fontSize: 11 }}>{k}</span>
                    <div className="row gap-1" style={{ alignItems: 'baseline', marginTop: 2 }}>
                      <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--teal-800)', fontFamily: 'var(--font-serif)' }}>{v}</span>
                      {note && <span className="badge" style={{ background: 'var(--cream-200)', color: 'var(--fg-muted)', height: 14, fontSize: 9 }}>{note}</span>}
                    </div>
                  </div>
                ))}
              </div>
              <span className="caption" style={{ fontSize: 11, marginTop: 8, display: 'block' }}>
                Maks 4 klien/hari sesuai BR-01 — opsi pilih 4 dari 6 slot tersedia di Availability mingguan.
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

Object.assign(window, { PsikologKlienSaya, PsikologCatatan, PsikologProfil });
