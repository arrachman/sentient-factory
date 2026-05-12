'use client';

import { X } from 'lucide-react';

/**
 * Brand mark di header sidebar — kotak A sage + "Althea" Lora + "PSYCHOLOGY".
 * Tombol close (X) cuma muncul di mobile menu.
 */
export function SidebarBrand({
  onCloseMobile,
}: {
  onCloseMobile: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 border-b border-border"
      style={{ minHeight: 64 }}
    >
      <div className="flex items-center gap-3">
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'var(--sage-500)',
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          A
        </div>
        <div className="flex flex-col leading-tight">
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 18,
              fontWeight: 600,
              color: 'var(--teal-800)',
            }}
          >
            Althea
          </span>
          <span
            className="caption"
            style={{
              fontSize: 9.5,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginTop: 1,
            }}
          >
            Psychology
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onCloseMobile}
        className="lg:hidden btn btn-ghost btn-icon"
        aria-label="Tutup menu"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
