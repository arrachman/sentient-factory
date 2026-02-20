import { beforeEach, describe, expect, it } from 'vitest';
import { buildAuthHeader, clearClientToken, getClientToken, setClientToken } from '@/shared/auth/token.client';

describe('token.client', () => {
  beforeEach(() => {
    clearClientToken();
  });

  it('stores and reads token from cookie', () => {
    setClientToken('my-token');
    expect(getClientToken()).toBe('my-token');
  });

  it('creates auth header when token is provided', () => {
    expect(buildAuthHeader('abc')).toEqual({ Authorization: 'Bearer abc' });
    expect(buildAuthHeader('')).toBeUndefined();
  });
});
