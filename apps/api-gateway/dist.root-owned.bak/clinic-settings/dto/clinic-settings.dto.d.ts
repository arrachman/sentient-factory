export declare class UpdateSettingsDto {
    clinicName?: string;
    address?: string;
    timezone?: string;
    currency?: string;
    slotsOfDay?: Array<{
        start: string;
        end: string;
        label?: string;
    }>;
    closedDayOfWeek?: number[];
    holidays?: string[];
    taxEnabled?: boolean;
    taxPercentage?: number;
    dpPercentage?: number;
    waSendEnabled?: boolean;
    waCountryCode?: string;
}
