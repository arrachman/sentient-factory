import { PrismaService } from '../prisma/prisma.service';
export declare class AlertingAnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
}
