'use client';

import { Banknote, FileText, History } from 'lucide-react';

export type DialogTab = 'detail' | 'notes' | 'payment' | 'history';

/**
 * Top tabs untuk dialog detail booking.
 */
export function DialogTabs({
  active,
  onChange,
  historyCount,
}: {
  active: DialogTab;
  onChange: (next: DialogTab) => void;
  historyCount: number;
}) {
  const tabs: Array<{
    id: DialogTab;
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'detail',
      label: 'Detail',
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: 'notes',
      label: 'Catatan Klinis',
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: 'payment',
      label: 'Pembayaran',
      icon: <Banknote className="h-4 w-4" />,
    },
    {
      id: 'history',
      label: `Riwayat (${historyCount})`,
      icon: <History className="h-4 w-4" />,
    },
  ];
  return (
    <div className="border-b border-border px-6 flex gap-1 overflow-x-auto">
      {tabs.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition ${
              isActive
                ? 'border-sage-500 text-sage-700'
                : 'border-transparent text-fg-muted hover:text-teal-800'
            }`}
          >
            {t.icon} {t.label}
          </button>
        );
      })}
    </div>
  );
}
