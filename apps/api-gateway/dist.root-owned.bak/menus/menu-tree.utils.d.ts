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
export declare function buildMenuTree(menuRows: MenuRow[]): SidebarMenuItem[];
export declare function resolveDescendantIds(allMenus: Array<{
    id: number;
    parentId: number | null;
}>, groupId: number): number[];
export declare function assertNoCircularHierarchy(allMenus: Array<{
    id: number;
    parentId: number | null;
}>, id: number, candidateParentId: number): void;
export declare function serializeMenu(item: SerializableMenu): {
    id: number;
    key: string;
    title: string;
    path: string | null;
    icon: string | null;
    type: string;
    parentId: number | null;
    parentTitle: string | null;
    sortOrder: number;
    isVisible: boolean;
    isActive: boolean;
    permissionName: string | null;
    createdAt: Date;
    updatedAt: Date;
};
