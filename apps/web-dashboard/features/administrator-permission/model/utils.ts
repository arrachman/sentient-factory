import type { PermissionItem } from '@/features/administrator-permission/model/types';

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

export function pickPermissionId(item?: PermissionItem | null): string {
  return toEntityId(item?.id ?? item?.uuid);
}

export function normalizePermissionItem(item: PermissionItem): PermissionItem {
  return {
    ...item,
    id: item.id ?? item.uuid,
    uuid: item.uuid ?? item.id,
  };
}
