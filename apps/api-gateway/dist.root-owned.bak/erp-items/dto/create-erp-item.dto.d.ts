import { ErpItemType } from '@prisma/client';
export declare class CreateErpItemDto {
    code: string;
    name: string;
    itemType: ErpItemType;
    categoryId: string;
    unitId: string;
    description?: string;
    barcode?: string;
    standardCost?: string;
    purchasePrice?: string;
    salePrice?: string;
    minStock?: string;
    maxStock?: string;
    reorderQty?: string;
    tracksSerial?: boolean;
    tracksBatch?: boolean;
    tracksBin?: boolean;
    inventoryAccountId?: string | null;
    salesAccountId?: string | null;
    cogsAccountId?: string | null;
    isActive?: boolean;
}
