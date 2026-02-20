export type MasterDataProvince = {
  uuid: string;
  name: string;
  isoCode: string;
};

export type MasterDataCity = {
  uuid: string;
  provinceId: string;
  name: string;
  postalCode: string;
  province?: MasterDataProvince;
};

export type MasterDataCitySla = {
  uuid: string;
  createdAt?: string;
  cityId: string;
  stdLeadTimeDays: number;
  stdReturnDoDays: number;
  city?: MasterDataCity;
};

export type CitySlaFormState = {
  cityId: string;
  stdLeadTimeDays: string;
  stdReturnDoDays: string;
};

export const initialCitySlaForm: CitySlaFormState = {
  cityId: '',
  stdLeadTimeDays: '0',
  stdReturnDoDays: '0',
};
