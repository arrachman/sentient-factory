'use client';

/**
 * Login screen — ported from prototype `pages/login.jsx`. Demo-only auth:
 * any non-empty credentials succeed; the `DEMO` account can be pre-filled.
 * Emits a `ShellUser` upward via `onLogin`; the parent shell owns session.
 */
import * as React from 'react';
import { Icon } from '@/components/ui/icons';
import { notify } from '@/lib/feedback';
import type { ShellUser } from '@/components/organisms/topbar';

export interface LoginPageProps {
  onLogin: (user: ShellUser) => void;
}

const DEMO = {
  user: 'adi.s',
  pass: 'sentient',
  name: 'Adi Saputra',
  email: 'adi.s@sentient.id',
  role: 'Administrator',
  initials: 'AS',
} as const;

const DEFAULT_ROLE = 'Akuntansi';
const LOGIN_DELAY_MS = 520;
const FOCUS_DELAY_MS = 80;

function slugifyEmail(raw: string): string {
  return raw.replace(/[^a-z0-9.]/gi, '.');
}

function makeInitials(label: string): string {
  return label
    .split(/[ .]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [user, setUser] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [err, setErr] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const userRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const t = setTimeout(() => userRef.current?.focus(), FOCUS_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const submit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!user.trim() || !pass.trim()) {
      setErr('Username dan password wajib diisi.');
      return;
    }
    setErr('');
    setBusy(true);
    // Simulate network latency so the busy state is visible — replaced by a
    // real auth call once api-gateway hook lands.
    setTimeout(() => {
      const trimmed = user.trim();
      const known = trimmed === DEMO.user;
      const name = known ? DEMO.name : trimmed;
      const role = known ? DEMO.role : DEFAULT_ROLE;
      const shellUser: ShellUser = {
        user: trimmed,
        name,
        email: known ? DEMO.email : `${slugifyEmail(trimmed)}@sentient.id`,
        initials: known ? DEMO.initials : makeInitials(name),
      };
      setBusy(false);
      onLogin(shellUser);
      notify(`Selamat datang, ${name} — masuk sebagai ${role}`, 'success');
    }, LOGIN_DELAY_MS);
  };

  const fillDemo = () => {
    setUser(DEMO.user);
    setPass(DEMO.pass);
    setErr('');
  };

  const onForgot = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    notify('Hubungi administrator untuk reset password.', 'info');
  };

  return (
    <div className="login-wrap">
      <div className="login-brand">
        <div className="login-logo">
          <span className="mk">
            <Icon name="factory" size={15} />
          </span>
          <span>
            Sentient{' '}
            <span style={{ fontWeight: 400, opacity: 0.7 }}>/ ERP</span>
          </span>
        </div>
        <div className="login-hero">
          <h1>
            Platform manufaktur
            <br />
            yang terintegrasi.
          </h1>
          <p>
            Kelola keuangan, persediaan, pembelian, sales, dan produksi dalam
            satu sistem yang cepat dan presisi.
          </p>
        </div>
        <div className="login-stats">
          <div className="st">
            <div className="v">12</div>
            <div className="l">Modul aktif</div>
          </div>
          <div className="st">
            <div className="v">4</div>
            <div className="l">Cabang</div>
          </div>
          <div className="st">
            <div className="v">99,9%</div>
            <div className="l">Uptime</div>
          </div>
        </div>
      </div>

      <div className="login-pane">
        <form className="login-card" onSubmit={submit}>
          <h2>Masuk ke akun Anda</h2>
          <div className="sub">
            Gunakan kredensial perusahaan untuk melanjutkan.
          </div>

          {err && (
            <div className="login-err">
              <Icon name="info" size={13} />
              <span>{err}</span>
            </div>
          )}

          <div className="login-field">
            <label>Username</label>
            <div className="login-input">
              <span className="ic">
                <Icon name="user" size={14} />
              </span>
              <input
                ref={userRef}
                value={user}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUser(e.target.value)
                }
                placeholder="cth: adi.s"
                autoComplete="username"
              />
            </div>
          </div>

          <div className="login-field">
            <label>Password</label>
            <div className="login-input">
              <span className="ic">
                <Icon name="gear" size={14} />
              </span>
              <input
                type={show ? 'text' : 'password'}
                value={pass}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPass(e.target.value)
                }
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <span
                className="eye"
                onClick={() => setShow((s) => !s)}
                title={show ? 'Sembunyikan' : 'Tampilkan'}
              >
                <Icon name="eye" size={14} />
              </span>
            </div>
          </div>

          <div className="login-row">
            <label>
              <input
                type="checkbox"
                className="checkbox"
                checked={remember}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRemember(e.target.checked)
                }
              />
              Ingat saya
            </label>
            <a href="#" onClick={onForgot}>
              Lupa password?
            </a>
          </div>

          <button type="submit" className="login-btn" disabled={busy}>
            {busy ? (
              <>Memproses…</>
            ) : (
              <>
                Masuk <Icon name="arrow-tr" size={14} />
              </>
            )}
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

          <div className="login-foot">
            © 2026 Sentient Manufaktur Indonesia · v0.9 prototype
          </div>
        </form>
      </div>
    </div>
  );
}
