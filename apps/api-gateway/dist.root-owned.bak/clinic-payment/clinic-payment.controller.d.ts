import { Response } from 'express';
import type { AuthRequest } from '../auth/types/auth-request';
import { ClinicPaymentService, type CreatePaymentDto, type RecordPaymentDto } from './clinic-payment.service';
export declare class ClinicPaymentController {
    private readonly service;
    constructor(service: ClinicPaymentService);
    create(dto: CreatePaymentDto, req: AuthRequest): Promise<{
        success: boolean;
        data: {
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            id: number;
            status: string;
            bookingId: number;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            taxAmount: import("@prisma/client/runtime/library").Decimal;
            dpAmount: import("@prisma/client/runtime/library").Decimal;
            paidAmount: import("@prisma/client/runtime/library").Decimal;
            dpPaidAt: Date | null;
            lunasAt: Date | null;
            paymentMethod: string | null;
            receiptUrl: string | null;
            notes: string | null;
        };
        message: string;
    }>;
    record(id: number, dto: RecordPaymentDto, req: AuthRequest): Promise<{
        success: boolean;
        data: {
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            id: number;
            status: string;
            bookingId: number;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            taxAmount: import("@prisma/client/runtime/library").Decimal;
            dpAmount: import("@prisma/client/runtime/library").Decimal;
            paidAmount: import("@prisma/client/runtime/library").Decimal;
            dpPaidAt: Date | null;
            lunasAt: Date | null;
            paymentMethod: string | null;
            receiptUrl: string | null;
            notes: string | null;
        };
        message: string;
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
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            taxAmount: import("@prisma/client/runtime/library").Decimal;
            dpAmount: import("@prisma/client/runtime/library").Decimal;
            paidAmount: import("@prisma/client/runtime/library").Decimal;
            dpPaidAt: Date | null;
            lunasAt: Date | null;
            paymentMethod: string | null;
            receiptUrl: string | null;
            notes: string | null;
        };
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
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            taxAmount: import("@prisma/client/runtime/library").Decimal;
            dpAmount: import("@prisma/client/runtime/library").Decimal;
            paidAmount: import("@prisma/client/runtime/library").Decimal;
            dpPaidAt: Date | null;
            lunasAt: Date | null;
            paymentMethod: string | null;
            receiptUrl: string | null;
            notes: string | null;
        };
    }>;
    receipt(id: number): Promise<string>;
    receiptPdf(id: number, res: Response): Promise<void>;
    sendReceipt(id: number, req: AuthRequest): Promise<{
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
}
