import type { AuthRequest } from '../auth/types/auth-request';
import { ClinicClientService } from './clinic-client.service';
import { CreateClientDto, QueryClientDto, UpdateClientDto } from './dto/clinic-client.dto';
export declare class ClinicClientController {
    private readonly service;
    constructor(service: ClinicClientService);
    create(dto: CreateClientDto, req: AuthRequest): Promise<{
        success: boolean;
        data: {
            name: string;
            category: string | null;
            isActive: boolean;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            notes: string | null;
            gender: string;
            age: number | null;
            phoneWa: string;
            medicalRecordNumber: string | null;
            preferredServiceType: string | null;
            email: string | null;
            address: string | null;
            waOptedOut: boolean;
        };
        message: string;
    }>;
    findAll(query: QueryClientDto): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            gender: string;
            age: number | null;
            category: string | null;
            phoneWa: string;
            medicalRecordNumber: string | null;
            preferredServiceType: string | null;
            email: string | null;
            address: string | null;
            notes: string | null;
            waOptedOut: boolean;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            derivedStatus: import("./dto/clinic-client.dto").ClientStatus;
            totalBookings: number;
            lastSession: {
                date: Date;
                serviceName: string | null;
                psikologName: string | null;
            } | null;
            nextSession: {
                date: Date;
                serviceName: string | null;
                psikologName: string | null;
            } | null;
            currentService: {
                name: string;
                psikologName: string | null;
                sessionN: number;
                sessionTotal: number;
            } | null;
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
            recentSessions: {
                id: number;
                date: Date;
                serviceName: string;
                psikologName: string;
                status: string;
            }[];
            id: number;
            name: string;
            gender: string;
            age: number | null;
            category: string | null;
            phoneWa: string;
            medicalRecordNumber: string | null;
            preferredServiceType: string | null;
            email: string | null;
            address: string | null;
            notes: string | null;
            waOptedOut: boolean;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            derivedStatus: import("./dto/clinic-client.dto").ClientStatus;
            totalBookings: number;
            lastSession: {
                date: Date;
                serviceName: string | null;
                psikologName: string | null;
            } | null;
            nextSession: {
                date: Date;
                serviceName: string | null;
                psikologName: string | null;
            } | null;
            currentService: {
                name: string;
                psikologName: string | null;
                sessionN: number;
                sessionTotal: number;
            } | null;
        };
    }>;
    update(id: number, dto: UpdateClientDto, req: AuthRequest): Promise<{
        success: boolean;
        data: {
            name: string;
            category: string | null;
            isActive: boolean;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            notes: string | null;
            gender: string;
            age: number | null;
            phoneWa: string;
            medicalRecordNumber: string | null;
            preferredServiceType: string | null;
            email: string | null;
            address: string | null;
            waOptedOut: boolean;
        };
        message: string;
    }>;
    remove(id: number, req: AuthRequest): Promise<{
        success: boolean;
        message: string;
    }>;
}
