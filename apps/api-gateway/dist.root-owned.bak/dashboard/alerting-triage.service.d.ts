import { PrismaService } from '../prisma/prisma.service';
import { AlertingTriageUpdateService } from './alerting-triage-update.service';
export declare class AlertingTriageService {
    private readonly prisma;
    private readonly triageUpdate;
    constructor(prisma: PrismaService, triageUpdate: AlertingTriageUpdateService);
    getAlertingTriageRecoveryConfig(): Promise<{
        enabled: boolean;
    }>;
    createAlertDeadLetterTriageAudit(input: Parameters<AlertingTriageUpdateService['createAlertDeadLetterTriageAudit']>[0]): Promise<void>;
    updateAlertingDeadLetterTriage(deliveryId: string, body: Record<string, unknown>, actor: string): Promise<unknown>;
    alertingDeadLetterTriage(query?: Record<string, unknown>): Promise<{
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
}
