export type MasterDataProvince = {
  uuid: string;
  name: string;
  isoCode: string;
};

export type MasterDataCity = {
  uuid: string;
  createdAt?: string;
  provinceId: string;
  name: string;
  postalCode: string;
  province?: MasterDataProvince;
};

export type MasterCityFormState = {
  provinceId: string;
  name: string;
  postalCode: string;
};

export const initialMasterCityForm: MasterCityFormState = {
  provinceId: '',
  name: '',
  postalCode: '',
};
