import { PrismaService } from '../prisma/prisma.service';
import { AlertingDeliveryDispatchService } from './alerting-delivery-dispatch.service';
import { AlertingTriageService } from './alerting-triage.service';
export declare class AlertingDeliveryService {
    private readonly prisma;
    private readonly alertingTriageService;
    private readonly alertingDeliveryDispatchService;
    private readonly logger;
    private alertDeliveryRunning;
    constructor(prisma: PrismaService, alertingTriageService: AlertingTriageService, alertingDeliveryDispatchService: AlertingDeliveryDispatchService);
    runAlertDeliveryCycle(actor?: string): Promise<{
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
    getBaileysHealth(): Promise<{
        enabled: boolean;
        auth_dir: string | null;
        auth_dir_exists: boolean;
        auth_file_count: number;
        creds_present: boolean;
        session_ready: boolean;
        last_auth_update_at: string | null;
        pairing_required: boolean;
        status_label: string;
    }>;
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
    requeueAlertingDeliveryLog(deliveryId: string, actor: string): Promise<{
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
}
