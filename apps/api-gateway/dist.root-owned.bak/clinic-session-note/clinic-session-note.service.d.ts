import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionNoteDto, QuerySessionNoteDto, UpdateSessionNoteDto } from './dto/clinic-session-note.dto';
export declare class ClinicSessionNoteService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateSessionNoteDto, actorId?: number, actorRoles?: string[]): Promise<{
        success: boolean;
        data: {
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            bookingId: number;
            psikologUserId: number;
            noteText: string;
            isPrivate: boolean;
        };
        message: string;
    }>;
    findAll(query: QuerySessionNoteDto, actorId?: number, actorRoles?: string[]): Promise<{
        success: boolean;
        data: {
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            bookingId: number;
            psikologUserId: number;
            noteText: string;
            isPrivate: boolean;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findByBooking(bookingId: number, actorId?: number, actorRoles?: string[]): Promise<{
        success: boolean;
        data: {
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            bookingId: number;
            psikologUserId: number;
            noteText: string;
            isPrivate: boolean;
        }[];
    }>;
    findOne(id: number, actorId?: number, actorRoles?: string[]): Promise<{
        success: boolean;
        data: {
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            bookingId: number;
            psikologUserId: number;
            noteText: string;
            isPrivate: boolean;
        };
    }>;
    update(id: number, dto: UpdateSessionNoteDto, actorId?: number, actorRoles?: string[]): Promise<{
        success: boolean;
        data: {
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            bookingId: number;
            psikologUserId: number;
            noteText: string;
            isPrivate: boolean;
        };
        message: string;
    }>;
    remove(id: number, actorId?: number, actorRoles?: string[]): Promise<{
        success: boolean;
        message: string;
    }>;
}
