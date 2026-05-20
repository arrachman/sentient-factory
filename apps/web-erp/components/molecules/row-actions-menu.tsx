'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface RowActionItem {
  label: string;
  onSelect: () => void;
  danger?: boolean;
  separatorBefore?: boolean;
}

/**
 * Canonical inline row actions for list tables: semua aksi (Edit, Riwayat,
 * Hapus, …) di balik kebab `more-vertical`. Tabel tetap tenang; aksi
 * destruktif butuh klik sengaja sehingga lebih aman.
 */
export function RowActionsMenu({ items }: { items: RowActionItem[] }) {
  return (
    <div
      className="flex items-center justify-end"
      onClick={(e) => e.stopPropagation()}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            aria-label="Aksi baris"
            className="!px-1.5"
          >
            <Icon name="more-vertical" size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {items.map((it, i) => (
            <React.Fragment key={`${it.label}-${i}`}>
              {it.separatorBefore && <DropdownMenuSeparator />}
              <DropdownMenuItem
                danger={it.danger}
                onSelect={(e) => {
                  e.preventDefault();
                  it.onSelect();
                }}
              >
                {it.label}
              </DropdownMenuItem>
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
