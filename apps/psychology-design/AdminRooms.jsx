// Admin · Pemakaian Ruangan — grid jam × ruangan, sel = nama psikolog (warna unik).
// Layout disamakan dengan "Jadwal Hari Ini" (DesktopAdmin) untuk memudahkan
// admin menjadwalkan psikolog yang sama di ruangan berurutan tanpa pindah.

const ROOM_DETAILS = [
  { id: 'r1',  name: 'Sky Room',     type: 'konseling', cap: 2, sessions: [0, 3] },
  { id: 'r2',  name: 'Sage Room',    type: 'konseling', cap: 2, sessions: [2] },
  { id: 'r3',  name: 'Forest Room',  type: 'konseling', cap: 2, sessions: [1, 2] },
  { id: 'r4',  name: 'Sunset Room',  type: 'konseling', cap: 2, sessions: [0, 2] },
  { id: 'r5',  name: 'Mint Room',    type: 'konseling', cap: 6, sessions: [0, 4] },
  { id: 'r6',  name: 'Terapi Anak 1',  type: 'anak',      cap: 3, sessions: [0] },
  { id: 'r7',  name: 'Terapi Anak 2',  type: 'anak',      cap: 3, sessions: [3] },
  { id: 'r8',  name: 'Terapi Anak 3',  type: 'anak',      cap: 3, sessions: [] },
  { id: 'r9',  name: 'Playground',     type: 'anak',      cap: 5, sessions: [4] },
  { id: 'r10', name: 'Tes',            type: 'tes',       cap: 1, sessions: [1, 2, 3] },
  { id: 'r11', name: 'Seminar',        type: 'seminar',   cap: 20, sessions: [1] },
];

const roomTypeStyle = (t) => ({
  konseling: { bg: 'var(--svc-konseling-soft)', fg: 'var(--sage-700)', icon: 'door' },
  anak:      { bg: 'var(--svc-anak-soft)',      fg: '#8b3d2a', icon: 'door' },
  tes:       { bg: 'var(--svc-tes-soft)',       fg: '#6b5320', icon: 'list' },
  seminar:   { bg: 'var(--info-soft)',          fg: '#2c4a60', icon: 'users' },
}[t]);

// (slot,room) -> { psy, booking } mapping derived from TODAY_BOOKINGS.
const ROOM_USE_BY_SLOT = (() => {
  const m = {};
  Object.entries(TODAY_BOOKINGS).forEach(([key, b]) => {
    const [psyId, slotIdx] = key.split('-');
    const psy = PSYCHOLOGISTS.find(p => p.id === psyId);
    m[`${b.room}-${slotIdx}`] = { psy, booking: b };
  });
  return m;
})();

// Reusable grid: rows = slot, cols = ruangan, sel = nama psikolog (warna unik).
// `editable=false` -> tampilan read-only untuk dashboard Owner / landing Admin.
function RoomUsageGrid({ editable = true, compact = false, onPick }) {
  const cellH = compact ? 38 : 56;
  const fontTitle = compact ? 11 : 12;
  const fontSub   = compact ? 9.5 : 10.5;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
      {/* Header — daftar ruangan */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `90px repeat(${ROOM_DETAILS.length}, minmax(96px, 1fr))`,
        borderBottom: '1px solid var(--border)', background: 'var(--cream-50)',
      }}>
        <div style={{ padding: '10px 12px', fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Slot</div>
        {ROOM_DETAILS.map(r => {
          const s = roomTypeStyle(r.type);
          return (
            <div key={r.id} style={{ padding: '8px 8px', borderLeft: '1px solid var(--border)', textAlign: 'center' }}>
              <div className="row gap-1" style={{ justifyContent: 'center' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: s.fg }} />
                <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--teal-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--fg-muted)', marginTop: 2 }}>kap. {r.cap}</div>
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {SLOTS.map((slot, slotIdx) => (
          <div key={slot} style={{
            display: 'grid',
            gridTemplateColumns: `90px repeat(${ROOM_DETAILS.length}, minmax(96px, 1fr))`,
            borderBottom: slotIdx === SLOTS.length - 1 ? 'none' : '1px solid var(--border)',
          }}>
            <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--cream-50)', borderRight: '1px solid var(--border)' }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--teal-800)' }}>{slot.split(' – ')[0]}</span>
              <span style={{ fontSize: 10, color: 'var(--fg-muted)' }}>{slot.split(' – ')[1]}</span>
            </div>
            {ROOM_DETAILS.map(r => {
              const use = ROOM_USE_BY_SLOT[`${r.name}-${slotIdx}`];
              return (
                <div key={r.id}
                  onClick={() => onPick && onPick(r, slotIdx, use)}
                  style={{ padding: 4, borderLeft: '1px solid var(--border)', minHeight: cellH, cursor: editable ? 'pointer' : 'default' }}>
                  {use ? (
                    <div style={{
                      background: use.psy.color + '22',
                      borderLeft: `3px solid ${use.psy.color}`,
                      borderRadius: 6, padding: compact ? '4px 6px' : '6px 8px',
                      height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    }}>
                      {/* Sel pemakaian ruangan = NAMA PSIKOLOG (bukan klien & bukan layanan).
                          Baris kedua: specialty psikolog — atribut tetap psikolog yang
                          membantu admin recognize tanpa konfusi dengan info klien. */}
                      <div style={{ fontSize: fontTitle + 1, fontWeight: 700, color: use.psy.color, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{use.psy.short}</div>
                      {!compact && <div style={{ fontSize: fontSub, color: use.psy.color, opacity: 0.7, lineHeight: 1.2, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{use.psy.specialty}</div>}
                    </div>
                  ) : (
                    <div style={{
                      height: '100%', borderRadius: 6,
                      border: editable ? '1px dashed var(--border-strong)' : '1px dashed var(--cream-200)',
                      display: 'grid', placeItems: 'center', color: 'var(--fg-subtle)',
                    }}>
                      {editable ? <Icon name="plus" size={12} /> : <span style={{ fontSize: 9.5, color: 'var(--fg-subtle)' }}>kosong</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// Legend pemakai ruangan — psikolog warna unik.
function RoomUsageLegend({ compact = false }) {
  return (
    <div className="row gap-3" style={{ flexWrap: 'wrap' }}>
      {PSYCHOLOGISTS.map(p => (
        <div key={p.id} className="row gap-1" style={{ alignItems: 'center' }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: p.color }} />
          <span className="caption" style={{ fontSize: compact ? 10.5 : 11.5, color: 'var(--teal-800)', fontWeight: 500 }}>{p.short}</span>
        </div>
      ))}
    </div>
  );
}

function AdminRooms() {
  const [picked, setPicked] = React.useState(null); // {room, slotIdx, use}

  const totalSessions = ROOM_DETAILS.reduce((s, r) => s + r.sessions.length, 0);

  return (
    <AdminShell active="rooms" breadcrumb="Operasional · Pemakaian Ruangan" title="Pemakaian Ruangan">
      <div style={{ padding: '18px 28px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div className="row gap-2">
          <button className="btn btn-outline btn-sm btn-icon"><Icon name="chevL" size={15} /></button>
          <div className="row gap-2" style={{ background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 14px', height: 36 }}>
            <Icon name="cal" size={15} stroke="var(--sage-600)" />
            <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--teal-800)' }}>Senin, 18 Mei 2026</span>
          </div>
          <button className="btn btn-outline btn-sm btn-icon"><Icon name="chevR" size={15} /></button>
        </div>
        <div className="row gap-2">
          <button className="btn btn-outline btn-sm"><Icon name="settings" size={14} /> Atur Ruangan</button>
          <button className="btn btn-primary btn-sm"><Icon name="plus" size={15} stroke="#fff" /> Tambah Ruangan</button>
        </div>
      </div>

      <div style={{ padding: '0 28px 16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { lbl: 'Total ruangan', val: ROOM_DETAILS.length, sub: 'aktif semua' },
          { lbl: 'Sesi hari ini', val: totalSessions, sub: `dari ${ROOM_DETAILS.length * SLOTS.length} kapasitas slot` },
          { lbl: 'Utilisasi rata-rata', val: Math.round((totalSessions / (ROOM_DETAILS.length * SLOTS.length)) * 100) + '%', sub: 'minggu ini ↑ 8%' },
          { lbl: 'Ruangan kosong', val: ROOM_DETAILS.filter(r => r.sessions.length === 0).length, sub: 'sepanjang hari' },
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

      <div style={{ flex: 1, minHeight: 0, padding: '0 28px 28px', display: 'flex', gap: 16 }}>
        <div className="card" style={{ flex: 1, minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="row" style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <h2 className="h2" style={{ margin: 0 }}>Grid Pemakaian Ruangan</h2>
            <RoomUsageLegend />
          </div>

          <RoomUsageGrid editable onPick={(room, slotIdx, use) => setPicked({ room, slotIdx, use })} />
        </div>

        {/* Detail panel — ruangan terpilih */}
        {picked && picked.room && (
          <div className="card" style={{ width: 300, flexShrink: 0, padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="eyebrow">Detail · {SLOTS[picked.slotIdx].split(' – ')[0]}</span>
              <button className="btn btn-icon btn-ghost btn-sm" onClick={() => setPicked(null)}><Icon name="x" size={14} /></button>
            </div>

            <div className="col gap-2">
              <div style={{ width: 56, height: 56, borderRadius: 12, background: roomTypeStyle(picked.room.type).bg, display: 'grid', placeItems: 'center' }}>
                <Icon name={roomTypeStyle(picked.room.type).icon} size={26} stroke={roomTypeStyle(picked.room.type).fg} />
              </div>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 500, color: 'var(--teal-800)' }}>{picked.room.name}</h3>
              <div className="row gap-2">
                <span className="badge" style={{ background: roomTypeStyle(picked.room.type).bg, color: roomTypeStyle(picked.room.type).fg, textTransform: 'capitalize' }}>{picked.room.type}</span>
                <span className="badge badge-neutral">kap. {picked.room.cap} orang</span>
              </div>
            </div>

            <div className="hr" />

            <div className="col gap-2">
              <span className="eyebrow">Sesi pada slot ini</span>
              {picked.use ? (
                <div className="card-flat" style={{ padding: 12 }}>
                  <div className="row gap-2" style={{ alignItems: 'center', marginBottom: 6 }}>
                    <Avatar name={picked.use.psy.short} color={picked.use.psy.color} size="sm" />
                    <div className="col">
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>{picked.use.psy.name}</span>
                      <span className="caption" style={{ fontSize: 10.5 }}>{picked.use.psy.specialty}</span>
                    </div>
                  </div>
                  <div className="caption" style={{ lineHeight: 1.5 }}>
                    Klien: <strong style={{ color: 'var(--fg)' }}>{picked.use.booking.client}</strong><br/>
                    Layanan: {picked.use.booking.service}
                  </div>
                </div>
              ) : (
                <p className="caption" style={{ margin: 0, padding: 12, background: 'var(--cream-50)', borderRadius: 8, lineHeight: 1.5 }}>
                  Slot kosong — klik untuk menjadwalkan klien di ruangan ini.
                </p>
              )}
            </div>

            <div className="col gap-2">
              <span className="eyebrow">Fasilitas</span>
              <div className="row gap-1" style={{ flexWrap: 'wrap' }}>
                {(picked.room.type === 'anak' ? ['Mainan', 'Karpet', 'Meja kecil', 'Cermin observasi']
                  : picked.room.type === 'tes' ? ['Komputer', 'Meja tunggal', 'Sound proof']
                  : picked.room.type === 'seminar' ? ['Proyektor', 'AC', 'Whiteboard', '20 kursi']
                  : ['Sofa', 'Meja', 'AC', 'Tisu']).map(f => (
                  <span key={f} className="badge badge-neutral">{f}</span>
                ))}
              </div>
            </div>

            {!picked.use && (
              <button className="btn btn-primary"><Icon name="plus" size={14} stroke="#fff" /> Jadwalkan klien di slot ini</button>
            )}
          </div>
        )}
      </div>
    </AdminShell>
  );
}

Object.assign(window, { AdminRooms, RoomUsageGrid, RoomUsageLegend, ROOM_DETAILS, roomTypeStyle, ROOM_USE_BY_SLOT });
