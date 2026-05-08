import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-cream-50 px-4">
      <div className="card-althea max-w-md p-8 text-center bg-card">
        <div className="text-6xl mb-4 brand-mark text-sage-500">404</div>
        <h1 className="h2 mb-2">Halaman tidak ditemukan</h1>
        <p className="caption mb-6">
          URL yang kamu buka tidak ada atau sudah dipindah. Cek lagi atau kembali ke dashboard.
        </p>
        <div className="flex justify-center gap-2">
          <Link href="/" className="btn btn-primary">
            Ke Dashboard
          </Link>
          <Link href="/login" className="btn btn-outline">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
