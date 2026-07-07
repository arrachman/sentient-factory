// mdp foundation — work calendars (OEE availability), nav SSOT, ERP role
// access map. Identity/roles are reused from ERP (adm_*).
import { crudResource, request } from './client';

export interface WorkCalendar {
  id: string;
  code: string;
  name: string;
  description: string | null;
  workCenterId: string | null;
  shiftId: string | null;
  plannedMinutesPerDay: string;
  workingDaysPerWeek: number;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  isActive: boolean;
}

export interface Menu {
  id: string;
  code: string;
  name: string;
  parentId: string | null;
  path: string | null;
  icon: string | null;
  moduleKey: string | null;
  sequence: number;
  isActive: boolean;
  parent?: { id: string; code: string; name: string } | null;
}

export interface RoleMenu {
  id: string;
  roleId: string;
  menuId: string;
  canView: boolean;
  canEdit: boolean;
  menu?: { id: string; code: string; name: string; path: string | null } | null;
}

export const workCalendars = crudResource<WorkCalendar>('/work-calendars');
export const menus = crudResource<Menu>('/menus');
export const roleMenus = crudResource<RoleMenu>('/role-menus');

/** ERP role (adm_roles) — read-only; MDP reuses ERP identity/roles. */
export interface Role {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

/** List ERP roles for the access-map admin UI. */
export function fetchRoles() {
  return request<{ success: boolean; data: Role[] }>('/roles');
}

export interface RoleMenuEntry {
  menuId: string;
  canView?: boolean;
  canEdit?: boolean;
}

/** Atomically replace a role's full menu access set (create/update/soft-delete). */
export function setRoleMenus(roleId: string, entries: RoleMenuEntry[]) {
  return request<{ success: boolean; data: RoleMenu[] }>(`/role-menus/role/${roleId}`, {
    method: 'PUT',
    body: JSON.stringify({ entries }),
  });
}

export interface NavNode {
  id: string;
  parentId: string | null;
  code: string;
  name: string;
  path: string | null;
  icon: string | null;
  moduleKey: string | null;
  sequence: number;
  children: NavNode[];
}

/** Role-filtered navigation tree for the current user (mdp_menus + mdp_role_menus). */
export function fetchNav() {
  return request<{ success: boolean; data: NavNode[] }>('/menus/nav');
}
