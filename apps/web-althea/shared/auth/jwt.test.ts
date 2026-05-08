import { describe, expect, it } from 'vitest';
import { decodeJwtPayload, extractRoleFromToken } from './jwt';

/**
 * Helper: bikin JWT dummy dengan payload tertentu (no signature verification needed).
 */
function makeJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  const body = btoa(JSON.stringify(payload))
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${header}.${body}.fake-signature`;
}

describe('decodeJwtPayload', () => {
  it('decodes a valid JWT body', () => {
    const token = makeJwt({ sub: 1, roles: ['clinic-admin'] });
    const payload = decodeJwtPayload<{ sub: number; roles: string[] }>(token);
    expect(payload).toEqual({ sub: 1, roles: ['clinic-admin'] });
  });

  it('returns null for malformed tokens', () => {
    expect(decodeJwtPayload('not.a.jwt.at.all')).toBeNull();
    expect(decodeJwtPayload('')).toBeNull();
    expect(decodeJwtPayload('only.two')).toBeNull();
  });
});

describe('extractRoleFromToken', () => {
  it('returns null when token is undefined', () => {
    expect(extractRoleFromToken(undefined)).toBeNull();
  });

  it('returns clinic role when present in roles claim', () => {
    const token = makeJwt({ roles: ['clinic-psikolog'] });
    expect(extractRoleFromToken(token)).toBe('clinic-psikolog');
  });

  it('picks first clinic-* role when user has multiple roles', () => {
    const token = makeJwt({ roles: ['admin', 'clinic-owner', 'clinic-marketing'] });
    expect(extractRoleFromToken(token)).toBe('clinic-owner');
  });

  it('returns null when user has only non-clinic roles (ERP-only user)', () => {
    const token = makeJwt({ roles: ['admin', 'manager', 'user'] });
    expect(extractRoleFromToken(token)).toBeNull();
  });

  it('returns null when roles claim is missing', () => {
    const token = makeJwt({ sub: 1 });
    expect(extractRoleFromToken(token)).toBeNull();
  });

  it('returns null when roles claim is not an array', () => {
    const token = makeJwt({ roles: 'clinic-admin' });
    expect(extractRoleFromToken(token)).toBeNull();
  });

  it('handles all 6 clinic roles', () => {
    const allRoles = [
      'clinic-admin',
      'clinic-psikolog',
      'clinic-owner',
      'clinic-resepsionis',
      'clinic-marketing',
      'clinic-intern',
    ];
    for (const role of allRoles) {
      const token = makeJwt({ roles: [role] });
      expect(extractRoleFromToken(token)).toBe(role);
    }
  });
});
