import { PrismaService } from '../prisma/prisma.service';
import { AlertingDeliveryService } from './alerting-delivery.service';
import { AlertingTriageService } from './alerting-triage.service';
import { AlertingTriageEscalationResolverService } from './alerting-triage-escalation-resolver.service';
export declare class AlertingTriageEscalationService {
    private readonly prisma;
    private readonly alertingTriageService;
    private readonly alertingDeliveryService;
    private readonly resolver;
    private readonly logger;
    constructor(prisma: PrismaService, alertingTriageService: AlertingTriageService, alertingDeliveryService: AlertingDeliveryService, resolver: AlertingTriageEscalationResolverService);
    runAlertingTriageEscalationCycle(actor?: string): Promise<{
        success: boolean;
        data: {
            processed_item_count: number;
            escalated_count: number;
            skipped: boolean;
            escalation_channel_key: string;
            cooldown_minutes: number;
            delivery_run: {
                processed_delivery_count: number;
                skipped: boolean;
                results: never[];
                actor?: undefined;
            } | {
                processed_delivery_count: number;
                skipped: boolean;
                actor: string;
                results: Record<string, unknown>[];
            } | null;
            results: Record<string, unknown>[];
        };
    }>;
    private getAlertingTriageEscalationConfig;
    private ensureAlertingTriageEscalationRule;
}
