'use client';

import { LoaderCircle } from 'lucide-react';

export function DashboardMessage({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      <LoaderCircle className="size-4 animate-spin" />
      <span>{text}</span>
    </div>
  );
}
