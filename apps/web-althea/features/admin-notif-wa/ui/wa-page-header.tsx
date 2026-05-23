'use client';

import { Settings } from 'lucide-react';

export function WaPageHeader({
  onOpenSettings,
}: {
  onOpenSettings: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <button
        type="button"
        className="btn btn-outline btn-sm"
        onClick={onOpenSettings}
      >
        <Settings className="h-3.5 w-3.5" />
        Pengaturan WA
      </button>
    </div>
  );
}
