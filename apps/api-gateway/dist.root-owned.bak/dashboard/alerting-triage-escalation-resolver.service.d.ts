import { PrismaService } from '../prisma/prisma.service';
export declare class AlertingTriageEscalationResolverService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    resolveAlertingTriageEscalationTargets(escalationChannelKey: string, moduleKey: string | null, escalationLevel: string, assignedTo: string | null, escalationCount: number, severityChanged: boolean): Promise<{
        targets: (Record<string, unknown> & {
            routing_source?: string;
            stage_priority?: number | null;
        })[];
        stage_index: number;
        stage_priority: number;
        has_more_stages: boolean;
        stage_count: number;
        baseline_included: boolean;
        repeating_final_stage: boolean;
    }>;
}
