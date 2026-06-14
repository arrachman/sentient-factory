import { BadRequestException, NotFoundException } from '@nestjs/common';

export type SidebarMenuItem = {
  id: number;
  key: string;
  title: string;
  path: string | null;
  icon: string | null;
  type: string;
  parentId: number | null;
  sortOrder: number;
  children: SidebarMenuItem[];
};

export type MenuRow = {
  id: number;
  key: string;
  title: string;
  path: string | null;
  icon: string | null;
  type: string;
  parentId: number | null;
  sortOrder: number;
};

export type SerializableMenu = {
  id: number;
  key: string;
  title: string;
  path: string | null;
  icon: string | null;
  type: string;
  parentId: number | null;
  sortOrder: number;
  isVisible: boolean;
  isActive: boolean;
  permissionName: string | null;
  createdAt: Date;
  updatedAt: Date;
  parent?: {
    id: number;
    title: string;
  } | null;
};

/**
 * Builds a sorted sidebar tree from a flat list of menu rows.
 * Pure function — no I/O.
 */
export function buildMenuTree(menuRows: MenuRow[]): SidebarMenuItem[] {
  const dedupedMap = new Map<number, SidebarMenuItem>();
  for (const menu of menuRows) {
    if (!dedupedMap.has(menu.id)) {
      dedupedMap.set(menu.id, {
        id: menu.id,
        key: menu.key,
        title: menu.title,
        path: menu.path,
        icon: menu.icon,
        type: menu.type,
        parentId: menu.parentId,
        sortOrder: menu.sortOrder,
        children: [],
      });
    }
  }

  const items = Array.from(dedupedMap.values());
  const byId = new Map(items.map((item) => [item.id, item]));
  const roots: SidebarMenuItem[] = [];

  for (const item of items) {
    if (item.parentId && byId.has(item.parentId)) {
      byId.get(item.parentId)!.children.push(item);
    } else {
      roots.push(item);
    }
  }

  sortRecursively(roots);
  return roots;
}

function sortRecursively(list: SidebarMenuItem[]): void {
  list.sort((a, b) => a.sortOrder - b.sortOrder);
  for (const entry of list) {
    sortRecursively(entry.children);
  }
}

/**
 * Returns all descendant IDs (inclusive) for a given groupId using BFS.
 * Pure function — receives all menus as input, no I/O.
 */
export function resolveDescendantIds(
  allMenus: Array<{ id: number; parentId: number | null }>,
  groupId: number,
): number[] {
  const idSet = new Set(allMenus.map((item) => item.id));
  if (!idSet.has(groupId)) {
    throw new NotFoundException('Group menu not found');
  }

  const childrenByParent = new Map<number | null, number[]>();
  for (const menu of allMenus) {
    const list = childrenByParent.get(menu.parentId) ?? [];
    list.push(menu.id);
    childrenByParent.set(menu.parentId, list);
  }

  const queue = [groupId];
  const descendants: number[] = [];
  const visited = new Set<number>();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current)) {
      continue;
    }
    visited.add(current);
    descendants.push(current);
    const children = childrenByParent.get(current) ?? [];
    queue.push(...children);
  }

  return descendants;
}

/**
 * Checks whether candidateParentId is a descendant of `id` using the given parent map.
 * Throws BadRequestException on circular hierarchy.
 * Pure function — no I/O.
 */
export function assertNoCircularHierarchy(
  allMenus: Array<{ id: number; parentId: number | null }>,
  id: number,
  candidateParentId: number,
): void {
  const parentMap = new Map<number, number | null>(
    allMenus.map((item) => [item.id, item.parentId]),
  );
  let cursor: number | null = candidateParentId;
  while (cursor !== null) {
    if (cursor === id) {
      throw new BadRequestException('Invalid parent menu. Circular hierarchy detected.');
    }
    cursor = parentMap.get(cursor) ?? null;
  }
}

/**
 * Serializes a menu record to the standard API shape.
 * Pure function — no I/O.
 */
export function serializeMenu(item: SerializableMenu) {
  return {
    id: item.id,
    key: item.key,
    title: item.title,
    path: item.path,
    icon: item.icon,
    type: item.type,
    parentId: item.parentId,
    parentTitle: item.parent?.title ?? null,
    sortOrder: item.sortOrder,
    isVisible: item.isVisible,
    isActive: item.isActive,
    permissionName: item.permissionName,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}
