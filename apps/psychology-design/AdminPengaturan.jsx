// Admin · Pengaturan — pengaturan klinik (profil, jam operasional, notifikasi,
// pembayaran, keamanan). Single-page tabs, mock state.

// `disabled: true` → menu tampil grey out, tidak bisa di-klik.
// Saat ini Pembayaran & Keamanan tidak termasuk Paket Standard — bisa
// dibuka sebagai add-on di fase berikutnya. Dijaga visible (bukan hide)
// supaya klien tahu fitur ini ada di roadmap.
const SETTINGS_TABS = [
  ['klinik',     'Profil Klinik',    'Identitas & kontak'],
  ['jam',        'Jam Operasional',  'Hari & jam buka'],
  ['notifikasi', 'Notifikasi',       'WhatsApp, email, reminder'],
  ['pembayaran', 'Pembayaran',       'Metode & invoice',  { disabled: true, reason: 'Add-on · tidak aktif di Paket Standard' }],
  ['keamanan',   'Keamanan',         'Sesi & akses',      { disabled: true, reason: 'Add-on · tidak aktif di Paket Standard' }],
];

const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

function FieldRow({ label, hint, children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, padding: '18px 0', borderBottom: '1px solid var(--border)', alignItems: 'start' }}>
      <div className="col">
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>{label}</span>
        {hint && <span className="caption" style={{ marginTop: 4 }}>{hint}</span>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Toggle({ on = false, label }) {
  return (
    <div className="row gap-2" style={{ alignItems: 'center' }}>
      <span style={{ width: 34, height: 20, borderRadius: 999, background: on ? 'var(--sage-500)' : 'var(--cream-300)', position: 'relative', flexShrink: 0, transition: 'background .15s' }}>
        <span style={{ position: 'absolute', top: 2, left: on ? 16 : 2, width: 16, height: 16, borderRadius: 999, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.15)', transition: 'left .15s' }} />
      </span>
      {label && <span style={{ fontSize: 13, color: 'var(--fg)' }}>{label}</span>}
    </div>
  );
}

function TabKlinik() {
  return (
    <div className="card" style={{ padding: '6px 22px 22px' }}>
      <FieldRow label="Nama klinik" hint="Tampil di header dan invoice">
        <input className="input" defaultValue="Althea Psychology" style={{ maxWidth: 380, height: 36, fontSize: 13 }} />
      </FieldRow>
      <FieldRow label="Logo" hint="PNG/SVG, maks 1 MB, rasio 1:1">
        <div className="row gap-3" style={{ alignItems: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--sage-500)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 24 }}>A</div>
          <button className="btn btn-outline btn-sm">Ganti logo</button>
          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--fg-muted)' }}>Hapus</button>
        </div>
      </FieldRow>
      <FieldRow label="Tagline">
        <input className="input" defaultValue="Ruang aman untuk tumbuh, sembuh, dan berdaya" style={{ height: 36, fontSize: 13 }} />
      </FieldRow>
      <FieldRow label="Alamat" hint="Tampil di footer & email konfirmasi">
        <textarea className="input" defaultValue={'Jl. Soekarno-Hatta No. 12\nKlojen, Malang, Jawa Timur 65145'} style={{ height: 70, fontSize: 13, padding: 10, resize: 'none', fontFamily: 'inherit' }} />
      </FieldRow>
      <FieldRow label="Telepon klinik">
        <input className="input" defaultValue="+62 341 555 0123" style={{ maxWidth: 240, height: 36, fontSize: 13 }} />
      </FieldRow>
      <FieldRow label="Email">
        <input className="input" defaultValue="hello@althea-psychology.id" style={{ maxWidth: 320, height: 36, fontSize: 13 }} />
      </FieldRow>
      <FieldRow label="Zona waktu">
        <select className="input" defaultValue="WIB" style={{ maxWidth: 240, height: 36, fontSize: 13 }}>
          <option>WIB (UTC+7)</option>
          <option>WITA (UTC+8)</option>
          <option>WIT (UTC+9)</option>
        </select>
      </FieldRow>
      <FieldRow label="Bahasa default">
        <select className="input" defaultValue="id" style={{ maxWidth: 240, height: 36, fontSize: 13 }}>
          <option value="id">Bahasa Indonesia</option>
          <option value="en">English</option>
        </select>
      </FieldRow>
    </div>
  );
}

function TabJam() {
  const initial = HARI.map(h => ({ hari: h, buka: h !== 'Minggu', from: '08:00', to: h === 'Sabtu' ? '15:00' : '19:00' }));
  return (
    <div className="card" style={{ padding: '6px 22px 22px' }}>
      <FieldRow label="Jam operasional" hint="Klien hanya bisa booking di rentang ini">
        <div className="col gap-2" style={{ maxWidth: 520 }}>
          {initial.map(d => (
            <div key={d.hari} className="row gap-3" style={{ padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 8, alignItems: 'center', opacity: d.buka ? 1 : 0.55 }}>
              <Toggle on={d.buka} />
              <span style={{ width: 70, fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>{d.hari}</span>
              <input className="input" defaultValue={d.from} style={{ width: 90, height: 32, fontSize: 13, fontVariantNumeric: 'tabular-nums' }} disabled={!d.buka} />
              <span className="caption">sampai</span>
              <input className="input" defaultValue={d.to} style={{ width: 90, height: 32, fontSize: 13, fontVariantNumeric: 'tabular-nums' }} disabled={!d.buka} />
              <span className="caption" style={{ marginLeft: 'auto' }}>{d.buka ? 'Buka' : 'Tutup'}</span>
            </div>
          ))}
        </div>
      </FieldRow>
      <FieldRow label="Slot buffer" hint="Jeda otomatis antar sesi (untuk catatan & istirahat)">
        <select className="input" defaultValue="15" style={{ maxWidth: 200, height: 36, fontSize: 13 }}>
          <option value="0">Tanpa buffer</option>
          <option value="10">10 menit</option>
          <option value="15">15 menit</option>
          <option value="30">30 menit</option>
        </select>
      </FieldRow>
      <FieldRow label="Tanggal merah" hint="Otomatis tutup pada hari libur nasional">
        <Toggle on label="Tutup otomatis pada hari libur nasional Indonesia" />
      </FieldRow>
    </div>
  );
}

// Baris konfigurasi WA per-event. Mendukung daftar penerima yang fleksibel
// (klien, psikolog, staff, dll) — beberapa event hanya kirim ke satu pihak,
// beberapa kirim ke dua pihak. Optional `extra` slot untuk pengaturan timing
// (jam pengingat, jeda follow-up, dll). Semua sumber WA di prototype tercakup
// di sini sebagai single source of truth.
//
// `templates` = array of {id, label} untuk button "Edit pesan" yang link ke
// halaman Notifikasi WA · Template editor. Ada beberapa event yang punya 2
// template (mis. reschedule punya t-resched-k untuk klien, t-resched-p untuk
// psikolog) — keduanya muncul sebagai tombol terpisah.
function NotifEventRow({ title, hint, recipients = [], danger = false, extra, badge, templates }) {
  // Navigate ke halaman Notifikasi WA (artboard) via hash routing yang sudah
  // ada di design-canvas. Tetap menyebut tplId sebagai query string supaya
  // bisa di-extend nanti — utk sekarang hanya navigate ke halamannya.
  const goToTemplate = (tplId) => {
    try {
      const path = window.location.pathname + (tplId ? `?tpl=${encodeURIComponent(tplId)}` : '');
      const hash = '#manajemen/admin-notif';
      history.replaceState(null, '', path + hash);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } catch (e) {
      window.location.hash = 'manajemen/admin-notif';
    }
  };
  return (
    <div className="row gap-3" style={{ padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <div className="col" style={{ flex: 1, minWidth: 220 }}>
        <div className="row gap-2" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: danger ? '#a14a4a' : 'var(--teal-800)' }}>{title}</span>
          {badge && <span className="badge badge-neutral" style={{ height: 18, fontSize: 10 }}>{badge}</span>}
        </div>
        {hint && <span className="caption" style={{ marginTop: 2 }}>{hint}</span>}
        {/* Tombol "Edit pesan" — link ke halaman Notifikasi WA · Template */}
        {Array.isArray(templates) && templates.length > 0 && (
          <div className="row gap-1" style={{ flexWrap: 'wrap', marginTop: 6 }}>
            {templates.map(t => (
              <button key={t.id} onClick={(e) => { e.stopPropagation(); goToTemplate(t.id); }}
                className="btn btn-ghost btn-sm"
                style={{ height: 22, padding: '0 8px', fontSize: 11, color: 'var(--sage-700)', background: 'var(--sage-50)', border: '1px solid var(--sage-200)', borderRadius: 999 }}
                title={`Buka template editor (${t.id})`}>
                <Icon name="edit" size={10} stroke="var(--sage-700)" /> Edit pesan
                {t.label ? <span style={{ opacity: 0.7, marginLeft: 4 }}>· {t.label}</span> : null}
              </button>
            ))}
          </div>
        )}
      </div>
      {extra && <div style={{ flexShrink: 0 }}>{extra}</div>}
      {recipients.length > 0 && (
        <div className="row gap-3" style={{ alignItems: 'center', flexShrink: 0 }}>
          {recipients.map(r => <Toggle key={r.id} on={r.on} label={r.label} />)}
        </div>
      )}
    </div>
  );
}

function TabNotifikasi() {
  // Helper untuk dropdown ringkas
  const sel = (val, opts, w = 130) => (
    <select className="input" defaultValue={val} style={{ width: w, height: 32, fontSize: 12 }}>
      {opts.map(o => <option key={o[0]} value={o[0]}>{o[1]}</option>)}
    </select>
  );

  return (
    <div className="card" style={{ padding: '6px 22px 22px' }}>
      {/* Status koneksi WA Business */}
      <FieldRow label="Koneksi WhatsApp" hint="API resmi — semua notif kirim dari nomor ini">
        <div className="col gap-2" style={{ maxWidth: 580 }}>
          <div className="row gap-2" style={{ padding: '10px 14px', background: 'var(--success-soft)', border: '1px solid #c8e0ce', borderRadius: 8, alignItems: 'center' }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--success)', boxShadow: '0 0 0 4px rgba(79,140,91,0.18)', flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--success)', flex: 1 }}>Tersambung · WA Business +62 822 1100 8899</span>
            <span className="badge badge-success">terverifikasi</span>
          </div>
          <a className="caption"
            onClick={(e) => {
              e.preventDefault();
              try {
                history.replaceState(null, '', window.location.pathname + '#manajemen/admin-notif');
                window.dispatchEvent(new HashChangeEvent('hashchange'));
              } catch { window.location.hash = 'manajemen/admin-notif'; }
            }}
            style={{ color: 'var(--sage-700)', cursor: 'pointer', fontSize: 11.5 }}>
            Buka halaman Notifikasi WA · Log & template untuk edit isi pesan →
          </a>
        </div>
      </FieldRow>

      {/* ── 1. Pengingat sesi otomatis (cron-scheduled) ─────────────── */}
      <FieldRow label="Pengingat sesi otomatis" hint="Dijadwalkan otomatis berdasarkan booking. Edit isi pesan via Notifikasi WA · Template.">
        <div className="col gap-2" style={{ maxWidth: 580 }}>
          <NotifEventRow
            title="Konfirmasi booking"
            hint="Trigger: saat admin selesai jadwalkan klien"
            templates={[{ id: 't-konfirm' }]}
            recipients={[
              { id: 'klien', label: 'WA klien', on: true },
              { id: 'psikolog', label: 'WA psikolog', on: true },
            ]}
          />
          <NotifEventRow
            title="Pengingat H-1"
            hint="Trigger: 24 jam sebelum sesi"
            templates={[{ id: 't-h1' }]}
            extra={<div className="row gap-1" style={{ alignItems: 'center' }}>
              <span className="caption" style={{ fontSize: 11 }}>kirim pukul</span>
              <input className="input" defaultValue="18:00" style={{ width: 70, height: 32, fontSize: 12, fontVariantNumeric: 'tabular-nums', textAlign: 'center' }} />
            </div>}
            recipients={[
              { id: 'klien', label: 'WA klien', on: true },
              { id: 'psikolog', label: 'WA psikolog', on: true },
            ]}
          />
          <NotifEventRow
            title="Pengingat 30 menit"
            hint="Trigger: 30 menit sebelum sesi (PRD BR-08)"
            templates={[{ id: 't-30m' }]}
            badge="BR-08"
            recipients={[
              { id: 'klien', label: 'WA klien', on: true },
              { id: 'psikolog', label: 'WA psikolog', on: true },
            ]}
          />
          <NotifEventRow
            title="Follow-up pasca sesi"
            hint="Ucapan terima kasih + permintaan feedback (opsi: lampirkan bukti pembayaran)"
            templates={[{ id: 't-followup' }]}
            extra={sel('3', [['1','1 jam setelah'], ['3','3 jam setelah'], ['24','1 hari setelah']], 130)}
            recipients={[{ id: 'klien', label: 'WA klien', on: true }]}
          />
          <NotifEventRow
            title="Pengingat sesi lanjutan"
            hint="Untuk paket multi-sesi yang sesinya belum dijadwal"
            templates={[{ id: 't-lanjutan' }]}
            extra={sel('7', [['3','H+3'], ['7','H+7'], ['14','H+14']], 90)}
            recipients={[{ id: 'klien', label: 'WA klien', on: false }]}
          />
          <NotifEventRow
            title="Paket akan habis"
            hint="Trigger: saat sesi tersisa ≤ 1 dari paket — tawarkan paket lanjutan"
            templates={[{ id: 't-paket-habis' }]}
            recipients={[{ id: 'klien', label: 'WA klien', on: true }]}
          />
          <NotifEventRow
            title="Pengingat minggu kosong (psikolog)"
            hint="Kirim WA ke psikolog kalau minggu kerja mendatang masih banyak slot kosong — jadi mereka bisa cek availability / promo lanjutan."
            badge="psikolog"
            templates={[{ id: 't-week-empty' }]}
            extra={<div className="row gap-1" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="caption" style={{ fontSize: 11 }}>kirim</span>
              {sel('3', [['1','H-1'], ['3','H-3'], ['5','H-5'], ['7','H-7']], 78)}
              <span className="caption" style={{ fontSize: 11 }}>jika kosong ≥</span>
              {sel('50', [['30','30%'], ['50','50%'], ['70','70%'], ['80','80%']], 78)}
            </div>}
            recipients={[{ id: 'psikolog', label: 'WA psikolog', on: true }]}
          />
        </div>
      </FieldRow>

      {/* ── 2. Perubahan jadwal (admin action) ─────────────────────── */}
      <FieldRow label="Perubahan jadwal sesi" hint="Dipicu manual saat admin ubah jadwal. Default: kirim ke klien & psikolog.">
        <div className="col gap-2" style={{ maxWidth: 580 }}>
          <NotifEventRow
            title="Ubah jadwal sesi (reschedule)"
            hint="Kirim pesan jadwal baru ke kedua pihak."
            templates={[{ id: 't-resched-k', label: 'klien' }, { id: 't-resched-p', label: 'psikolog' }]}
            recipients={[
              { id: 'klien', label: 'WA klien', on: true },
              { id: 'psikolog', label: 'WA psikolog', on: true },
            ]}
          />
          <NotifEventRow
            title="Batalkan sesi"
            hint="Kirim alasan + slot kosong."
            danger
            templates={[{ id: 't-cancel-k', label: 'klien' }, { id: 't-cancel-p', label: 'psikolog' }]}
            recipients={[
              { id: 'klien', label: 'WA klien', on: true },
              { id: 'psikolog', label: 'WA psikolog', on: true },
            ]}
          />
          <NotifEventRow
            title="Ubah ruangan saja (psikolog & jam tetap)"
            hint="Kirim pemberitahuan ruangan baru tanpa mengubah jadwal."
            templates={[{ id: 't-ruangan-k', label: 'klien' }, { id: 't-ruangan-p', label: 'psikolog' }]}
            recipients={[
              { id: 'klien', label: 'WA klien', on: true },
              { id: 'psikolog', label: 'WA psikolog', on: true },
            ]}
          />
          <NotifEventRow
            title="Ubah layanan klien (silent edit)"
            hint="Default: tidak kirim WA — admin tidak perlu kontak psikolog manual."
            recipients={[
              { id: 'klien', label: 'WA klien', on: false },
              { id: 'psikolog', label: 'WA psikolog', on: false },
            ]}
          />
          <div className="row gap-2" style={{ padding: 10, background: 'var(--info-soft)', borderRadius: 6, alignItems: 'flex-start', marginTop: 4 }}>
            <Icon name="bell" size={13} stroke="var(--info)" />
            <span className="caption" style={{ fontSize: 11.5, color: '#2c4a60', lineHeight: 1.5 }}>
              Mematikan WA ke psikolog tidak menonaktifkan notifikasi in-app — psikolog tetap melihat update di Dashboard mereka.
            </span>
          </div>
        </div>
      </FieldRow>

      {/* ── 3. Onboarding & akun ─────────────────────────────────── */}
      <FieldRow label="Onboarding & akun" hint="Pesan WA terkait pendaftaran klien dan akun staff">
        <div className="col gap-2" style={{ maxWidth: 580 }}>
          <NotifEventRow
            title="Selamat datang klien baru"
            hint="Trigger: setelah klien disimpan pertama kali"
            templates={[{ id: 't-welcome' }]}
            recipients={[{ id: 'klien', label: 'WA klien', on: true }]}
          />
          <NotifEventRow
            title="Invite user baru (admin / psikolog / staff)"
            hint="Link aktivasi akun + kata sandi awal"
            templates={[{ id: 't-invite' }]}
            recipients={[{ id: 'staff', label: 'WA staff', on: true }]}
          />
          <NotifEventRow
            title="OTP login (lupa password)"
            hint="Kode 6 digit untuk reset kata sandi (mobile flow)"
            templates={[{ id: 't-otp' }]}
            recipients={[{ id: 'user', label: 'WA user', on: true }]}
          />
        </div>
      </FieldRow>

      {/* ── 4. Pembayaran ────────────────────────────────────────── */}
      <FieldRow label="Pembayaran" hint="Notifikasi WA terkait DP, pelunasan, dan bukti pembayaran">
        <div className="col gap-2" style={{ maxWidth: 580 }}>
          <NotifEventRow
            title="Tagihan DP setelah booking"
            hint="Kirim instruksi pembayaran DP ke klien"
            templates={[{ id: 't-dp' }]}
            recipients={[{ id: 'klien', label: 'WA klien', on: true }]}
          />
          <NotifEventRow
            title="Bukti pembayaran (PDF) setelah pelunasan"
            hint="Lampirkan invoice PDF di pesan WA"
            badge="add-on"
            templates={[{ id: 't-bukti-bayar' }]}
            recipients={[{ id: 'klien', label: 'WA klien', on: false }]}
          />
          <NotifEventRow
            title="Pengingat pelunasan"
            hint="Kalau klien belum lunas H-1 sebelum sesi"
            templates={[{ id: 't-pelunasan' }]}
            recipients={[{ id: 'klien', label: 'WA klien', on: true }]}
          />
        </div>
      </FieldRow>

      {/* ── 5. Pengiriman & retry (technical settings) ─────────────── */}
      <FieldRow label="Pengiriman & retry" hint="Bagaimana sistem menangani pengiriman & kegagalan">
        <div className="col gap-3" style={{ maxWidth: 580 }}>
          <div className="row gap-3" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="col" style={{ flex: 1, minWidth: 220 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>Pengirim WA</span>
              <span className="caption" style={{ marginTop: 2 }}>Nomor terdaftar di WA Business API</span>
            </div>
            <input className="input" defaultValue="+62 822 1100 8899" style={{ width: 200, height: 32, fontSize: 12 }} />
            <span className="badge badge-success">terverifikasi</span>
          </div>
          <div className="row gap-3" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="col" style={{ flex: 1, minWidth: 220 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>Jumlah retry otomatis</span>
              <span className="caption" style={{ marginTop: 2 }}>Coba kirim ulang kalau gagal</span>
            </div>
            {sel('3', [['0','Tidak retry'], ['1','1 kali'], ['3','3 kali'], ['5','5 kali']], 130)}
          </div>
          <div className="row gap-3" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="col" style={{ flex: 1, minWidth: 220 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>Jeda antar retry</span>
              <span className="caption" style={{ marginTop: 2 }}>Tunggu sekian lama sebelum coba lagi</span>
            </div>
            {sel('5', [['1','1 menit'], ['5','5 menit'], ['15','15 menit'], ['60','1 jam']], 130)}
          </div>
          <div className="row gap-3" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="col" style={{ flex: 1, minWidth: 220 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>Jam pengiriman</span>
              <span className="caption" style={{ marginTop: 2 }}>Di luar jam ini, pesan masuk antrian sampai pagi</span>
            </div>
            <div className="row gap-2" style={{ alignItems: 'center' }}>
              <input className="input" defaultValue="07:00" style={{ width: 70, height: 32, fontSize: 12, fontVariantNumeric: 'tabular-nums', textAlign: 'center' }} />
              <span className="caption">sampai</span>
              <input className="input" defaultValue="21:00" style={{ width: 70, height: 32, fontSize: 12, fontVariantNumeric: 'tabular-nums', textAlign: 'center' }} />
            </div>
          </div>
          <div className="row gap-3" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="col" style={{ flex: 1, minWidth: 220 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>Notif gagal kirim ke admin</span>
              <span className="caption" style={{ marginTop: 2 }}>Email harian rangkuman pesan yang gagal terkirim</span>
            </div>
            <Toggle on label="Aktif" />
          </div>
        </div>
      </FieldRow>

      {/* ── 6. Email & Telegram (existing channels) ─────────────────── */}
      <FieldRow label="Email" hint="Untuk invoice & rekap mingguan">
        <div className="col gap-3">
          <Toggle on label="Kirim invoice PDF setelah pembayaran" />
          <Toggle on label="Rekap mingguan ke admin (Senin pagi)" />
          <Toggle label="Rekap bulanan ke psikolog" />
        </div>
      </FieldRow>
      <FieldRow label="Telegram bot" hint="Notifikasi internal untuk admin">
        <button className="btn btn-outline btn-sm"><Icon name="plus" size={13} /> Sambungkan Telegram</button>
      </FieldRow>
    </div>
  );
}

function TabPembayaran() {
  const methods = [
    { n: 'Transfer Bank BCA',     d: 'a.n. Klinik Althea · 1234567890', on: true },
    { n: 'Transfer Bank Mandiri', d: 'a.n. Klinik Althea · 9876543210', on: true },
    { n: 'QRIS',                  d: 'Statis · auto-generate',          on: true },
    { n: 'Tunai di klinik',       d: 'Bayar saat datang',               on: true },
    { n: 'GoPay / OVO / Dana',    d: 'Via payment gateway Midtrans',    on: false },
  ];
  return (
    <div className="card" style={{ padding: '6px 22px 22px' }}>
      <FieldRow label="Metode pembayaran" hint="Klien hanya melihat metode yang aktif">
        <div className="col gap-2" style={{ maxWidth: 520 }}>
          {methods.map(m => (
            <div key={m.n} className="row gap-3" style={{ padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 8, alignItems: 'center' }}>
              <Toggle on={m.on} />
              <div className="col" style={{ flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>{m.n}</span>
                <span className="caption" style={{ marginTop: 2 }}>{m.d}</span>
              </div>
              <button className="btn btn-icon btn-ghost btn-sm"><Icon name="edit" size={13} /></button>
            </div>
          ))}
          <button className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start', marginTop: 6 }}><Icon name="plus" size={13} /> Tambah metode</button>
        </div>
      </FieldRow>
      <FieldRow label="DP wajib" hint="Persentase yang harus dibayar saat booking">
        <div className="row gap-2" style={{ alignItems: 'center' }}>
          <input className="input" defaultValue="50" style={{ width: 80, height: 36, fontSize: 13, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }} />
          <span className="caption">% dari total biaya sesi</span>
        </div>
      </FieldRow>
      <FieldRow label="Format invoice" hint="Pola nomor invoice otomatis">
        <input className="input" defaultValue="ALT/{YYYY}{MM}/{0000}" style={{ maxWidth: 280, height: 36, fontSize: 13, fontFamily: 'var(--font-mono, monospace)' }} />
      </FieldRow>
      <FieldRow label="PPN" hint="Diterapkan ke layanan korporat (MHCU, dll)">
        <Toggle label="Tampilkan PPN 11% pada invoice korporat" />
      </FieldRow>
    </div>
  );
}

function TabKeamanan() {
  return (
    <div className="card" style={{ padding: '6px 22px 22px' }}>
      <FieldRow label="Sesi login" hint="Berapa lama user tetap login tanpa aktivitas">
        <select className="input" defaultValue="8h" style={{ maxWidth: 240, height: 36, fontSize: 13 }}>
          <option value="1h">1 jam</option>
          <option value="4h">4 jam</option>
          <option value="8h">8 jam (1 hari kerja)</option>
          <option value="24h">24 jam</option>
        </select>
      </FieldRow>
      <FieldRow label="Two-factor auth" hint="Wajibkan OTP saat login dari perangkat baru">
        <Toggle on label="Aktifkan 2FA untuk semua admin & psikolog" />
      </FieldRow>
      <FieldRow label="Kata sandi" hint="Aturan minimal untuk semua akun">
        <div className="col gap-2">
          <Toggle on label="Minimal 8 karakter" />
          <Toggle on label="Mengandung angka & huruf besar" />
          <Toggle label="Wajib ganti tiap 90 hari" />
        </div>
      </FieldRow>
      <FieldRow label="Audit log" hint="Catat aktivitas perubahan data">
        <div className="row gap-3" style={{ alignItems: 'center' }}>
          <Toggle on />
          <span className="caption">Tersimpan 12 bulan · <a style={{ color: 'var(--sage-700)', cursor: 'pointer' }}>Lihat audit log</a></span>
        </div>
      </FieldRow>
      <FieldRow label="Zona berbahaya">
        <div className="col gap-2" style={{ padding: 14, background: 'var(--cream-100)', border: '1px solid var(--border)', borderRadius: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>Ekspor & hapus data klinik</span>
          <span className="caption">Operasi tidak bisa dibatalkan. Hanya pemilik klinik yang dapat menjalankan.</span>
          <div className="row gap-2" style={{ marginTop: 6 }}>
            <button className="btn btn-outline btn-sm">Ekspor seluruh data</button>
            <button className="btn btn-outline btn-sm" style={{ borderColor: '#c97a7a', color: '#a14a4a' }}>Hapus klinik</button>
          </div>
        </div>
      </FieldRow>
    </div>
  );
}

function AdminPengaturan() {
  const [tab, setTab] = React.useState('klinik');
  const Body = ({
    klinik: TabKlinik,
    jam: TabJam,
    notifikasi: TabNotifikasi,
    pembayaran: TabPembayaran,
    keamanan: TabKeamanan,
  })[tab];

  return (
    <AdminShell
      active="settings"
      breadcrumb="Sistem · Pengaturan"
      title="Pengaturan Klinik"
      headerActions={null}
    >
      <div style={{ padding: '18px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="caption">Perubahan disimpan otomatis · terakhir <strong style={{ color: 'var(--teal-800)' }}>2 menit lalu</strong></span>
        <div className="row gap-2">
          <button className="btn btn-ghost btn-sm">Batal</button>
          <button className="btn btn-primary btn-sm"><Icon name="check" size={14} stroke="#fff" /> Simpan perubahan</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 22, padding: '16px 28px 28px', flex: 1, minHeight: 0 }}>
        <nav className="col gap-1" style={{ alignSelf: 'start', position: 'sticky', top: 0 }}>
          <div className="eyebrow" style={{ padding: '4px 10px' }}>Bagian</div>
          {SETTINGS_TABS.map(([k, label, hint, opts]) => {
            const disabled = opts && opts.disabled;
            const reason = opts && opts.reason;
            return (
              <div
                key={k}
                onClick={() => { if (!disabled) setTab(k); }}
                className={'nav-item ' + (tab === k && !disabled ? 'active' : '')}
                style={{
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  alignItems: 'flex-start', padding: '10px 12px',
                  opacity: disabled ? 0.55 : 1,
                  position: 'relative',
                }}
                title={disabled ? reason : ''}
              >
                <div className="col" style={{ gap: 2 }}>
                  <div className="row gap-2" style={{ alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: disabled ? 'var(--fg-muted)' : 'inherit' }}>{label}</span>
                    {disabled && (
                      <span className="badge" style={{
                        height: 16, fontSize: 9, padding: '0 6px',
                        background: 'var(--cream-200)', color: 'var(--fg-muted)',
                        textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600,
                      }}>add-on</span>
                    )}
                  </div>
                  <span className="caption" style={{ fontSize: 11.5 }}>
                    {disabled && reason ? reason : hint}
                  </span>
                </div>
              </div>
            );
          })}
        </nav>

        <div style={{ overflowY: 'auto' }}>
          <Body />
        </div>
      </div>
    </AdminShell>
  );
}

window.AdminPengaturan = AdminPengaturan;
