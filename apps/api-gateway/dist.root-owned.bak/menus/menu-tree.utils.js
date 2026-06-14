"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMenuTree = buildMenuTree;
exports.resolveDescendantIds = resolveDescendantIds;
exports.assertNoCircularHierarchy = assertNoCircularHierarchy;
exports.serializeMenu = serializeMenu;
const common_1 = require("@nestjs/common");
function buildMenuTree(menuRows) {
    const dedupedMap = new Map();
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
    const roots = [];
    for (const item of items) {
        if (item.parentId && byId.has(item.parentId)) {
            byId.get(item.parentId).children.push(item);
        }
        else {
            roots.push(item);
        }
    }
    sortRecursively(roots);
    return roots;
}
function sortRecursively(list) {
    list.sort((a, b) => a.sortOrder - b.sortOrder);
    for (const entry of list) {
        sortRecursively(entry.children);
    }
}
function resolveDescendantIds(allMenus, groupId) {
    const idSet = new Set(allMenus.map((item) => item.id));
    if (!idSet.has(groupId)) {
        throw new common_1.NotFoundException('Group menu not found');
    }
    const childrenByParent = new Map();
    for (const menu of allMenus) {
        const list = childrenByParent.get(menu.parentId) ?? [];
        list.push(menu.id);
        childrenByParent.set(menu.parentId, list);
    }
    const queue = [groupId];
    const descendants = [];
    const visited = new Set();
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
function assertNoCircularHierarchy(allMenus, id, candidateParentId) {
    const parentMap = new Map(allMenus.map((item) => [item.id, item.parentId]));
    let cursor = candidateParentId;
    while (cursor !== null) {
        if (cursor === id) {
            throw new common_1.BadRequestException('Invalid parent menu. Circular hierarchy detected.');
        }
        cursor = parentMap.get(cursor) ?? null;
    }
}
function serializeMenu(item) {
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
//# sourceMappingURL=menu-tree.utils.js.map