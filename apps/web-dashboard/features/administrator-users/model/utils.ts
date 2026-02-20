import type { AdministratorUser } from '@/features/administrator-users/model/types';

export function toEntityId(value: unknown): string {
  if (value == null) {
    return '';
  }

  const id = String(value).trim();
  if (!id || id === 'null' || id === 'undefined') {
    return '';
  }

  return id;
}

export function pickUserId(user?: AdministratorUser | null): string {
  return toEntityId(user?.id ?? user?.uuid);
}

export function normalizeUser(item: AdministratorUser): AdministratorUser {
  return {
    ...item,
    id: item.id ?? item.uuid,
    uuid: item.uuid ?? item.id,
    warehouseId: toEntityId(item.warehouseId ?? item.warehouse?.id ?? item.warehouse?.uuid),
  };
}
