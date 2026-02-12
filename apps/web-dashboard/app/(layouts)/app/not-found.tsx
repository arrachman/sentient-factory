import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container py-8">
      <div className="rounded-lg border bg-background p-6">
        <h1 className="text-xl font-semibold text-mono">404 - Page Not Found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Halaman yang kamu tuju tidak ditemukan.
        </p>
        <div className="mt-5">
          <Link
            href="/app"
            className="inline-flex rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
