"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FonnteProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FonnteProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const phone_util_1 = require("../../common/utils/phone.util");
let FonnteProvider = FonnteProvider_1 = class FonnteProvider {
    name = 'fonnte';
    logger = new common_1.Logger(FonnteProvider_1.name);
    token;
    apiUrl;
    deviceId;
    constructor(config) {
        this.token = config.get('FONNTE_API_TOKEN') || '';
        this.apiUrl = config.get('FONNTE_API_URL') || 'https://api.fonnte.com';
        this.deviceId = config.get('FONNTE_DEVICE_ID');
        if (!this.token) {
            this.logger.warn('FONNTE_API_TOKEN not set — FonnteProvider akan fail saat send. Set token di .env atau pakai MockWAProvider.');
        }
    }
    async send(params) {
        if (!this.token) {
            return {
                messageId: `fonnte_unconfigured_${Date.now()}`,
                status: 'failed',
                errorReason: 'FONNTE_API_TOKEN not configured',
            };
        }
        const body = params.body || `[template:${params.templateId}]`;
        const targetPhone = (0, phone_util_1.normalizePhoneId)(params.toPhone) ?? params.toPhone;
        const formData = new URLSearchParams();
        formData.set('target', targetPhone);
        formData.set('message', body);
        if (this.deviceId)
            formData.set('device', this.deviceId);
        if (params.callbackUrl)
            formData.set('webhook', params.callbackUrl);
        try {
            const response = await fetch(`${this.apiUrl}/send`, {
                method: 'POST',
                headers: {
                    Authorization: this.token,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            });
            const json = (await response.json());
            if (!response.ok || json.status === false) {
                return {
                    messageId: `fonnte_fail_${Date.now()}`,
                    status: 'failed',
                    errorReason: json.reason || json.detail || `HTTP ${response.status}`,
                    providerResponse: json,
                };
            }
            const rawId = Array.isArray(json.id) ? json.id[0] : json.id;
            const messageId = rawId !== undefined && rawId !== null
                ? String(rawId)
                : `fonnte_${Date.now()}`;
            return {
                messageId,
                status: 'sent',
                providerResponse: json,
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Fonnte send failed: ${message}`);
            return {
                messageId: `fonnte_error_${Date.now()}`,
                status: 'failed',
                errorReason: message,
            };
        }
    }
    async getDeliveryStatus(_messageId) {
        return null;
    }
};
exports.FonnteProvider = FonnteProvider;
exports.FonnteProvider = FonnteProvider = FonnteProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FonnteProvider);
//# sourceMappingURL=fonnte.provider.js.map