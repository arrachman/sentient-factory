import { PrismaService } from '../prisma/prisma.service';
import { AlertingRuleService } from './alerting-rule.service';
export declare class AlertingTemplateService {
    private readonly prisma;
    private readonly alertingRuleService;
    constructor(prisma: PrismaService, alertingRuleService: AlertingRuleService);
    validateAlertTemplateSource(sourceType: string, sourceRef: string): Promise<void>;
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
}
