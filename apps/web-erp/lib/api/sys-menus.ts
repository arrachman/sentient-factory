// ERP Sys Menu resource API — CRUD for sys_menus (MODULE→GROUP→ITEM tree)
// Endpoints: /sys-menus  (flat / tree / create / update / delete)
// Kept separate from menus.ts (which owns role-filtered nav mapping).

import { apiGet, apiPost, apiPatch, apiDelete } from './client';
import type { ApiResponse, PaginatedResponse } from './types';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ErpMenuType = 'MODULE' | 'GROUP' | 'ITEM';

export const ERP_MENU_TYPES: ErpMenuType[] = ['MODULE', 'GROUP', 'ITEM'];

export interface ErpSysMenu {
  id: string;
  code: string;
  title: string;
  path: string | null;
  icon: string | null;
  type: ErpMenuType;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  legacyCode?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ErpSysMenuNode extends ErpSysMenu {
  children: ErpSysMenuNode[];
}

export interface CreateSysMenuPayload {
  code: string;
  title: string;
  path?: string | null;
  icon?: string | null;
  type: ErpMenuType;
  parentId?: string | null;
  sortOrder: number;
  isActive: boolean;
}

export type UpdateSysMenuPayload = Partial<CreateSysMenuPayload>;

// ─── API functions ────────────────────────────────────────────────────────────

/**
 * Flat list of all menus. Backend returns { success, data: [] } (no meta);
 * we adapt it to PaginatedResponse so it plugs into useErpList.
 */
export async function listSysMenus(): Promise<PaginatedResponse<ErpSysMenu>> {
  const res = await apiGet<ApiResponse<ErpSysMenu[]>>('/sys-menus');
  return {
    success: res.success,
    data: res.data,
    meta: {
      page: 1,
      limit: res.data.length,
      total: res.data.length,
      totalPages: 1,
    },
  };
}

export async function getSysMenuTree(): Promise<ErpSysMenuNode[]> {
  const res = await apiGet<ApiResponse<ErpSysMenuNode[]>>('/sys-menus/tree');
  return res.data;
}

export async function createSysMenu(
  payload: CreateSysMenuPayload,
): Promise<ErpSysMenu> {
  const res = await apiPost<ApiResponse<ErpSysMenu>>('/sys-menus', payload);
  return res.data;
}

export async function updateSysMenu(
  id: string,
  payload: UpdateSysMenuPayload,
): Promise<ErpSysMenu> {
  const res = await apiPatch<ApiResponse<ErpSysMenu>>(
    `/sys-menus/${id}`,
    payload,
  );
  return res.data;
}

export async function deleteSysMenu(id: string): Promise<void> {
  await apiDelete<void>(`/sys-menus/${id}`);
}
