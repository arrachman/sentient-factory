export type MasterDataProvince = {
  uuid: string;
  createdAt?: string;
  name: string;
  isoCode: string;
};

export type MasterProvinceFormState = {
  name: string;
  isoCode: string;
};

export const initialMasterProvinceForm: MasterProvinceFormState = {
  name: '',
  isoCode: '',
};
