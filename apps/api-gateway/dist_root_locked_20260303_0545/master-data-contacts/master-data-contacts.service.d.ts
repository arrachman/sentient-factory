import { PrismaService } from '../prisma/prisma.service';
import { CreateMasterDataContactDto } from './dto/create-master-data-contact.dto';
import { QueryMasterDataContactDto } from './dto/query-master-data-contact.dto';
import { UpdateMasterDataContactDto } from './dto/update-master-data-contact.dto';
export declare class MasterDataContactsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateMasterDataContactDto, actorId?: string | number): Promise<{
        success: boolean;
        data: {
            type: string;
            name: string;
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            city: string | null;
            code: string;
            tax: string | null;
            website: string | null;
            address: string | null;
            street: string | null;
            province: string | null;
            zipCode: string | null;
            contactFirstName: string | null;
            contactEmail: string | null;
            contactPhone: string | null;
        };
    }>;
    findAll(query: QueryMasterDataContactDto): Promise<{
        success: boolean;
        data: {
            type: string;
            name: string;
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            city: string | null;
            code: string;
            tax: string | null;
            website: string | null;
            address: string | null;
            street: string | null;
            province: string | null;
            zipCode: string | null;
            contactFirstName: string | null;
            contactEmail: string | null;
            contactPhone: string | null;
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
            type: string;
            name: string;
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            city: string | null;
            code: string;
            tax: string | null;
            website: string | null;
            address: string | null;
            street: string | null;
            province: string | null;
            zipCode: string | null;
            contactFirstName: string | null;
            contactEmail: string | null;
            contactPhone: string | null;
        };
    }>;
    update(id: number, dto: UpdateMasterDataContactDto, actorId?: string | number): Promise<{
        success: boolean;
        data: {
            type: string;
            name: string;
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            city: string | null;
            code: string;
            tax: string | null;
            website: string | null;
            address: string | null;
            street: string | null;
            province: string | null;
            zipCode: string | null;
            contactFirstName: string | null;
            contactEmail: string | null;
            contactPhone: string | null;
        };
    }>;
    remove(id: number, actorId?: string | number): Promise<{
        success: boolean;
        message: string;
    }>;
}
