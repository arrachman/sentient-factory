import { ReactNode } from 'react';
import { AdminShell } from '@/components/layouts/admin-shell';

export default function ResepsionisLayout({ children }: { children: ReactNode }) {
  return <AdminShell role="resepsionis">{children}</AdminShell>;
}
