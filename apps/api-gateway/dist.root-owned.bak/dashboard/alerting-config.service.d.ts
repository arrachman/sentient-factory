import { PrismaService } from '../prisma/prisma.service';
import { AlertingTemplateService } from './alerting-template.service';
import { AlertingEscalationService } from './alerting-escalation.service';
import { AlertingChannelService } from './alerting-channel.service';
import { AlertingBaileysService } from './alerting-baileys.service';
export declare class AlertingConfigService {
    private readonly prisma;
    private readonly alertingTemplateService;
    private readonly alertingEscalationService;
    private readonly alertingChannelService;
    private readonly alertingBaileysService;
    constructor(prisma: PrismaService, alertingTemplateService: AlertingTemplateService, alertingEscalationService: AlertingEscalationService, alertingChannelService: AlertingChannelService, alertingBaileysService: AlertingBaileysService);
    alertingTemplates(module?: string): Promise<{
        success: boolean;
        data: {
            template_id: number;
            template_key: unknown;
            name: unknown;
            description: {} | null;
            module_key: unknown;
            severity: unknown;
            recommended_channels: never[];
            default_recipients: never[];
            source_type: {} | null;
            source_ref: {} | null;
            schedule_value: {} | null;
            condition_summary: {} | null;
            message_template: {} | null;
            metadata: {};
            is_default: boolean;
            is_active: boolean;
            sort_order: number;
            created_at: unknown;
        }[];
    }>;
    alertingTemplateDetail(templateId: string): Promise<{
        success: boolean;
        data: {
            template_id: number;
            template_key: unknown;
            name: unknown;
            description: {} | null;
            module_key: unknown;
            severity: unknown;
            recommended_channels: never[];
            default_recipients: never[];
            source_type: {} | null;
            source_ref: {} | null;
            schedule_value: {} | null;
            condition_summary: {} | null;
            message_template: {} | null;
            metadata: {};
            is_default: boolean;
            is_active: boolean;
            sort_order: number;
            created_at: unknown;
        };
    }>;
    createAlertingTemplate(body: Record<string, unknown>, actor: string): Promise<{
        success: boolean;
        data: {
            template_id: number;
            template_key: unknown;
            name: unknown;
            description: {} | null;
            module_key: unknown;
            severity: unknown;
            recommended_channels: never[];
            default_recipients: never[];
            source_type: {} | null;
            source_ref: {} | null;
            schedule_value: {} | null;
            condition_summary: {} | null;
            message_template: {} | null;
            metadata: {};
            is_default: boolean;
            is_active: boolean;
            sort_order: number;
            created_at: unknown;
        }[];
    }>;
    updateAlertingTemplate(templateId: string, body: Record<string, unknown>, actor: string): Promise<{
        success: boolean;
        data: {
            template_id: number;
            template_key: unknown;
            name: unknown;
            description: {} | null;
            module_key: unknown;
            severity: unknown;
            recommended_channels: never[];
            default_recipients: never[];
            source_type: {} | null;
            source_ref: {} | null;
            schedule_value: {} | null;
            condition_summary: {} | null;
            message_template: {} | null;
            metadata: {};
            is_default: boolean;
            is_active: boolean;
            sort_order: number;
            created_at: unknown;
        }[];
    }>;
    updateAlertingTemplateState(templateId: string, body: Record<string, unknown>, actor: string): Promise<{
        success: boolean;
        data: {
            template_id: number;
            template_key: unknown;
            name: unknown;
            description: {} | null;
            module_key: unknown;
            severity: unknown;
            recommended_channels: never[];
            default_recipients: never[];
            source_type: {} | null;
            source_ref: {} | null;
            schedule_value: {} | null;
            condition_summary: {} | null;
            message_template: {} | null;
            metadata: {};
            is_default: boolean;
            is_active: boolean;
            sort_order: number;
            created_at: unknown;
        }[];
    }>;
    deleteAlertingTemplate(templateId: string, actor: string): Promise<{
        success: boolean;
        data: {
            template_id: number;
            template_key: unknown;
            name: unknown;
            description: {} | null;
            module_key: unknown;
            severity: unknown;
            recommended_channels: never[];
            default_recipients: never[];
            source_type: {} | null;
            source_ref: {} | null;
            schedule_value: {} | null;
            condition_summary: {} | null;
            message_template: {} | null;
            metadata: {};
            is_default: boolean;
            is_active: boolean;
            sort_order: number;
            created_at: unknown;
        }[];
    }>;
    alertingEscalationPolicies(module?: string, targetType?: string): Promise<{
        success: boolean;
        data: {
            policy_id: number;
            module_key: string;
            escalation_level: string;
            target_type: string;
            target_ref: string;
            priority: number;
            is_active: boolean;
            metadata: {};
            created_at: unknown;
        }[];
    }>;
    createAlertingEscalationPolicy(body: Record<string, unknown>, actor: string): Promise<{
        success: boolean;
        data: {
            policy_id: number;
            module_key: string;
            escalation_level: string;
            target_type: string;
            target_ref: string;
            priority: number;
            is_active: boolean;
            metadata: {};
            created_at: unknown;
        }[];
    }>;
    updateAlertingEscalationPolicy(policyId: string, body: Record<string, unknown>, actor: string): Promise<{
        success: boolean;
        data: {
            policy_id: number;
            module_key: string;
            escalation_level: string;
            target_type: string;
            target_ref: string;
            priority: number;
            is_active: boolean;
            metadata: {};
            created_at: unknown;
        }[];
    }>;
    updateAlertingEscalationPolicyState(policyId: string, body: Record<string, unknown>, actor: string): Promise<{
        success: boolean;
        data: {
            policy_id: number;
            module_key: string;
            escalation_level: string;
            target_type: string;
            target_ref: string;
            priority: number;
            is_active: boolean;
            metadata: {};
            created_at: unknown;
        }[];
    }>;
    deleteAlertingEscalationPolicy(policyId: string, actor: string): Promise<{
        success: boolean;
        data: {
            policy_id: number;
            module_key: string;
            escalation_level: string;
            target_type: string;
            target_ref: string;
            priority: number;
            is_active: boolean;
            metadata: {};
            created_at: unknown;
        }[];
    }>;
    alertingTriageSavedViews(actor: string): Promise<{
        success: boolean;
        data: {
            view_id: number;
            view_key: string;
            name: string;
            owner_actor: string | null;
            is_shared: boolean;
            is_default: boolean;
            filters_json: {};
            sort_by: string;
            sort_order: string;
            metadata: {};
            is_active: boolean;
            created_at: {} | null;
            is_owned_by_current_user: boolean;
        }[];
    }>;
    createAlertingTriageSavedView(body: Record<string, unknown>, actor: string): Promise<{
        success: boolean;
        data: {
            view_id: number;
            view_key: string;
            name: string;
            owner_actor: string | null;
            is_shared: boolean;
            is_default: boolean;
            filters_json: {};
            sort_by: string;
            sort_order: string;
            metadata: {};
            is_active: boolean;
            created_at: {} | null;
            is_owned_by_current_user: boolean;
        }[];
    }>;
    updateAlertingTriageSavedView(viewId: string, body: Record<string, unknown>, actor: string): Promise<{
        success: boolean;
        data: {
            view_id: number;
            view_key: string;
            name: string;
            owner_actor: string | null;
            is_shared: boolean;
            is_default: boolean;
            filters_json: {};
            sort_by: string;
            sort_order: string;
            metadata: {};
            is_active: boolean;
            created_at: {} | null;
            is_owned_by_current_user: boolean;
        }[];
    }>;
    updateAlertingTriageSavedViewState(viewId: string, body: Record<string, unknown>, actor: string): Promise<{
        success: boolean;
        data: {
            view_id: number;
            view_key: string;
            name: string;
            owner_actor: string | null;
            is_shared: boolean;
            is_default: boolean;
            filters_json: {};
            sort_by: string;
            sort_order: string;
            metadata: {};
            is_active: boolean;
            created_at: {} | null;
            is_owned_by_current_user: boolean;
        }[];
    }>;
    deleteAlertingTriageSavedView(viewId: string, actor: string): Promise<{
        success: boolean;
        data: {
            view_id: number;
            view_key: string;
            name: string;
            owner_actor: string | null;
            is_shared: boolean;
            is_default: boolean;
            filters_json: {};
            sort_by: string;
            sort_order: string;
            metadata: {};
            is_active: boolean;
            created_at: {} | null;
            is_owned_by_current_user: boolean;
        }[];
    }>;
    updateAlertingEvent(eventId: string, body: {
        status?: string;
    }, actor: string): Promise<{
        success: boolean;
        data: {
            event_id: number;
            event_key: unknown;
            rule_id: number;
            rule_name: unknown;
            module_key: unknown;
            metric_label: {} | null;
            title: unknown;
            description: unknown;
            severity: unknown;
            status: unknown;
            source_ref: {} | null;
            event_payload: {};
            detected_at: unknown;
            acknowledged_at: unknown;
            resolved_at: unknown;
            deliveries: never[];
        };
    }>;
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
    alertingSettings(): Promise<{
        success: boolean;
        data: {
            setting_id: number;
            setting_key: unknown;
            setting_group: unknown;
            label: unknown;
            value_text: {} | null;
            value_json: {};
            description: {} | null;
            is_active: boolean;
        }[];
    }>;
    updateAlertingSetting(settingKey: string, body: Record<string, unknown>, actor: string): Promise<{
        success: boolean;
        data: {
            setting_id: number;
            setting_key: unknown;
            setting_group: unknown;
            label: unknown;
            value_text: {} | null;
            value_json: {};
            description: {} | null;
            is_active: boolean;
        }[];
    }>;
    alertingBaileysPairing(body: {
        phoneNumber?: string;
        phone_number?: string;
    }, actor: string): Promise<{
        success: boolean;
        data: {
            mode: string;
            pairing_required: boolean;
            message: string;
        };
    } | {
        success: boolean;
        data: {
            mode: "pairing-code" | "qr" | "connected";
            pairing_required: boolean;
            pairing_code?: string;
            qr?: string;
            message: string;
        };
    }>;
}
