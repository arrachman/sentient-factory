'use client';

import { MessageSquare } from 'lucide-react';

/**
 * Card kontak klien (WA + email) dengan tombol Salin per-baris.
 */
export function ContactCard({ wa, email }: { wa: string; email: string }) {
  return (
    <div
      className="card-althea-flat"
      style={{ padding: 12, marginBottom: 12 }}
    >
      <span
        className="eyebrow"
        style={{ marginBottom: 6, display: 'block' }}
      >
        Kontak
      </span>
      <div className="flex flex-col" style={{ gap: 6, marginTop: 4 }}>
        <ContactRow
          icon={
            <MessageSquare
              size={12}
              style={{ color: 'var(--success, #4f8c5b)' }}
            />
          }
          value={wa}
          mono
        />
        {email ? <ContactRow value={email} /> : null}
      </div>
    </div>
  );
}

function ContactRow({
  icon,
  value,
  mono,
}: {
  icon?: React.ReactNode;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span
        className="flex items-center gap-2"
        style={{ minWidth: 0 }}
      >
        {icon}
        <span
          style={{
            fontSize: 12.5,
            color: 'var(--fg)',
            fontFamily: mono ? 'monospace' : undefined,
          }}
        >
          {value}
        </span>
      </span>
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        style={{ height: 24, padding: '0 8px', fontSize: 11 }}
        onClick={() => navigator.clipboard?.writeText(value)}
      >
        Salin
      </button>
    </div>
  );
}
