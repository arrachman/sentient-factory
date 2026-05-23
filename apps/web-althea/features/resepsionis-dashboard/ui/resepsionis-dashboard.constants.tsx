import { CheckCircle2, PlayCircle, Users } from 'lucide-react';

export type ColumnKey = 'checked_in' | 'in_progress' | 'completed';

export const COLUMN_META: Record<
  ColumnKey,
  { title: string; subtitle: string; accent: string; icon: React.ReactNode }
> = {
  checked_in: {
    title: 'Check-in',
    subtitle: 'Menunggu dimulai',
    accent: 'var(--sage-500)',
    icon: <Users size={14} strokeWidth={2.2} />,
  },
  in_progress: {
    title: 'Berlangsung',
    subtitle: 'Sedang sesi',
    accent: '#c97a5d',
    icon: <PlayCircle size={14} strokeWidth={2.2} />,
  },
  completed: {
    title: 'Selesai',
    subtitle: 'Sesi hari ini',
    accent: 'var(--teal-700)',
    icon: <CheckCircle2 size={14} strokeWidth={2.2} />,
  },
};
