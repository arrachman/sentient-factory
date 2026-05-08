'use client';

import { useState } from 'react';
import { useLogin } from '../hooks/use-login';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMut = useLogin();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    loginMut.mutate({ email: email.trim(), password });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="email" className="caption mb-1 block">
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
          placeholder="admin@althea.local"
        />
      </div>
      <div>
        <label htmlFor="password" className="caption mb-1 block">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-althea"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={loginMut.isPending}
        className="btn btn-primary w-full"
      >
        {loginMut.isPending ? 'Memproses...' : 'Masuk'}
      </button>
      <p className="caption text-center text-fg-muted">
        Hubungi admin kalau lupa password.
      </p>
    </form>
  );
}
