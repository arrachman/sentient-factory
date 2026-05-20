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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AlertingDeliveryDispatchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertingDeliveryDispatchService = void 0;
const common_1 = require("@nestjs/common");
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
const nodemailer_1 = __importDefault(require("nodemailer"));
let AlertingDeliveryDispatchService = AlertingDeliveryDispatchService_1 = class AlertingDeliveryDispatchService {
    logger = new common_1.Logger(AlertingDeliveryDispatchService_1.name);
    smtpTransporter = null;
    getAlertDeliveryWebhookConfig(channelType) {
        const n = channelType.trim().toLowerCase();
        const map = {
            'wa-group': {
                providerName: 'wa-group-webhook',
                url: process.env.ALERTING_WA_GROUP_WEBHOOK_URL || '',
                token: process.env.ALERTING_WA_GROUP_WEBHOOK_TOKEN || '',
            },
            'wa-personal': {
                providerName: 'wa-personal-webhook',
                url: process.env.ALERTING_WA_PERSONAL_WEBHOOK_URL || '',
                token: process.env.ALERTING_WA_PERSONAL_WEBHOOK_TOKEN || '',
            },
            email: {
                providerName: 'email-webhook',
                url: process.env.ALERTING_EMAIL_WEBHOOK_URL || '',
                token: process.env.ALERTING_EMAIL_WEBHOOK_TOKEN || '',
            },
        };
        return map[n] ?? { providerName: 'unknown-channel', url: '', token: '' };
    }
    getBaileysConfig() {
        const authDir = (process.env.ALERTING_WA_BAILEYS_AUTH_DIR || '').trim();
        const enabled = (process.env.ALERTING_WA_BAILEYS_ENABLED || '').trim().toLowerCase() === 'true';
        return { enabled, authDir: authDir ? node_path_1.default.resolve(authDir) : '' };
    }
    async getBaileysHealth() {
        const config = this.getBaileysConfig();
        const health = {
            enabled: config.enabled,
            auth_dir: config.authDir || null,
            auth_dir_exists: false,
            auth_file_count: 0,
            creds_present: false,
            session_ready: false,
            last_auth_update_at: null,
            pairing_required: false,
            status_label: 'disabled',
        };
        if (!config.enabled) {
            return health;
        }
        if (!config.authDir) {
            return { ...health, pairing_required: true, status_label: 'missing-auth-dir' };
        }
        try {
            await (0, promises_1.access)(config.authDir);
            health.auth_dir_exists = true;
            const fileNames = await (0, promises_1.readdir)(config.authDir).catch(() => []);
            health.auth_file_count = fileNames.length;
            health.creds_present = fileNames.includes('creds.json');
            const stats = await Promise.all(fileNames.map(async (fileName) => {
                try {
                    const fileStat = await (0, promises_1.stat)(node_path_1.default.join(config.authDir, fileName));
                    return fileStat.mtime;
                }
                catch {
                    return null;
                }
            }));
            const latestMtime = stats
                .filter((s) => s instanceof Date)
                .sort((l, r) => r.getTime() - l.getTime())[0];
            health.last_auth_update_at = latestMtime ? latestMtime.toISOString() : null;
            health.session_ready = health.creds_present && health.auth_file_count > 0;
            health.pairing_required = !health.session_ready;
            health.status_label = health.session_ready ? 'ready' : 'pairing-required';
            return health;
        }
        catch {
            return { ...health, pairing_required: true, status_label: 'auth-dir-not-found' };
        }
    }
    getSmtpConfig() {
        const env = process.env;
        const port = Number(env.ALERTING_EMAIL_SMTP_PORT || env.SMTP_PORT || '') || 0;
        const secure = (env.ALERTING_EMAIL_SMTP_SECURE || env.SMTP_SECURE || '').trim().toLowerCase() === 'true' || port === 465;
        return {
            host: (env.ALERTING_EMAIL_SMTP_HOST || env.SMTP_HOST || '').trim(),
            port,
            user: (env.ALERTING_EMAIL_SMTP_USER || env.SMTP_USER || '').trim(),
            pass: (env.ALERTING_EMAIL_SMTP_PASS || env.SMTP_PASS || '').trim(),
            secure,
            from: (env.ALERTING_EMAIL_FROM || env.SMTP_FROM || env.SMTP_USER || '').trim(),
        };
    }
    mapBaileysHealthToSessionStatus(baileys) {
        if (!baileys.enabled) {
            return 'disabled';
        }
        if (baileys.session_ready) {
            return 'ready';
        }
        if (baileys.pairing_required || baileys.status_label === 'pairing-required') {
            return 'pairing-required';
        }
        return 'disconnected';
    }
    async dispatchAlertDelivery(input) {
        if (input.channelType === 'wa-group' || input.channelType === 'wa-personal') {
            const baileysResult = await this.dispatchWhatsAppViaBaileys(input);
            if (baileysResult) {
                return baileysResult;
            }
        }
        if (input.channelType === 'email') {
            const smtpResult = await this.dispatchEmailViaSmtp(input);
            if (smtpResult) {
                return smtpResult;
            }
        }
        const webhookConfig = this.getAlertDeliveryWebhookConfig(input.channelType);
        if (!webhookConfig.url) {
            return {
                providerName: 'dry-run',
                providerMessageId: `dry-${Date.now()}`,
                deliveryStatus: 'delivered',
                responsePayload: {
                    dry_run: true,
                    channel_type: input.channelType,
                    target_value: input.targetValue,
                    event_key: input.eventKey,
                },
            };
        }
        const headers = {
            'Content-Type': 'application/json',
        };
        if (webhookConfig.token) {
            headers.Authorization = `Bearer ${webhookConfig.token}`;
        }
        const response = await fetch(webhookConfig.url, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                channel_type: input.channelType,
                target_value: input.targetValue,
                event_key: input.eventKey,
                event_title: input.eventTitle,
                message: input.message,
                payload: input.eventPayload,
            }),
        });
        const rawText = await response.text();
        let parsedPayload = rawText;
        try {
            parsedPayload = rawText ? JSON.parse(rawText) : {};
        }
        catch {
            parsedPayload = rawText;
        }
        if (!response.ok) {
            throw new Error(`Delivery provider ${webhookConfig.providerName} rejected request with status ${response.status}.`);
        }
        const providerMessageId = parsedPayload && typeof parsedPayload === 'object'
            ? String(parsedPayload.message_id ||
                parsedPayload.id ||
                '').trim() || null
            : null;
        return {
            providerName: webhookConfig.providerName,
            providerMessageId,
            deliveryStatus: 'delivered',
            responsePayload: parsedPayload,
        };
    }
    async dispatchWhatsAppViaBaileys(input) {
        const config = this.getBaileysConfig();
        if (!config.enabled || !config.authDir) {
            return null;
        }
        const jid = this.normalizeWhatsAppJid(input.channelType, input.targetValue);
        const baileys = await Promise.resolve().then(() => __importStar(require('@whiskeysockets/baileys')));
        await (0, promises_1.mkdir)(config.authDir, { recursive: true });
        const { state, saveCreds } = await baileys.useMultiFileAuthState(config.authDir);
        const socket = baileys.makeWASocket({
            auth: state,
            browser: baileys.Browsers.ubuntu('Sentient Factory Alerting'),
            syncFullHistory: false,
            markOnlineOnConnect: false,
            printQRInTerminal: false,
        });
        socket.ev.on('creds.update', saveCreds);
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Baileys connection timed out. Pair the WhatsApp session first.'));
            }, 30000);
            socket.ev.on('connection.update', (update) => {
                const connection = String(update.connection || '');
                if (connection === 'open') {
                    clearTimeout(timeout);
                    resolve();
                    return;
                }
                if (typeof update.qr === 'string' && update.qr.trim()) {
                    this.logger.warn('Baileys session requires QR pairing before WhatsApp delivery can be used.');
                }
                if (connection === 'close') {
                    clearTimeout(timeout);
                    reject(new Error('Baileys connection closed before delivery could be sent.'));
                }
            });
        });
        try {
            const sendResult = await socket.sendMessage(jid, {
                text: [
                    input.message,
                    '',
                    `Event Key: ${input.eventKey}`,
                    `Title: ${input.eventTitle}`,
                ].join('\n'),
            });
            return {
                providerName: 'baileys',
                providerMessageId: String(sendResult?.key?.id || '').trim() || null,
                deliveryStatus: 'delivered',
                responsePayload: {
                    jid,
                    event_key: input.eventKey,
                    message_id: sendResult?.key?.id || null,
                },
            };
        }
        finally {
            try {
                socket.end(undefined);
            }
            catch {
            }
        }
    }
    async dispatchEmailViaSmtp(input) {
        const config = this.getSmtpConfig();
        if (!config.host || !config.port || !config.from) {
            return null;
        }
        const transporter = this.getSmtpTransporter(config);
        const info = await transporter.sendMail({
            from: config.from,
            to: input.targetValue,
            subject: `[Alert] ${input.eventTitle}`.slice(0, 180),
            text: [
                input.message,
                '',
                `Event Key: ${input.eventKey}`,
                `Target: ${input.targetValue}`,
                `Payload: ${JSON.stringify(input.eventPayload, null, 2)}`,
            ].join('\n'),
            html: `
        <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5;">
          <h2 style="margin:0 0 12px;">${this.escapeHtml(input.eventTitle)}</h2>
          <p>${this.escapeHtml(input.message)}</p>
          <p><strong>Event Key:</strong> ${this.escapeHtml(input.eventKey)}</p>
          <pre style="background:#f6f8fa;padding:12px;border-radius:8px;overflow:auto;">${this.escapeHtml(JSON.stringify(input.eventPayload, null, 2))}</pre>
        </div>
      `,
        });
        return {
            providerName: 'smtp',
            providerMessageId: info.messageId || null,
            deliveryStatus: 'delivered',
            responsePayload: {
                accepted: info.accepted,
                rejected: info.rejected,
                response: info.response,
                message_id: info.messageId,
            },
        };
    }
    getSmtpTransporter(config) {
        if (!this.smtpTransporter) {
            this.smtpTransporter = nodemailer_1.default.createTransport({
                host: config.host,
                port: config.port,
                secure: config.secure,
                auth: config.user || config.pass ? { user: config.user, pass: config.pass } : undefined,
            });
        }
        return this.smtpTransporter;
    }
    normalizeWhatsAppJid(channelType, targetValue) {
        const normalizedTarget = targetValue.trim();
        if (!normalizedTarget) {
            throw new common_1.BadRequestException('WhatsApp target value is required.');
        }
        if (channelType === 'wa-group') {
            if (normalizedTarget.includes('@')) {
                return normalizedTarget;
            }
            if (/^\d+-\d+$/.test(normalizedTarget) || /^\d+$/.test(normalizedTarget)) {
                return `${normalizedTarget}@g.us`;
            }
            throw new common_1.BadRequestException('WhatsApp group target must be a valid group JID or numeric group identifier.');
        }
        if (normalizedTarget.includes('@')) {
            return normalizedTarget;
        }
        const digits = normalizedTarget.replace(/\D/g, '');
        if (!digits) {
            throw new common_1.BadRequestException('WhatsApp personal target must be a phone number or WhatsApp JID.');
        }
        return `${digits}@s.whatsapp.net`;
    }
    escapeHtml(value) {
        return value
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }
};
exports.AlertingDeliveryDispatchService = AlertingDeliveryDispatchService;
exports.AlertingDeliveryDispatchService = AlertingDeliveryDispatchService = AlertingDeliveryDispatchService_1 = __decorate([
    (0, common_1.Injectable)()
], AlertingDeliveryDispatchService);
//# sourceMappingURL=alerting-delivery-dispatch.service.js.map