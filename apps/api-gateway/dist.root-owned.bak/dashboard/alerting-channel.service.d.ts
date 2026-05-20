import { PrismaService } from '../prisma/prisma.service';
import { AlertingRuleService } from './alerting-rule.service';
import { AlertingDeliveryService } from './alerting-delivery.service';
import { AlertingProviderSessionService } from './alerting-provider-session.service';
export declare class AlertingChannelService {
    private readonly prisma;
    private readonly alertingRuleService;
    private readonly alertingDeliveryService;
    private readonly alertingProviderSessionService;
    constructor(prisma: PrismaService, alertingRuleService: AlertingRuleService, alertingDeliveryService: AlertingDeliveryService, alertingProviderSessionService: AlertingProviderSessionService);
    alertingChannels(channelType?: string): Promise<{
        success: boolean;
        data: {
            channel_id: number;
            channel_key: unknown;
            channel_type: unknown;
            label: unknown;
            target_value: unknown;
            ownership_type: unknown;
            owner_label: {} | null;
            status: unknown;
            is_active: boolean;
            metadata: {};
            created_at: unknown;
        }[];
    }>;
    validateAlertChannelTarget(channelType: string, targetValue: string): void;
    createAlertingChannel(body: Record<string, unknown>, actor: string): Promise<{
        success: boolean;
        data: {
            channel_id: number;
            channel_key: unknown;
            channel_type: unknown;
            label: unknown;
            target_value: unknown;
            ownership_type: unknown;
            owner_label: {} | null;
            status: unknown;
            is_active: boolean;
            metadata: {};
            created_at: unknown;
        }[];
    }>;
    updateAlertingChannel(channelId: string, body: Record<string, unknown>, actor: string): Promise<{
        success: boolean;
        data: {
            channel_id: number;
            channel_key: unknown;
            channel_type: unknown;
            label: unknown;
            target_value: unknown;
            ownership_type: unknown;
            owner_label: {} | null;
            status: unknown;
            is_active: boolean;
            metadata: {};
            created_at: unknown;
        }[];
    }>;
    updateAlertingChannelState(channelId: string, body: Record<string, unknown>, actor: string): Promise<{
        success: boolean;
        data: {
            channel_id: number;
            channel_key: unknown;
            channel_type: unknown;
            label: unknown;
            target_value: unknown;
            ownership_type: unknown;
            owner_label: {} | null;
            status: unknown;
            is_active: boolean;
            metadata: {};
            created_at: unknown;
        }[];
    }>;
    deleteAlertingChannel(channelId: string, actor: string): Promise<{
        success: boolean;
        data: {
            channel_id: number;
            channel_key: unknown;
            channel_type: unknown;
            label: unknown;
            target_value: unknown;
            ownership_type: unknown;
            owner_label: {} | null;
            status: unknown;
            is_active: boolean;
            metadata: {};
            created_at: unknown;
        }[];
    }>;
    testAlertingChannel(channelId: string, actor: string): Promise<{
        success: boolean;
        data: {
            channel_id: number;
            event_id: number;
            delivery_id: number;
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
            };
        };
    }>;
}
