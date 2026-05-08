import { ReactNode } from 'react';

export default function PsychologistLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* TODO: components/layouts/psychologist-shell */}
      <header className="h-16 border-b border-border bg-card px-6 flex items-center">
        <span className="brand-mark text-xl">Althea</span>
        <span className="caption ml-3">Psikolog</span>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
