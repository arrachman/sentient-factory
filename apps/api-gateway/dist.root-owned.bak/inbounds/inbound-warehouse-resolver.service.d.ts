import { PrismaService } from '../prisma/prisma.service';
export declare class InboundWarehouseResolverService {
    private prisma;
    constructor(prisma: PrismaService);
    resolveForActor(actorId?: string | number, requestedWarehouseId?: string): Promise<number>;
    resolveFilterForActor(actorId?: string | number, requestedWarehouseId?: string): Promise<number | undefined>;
    private getActorAccess;
}
