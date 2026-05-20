declare class UpdateMenuSortItemDto {
    id: number;
    sortOrder: number;
    path?: string | null;
}
export declare class UpdateMenuSortBatchDto {
    items: UpdateMenuSortItemDto[];
}
export {};
