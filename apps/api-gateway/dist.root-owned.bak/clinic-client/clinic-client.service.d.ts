import { PrismaService } from '../prisma/prisma.service';
import { ClinicWaService } from '../clinic-wa/clinic-wa.service';
import { CreateClientDto, QueryClientDto, UpdateClientDto, type ClientStatus } from './dto/clinic-client.dto';
type ClientEnriched = {
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
    derivedStatus: ClientStatus;
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
export declare class ClinicClientService {
    private readonly prisma;
    private readonly wa;
    constructor(prisma: PrismaService, wa: ClinicWaService);
    create(dto: CreateClientDto, actorId?: number): Promise<{
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
        data: ClientEnriched[];
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
            derivedStatus: ClientStatus;
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
    update(id: number, dto: UpdateClientDto, actorId?: number): Promise<{
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
    remove(id: number, actorId?: number): Promise<{
        success: boolean;
        message: string;
    }>;
    private deriveCategoryFromAge;
    private enrichBatch;
}
export {};
