'use client';

// Standalone login for web-hr, styled after the web-erp split-screen login.
// web-hr reuses the platform session cookie `sf_token` (see lib/api/auth.ts) but
// owns no auth backend — on a fresh origin every /api/hr/* call returns 401.
// This page authenticates by EMAIL against the shared gateway (POST /auth/login,
// same-origin rewrite), stores the returned JWT as the `sf_token` cookie that
// JwtAuthGuard reads, then returns to the requested page.
//
// NOTE: HR uses the email-based /auth/login (which yields a `sf_token`-compatible
// JWT), NOT /erp/auth/login (that sets the separate HttpOnly `erp_token` which
// the HR guard does not read).

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpRight, Clock4, Eye, EyeOff, Info, Loader2, Lock, Mail } from 'lucide-react';

const TOKEN_COOKIE = 'sf_token';
const LOGIN_TIMEOUT_MS = 10000;
const REMEMBER_MAX_AGE_S = 604800; // 7 days when "Ingat saya" is checked.
const FOCUS_DELAY_MS = 80;

// Demo account — a seeded DEV credential (prisma.user, password printed by
// prisma/seed.ts), not a production secret. Mirrors web-erp's demo affordance.
// `admin@example.com` is privileged so review/admin screens render too.
const DEMO = { email: 'admin@example.com', password: 'Password123!' } as const;

// Email prefilled for convenience (LAN/dev). Password stays blank until the user
// types it or clicks "isi otomatis".
const DEFAULT_EMAIL = DEMO.email;

function hasAuthCookie() {
  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .some((part) => part.startsWith(`${TOKEN_COOKIE}=`));
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const safeReturnTo = returnTo?.startsWith('/') ? returnTo : '/app/dashboard';

  const [email, setEmail] = useState<string>(DEFAULT_EMAIL);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hasAuthCookie()) {
      router.replace(safeReturnTo);
      return;
    }
    const t = setTimeout(() => emailRef.current?.focus(), FOCUS_DELAY_MS);
    return () => clearTimeout(t);
  }, [router, safeReturnTo]);

  const fillDemo = () => {
    setEmail(DEMO.email);
    setPassword(DEMO.password);
    setError('');
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Email dan password wajib diisi.');
      return;
    }
    setError('');
    setLoading(true);
    let timeout: ReturnType<typeof setTimeout> | undefined;

    try {
      const controller = new AbortController();
      timeout = setTimeout(() => controller.abort(), LOGIN_TIMEOUT_MS);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
        signal: controller.signal,
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.data?.token) {
        setError(payload?.message || 'Login gagal. Cek email/password.');
        return;
      }

      const maxAge = remember ? `; Max-Age=${REMEMBER_MAX_AGE_S}` : '';
      document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(
        payload.data.token,
      )}; Path=/${maxAge}; SameSite=Lax`;
      window.location.assign(safeReturnTo);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('Request login timeout. Pastikan api-gateway berjalan.');
      } else {
        setError('Tidak bisa terhubung ke server API.');
      }
    } finally {
      if (timeout) {
        clearTimeout(timeout);
      }
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
      <BrandPanel />
      <div className="flex items-center justify-center bg-background px-6 py-10">
        <form onSubmit={onSubmit} className="w-full max-w-sm">
          <h2 className="text-xl font-semibold text-foreground">Masuk ke akun Anda</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gunakan kredensial platform Sentient untuk melanjutkan.
          </p>

          {error ? (
            <div className="mt-4 flex items-center gap-2 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-xs font-medium text-danger">
              <Info className="h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          <Field label="Email" className="mt-5">
            <FieldIcon>
              <Mail className="h-4 w-4" />
            </FieldIcon>
            <input
              ref={emailRef}
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@perusahaan.com"
              className={inputClass}
              required
            />
          </Field>

          <Field label="Password" className="mt-4">
            <FieldIcon>
              <Lock className="h-4 w-4" />
            </FieldIcon>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`${inputClass} pr-9`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </Field>

          <div className="mt-4 flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-foreground/80">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-border accent-[var(--primary)]"
              />
              Ingat saya
            </label>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setError('Hubungi administrator untuk reset password.');
              }}
              className="text-xs font-medium text-primary hover:underline"
            >
              Lupa password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-5 flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Memproses…
              </>
            ) : (
              <>
                Masuk <ArrowUpRight className="h-4 w-4" />
              </>
            )}
          </button>

          <div className="mt-4 flex items-center gap-2 overflow-x-auto whitespace-nowrap rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
            <strong className="font-semibold text-foreground">Mode demo</strong>
            <span aria-hidden>·</span>
            <code className="rounded bg-muted px-1 py-0.5">{DEMO.email}</code>
            <code className="rounded bg-muted px-1 py-0.5">{DEMO.password}</code>
            <button
              type="button"
              onClick={fillDemo}
              className="ml-auto shrink-0 pl-1 font-medium text-primary hover:underline"
            >
              isi otomatis
            </button>
          </div>

          <p className="mt-6 text-center text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} Sentient Manufaktur Indonesia · Senti HR
          </p>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  'h-10 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-ring/30';

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium text-foreground/80">{label}</label>
      <div className="relative">{children}</div>
    </div>
  );
}

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute inset-y-0 left-0 flex items-center px-2.5 text-muted-foreground">
      {children}
    </span>
  );
}

function BrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
      {/* subtle grid texture, mirrors the ERP login hero */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative flex items-center gap-2 text-lg font-semibold">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/15">
          <Clock4 className="h-4 w-4" />
        </span>
        <span>
          Senti <span className="font-normal opacity-70">/ HR</span>
        </span>
      </div>

      <div className="relative max-w-md">
        <h1 className="text-3xl font-semibold leading-tight">
          Kehadiran tim,
          <br />
          terverifikasi real-time.
        </h1>
        <p className="mt-3 text-sm leading-relaxed opacity-80">
          Absensi, pengenalan wajah, geofence GPS, timesheet, dan manajemen tenaga
          kerja dalam satu platform yang cepat dan tepat.
        </p>
      </div>

      <div className="relative flex gap-10">
        <Stat value="10" label="Modul aktif" />
        <Stat value="24/7" label="Absensi real-time" />
        <Stat value="GPS" label="Geofence + Wajah" />
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs opacity-70">{label}</div>
    </div>
  );
}
