import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Daftar' };

export default function RegisterPage() {
  return (
    <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
      <h1 className="brand-mark mb-2 text-3xl">Daftar Akun</h1>
      <p className="caption mb-6">
        Buat akun untuk booking sesi pertama kamu.
      </p>
      {/* TODO: implement features/auth/ui/register-form */}
      <div className="text-sm text-muted-foreground">
        Form register akan diimplementasi di <code>features/auth/ui/</code>.
      </div>
    </div>
  );
}
