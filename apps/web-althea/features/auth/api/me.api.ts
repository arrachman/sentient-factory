import { apiClient } from '@/lib/api-client';

export type CurrentUser = {
  id: number;
  email: string;
  username: string;
  fullName: string | null;
  name: string;
  warehouseId: number | null;
  warehouseName: string | null;
  roles: string[];
};

export type MeResponse = {
  success: boolean;
  data: CurrentUser;
};

export const meApi = {
  getMe: () => apiClient.get<MeResponse>('/auth/me', { skipNamespace: true }),
};
