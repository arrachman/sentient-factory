'use client';

// Minimal global error boundary. Replaces Next's default `/_global-error`
// (which pulls context-heavy internals that fail during this build's static
// prerender). Must render its own <html>/<body>.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
        }}
      >
        <div style={{ textAlign: 'center', padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>Terjadi kesalahan</h2>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>
            {error?.message ?? 'Kesalahan tak terduga pada Senti HR.'}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 16,
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: '#0d9488',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Coba lagi
          </button>
        </div>
      </body>
    </html>
  );
}
