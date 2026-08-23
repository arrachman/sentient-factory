import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'nuha_session';
const MAX_AGE_SECONDS = 60 * 60 * 8;

export type SessionPayload = {
  userId: string;
  nama: string;
  email: string;
  peran: string[];
};

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET must be set and at least 32 characters long');
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secretKey());

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    // The app is also deployed behind plain HTTP on the LAN/public IP. A Secure
    // cookie is silently rejected there; enable it explicitly when HTTPS is used.
    secure: process.env.AUTH_COOKIE_SECURE === 'true',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function readSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
