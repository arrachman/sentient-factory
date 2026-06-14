export declare class CreateErpPaymentTermDto {
    code: string;
    name: string;
    netDays: number;
    discountDays1?: number;
    discountPercent1?: string;
    discountDays2?: number;
    discountPercent2?: string;
    penaltyPercent?: string;
    penaltyPeriod?: string;
    isActive?: boolean;
}
