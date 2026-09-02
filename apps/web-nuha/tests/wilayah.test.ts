import { describe, expect, it } from 'vitest';
import { parseIdWilayah } from '@/lib/wilayah';

describe('parseIdWilayah', () => {
  it('mempertahankan bigint di atas batas Number aman', () => {
    expect(parseIdWilayah('9007199254740993')).toBe(9007199254740993n);
  });

  it('menolak ID yang bukan integer positif', () => {
    expect(parseIdWilayah('12.3')).toBeNull();
    expect(parseIdWilayah('-12')).toBeNull();
    expect(parseIdWilayah('desa-12')).toBeNull();
  });
});
