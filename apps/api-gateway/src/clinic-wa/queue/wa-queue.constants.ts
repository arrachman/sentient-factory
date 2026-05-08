export const WA_QUEUE_NAME = 'clinic-wa';

export const WA_JOB_SEND = 'send-message';

export type WaSendJobData = {
  logId: number;
  recipientPhone: string;
  body: string;
  metadata: Record<string, unknown>;
};

export const WA_JOB_DEFAULTS = {
  attempts: 3,
  backoff: { type: 'fixed' as const, delay: 5 * 60 * 1000 },
  removeOnComplete: { age: 7 * 24 * 3600, count: 1000 },
  removeOnFail: { age: 30 * 24 * 3600 },
};
