import { describe, expect, it } from 'vitest';
import {
  BOOKING_STATUSES,
  STATUS_BADGE_CLASS,
  STATUS_LABEL,
  createBookingSchema,
} from './types';

describe('createBookingSchema', () => {
  it('accepts minimal required input', () => {
    const result = createBookingSchema.safeParse({
      clientId: 1,
      serviceId: 1,
      psikologUserId: 147,
      roomId: 1,
      scheduledStart: '2026-05-15T10:00:00Z',
      scheduledEnd: '2026-05-15T11:00:00Z',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing clientId', () => {
    const result = createBookingSchema.safeParse({
      serviceId: 1,
      psikologUserId: 147,
      roomId: 1,
      scheduledStart: '2026-05-15T10:00:00Z',
      scheduledEnd: '2026-05-15T11:00:00Z',
    });
    expect(result.success).toBe(false);
  });

  it('accepts optional bufferOverride flag', () => {
    const result = createBookingSchema.safeParse({
      clientId: 1,
      serviceId: 1,
      psikologUserId: 147,
      roomId: 1,
      scheduledStart: '2026-05-15T10:00:00Z',
      scheduledEnd: '2026-05-15T11:00:00Z',
      bufferOverride: true,
    });
    expect(result.success).toBe(true);
  });

  it('accepts package booking with sessionN/sessionTotal', () => {
    const result = createBookingSchema.safeParse({
      clientId: 1,
      serviceId: 1,
      psikologUserId: 147,
      roomId: 1,
      scheduledStart: '2026-05-15T10:00:00Z',
      scheduledEnd: '2026-05-15T11:00:00Z',
      sessionN: 3,
      sessionTotal: 10,
    });
    expect(result.success).toBe(true);
  });
});

describe('BOOKING_STATUSES', () => {
  it('contains exactly 6 states', () => {
    expect(BOOKING_STATUSES).toHaveLength(6);
  });

  it('every status has label', () => {
    for (const s of BOOKING_STATUSES) {
      expect(STATUS_LABEL[s]).toBeTypeOf('string');
      expect(STATUS_LABEL[s].length).toBeGreaterThan(0);
    }
  });

  it('every status has badge class', () => {
    for (const s of BOOKING_STATUSES) {
      expect(STATUS_BADGE_CLASS[s]).toMatch(/^badge-/);
    }
  });

  it('terminal states distinct from active', () => {
    expect(STATUS_LABEL.completed).toBe('Selesai');
    expect(STATUS_LABEL.cancelled).toBe('Batal');
  });
});
