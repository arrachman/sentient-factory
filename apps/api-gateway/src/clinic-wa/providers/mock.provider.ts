import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DeliveryStatus, SendMessageParams, SendResult, WAProvider } from '../wa.interface';

/**
 * No-op WA provider for development & testing.
 * Logs the would-be message and returns a fake messageId.
 *
 * Replaced by FonnteProvider in Slice 8 (see ADR 004).
 */
@Injectable()
export class MockWAProvider implements WAProvider {
  readonly name = 'mock';
  private readonly logger = new Logger(MockWAProvider.name);

  async send(params: SendMessageParams): Promise<SendResult> {
    const messageId = `mock_${randomUUID()}`;
    this.logger.log(
      `[MOCK SEND] to=${params.toPhone} body=${this.preview(params.body, params.templateId)} id=${messageId}`,
    );
    return {
      messageId,
      status: 'queued',
      providerResponse: { mock: true },
    };
  }

  async getDeliveryStatus(_messageId: string): Promise<DeliveryStatus | null> {
    // Mock provider can't track deliveries — always return null.
    return null;
  }

  private preview(body?: string, templateId?: string | number): string {
    if (body) {
      return body.length > 60 ? `${body.slice(0, 57)}...` : body;
    }
    if (templateId) {
      return `[template:${templateId}]`;
    }
    return '[empty]';
  }
}
