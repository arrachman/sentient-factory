import { describe, expect, it } from 'vitest';
import { slugifyCode } from '@/features/master-contact/model/utils';

describe('slugifyCode', () => {
  it('normalizes mixed content to kebab-case id', () => {
    expect(slugifyCode('  PT Sentient Factory 2026!  ')).toBe('pt-sentient-factory-2026');
  });

  it('collapses duplicate separators', () => {
    expect(slugifyCode('A---B    C')).toBe('a-b-c');
  });
});
