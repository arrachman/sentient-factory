/**
 * WhatsApp provider abstraction.
 *
 * Slice 0: only `MockWAProvider` is implemented (no-op for testing).
 * Slice 8: `FonnteProvider` implementation lands; provider can be swapped
 *          via DI without changing callers.
 *
 * See ADR 004 (Fonnte provider decision).
 */

export type WhatsappCategory = 'pengingat' | 'jadwal' | 'onboarding' | 'bayar';
export type DeliveryStatus = 'terkirim' | 'sampai' | 'dibaca' | 'gagal';

export interface SendMessageParams {
  /** Recipient phone in E.164 format (e.g., +6281234567890). */
  toPhone: string;
  /** Template id from clinic_wa_template (or rendered template body). */
  templateId?: string | number;
  /** Pre-rendered message body. If provided, use this instead of templateId. */
  body?: string;
  /** Variables for Mustache-style template rendering when templateId is used. */
  variables?: Record<string, string | number>;
  /** Optional callback URL to receive delivery status updates. */
  callbackUrl?: string;
  /** Free-form metadata to correlate with logs (booking id, etc.). */
  metadata?: Record<string, unknown>;
}

export interface SendResult {
  /** Provider-side message id, used to correlate with delivery webhooks. */
  messageId: string;
  /** Initial status from provider (queued / sent / failed). */
  status: 'queued' | 'sent' | 'failed';
  /** Raw provider response (for debugging / log). */
  providerResponse?: unknown;
  /** Error message if status === 'failed'. */
  errorReason?: string;
}

export interface WAProvider {
  /** Provider name for logging (e.g., 'mock', 'fonnte'). */
  readonly name: string;
  /**
   * Send a single WhatsApp message.
   * Should NOT throw on transient errors — return SendResult with status='failed'.
   * Should throw only for programming errors (invalid params).
   */
  send(params: SendMessageParams): Promise<SendResult>;
  /**
   * Get latest delivery status for a previously-sent message.
   * Optional — providers without polling support can return null.
   */
  getDeliveryStatus(messageId: string): Promise<DeliveryStatus | null>;
}
