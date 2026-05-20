import { Request } from 'express';
import { DashboardAlertingFacadeService } from './dashboard-alerting-facade.service';
export declare class AlertingOpsController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardAlertingFacadeService);
    alertingAnalytics(): Promise<{
        success: boolean;
        data: {
            summary: {
                total_events: number;
                open_events: number;
                acknowledged_events: number;
                resolved_events: number;
                critical_events: number;
                last_24h_events: number;
            };
            noisy_rules: {
                rule_id: number;
                rule_name: unknown;
                module_key: unknown;
                event_count_24h: number;
                open_count_24h: number;
                last_detected_at: {} | null;
            }[];
            unresolved_by_module: {
                module_key: unknown;
                unresolved_count: number;
            }[];
            rule_effectiveness: {
                rule_id: number;
                rule_name: unknown;
                module_key: unknown;
                total_runs: number;
                successful_runs: number;
                triggered_events: number;
                avg_events_per_run: number;
                total_events: number;
                open_events: number;
                acknowledged_events: number;
                resolved_events: number;
                total_deliveries: number;
                delivered_deliveries: number;
                failed_deliveries: number;
                dead_lettered_deliveries: number;
                acknowledgement_rate: number;
                resolution_rate: number;
                delivery_success_rate: number;
                last_run_at: {} | null;
            }[];
        };
    }>;
    alertingDeliveryObservability(): Promise<{
        success: boolean;
        data: {
            summary: {
                total_logs: number;
                delivered_logs: number;
                queued_logs: number;
                failed_logs: number;
                dead_lettered_logs: number;
                retried_logs: number;
            };
            by_channel: {
                channel_type: unknown;
                total_logs: number;
                delivered_logs: number;
                failed_logs: number;
                queued_logs: number;
            }[];
            top_providers: {
                provider_name: unknown;
                total_logs: number;
                failed_logs: number;
            }[];
            pending_retries: {
                delivery_id: number;
                channel_type: unknown;
                target_value: unknown;
                retry_count: number;
                max_retries: number;
                next_retry_at: {} | null;
            }[];
            dead_letters: {
                delivery_id: number;
                channel_type: unknown;
                target_value: unknown;
                retry_count: number;
                max_retries: number;
                dead_lettered_at: {} | null;
                dead_letter_reason: {} | null;
            }[];
        };
    }>;
    alertingOpsOverview(): Promise<{
        success: boolean;
        data: {
            analytics: Record<string, unknown>;
            delivery_observability: Record<string, unknown>;
            delivery_status: Record<string, unknown>;
            provider_health: Record<string, unknown>;
            triage: {
                summary: Record<string, unknown>;
                policy: Record<string, unknown>;
                audit_summary: Record<string, unknown>;
            };
            highlights: {
                open_events: number;
                dead_lettered_logs: number;
                configured_channels: number;
                dry_run_channels: number;
                overdue_triage_items: number;
            };
        };
    }>;
    alertingDeliveryStatus(): Promise<{
        success: boolean;
        data: {
            scheduler_interval_ms: number;
            delivery_interval_ms: number;
            triage_escalation_interval_ms: number;
            channels: {
                channel_type: string;
                provider_mode: string;
                provider_name: string;
                is_configured: boolean;
            }[];
        };
    }>;
    alertingProviderHealth(): Promise<{
        success: boolean;
        data: {
            smtp: {
                configured: boolean;
                host: string | null;
                port: number | null;
                secure: boolean;
                from: string | null;
                has_auth: boolean;
            };
            baileys: {
                enabled: boolean;
                auth_dir: string | null;
                auth_dir_exists: boolean;
                auth_file_count: number;
                creds_present: boolean;
                session_ready: boolean;
                last_auth_update_at: string | null;
                pairing_required: boolean;
                status_label: string;
            };
            recent_pairing_attempts: {
                audit_id: number;
                provider_name: unknown;
                channel_type: unknown;
                action_type: unknown;
                status: unknown;
                pairing_mode: {} | null;
                phone_number: {} | null;
                auth_dir: {} | null;
                detail_payload: {};
                error_message: {} | null;
                created_by: {} | null;
                created_at: {} | null;
            }[];
            session_states: {
                session_state_id: number;
                provider_name: unknown;
                channel_type: unknown;
                session_key: unknown;
                session_status: unknown;
                pairing_mode: {} | null;
                phone_number: {} | null;
                auth_dir: {} | null;
                status_message: {} | null;
                last_health_check_at: {} | null;
                last_pairing_started_at: {} | null;
                last_pairing_result_at: {} | null;
                last_connected_at: {} | null;
                last_disconnected_at: {} | null;
                detail_payload: {};
                is_active: boolean;
                updated_at: {} | null;
            }[];
        };
    }>;
    alertingBaileysPairing(req: Request & {
        user?: {
            username?: string;
            email?: string;
        };
    }, body: {
        phoneNumber?: string;
        phone_number?: string;
    }): Promise<{
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
