'use client';

interface ComingSoonProps {
  route: string;
}

/** Fallback page for routes not yet ported into this scaffold. */
export function ComingSoon({ route }: ComingSoonProps) {
  return (
    <div className="page scrollbar" style={{ overflow: 'auto', padding: 32 }}>
      <div style={{ color: 'var(--fg-muted)', fontSize: 13 }}>
        Halaman <strong>{route}</strong> belum tersedia di scaffold ini.
      </div>
    </div>
  );
}
