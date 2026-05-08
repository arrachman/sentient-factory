import { describe, expect, it } from 'vitest';
import {
  COLOR_PALETTE,
  SPECIALTY_LABEL,
  SPECIALTY_OPTIONS,
  createPsikologSchema,
  psikologSchema,
  updatePsikologSchema,
} from './types';

describe('createPsikologSchema', () => {
  it('accepts minimal valid input (email + fullName)', () => {
    const result = createPsikologSchema.safeParse({
      email: 'farah@althea.local',
      fullName: 'Farah Rahmadhani',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      // Optional fields → undefined (defaults di form-level, bukan schema)
      expect(result.data.specialty).toBeUndefined();
      expect(result.data.defaultSlots).toBeUndefined();
      expect(result.data.isActive).toBeUndefined();
    }
  });

  it('rejects invalid email', () => {
    const result = createPsikologSchema.safeParse({
      email: 'not-an-email',
      fullName: 'Test',
    });
    expect(result.success).toBe(false);
  });

  it('rejects fullName too short', () => {
    const result = createPsikologSchema.safeParse({
      email: 'a@b.co',
      fullName: 'X',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password under 8 chars (when provided)', () => {
    const result = createPsikologSchema.safeParse({
      email: 'a@b.co',
      fullName: 'Foo Bar',
      password: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('allows empty password (will use default at backend)', () => {
    const result = createPsikologSchema.safeParse({
      email: 'a@b.co',
      fullName: 'Foo Bar',
      password: '',
    });
    expect(result.success).toBe(true);
  });

  it('accepts defaultSlots as number', () => {
    const result = createPsikologSchema.safeParse({
      email: 'a@b.co',
      fullName: 'Foo Bar',
      defaultSlots: 6,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.defaultSlots).toBe(6);
    }
  });

  it('rejects specialty array with > 10 entries', () => {
    const result = createPsikologSchema.safeParse({
      email: 'a@b.co',
      fullName: 'Foo Bar',
      specialty: Array.from({ length: 11 }, (_, i) => `s${i}`),
    });
    expect(result.success).toBe(false);
  });
});

describe('updatePsikologSchema', () => {
  it('accepts empty object (semua field optional)', () => {
    const result = updatePsikologSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('accepts partial fields', () => {
    const result = updatePsikologSchema.safeParse({
      title: 'M.Psi',
      isActive: false,
    });
    expect(result.success).toBe(true);
  });

  it('ignores unknown keys (email/username/password omitted from type)', () => {
    // Default zod tidak strip extra keys, parsing success dengan extras ignored.
    const result = updatePsikologSchema.safeParse({
      email: 'cant-update@x.com',
    } as unknown as Parameters<typeof updatePsikologSchema.safeParse>[0]);
    expect(result.success).toBe(true);
  });
});

describe('psikologSchema (response)', () => {
  it('parses valid backend response shape', () => {
    const result = psikologSchema.safeParse({
      id: 1,
      userId: 100,
      email: 'a@b.co',
      username: 'a',
      fullName: 'Person',
      avatarUrl: null,
      isActive: true,
      title: 'M.Psi',
      specialty: ['klinis_dewasa'],
      color: '#5b8a66',
      license: 'SIPP-001',
      defaultSlots: 4,
      bio: null,
      lastLogin: null,
      createdAt: '2026-05-08T00:00:00Z',
      updatedAt: '2026-05-08T00:00:00Z',
    });
    expect(result.success).toBe(true);
  });
});

describe('SPECIALTY constants', () => {
  it('SPECIALTY_OPTIONS contains 7 entries', () => {
    expect(SPECIALTY_OPTIONS).toHaveLength(7);
  });

  it('every option has label', () => {
    for (const opt of SPECIALTY_OPTIONS) {
      expect(SPECIALTY_LABEL[opt]).toBeTypeOf('string');
      expect(SPECIALTY_LABEL[opt].length).toBeGreaterThan(0);
    }
  });
});

describe('COLOR_PALETTE', () => {
  it('contains 7 hex colors', () => {
    expect(COLOR_PALETTE).toHaveLength(7);
    for (const c of COLOR_PALETTE) {
      expect(c).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});
