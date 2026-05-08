import { ReactNode } from 'react';
import { AdminShell } from '@/components/layouts/admin-shell';

export default function OwnerLayout({ children }: { children: ReactNode }) {
  return <AdminShell role="owner">{children}</AdminShell>;
}
