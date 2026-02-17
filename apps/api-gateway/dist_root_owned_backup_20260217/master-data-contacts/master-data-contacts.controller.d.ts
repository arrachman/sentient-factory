import { CreateMasterDataContactDto } from './dto/create-master-data-contact.dto';
import { QueryMasterDataContactDto } from './dto/query-master-data-contact.dto';
import { UpdateMasterDataContactDto } from './dto/update-master-data-contact.dto';
import { MasterDataContactsService } from './master-data-contacts.service';
export declare class MasterDataContactsController {
    private readonly service;
    constructor(service: MasterDataContactsService);
    create(dto: CreateMasterDataContactDto, req: any): Promise<{
        success: boolean;
        data: {
            name: string;
            type: string;
            code: string;
            tax: string | null;
            website: string | null;
            address: string | null;
            street: string | null;
            city: string | null;
            province: string | null;
            zipCode: string | null;
            contactFirstName: string | null;
            contactEmail: string | null;
            contactPhone: string | null;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
        };
    }>;
    findAll(query: QueryMasterDataContactDto): Promise<{
        success: boolean;
        data: {
            name: string;
            type: string;
            code: string;
            tax: string | null;
            website: string | null;
            address: string | null;
            street: string | null;
            city: string | null;
            province: string | null;
            zipCode: string | null;
            contactFirstName: string | null;
            contactEmail: string | null;
            contactPhone: string | null;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        data: {
            name: string;
            type: string;
            code: string;
            tax: string | null;
            website: string | null;
            address: string | null;
            street: string | null;
            city: string | null;
            province: string | null;
            zipCode: string | null;
            contactFirstName: string | null;
            contactEmail: string | null;
            contactPhone: string | null;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
        };
    }>;
    update(id: number, dto: UpdateMasterDataContactDto, req: any): Promise<{
        success: boolean;
        data: {
            name: string;
            type: string;
            code: string;
            tax: string | null;
            website: string | null;
            address: string | null;
            street: string | null;
            city: string | null;
            province: string | null;
            zipCode: string | null;
            contactFirstName: string | null;
            contactEmail: string | null;
            contactPhone: string | null;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
        };
    }>;
    remove(id: number, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
