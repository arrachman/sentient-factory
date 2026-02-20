export type SessionUser = {
  id?: string | number;
  email?: string;
  username?: string;
  fullName?: string | null;
};

export type AdministratorSession = {
  id?: string | number;
  uuid?: string | number;
  userId: string | number;
  token: string;
  expiresAt: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt?: string;
  user?: SessionUser;
};

export type UserOption = {
  value: string;
  label: string;
};

export type UserApiItem = {
  id?: string | number;
  uuid?: string | number;
  email?: string;
  username?: string;
  fullName?: string | null;
};

export type SessionFormState = {
  userId: string;
  token: string;
  expiresAt: string;
  ipAddress: string;
  userAgent: string;
};

export const initialSessionForm: SessionFormState = {
  userId: '',
  token: '',
  expiresAt: '',
  ipAddress: '',
  userAgent: '',
};
