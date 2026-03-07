import { TOKEN_COOKIE } from '@/shared/auth/constants';

function readCookie(name: string): string {
  if (typeof document === 'undefined') {
    return '';
  }

  const rawValue = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);

  if (!rawValue) {
    return '';
  }

  try {
    return decodeURIComponent(rawValue);
  } catch {
    return rawValue;
  }
}

export function getClientToken(): string {
  return readCookie(TOKEN_COOKIE);
}

export function buildAuthHeader(token?: string): HeadersInit | undefined {
  const resolvedToken = (token?.trim() || getClientToken().trim());
  if (!resolvedToken) {
    return undefined;
  }

  return {
    Authorization: `Bearer ${resolvedToken}`,
  };
}

export function setClientToken(token: string, maxAgeSeconds = 60 * 60 * 24 * 7): void {
  if (typeof document === 'undefined') {
    return;
  }

  const encoded = encodeURIComponent(token);
  document.cookie = `${TOKEN_COOKIE}=${encoded}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
}

export function clearClientToken(): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
