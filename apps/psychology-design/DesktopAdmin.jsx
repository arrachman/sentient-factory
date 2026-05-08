// Desktop Admin View — Penjadwalan (schedule grid: psikolog × slot)

function DesktopAdmin() {
  const date = 'Senin, 18 Mei 2026';

  const headerActions = null; // search + bell already in shell

  return (
    <AdminShell active="schedule" breadcrumb="Penjadwalan" title="Jadwal Hari Ini">
      {/* Toolbar */}
      <div style={{ padding: '18px 28px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div className="row gap-2">
          <button className="btn btn-outline btn-sm btn-icon"><Icon name="chevL" size={15} /></button>
          <div className="row gap-2" style={{ background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 14px', height: 36 }}>
            <Icon name="cal" size={15} stroke="var(--sage-600)" />
            <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--teal-800)' }}>{date}</span>
          </div>
          <button className="btn btn-outline btn-sm btn-icon"><Icon name="chevR" size={15} /></button>
          <div style={{ display: 'inline-flex', background: 'var(--cream-100)', borderRadius: 8, padding: 3, marginLeft: 8 }}>
            {['Hari', 'Minggu', 'Bulan'].map((v, i) => (
              <button key={v} className="btn btn-sm" style={{ background: i === 0 ? 'var(--bg-elev)' : 'transparent', boxShadow: i === 0 ? 'var(--shadow-xs)' : 'none', color: i === 0 ? 'var(--teal-800)' : 'var(--fg-muted)', height: 28, padding: '0 12px' }}>{v}</button>
            ))}
          </div>
        </div>
        <div className="row gap-2">
          <button className="btn btn-outline btn-sm"><Icon name="filter" size={14} /> Filter</button>
          <button className="btn btn-primary btn-sm"><Icon name="plus" size={15} stroke="#fff" /> Jadwalkan Klien</button>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ padding: '0 28px 16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { lbl: 'Sesi terjadwal', val: '16', sub: 'dari 28 slot tersedia' },
          { lbl: 'Psikolog aktif', val: '7', sub: '5 sedang sesi sekarang' },
          { lbl: 'Ruangan terpakai', val: '8/11', sub: '3 ruangan kosong' },
          { lbl: 'Notifikasi WA', val: '32', sub: 'terkirim hari ini' },
        ].map((s, i) => (
          <div key={i} className="card-flat" style={{ padding: 14 }}>
            <div className="caption" style={{ marginBottom: 6 }}>{s.lbl}</div>
            <div className="row gap-2" style={{ alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 500, color: 'var(--teal-800)' }}>{s.val}</span>
              <span className="caption">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule grid */}
      <div style={{ padding: '0 28px 18px' }}>
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="row" style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between' }}>
            <h2 className="h2" style={{ margin: 0 }}>Grid Penjadwalan · Psikolog × Slot</h2>
            <div className="row gap-3">
              <div className="row gap-1"><span style={{ width: 10, height: 10, background: 'var(--svc-konseling)', borderRadius: 2 }} /><span className="caption">Konseling</span></div>
              <div className="row gap-1"><span style={{ width: 10, height: 10, background: 'var(--svc-terapi)', borderRadius: 2 }} /><span className="caption">Terapi</span></div>
              <div className="row gap-1"><span style={{ width: 10, height: 10, background: 'var(--svc-anak)', borderRadius: 2 }} /><span className="caption">Anak</span></div>
              <div className="row gap-1"><span style={{ width: 10, height: 10, background: 'var(--svc-tes)', borderRadius: 2 }} /><span className="caption">Tes</span></div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '110px repeat(7, 1fr)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ padding: '12px 14px', fontSize: 11.5, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Slot</div>
            {PSYCHOLOGISTS.map(p => (
              <div key={p.id} style={{ padding: '12px 10px', borderLeft: '1px solid var(--border)' }}>
                <div className="row gap-2">
                  <Avatar name={p.short} color={p.color} size="sm" />
                  <div className="col" style={{ minWidth: 0 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--teal-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.short}</span>
                    <span style={{ fontSize: 10.5, color: 'var(--fg-muted)' }}>{p.specialty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {SLOTS.map((slot, slotIdx) => (
            <div key={slot} style={{ display: 'grid', gridTemplateColumns: '110px repeat(7, 1fr)', borderBottom: slotIdx === SLOTS.length - 1 ? 'none' : '1px solid var(--border)' }}>
              <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--cream-50)', borderRight: '1px solid var(--border)' }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--teal-800)' }}>{slot.split(' – ')[0]}</span>
                <span style={{ fontSize: 10.5, color: 'var(--fg-muted)' }}>{slot.split(' – ')[1]}</span>
              </div>
              {PSYCHOLOGISTS.map(p => {
                const b = TODAY_BOOKINGS[`${p.id}-${slotIdx}`];
                return (
                  <div key={p.id} style={{ padding: 6, borderLeft: '1px solid var(--border)', minHeight: 88 }}>
                    {b ? <BookingCard b={b} /> : <EmptySlot />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Pemakaian Ruangan — read-only mini-grid (cari ruangan kosong dengan cepat) */}
      <div style={{ padding: '0 28px 28px' }}>
        <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="row" style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div className="col">
              <h2 className="h2" style={{ margin: 0 }}>Pemakaian Ruangan · Slot × Ruangan</h2>
              <span className="caption" style={{ marginTop: 2 }}>Read-only · sel berisi nama psikolog (warna unik). Klik judul kartu untuk buka halaman edit penuh.</span>
            </div>
            <RoomUsageLegend compact />
          </div>
          <RoomUsageGrid editable={false} compact />
        </div>
      </div>
    </AdminShell>
  );
}

function BookingCard({ b }) {
  const c = kindBar(b.kind);
  return (
    <div style={{ background: c.fill, borderRadius: 8, borderLeft: `3px solid ${c.bar}`, padding: '8px 9px', height: '100%', cursor: 'pointer', transition: 'transform .15s var(--ease)' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: c.text, marginBottom: 3, lineHeight: 1.2 }}>{b.client}</div>
      <div style={{ fontSize: 10.5, color: c.text, opacity: 0.8, lineHeight: 1.3, marginBottom: 5 }}>{b.service}</div>
      <div className="row gap-1" style={{ flexWrap: 'wrap', gap: 4 }}>
        <span style={{ fontSize: 10, padding: '1px 6px', background: 'rgba(255,255,255,0.6)', borderRadius: 4, color: c.text, fontWeight: 500 }}>{b.room}</span>
        {b.sessionTotal > 1 && (
          <span style={{ fontSize: 10, padding: '1px 6px', background: 'rgba(255,255,255,0.6)', borderRadius: 4, color: c.text, fontWeight: 500 }}>sesi {b.sessionN}/{b.sessionTotal}</span>
        )}
      </div>
    </div>
  );
}
function EmptySlot() {
  return (
    <div style={{ height: '100%', borderRadius: 8, border: '1px dashed var(--border-strong)', display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--fg-subtle)', transition: 'all .15s var(--ease)' }}>
      <Icon name="plus" size={16} />
    </div>
  );
}

window.DesktopAdmin = DesktopAdmin;
