import { PrismaService } from '../prisma/prisma.service';
export declare class BookingNotesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    addNote(bookingId: number, noteText: string, actorId?: number): Promise<{
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
    listNotes(bookingId: number): Promise<{
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
}
