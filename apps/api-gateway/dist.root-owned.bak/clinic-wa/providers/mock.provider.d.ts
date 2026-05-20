import { DeliveryStatus, SendMessageParams, SendResult, WAProvider } from '../wa.interface';
export declare class MockWAProvider implements WAProvider {
    readonly name = "mock";
    private readonly logger;
    send(params: SendMessageParams): Promise<SendResult>;
    getDeliveryStatus(_messageId: string): Promise<DeliveryStatus | null>;
    private preview;
}
