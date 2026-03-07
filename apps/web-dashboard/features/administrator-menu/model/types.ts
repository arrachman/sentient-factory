export type AdministratorMenu = {
  id: number;
  key: string;
  title: string;
  path: string | null;
  icon: string | null;
  type: string;
  parentId: number | null;
  parentTitle: string | null;
  updatedAt?: string;
  sortOrder: number;
  isVisible: boolean;
  isActive: boolean;
  permissionName: string | null;
  createdAt?: string;
};

export type AdministratorMenuFormState = {
  key: string;
  title: string;
  path: string;
  icon: string;
  type: string;
  parentId: string;
  sortOrder: string;
  permissionName: string;
  isVisible: boolean;
  isActive: boolean;
};

export const initialAdministratorMenuForm: AdministratorMenuFormState = {
  key: '',
  title: '',
  path: '',
  icon: '',
  type: 'ITEM',
  parentId: '',
  sortOrder: '0',
  permissionName: '',
  isVisible: true,
  isActive: true,
};
