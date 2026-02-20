export type MasterDataUom = {
  uuid: string;
  createdAt?: string;
  code: string;
  name: string;
  type: string;
};

export type MasterUomFormState = {
  code: string;
  name: string;
  type: string;
};

export const initialMasterUomForm: MasterUomFormState = {
  code: '',
  name: '',
  type: '',
};
