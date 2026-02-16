'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const TOKEN_COOKIE = 'sf_token';
const LOGIN_TIMEOUT_MS = 10000;

function hasAuthCookie() {
  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .some((part) => part.startsWith(`${TOKEN_COOKIE}=`));
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('adm.medan@fr-labs.my.id');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasAuthCookie()) {
      router.replace('/app');
    }
  }, [router]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    let timeout: ReturnType<typeof setTimeout> | undefined;

    try {
      const controller = new AbortController();
      timeout = setTimeout(() => controller.abort(), LOGIN_TIMEOUT_MS);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.data?.token) {
        setError(payload?.message || 'Login gagal. Cek email/password.');
        return;
      }

      document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(payload.data.token)}; Path=/; Max-Age=604800; SameSite=Lax`;
      window.location.assign('/app');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setError('Request login timeout. Pastikan API berjalan di port 3103.');
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
    <main className="min-h-screen w-full bg-muted/20 px-4 py-10">
      <div className="mx-auto mt-10 w-full max-w-md rounded-xl border bg-background p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-1 text-sm text-muted-foreground">Masuk untuk lanjut ke dashboard.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-primary/20 focus:ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-primary/20 focus:ring"
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  );
}
