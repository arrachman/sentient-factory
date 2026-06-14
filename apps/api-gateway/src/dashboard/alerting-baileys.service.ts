import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { mkdir } from 'node:fs/promises';
import { AlertingDeliveryDispatchService } from './alerting-delivery-dispatch.service';
import { AlertingProviderSessionService } from './alerting-provider-session.service';

@Injectable()
export class AlertingBaileysService {
  constructor(
    private readonly alertingDeliveryDispatchService: AlertingDeliveryDispatchService,
    private readonly alertingProviderSessionService: AlertingProviderSessionService,
  ) {}

  async alertingBaileysPairing(body: { phoneNumber?: string; phone_number?: string }, actor: string) {
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
      throw new BadRequestException('Baileys is not enabled or auth dir is not configured.');
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

    const baileys = await import('@whiskeysockets/baileys');
    await mkdir(config.authDir, { recursive: true });
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
      const result = await new Promise<{
        mode: 'pairing-code' | 'qr' | 'connected';
        pairing_required: boolean;
        pairing_code?: string;
        qr?: string;
        message: string;
      }>((resolve, reject) => {
        let settled = false;
        const finish = (handler: () => void) => {
          if (settled) return;
          settled = true;
          clearTimeout(timeout);
          handler();
        };

        const timeout = setTimeout(() => {
          finish(() => reject(new Error('Baileys pairing timed out before QR or pairing code was generated.')));
        }, 30000);

        socket.ev.on('connection.update', (update: Record<string, unknown>) => {
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
            .then((code: string) => {
              const normalizedCode = String(code || '').trim();
              if (!normalizedCode) throw new Error('Baileys returned an empty pairing code.');
              finish(() => resolve({
                mode: 'pairing-code', pairing_required: true,
                pairing_code: normalizedCode,
                message: `Use this pairing code for ${requestedPhoneNumber}.`,
              }));
            })
            .catch((error: unknown) => {
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
        detailPayload: result as unknown as Record<string, unknown>,
        lastPairingResultAt: new Date(),
        lastConnectedAt: result.pairing_required ? null : new Date(),
        lastDisconnectedAt: result.pairing_required ? new Date() : null,
        actor,
      });
      return { success: true, data: result };
    } catch (error) {
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
    } finally {
      try { socket.end(undefined); } catch { /* ignore */ }
    }
  }
}
