import { ErpNumberingReset } from '@prisma/client';
export declare class CreateErpDocumentNumberingDto {
    documentCode: string;
    name: string;
    prefix: string;
    digitCount: number;
    resetPolicy: ErpNumberingReset;
    nextNumber?: number;
    menuId?: string;
    affectsLedger?: boolean;
    affectsInventory?: boolean;
    affectsCost?: boolean;
    notes?: string;
}
