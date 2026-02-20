export type MasterDataUom = {
  uuid: string;
  code: string;
  name: string;
  type: string;
};

export type MasterDataItem = {
  uuid: string;
  createdAt?: string;
  code: string;
  name: string;
  category: string;
  itemType: string;
  isActive: boolean;
  uomId: string;
  uom?: MasterDataUom;
};

export type MasterItemFormState = {
  code: string;
  name: string;
  category: string;
  uomId: string;
  itemType: string;
  isActive: boolean;
};

export const initialMasterItemForm: MasterItemFormState = {
  code: '',
  name: '',
  category: '',
  uomId: '',
  itemType: '',
  isActive: true,
};
