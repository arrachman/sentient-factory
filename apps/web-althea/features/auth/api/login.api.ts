import { apiClient } from '@/lib/api-client';

export type LoginInput = { email: string; password: string };

export type LoginResponse = {
  success: boolean;
  data: {
    token: string;
    refreshToken: string;
    user: {
      id: number;
      email: string;
      username: string;
      fullName: string | null;
      role: string;
      roles: string[];
      createdAt: string;
    };
  };
  message?: string;
};

export const authApi = {
  login: (input: LoginInput) =>
    apiClient.post<LoginResponse>('/auth/login', input, { skipNamespace: true }),
};
