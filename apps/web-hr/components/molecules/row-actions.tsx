'use client';

// Canonical row actions for HR list tables — ported from web-erp (§2.11): all
// actions behind a kebab (more-vertical) with right-click parity via the same
// items. Uses the ui-kit dropdown/context primitives (Tier 2).

import { Fragment, type ReactElement } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

export interface RowActionItem {
  label: string;
  onSelect: () => void;
  danger?: boolean;
  separatorBefore?: boolean;
}

/** Kebab dropdown of row actions. Stops click propagation so opening the menu
 *  doesn't also trigger row-open. */
export function RowActionsMenu({ items }: { items: RowActionItem[] }) {
  return (
    <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost" aria-label="Aksi baris" className="!px-1.5">
            <Icon name="more-vertical" size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {items.map((it, i) => (
            <Fragment key={`${it.label}-${i}`}>
              {it.separatorBefore && <DropdownMenuSeparator />}
              <DropdownMenuItem danger={it.danger} onSelect={() => it.onSelect()}>
                {it.label}
              </DropdownMenuItem>
            </Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/** Right-click parity for a table row — renders the SAME items as the kebab. */
export function RowContextMenu({
  items,
  children,
}: {
  items: RowActionItem[];
  children: ReactElement;
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        {items.map((it, i) => (
          <Fragment key={`${it.label}-${i}`}>
            {it.separatorBefore && <ContextMenuSeparator />}
            <ContextMenuItem danger={it.danger} onSelect={() => it.onSelect()}>
              {it.label}
            </ContextMenuItem>
          </Fragment>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
}
