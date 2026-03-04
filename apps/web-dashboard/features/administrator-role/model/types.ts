export type RoleItem = {
  id?: string | number;
  uuid?: string | number;
  name: string;
  description?: string | null;
  isSystem: boolean;
  permissionCount?: number;
  menuCount?: number;
};

export type PermissionItem = {
  id?: string | number;
  uuid?: string | number;
  name: string;
  module: string;
  action: string;
  description?: string | null;
};

export type MenuOptionItem = {
  id?: string | number;
  uuid?: string | number;
  key: string;
  title: string;
  path?: string | null;
  parentId?: string | number | null;
  parentTitle?: string | null;
  type?: string;
};

export type RoleFormState = {
  name: string;
  description: string;
  isSystem: boolean;
};

export const initialRoleForm: RoleFormState = {
  name: '',
  description: '',
  isSystem: false,
};

export type RoleListMeta = {
  page: number;
  totalPages: number;
  total: number;
};
