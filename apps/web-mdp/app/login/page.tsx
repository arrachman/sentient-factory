'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Factory, Info, Lock, User } from 'lucide-react';

const TOKEN_COOKIE = 'erp_token';
// Demo creds = the seeded ERP account that actually authenticates against
// /api/erp/auth/login (verified 200). NOT admin@example.com/Password123! —
// that seed (prisma/seed.ts) isn't applied to the live DB; the live users come
// from prisma/seed-erp.ts (admin@senti-erp.local / rania / sentient).
const DEMO = { user: 'rania', pass: 'sentient' } as const;
const FOCUS_DELAY_MS = 80;

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
  const safeReturnTo = returnTo?.startsWith('/') ? returnTo : '/app';
  const userRef = useRef<HTMLInputElement>(null);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (hasAuthCookie()) {
      router.replace(safeReturnTo);
      return;
    }
    const t = setTimeout(() => userRef.current?.focus(), FOCUS_DELAY_MS);
    return () => clearTimeout(t);
  }, [router, safeReturnTo]);

  const fillDemo = () => {
    setLogin(DEMO.user);
    setPassword(DEMO.pass);
    setError('');
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!login.trim() || !password.trim()) {
      setError('Username/email dan password wajib diisi.');
      return;
    }
    setBusy(true);
    setError('');

    try {
      const response = await fetch('/api/erp/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        // Backend ErpLoginDto accepts only { login, password } — `remember`
        // is NOT whitelisted (forbidNonWhitelisted → 400). Keep it client-side
        // only (UI parity with web-erp/web-hr), never in the request body.
        body: JSON.stringify({ login: login.trim(), password }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        setError(payload?.message || 'Login gagal. Cek username/email dan password.');
        return;
      }
      window.location.assign(safeReturnTo);
    } catch {
      setError('Tidak bisa terhubung ke server API.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-brand">
        <div className="login-logo">
          <span className="mk"><Factory size={15} /></span>
          <span>Sentient <span style={{ fontWeight: 400, opacity: 0.7 }}>/ MDP</span></span>
        </div>
        <div className="login-hero">
          <h1>Operasi manufaktur<br />yang terkendali.</h1>
          <p>Masuk untuk mengakses MES, WMS, QMS, CMMS, OEE, dan modul MOM lain di layer ISA-95 Level 3.</p>
        </div>
        <div className="login-stats">
          <div className="st"><div className="v">8</div><div className="l">Modul MOM</div></div>
          <div className="st"><div className="v">L3</div><div className="l">ISA-95</div></div>
          <div className="st"><div className="v">OEE</div><div className="l">Overlay live</div></div>
        </div>
      </div>

      <div className="login-pane">
        <form className="login-card" onSubmit={submit}>
          <h2>Masuk ke Senti MDP</h2>
          <div className="sub">Gunakan akun ERP. Sesi yang dibuat adalah cookie `erp_token` yang dibaca backend MDP.</div>

          {error && <div className="login-err"><Info size={13} /><span>{error}</span></div>}

          <div className="login-field">
            <label>Username / Email</label>
            <div className="login-input">
              <span className="ic"><User size={14} /></span>
              <input
                ref={userRef}
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="cth: rania"
                autoComplete="username"
              />
            </div>
          </div>

          <div className="login-field">
            <label>Password</label>
            <div className="login-input">
              <span className="ic"><Lock size={14} /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
              />
              <button type="button" className="eye" onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className="login-row">
            <label><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Ingat saya</label>
          </div>

          <button className="login-btn" type="submit" disabled={busy}>
            {busy ? 'Memproses...' : 'Masuk'}
          </button>

          <div className="login-demo">
            <strong style={{ color: 'var(--fg)' }}>Mode demo</strong> — akun:{' '}
            <code>{DEMO.user}</code> · sandi: <code>{DEMO.pass}</code>{' '}
            <a
              style={{ color: 'var(--primary-soft-fg)', cursor: 'pointer' }}
              onClick={fillDemo}
            >
              isi otomatis
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
