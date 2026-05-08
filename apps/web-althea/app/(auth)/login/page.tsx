import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Masuk' };

export default function LoginPage() {
  return (
    <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
      <h1 className="brand-mark mb-2 text-3xl">Althea</h1>
      <p className="caption mb-6">
        Masuk untuk lanjutkan booking atau lihat sesi kamu.
      </p>
      {/* TODO: implement features/auth/ui/login-form */}
      <div className="text-sm text-muted-foreground">
        Form login akan diimplementasi di <code>features/auth/ui/</code>.
      </div>
    </div>
  );
}
