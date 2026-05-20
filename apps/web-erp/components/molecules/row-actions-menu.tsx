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
 * Canonical inline row actions for list tables: primary action (Edit) stays
 * visible; secondary/destructive items collapse into a kebab. Reduces visual
 * noise and pushes Hapus behind a deliberate two-click path.
 */
export function RowActionsMenu({
  onEdit,
  items,
  editLabel = 'Edit',
}: {
  onEdit: () => void;
  items: RowActionItem[];
  editLabel?: string;
}) {
  return (
    <div
      className="flex items-center justify-end gap-1"
      onClick={(e) => e.stopPropagation()}
    >
      <Button size="sm" variant="default" onClick={onEdit}>
        {editLabel}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            aria-label="Aksi lain"
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
