import { NextRequest, NextResponse } from 'next/server';
import { deflateRawSync } from 'node:zlib';

type ShareLinkRequest = {
  url?: string;
};

function toBase64Url(input: Buffer): string {
  return input
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

function validateUrl(raw: string): URL | null {
  try {
    return new URL(raw);
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const payload = (await request.json().catch(() => null)) as ShareLinkRequest | null;
  const rawUrl = payload?.url?.trim();

  if (!rawUrl) {
    return NextResponse.json({ success: false, message: 'Missing url.' }, { status: 400 });
  }

  const parsed = validateUrl(rawUrl);
  if (!parsed) {
    return NextResponse.json({ success: false, message: 'Invalid url.' }, { status: 400 });
  }

  const requestOrigin = request.nextUrl.origin;
  const publicOrigin = (() => {
    try {
      const url = new URL(requestOrigin);
      if (url.hostname === '0.0.0.0') {
        url.hostname = 'localhost';
      }
      return url.origin;
    } catch {
      return requestOrigin;
    }
  })();
  if (!parsed.pathname.startsWith('/app')) {
    return NextResponse.json({ success: false, message: 'Only /app URLs are allowed.' }, { status: 400 });
  }

  const compactTarget = `${parsed.pathname}${parsed.search}`;
  const compressed = deflateRawSync(Buffer.from(compactTarget, 'utf8'));
  const code = toBase64Url(compressed);
  const shortUrl = `${publicOrigin}/share/${code}`;

  return NextResponse.json({
    success: true,
    data: {
      shortUrl,
      code,
    },
  });
}
