export declare function deriveUsername(email: string, fullName: string): string;
export declare function userSelect(): {
    select: {
        id: boolean;
        email: boolean;
        username: boolean;
        fullName: boolean;
        avatarUrl: boolean;
        phone: boolean;
        isActive: boolean;
        lastLogin: boolean;
        createdAt: boolean;
    };
};
export declare function mapPsikologToResponse(user: {
    id: number;
    email: string;
    username: string;
    fullName: string | null;
    avatarUrl: string | null;
    phone: string | null;
    isActive: boolean;
    lastLogin: Date | null;
    createdAt: Date;
}, profile: {
    id: number;
    title: string | null;
    specialty: string[];
    color: string | null;
    license: string | null;
    defaultSlots: number;
    weeklyAvailability?: unknown;
    bio: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}, serviceIds?: number[]): {
    id: number;
    userId: number;
    email: string;
    username: string;
    fullName: string | null;
    avatarUrl: string | null;
    phone: string | null;
    isActive: boolean;
    title: string | null;
    specialty: string[];
    color: string | null;
    license: string | null;
    defaultSlots: number;
    weeklyAvailability: Record<string, {
        isOpen: boolean;
        slotIndices?: number[];
    }>;
    serviceIds: number[];
    bio: string | null;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
};
export declare function buildPsikologWhereClause(query: {
    isActive?: boolean;
    specialty?: string;
    search?: string;
}): Record<string, unknown>;
export declare function groupServiceIdsByUser(rows: Array<{
    psikologUserId: number;
    serviceId: number;
}>): Map<number, number[]>;
export declare function validateAvatarUrl(avatarUrl: string | null | undefined): void;
