import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto, QueryRoomDto, UpdateRoomDto } from './dto/clinic-room.dto';
export declare class ClinicRoomService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateRoomDto, actorId?: number): Promise<{
        success: boolean;
        data: {
            description: string | null;
            name: string;
            id: number;
            isActive: boolean;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            type: string;
            capacity: number;
            facilities: string[];
        };
        message: string;
    }>;
    findAll(query: QueryRoomDto): Promise<{
        success: boolean;
        data: {
            hasBookings: boolean;
            description: string | null;
            name: string;
            id: number;
            isActive: boolean;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            type: string;
            capacity: number;
            facilities: string[];
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
            description: string | null;
            name: string;
            id: number;
            isActive: boolean;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            type: string;
            capacity: number;
            facilities: string[];
        };
    }>;
    update(id: number, dto: UpdateRoomDto, actorId?: number): Promise<{
        success: boolean;
        data: {
            description: string | null;
            name: string;
            id: number;
            isActive: boolean;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            type: string;
            capacity: number;
            facilities: string[];
        };
        message: string;
    }>;
    remove(id: number, actorId?: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
