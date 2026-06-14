import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/clinic-settings.dto';
export declare class ClinicSettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
            slotsOfDay: Prisma.JsonValue;
            closedDayOfWeek: Prisma.JsonValue;
            holidays: Prisma.JsonValue;
            taxEnabled: boolean;
            taxPercentage: Prisma.Decimal;
            dpPercentage: Prisma.Decimal;
            waSendEnabled: boolean;
            waCountryCode: string;
        };
    }>;
    update(dto: UpdateSettingsDto, actorId?: number): Promise<{
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
            slotsOfDay: Prisma.JsonValue;
            closedDayOfWeek: Prisma.JsonValue;
            holidays: Prisma.JsonValue;
            taxEnabled: boolean;
            taxPercentage: Prisma.Decimal;
            dpPercentage: Prisma.Decimal;
            waSendEnabled: boolean;
            waCountryCode: string;
        };
        message: string;
    }>;
}
