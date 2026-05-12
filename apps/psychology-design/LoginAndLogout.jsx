// Desktop Login + Logout confirmation modal — universal untuk semua role
// (admin, owner, psikolog, resepsionis, marketing). Login satu pintu — sistem
// otomatis route ke dashboard yang sesuai berdasarkan role user yang login.

// ────────────────────────────────────────────────────────────
// DesktopLogin — split layout: brand panel (kiri) + form (kanan).
// Konsisten dengan MobileLogin (font Lora untuk display, Nunito untuk body).
// ────────────────────────────────────────────────────────────
function DesktopLogin() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [remember, setRemember] = React.useState(true);

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 720, background: 'var(--bg-elev)' }}>
      {/* LEFT — brand panel dengan gradient sage/teal */}
      <aside style={{
        flex: '0 0 44%', minWidth: 0,
        background: 'linear-gradient(155deg, var(--sage-700) 0%, var(--teal-800) 100%)',
        color: '#fff',
        padding: '56px 56px 40px',
        display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative organic blobs */}
        <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', top: -80, right: -120 }} />
        <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: -60, left: -40 }} />

        {/* Brand mark */}
        <div className="row gap-3" style={{ alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 26, border: '1px solid rgba(255,255,255,0.25)' }}>A</div>
          <div className="col">
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.01em' }}>Althea</span>
            <span style={{ fontSize: 11, opacity: 0.7, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, marginTop: 4 }}>Psychology</span>
          </div>
        </div>

        {/* Mid copy */}
        <div style={{ marginTop: 'auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: 34, fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.02em', maxWidth: 380 }}>
            Ruang aman untuk tumbuh, sembuh, dan berdaya.
          </h2>
          <p style={{ marginTop: 18, fontSize: 14, lineHeight: 1.6, opacity: 0.82, maxWidth: 360 }}>
            Sistem penjadwalan internal Althea Psychology — masuk dengan akun staf untuk mengakses dashboard sesuai role Anda.
          </p>
        </div>

        {/* Footer */}
        <div className="row gap-2" style={{ marginTop: 36, position: 'relative', zIndex: 1, opacity: 0.6, fontSize: 11, letterSpacing: '0.04em' }}>
          <span>© 2026 Althea Psychology</span>
          <span>·</span>
          <span>Malang, Jawa Timur</span>
        </div>
      </aside>

      {/* RIGHT — form panel */}
      <main style={{ flex: 1, minWidth: 0, padding: '48px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 560 }}>
        <div className="col">
          <span className="eyebrow" style={{ marginBottom: 6 }}>Masuk ke akun</span>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: 30, fontWeight: 500, color: 'var(--teal-800)', letterSpacing: '-0.01em' }}>
            Selamat datang kembali
          </h1>
          <p className="caption" style={{ marginTop: 8, fontSize: 13, lineHeight: 1.5, color: 'var(--fg-muted)' }}>
            Masukkan email & kata sandi yang sudah didaftarkan admin.
          </p>
        </div>

        <div className="col gap-4" style={{ marginTop: 28 }}>
          <div className="col gap-1">
            <label className="caption" style={{ fontWeight: 600, color: 'var(--teal-800)' }}>Email</label>
            <input className="input" defaultValue="vina@altheapsychology.id" style={{ height: 44, fontSize: 14 }} />
          </div>

          <div className="col gap-1">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <label className="caption" style={{ fontWeight: 600, color: 'var(--teal-800)' }}>Kata sandi</label>
              <a style={{ fontSize: 12, color: 'var(--sage-700)', cursor: 'pointer', fontWeight: 500 }}>Lupa kata sandi?</a>
            </div>
            <div className="row" style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input"
                defaultValue="••••••••••••"
                style={{ height: 44, fontSize: 14, paddingRight: 46, width: '100%' }}
              />
              <button
                onClick={() => setShowPassword(s => !s)}
                style={{ position: 'absolute', right: 8, top: 8, width: 28, height: 28, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--fg-muted)' }}
                title={showPassword ? 'Sembunyikan' : 'Lihat'}
              >
                <Icon name="eye" size={15} />
              </button>
            </div>
          </div>

          <label className="row gap-2" style={{ alignItems: 'center', cursor: 'pointer', marginTop: 2 }}>
            <span style={{ width: 18, height: 18, borderRadius: 5, border: '1.5px solid ' + (remember ? 'var(--sage-500)' : 'var(--border-strong)'), background: remember ? 'var(--sage-500)' : 'transparent', display: 'grid', placeItems: 'center' }}
              onClick={() => setRemember(r => !r)}>
              {remember && <Icon name="check" size={11} stroke="#fff" sw={2.5} />}
            </span>
            <span style={{ fontSize: 13, color: 'var(--fg)' }}>Tetap masuk di perangkat ini</span>
          </label>

          <button className="btn btn-primary" style={{ height: 46, fontSize: 14.5, fontWeight: 600, marginTop: 6 }}>
            Masuk
          </button>

          {/* Banner: hubungi admin */}
          <div className="row gap-2" style={{ padding: 12, background: 'var(--cream-50)', borderRadius: 8, alignItems: 'flex-start', marginTop: 4 }}>
            <Icon name="bell" size={14} stroke="var(--fg-muted)" />
            <span className="caption" style={{ fontSize: 11.5, lineHeight: 1.5, color: 'var(--fg-muted)' }}>
              Belum punya akun? Hubungi admin klinik. Akun login dibuat oleh admin — sistem akan kirim invite via WhatsApp.
            </span>
          </div>
        </div>

        <div className="row gap-2" style={{ marginTop: 'auto', paddingTop: 36, justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="caption" style={{ fontSize: 11 }}>Versi 1.0 · Paket Standard</span>
          <a className="caption" style={{ fontSize: 11.5, color: 'var(--sage-700)', cursor: 'pointer' }}>Bantuan teknis →</a>
        </div>
      </main>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// DialogLogout — konfirmasi sebelum mengakhiri sesi.
// Reuse DialogFrame dari AdminDialogs1.jsx. Dipasang di artboard
// dengan background DesktopAdmin samar-samar di belakang.
// ────────────────────────────────────────────────────────────
function DialogLogout() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--cream-100)' }}>
      {/* Mock app behind (samar) */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none' }}>
        <DesktopAdmin />
      </div>

      <DialogFrame
        eyebrow="Konfirmasi"
        title="Keluar dari akun?"
        width={460}
        footer={<>
          <button className="btn btn-ghost">Batal</button>
          <button className="btn" style={{ background: 'var(--danger)', color: '#fff' }}>
            <Icon name="logout" size={14} stroke="#fff" sw={2.2} /> Keluar
          </button>
        </>}>
        {/* Identitas user yang akan logout */}
        <div className="row gap-3" style={{ padding: 14, background: 'var(--cream-50)', borderRadius: 10, marginBottom: 18, alignItems: 'center' }}>
          <Avatar name="Sinta" color="#5b8a66" size="lg" />
          <div className="col grow">
            <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--teal-800)' }}>Sinta Pradina</span>
            <span className="caption" style={{ fontSize: 12, marginTop: 2 }}>Admin Klinik · sinta@altheapsychology.id</span>
            <span className="caption" style={{ fontSize: 11, marginTop: 4, color: 'var(--sage-700)' }}>● Login dari Chrome · Senin, 09 Mei 2026 · 08:14</span>
          </div>
        </div>

        {/* Body — penjelasan singkat */}
        <p className="body-sm" style={{ margin: '0 0 14px', fontSize: 13.5, lineHeight: 1.55, color: 'var(--fg)' }}>
          Sesi Anda akan diakhiri. Anda perlu masuk ulang dengan email & kata sandi untuk mengakses aplikasi Althea Psychology.
        </p>

        {/* Catatan keamanan kalau ada perubahan belum disimpan */}
        <div className="row gap-2" style={{ padding: 12, background: 'var(--info-soft)', border: '1px solid #cfdde8', borderRadius: 8, alignItems: 'flex-start' }}>
          <Icon name="bell" size={14} stroke="var(--info)" />
          <div className="col">
            <span className="caption" style={{ fontWeight: 600, color: '#2c4a60', fontSize: 12 }}>Tidak ada perubahan yang belum disimpan</span>
            <span className="caption" style={{ fontSize: 11.5, color: '#2c4a60', marginTop: 2, lineHeight: 1.5 }}>
              Semua catatan & jadwal sudah tersimpan otomatis. Aman untuk keluar.
            </span>
          </div>
        </div>
      </DialogFrame>
    </div>
  );
}

Object.assign(window, { DesktopLogin, DialogLogout });
