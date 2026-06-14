import { PrismaService } from '../prisma/prisma.service';
export declare class HealthController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    liveness(): {
        status: string;
        uptime: number;
        timestamp: string;
    };
    readiness(): Promise<{
        status: string;
        checks: {
            database: {
                status: "ok" | "fail";
                error: string | null;
            };
        };
        timestamp: string;
    }>;
}
