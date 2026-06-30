import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { RoleMenusPage } from '@/components/pages/role-menus-page';

export const metadata: Metadata = { title: 'Master · Akses Menu per Role' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl">
        <RoleMenusPage />
      </div>
    </AppShell>
  );
}
