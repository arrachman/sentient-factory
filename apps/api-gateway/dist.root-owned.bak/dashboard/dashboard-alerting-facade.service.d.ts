import { AlertingConfigService } from './alerting-config.service';
import { AlertingDeliveryService } from './alerting-delivery.service';
import { AlertingObservabilityService } from './alerting-observability.service';
import { AlertingProviderSessionService } from './alerting-provider-session.service';
import { AlertingRuleService } from './alerting-rule.service';
import { AlertingSchedulerService } from './alerting-scheduler.service';
import { AlertingTriageService } from './alerting-triage.service';
export declare class DashboardAlertingFacadeService {
    private readonly alertingRuleService;
    private readonly alertingConfigService;
    private readonly alertingObservabilityService;
    private readonly alertingSchedulerService;
    private readonly alertingDeliveryService;
    private readonly alertingTriageService;
    private readonly alertingProviderSessionService;
    constructor(alertingRuleService: AlertingRuleService, alertingConfigService: AlertingConfigService, alertingObservabilityService: AlertingObservabilityService, alertingSchedulerService: AlertingSchedulerService, alertingDeliveryService: AlertingDeliveryService, alertingTriageService: AlertingTriageService, alertingProviderSessionService: AlertingProviderSessionService);
    alertingBusinessMetrics(moduleKey?: string): Promise<{
        success: boolean;
        data: {
            metric_id: number;
            metric_key: unknown;
            label: unknown;
            short_label: unknown;
            module_key: unknown;
            description: unknown;
            business_definition: unknown;
            unit: unknown;
            value_type: unknown;
            comparison_type: unknown;
            source_type: unknown;
            source_ref: unknown;
            semantic_ref: unknown;
            system_metric_ref: unknown;
            supported_dimensions: never[];
            default_filters: {};
            tags: never[];
            owner_name: unknown;
            review_status: unknown;
        }[];
    }>;
    alertingSystemMetrics(moduleKey?: string): Promise<{
        success: boolean;
        data: {
            system_metric_id: number;
            metric_key: unknown;
            label: unknown;
            module_key: unknown;
            description: unknown;
            source_table: unknown;
            source_type: unknown;
            resolver_key: unknown;
            aggregation_type: unknown;
            value_type: unknown;
            supported_dimensions: never[];
            supported_filters: never[];
            default_filters: {};
            tags: never[];
            owner_name: unknown;
            review_status: unknown;
        }[];
    }>;
    alertingMetricBuilderContext(moduleKey?: string, metricKey?: string): Promise<{
        success: boolean;
        data: {
            metric_id: number;
            metric_key: unknown;
            label: unknown;
            short_label: unknown;
            module_key: unknown;
            description: unknown;
            business_definition: unknown;
            unit: unknown;
            value_type: unknown;
            comparison_type: unknown;
            semantic_ref: unknown;
            canonical_semantic_key: unknown;
            semantic_label: unknown;
            semantic_entity_key: unknown;
            semantic_measure_key: unknown;
            semantic_definition: unknown;
            semantic_calculation_summary: unknown;
            system_metric_ref: unknown;
            system_metric_label: unknown;
            system_source_table: unknown;
            system_aggregation_type: unknown;
            source_type: unknown;
            source_ref: unknown;
            supported_dimensions: never[];
            default_filters: {};
            tags: never[];
            owner_name: unknown;
            review_status: unknown;
            goal_count: number;
            goals: never[];
            condition_mapping_count: number;
            condition_mappings: never[];
        }[];
    }>;
    alertingInsights(moduleKey?: string, snapshotId?: string): Promise<{
        success: boolean;
        data: {
            snapshot_id: number;
            metric_key: unknown;
            metric_label: unknown;
            module_key: unknown;
            snapshot_at: unknown;
            insight_text: unknown;
            recommendation_preview: unknown;
            anomaly_level: unknown;
            status: unknown;
            is_alert_candidate: boolean;
            current_value: unknown;
            comparison_value: unknown;
            change_pct: unknown;
            trend_label: unknown;
            source_ref: unknown;
            dimensions: {};
            evidence_payload: {};
        }[];
    }>;
    alertingSavedQueries(channel?: string, limit?: string): Promise<{
        success: boolean;
        data: Record<string, unknown>[];
    }>;
    alertingRules(moduleKey?: string): Promise<{
        success: boolean;
        data: {
            rule_id: number;
            rule_key: unknown;
            rule_name: unknown;
            description: unknown;
            module_key: unknown;
            severity: unknown;
            schedule_value: unknown;
            primary_channel: unknown;
            status: unknown;
            is_active: boolean;
            last_run_at: unknown;
            created_at: unknown;
            metric_label: unknown;
            recipients: never[];
        }[];
    }>;
    alertingRuleDetail(ruleId: string): Promise<{
        success: boolean;
        data: {
            rule_id: number;
            rule_key: unknown;
            rule_name: unknown;
            description: unknown;
            module_key: unknown;
            source_type: unknown;
            source_ref: unknown;
            metric_id: number | null;
            system_metric_ref: {} | null;
            semantic_ref: {} | null;
            condition_mapping_id: number | null;
            condition_mapping_key: {} | null;
            condition_operator_key: {} | null;
            comparison_type: {} | null;
            value_type: {} | null;
            schedule_type: unknown;
            schedule_value: unknown;
            severity: unknown;
            primary_channel: unknown;
            condition_summary: {} | null;
            condition_config: {};
            source_context: {};
            message_template: {} | null;
            status: unknown;
            is_active: boolean;
            last_run_at: unknown;
            metric_label: {} | null;
            recent_events: never[];
            run_history: never[];
            recipients: never[];
        };
    }>;
    createAlertingRule(body: Record<string, unknown>, actor: string): Promise<{
        success: boolean;
        data: {
            rule_id: number;
            rule_key: unknown;
            rule_name: unknown;
            description: unknown;
            module_key: unknown;
            source_type: unknown;
            source_ref: unknown;
            metric_id: number | null;
            system_metric_ref: {} | null;
            semantic_ref: {} | null;
            condition_mapping_id: number | null;
            condition_mapping_key: {} | null;
            condition_operator_key: {} | null;
            comparison_type: {} | null;
            value_type: {} | null;
            schedule_type: unknown;
            schedule_value: unknown;
            severity: unknown;
            primary_channel: unknown;
            condition_summary: {} | null;
            condition_config: {};
            source_context: {};
            message_template: {} | null;
            status: unknown;
            is_active: boolean;
            last_run_at: unknown;
            metric_label: {} | null;
            recent_events: never[];
            run_history: never[];
            recipients: never[];
        };
    }>;
    updateAlertingRule(ruleId: string, body: Record<string, unknown>, actor: string): Promise<{
        success: boolean;
        data: {
            rule_id: number;
            rule_key: unknown;
            rule_name: unknown;
            description: unknown;
            module_key: unknown;
            source_type: unknown;
            source_ref: unknown;
            metric_id: number | null;
            system_metric_ref: {} | null;
            semantic_ref: {} | null;
            condition_mapping_id: number | null;
            condition_mapping_key: {} | null;
            condition_operator_key: {} | null;
            comparison_type: {} | null;
            value_type: {} | null;
            schedule_type: unknown;
            schedule_value: unknown;
            severity: unknown;
            primary_channel: unknown;
            condition_summary: {} | null;
            condition_config: {};
            source_context: {};
            message_template: {} | null;
            status: unknown;
            is_active: boolean;
            last_run_at: unknown;
            metric_label: {} | null;
            recent_events: never[];
            run_history: never[];
            recipients: never[];
        };
    }>;
    updateAlertingRuleState(ruleId: string, body: Record<string, unknown>, actor: string): Promise<{
        success: boolean;
        data: {
            rule_id: number;
            rule_key: unknown;
            rule_name: unknown;
            description: unknown;
            module_key: unknown;
            severity: unknown;
            schedule_value: unknown;
            primary_channel: unknown;
            status: unknown;
            is_active: boolean;
            last_run_at: unknown;
            created_at: unknown;
            metric_label: unknown;
            recipients: never[];
        }[];
    }>;
    deleteAlertingRule(ruleId: string, actor: string): Promise<{
        success: boolean;
        data: {
            rule_id: number;
            rule_key: unknown;
            rule_name: unknown;
            description: unknown;
            module_key: unknown;
            severity: unknown;
            schedule_value: unknown;
            primary_channel: unknown;
            status: unknown;
            is_active: boolean;
            last_run_at: unknown;
            created_at: unknown;
            metric_label: unknown;
            recipients: never[];
        }[];
    }>;
    runAlertingRule(ruleId: string, actor: string): Promise<{
        success: boolean;
        data: {
            rule_id: number;
            matched_snapshot_id: number | null;
            event: Record<string, unknown> | null;
        };
    }>;
    alertingEvents(moduleKey?: string, eventId?: string): Promise<{
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
    updateAlertingDeadLetterTriage(deliveryId: string, body: Record<string, unknown>, actor: string): Promise<unknown>;
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
    ensureAlertingTestRule(actor: string): Promise<{
        rule_id: number;
        rule_key: string;
    }>;
    createAlertProviderSessionAudit(input: {
        providerName: string;
        channelType: 'wa-group' | 'wa-personal' | 'email';
        actionType: 'health-check' | 'pairing-start' | 'pairing-result' | 'session-refresh';
        status: 'captured' | 'success' | 'failed' | 'warning';
        pairingMode?: string | null;
        phoneNumber?: string | null;
        authDir?: string | null;
        detailPayload?: Record<string, unknown>;
        errorMessage?: string | null;
        actor: string;
    }): Promise<void>;
    upsertAlertProviderSessionState(input: {
        providerName: string;
        channelType: 'wa-group' | 'wa-personal' | 'email';
        sessionKey: string;
        sessionStatus: 'disabled' | 'disconnected' | 'pairing-required' | 'pairing-in-progress' | 'ready' | 'connected' | 'error';
        pairingMode?: string | null;
        phoneNumber?: string | null;
        authDir?: string | null;
        statusMessage?: string | null;
        detailPayload?: Record<string, unknown>;
        lastHealthCheckAt?: Date | null;
        lastPairingStartedAt?: Date | null;
        lastPairingResultAt?: Date | null;
        lastConnectedAt?: Date | null;
        lastDisconnectedAt?: Date | null;
        actor: string;
    }): Promise<void>;
}
