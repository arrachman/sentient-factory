import { describe, it, expect } from 'vitest';
import { asArray } from './hooks';

describe('asArray', () => {
  it('returns a plain array unchanged', () => {
    expect(asArray([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('unwraps a { data } envelope', () => {
    expect(asArray({ data: ['a', 'b'] })).toEqual(['a', 'b']);
  });

  it('returns [] for null/undefined', () => {
    expect(asArray(null)).toEqual([]);
    expect(asArray(undefined)).toEqual([]);
  });

  it('returns [] when { data } is missing', () => {
    expect(asArray({} as { data?: number[] })).toEqual([]);
  });
});
