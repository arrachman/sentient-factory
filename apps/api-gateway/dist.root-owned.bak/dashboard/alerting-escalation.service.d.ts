import { PrismaService } from '../prisma/prisma.service';
import { AlertingTriageViewService } from './alerting-triage-view.service';
export declare class AlertingEscalationService {
    private readonly prisma;
    private readonly alertingTriageViewService;
    constructor(prisma: PrismaService, alertingTriageViewService: AlertingTriageViewService);
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
    validateAlertingEscalationTarget(targetType: string, targetRef: string): Promise<void>;
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
}
