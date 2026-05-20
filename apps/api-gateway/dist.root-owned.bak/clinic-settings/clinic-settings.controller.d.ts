import type { AuthRequest } from '../auth/types/auth-request';
import { ClinicSettingsService } from './clinic-settings.service';
import { UpdateSettingsDto } from './dto/clinic-settings.dto';
export declare class ClinicSettingsController {
    private readonly service;
    constructor(service: ClinicSettingsService);
    get(): Promise<{
        success: boolean;
        data: {
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            address: string | null;
            clinicName: string;
            timezone: string;
            currency: string;
            slotsOfDay: import("@prisma/client/runtime/library").JsonValue;
            closedDayOfWeek: import("@prisma/client/runtime/library").JsonValue;
            holidays: import("@prisma/client/runtime/library").JsonValue;
            taxEnabled: boolean;
            taxPercentage: import("@prisma/client/runtime/library").Decimal;
            dpPercentage: import("@prisma/client/runtime/library").Decimal;
            waSendEnabled: boolean;
            waCountryCode: string;
        };
    }>;
    update(dto: UpdateSettingsDto, req: AuthRequest): Promise<{
        success: boolean;
        data: {
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            address: string | null;
            clinicName: string;
            timezone: string;
            currency: string;
            slotsOfDay: import("@prisma/client/runtime/library").JsonValue;
            closedDayOfWeek: import("@prisma/client/runtime/library").JsonValue;
            holidays: import("@prisma/client/runtime/library").JsonValue;
            taxEnabled: boolean;
            taxPercentage: import("@prisma/client/runtime/library").Decimal;
            dpPercentage: import("@prisma/client/runtime/library").Decimal;
            waSendEnabled: boolean;
            waCountryCode: string;
        };
        message: string;
    }>;
}
