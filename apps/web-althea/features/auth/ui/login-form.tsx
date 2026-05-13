'use client';

import { useState } from 'react';
import { Bell, Eye, EyeOff } from 'lucide-react';
import { useLogin } from '../hooks/use-login';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const loginMut = useLogin();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    loginMut.mutate({ email: email.trim(), password });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="email"
          className="caption"
          style={{ fontWeight: 600, color: 'var(--teal-800)' }}
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-althea"
          placeholder="staf@altheapsychology.id"
          style={{ height: 44, fontSize: 14 }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="password"
          className="caption"
          style={{ fontWeight: 600, color: 'var(--teal-800)' }}
        >
          Kata sandi
        </label>
        <div style={{ position: 'relative' }}>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-althea"
            placeholder="••••••••"
            style={{ height: 44, fontSize: 14, paddingRight: 44, width: '100%' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            style={{
              position: 'absolute',
              right: 8,
              top: 8,
              width: 28,
              height: 28,
              borderRadius: 6,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--fg-muted)',
            }}
            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loginMut.isPending}
        className="btn btn-primary w-full"
        style={{ height: 46, fontSize: 14.5, fontWeight: 600, marginTop: 2 }}
      >
        {loginMut.isPending ? 'Memproses...' : 'Masuk'}
      </button>

      <div
        className="flex items-start gap-2"
        style={{
          padding: 12,
          background: 'var(--cream-50)',
          borderRadius: 8,
          marginTop: 4,
        }}
      >
        <Bell size={14} style={{ color: 'var(--fg-muted)', flexShrink: 0, marginTop: 2 }} />
        <span className="caption" style={{ fontSize: 11.5, lineHeight: 1.5, color: 'var(--fg-muted)' }}>
          Belum punya akun? Hubungi admin klinik. Akun login dibuat oleh admin — sistem akan kirim
          invite via WhatsApp.
        </span>
      </div>
    </form>
  );
}
