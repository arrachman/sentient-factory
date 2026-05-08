import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth/ui/login-form';

export const metadata: Metadata = { title: 'Masuk' };

export default function LoginPage() {
  return (
    <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
      <h1 className="brand-mark mb-2 text-3xl">Althea</h1>
      <p className="caption mb-6">Masuk untuk akses sistem klinik.</p>
      <LoginForm />
    </div>
  );
}
