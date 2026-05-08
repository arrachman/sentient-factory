import { ReactNode } from 'react';
import { AdminShell } from '@/components/layouts/admin-shell';

export default function PsikologLayout({ children }: { children: ReactNode }) {
  return <AdminShell role="psikolog">{children}</AdminShell>;
}
