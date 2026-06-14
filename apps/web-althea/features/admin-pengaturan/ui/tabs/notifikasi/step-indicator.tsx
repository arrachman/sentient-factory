'use client';

import { Check } from 'lucide-react';

type Step = 'form' | 'scan' | 'done';

export function StepIndicator({ current }: { current: Step }) {
  const items: Array<{ key: Step; label: string }> = [
    { key: 'form', label: '1. Detail' },
    { key: 'scan', label: '2. Scan QR' },
    { key: 'done', label: '3. Aktifkan' },
  ];
  const currentIdx = items.findIndex((i) => i.key === current);
  return (
    <div className="flex items-center gap-2" style={{ marginBottom: 18 }}>
      {items.map((it, idx) => {
        const isPast = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        return (
          <div key={it.key} className="flex items-center gap-2">
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isCurrent
                  ? 'var(--sage-500)'
                  : isPast
                    ? 'var(--success, #4f8c5b)'
                    : 'var(--cream-100, #f3f0e8)',
                color: isCurrent || isPast ? '#fff' : 'var(--teal-500)',
              }}
            >
              {isPast ? <Check size={12} /> : idx + 1}
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: isCurrent ? 700 : 500,
                color: isCurrent ? 'var(--teal-800)' : 'var(--teal-500)',
              }}
            >
              {it.label}
            </span>
            {idx < items.length - 1 && (
              <span
                style={{
                  width: 18,
                  height: 1,
                  background: 'var(--sage-200)',
                  marginLeft: 2,
                  marginRight: 2,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
