import type { AuthRequest } from '../auth/types/auth-request';
import { ClinicSessionNoteService } from './clinic-session-note.service';
import { CreateSessionNoteDto, QuerySessionNoteDto, UpdateSessionNoteDto } from './dto/clinic-session-note.dto';
export declare class ClinicSessionNoteController {
    private readonly service;
    constructor(service: ClinicSessionNoteService);
    create(dto: CreateSessionNoteDto, req: AuthRequest): Promise<{
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
    findAll(query: QuerySessionNoteDto, req: AuthRequest): Promise<{
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
    findByBooking(bookingId: number, req: AuthRequest): Promise<{
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
    findOne(id: number, req: AuthRequest): Promise<{
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
    update(id: number, dto: UpdateSessionNoteDto, req: AuthRequest): Promise<{
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
    remove(id: number, req: AuthRequest): Promise<{
        success: boolean;
        message: string;
    }>;
}
