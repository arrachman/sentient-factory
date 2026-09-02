import { describe, expect, it } from 'vitest';
import { parseRegionId } from '@/lib/wilayah';

describe('parseRegionId', () => {
  it('mempertahankan bigint di atas batas Number aman', () => {
    expect(parseRegionId('9007199254740993')).toBe(9007199254740993n);
  });

  it('menolak ID yang bukan integer positif', () => {
    expect(parseRegionId('12.3')).toBeNull();
    expect(parseRegionId('-12')).toBeNull();
    expect(parseRegionId('desa-12')).toBeNull();
  });
});
