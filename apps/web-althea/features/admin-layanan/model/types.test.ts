import { describe, expect, it } from 'vitest';
import {
  SERVICE_CATEGORIES,
  SERVICE_CATEGORY_LABEL,
  createServiceSchema,
  serviceSchema,
} from './types';

describe('createServiceSchema', () => {
  it('accepts minimal valid input', () => {
    const result = createServiceSchema.safeParse({
      name: 'Konseling Individu',
      category: 'konseling',
      sessionCount: 1,
      durationMinutes: 60,
      basePrice: 500000,
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid category', () => {
    const result = createServiceSchema.safeParse({
      name: 'Test',
      category: 'invalid-category',
      sessionCount: 1,
      durationMinutes: 60,
      basePrice: 500000,
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative price', () => {
    const result = createServiceSchema.safeParse({
      name: 'Test',
      category: 'konseling',
      sessionCount: 1,
      durationMinutes: 60,
      basePrice: -100,
    });
    expect(result.success).toBe(false);
  });

  it('rejects sessionCount < 1', () => {
    const result = createServiceSchema.safeParse({
      name: 'Test',
      category: 'konseling',
      sessionCount: 0,
      durationMinutes: 60,
      basePrice: 500000,
    });
    expect(result.success).toBe(false);
  });

  it('rejects sessionCount > 100', () => {
    const result = createServiceSchema.safeParse({
      name: 'Test',
      category: 'konseling',
      sessionCount: 101,
      durationMinutes: 60,
      basePrice: 500000,
    });
    expect(result.success).toBe(false);
  });

  it('rejects durationMinutes < 15', () => {
    const result = createServiceSchema.safeParse({
      name: 'Test',
      category: 'konseling',
      sessionCount: 1,
      durationMinutes: 10,
      basePrice: 500000,
    });
    expect(result.success).toBe(false);
  });

  it('accepts all 3 service categories', () => {
    for (const cat of SERVICE_CATEGORIES) {
      const result = createServiceSchema.safeParse({
        name: `Test ${cat}`,
        category: cat,
        sessionCount: 1,
        durationMinutes: 60,
        basePrice: 500000,
      });
      expect(result.success).toBe(true);
    }
  });
});

describe('serviceSchema (response)', () => {
  it('parses valid backend response', () => {
    const result = serviceSchema.safeParse({
      id: 1,
      name: 'Konseling Individu',
      category: 'konseling',
      sessionCount: 1,
      durationMinutes: 60,
      basePrice: 500000,
      description: null,
      isActive: true,
      createdAt: '2026-05-08T00:00:00Z',
      updatedAt: '2026-05-08T00:00:00Z',
    });
    expect(result.success).toBe(true);
  });

  it('coerces basePrice from string (Decimal serialized as string)', () => {
    const result = serviceSchema.safeParse({
      id: 1,
      name: 'Test',
      category: 'konseling',
      sessionCount: 1,
      durationMinutes: 60,
      basePrice: '500000.00',
      description: null,
      isActive: true,
      createdAt: '2026-05-08T00:00:00Z',
      updatedAt: '2026-05-08T00:00:00Z',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.basePrice).toBe(500000);
    }
  });
});

describe('SERVICE_CATEGORY_LABEL', () => {
  it('has label for all categories', () => {
    for (const cat of SERVICE_CATEGORIES) {
      expect(SERVICE_CATEGORY_LABEL[cat]).toBeTypeOf('string');
      expect(SERVICE_CATEGORY_LABEL[cat].length).toBeGreaterThan(0);
    }
  });
});
