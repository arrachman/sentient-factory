import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class OutboundValidatorsService {
    private prisma;
    constructor(prisma: PrismaService);
    ensureDoNumberAvailable(doNumber: string, exceptId?: number): Promise<void>;
    ensureCustomerExists(customerId: number): Promise<{
        id: number;
        city: string | null;
    }>;
    ensureWarehouseExists(warehouseId: number): Promise<void>;
    resolveDefaultsFromCustomerCity(customerCity?: string): Promise<{
        destinationCityId: number | null;
    }>;
    findCitySlaByCityId(cityId: number): Promise<{
        stdLeadTimeDays: number;
        stdReturnDoDays: number;
    } | null>;
    ensureCityExists(cityId: number): Promise<void>;
    getActiveItems(itemIds: number[]): Promise<Map<number, {
        id: number;
        code: string;
        name: string;
        uomId: number;
        uom: {
            code: string;
        };
    }>>;
    resolveWarehouseForActor(tx: Prisma.TransactionClient, actorId?: string | number): Promise<number | undefined>;
    resolveActorUserId(tx: Prisma.TransactionClient, actorId?: string | number): Promise<number | undefined>;
    parseOptionalActorUserId(actorId?: string | number): number | undefined;
    resolveWarehouseFilterForActor(actorId?: string | number, requestedWarehouseId?: string): Promise<number | undefined>;
    resolveInputWarehouseForActor(actorId?: string | number, requestedWarehouseId?: string, fallbackWarehouseId?: number): Promise<number>;
    getActorWarehouseAccess(actorId?: string | number): Promise<{
        warehouseId: number | null;
        canAccessAllWarehouses: boolean;
    }>;
}
