'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { RefreshCcw } from 'lucide-react';

/**
 * Global error boundary untuk app router. Catch error di root layout / page.
 * See: https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
     
    console.error('App error:', error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-cream-50 px-4">
      <div className="card-althea max-w-md p-8 text-center bg-card">
        <h1 className="h2 mb-2 text-danger">Terjadi kesalahan</h1>
        <p className="caption mb-4">
          Maaf, ada error yang tidak terduga. Tim sudah notified — coba reload atau kembali nanti.
        </p>
        {error.digest && (
          <p className="caption mb-4 font-mono text-xs">
            Error ID: <code>{error.digest}</code>
          </p>
        )}
        {process.env.NODE_ENV === 'development' && (
          <pre className="text-xs text-left bg-cream-100 p-2 rounded mb-4 overflow-auto max-h-32 whitespace-pre-wrap">
            {error.message}
          </pre>
        )}
        <div className="flex justify-center gap-2">
          <button type="button" onClick={() => reset()} className="btn btn-primary btn-sm">
            <RefreshCcw className="h-4 w-4" /> Coba lagi
          </button>
          <Link href="/" className="btn btn-outline btn-sm">
            Ke Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
