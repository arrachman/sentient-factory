'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react';

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
  const [email, setEmail] = useState('super_admin@fr-labs.my.id');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="mx-auto mt-8 flex w-full max-w-md flex-col items-center">
        <img
          src="/media/app/default-logo.svg"
          alt="Sentient Factory"
          className="mb-6 h-25 w-auto"
        />

        <div className="flex flex-col items-stretch text-card-foreground rounded-xl bg-card border border-border black/5 w-full shadow-lg">
          <div
            data-slot="card-header"
            className="flex items-center justify-between flex-wrap px-5 min-h-14 gap-2.5 border-b border-border space-y-1"
          >
            <h3
              data-slot="card-title"
              className="tracking-tight text-2xl font-bold text-center"
            >
              Welcome Back
            </h3>
            <div
              data-slot="card-description"
              className="text-sm text-muted-foreground text-center"
            >
              Sign in to access Sentient Factory
            </div>
          </div>
          <div className="w-full p-6">

            <form className="mt-2 space-y-4" onSubmit={onSubmit}>
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-md border bg-background py-2 pl-10 pr-3 text-sm outline-none ring-primary/20 focus:ring"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-md border bg-background py-2 pl-10 pr-10 text-sm outline-none ring-primary/20 focus:ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {loading ? 'Loading...' : 'Sign In'}
                {!loading ? <LogIn className="size-4" /> : null}
              </button>
            </form>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Sentient Factory. All rights reserved.
        </p>
      </div>
    </main>
  );
}
