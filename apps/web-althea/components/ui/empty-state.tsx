import { LucideIcon, Inbox } from 'lucide-react';
import { ReactNode } from 'react';

type Props = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
};

/**
 * Empty state untuk halaman/list tanpa data. Provides simple visual
 * hierarchy (icon → title → description → action) dan CTA opsional.
 *
 * Usage:
 *   <EmptyState
 *     icon={CalendarDays}
 *     title="Belum ada booking"
 *     description="Klik tombol Booking Baru untuk mulai..."
 *     action={<button onClick={...} className="btn btn-primary">Booking Baru</button>}
 *   />
 */
export function EmptyState({ icon: Icon = Inbox, title, description, action }: Props) {
  return (
    <div className="card-althea p-12 text-center bg-card">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sage-100 text-sage-600">
        <Icon className="h-8 w-8" strokeWidth={1.5} />
      </div>
      <h3 className="h3 mb-2 text-teal-800">{title}</h3>
      {description && <p className="caption mb-4 max-w-sm mx-auto text-fg-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
