export declare const BOOKING_STATUSES: readonly ["checked_in", "in_progress", "completed", "cancelled"];
export type BookingStatus = (typeof BOOKING_STATUSES)[number];
export declare class CreateBookingDto {
    clientId: number;
    serviceId: number;
    psikologUserId: number;
    roomId: number;
    scheduledStart: string;
    scheduledEnd: string;
    sessionN?: number;
    sessionTotal?: number;
    packageGroupId?: string;
    createdViaWalkIn?: boolean;
    notes?: string;
}
declare const UpdateBookingDto_base: import("@nestjs/common").Type<Partial<CreateBookingDto>>;
export declare class UpdateBookingDto extends UpdateBookingDto_base {
}
export declare class RescheduleBookingDto {
    scheduledStart: string;
    scheduledEnd: string;
    roomId?: number;
    psikologUserId?: number;
    reason?: string;
}
export declare class CancelBookingDto {
    reason?: string;
}
export declare class QueryBookingDto {
    page?: number;
    limit?: number;
    status?: BookingStatus;
    date?: string;
    dateFrom?: string;
    dateTo?: string;
    psikologUserId?: number;
    clientId?: number;
    roomId?: number;
    includeCancelled?: boolean;
}
export declare class PackageSessionDto {
    scheduledStart: string;
    scheduledEnd: string;
    psikologUserId?: number;
    roomId?: number;
}
export declare class CreatePackageBookingDto {
    clientId: number;
    serviceId: number;
    psikologUserId: number;
    roomId: number;
    sessions: PackageSessionDto[];
    notes?: string;
}
export {};
