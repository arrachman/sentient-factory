import { describe, expect, it } from 'vitest';
import { buildEntityRef, parseEntityRef } from '@/shared/utils/entity-ref';

describe('entity ref', () => {
  it('encodes and decodes stable id', () => {
    const ref = buildEntityRef('abc-123', '2026-02-20T00:00:00.000Z');
    expect(ref).not.toBe('');
    expect(parseEntityRef(ref)).toBe('abc-123');
  });

  it('returns empty string for invalid ref', () => {
    expect(parseEntityRef('invalid..@@')).toBe('');
  });
});
