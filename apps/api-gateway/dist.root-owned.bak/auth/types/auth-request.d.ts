import type { Request as ExpressRequest } from 'express';
export interface AuthUser {
    sub: number;
    id?: number;
    email: string;
    fullName: string | null;
    roles: string[];
}
export type AuthRequest = ExpressRequest & {
    user?: AuthUser;
};
