'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
}) {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <div className="mt-3 flex items-center justify-end gap-2 text-sm">
      <span className="text-muted-foreground">
        Halaman {page} dari {totalPages}
      </span>
      <Button size="sm" variant="default" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        <ChevronLeft className="h-3.5 w-3.5" />
      </Button>
      <Button size="sm" variant="default" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
        <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
