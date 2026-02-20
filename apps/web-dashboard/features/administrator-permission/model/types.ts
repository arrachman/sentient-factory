export type PermissionItem = {
  id?: string | number;
  uuid?: string | number;
  name: string;
  module: string;
  action: string;
  description?: string | null;
  createdAt?: string;
};

export type PermissionFormState = {
  name: string;
  module: string;
  action: string;
  description: string;
};

export const initialPermissionForm: PermissionFormState = {
  name: '',
  module: '',
  action: '',
  description: '',
};

export type PermissionListMeta = {
  page: number;
  totalPages: number;
  total: number;
};
