import { NextRequest, NextResponse } from 'next/server';
import { inflateRawSync } from 'node:zlib';

function fromBase64Url(input: string): Buffer {
  const normalized = input.replaceAll('-', '+').replaceAll('_', '/');
  const padded = normalized + '==='.slice((normalized.length + 3) % 4);
  return Buffer.from(padded, 'base64');
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params;

  try {
    const inflated = inflateRawSync(fromBase64Url(code)).toString('utf8');
    const target = inflated.startsWith('/app') ? inflated : '/app';
    const redirectUrl = new URL(target, request.nextUrl.origin);
    return NextResponse.redirect(redirectUrl);
  } catch {
    return NextResponse.redirect(new URL('/app', request.nextUrl.origin));
  }
}
