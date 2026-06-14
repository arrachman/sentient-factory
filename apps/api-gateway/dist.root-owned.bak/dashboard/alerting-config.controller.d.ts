import { Request } from 'express';
import { DashboardAlertingFacadeService } from './dashboard-alerting-facade.service';
export declare class AlertingConfigController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardAlertingFacadeService);
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
    createAlertingTemplate(req: Request & {
        user?: {
            username?: string;
            email?: string;
        };
    }, body: Record<string, unknown>): Promise<{
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
    updateAlertingTemplate(templateId: string, req: Request & {
        user?: {
            username?: string;
            email?: string;
        };
    }, body: Record<string, unknown>): Promise<{
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
    updateAlertingTemplateState(templateId: string, req: Request & {
        user?: {
            username?: string;
            email?: string;
        };
    }, body: Record<string, unknown>): Promise<{
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
    deleteAlertingTemplate(templateId: string, req: Request & {
        user?: {
            username?: string;
            email?: string;
        };
    }): Promise<{
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
    createAlertingChannel(req: Request & {
        user?: {
            username?: string;
            email?: string;
        };
    }, body: Record<string, unknown>): Promise<{
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
    updateAlertingChannel(channelId: string, req: Request & {
        user?: {
            username?: string;
            email?: string;
        };
    }, body: Record<string, unknown>): Promise<{
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
    updateAlertingChannelState(channelId: string, req: Request & {
        user?: {
            username?: string;
            email?: string;
        };
    }, body: Record<string, unknown>): Promise<{
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
    deleteAlertingChannel(channelId: string, req: Request & {
        user?: {
            username?: string;
            email?: string;
        };
    }): Promise<{
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
    testAlertingChannel(channelId: string, req: Request & {
        user?: {
            username?: string;
            email?: string;
        };
    }): Promise<{
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
    updateAlertingSetting(settingKey: string, req: Request & {
        user?: {
            username?: string;
            email?: string;
        };
    }, body: Record<string, unknown>): Promise<{
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
    createAlertingEscalationPolicy(req: Request & {
        user?: {
            username?: string;
            email?: string;
        };
    }, body: Record<string, unknown>): Promise<{
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
    updateAlertingEscalationPolicy(policyId: string, req: Request & {
        user?: {
            username?: string;
            email?: string;
        };
    }, body: Record<string, unknown>): Promise<{
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
    updateAlertingEscalationPolicyState(policyId: string, req: Request & {
        user?: {
            username?: string;
            email?: string;
        };
    }, body: Record<string, unknown>): Promise<{
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
    deleteAlertingEscalationPolicy(policyId: string, req: Request & {
        user?: {
            username?: string;
            email?: string;
        };
    }): Promise<{
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
    alertingTriageSavedViews(req: Request & {
        user?: {
            username?: string;
            email?: string;
        };
    }): Promise<{
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
    createAlertingTriageSavedView(req: Request & {
        user?: {
            username?: string;
            email?: string;
        };
    }, body: Record<string, unknown>): Promise<{
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
    updateAlertingTriageSavedView(viewId: string, req: Request & {
        user?: {
            username?: string;
            email?: string;
        };
    }, body: Record<string, unknown>): Promise<{
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
    updateAlertingTriageSavedViewState(viewId: string, req: Request & {
        user?: {
            username?: string;
            email?: string;
        };
    }, body: Record<string, unknown>): Promise<{
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
    deleteAlertingTriageSavedView(viewId: string, req: Request & {
        user?: {
            username?: string;
            email?: string;
        };
    }): Promise<{
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
}
