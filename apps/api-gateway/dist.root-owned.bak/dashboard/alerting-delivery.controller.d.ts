import { Request } from 'express';
import { DashboardAlertingFacadeService } from './dashboard-alerting-facade.service';
export declare class AlertingDeliveryController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardAlertingFacadeService);
    alertingDeliveryLogs(eventId?: string): Promise<{
        success: boolean;
        data: {
            delivery_log_id: number;
            event_id: number;
            event_key: {} | null;
            event_title: {} | null;
            target_label: {} | null;
            channel_type: unknown;
            target_value: unknown;
            provider_key: {} | null;
            external_message_id: {} | null;
            delivery_status: unknown;
            error_message: {} | null;
            retry_count: number;
            max_retries: number;
            next_retry_at: {} | null;
            last_attempt_at: {} | null;
            dead_lettered_at: {} | null;
            dead_letter_reason: {} | null;
            queued_at: unknown;
            sent_at: unknown;
            delivered_at: unknown;
            response_payload: {};
        }[];
    }>;
    requeueAlertingDeliveryLog(deliveryId: string, req: Request & {
        user?: {
            username?: string;
            email?: string;
        };
    }): Promise<{
        success: boolean;
        data: {
            requeued_delivery_id: number;
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
            logs: {
                delivery_log_id: number;
                event_id: number;
                event_key: {} | null;
                event_title: {} | null;
                target_label: {} | null;
                channel_type: unknown;
                target_value: unknown;
                provider_key: {} | null;
                external_message_id: {} | null;
                delivery_status: unknown;
                error_message: {} | null;
                retry_count: number;
                max_retries: number;
                next_retry_at: {} | null;
                last_attempt_at: {} | null;
                dead_lettered_at: {} | null;
                dead_letter_reason: {} | null;
                queued_at: unknown;
                sent_at: unknown;
                delivered_at: unknown;
                response_payload: {};
            }[];
        };
    }>;
    alertingDeadLetterTriage(query: Record<string, unknown>): Promise<{
        success: boolean;
        data: Record<string, unknown>[];
        policy: {
            sla_minutes: number;
            warning_after_minutes: number;
            critical_after_minutes: number;
        };
        summary: {
            total_items: number;
            open_items: number;
            acknowledged_items: number;
            investigating_items: number;
            requeued_items: number;
            resolved_items: number;
            overdue_items: number;
            critical_items: number;
            unassigned_items: number;
            staged_items: number;
            final_stage_items: number;
            pending_next_stage_items: number;
        };
        audit_summary: {
            total_entries: number;
            acknowledge_actions: number;
            unacknowledge_actions: number;
            status_change_actions: number;
            assignment_actions: number;
            note_change_actions: number;
            requeue_actions: number;
            auto_resolve_actions: number;
            latest_action_at: string | null;
            action_breakdown: {
                action_type: string;
                count: number;
            }[];
            top_actors: {
                actor: string;
                action_count: number;
            }[];
            activity_last_7d: {
                date: string;
                count: number;
            }[];
        };
        filter_context: {
            delivery_id: number | null;
            triage_status: string;
            acknowledged: string;
            sla_status: string;
            module_key: string;
            stage: string;
            search: string;
            sort_by: string;
            sort_order: "asc" | "desc";
        };
    }>;
    updateAlertingDeadLetterTriage(deliveryId: string, req: Request & {
        user?: {
            username?: string;
            email?: string;
        };
    }, body: Record<string, unknown>): Promise<unknown>;
    runAlertingSchedulerCycle(req: Request & {
        user?: {
            username?: string;
            email?: string;
        };
    }): Promise<{
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
    runAlertDeliveryCycle(req: Request & {
        user?: {
            username?: string;
            email?: string;
        };
    }): Promise<{
        success: boolean;
        data: {
            processed_delivery_count: number;
            skipped: boolean;
            results: never[];
            actor?: undefined;
        };
    } | {
        success: boolean;
        data: {
            processed_delivery_count: number;
            skipped: boolean;
            actor: string;
            results: Record<string, unknown>[];
        };
    }>;
    runAlertingTriageEscalationCycle(req: Request & {
        user?: {
            username?: string;
            email?: string;
        };
    }): Promise<{
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
}
