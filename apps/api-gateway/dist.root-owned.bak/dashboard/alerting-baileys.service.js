"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertingBaileysService = void 0;
const common_1 = require("@nestjs/common");
const promises_1 = require("node:fs/promises");
const alerting_delivery_dispatch_service_1 = require("./alerting-delivery-dispatch.service");
const alerting_provider_session_service_1 = require("./alerting-provider-session.service");
let AlertingBaileysService = class AlertingBaileysService {
    alertingDeliveryDispatchService;
    alertingProviderSessionService;
    constructor(alertingDeliveryDispatchService, alertingProviderSessionService) {
        this.alertingDeliveryDispatchService = alertingDeliveryDispatchService;
        this.alertingProviderSessionService = alertingProviderSessionService;
    }
    async alertingBaileysPairing(body, actor) {
        const config = this.alertingDeliveryDispatchService.getBaileysConfig();
        const requestedPhoneNumber = String(body.phoneNumber || body.phone_number || '').replace(/\D/g, '').trim();
        const pairingMode = requestedPhoneNumber ? 'pairing-code' : 'qr';
        if (!config.enabled || !config.authDir) {
            await this.alertingProviderSessionService.createAlertProviderSessionAudit({
                providerName: 'baileys', channelType: 'wa-group', actionType: 'pairing-start',
                status: 'failed', pairingMode, phoneNumber: requestedPhoneNumber || null,
                authDir: config.authDir || null,
                detailPayload: { requested_phone_number: requestedPhoneNumber || null, enabled: config.enabled },
                errorMessage: 'Baileys is not enabled or auth dir is not configured.', actor,
            });
            await this.alertingProviderSessionService.upsertAlertProviderSessionState({
                providerName: 'baileys', channelType: 'wa-group', sessionKey: 'baileys-wa-group',
                sessionStatus: 'disabled', pairingMode, phoneNumber: requestedPhoneNumber || null,
                authDir: config.authDir || null,
                statusMessage: 'Baileys is not enabled or auth dir is not configured.',
                detailPayload: { requested_phone_number: requestedPhoneNumber || null, enabled: config.enabled },
                lastPairingStartedAt: new Date(), lastPairingResultAt: new Date(),
                lastDisconnectedAt: new Date(), actor,
            });
            throw new common_1.BadRequestException('Baileys is not enabled or auth dir is not configured.');
        }
        await this.alertingProviderSessionService.createAlertProviderSessionAudit({
            providerName: 'baileys', channelType: 'wa-group', actionType: 'pairing-start',
            status: 'captured', pairingMode, phoneNumber: requestedPhoneNumber || null,
            authDir: config.authDir || null,
            detailPayload: { requested_phone_number: requestedPhoneNumber || null, enabled: config.enabled },
            actor,
        });
        await this.alertingProviderSessionService.upsertAlertProviderSessionState({
            providerName: 'baileys', channelType: 'wa-group', sessionKey: 'baileys-wa-group',
            sessionStatus: 'pairing-in-progress', pairingMode,
            phoneNumber: requestedPhoneNumber || null, authDir: config.authDir || null,
            statusMessage: 'Baileys pairing flow started.',
            detailPayload: { requested_phone_number: requestedPhoneNumber || null },
            lastPairingStartedAt: new Date(), actor,
        });
        const baileys = await Promise.resolve().then(() => __importStar(require('@whiskeysockets/baileys')));
        await (0, promises_1.mkdir)(config.authDir, { recursive: true });
        const { state, saveCreds } = await baileys.useMultiFileAuthState(config.authDir);
        if (state.creds?.registered) {
            return {
                success: true,
                data: { mode: 'already-registered', pairing_required: false, message: 'Baileys session is already registered.' },
            };
        }
        const socket = baileys.makeWASocket({
            auth: state,
            browser: baileys.Browsers.ubuntu('Sentient Factory Alerting'),
            syncFullHistory: false, markOnlineOnConnect: false, printQRInTerminal: false,
        });
        socket.ev.on('creds.update', saveCreds);
        try {
            const result = await new Promise((resolve, reject) => {
                let settled = false;
                const finish = (handler) => {
                    if (settled)
                        return;
                    settled = true;
                    clearTimeout(timeout);
                    handler();
                };
                const timeout = setTimeout(() => {
                    finish(() => reject(new Error('Baileys pairing timed out before QR or pairing code was generated.')));
                }, 30000);
                socket.ev.on('connection.update', (update) => {
                    const qr = typeof update.qr === 'string' ? update.qr.trim() : '';
                    const connection = String(update.connection || '');
                    if (qr) {
                        finish(() => resolve({ mode: 'qr', pairing_required: true, qr, message: 'Scan the QR token with WhatsApp to complete pairing.' }));
                        return;
                    }
                    if (connection === 'open') {
                        finish(() => resolve({ mode: 'connected', pairing_required: false, message: 'Baileys session connected successfully.' }));
                        return;
                    }
                    if (connection === 'close') {
                        finish(() => reject(new Error('Baileys connection closed before pairing data was generated.')));
                    }
                });
                if (requestedPhoneNumber) {
                    void socket.requestPairingCode(requestedPhoneNumber)
                        .then((code) => {
                        const normalizedCode = String(code || '').trim();
                        if (!normalizedCode)
                            throw new Error('Baileys returned an empty pairing code.');
                        finish(() => resolve({
                            mode: 'pairing-code', pairing_required: true,
                            pairing_code: normalizedCode,
                            message: `Use this pairing code for ${requestedPhoneNumber}.`,
                        }));
                    })
                        .catch((error) => {
                        finish(() => reject(error instanceof Error ? error : new Error('Failed to request Baileys pairing code.')));
                    });
                }
            });
            await this.alertingProviderSessionService.createAlertProviderSessionAudit({
                providerName: 'baileys', channelType: 'wa-group', actionType: 'pairing-result',
                status: result.pairing_required ? 'warning' : 'success',
                pairingMode: result.mode, phoneNumber: requestedPhoneNumber || null,
                authDir: config.authDir || null, detailPayload: result, actor,
            });
            await this.alertingProviderSessionService.upsertAlertProviderSessionState({
                providerName: 'baileys', channelType: 'wa-group', sessionKey: 'baileys-wa-group',
                sessionStatus: result.pairing_required ? 'pairing-required' : 'ready',
                pairingMode: result.mode, phoneNumber: requestedPhoneNumber || null,
                authDir: config.authDir || null, statusMessage: result.message,
                detailPayload: result,
                lastPairingResultAt: new Date(),
                lastConnectedAt: result.pairing_required ? null : new Date(),
                lastDisconnectedAt: result.pairing_required ? new Date() : null,
                actor,
            });
            return { success: true, data: result };
        }
        catch (error) {
            await this.alertingProviderSessionService.createAlertProviderSessionAudit({
                providerName: 'baileys', channelType: 'wa-group', actionType: 'pairing-result',
                status: 'failed', pairingMode, phoneNumber: requestedPhoneNumber || null,
                authDir: config.authDir || null,
                detailPayload: { requested_phone_number: requestedPhoneNumber || null },
                errorMessage: error instanceof Error ? error.message : 'Unknown pairing error.', actor,
            });
            await this.alertingProviderSessionService.upsertAlertProviderSessionState({
                providerName: 'baileys', channelType: 'wa-group', sessionKey: 'baileys-wa-group',
                sessionStatus: 'error', pairingMode, phoneNumber: requestedPhoneNumber || null,
                authDir: config.authDir || null,
                statusMessage: error instanceof Error ? error.message : 'Unknown pairing error.',
                detailPayload: { requested_phone_number: requestedPhoneNumber || null },
                lastPairingResultAt: new Date(), lastDisconnectedAt: new Date(), actor,
            });
            throw error;
        }
        finally {
            try {
                socket.end(undefined);
            }
            catch { }
        }
    }
};
exports.AlertingBaileysService = AlertingBaileysService;
exports.AlertingBaileysService = AlertingBaileysService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [alerting_delivery_dispatch_service_1.AlertingDeliveryDispatchService,
        alerting_provider_session_service_1.AlertingProviderSessionService])
], AlertingBaileysService);
//# sourceMappingURL=alerting-baileys.service.js.map