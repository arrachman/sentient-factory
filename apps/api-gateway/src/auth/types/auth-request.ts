import type { Request as ExpressRequest } from 'express';

/**
 * Shape of `req.user` setelah JwtAuthGuard pass.
 * Bersumber dari JWT payload (lihat auth.service.ts login()).
 *
 * Catatan:
 * - `sub` adalah user id (standard JWT subject claim).
 * - `id` adalah alias yang sebagian controller pakai (`req.user?.sub ?? req.user?.id`)
 *   — kept untuk backward-compat sampai controller di-migrate.
 */
export interface AuthUser {
  sub: number;
  /** Alias untuk sub — kept untuk backward-compat */
  id?: number;
  email: string;
  fullName: string | null;
  roles: string[];
}

/**
 * Express request setelah JwtAuthGuard. Gunakan di controller signature
 * sebagai pengganti `@Request() req: any`:
 *
 *   create(@Body() dto: CreateBookingDto, @Request() req: AuthRequest) {
 *     return this.service.create(dto, req.user?.sub);
 *   }
 *
 * Saat guard tidak aktif (mis. public endpoint), `user` tetap undefined-safe.
 */
export type AuthRequest = ExpressRequest & { user?: AuthUser };
