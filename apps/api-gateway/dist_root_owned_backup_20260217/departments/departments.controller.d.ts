import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { QueryDepartmentDto } from './dto/query-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
export declare class DepartmentsController {
    private readonly service;
    constructor(service: DepartmentsService);
    create(dto: CreateDepartmentDto, req: any): Promise<{
        success: boolean;
        data: {
            parent: {
                name: string;
                code: string;
                id: number;
            } | null;
        } & {
            name: string;
            code: string;
            description: string | null;
            managerId: string | null;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            parentId: number | null;
        };
    }>;
    findAll(query: QueryDepartmentDto): Promise<{
        success: boolean;
        data: ({
            parent: {
                name: string;
                code: string;
                id: number;
            } | null;
        } & {
            name: string;
            code: string;
            description: string | null;
            managerId: string | null;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            parentId: number | null;
        })[];
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
            parent: {
                name: string;
                code: string;
                id: number;
            } | null;
        } & {
            name: string;
            code: string;
            description: string | null;
            managerId: string | null;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            parentId: number | null;
        };
    }>;
    update(id: number, dto: UpdateDepartmentDto, req: any): Promise<{
        success: boolean;
        data: {
            parent: {
                name: string;
                code: string;
                id: number;
            } | null;
        } & {
            name: string;
            code: string;
            description: string | null;
            managerId: string | null;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            parentId: number | null;
        };
    }>;
    remove(id: number, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
