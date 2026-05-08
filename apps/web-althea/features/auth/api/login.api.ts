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

/**
 * Login goes through Next.js Route Handler (`/api/auth/login` di SAME origin
 * web-althea, NOT api-gateway directly). The handler proxies ke api-gateway
 * dan set HttpOnly cookie sf_token (XSS-safe).
 *
 * Logout pakai Route Handler `/api/auth/logout` untuk clear cookie + notify
 * upstream session invalidation.
 */
export const authApi = {
  login: async (input: LoginInput): Promise<LoginResponse> => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || `Login failed: ${res.status}`);
    }
    return data as LoginResponse;
  },
  logout: async (): Promise<void> => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  },
};
