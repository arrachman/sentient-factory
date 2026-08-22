'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: form.get('email'), password: form.get('password') }) });
    const result = await response.json();
    setIsLoading(false);
    if (!response.ok) return setError(result.error?.message ?? 'Tidak dapat masuk.');
    router.replace('/');
    router.refresh();
  }

  return (
    <main className="login-wrap">
      <section className="login-card">
        <p className="muted">SIMTERPADU · Nurul Huda Mergosono</p>
        <h1 style={{ color: 'var(--hijau-tua)', marginBottom: 8 }}>Masuk ke Sistem</h1>
        <p className="muted" style={{ marginBottom: 24 }}>Gunakan akun yang sudah terdaftar.</p>
        {error && <div className="error" role="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required defaultValue="ketua@nuha.pesantren.web.id" /></div>
          <div className="field"><label htmlFor="password">Kata sandi</label><input id="password" name="password" type="password" autoComplete="current-password" required defaultValue="Nuha2026!" /></div>
          <button className="btn" style={{ width: '100%' }} disabled={isLoading}>{isLoading ? 'Memeriksa…' : 'Masuk'}</button>
        </form>
        <p className="muted" style={{ marginTop: 18 }}>Akun demo: ketua@nuha.pesantren.web.id · Nuha2026!</p>
      </section>
    </main>
  );
}
