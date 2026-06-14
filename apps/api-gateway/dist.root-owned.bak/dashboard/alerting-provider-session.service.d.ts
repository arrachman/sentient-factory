import { PrismaService } from '../prisma/prisma.service';
export declare class AlertingProviderSessionService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
