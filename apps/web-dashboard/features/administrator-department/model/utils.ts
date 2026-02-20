import type { DepartmentItem } from '@/features/administrator-department/model/types';

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

export function pickDepartmentId(item?: DepartmentItem | null): string {
  return toEntityId(item?.id ?? item?.uuid);
}

export function normalizeDepartmentItem(item: DepartmentItem): DepartmentItem {
  return {
    ...item,
    id: item.id ?? item.uuid,
    uuid: item.uuid ?? item.id,
  };
}
