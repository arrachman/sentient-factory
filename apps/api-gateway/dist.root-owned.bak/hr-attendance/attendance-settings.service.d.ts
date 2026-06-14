import { PrismaService } from '../prisma/prisma.service';
type AuthUser = {
    id: number;
    roles?: string[];
};
export declare class AttendanceSettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getBooleanSetting(settingGroup: string, settingKey: string, fallback: boolean): Promise<boolean>;
    getNumberSetting(settingGroup: string, settingKey: string, fallback: number): Promise<number>;
    getSettings(authUser: AuthUser): Promise<{
        success: boolean;
        data: {
            autoSubmitEnabled: boolean;
            autoSubmitConfidenceThreshold: number;
            faceIdentifyConfidenceThreshold: number;
            faceVerifyConfidenceThreshold: number;
        };
    }>;
    updateSetting(authUser: AuthUser, settingKey: string, value: string): Promise<{
        success: boolean;
        data: {
            settingKey: string;
            value: string;
        };
    }>;
}
export {};
