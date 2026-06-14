import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardKpiService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    managerKpis(): Promise<{
        success: boolean;
        data: {
            cards: ({
                title: string;
                subtitle: string;
                value: number;
                unit: string;
                formattedValue: string;
                formula: string;
                numerator?: undefined;
                denominator?: undefined;
                delta?: undefined;
                deltaLabel?: undefined;
            } | {
                title: string;
                subtitle: string;
                value: number;
                unit: string;
                formattedValue: string;
                numerator: number;
                denominator: number;
                delta: number;
                deltaLabel: string;
                formula: string;
            } | {
                title: string;
                subtitle: string;
                value: number;
                unit: string;
                formattedValue: string;
                delta: number;
                deltaLabel: string;
                formula: string;
                numerator?: undefined;
                denominator?: undefined;
            } | {
                title: string;
                subtitle: string;
                value: number;
                unit: string;
                formattedValue: string;
                numerator: number;
                denominator: number;
                formula: string;
                delta?: undefined;
                deltaLabel?: undefined;
            })[];
            breakdown: {
                dataFreshnessByDomain: {
                    domain: string;
                    datasetCount: number;
                    compliantCount: number;
                    compliancePct: number;
                }[];
            };
        };
    }>;
}
