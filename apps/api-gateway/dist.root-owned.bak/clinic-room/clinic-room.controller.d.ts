import type { AuthRequest } from '../auth/types/auth-request';
import { ClinicRoomService } from './clinic-room.service';
import { CreateRoomDto, QueryRoomDto, UpdateRoomDto } from './dto/clinic-room.dto';
export declare class ClinicRoomController {
    private readonly service;
    constructor(service: ClinicRoomService);
    create(dto: CreateRoomDto, req: AuthRequest): Promise<{
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
    update(id: number, dto: UpdateRoomDto, req: AuthRequest): Promise<{
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
    remove(id: number, req: AuthRequest): Promise<{
        success: boolean;
        message: string;
    }>;
}
