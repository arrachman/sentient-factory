import { AlertingDeliveryDispatchService } from './alerting-delivery-dispatch.service';
import { AlertingProviderSessionService } from './alerting-provider-session.service';
export declare class AlertingBaileysService {
    private readonly alertingDeliveryDispatchService;
    private readonly alertingProviderSessionService;
    constructor(alertingDeliveryDispatchService: AlertingDeliveryDispatchService, alertingProviderSessionService: AlertingProviderSessionService);
    alertingBaileysPairing(body: {
        phoneNumber?: string;
        phone_number?: string;
    }, actor: string): Promise<{
        success: boolean;
        data: {
            mode: string;
            pairing_required: boolean;
            message: string;
        };
    } | {
        success: boolean;
        data: {
            mode: "pairing-code" | "qr" | "connected";
            pairing_required: boolean;
            pairing_code?: string;
            qr?: string;
            message: string;
        };
    }>;
}
