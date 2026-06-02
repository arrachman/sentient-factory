'use client';

/**
 * Gear popover for a Kustomisasi-Grid lookup column: source + default sort +
 * default filter. Reuses the same editor as the Form Builder's "Konfigurasi
 * Lookup" so both stay in sync.
 */

import * as React from 'react';
import { Icon } from '@/components/ui/icons';
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogBody,
} from '@/components/ui/dialog';
import { LookupSortFilterFields } from './form-builder-lookup-config';
import type { ErpGridColumn } from '@/lib/api/transaction-grids';

/** True when a column has any sort/filter config set (for gear highlight). */
export function hasGridLookupConfig(col: ErpGridColumn): boolean {
  return (
    !!col.lookupDefaultSort ||
    (!!col.lookupDefaultFilter && Object.keys(col.lookupDefaultFilter).length > 0)
  );
}

export function GridColumnLookupSettings({ col, onPatch }: {
  col: ErpGridColumn;
  onPatch: (patch: Partial<ErpGridColumn>) => void;
}) {
  const configured = hasGridLookupConfig(col);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={`iconbtn ${configured ? 'text-primary' : 'text-muted-foreground'}`}
          title="Konfigurasi lookup (sumber, urutan, filter)"
          onClick={(e) => e.stopPropagation()}
        >
          <Icon name="gear" size={12} />
        </button>
      </DialogTrigger>
      <DialogContent className="w-[520px] max-w-[95vw] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Konfigurasi Lookup — {col.headerText || col.dataField}</DialogTitle>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-5 flex-1 max-h-[calc(90vh-64px)]">
          <LookupSortFilterFields
            source={col.lookupSource}
            sourceEditable
            defaultSort={col.lookupDefaultSort}
            defaultFilter={col.lookupDefaultFilter}
            onChange={onPatch}
            resetKey={col.dataField}
          />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
