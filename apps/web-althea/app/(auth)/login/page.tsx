import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth/ui/login-form';

export const metadata: Metadata = { title: 'Masuk — Althea Psychology' };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-elev)' }}>
      {/* LEFT — brand panel (desktop only) */}
      <aside
        className="hidden lg:flex lg:flex-col lg:basis-[44%] lg:shrink-0"
        style={{
          minWidth: 0,
          background: 'linear-gradient(155deg, var(--sage-700) 0%, var(--teal-800) 100%)',
          color: '#fff',
          padding: '56px 56px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: 'absolute',
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
            top: -80,
            right: -120,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            bottom: -60,
            left: -40,
          }}
        />

        {/* Brand mark */}
        <div className="flex items-center gap-3" style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              fontFamily: 'var(--font-serif)',
              fontWeight: 600,
              fontSize: 26,
              border: '1px solid rgba(255,255,255,0.25)',
              flexShrink: 0,
            }}
          >
            A
          </div>
          <div className="flex flex-col">
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 24,
                fontWeight: 500,
                lineHeight: 1,
                letterSpacing: '-0.01em',
              }}
            >
              Althea
            </span>
            <span
              style={{
                fontSize: 11,
                opacity: 0.7,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 500,
                marginTop: 4,
              }}
            >
              Psychology
            </span>
          </div>
        </div>

        {/* Mid copy */}
        <div style={{ marginTop: 'auto', position: 'relative', zIndex: 1 }}>
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-serif)',
              fontSize: 34,
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              maxWidth: 380,
              color: '#fff',
            }}
          >
            Ruang aman untuk tumbuh, sembuh, dan berdaya.
          </h2>
          <p
            style={{
              marginTop: 18,
              fontSize: 14,
              lineHeight: 1.6,
              opacity: 0.82,
              maxWidth: 360,
              color: '#fff',
            }}
          >
            Sistem penjadwalan internal Althea Psychology — masuk dengan akun staf untuk mengakses
            dashboard sesuai role Anda.
          </p>
        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-2"
          style={{
            marginTop: 36,
            position: 'relative',
            zIndex: 1,
            opacity: 0.6,
            fontSize: 11,
            letterSpacing: '0.04em',
          }}
        >
          <span>© 2026 Althea Psychology</span>
          <span>·</span>
          <span>Malang, Jawa Timur</span>
        </div>
      </aside>

      {/* RIGHT — form panel */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 32px',
          background: 'var(--cream-50)',
        }}
      >
        {/* Mobile wordmark (prototype 06) */}
        <div className="mb-8 flex w-full max-w-[480px] items-center gap-2.5 lg:hidden">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl text-xl font-semibold text-white"
            style={{ background: 'var(--sage-600, #4a7355)', fontFamily: 'var(--font-serif)' }}
          >
            A
          </span>
          <span className="flex flex-col leading-none">
            <span
              className="text-xl"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--teal-800)' }}
            >
              Althea
            </span>
            <span
              className="mt-1 text-[10px] font-medium uppercase"
              style={{ letterSpacing: '0.12em', color: 'var(--fg-muted)' }}
            >
              Psychology
            </span>
          </span>
        </div>

        {/* Card box */}
        <div
          style={{
            width: '100%',
            maxWidth: 480,
            background: '#fff',
            borderRadius: 16,
            border: '1px solid var(--border)',
            padding: '40px 40px 32px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex flex-col" style={{ marginBottom: 28 }}>
            <span
              className="caption"
              style={{
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--fg-muted)',
              }}
            >
              Masuk ke akun
            </span>
            <h1
              style={{
                margin: 0,
                fontFamily: 'var(--font-serif)',
                fontSize: 28,
                fontWeight: 500,
                color: 'var(--teal-800)',
                letterSpacing: '-0.01em',
              }}
            >
              Selamat datang kembali
            </h1>
            <p
              className="caption"
              style={{ marginTop: 8, fontSize: 13, lineHeight: 1.5, color: 'var(--fg-muted)' }}
            >
              Masukkan email & kata sandi yang sudah didaftarkan admin.
            </p>
          </div>

          <LoginForm />
        </div>

        {/* Footer bawah card */}
        <div
          className="flex items-center justify-between"
          style={{ width: '100%', maxWidth: 480, marginTop: 20, padding: '0 4px' }}
        >
          <span className="caption" style={{ fontSize: 11, color: 'var(--fg-muted)' }}>
            Versi 1.0 · Paket Standard
          </span>
          <span className="caption" style={{ fontSize: 11.5, color: 'var(--sage-700)' }}>
            Bantuan teknis →
          </span>
        </div>
      </main>
    </div>
  );
}
