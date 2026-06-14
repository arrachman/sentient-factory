import { QueryErpSettingDto } from './dto/query-erp-setting.dto';
import { UpdateErpSettingDto } from './dto/update-erp-setting.dto';
import { ErpSettingsService } from './erp-settings.service';
export declare class ErpSettingsController {
    private readonly service;
    constructor(service: ErpSettingsService);
    findAll(query: QueryErpSettingDto): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            value: string | null;
            module: string | null;
            key: string;
            sortOrder: number;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            group: string;
            dataType: string;
        }[];
    }>;
    findOne(key: string): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            value: string | null;
            module: string | null;
            key: string;
            sortOrder: number;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            group: string;
            dataType: string;
        };
    }>;
    upsert(key: string, dto: UpdateErpSettingDto, req: any): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            value: string | null;
            module: string | null;
            key: string;
            sortOrder: number;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            group: string;
            dataType: string;
        };
    }>;
}
