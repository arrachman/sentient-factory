export type RoleItem = {
  id?: string | number;
  uuid?: string | number;
  name: string;
  description?: string | null;
  isSystem: boolean;
  permissionCount?: number;
};

export type PermissionItem = {
  id?: string | number;
  uuid?: string | number;
  name: string;
  module: string;
  action: string;
  description?: string | null;
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
