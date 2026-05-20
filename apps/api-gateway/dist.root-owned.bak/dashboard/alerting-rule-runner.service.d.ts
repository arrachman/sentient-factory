import { PrismaService } from '../prisma/prisma.service';
import { AlertingInsightQueryService } from './alerting-insight-query.service';
export declare class AlertingRuleRunnerService {
    private readonly prisma;
    private readonly alertingInsightQueryService;
    constructor(prisma: PrismaService, alertingInsightQueryService: AlertingInsightQueryService);
    insertAlertingRule(body: Record<string, unknown>, actor: string): Promise<number>;
    applyAlertingRuleUpdate(normalizedRuleId: number, body: Record<string, unknown>, actor: string): Promise<void>;
    runAlertingRule(ruleId: string, actor: string): Promise<{
        success: boolean;
        data: {
            rule_id: number;
            matched_snapshot_id: number | null;
            event: Record<string, unknown> | null;
        };
    }>;
    replaceAlertRuleRecipients(ruleId: number, recipients: unknown[], actor: string): Promise<void>;
    private slugify;
}
