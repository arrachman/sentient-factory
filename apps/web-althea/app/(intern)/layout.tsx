import { ReactNode } from 'react';

export default function InternLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 border-b border-border bg-card px-6 flex items-center">
        <span className="brand-mark text-xl">Althea</span>
        <span className="caption ml-3">Intern</span>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
