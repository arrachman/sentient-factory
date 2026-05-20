export declare class CreatePsikologDto {
    email: string;
    fullName: string;
    phone?: string;
    username?: string;
    password?: string;
    title?: string;
    specialty?: string[];
    color?: string;
    license?: string;
    defaultSlots?: number;
    weeklyAvailability?: Record<string, {
        isOpen: boolean;
        slotIndices?: number[];
    }>;
    serviceIds?: number[];
    bio?: string;
    isActive?: boolean;
}
