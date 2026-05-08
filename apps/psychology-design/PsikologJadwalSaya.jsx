// Psikolog · Jadwal Saya — own schedule view (timeline harian + minggu).
// Different from admin: focused on own bookings, no edit-others, has "Tandai selesai"
// and "Tulis catatan" inline actions.

function PsikologJadwalSaya() {
  const slots = ['08.00','09.00','10.00','11.00','12.00','13.00','14.00','15.00','16.00','17.00'];
  const week = ['Sen 20', 'Sel 21', 'Rab 22', 'Kam 23', 'Jum 24', 'Sab 25'];
  // bookings: [dayIdx, slotIdx, span, label, room, status, sesi]
  const bookings = [
    [0, 1, 1, 'Rina A.', 'Sage Room', 'done', '3/4'],
    [0, 2, 2, 'Bayu S.', 'Sage Room', 'now', '1/4'],
    [0, 5, 1, 'Dito P.', 'Sky Room', 'next', '2/4'],
    [0, 7, 2, 'Maya & Hadi', 'Sunset Room', 'next', '1/6'],
    [1, 1, 1, 'Sari W.', 'Sage Room', 'next', '4/4'],
    [1, 4, 2, 'Bayu S.', 'Sage Room', 'next', '2/4'],
    [1, 7, 1, 'Lila R.', 'Forest Room', 'next', '1/4'],
    [2, 2, 2, 'Maya & Hadi', 'Sunset Room', 'next', '2/6'],
    [2, 5, 1, 'Rina A.', 'Sage Room', 'next', '4/4'],
    [3, 1, 1, 'Dito P.', 'Sky Room', 'next', '3/4'],
    [3, 3, 2, 'Tina H.', 'Forest Room', 'next', '1/4'],
    [3, 7, 1, 'Bayu S.', 'Sage Room', 'next', '3/4'],
    [4, 2, 1, 'Lila R.', 'Forest Room', 'next', '2/4'],
    [4, 5, 2, 'Maya & Hadi', 'Sunset Room', 'next', '3/6'],
  ];

  // Available slots — psikolog telah menandai ini "tersedia menerima klien"
  // di Availability mingguan, tapi belum ada booking. Render sebagai overlay
  // dengan style berbeda (dashed sage border, label "Tersedia"). Span = 1 jam
  // (karena hanya placeholder; admin akan jadwalkan klien ke slot ini).
  // [dayIdx, slotIdx, span]
  const availableSlots = [
    [0, 0, 1],   // Senin 08
    [0, 4, 1],   // Senin 12
    [1, 2, 1],   // Selasa 10
    [1, 6, 1],   // Selasa 14
    [2, 0, 1],   // Rabu 08
    [2, 4, 1],   // Rabu 12
    [2, 6, 2],   // Rabu 14-15
    [3, 5, 1],   // Kamis 13
    [3, 8, 1],   // Kamis 16
    [4, 0, 1],   // Jumat 08
    [4, 7, 1],   // Jumat 15
    [5, 2, 2],   // Sabtu 10-11
  ];

  // Hindari overlap availability dengan booking — kalau di slot/hari itu sudah
  // ada booking, jangan tampilkan availability overlay-nya.
  const availableSlotsFiltered = availableSlots.filter(([d, si, sp]) =>
    !bookings.some(([bd, bsi, bsp]) => bd === d && si < bsi + bsp && si + sp > bsi)
  );

  return (
    <AdminShell role="psikolog" active="schedule-mine"
      breadcrumb="Praktik · Jadwal saya"
      title="Jadwal saya · Minggu ini"
      headerActions={null}>
      <div style={{ flex: 1, padding: 24, overflow: 'auto' }}>
        {/* Toolbar */}
        <div className="row" style={{ marginBottom: 16, gap: 12 }}>
          <div className="row gap-1" style={{ background: 'var(--bg-elev)', padding: 4, borderRadius: 8, border: '1px solid var(--border)' }}>
            <button className="btn btn-icon btn-ghost btn-sm"><Icon name="chevL" size={14} /></button>
            <span style={{ padding: '0 12px', fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>20 – 25 Mei 2026</span>
            <button className="btn btn-icon btn-ghost btn-sm"><Icon name="chevR" size={14} /></button>
          </div>
          <div className="row gap-1" style={{ background: 'var(--bg-elev)', padding: 4, borderRadius: 8, border: '1px solid var(--border)' }}>
            {['Hari', 'Minggu', 'Bulan'].map((v, i) => (
              <button key={v} className="btn btn-sm" style={{
                height: 28, padding: '0 12px',
                background: i === 1 ? 'var(--sage-500)' : 'transparent',
                color: i === 1 ? '#fff' : 'var(--fg)',
                fontWeight: i === 1 ? 600 : 500,
              }}>{v}</button>
            ))}
          </div>
          <span className="grow" />
          <div className="row gap-2">
            <span className="badge" style={{ background: 'var(--cream-200)', color: 'var(--fg-muted)', height: 24 }}>{bookings.length} sesi terbooking</span>
            <span className="badge" style={{ background: 'var(--sage-50)', color: 'var(--sage-700)', border: '1px dashed var(--sage-400)', height: 24 }}>{availableSlotsFiltered.length} slot tersedia</span>
            <span className="badge badge-sage" style={{ height: 24 }}>71% kapasitas</span>
          </div>
        </div>

        {/* Legend */}
        <div className="row gap-4" style={{ padding: '0 4px 12px', fontSize: 11.5, color: 'var(--fg-muted)' }}>
          <div className="row gap-1" style={{ alignItems: 'center' }}>
            <span style={{ width: 14, height: 14, borderRadius: 3, background: 'var(--sage-500)' }} />
            <span>Berlangsung</span>
          </div>
          <div className="row gap-1" style={{ alignItems: 'center' }}>
            <span style={{ width: 14, height: 14, borderRadius: 3, background: 'var(--sage-100)', border: '1px solid var(--sage-300)' }} />
            <span>Booked (akan datang)</span>
          </div>
          <div className="row gap-1" style={{ alignItems: 'center' }}>
            <span style={{ width: 14, height: 14, borderRadius: 3, background: 'var(--cream-200)', border: '1px solid var(--border-strong)' }} />
            <span>Selesai</span>
          </div>
          <div className="row gap-1" style={{ alignItems: 'center' }}>
            <span style={{ width: 14, height: 14, borderRadius: 3, background: 'var(--bg-elev)', border: '1.5px dashed var(--sage-400)' }} />
            <span><b>Tersedia</b> · belum ada klien</span>
          </div>
        </div>

        {/* Week grid */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(6, 1fr)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ padding: '12px 8px', background: 'var(--cream-50)' }} />
            {week.map((d, i) => (
              <div key={d} style={{ padding: '12px 12px', textAlign: 'center', background: i === 0 ? 'var(--sage-50)' : 'var(--cream-50)', borderLeft: '1px solid var(--border)' }}>
                <span className="caption" style={{ fontSize: 11 }}>{d.split(' ')[0]}</span>
                <div style={{ fontSize: 17, fontWeight: 600, color: i === 0 ? 'var(--sage-700)' : 'var(--teal-800)', fontFamily: 'var(--font-serif)' }}>{d.split(' ')[1]}</div>
              </div>
            ))}
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(6, 1fr)' }}>
              {/* time column */}
              <div className="col">
                {slots.map((t) => (
                  <div key={t} style={{ height: 56, padding: '6px 8px', borderTop: '1px solid var(--border)', textAlign: 'right' }}>
                    <span className="caption" style={{ fontSize: 11 }}>{t}</span>
                  </div>
                ))}
              </div>
              {/* day columns */}
              {week.map((_, dayIdx) => (
                <div key={dayIdx} style={{ position: 'relative', borderLeft: '1px solid var(--border)' }}>
                  {slots.map((_, si) => (
                    <div key={si} style={{ height: 56, borderTop: '1px solid var(--border)' }} />
                  ))}
                  {/* Available overlays — slot yang ditandai tersedia tapi belum di-book.
                      Render dulu (di belakang booking overlays). */}
                  {availableSlotsFiltered.filter(b => b[0] === dayIdx).map(([d, slotIdx, span], i) => (
                    <div key={'av' + i} style={{
                      position: 'absolute', top: slotIdx * 56 + 2, left: 4, right: 4,
                      height: span * 56 - 4,
                      padding: '8px 10px',
                      borderRadius: 6,
                      background: 'var(--bg-elev)',
                      border: '1.5px dashed var(--sage-400)',
                      color: 'var(--sage-700)',
                      display: 'flex', flexDirection: 'column', gap: 3,
                      fontSize: 11, lineHeight: 1.3,
                      cursor: 'pointer',
                    }}
                    title="Slot tersedia — admin dapat menjadwalkan klien di sini">
                      <span style={{ fontWeight: 600, fontSize: 11.5 }}>Tersedia</span>
                      <span style={{ fontSize: 10, opacity: 0.85 }}>belum ada klien</span>
                      <span style={{ fontSize: 10, fontStyle: 'italic', marginTop: 'auto', opacity: 0.75 }}>klik untuk minta admin isi</span>
                    </div>
                  ))}
                  {bookings.filter(b => b[0] === dayIdx).map(([d, slotIdx, span, lbl, room, st, sesi], i) => {
                    const isNow = st === 'now';
                    const isDone = st === 'done';
                    return (
                      <div key={i} style={{
                        position: 'absolute', top: slotIdx * 56 + 2, left: 4, right: 4,
                        height: span * 56 - 4,
                        padding: '8px 10px',
                        borderRadius: 6,
                        background: isNow ? 'var(--sage-500)' : isDone ? 'var(--cream-200)' : 'var(--sage-100)',
                        border: '1px solid ' + (isNow ? 'var(--sage-700)' : isDone ? 'var(--border-strong)' : 'var(--sage-300)'),
                        color: isNow ? '#fff' : isDone ? 'var(--fg-muted)' : 'var(--sage-800)',
                        opacity: isDone ? 0.7 : 1,
                        display: 'flex', flexDirection: 'column', gap: 2,
                        fontSize: 11, lineHeight: 1.3,
                      }}>
                        <span style={{ fontWeight: 600 }}>{lbl}</span>
                        <span style={{ fontSize: 10, opacity: 0.85 }}>{room} · sesi {sesi}</span>
                        {isNow && <span style={{ fontSize: 10, fontWeight: 600, marginTop: 'auto' }}>● Berlangsung</span>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footnote: read-only for others */}
        <div className="row gap-2" style={{ marginTop: 14, padding: 12, background: 'var(--info-soft)', borderRadius: 8, border: '1px solid #cfdde8' }}>
          <Icon name="bell" size={14} stroke="var(--info)" />
          <span className="caption" style={{ color: '#2c4a60' }}>Anda hanya dapat mengubah jadwal sendiri. Untuk reschedule lintas-psikolog atau menambah klien baru, hubungi admin klinik.</span>
        </div>
      </div>
    </AdminShell>
  );
}

window.PsikologJadwalSaya = PsikologJadwalSaya;
