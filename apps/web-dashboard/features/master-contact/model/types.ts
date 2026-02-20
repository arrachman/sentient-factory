export type ContactType = 'customer' | 'supplier' | 'company';

export type MasterDataCity = {
  uuid: string;
  name: string;
  postalCode: string;
  province?: {
    uuid: string;
    name: string;
  };
};

export type MasterDataContact = {
  uuid: string;
  createdAt?: string;
  code: string;
  name: string;
  tax?: string | null;
  website?: string | null;
  address?: string | null;
  street?: string | null;
  city?: string | null;
  province?: string | null;
  zipCode?: string | null;
  type: ContactType;
  contactFirstName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
};

export type ContactFormState = {
  code: string;
  name: string;
  tax: string;
  website: string;
  address: string;
  street: string;
  city: string;
  province: string;
  zipCode: string;
  type: ContactType;
  contactFirstName: string;
  contactEmail: string;
  contactPhone: string;
};

export const initialContactForm: ContactFormState = {
  code: '',
  name: '',
  tax: '',
  website: '',
  address: '',
  street: '',
  city: '',
  province: '',
  zipCode: '',
  type: 'customer',
  contactFirstName: '',
  contactEmail: '',
  contactPhone: '',
};
