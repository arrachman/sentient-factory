'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import type { NotifyType, ToastDetail } from '@/lib/feedback';

interface ToastItem extends ToastDetail {
  id: number;
}

const TONE: Record<NotifyType, { fg: string; soft: string; Icon: typeof Info }> = {
  success: { fg: 'var(--success)', soft: 'var(--success-soft)', Icon: CheckCircle2 },
  danger: { fg: 'var(--danger)', soft: 'var(--danger-soft)', Icon: XCircle },
  warn: { fg: 'var(--warn)', soft: 'var(--warn-soft)', Icon: AlertTriangle },
  info: { fg: 'var(--info)', soft: 'var(--info-soft)', Icon: Info },
};

const TOAST_TTL_MS = 3200;

/**
 * Transient toast host — listens for `mdp-toast` CustomEvents (from
 * `lib/feedback.notify`). Mount once in the app shell.
 */
export function ToastHost() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    let seq = 0;
    function onToast(e: Event) {
      const detail = (e as CustomEvent<ToastDetail>).detail;
      const id = ++seq;
      setToasts((prev) => [...prev, { ...detail, id }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, TOAST_TTL_MS);
    }
    window.addEventListener('mdp-toast', onToast);
    return () => window.removeEventListener('mdp-toast', onToast);
  }, []);

  if (!toasts.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxWidth: 360,
      }}
    >
      {toasts.map((t) => {
        const tone = TONE[t.type];
        return (
          <div
            key={t.id}
            role="status"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              padding: '10px 12px',
              background: 'var(--panel)',
              border: '1px solid var(--border)',
              borderLeft: `3px solid ${tone.fg}`,
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-flyout)',
              fontSize: 'calc(12.5px * var(--font-scale, 1))',
              color: 'var(--fg)',
            }}
          >
            <span style={{ color: tone.fg, display: 'inline-flex', marginTop: 1 }}>
              <tone.Icon size={15} />
            </span>
            <span style={{ flex: 1, lineHeight: 1.35 }}>{t.message}</span>
            <button
              type="button"
              aria-label="Tutup"
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              style={{
                border: 0,
                background: 'transparent',
                color: 'var(--fg-subtle)',
                cursor: 'pointer',
                display: 'inline-flex',
                padding: 0,
              }}
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
