import { cn } from '@/lib/utils';

/** Active/inactive pill for master-data tables. */
export function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        'rounded px-1.5 py-0.5 text-[10px] font-medium',
        active ? 'bg-success-soft text-success' : 'bg-muted text-muted-foreground'
      )}
    >
      {active ? 'Aktif' : 'Nonaktif'}
    </span>
  );
}
