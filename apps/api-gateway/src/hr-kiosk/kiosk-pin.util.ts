/**
 * Kiosk PIN hashing using Node's built-in scrypt (no external dependency).
 * Stored format: `scrypt$<saltHex>$<derivedKeyHex>`. Verification is
 * constant-time via timingSafeEqual. PINs are short shared-device credentials,
 * never logged or returned to the client.
 */
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const KEYLEN = 32;
const SALT_BYTES = 16;

export function hashKioskPin(pin: string): string {
  const salt = randomBytes(SALT_BYTES);
  const derived = scryptSync(pin, salt, KEYLEN);
  return `scrypt$${salt.toString('hex')}$${derived.toString('hex')}`;
}

export function verifyKioskPin(pin: string, stored: string | null | undefined): boolean {
  if (!stored) return false;
  const parts = stored.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const salt = Buffer.from(parts[1], 'hex');
  const expected = Buffer.from(parts[2], 'hex');
  if (salt.length === 0 || expected.length !== KEYLEN) return false;
  const derived = scryptSync(pin, salt, KEYLEN);
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}
