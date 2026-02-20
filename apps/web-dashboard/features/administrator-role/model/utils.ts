import type { RoleItem } from '@/features/administrator-role/model/types';

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

export function pickEntityId(entity?: { id?: string | number; uuid?: string | number } | null): string {
  return toEntityId(entity?.id ?? entity?.uuid);
}

export function normalizeRoleItem(item: RoleItem): RoleItem {
  return {
    ...item,
    id: item.id ?? item.uuid,
    uuid: item.uuid ?? item.id,
  };
}
