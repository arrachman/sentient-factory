// Desktop — Booking Wizard Drawer (Admin assigns client → service → slot → room)
// Interactive 4-step flow: Klien → Layanan → Slot → Konfirmasi.
// PRD US-A02 (assign klien), US-A04 (pilih layanan), BR-06 (multi-sesi auto).
function BookingWizard() {
  const [step, setStep] = React.useState(0);
  const [picked, setPicked] = React.useState({
    clientType: 'existing',
    clientId: 'c2',
    serviceId: 'terapi-dewasa',
    sessionVariant: '4',  // for Tes Bakat Minat (BR-09)
    slot: 2,
    psy: 'p3',
    room: 'r4',
  });

  const stepLabels = ['Klien', 'Layanan', 'Slot & Ruangan', 'Konfirmasi'];

  const canGoNext = () => true; // simplified for mock
  const next = () => setStep(s => Math.min(3, s + 1));
  const back = () => setStep(s => Math.max(0, s - 1));

  return (
    <div style={{ width: 480, height: 880, background: 'var(--bg-elev)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="col">
          <span className="caption">Penjadwalan baru</span>
          <h2 className="h2" style={{ margin: '2px 0 0' }}>Jadwalkan Klien</h2>
        </div>
        <button className="btn btn-icon btn-ghost"><Icon name="x" size={18} /></button>
      </div>

      {/* Step indicator */}
      <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border)' }}>
        <div className="row gap-2">
          {stepLabels.map((s, i) => (
            <React.Fragment key={s}>
              <div className="row gap-2" onClick={() => i < step && setStep(i)} style={{ cursor: i < step ? 'pointer' : 'default' }}>
                <div style={{ width: 22, height: 22, borderRadius: 999, background: i <= step ? 'var(--sage-500)' : 'var(--cream-100)', color: i <= step ? '#fff' : 'var(--fg-muted)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600 }}>
                  {i < step ? <Icon name="check" size={11} stroke="#fff" sw={2.5} /> : i + 1}
                </div>
                <span style={{ fontSize: 12.5, fontWeight: i === step ? 600 : 500, color: i <= step ? 'var(--teal-800)' : 'var(--fg-muted)' }}>{s}</span>
              </div>
              {i < 3 && <div style={{ height: 1, flex: 1, background: i < step ? 'var(--sage-300)' : 'var(--border)' }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {/* STEP 0: Pilih klien */}
        {step === 0 && (
          <>
            <div className="row gap-1" style={{ background: 'var(--cream-100)', borderRadius: 8, padding: 3, marginBottom: 16 }}>
              {[['existing', 'Klien existing'], ['new', 'Klien baru']].map(([k, lbl]) => (
                <button key={k} onClick={() => setPicked(p => ({ ...p, clientType: k }))} className="btn btn-sm" style={{ flex: 1, height: 32, padding: '0 14px',
                  background: picked.clientType === k ? 'var(--bg-elev)' : 'transparent',
                  boxShadow: picked.clientType === k ? 'var(--shadow-xs)' : 'none',
                  color: picked.clientType === k ? 'var(--teal-800)' : 'var(--fg-muted)',
                  fontWeight: picked.clientType === k ? 600 : 500 }}>{lbl}</button>
              ))}
            </div>

            {picked.clientType === 'existing' ? (
              <>
                <div style={{ position: 'relative', marginBottom: 14 }}>
                  <span style={{ position: 'absolute', left: 11, top: 11 }}><Icon name="search" size={14} stroke="var(--fg-muted)" /></span>
                  <input className="input" placeholder="Cari klien…" style={{ paddingLeft: 32, height: 38, fontSize: 13 }} />
                </div>
                <div className="eyebrow" style={{ marginBottom: 8 }}>Klien terbaru</div>
                <div className="col gap-2">
                  {[
                    { id: 'c2', name: 'Bayu Saputra',     phone: '+62 813 5544 8821', kat: 'Dewasa',   note: '2 sesi sebelumnya' },
                    { id: 'c1', name: 'Anita Wulandari',  phone: '+62 813 ••• 7700',  kat: 'Dewasa',   note: '4 sesi · paket aktif' },
                    { id: 'c5', name: 'Eka Putri',        phone: '+62 822 ••• 5566',  kat: 'Anak',     note: 'Tes baru' },
                    { id: 'c8', name: 'Joko Mahendra',    phone: '+62 856 ••• 4455',  kat: 'Dewasa',   note: '2 sesi · Bagus' },
                  ].map(c => {
                    const sel = picked.clientId === c.id;
                    return (
                      <button key={c.id} onClick={() => setPicked(p => ({ ...p, clientId: c.id }))}
                        style={{ all: 'unset', cursor: 'pointer', padding: 12, borderRadius: 10,
                          background: sel ? 'var(--sage-50)' : 'var(--bg-elev)',
                          border: '1px solid ' + (sel ? 'var(--sage-400)' : 'var(--border)'),
                          display: 'flex', gap: 12, alignItems: 'center' }}>
                        <Avatar name={c.name} color="#5b8a66" size="md" />
                        <div className="col grow">
                          <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--teal-800)' }}>{c.name}</span>
                          <span className="caption">{c.kat} · {c.note}</span>
                        </div>
                        {sel && <Icon name="check" size={16} stroke="var(--sage-600)" sw={2.5} />}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="col gap-3">
                <div className="row gap-2" style={{ padding: 10, background: 'var(--cream-50)', borderRadius: 8, alignItems: 'flex-start' }}>
                  <Icon name="bell" size={13} stroke="var(--sage-700)" />
                  <span className="caption" style={{ lineHeight: 1.5 }}>
                    Semua kolom <strong style={{ color: 'var(--danger)' }}>wajib</strong> diisi (tidak ada opsional).
                  </span>
                </div>
                <div className="col gap-1">
                  <label className="caption" style={{ fontWeight: 500, color: 'var(--teal-800)' }}>Nama lengkap *</label>
                  <input className="input" placeholder="Nama klien" />
                </div>
                <div className="row gap-2">
                  <div className="col gap-1" style={{ flex: 1 }}>
                    <label className="caption" style={{ fontWeight: 500, color: 'var(--teal-800)' }}>Jenis kelamin *</label>
                    <select className="input"><option>Laki-laki</option><option>Perempuan</option></select>
                  </div>
                  <div className="col gap-1" style={{ flex: 1 }}>
                    <label className="caption" style={{ fontWeight: 500, color: 'var(--teal-800)' }}>Umur *</label>
                    <input className="input" placeholder="27" type="number" />
                  </div>
                </div>
                <div className="col gap-1">
                  <label className="caption" style={{ fontWeight: 500, color: 'var(--teal-800)' }}>Nomor rekam medis *</label>
                  <input className="input" placeholder="NRM-2026-XXXX" />
                </div>
                <div className="col gap-1">
                  <label className="caption" style={{ fontWeight: 500, color: 'var(--teal-800)' }}>Nomor WhatsApp *</label>
                  <input className="input" placeholder="+62 ..." />
                </div>
                <span className="caption" style={{ fontSize: 11 }}>Layanan akan dipilih di langkah berikutnya.</span>
              </div>
            )}
          </>
        )}

        {/* STEP 1: Pilih layanan */}
        {step === 1 && (
          <>
            <div className="card-flat" style={{ padding: 12, marginBottom: 14, background: 'var(--cream-50)' }}>
              <div className="row gap-2" style={{ alignItems: 'center' }}>
                <Avatar name="Bayu Saputra" color="#5b8a66" size="sm" />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)', flex: 1 }}>Bayu Saputra</span>
                <button onClick={back} className="btn btn-ghost btn-sm">Ubah</button>
              </div>
            </div>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Pilih layanan</div>
            <div className="col gap-2" style={{ marginBottom: 14 }}>
              {[
                { id: 'konseling-dewasa', name: 'Konseling Individu Dewasa', sessions: '1 sesi', kind: 'konseling', price: 'Rp 350.000' },
                { id: 'terapi-dewasa',    name: 'Terapi Dewasa',             sessions: '4 sesi (paket)', kind: 'terapi', price: 'Rp 1.300.000' },
                { id: 'konseling-pasangan', name: 'Konseling Pasangan',      sessions: '1 sesi', kind: 'konseling', price: 'Rp 500.000' },
                { id: 'tes-bakat',        name: 'Tes Bakat Minat',           sessions: '1 atau 2 sesi (BR-09)', kind: 'tes', price: 'Rp 650.000 / 1.100.000' },
              ].map(s => {
                const sel = picked.serviceId === s.id;
                return (
                  <button key={s.id} onClick={() => setPicked(p => ({ ...p, serviceId: s.id }))}
                    style={{ all: 'unset', cursor: 'pointer', padding: 12, borderRadius: 10,
                      background: sel ? 'var(--sage-50)' : 'var(--bg-elev)',
                      border: '1px solid ' + (sel ? 'var(--sage-400)' : 'var(--border)') }}>
                    <div className="row" style={{ justifyContent: 'space-between' }}>
                      <div className="col grow">
                        <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--teal-800)' }}>{s.name}</span>
                        <span className="caption" style={{ marginTop: 2 }}>{s.sessions} · 1,5–2 jam per sesi</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>{s.price}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* BR-09: Tes Bakat Minat opsi sesi */}
            {picked.serviceId === 'tes-bakat' && (
              <div className="card-flat" style={{ padding: 12, marginBottom: 14, background: 'var(--info-soft)', borderColor: '#cfdde8' }}>
                <span className="eyebrow" style={{ color: '#2c4a60', display: 'block', marginBottom: 8 }}>Pilih paket sesi (BR-09)</span>
                <div className="row gap-2">
                  {[['1', '1 sesi · Rp 650.000'], ['2', '2 sesi · Rp 1.100.000']].map(([v, lbl]) => {
                    const sel = picked.sessionVariant === v;
                    return (
                      <button key={v} onClick={() => setPicked(p => ({ ...p, sessionVariant: v }))} style={{ all: 'unset', cursor: 'pointer', flex: 1, padding: 10, borderRadius: 8, textAlign: 'center',
                        background: sel ? 'var(--bg-elev)' : 'transparent',
                        border: '1px solid ' + (sel ? 'var(--info)' : 'transparent'),
                        color: sel ? 'var(--info)' : '#2c4a60', fontWeight: sel ? 600 : 500, fontSize: 12 }}>{lbl}</button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Multi-sesi info */}
            {(picked.serviceId === 'terapi-dewasa' || (picked.serviceId === 'tes-bakat' && picked.sessionVariant === '2')) && (
              <div className="row gap-2" style={{ padding: 12, background: 'var(--warning-soft)', borderRadius: 8, alignItems: 'flex-start' }}>
                <Icon name="bell" size={14} stroke="#8a4a00" />
                <span className="caption" style={{ color: '#8a4a00', lineHeight: 1.5 }}>
                  <strong>BR-06:</strong> Sistem akan otomatis membuat {picked.serviceId === 'terapi-dewasa' ? '4' : '2'} sesi terjadwal. Anda akan pilih slot untuk sesi pertama, lalu sisa sesi dijadwal otomatis dengan jeda 1 minggu.
                </span>
              </div>
            )}
          </>
        )}

        {/* STEP 2: Slot, Psikolog, Ruangan */}
        {step === 2 && (
          <>
            {/* Summary header */}
            <div className="card-flat" style={{ padding: 14, marginBottom: 18, background: 'var(--cream-50)' }}>
              <div className="row gap-3">
                <Avatar name="Bayu Saputra" color="#5b8a66" size="lg" />
                <div className="col grow">
                  <div className="row gap-2"><span style={{ fontSize: 14, fontWeight: 600, color: 'var(--teal-800)' }}>Bayu Saputra</span><span className="badge badge-neutral">+62 813 5544 8821</span></div>
                  <span className="caption" style={{ marginTop: 2 }}>Klien existing · 2 sesi sebelumnya</span>
                </div>
                <button onClick={back} className="btn btn-ghost btn-sm">Ubah</button>
              </div>
              <div className="hr" style={{ margin: '12px -14px' }} />
              <div className="row gap-3">
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--svc-terapi-soft)', display: 'grid', placeItems: 'center' }}>
                  <Icon name="list" size={17} stroke="#3d556d" />
                </div>
                <div className="col grow">
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--teal-800)' }}>Terapi Dewasa</span>
                  <span className="caption">4 sesi · 1,5 – 2 jam per sesi · sesi ke-1</span>
                </div>
                <button onClick={back} className="btn btn-ghost btn-sm">Ubah</button>
              </div>
            </div>

            <div className="eyebrow" style={{ marginBottom: 10 }}>Pilih slot waktu</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 22 }}>
              {SLOTS.map((s, i) => (
                <button key={s} onClick={() => setPicked(p => ({ ...p, slot: i }))}
                  className="btn btn-outline" style={{ height: 44, justifyContent: 'space-between', padding: '0 14px',
                    background: picked.slot === i ? 'var(--sage-100)' : 'var(--bg-elev)',
                    borderColor: picked.slot === i ? 'var(--sage-400)' : 'var(--border-strong)',
                    color: picked.slot === i ? 'var(--sage-800)' : 'var(--teal-800)' }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{s}</span>
                  {picked.slot === i && <Icon name="check" size={15} stroke="var(--sage-600)" sw={2.5} />}
                </button>
              ))}
            </div>

            <div className="eyebrow" style={{ marginBottom: 10 }}>Psikolog tersedia</div>
            <div className="col gap-2" style={{ marginBottom: 22 }}>
              {PSYCHOLOGISTS.slice(0, 4).map(p => {
                const sel = picked.psy === p.id;
                const full = p.id === 'p2';
                return (
                  <button key={p.id} disabled={full} onClick={() => setPicked(x => ({ ...x, psy: p.id }))}
                    style={{ all: 'unset', cursor: full ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10,
                      background: sel ? 'var(--sage-50)' : 'var(--bg-elev)',
                      border: '1px solid ' + (sel ? 'var(--sage-400)' : 'var(--border)'),
                      opacity: full ? 0.5 : 1 }}>
                    <Avatar name={p.short} color={p.color} size="md" />
                    <div className="col grow">
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--teal-800)' }}>{p.name}</span>
                      <span className="caption">{p.specialty} · {full ? 'Penuh hari ini (BR-01)' : '2/4 klien hari ini'}</span>
                    </div>
                    {sel && <span className="badge badge-sage">dipilih</span>}
                    {full && <span className="badge badge-warn">penuh</span>}
                  </button>
                );
              })}
            </div>

            <div className="eyebrow" style={{ marginBottom: 10 }}>Ruangan tersedia</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 8 }}>
              {ROOMS.slice(0, 6).map(r => {
                const sel = picked.room === r.id;
                const taken = r.id === 'r1' || r.id === 'r3';
                return (
                  <button key={r.id} disabled={taken} onClick={() => setPicked(x => ({ ...x, room: r.id }))}
                    style={{ all: 'unset', cursor: taken ? 'not-allowed' : 'pointer', textAlign: 'center', padding: '10px 8px', borderRadius: 8,
                      background: sel ? 'var(--sage-100)' : 'var(--bg-elev)',
                      border: '1px solid ' + (sel ? 'var(--sage-400)' : 'var(--border)'),
                      opacity: taken ? 0.4 : 1 }}>
                    <Icon name="door" size={16} stroke={sel ? 'var(--sage-700)' : 'var(--fg-muted)'} />
                    <div style={{ fontSize: 12, fontWeight: 600, color: sel ? 'var(--sage-800)' : 'var(--teal-800)', marginTop: 4 }}>{r.name}</div>
                    <div style={{ fontSize: 10, color: taken ? 'var(--danger)' : 'var(--fg-muted)' }}>{taken ? 'terpakai' : 'kosong'}</div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* STEP 3: Konfirmasi */}
        {step === 3 && (
          <>
            <div className="row gap-2" style={{ padding: 14, background: 'var(--success-soft)', borderRadius: 8, marginBottom: 18, alignItems: 'center' }}>
              <div style={{ width: 32, height: 32, borderRadius: 999, background: 'var(--success)', display: 'grid', placeItems: 'center' }}>
                <Icon name="check" size={16} stroke="#fff" sw={2.5} />
              </div>
              <div className="col">
                <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--success)' }}>Semua slot tersedia</span>
                <span className="caption" style={{ color: 'var(--success)', fontSize: 11 }}>Slot psikolog, ruangan, & kuota harian valid</span>
              </div>
            </div>

            <div className="eyebrow" style={{ marginBottom: 10 }}>Ringkasan booking</div>
            <div className="card" style={{ overflow: 'hidden', marginBottom: 16 }}>
              {[
                ['Klien',     'Bayu Saputra',  '+62 813 5544 8821 · Dewasa'],
                ['Layanan',   'Terapi Dewasa', '4 sesi · 1,5–2 jam per sesi'],
                ['Psikolog',  'Rina Hartono',  'Pasangan & Keluarga · ★ 4.9'],
                ['Slot sesi 1', '12:00 – 13:30', 'Senin, 06 Mei 2026'],
                ['Ruangan',   'Sunset Room',    'Lt. 2 · 4 orang'],
                ['Tarif',     'Rp 1.300.000',   'DP 50% wajib · Rp 650.000'],
              ].map(([k, v, sub], i) => (
                <div key={k} style={{ padding: '12px 16px', borderTop: i ? '1px solid var(--border)' : 'none', display: 'grid', gridTemplateColumns: '110px 1fr', gap: 12 }}>
                  <span className="caption">{k}</span>
                  <div className="col">
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>{v}</span>
                    {sub && <span className="caption" style={{ fontSize: 10.5, marginTop: 1 }}>{sub}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Sesi mendatang auto-generated (BR-06) */}
            <div className="eyebrow" style={{ marginBottom: 8 }}>Sesi 2–4 dijadwal otomatis (BR-06)</div>
            <div className="col gap-1" style={{ marginBottom: 16 }}>
              {[
                ['Sesi 2', 'Senin, 13 Mei · 12:00 – 13:30', 'Sunset Room'],
                ['Sesi 3', 'Senin, 20 Mei · 12:00 – 13:30', 'Sunset Room'],
                ['Sesi 4', 'Senin, 27 Mei · 12:00 – 13:30', 'Sunset Room'],
              ].map(([n, t, r]) => (
                <div key={n} className="row gap-2" style={{ padding: '8px 12px', background: 'var(--cream-50)', borderRadius: 6 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--sage-700)', width: 50 }}>{n}</span>
                  <span style={{ fontSize: 12, color: 'var(--fg)', flex: 1 }}>{t}</span>
                  <span className="caption" style={{ fontSize: 10.5 }}>{r}</span>
                </div>
              ))}
            </div>

            {/* Notif preview */}
            <div className="card-flat" style={{ padding: 12, background: 'var(--success-soft)', borderColor: '#c8e0ce' }}>
              <div className="row gap-2" style={{ marginBottom: 6 }}>
                <Icon name="wa" size={13} stroke="var(--success)" />
                <span className="eyebrow" style={{ color: 'var(--success)' }}>Notifikasi WA otomatis akan terkirim ke:</span>
              </div>
              <div className="col gap-1">
                <span className="caption" style={{ fontSize: 11.5, color: 'var(--success)' }}>✓ Bayu Saputra (klien) — konfirmasi 4 sesi</span>
                <span className="caption" style={{ fontSize: 11.5, color: 'var(--success)' }}>✓ Rina Hartono (psikolog) — assignment baru</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer with step nav */}
      <div style={{ padding: 20, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', gap: 10, background: 'var(--cream-50)' }}>
        <button className="btn btn-ghost" onClick={back} disabled={step === 0} style={{ opacity: step === 0 ? 0.4 : 1, cursor: step === 0 ? 'not-allowed' : 'pointer' }}>
          <Icon name="chevL" size={14} /> Kembali
        </button>
        <div className="row gap-2">
          {step < 3 ? (
            <>
              <button className="btn btn-outline">Simpan draft</button>
              <button className="btn btn-primary" onClick={next} disabled={!canGoNext()}>Lanjut <Icon name="chevR" size={14} stroke="#fff" /></button>
            </>
          ) : (
            <>
              <button className="btn btn-outline">Edit</button>
              <button className="btn btn-primary">Konfirmasi & Kirim WA <Icon name="check" size={14} stroke="#fff" sw={2.5} /></button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
window.BookingWizard = BookingWizard;
