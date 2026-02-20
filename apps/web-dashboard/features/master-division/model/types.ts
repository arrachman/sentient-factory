export type MasterDataDivision = {
  uuid: string;
  createdAt?: string;
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;
};

export type MasterDivisionFormState = {
  code: string;
  name: string;
  description: string;
  isActive: boolean;
};

export const initialMasterDivisionForm: MasterDivisionFormState = {
  code: '',
  name: '',
  description: '',
  isActive: true,
};
