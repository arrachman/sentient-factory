import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly service;
    constructor(service: UsersService);
    create(dto: CreateUserDto, req: any): Promise<{
        success: boolean;
        data: {
            warehouseId: number | null;
            warehouseName: string | null;
            roleIds: number[];
            roleId: number | null;
            roles: string[];
            role: string | null;
            email: string;
            username: string;
            fullName: string | null;
            isActive: boolean;
            id: number;
            avatarUrl: string | null;
            lastLogin: Date | null;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
        };
    }>;
    findAll(query: QueryUserDto): Promise<{
        success: boolean;
        data: {
            warehouseId: number | null;
            warehouseName: string | null;
            roleIds: number[];
            roleId: number | null;
            roles: string[];
            role: string | null;
            email: string;
            username: string;
            fullName: string | null;
            isActive: boolean;
            id: number;
            avatarUrl: string | null;
            lastLogin: Date | null;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
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
            warehouseId: number | null;
            warehouseName: string | null;
            roleIds: number[];
            roleId: number | null;
            roles: string[];
            role: string | null;
            email: string;
            username: string;
            fullName: string | null;
            isActive: boolean;
            id: number;
            avatarUrl: string | null;
            lastLogin: Date | null;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
        };
    }>;
    update(id: number, dto: UpdateUserDto, req: any): Promise<{
        success: boolean;
        data: {
            warehouseId: number | null;
            warehouseName: string | null;
            roleIds: number[];
            roleId: number | null;
            roles: string[];
            role: string | null;
            email: string;
            username: string;
            fullName: string | null;
            isActive: boolean;
            id: number;
            avatarUrl: string | null;
            lastLogin: Date | null;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
        };
    }>;
    remove(id: number, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
