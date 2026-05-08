import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* TODO: components/layouts/admin-shell — sidebar 260px + topbar */}
      <aside className="w-64 border-r border-border bg-card hidden lg:block">
        <div className="h-16 px-4 flex items-center border-b border-border">
          <span className="brand-mark text-xl">Althea</span>
          <span className="caption ml-3">Admin</span>
        </div>
        {/* TODO: nav items */}
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
