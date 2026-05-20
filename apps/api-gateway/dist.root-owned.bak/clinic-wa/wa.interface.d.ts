export type WhatsappCategory = 'pengingat' | 'jadwal' | 'onboarding' | 'bayar';
export type DeliveryStatus = 'terkirim' | 'sampai' | 'dibaca' | 'gagal';
export interface SendMessageParams {
    toPhone: string;
    templateId?: string | number;
    body?: string;
    variables?: Record<string, string | number>;
    callbackUrl?: string;
    metadata?: Record<string, unknown>;
}
export interface SendResult {
    messageId: string;
    status: 'queued' | 'sent' | 'failed';
    providerResponse?: unknown;
    errorReason?: string;
}
export interface WAProvider {
    readonly name: string;
    send(params: SendMessageParams): Promise<SendResult>;
    getDeliveryStatus(messageId: string): Promise<DeliveryStatus | null>;
}
