import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  getHrProfileByAppUserId,
  isPrivileged,
  normalizeHrDates,
} from '../hr-attendance/hr-attendance-helpers';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';

type AuthUser = { id: number; roles?: string[] };

@Injectable()
export class HrRolesService {
  constructor(private prisma: PrismaService) {}

  private requirePrivileged(authUser: AuthUser) {
    if (!isPrivileged(authUser.roles)) {
      throw new ForbiddenException('Hanya admin/manager yang dapat mengelola peran HR.');
    }
  }

  // ─── Roles catalog ───────────────────────────────────────────────────────────

  async listRoles() {
    const rows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
      SELECT r.id, r.code, r.name, r.description,
             r.is_system AS "isSystem", r.is_active AS "isActive",
             r.created_at AS "createdAt",
             (SELECT count(*)::int FROM public.hr_user_roles ur
               WHERE ur.role_id = r.id AND ur.deleted_at IS NULL) AS "memberCount"
      FROM public.hr_roles r
      WHERE r.deleted_at IS NULL
      ORDER BY r.is_system DESC, r.name
    `);
    return { success: true, data: normalizeHrDates(rows) };
  }

  async createRole(authUser: AuthUser, dto: CreateRoleDto) {
    this.requirePrivileged(authUser);
    const rows = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
      INSERT INTO public.hr_roles (code, name, description, is_system, is_active, created_by)
      VALUES (${dto.code}, ${dto.name}, ${dto.description ?? null}, false,
              ${dto.isActive ?? true}, ${authUser.id})
      RETURNING id
    `);
    return { success: true, data: { id: rows[0]?.id } };
  }

  async updateRole(authUser: AuthUser, id: number, dto: UpdateRoleDto) {
    this.requirePrivileged(authUser);
    const sets: Prisma.Sql[] = [];
    if (dto.code !== undefined) sets.push(Prisma.sql`code = ${dto.code}`);
    if (dto.name !== undefined) sets.push(Prisma.sql`name = ${dto.name}`);
    if (dto.description !== undefined) sets.push(Prisma.sql`description = ${dto.description}`);
    if (dto.isActive !== undefined) sets.push(Prisma.sql`is_active = ${dto.isActive}`);
    if (sets.length === 0) return { success: true, data: { id } };
    sets.push(Prisma.sql`updated_at = now()`, Prisma.sql`updated_by = ${authUser.id}`);
    const res = await this.prisma.$executeRaw(Prisma.sql`
      UPDATE public.hr_roles SET ${Prisma.join(sets, ', ')}
      WHERE id = ${id} AND deleted_at IS NULL
    `);
    if (res === 0) throw new NotFoundException('Peran tidak ditemukan.');
    return { success: true, data: { id } };
  }

  async deleteRole(authUser: AuthUser, id: number) {
    this.requirePrivileged(authUser);
    const rows = await this.prisma.$queryRaw<Array<{ isSystem: boolean }>>(Prisma.sql`
      SELECT is_system AS "isSystem" FROM public.hr_roles
      WHERE id = ${id} AND deleted_at IS NULL LIMIT 1
    `);
    if (!rows[0]) throw new NotFoundException('Peran tidak ditemukan.');
    if (rows[0].isSystem) throw new BadRequestException('Peran sistem tidak dapat dihapus.');
    await this.prisma.$transaction([
      this.prisma.$executeRaw(Prisma.sql`
        UPDATE public.hr_roles SET deleted_at = now(), deleted_by = ${authUser.id}
        WHERE id = ${id} AND deleted_at IS NULL
      `),
      this.prisma.$executeRaw(Prisma.sql`
        UPDATE public.hr_user_roles SET deleted_at = now(), deleted_by = ${authUser.id}
        WHERE role_id = ${id} AND deleted_at IS NULL
      `),
    ]);
    return { success: true };
  }

  // ─── User ↔ role assignment ────────────────────────────────────────────────────

  private async resolveHrUserId(targetAppUserId: number) {
    const profile = await getHrProfileByAppUserId(this.prisma, targetAppUserId);
    if (!profile) throw new NotFoundException('Profil HR tidak ditemukan untuk pengguna ini.');
    return Number(profile.hrUserId);
  }

  async getUserRoles(authUser: AuthUser, targetAppUserId: number) {
    this.requirePrivileged(authUser);
    const hrUserId = await this.resolveHrUserId(targetAppUserId);
    const rows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
      SELECT r.id, r.code, r.name
      FROM public.hr_user_roles ur
      JOIN public.hr_roles r ON r.id = ur.role_id AND r.deleted_at IS NULL
      WHERE ur.user_id = ${hrUserId} AND ur.deleted_at IS NULL
      ORDER BY r.name
    `);
    return { success: true, data: { appUserId: targetAppUserId, hrUserId, roles: rows } };
  }

  async setUserRoles(authUser: AuthUser, targetAppUserId: number, roleIds: number[]) {
    this.requirePrivileged(authUser);
    const hrUserId = await this.resolveHrUserId(targetAppUserId);
    const uniqueRoleIds = Array.from(new Set(roleIds.filter((v) => Number.isFinite(v) && v > 0)));

    if (uniqueRoleIds.length > 0) {
      const valid = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
        SELECT id FROM public.hr_roles
        WHERE deleted_at IS NULL AND id IN (${Prisma.join(uniqueRoleIds)})
      `);
      if (valid.length !== uniqueRoleIds.length) {
        throw new BadRequestException('Salah satu peran tidak valid atau sudah dihapus.');
      }
    }

    const inserts = uniqueRoleIds.map((roleId) =>
      this.prisma.$executeRaw(Prisma.sql`
        INSERT INTO public.hr_user_roles (user_id, role_id, created_at, created_by, updated_by)
        VALUES (${hrUserId}, ${roleId}, now(), ${authUser.id}, ${authUser.id})
      `),
    );
    await this.prisma.$transaction([
      this.prisma.$executeRaw(Prisma.sql`
        UPDATE public.hr_user_roles
        SET deleted_at = now(), deleted_by = ${authUser.id}
        WHERE user_id = ${hrUserId} AND deleted_at IS NULL
      `),
      ...inserts,
    ]);
    return this.getUserRoles(authUser, targetAppUserId);
  }
}
