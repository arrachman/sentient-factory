import { ReactNode } from 'react';
import { AdminShell } from '@/components/layouts/admin-shell';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <AdminShell role="marketing">{children}</AdminShell>;
}
