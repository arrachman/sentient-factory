import { ReactNode } from 'react';
import { AppShell } from '@/components/templates/app-shell';

export default function AppSegmentLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
