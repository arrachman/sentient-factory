interface DispatchInput {
    channelType: string;
    targetValue: string;
    eventKey: string;
    eventTitle: string;
    message: string;
    eventPayload: Record<string, unknown>;
}
export declare class AlertingDeliveryDispatchService {
    private readonly logger;
    private smtpTransporter;
    getAlertDeliveryWebhookConfig(channelType: string): {
        providerName: string;
        url: string;
        token: string;
    };
    getBaileysConfig(): {
        enabled: boolean;
        authDir: string;
    };
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
    getSmtpConfig(): {
        host: string;
        port: number;
        user: string;
        pass: string;
        secure: boolean;
        from: string;
    };
    mapBaileysHealthToSessionStatus(baileys: {
        enabled: boolean;
        session_ready: boolean;
        pairing_required: boolean;
        status_label: string;
    }): "ready" | "disabled" | "pairing-required" | "disconnected";
    dispatchAlertDelivery(input: DispatchInput): Promise<{
        providerName: string;
        providerMessageId: any;
        deliveryStatus: string;
        responsePayload: {
            accepted: any;
            rejected: any;
            response: any;
            message_id: any;
        };
    } | {
        providerName: string;
        providerMessageId: string | null;
        deliveryStatus: string;
        responsePayload: unknown;
    }>;
    private dispatchWhatsAppViaBaileys;
    private dispatchEmailViaSmtp;
    private getSmtpTransporter;
    private normalizeWhatsAppJid;
    private escapeHtml;
}
export {};
