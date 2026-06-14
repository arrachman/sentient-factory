import { PrismaService } from '../prisma/prisma.service';
export declare class AlertingTriageUpdateService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAlertingTriageRecoveryConfig(): Promise<{
        enabled: boolean;
    }>;
    createAlertDeadLetterTriageAudit(input: {
        deliveryId: number;
        actionType: string;
        previousTriageStatus: string | null;
        nextTriageStatus: string | null;
        previousAcknowledgedAt: string | null;
        nextAcknowledgedAt: string | null;
        previousAssignedTo: string | null;
        nextAssignedTo: string | null;
        noteSnapshot: string | null;
        detailPayload: Record<string, unknown>;
        actor: string;
    }): Promise<void>;
    updateAlertingDeadLetterTriage(deliveryId: string, body: Record<string, unknown>, actor: string, listingFn: () => Promise<unknown>): Promise<unknown>;
    getAlertingTriagePolicy(): Promise<{
        sla_minutes: number;
        warning_after_minutes: number;
        critical_after_minutes: number;
    }>;
}
