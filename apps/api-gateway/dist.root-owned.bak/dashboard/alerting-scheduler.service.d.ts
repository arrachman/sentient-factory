import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AlertingDeliveryService } from './alerting-delivery.service';
import { AlertingRuleService } from './alerting-rule.service';
import { AlertingTriageEscalationService } from './alerting-triage-escalation.service';
export declare class AlertingSchedulerService implements OnModuleInit, OnModuleDestroy {
    private readonly prisma;
    private readonly alertingDeliveryService;
    private readonly alertingRuleService;
    private readonly alertingTriageEscalationService;
    private readonly logger;
    readonly alertSchedulerIntervalMs: number;
    readonly alertDeliveryIntervalMs: number;
    readonly alertTriageEscalationIntervalMs: number;
    private alertSchedulerTimer;
    private alertDeliveryTimer;
    private alertTriageEscalationTimer;
    private alertSchedulerRunning;
    private alertTriageEscalationRunning;
    constructor(prisma: PrismaService, alertingDeliveryService: AlertingDeliveryService, alertingRuleService: AlertingRuleService, alertingTriageEscalationService: AlertingTriageEscalationService);
    onModuleInit(): void;
    onModuleDestroy(): void;
    private startAlertingScheduler;
    private startAlertDeliveryWorker;
    private startAlertTriageEscalationWorker;
    runAlertingSchedulerCycle(actor?: string): Promise<{
        success: boolean;
        data: {
            processed_rule_count: number;
            skipped: boolean;
            results?: undefined;
        };
    } | {
        success: boolean;
        data: {
            processed_rule_count: number;
            skipped: boolean;
            results: Record<string, unknown>[];
        };
    }>;
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
    } | {
        success: boolean;
        data: {
            processed_item_count: number;
            escalated_count: number;
            skipped: boolean;
            results: never[];
        };
    }>;
    private parseAlertScheduleToMs;
}
