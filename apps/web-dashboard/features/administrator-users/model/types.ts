export type AdministratorUser = {
  id?: string | number;
  uuid?: string | number;
  email: string;
  username: string;
  fullName?: string | null;
  roleId?: string | number | null;
  roleIds?: Array<string | number>;
  warehouseId?: string | null;
  warehouseName?: string | null;
  warehouse?: {
    id?: string | number | null;
    uuid?: string | number | null;
  } | null;
  isActive: boolean;
  role?: string | null;
  roles?: string[];
};

export type WarehouseOption = {
  value: string;
  label: string;
};

export type WarehouseApiItem = {
  id?: string | number;
  uuid?: string;
  name?: string | null;
  locationName?: string | null;
};

export type RoleApiItem = {
  id?: string | number;
  uuid?: string | number;
  name?: string | null;
};

export type UserFormState = {
  email: string;
  username: string;
  fullName: string;
  password: string;
  roleIds: string[];
  warehouseId: string;
  isActive: boolean;
};

export const initialUserForm: UserFormState = {
  email: '',
  username: '',
  fullName: '',
  password: '',
  roleIds: [],
  warehouseId: '',
  isActive: true,
};

export type UserListMeta = {
  page: number;
  totalPages: number;
  total: number;
};
