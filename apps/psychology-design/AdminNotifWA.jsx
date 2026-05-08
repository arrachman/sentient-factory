// Admin · Notifikasi WhatsApp — log + template editor.
// Single source of truth untuk seluruh template WA. Daftar ini disinkronkan
// dengan tab Notifikasi di Pengaturan Klinik (AdminPengaturan.jsx) — id di
// sini = templateId yang dirujuk dari kartu config di Pengaturan.
//
// Kategori:
//   pengingat  — auto-scheduled (cron) berdasarkan booking
//   jadwal     — admin action (reschedule, batal, ubah ruangan)
//   onboarding — pendaftaran klien & akun staff
//   bayar      — DP, bukti pembayaran, pengingat pelunasan

const TEMPLATE_CATEGORIES = [
  { id: 'pengingat',  label: 'Pengingat sesi otomatis',  hint: 'Cron-scheduled berdasarkan booking' },
  { id: 'jadwal',     label: 'Perubahan jadwal',         hint: 'Dipicu oleh aksi admin' },
  { id: 'onboarding', label: 'Onboarding & akun',        hint: 'Pendaftaran klien & staff' },
  { id: 'bayar',      label: 'Pembayaran',               hint: 'DP, pelunasan, bukti bayar' },
];

const WA_TEMPLATES = [
  // ── Pengingat sesi otomatis ────────────────────────────────────
  { id: 't-konfirm',     cat: 'pengingat',  name: 'Konfirmasi Booking',         trigger: 'Saat sesi dijadwalkan',                  recip: ['klien','psikolog'], sentToday: 12, active: true  },
  { id: 't-h1',          cat: 'pengingat',  name: 'Pengingat H-1',              trigger: '24 jam sebelum sesi · pukul 18:00',       recip: ['klien','psikolog'], sentToday: 14, active: true  },
  { id: 't-30m',         cat: 'pengingat',  name: 'Pengingat 30 Menit',         trigger: '30 menit sebelum sesi (PRD BR-08)',       recip: ['klien','psikolog'], sentToday: 6,  active: true  },
  { id: 't-followup',    cat: 'pengingat',  name: 'Follow-up Pasca Sesi',       trigger: '3 jam setelah sesi',                      recip: ['klien'],            sentToday: 0,  active: true  },
  { id: 't-lanjutan',    cat: 'pengingat',  name: 'Pengingat Sesi Lanjutan',    trigger: 'H+7 setelah sesi (paket multi-sesi)',     recip: ['klien'],            sentToday: 0,  active: false },
  { id: 't-paket-habis', cat: 'pengingat',  name: 'Paket Akan Habis',           trigger: 'Sesi tersisa ≤ 1 dari paket',             recip: ['klien'],            sentToday: 0,  active: true  },
  { id: 't-week-empty',  cat: 'pengingat',  name: 'Pengingat Minggu Kosong',    trigger: 'H-3 sebelum minggu kerja yang ≥50% kosong', recip: ['psikolog'],         sentToday: 0,  active: true  },

  // ── Perubahan jadwal (admin action) ────────────────────────────
  { id: 't-resched-k',   cat: 'jadwal',     name: 'Reschedule — Klien',         trigger: 'Saat admin reschedule sesi',              recip: ['klien'],            sentToday: 2,  active: true  },
  { id: 't-resched-p',   cat: 'jadwal',     name: 'Reschedule — Psikolog',      trigger: 'Saat admin reschedule sesi',              recip: ['psikolog'],         sentToday: 2,  active: true  },
  { id: 't-cancel-k',    cat: 'jadwal',     name: 'Batal Sesi — Klien',         trigger: 'Saat admin batalkan sesi',                recip: ['klien'],            sentToday: 1,  active: true  },
  { id: 't-cancel-p',    cat: 'jadwal',     name: 'Batal Sesi — Psikolog',      trigger: 'Saat admin batalkan sesi',                recip: ['psikolog'],         sentToday: 1,  active: true  },
  { id: 't-ruangan-k',   cat: 'jadwal',     name: 'Ubah Ruangan — Klien',       trigger: 'Saat ruangan diubah (jam tetap)',         recip: ['klien'],            sentToday: 0,  active: true  },
  { id: 't-ruangan-p',   cat: 'jadwal',     name: 'Ubah Ruangan — Psikolog',    trigger: 'Saat ruangan diubah (jam tetap)',         recip: ['psikolog'],         sentToday: 0,  active: true  },

  // ── Onboarding & akun ──────────────────────────────────────────
  { id: 't-welcome',     cat: 'onboarding', name: 'Selamat Datang Klien Baru',  trigger: 'Saat klien disimpan pertama kali',        recip: ['klien'],            sentToday: 1,  active: true  },
  { id: 't-invite',      cat: 'onboarding', name: 'Invite User Staff',          trigger: 'Saat akun staff/psikolog dibuat',         recip: ['staff'],            sentToday: 0,  active: true  },
  { id: 't-otp',         cat: 'onboarding', name: 'OTP Login (Lupa Password)',  trigger: 'Saat user request reset kata sandi',      recip: ['user'],             sentToday: 0,  active: true  },

  // ── Pembayaran ─────────────────────────────────────────────────
  { id: 't-dp',          cat: 'bayar',      name: 'Tagihan DP',                 trigger: 'Setelah booking dibuat',                  recip: ['klien'],            sentToday: 3,  active: true  },
  { id: 't-bukti-bayar', cat: 'bayar',      name: 'Bukti Pembayaran (PDF)',     trigger: 'Setelah pelunasan · add-on',              recip: ['klien'],            sentToday: 0,  active: false, addon: true },
  { id: 't-pelunasan',   cat: 'bayar',      name: 'Pengingat Pelunasan',        trigger: 'Belum lunas H-1 sebelum sesi',            recip: ['klien'],            sentToday: 0,  active: true  },
];

const WA_LOG = [
  { time: '07.30', client: 'Anita W.', tpl: 'Pengingat 30 Menit',  status: 'terbaca', phone: '+62 813 5544 8821' },
  { time: '07.32', client: 'Davi P.',  tpl: 'Pengingat 30 Menit',  status: 'terkirim', phone: '+62 813 4421 7700' },
  { time: '07.45', client: 'Bayu S.',  tpl: 'Pengingat H-1',    tplFor: 'Sesi besok 12.00', status: 'terbaca',  phone: '+62 821 9988 4412' },
  { time: '08.05', client: 'Citra A.', tpl: 'Konfirmasi Booking', status: 'terbaca', phone: '+62 856 7733 9921' },
  { time: '09.10', client: 'Eka P.',   tpl: 'Pengingat 30 Menit',  status: 'gagal', phone: '+62 822 1144 5566', err: 'No. WA tidak aktif' },
  { time: '09.12', client: 'Eka P.',   tpl: 'Pengingat 30 Menit',  status: 'terkirim', phone: '+62 822 1144 5566 (alt)' },
  { time: '10.30', client: 'Indra K.', tpl: 'Follow-up Pasca Sesi', status: 'terkirim', phone: '+62 813 9988 7766' },
  { time: '11.00', client: 'PT Aksara', tpl: 'Konfirmasi Booking', status: 'terbaca', phone: '+62 877 2233 4488' },
  { time: '11.45', client: 'Bayu S.',  tpl: 'Pengingat 30 Menit',  status: 'terbaca', phone: '+62 821 9988 4412' },
];

const statusStyle = (s) => ({
  terbaca:   { bg: 'var(--success-soft)', fg: 'var(--success)' },
  terkirim:  { bg: 'var(--info-soft)',    fg: 'var(--info)' },
  gagal:     { bg: 'var(--danger-soft)',  fg: 'var(--danger)' },
}[s]);

// Body template per id. Disusun ringkas — variabel pakai sintaks {var} sesuai
// dengan placeholder yang dipakai di engine WA gateway.
const TEMPLATE_BODIES = {
  't-konfirm': `Halo *{nama_klien}*,

Booking Anda di Althea Psychology terkonfirmasi:
📅 {tanggal} · ⏰ {waktu_sesi}
👤 {nama_psikolog} · 🏠 {nama_ruangan}
🩺 {nama_layanan}

Mohon hadir 10 menit lebih awal. Balas pesan ini jika perlu reschedule.

— Tim Althea`,

  't-h1': `Halo *{nama_klien}*,

Mengingatkan sesi Anda besok di Althea Psychology:
📅 {tanggal} · ⏰ {waktu_sesi}
👤 dengan {nama_psikolog}
🏠 {nama_ruangan}

Mohon hadir 10 menit sebelum sesi dimulai. Balas pesan ini bila perlu reschedule.

— Tim Althea
Jl. Soekarno-Hatta No.12, Malang`,

  't-30m': `Halo *{nama_klien}*,

Sesi Anda dimulai 30 menit lagi pukul *{waktu_sesi}* bersama {nama_psikolog} di {nama_ruangan}. Sampai jumpa!

— Althea Psychology`,

  't-followup': `Terima kasih *{nama_klien}* sudah menyelesaikan sesi hari ini bersama {nama_psikolog} 🌿

Kami ingin memastikan pengalaman Anda baik. Mohon luangkan 1 menit untuk feedback:
👉 {link_feedback}

Sampai bertemu di sesi berikutnya.
— Tim Althea`,

  't-lanjutan': `Halo *{nama_klien}*,

Anda masih punya {sisa_sesi} sesi tersisa di paket *{nama_layanan}*. Yuk segera jadwalkan sesi berikutnya — tim kami siap bantu cari slot yang cocok.

Balas pesan ini atau hubungi 0341-555-0123.
— Althea Psychology`,

  't-paket-habis': `Halo *{nama_klien}*,

Paket *{nama_layanan}* Anda akan selesai di sesi berikutnya. Konsultasi dengan {nama_psikolog} untuk menentukan langkah lanjut — apakah perlu paket lanjutan, atau sesi mandiri.

Balas pesan ini bila berminat melanjutkan.
— Tim Althea`,

  't-week-empty': `Halo *{nama_psikolog}*,

Pengingat: minggu kerja {tanggal_minggu} ({hari_pertama} – {hari_terakhir}) Anda masih *{persen_kosong}% kosong* — baru ada {sesi_terisi} dari {sesi_kapasitas} slot terbooking.

Mungkin saatnya:
• Cek availability mingguan — apakah ada hari yang tidak sengaja blokir?
• Hubungi admin kalau mau buka slot tambahan / promo paket lanjutan.

Pengaturan pengingat ini bisa diubah di Pengaturan · Notifikasi.
— Sistem Althea`,

  't-resched-k': `Halo *{nama_klien}*,

Jadwal sesi Anda telah diubah:
🔁 Dari: {jadwal_lama}
✅ Menjadi: {tanggal} · ⏰ {waktu_sesi}
👤 {nama_psikolog} · 🏠 {nama_ruangan}

Alasan: {alasan_reschedule}. Mohon konfirmasi dengan balas YA.
— Althea Psychology`,

  't-resched-p': `Halo *{nama_psikolog}*,

Jadwal sesi *{nama_klien}* telah di-reschedule:
🔁 Dari: {jadwal_lama}
✅ Menjadi: {tanggal} · ⏰ {waktu_sesi}
🏠 {nama_ruangan}

Detail di Dashboard Althea.`,

  't-cancel-k': `Halo *{nama_klien}*,

Mohon maaf, sesi Anda pada *{tanggal} pukul {waktu_sesi}* dengan {nama_psikolog} dibatalkan.
Alasan: {alasan_cancel}.

Untuk jadwal pengganti, balas pesan ini atau hubungi admin di 0341-555-0123.
— Althea Psychology`,

  't-cancel-p': `Halo *{nama_psikolog}*,

Sesi dengan *{nama_klien}* pada {tanggal} pukul {waktu_sesi} dibatalkan. Slot Anda kembali tersedia.
Alasan: {alasan_cancel}.

Detail lengkap di Dashboard.`,

  't-ruangan-k': `Halo *{nama_klien}*,

Ruangan untuk sesi Anda *{tanggal} pukul {waktu_sesi}* berubah:
🏠 Dari: {ruangan_lama}
✅ Menjadi: *{nama_ruangan}*

Jadwal & psikolog tetap sama. Mohon hadir di ruangan baru.
— Althea Psychology`,

  't-ruangan-p': `Halo *{nama_psikolog}*,

Ruangan sesi {nama_klien} pada {tanggal} pukul {waktu_sesi} berubah ke *{nama_ruangan}*. Jadwal & klien tetap sama.

Detail di Dashboard.`,

  't-welcome': `Selamat datang *{nama_klien}* 🌿

Terima kasih sudah memilih Althea Psychology. Profil Anda telah terdaftar dengan no. rekam medis *{no_rekam_medis}*.

Untuk jadwalkan sesi pertama, balas pesan ini atau hubungi admin di 0341-555-0123.
— Tim Althea`,

  't-invite': `Halo *{nama_user}*,

Akun Althea Psychology Anda telah dibuat sebagai *{role}*. Klik tautan berikut untuk aktivasi & set kata sandi:
🔗 {link_aktivasi}

Tautan berlaku 24 jam.
— Tim IT Althea`,

  't-otp': `Kode OTP Anda: *{kode_otp}*
Berlaku 5 menit. Jangan bagikan ke siapa pun.

Jika Anda tidak meminta reset password, abaikan pesan ini.
— Althea Psychology`,

  't-dp': `Halo *{nama_klien}*,

Tagihan DP untuk booking Anda:
💰 Rp {jumlah_dp} ({persen_dp}% dari total)
📅 Sesi: {tanggal} · {waktu_sesi}

Bayar sebelum {batas_bayar} via:
🏦 BCA · 1234567890 (a.n. Klinik Althea)
🏦 Mandiri · 9876543210
🟦 QRIS — minta link ke admin

Konfirmasi pembayaran dengan balas bukti transfer.
— Althea Psychology`,

  't-bukti-bayar': `Halo *{nama_klien}*,

Pembayaran Anda untuk sesi *{tanggal}* telah lunas. Terima kasih 🙏

Bukti pembayaran terlampir di pesan ini (PDF).
📄 {link_invoice}

Total: Rp {jumlah_total}
No. invoice: {no_invoice}
— Althea Psychology`,

  't-pelunasan': `Halo *{nama_klien}*,

Mengingatkan sisa pembayaran sesi Anda besok ({tanggal} pukul {waktu_sesi}):
💰 Sisa: Rp {jumlah_sisa}

Mohon lunasi sebelum sesi dimulai. Bayar via:
🏦 BCA · 1234567890
🏦 Mandiri · 9876543210
🟦 QRIS

Konfirmasi dengan balas bukti transfer.
— Althea Psychology`,
};

const recipientStyle = (r) => ({
  klien:    { bg: 'var(--sage-100)', fg: 'var(--sage-800)', label: 'klien' },
  psikolog: { bg: '#dde8f1',         fg: '#3b5b75',         label: 'psikolog' },
  staff:    { bg: 'var(--cream-200)', fg: '#6b5320',        label: 'staff' },
  user:     { bg: 'var(--info-soft)', fg: 'var(--info)',    label: 'user' },
}[r] || { bg: 'var(--cream-100)', fg: 'var(--fg-muted)', label: r });

function AdminNotifWA() {
  const [tplSelected, setTplSelected] = React.useState('t-h1');
  const tpl = WA_TEMPLATES.find(t => t.id === tplSelected);
  const body = (tpl && TEMPLATE_BODIES[tpl.id]) || '';

  const totalSentToday = WA_TEMPLATES.reduce((n, t) => n + (t.sentToday || 0), 0);
  const totalActive = WA_TEMPLATES.filter(t => t.active).length;

  return (
    <AdminShell active="notif" breadcrumb="Manajemen · Notifikasi WA" title="WhatsApp Otomatis">
      <div style={{ padding: '18px 28px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="row gap-3">
          <div className="row gap-2" style={{ background: 'var(--success-soft)', border: '1px solid #c8e0ce', borderRadius: 999, padding: '6px 14px' }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--success)', boxShadow: '0 0 0 4px rgba(79,140,91,0.18)' }} />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--success)' }}>Tersambung · WA Business +62 822 1100 8899</span>
          </div>
        </div>
        <div className="row gap-2">
          <button className="btn btn-outline btn-sm"><Icon name="settings" size={14} /> Pengaturan WA</button>
          <button className="btn btn-primary btn-sm"><Icon name="plus" size={15} stroke="#fff" /> Template Baru</button>
        </div>
      </div>

      <div style={{ padding: '0 28px 16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { lbl: 'Terkirim hari ini', val: String(totalSentToday), sub: '↑ 12% vs kemarin' },
          { lbl: 'Tingkat baca', val: '87%', sub: 'rata-rata 7 hari' },
          { lbl: 'Gagal kirim', val: '1', sub: 'no. tidak aktif' },
          { lbl: 'Template aktif', val: `${totalActive}/${WA_TEMPLATES.length}`, sub: `${WA_TEMPLATES.length - totalActive} dijeda` },
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

      <div style={{ flex: 1, minHeight: 0, padding: '0 28px 28px', display: 'grid', gridTemplateColumns: '340px 1fr 380px', gap: 16 }}>
        {/* Templates list — grouped by category to mirror Pengaturan > Notifikasi */}
        <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="row" style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between' }}>
            <h2 className="h2" style={{ margin: 0 }}>Template ({WA_TEMPLATES.length})</h2>
            <span className="caption">sinkron dengan Pengaturan · Notifikasi</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {TEMPLATE_CATEGORIES.map((cat, ci) => {
              const items = WA_TEMPLATES.filter(t => t.cat === cat.id);
              if (items.length === 0) return null;
              return (
                <div key={cat.id}>
                  <div style={{ padding: '10px 16px 6px', background: 'var(--cream-50)', borderTop: ci ? '1px solid var(--border)' : 'none', borderBottom: '1px solid var(--border)' }}>
                    <div className="eyebrow" style={{ fontSize: 10.5, color: 'var(--teal-800)', fontWeight: 700 }}>{cat.label}</div>
                    <div className="caption" style={{ fontSize: 10.5, marginTop: 1 }}>{cat.hint}</div>
                  </div>
                  {items.map(t => {
                    const isSel = t.id === tplSelected;
                    return (
                      <div key={t.id} onClick={() => setTplSelected(t.id)}
                        style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer',
                          background: isSel ? 'var(--sage-50)' : 'transparent',
                          borderLeft: isSel ? '3px solid var(--sage-500)' : '3px solid transparent',
                          paddingLeft: isSel ? 13 : 16 }}>
                        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 3, alignItems: 'flex-start' }}>
                          <div className="col" style={{ minWidth: 0, flex: 1 }}>
                            <div className="row gap-2" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--teal-800)' }}>{t.name}</span>
                              {t.addon && <span className="badge badge-warn" style={{ height: 16, fontSize: 9.5 }}>add-on</span>}
                            </div>
                            <span className="caption" style={{ fontSize: 10.5, marginTop: 2, lineHeight: 1.4 }}>{t.trigger}</span>
                          </div>
                          <div style={{ width: 24, height: 14, borderRadius: 999, background: t.active ? 'var(--sage-500)' : 'var(--cream-200)', position: 'relative', flexShrink: 0, marginTop: 3 }}>
                            <div style={{ position: 'absolute', top: 2, left: t.active ? 12 : 2, width: 10, height: 10, borderRadius: 999, background: '#fff', transition: 'left .15s var(--ease)' }} />
                          </div>
                        </div>
                        <div className="row gap-1" style={{ marginTop: 4, flexWrap: 'wrap' }}>
                          {t.recip.map(r => {
                            const rs = recipientStyle(r);
                            return <span key={r} className="badge" style={{ height: 16, fontSize: 9.5, background: rs.bg, color: rs.fg }}>{rs.label}</span>;
                          })}
                          {t.sentToday > 0 && <span className="badge badge-neutral" style={{ height: 16, fontSize: 9.5 }}>{t.sentToday}× hari ini</span>}
                          {!t.active && <span className="badge badge-warn" style={{ height: 16, fontSize: 9.5 }}>dijeda</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity log */}
        <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="row" style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between' }}>
            <h2 className="h2" style={{ margin: 0 }}>Aktivitas Hari Ini</h2>
            <button className="btn btn-ghost btn-sm">Lihat semua <Icon name="chevR" size={13} /></button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {WA_LOG.map((l, i) => {
              const ss = statusStyle(l.status);
              return (
                <div key={i} className="row gap-3" style={{ padding: '12px 18px', borderBottom: i === WA_LOG.length - 1 ? 'none' : '1px solid var(--border)', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--fg-muted)', fontVariantNumeric: 'tabular-nums', width: 38, flexShrink: 0, paddingTop: 2 }}>{l.time}</span>
                  <div style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--success-soft)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <Icon name="wa" size={14} stroke="var(--success)" />
                  </div>
                  <div className="col grow" style={{ minWidth: 0 }}>
                    <div className="row gap-2">
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>{l.client}</span>
                      <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>· {l.tpl}</span>
                    </div>
                    <span className="caption" style={{ marginTop: 2 }}>{l.phone}{l.err ? ' · ' + l.err : ''}</span>
                  </div>
                  <span className="badge" style={{ background: ss.bg, color: ss.fg, textTransform: 'capitalize', flexShrink: 0 }}>{l.status}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Template editor */}
        {tpl && (
          <div className="card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}>
            <div className="col gap-1">
              <span className="eyebrow">Edit template · {tpl.id}</span>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 500, color: 'var(--teal-800)' }}>{tpl.name}</h3>
              <span className="caption">Trigger: {tpl.trigger}</span>
              <div className="row gap-1" style={{ marginTop: 6, flexWrap: 'wrap' }}>
                <span className="caption" style={{ fontSize: 11 }}>Penerima:</span>
                {tpl.recip.map(r => {
                  const rs = recipientStyle(r);
                  return <span key={r} className="badge" style={{ height: 18, fontSize: 10, background: rs.bg, color: rs.fg }}>{rs.label}</span>;
                })}
              </div>
            </div>

            <div className="col gap-1" style={{ flex: 1, minHeight: 0 }}>
              <label className="caption" style={{ fontWeight: 500, color: 'var(--teal-800)' }}>Pesan</label>
              <div style={{ background: 'var(--cream-50)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, fontSize: 12.5, lineHeight: 1.55, color: 'var(--fg)', whiteSpace: 'pre-wrap', flex: 1, overflowY: 'auto', fontFamily: 'inherit' }}>
                {body}
              </div>
            </div>

            <div className="col gap-2">
              <span className="caption" style={{ fontWeight: 500, color: 'var(--teal-800)' }}>Variabel tersedia</span>
              <div className="row gap-1" style={{ flexWrap: 'wrap' }}>
                {['{nama_klien}','{tanggal}','{waktu_sesi}','{nama_psikolog}','{nama_ruangan}','{nama_layanan}','{no_rekam_medis}','{kode_otp}'].map(v => (
                  <span key={v} className="badge badge-neutral" style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10.5 }}>{v}</span>
                ))}
              </div>
            </div>

            <div className="row gap-2" style={{ marginTop: 'auto' }}>
              <button className="btn btn-outline btn-sm" style={{ flex: 1 }}>Pratinjau</button>
              <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>Simpan</button>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

window.AdminNotifWA = AdminNotifWA;
