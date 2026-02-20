export type DepartmentItem = {
  id?: string | number;
  uuid?: string | number;
  createdAt?: string;
  code: string;
  name: string;
  description?: string | null;
  parentId?: string | number | null;
  parent?: {
    id?: string | number;
    code?: string;
    name?: string;
  } | null;
};

export type DepartmentFormState = {
  code: string;
  name: string;
  description: string;
  parentId: string;
};

export const initialDepartmentForm: DepartmentFormState = {
  code: '',
  name: '',
  description: '',
  parentId: '',
};

export type DepartmentListMeta = {
  page: number;
  totalPages: number;
  total: number;
};
