import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ClinicWaService } from '../clinic-wa/clinic-wa.service';
export type CreatePaymentDto = {
    bookingId: number;
    totalAmount: number;
    taxAmount?: number;
    dpAmount?: number;
    paymentMethod?: string;
    notes?: string;
};
export type RecordPaymentDto = {
    paidAmount: number;
    paymentMethod?: string;
    notes?: string;
};
export declare class ClinicPaymentService {
    private readonly prisma;
    private readonly wa;
    private readonly logger;
    constructor(prisma: PrismaService, wa: ClinicWaService);
    create(dto: CreatePaymentDto, actorId?: number): Promise<{
        success: boolean;
        data: {
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            id: number;
            status: string;
            bookingId: number;
            totalAmount: Prisma.Decimal;
            taxAmount: Prisma.Decimal;
            dpAmount: Prisma.Decimal;
            paidAmount: Prisma.Decimal;
            dpPaidAt: Date | null;
            lunasAt: Date | null;
            paymentMethod: string | null;
            receiptUrl: string | null;
            notes: string | null;
        };
        message: string;
    }>;
    record(id: number, dto: RecordPaymentDto, actorId?: number): Promise<{
        success: boolean;
        data: {
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            id: number;
            status: string;
            bookingId: number;
            totalAmount: Prisma.Decimal;
            taxAmount: Prisma.Decimal;
            dpAmount: Prisma.Decimal;
            paidAmount: Prisma.Decimal;
            dpPaidAt: Date | null;
            lunasAt: Date | null;
            paymentMethod: string | null;
            receiptUrl: string | null;
            notes: string | null;
        };
        message: string;
    }>;
    refund(id: number, args: {
        amount?: number;
        reason?: string;
        full?: boolean;
    }, actorId?: number): Promise<{
        success: boolean;
        data: {
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            id: number;
            status: string;
            bookingId: number;
            totalAmount: Prisma.Decimal;
            taxAmount: Prisma.Decimal;
            dpAmount: Prisma.Decimal;
            paidAmount: Prisma.Decimal;
            dpPaidAt: Date | null;
            lunasAt: Date | null;
            paymentMethod: string | null;
            receiptUrl: string | null;
            notes: string | null;
        };
        message: string;
    }>;
    findByBooking(bookingId: number): Promise<{
        success: boolean;
        data: {
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            id: number;
            status: string;
            bookingId: number;
            totalAmount: Prisma.Decimal;
            taxAmount: Prisma.Decimal;
            dpAmount: Prisma.Decimal;
            paidAmount: Prisma.Decimal;
            dpPaidAt: Date | null;
            lunasAt: Date | null;
            paymentMethod: string | null;
            receiptUrl: string | null;
            notes: string | null;
        };
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        data: {
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            id: number;
            status: string;
            bookingId: number;
            totalAmount: Prisma.Decimal;
            taxAmount: Prisma.Decimal;
            dpAmount: Prisma.Decimal;
            paidAmount: Prisma.Decimal;
            dpPaidAt: Date | null;
            lunasAt: Date | null;
            paymentMethod: string | null;
            receiptUrl: string | null;
            notes: string | null;
        };
    }>;
    receiptHtml(id: number): Promise<string>;
    receiptPdf(id: number): Promise<Buffer>;
    sendReceiptViaWa(id: number, actorId?: number): Promise<{
        success: boolean;
        data: {
            success: boolean;
            data: {
                logId: number;
                status: string;
                messageId?: undefined;
            };
            message: string;
            paymentId: number;
        } | {
            success: boolean;
            data: {
                logId: number;
                status: string;
                messageId: string;
            };
            message: string | undefined;
            paymentId: number;
        } | {
            success: boolean;
            error: string;
            paymentId: number;
        };
        message: string;
    }>;
    private fetchPaymentWithDetails;
    private formatRupiah;
}
