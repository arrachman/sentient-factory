import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { MenusPage } from '@/components/pages/menus-page';

export const metadata: Metadata = { title: 'Master · Menu / Navigasi' };

export default function Page() {
  return (
    <AppShell>
      <MenusPage />
    </AppShell>
  );
}
