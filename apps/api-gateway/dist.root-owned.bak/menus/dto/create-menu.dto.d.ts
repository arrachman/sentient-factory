export declare class CreateMenuDto {
    key: string;
    title: string;
    path?: string;
    icon?: string;
    type?: string;
    parentId?: number | null;
    sortOrder?: number;
    isVisible?: boolean;
    isActive?: boolean;
    permissionName?: string;
}
