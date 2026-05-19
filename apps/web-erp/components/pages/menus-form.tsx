'use client';

/**
 * Sys Menu Manager — form fields molecule.
 * Used by menus-page.tsx inside the create/edit modal.
 * Atomic tier: Organism (form section).
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type {
  ErpSysMenu,
  ErpMenuType,
  CreateSysMenuPayload,
} from '@/lib/api/sys-menus';
import { ERP_MENU_TYPES } from '@/lib/api/sys-menus';

export interface MenuForm {
  code: string;
  title: string;
  type: ErpMenuType;
  parentId: string;
  path: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

export const defaultMenuForm = (): MenuForm => ({
  code: '',
  title: '',
  type: 'MODULE',
  parentId: '',
  path: '',
  icon: '',
  sortOrder: 0,
  isActive: true,
});

export function fromMenu(m: ErpSysMenu): MenuForm {
  return {
    code: m.code,
    title: m.title,
    type: m.type,
    parentId: m.parentId ?? '',
    path: m.path ?? '',
    icon: m.icon ?? '',
    sortOrder: m.sortOrder,
    isActive: m.isActive,
  };
}

export function toMenuPayload(f: MenuForm): CreateSysMenuPayload {
  return {
    code: f.code,
    title: f.title,
    type: f.type,
    parentId: f.parentId || null,
    path: f.path || null,
    icon: f.icon || null,
    sortOrder: f.sortOrder,
    isActive: f.isActive,
  };
}

export function MenuFormFields({
  data,
  onChange,
  allRows,
  editingId,
}: {
  data: MenuForm;
  onChange: (d: MenuForm) => void;
  allRows: ErpSysMenu[];
  editingId?: string;
}) {
  const set = <K extends keyof MenuForm>(k: K, v: MenuForm[K]) =>
    onChange({ ...data, [k]: v });

  // Parent candidates: MODULE/GROUP only, never self.
  const parents = allRows.filter(
    (r) => r.id !== editingId && (r.type === 'MODULE' || r.type === 'GROUP'),
  );

  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="mf-code" required>
        <Input
          id="mf-code"
          value={data.code}
          onChange={(e) => set('code', e.target.value)}
          placeholder="INVENTORY_ITEMS"
        />
      </FormField>
      <FormField label="Judul" htmlFor="mf-title" required>
        <Input
          id="mf-title"
          value={data.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Inventory Items"
        />
      </FormField>
      <FormField label="Tipe" htmlFor="mf-type" required>
        <Select
          value={data.type}
          onValueChange={(v) => set('type', v as ErpMenuType)}
        >
          <SelectTrigger id="mf-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ERP_MENU_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Parent" htmlFor="mf-parent">
        <Select
          value={data.parentId || '__none__'}
          onValueChange={(v) =>
            set('parentId', v === '__none__' ? '' : v)
          }
        >
          <SelectTrigger id="mf-parent">
            <SelectValue placeholder="— Top level —" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">— Top level —</SelectItem>
            {parents.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                [{p.type}] {p.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Path" htmlFor="mf-path">
        <Input
          id="mf-path"
          value={data.path}
          onChange={(e) => set('path', e.target.value)}
          placeholder="/master/items"
        />
      </FormField>
      <FormField label="Icon" htmlFor="mf-icon">
        <Input
          id="mf-icon"
          value={data.icon}
          onChange={(e) => set('icon', e.target.value)}
          placeholder="package"
        />
      </FormField>
      <FormField label="Urutan" htmlFor="mf-sort">
        <Input
          id="mf-sort"
          type="number"
          value={String(data.sortOrder)}
          onChange={(e) =>
            set('sortOrder', Number(e.target.value) || 0)
          }
          placeholder="0"
        />
      </FormField>
      <FormField label="Status" htmlFor="mf-active">
        <Select
          value={data.isActive ? 'active' : 'inactive'}
          onValueChange={(v) => set('isActive', v === 'active')}
        >
          <SelectTrigger id="mf-active">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Nonaktif</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
    </div>
  );
}
