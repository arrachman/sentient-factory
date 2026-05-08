import { ReactNode } from 'react';
import { AdminShell } from '@/components/layouts/admin-shell';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell role="admin">{children}</AdminShell>;
}
