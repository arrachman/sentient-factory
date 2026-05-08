import { ReactNode } from 'react';
import { AdminShell } from '@/components/layouts/admin-shell';

export default function InternLayout({ children }: { children: ReactNode }) {
  return <AdminShell role="intern">{children}</AdminShell>;
}
