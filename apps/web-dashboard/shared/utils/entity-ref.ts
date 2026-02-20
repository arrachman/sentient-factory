function toBase64(input: string): string {
  if (typeof window !== 'undefined') {
    return window.btoa(input);
  }

  return Buffer.from(input, 'utf8').toString('base64');
}

function fromBase64(input: string): string {
  if (typeof window !== 'undefined') {
    return window.atob(input);
  }

  return Buffer.from(input, 'base64').toString('utf8');
}

export function toBase64Url(input: string): string {
  const base64 = toBase64(input);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function fromBase64Url(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const paddingLength = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + '='.repeat(paddingLength);
  return fromBase64(padded);
}

export function buildEntityRef(id: string, createdAt?: string | null): string {
  const normalizedId = String(id ?? '').trim();
  if (!normalizedId) {
    return '';
  }

  const millis = createdAt ? Date.parse(createdAt) : NaN;
  const safeMillis = Number.isFinite(millis) ? Math.trunc(millis) : 0;
  return toBase64Url(`${normalizedId}.${safeMillis}`);
}

export function parseEntityRef(ref: string): string {
  const normalizedRef = String(ref ?? '').trim();
  if (!normalizedRef) {
    return '';
  }

  try {
    const decoded = fromBase64Url(normalizedRef);
    const [id] = decoded.split('.', 1);
    return String(id ?? '').trim();
  } catch {
    return '';
  }
}
