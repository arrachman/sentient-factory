export type MasterDataCity = {
  uuid: string;
  name: string;
  postalCode: string;
  province?: {
    name?: string;
    isoCode?: string;
  } | null;
};

export type MasterDataWarehouse = {
  uuid: string;
  createdAt?: string;
  name: string;
  cityId: string;
  locationName?: string | null;
  addressDetail?: string | null;
  city?: MasterDataCity | null;
};

export type WarehouseFormState = {
  name: string;
  cityId: string;
  locationName: string;
  addressDetail: string;
};

export const initialWarehouseForm: WarehouseFormState = {
  name: '',
  cityId: '',
  locationName: '',
  addressDetail: '',
};
