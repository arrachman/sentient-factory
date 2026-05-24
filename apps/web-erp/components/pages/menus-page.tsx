'use client';

/**
 * Sys config — Menu Manager page (sys_menus).
 * Flat list of MODULE/GROUP/ITEM rows that seed the sidebar nav.
 * Tree hierarchy & DnD reorder were dropped 2026-05-24 in favor of the
 * generic SimpleMasterPage flow (paritas CRUD + bulk + audit). Parent is
 * still editable per-row via the form's SearchSelect.
 * Route path: /admin/menus
 * Atomic tier: Page.
 */

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  SimpleMasterPage,
  type ExtraColumn,
  type ExtraFilterDef,
} from '@/components/organisms/simple-master-page';
import {
  listSysMenus,
  createSysMenu,
  updateSysMenu,
  deleteSysMenu,
  bulkUpdateSysMenuStatus,
  bulkDeleteSysMenus,
  ERP_MENU_TYPES,
  type ErpSysMenu,
} from '@/lib/api/sys-menus';
import {
  MenuFormFields,
  defaultMenuForm,
  fromMenu,
  toMenuPayload,
  validateMenu,
  type MenuForm,
} from './menus-form';
import type { PaginatedResponse, PaginationParams } from '@/lib/api/types';

const TYPE_VARIANT: Record<string, 'success' | 'info' | 'default'> = {
  MODULE: 'success',
  GROUP: 'info',
  ITEM: 'default',
};

type SysMenuRow = ErpSysMenu & { name: string };

const adaptRow = (m: ErpSysMenu): SysMenuRow => ({ ...m, name: m.title });

async function listAdapted(
  params: PaginationParams,
): Promise<PaginatedResponse<SysMenuRow>> {
  const res = await listSysMenus(params);
  return {
    success: res.success,
    data: res.data.map(adaptRow),
    meta: res.meta,
  };
}

const createAdapted = async (payload: ReturnType<typeof toMenuPayload>) =>
  adaptRow(await createSysMenu(payload));

const updateAdapted = async (
  id: string,
  payload: Partial<ReturnType<typeof toMenuPayload>>,
) => adaptRow(await updateSysMenu(id, payload));

const fromRecord = (row: SysMenuRow): MenuForm => fromMenu(row);

const extraColumns: ExtraColumn<SysMenuRow>[] = [
  {
    key: 'type',
    label: 'Tipe',
    sortable: true,
    render: (r) => (
      <Badge variant={TYPE_VARIANT[r.type] ?? 'default'}>{r.type}</Badge>
    ),
  },
  {
    key: 'path',
    label: 'Path',
    sortable: true,
    render: (r) => (r.path ? <span className="mono muted">{r.path}</span> : '—'),
  },
  {
    key: 'sortOrder',
    label: 'Urutan',
    sortable: true,
    render: (r) => <span className="mono">{r.sortOrder}</span>,
  },
];

const menuFilters: ExtraFilterDef[] = [
  {
    key: 'type',
    label: 'Tipe',
    options: ERP_MENU_TYPES.map((t) => ({ label: t, value: t })),
  },
];

export function ErpMenusPage() {
  const [extraValues, setExtraValues] = React.useState<Record<string, string>>({});

  const list = React.useCallback(
    (params: PaginationParams) => {
      const typeFilter = extraValues.type;
      if (!typeFilter) return listAdapted(params);
      // Apply type filter client-side on top of listAdapted output.
      return listAdapted(params).then((res) => {
        const filtered = res.data.filter((r) => r.type === typeFilter);
        return {
          ...res,
          data: filtered,
          meta: {
            ...res.meta,
            total: filtered.length,
            totalPages: Math.max(
              1,
              Math.ceil(filtered.length / (res.meta.limit || 1)),
            ),
          },
        };
      });
    },
    [extraValues.type],
  );

  return (
    <SimpleMasterPage<SysMenuRow, MenuForm>
      title="Menu Manager"
      code="SYS-MENU"
      entityLabel="menu"
      storageKey="sys-menus"
      auditEntityName="ErpMenu"
      list={list}
      create={createAdapted}
      update={updateAdapted}
      remove={deleteSysMenu}
      bulkStatus={bulkUpdateSysMenuStatus}
      bulkDelete={bulkDeleteSysMenus}
      defaultForm={defaultMenuForm}
      fromRecord={fromRecord}
      toPayload={toMenuPayload}
      FormFields={MenuFormFields}
      validate={validateMenu}
      extraColumns={extraColumns}
      defaultSortBy="sortOrder"
      defaultSortDir="asc"
      extraFilters={menuFilters}
      onExtraFilterChange={setExtraValues}
    />
  );
}
