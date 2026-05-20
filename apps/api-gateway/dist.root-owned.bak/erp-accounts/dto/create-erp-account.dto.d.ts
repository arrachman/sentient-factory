import { ErpAccountType, ErpAccountKind, ErpNormalBalance, ErpCashFlowCategory } from '@prisma/client';
export declare class CreateErpAccountDto {
    code: string;
    name: string;
    alias?: string;
    accountType: ErpAccountType;
    accountKind: ErpAccountKind;
    normalBalance: ErpNormalBalance;
    cashFlowCategory?: ErpCashFlowCategory;
    parentId?: string | null;
    currencyId?: string | null;
    level?: number;
    isActive?: boolean;
    isControlAccount?: boolean;
    bankName?: string;
    bankAccountNo?: string;
    notes?: string;
}
