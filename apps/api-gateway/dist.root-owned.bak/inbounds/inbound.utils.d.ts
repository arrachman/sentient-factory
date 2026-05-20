import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare function parseInboundId(value: string | number, fieldLabel: string): number;
export declare function ensureTransactionNoAvailable(prisma: PrismaService, transactionNo: string, exceptId?: number): Promise<void>;
export declare function resolveTransactionNo(tx: Prisma.TransactionClient, prisma: PrismaService, transactionNo?: string): Promise<string>;
export declare function ensureSupplierExists(prisma: PrismaService, supplierId: number): Promise<void>;
export declare function ensureWarehouseExists(prisma: PrismaService, warehouseId: number): Promise<void>;
export declare function getActiveItems(prisma: PrismaService, itemIds: number[]): Promise<Map<number, {
    id: number;
    code: string;
    name: string;
    uomId: number;
}>>;
