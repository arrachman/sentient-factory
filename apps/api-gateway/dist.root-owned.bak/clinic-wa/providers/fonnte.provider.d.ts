import { ConfigService } from '@nestjs/config';
import { DeliveryStatus, SendMessageParams, SendResult, WAProvider } from '../wa.interface';
export declare class FonnteProvider implements WAProvider {
    readonly name = "fonnte";
    private readonly logger;
    private readonly token;
    private readonly apiUrl;
    private readonly deviceId?;
    constructor(config: ConfigService);
    send(params: SendMessageParams): Promise<SendResult>;
    getDeliveryStatus(_messageId: string): Promise<DeliveryStatus | null>;
}
