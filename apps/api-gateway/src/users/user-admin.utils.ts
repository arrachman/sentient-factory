import { BadRequestException } from '@nestjs/common';
import { User } from '@prisma/client';

export type WarehouseMeta = {
  warehouseId: number | null;
  warehouseName: string | null;
};

export function normalizeWarehouseId(warehouseId?: string): number | null | undefined {
  if (warehouseId === undefined) {
    return undefined;
  }
  const normalized = warehouseId.trim();
  if (!normalized.length) return null;
  const parsed = Number(normalized);
  if (!Number.isInteger(parsed)) {
    throw new BadRequestException('Warehouse ID is invalid');
  }
  return parsed;
}

export function normalizeRoleIds(roleIds?: string[], roleId?: string): number[] | undefined {
  if (Array.isArray(roleIds)) {
    const parsed = roleIds.map((value) => {
      const normalized = String(value ?? '').trim();
      const roleIdNumber = Number(normalized);
      if (!normalized.length || !Number.isInteger(roleIdNumber)) {
        throw new BadRequestException('Role IDs are invalid');
      }
      return roleIdNumber;
    });
    return Array.from(new Set(parsed));
  }

  if (roleId === undefined) {
    return undefined;
  }

  const normalized = roleId.trim();
  if (!normalized.length) {
    return [];
  }
  const parsed = Number(normalized);
  if (!Number.isInteger(parsed)) {
    throw new BadRequestException('Role ID is invalid');
  }
  return [parsed];
}

export function serializeUser(
  user: User & {
    roles?: Array<{
      role: {
        id: number;
        name: string;
      };
    }>;
  },
  warehouseMeta?: WarehouseMeta,
) {
  const { passwordHash: _passwordHash, ...safe } = user;
  return {
    ...safe,
    warehouseId: warehouseMeta?.warehouseId ?? null,
    warehouseName: warehouseMeta?.warehouseName ?? null,
    roleIds: user.roles?.map((item) => item.role.id) ?? [],
    roleId: user.roles?.[0]?.role?.id ?? null,
    roles: user.roles?.map((item) => item.role.name) ?? [],
    role: user.roles?.[0]?.role?.name ?? null,
  };
}
