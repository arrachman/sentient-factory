import { BadRequestException } from '@nestjs/common';
import {
  isLeafAccountCode,
  normalBalanceForAccountType,
  toBigIntId,
  toOptionalBigIntId,
} from './account-hierarchy';
import { buildAccountCodeFormat } from './account-code-format';

describe('account hierarchy helpers', () => {
  const format = buildAccountCodeFormat([4, 2, 3], '.');

  it('derives normal balance from account type', () => {
    expect(normalBalanceForAccountType('ASSET')).toBe('DEBIT');
    expect(normalBalanceForAccountType('EXPENSE')).toBe('DEBIT');
    expect(normalBalanceForAccountType('LIABILITY')).toBe('CREDIT');
    expect(normalBalanceForAccountType('EQUITY')).toBe('CREDIT');
    expect(normalBalanceForAccountType('REVENUE')).toBe('CREDIT');
  });

  it('detects leaf accounts from the last code segment', () => {
    expect(isLeafAccountCode('1100.00.000', format)).toBe(false);
    expect(isLeafAccountCode('1101.01.001', format)).toBe(true);
  });

  it('supports code formats without separators', () => {
    const compact = buildAccountCodeFormat([1, 2, 3], '');
    expect(isLeafAccountCode('100000', compact)).toBe(false);
    expect(isLeafAccountCode('101001', compact)).toBe(true);
  });

  it('parses numeric string IDs and rejects invalid IDs', () => {
    expect(toBigIntId('123', 'parentId')).toBe(123n);
    expect(toOptionalBigIntId('', 'currencyId')).toBeNull();
    expect(toOptionalBigIntId(undefined, 'currencyId')).toBeUndefined();
    expect(() => toBigIntId('abc', 'parentId')).toThrow(BadRequestException);
  });
});
