// Admin Dialogs (cont.) — Reschedule, Cancel, Notifikasi center.
// Reuses DialogFrame + Field + Select from AdminDialogs1.jsx.
// PRD US-A07 (reschedule + cancel) · audit log integration.

// ────────────────────────────────────────────────────────────
// Reschedule sesi (PRD US-A07)
// ────────────────────────────────────────────────────────────
function DialogReschedule() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--cream-100)' }}>
      <DialogFrame
        eyebrow="Penjadwalan · Reschedule"
        title="Ubah Jadwal Sesi"
        width={580}
        footer={<>
          <button className="btn btn-ghost">Batal</button>
          <button className="btn btn-primary"><Icon name="cal" size={14} stroke="#fff" /> Konfirmasi & Kirim WA</button>
        </>}>
        {/* Current booking */}
        <div className="card-flat" style={{ padding: 14, marginBottom: 16, background: 'var(--cream-50)' }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Sesi saat ini</div>
          <div className="row gap-3" style={{ alignItems: 'center' }}>
            <Avatar name="Bayu Saputra" color="#5b8a66" size="md" />
            <div className="col grow">
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--teal-800)' }}>Bayu Saputra</span>
              <span className="caption" style={{ marginTop: 2 }}>Konseling Dewasa · sesi 2/4 · psikolog Vina</span>
            </div>
            <div className="col" style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--teal-800)' }}>Senin, 06 Mei · 14:00</span>
              <span className="caption">Sage Room</span>
            </div>
          </div>
        </div>

        {/* Pilih tanggal & slot baru */}
        <Field label="Tanggal baru" required>
          <div className="row gap-2">
            {[['Selasa', '07 Mei', false], ['Rabu', '08 Mei', true], ['Kamis', '09 Mei', false], ['Jumat', '10 Mei', false]].map(([d, dt, sel]) => (
              <button key={dt} className="btn" style={{ flex: 1, height: 60, flexDirection: 'column', gap: 2,
                background: sel ? 'var(--sage-50)' : 'var(--bg-elev)',
                border: '1px solid ' + (sel ? 'var(--sage-400)' : 'var(--border)'),
                color: sel ? 'var(--sage-800)' : 'var(--teal-800)' }}>
                <span style={{ fontSize: 11, opacity: 0.7 }}>{d}</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{dt}</span>
              </button>
            ))}
          </div>
        </Field>

        <Field label="Slot waktu baru" required hint="Hanya slot di mana psikolog & ruangan tersedia">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              ['08:30 – 10:00', 'tersedia'],
              ['10:00 – 11:30', 'tersedia', true],
              ['12:00 – 13:30', 'penuh'],
              ['13:30 – 15:00', 'tersedia'],
              ['15:15 – 16:45', 'penuh'],
              ['16:45 – 18:15', 'tersedia'],
            ].map(([slot, st, sel], i) => {
              const disabled = st === 'penuh';
              return (
                <button key={slot} disabled={disabled} className="btn" style={{ height: 50, flexDirection: 'column', gap: 2,
                  background: sel ? 'var(--sage-100)' : disabled ? 'var(--cream-100)' : 'var(--bg-elev)',
                  border: '1px solid ' + (sel ? 'var(--sage-400)' : 'var(--border)'),
                  opacity: disabled ? 0.5 : 1,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  color: sel ? 'var(--sage-800)' : 'var(--teal-800)' }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600 }}>{slot}</span>
                  <span style={{ fontSize: 10, color: disabled ? 'var(--danger)' : 'var(--sage-700)' }}>{st}</span>
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Ruangan" hint="Ruangan tersedia di slot terpilih">
          <Select value="Sage Room (sama dengan sebelumnya)" />
        </Field>

        <Field label="Alasan reschedule" hint="Tercatat di audit log">
          <select className="input" defaultValue="klien" style={{ height: 38, fontSize: 13 }}>
            <option value="klien">Permintaan klien</option>
            <option value="psikolog">Permintaan psikolog (izin)</option>
            <option value="ruangan">Konflik ruangan</option>
            <option value="darurat">Keadaan darurat</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </Field>

        <Field label="Catatan tambahan" hint="Opsional · akan dikirim via WA jika diisi">
          <textarea className="input" placeholder="Misal: Klien minta jam pagi karena pekerjaan…" style={{ height: 70, padding: 10, resize: 'none', fontSize: 13, fontFamily: 'inherit' }} />
        </Field>

        {/* Notif preview — WA otomatis ke klien DAN psikolog */}
        <div className="card-flat" style={{ padding: 12, background: 'var(--success-soft)', borderColor: '#c8e0ce', marginTop: 8 }}>
          <div className="row gap-2" style={{ marginBottom: 8 }}>
            <Icon name="wa" size={14} stroke="var(--success)" />
            <span className="eyebrow" style={{ color: 'var(--success)' }}>Notifikasi WhatsApp otomatis · 2 penerima</span>
          </div>
          <div className="col gap-1">
            <span className="caption" style={{ fontSize: 11.5, color: 'var(--success)' }}>✓ <strong>Bayu Saputra (klien)</strong> — pemberitahuan jadwal baru + tanggal & jam</span>
            <span className="caption" style={{ fontSize: 11.5, color: 'var(--success)' }}>✓ <strong>Vina Permatasari (psikolog)</strong> — pemberitahuan jadwal baru + ruangan</span>
          </div>
          <div className="caption" style={{ fontSize: 10.5, marginTop: 8, color: 'var(--success)', lineHeight: 1.5 }}>
            Status pengiriman bisa dipantau di Notifikasi WA · Log. Jika gagal, sistem retry otomatis 3× lalu tandai status "gagal" untuk admin tindak lanjut manual.
          </div>
        </div>
      </DialogFrame>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Cancel sesi (PRD US-A07)
// ────────────────────────────────────────────────────────────
function DialogCancel() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--cream-100)' }}>
      <DialogFrame
        eyebrow="Penjadwalan · Pembatalan"
        title="Batalkan Sesi"
        width={520}
        footer={<>
          <button className="btn btn-ghost">Tidak jadi</button>
          <button className="btn" style={{ background: 'var(--danger)', color: '#fff' }}>
            <Icon name="x" size={14} stroke="#fff" sw={2.5} /> Batalkan & kirim notif
          </button>
        </>}>
        {/* Warning header */}
        <div className="row gap-3" style={{ padding: 14, background: 'var(--danger-soft)', border: '1px solid #e6c8c0', borderRadius: 8, marginBottom: 18, alignItems: 'flex-start' }}>
          <div style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--danger)', color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <Icon name="x" size={18} stroke="#fff" sw={2.5} />
          </div>
          <div className="col">
            <span style={{ fontSize: 14, fontWeight: 600, color: '#7a3328' }}>Aksi tidak dapat dibatalkan</span>
            <span className="caption" style={{ color: '#7a3328', fontSize: 12, lineHeight: 1.5, marginTop: 4 }}>
              Slot akan kosong & dapat dipakai sesi lain. Notifikasi WA akan terkirim ke klien dan psikolog.
            </span>
          </div>
        </div>

        {/* Sesi info */}
        <div className="card-flat" style={{ padding: 12, marginBottom: 16, background: 'var(--cream-50)' }}>
          <div className="row gap-2" style={{ alignItems: 'center', marginBottom: 6 }}>
            <Avatar name="Eka Putri" color="#c97a5d" size="sm" />
            <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--teal-800)' }}>Eka Putri</span>
            <span className="badge badge-warn">multi-sesi</span>
          </div>
          <div className="caption" style={{ marginLeft: 30, lineHeight: 1.5 }}>
            Konseling Pasangan · sesi 1/3 · Senin 06 Mei · 13:00<br/>
            Psikolog Rina · Mint Room
          </div>
        </div>

        <Field label="Alasan pembatalan" required hint="Tercatat di audit log">
          <select className="input" defaultValue="klien-sakit" style={{ height: 38, fontSize: 13 }}>
            <option value="klien-sakit">Klien sakit</option>
            <option value="klien-mendadak">Klien batal mendadak</option>
            <option value="psikolog-darurat">Psikolog darurat</option>
            <option value="ruangan-bermasalah">Masalah ruangan</option>
            <option value="cuaca">Cuaca / force majeure</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </Field>

        <Field label="Catatan internal" hint="Tidak dikirim ke klien">
          <textarea className="input" placeholder="Detail untuk catatan operasional…" style={{ height: 60, padding: 10, resize: 'none', fontSize: 13, fontFamily: 'inherit' }} />
        </Field>

        {/* Multi-sesi handling */}
        <div className="card-flat" style={{ padding: 12, background: 'var(--info-soft)', borderColor: '#cfdde8', marginBottom: 14 }}>
          <span className="eyebrow" style={{ color: '#2c4a60', display: 'block', marginBottom: 6 }}>Penanganan paket multi-sesi</span>
          <div className="col gap-2">
            <label className="row gap-2" style={{ alignItems: 'flex-start', cursor: 'pointer' }}>
              <input type="radio" name="ms" defaultChecked style={{ marginTop: 3 }} />
              <div className="col"><span style={{ fontSize: 12.5, fontWeight: 500, color: '#2c4a60' }}>Batalkan hanya sesi ini</span><span className="caption" style={{ fontSize: 11, color: '#2c4a60' }}>2 sesi sisa tetap terjadwal</span></div>
            </label>
            <label className="row gap-2" style={{ alignItems: 'flex-start', cursor: 'pointer' }}>
              <input type="radio" name="ms" style={{ marginTop: 3 }} />
              <div className="col"><span style={{ fontSize: 12.5, fontWeight: 500, color: '#2c4a60' }}>Batalkan & jadwalkan ulang otomatis</span><span className="caption" style={{ fontSize: 11, color: '#2c4a60' }}>Sistem akan offer slot terdekat untuk sesi 1</span></div>
            </label>
            <label className="row gap-2" style={{ alignItems: 'flex-start', cursor: 'pointer' }}>
              <input type="radio" name="ms" style={{ marginTop: 3 }} />
              <div className="col"><span style={{ fontSize: 12.5, fontWeight: 500, color: '#2c4a60' }}>Batalkan seluruh paket</span><span className="caption" style={{ fontSize: 11, color: '#2c4a60' }}>Semua 3 sesi dibatalkan · perlu approval admin senior</span></div>
            </label>
          </div>
        </div>

        {/* Otomasi setelah batal: kuota psikolog terbuka & slot bisa diisi klien lain */}
        <div className="card-flat" style={{ padding: 12, background: 'var(--success-soft)', borderColor: '#c8e0ce', marginBottom: 14 }}>
          <span className="eyebrow" style={{ color: 'var(--success)', display: 'block', marginBottom: 6 }}>Otomatis setelah pembatalan</span>
          <div className="col gap-2">
            <div className="row gap-2" style={{ alignItems: 'flex-start' }}>
              <Icon name="check" size={13} stroke="var(--success)" sw={2.5} />
              <span className="caption" style={{ fontSize: 11.5, color: 'var(--success)', lineHeight: 1.5 }}>
                <strong>Kuota psikolog terbuka kembali.</strong> Jika Rina tadinya 4/4 klien hari ini, sekarang 3/4 — admin bisa tambah klien lain ke Rina.
              </span>
            </div>
            <div className="row gap-2" style={{ alignItems: 'flex-start' }}>
              <Icon name="check" size={13} stroke="var(--success)" sw={2.5} />
              <span className="caption" style={{ fontSize: 11.5, color: 'var(--success)', lineHeight: 1.5 }}>
                <strong>Slot Rina + Mint Room di jam ini bebas.</strong> Admin dapat langsung jadwalkan klien lain di slot yang sama, ruangan yang sama — tanpa pindah ruangan.
              </span>
            </div>
          </div>
        </div>

        {/* Notif preview */}
        <div className="card-flat" style={{ padding: 12, background: 'var(--cream-50)' }}>
          <div className="row gap-2" style={{ marginBottom: 8 }}>
            <Icon name="wa" size={14} stroke="var(--success)" />
            <span className="eyebrow">Notifikasi WhatsApp otomatis · 2 penerima</span>
          </div>
          <div className="col gap-1">
            <span className="caption" style={{ fontSize: 11.5 }}>✓ <strong>Eka Putri (klien)</strong> — pemberitahuan pembatalan + alasan</span>
            <span className="caption" style={{ fontSize: 11.5 }}>✓ <strong>Rina Hartono (psikolog)</strong> — pemberitahuan slot kosong</span>
          </div>
          <div className="caption" style={{ fontSize: 10.5, marginTop: 8, lineHeight: 1.5 }}>
            Status pengiriman bisa dipantau di Notifikasi WA · Log. Status "gagal" = nomor tidak aktif / WA web service tidak bisa kirim — admin perlu hubungi manual.
          </div>
        </div>
      </DialogFrame>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Notifikasi Center — bell icon panel (semua role)
// ────────────────────────────────────────────────────────────
function DialogNotifikasi() {
  const NOTIFS = [
    { id: 'n1', icon: 'cal',  tone: 'info',    title: 'Sesi berikutnya 30 menit lagi', body: 'Anita W. · Konseling Dewasa · Sky Room', time: '5 menit lalu', unread: true },
    { id: 'n2', icon: 'wa',   tone: 'success', title: 'WA reminder terkirim',           body: '12 sesi pukul 14:00–18:00 · 11 terbaca', time: '12 menit lalu', unread: true },
    { id: 'n3', icon: 'edit', tone: 'warning', title: 'Catatan sesi belum diisi',       body: 'Rina A. · sesi pagi 09:00 · jatuh tempo akhir hari', time: '1 jam lalu', unread: true },
    { id: 'n4', icon: 'msg',  tone: 'info',    title: 'Klien minta reschedule',         body: 'Bayu S. → Selasa 07 Mei · perlu approval', time: '2 jam lalu', unread: false },
    { id: 'n5', icon: 'user', tone: 'info',    title: 'Klien baru ditugaskan',          body: 'Tina H. · sesi pertama 23 Mei · 10:00', time: '3 jam lalu', unread: false },
    { id: 'n6', icon: 'bell', tone: 'warning', title: 'Paket Dito akan habis',          body: 'Sesi 2 dari 4 · tawarkan paket lanjutan', time: 'Kemarin', unread: false },
    { id: 'n7', icon: 'check',tone: 'success', title: 'Feedback klien baru',            body: '"Sangat membantu, terima kasih." — Sari W. (★ 5)', time: 'Kemarin', unread: false },
    { id: 'n8', icon: 'eye',  tone: 'danger',  title: 'Akses data klien ditolak',       body: 'Vina coba akses klien Bu Rara · BR-04 enforced', time: '2 hari lalu', unread: false },
  ];
  const TONE = {
    info:    { bg: 'var(--info-soft)',    fg: 'var(--info)' },
    success: { bg: 'var(--success-soft)', fg: 'var(--success)' },
    warning: { bg: 'var(--warning-soft)', fg: '#8a4a00' },
    danger:  { bg: 'var(--danger-soft)',  fg: 'var(--danger)' },
  };
  const unreadCount = NOTIFS.filter(n => n.unread).length;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--cream-100)' }}>
      {/* Mock app behind */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.3 }}>
        <DesktopAdmin />
      </div>

      {/* Notif panel — anchored top-right under bell */}
      <div style={{ position: 'absolute', top: 56, right: 80, width: 400, maxHeight: 700, background: 'var(--bg-elev)', borderRadius: 12, boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Anchor arrow */}
        <div style={{ position: 'absolute', top: -7, right: 30, width: 14, height: 14, background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRight: 'none', borderBottom: 'none', transform: 'rotate(45deg)' }} />

        <header style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="row gap-2" style={{ alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 500, color: 'var(--teal-800)' }}>Notifikasi</h2>
            {unreadCount > 0 && <span className="badge badge-rose" style={{ height: 20 }}>{unreadCount} baru</span>}
          </div>
          <div className="row gap-1">
            <button className="btn btn-ghost btn-sm" style={{ height: 26, padding: '0 8px', fontSize: 11 }}>Tandai semua dibaca</button>
            <button className="btn btn-icon btn-ghost btn-sm"><Icon name="settings" size={14} /></button>
          </div>
        </header>

        {/* Filter tabs */}
        <div className="row gap-1" style={{ padding: '8px 18px', borderBottom: '1px solid var(--border)' }}>
          {[['all', 'Semua', NOTIFS.length], ['unread', 'Belum dibaca', unreadCount], ['action', 'Perlu aksi', 3]].map(([k, lbl, n], i) => (
            <button key={k} className="btn btn-sm" style={{ height: 28, padding: '0 10px', fontSize: 12,
              background: i === 0 ? 'var(--sage-100)' : 'transparent',
              color: i === 0 ? 'var(--sage-800)' : 'var(--fg-muted)',
              fontWeight: i === 0 ? 600 : 500 }}>{lbl} <span style={{ marginLeft: 4, opacity: 0.7 }}>{n}</span></button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {NOTIFS.map((n, i) => {
            const t = TONE[n.tone];
            return (
              <div key={n.id} style={{ padding: '12px 18px', borderTop: i ? '1px solid var(--border)' : 'none', display: 'flex', gap: 12, background: n.unread ? 'var(--cream-50)' : 'transparent', cursor: 'pointer', position: 'relative' }}>
                {n.unread && <span style={{ position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', width: 6, height: 6, borderRadius: 999, background: 'var(--sage-500)' }} />}
                <div style={{ width: 32, height: 32, borderRadius: 999, background: t.bg, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Icon name={n.icon} size={14} stroke={t.fg} />
                </div>
                <div className="col grow" style={{ minWidth: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: n.unread ? 600 : 500, color: 'var(--teal-800)' }}>{n.title}</span>
                  <span className="caption" style={{ fontSize: 11.5, marginTop: 2, lineHeight: 1.45 }}>{n.body}</span>
                  <span className="caption" style={{ fontSize: 10.5, marginTop: 4, color: 'var(--fg-subtle)' }}>{n.time}</span>
                </div>
              </div>
            );
          })}
        </div>

        <footer style={{ padding: 12, borderTop: '1px solid var(--border)', textAlign: 'center', background: 'var(--cream-50)' }}>
          <a style={{ fontSize: 12, color: 'var(--sage-700)', cursor: 'pointer', fontWeight: 500 }}>Lihat semua notifikasi →</a>
        </footer>
      </div>
    </div>
  );
}

Object.assign(window, { DialogReschedule, DialogCancel, DialogNotifikasi });
