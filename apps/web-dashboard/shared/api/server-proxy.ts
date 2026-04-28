import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthHeader } from '@/shared/auth/token.server';

const REQUEST_TIMEOUT_MS = 10000;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type ParamsResolver =
  | Record<string, string>
  | Promise<Record<string, string>>
  | undefined;

function getApiBaseUrl() {
  return process.env.API_GATEWAY_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3103';
}

function buildPath(template: string, params?: Record<string, string>) {
  if (!params) {
    return template;
  }

  return Object.entries(params).reduce((acc, [key, value]) => {
    return acc.replaceAll(`:${key}`, encodeURIComponent(value));
  }, template);
}

export async function proxyToApi(
  request: NextRequest,
  method: HttpMethod,
  pathTemplate: string,
  options?: {
    params?: ParamsResolver;
    requireAuth?: boolean;
    passQuery?: boolean;
  },
) {
  const requireAuth = options?.requireAuth ?? true;

  const authHeader = getServerAuthHeader(request);
  if (requireAuth && !authHeader) {
    return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
  }

  const resolvedParams = options?.params ? await options.params : undefined;
  const relativePath = buildPath(pathTemplate, resolvedParams);
  const base = getApiBaseUrl();
  const url = new URL(`${base}${relativePath}`);

  if (options?.passQuery ?? method === 'GET') {
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const body = method === 'GET' || method === 'DELETE' ? undefined : await request.text();

    const response = await fetch(url.toString(), {
      method,
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body,
      signal: controller.signal,
      cache: 'no-store',
    });

    const payload = await response.json().catch(() => null);
    return NextResponse.json(payload ?? { success: false, message: 'Invalid response from API.' }, {
      status: response.status,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return NextResponse.json({ success: false, message: 'Request timeout to API backend.' }, { status: 504 });
    }

    return NextResponse.json({ success: false, message: 'Failed to connect to API backend.' }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}

export function createCollectionProxy(path: string) {
  return {
    GET: (request: NextRequest) => proxyToApi(request, 'GET', path),
    POST: (request: NextRequest) => proxyToApi(request, 'POST', path),
  };
}

export function createEntityProxy(path: string, paramName = 'uuid') {
  async function withParams(context: { params: Promise<Record<string, string>> }) {
    const params = await context.params;
    const key = params[paramName];
    return { [paramName]: key };
  }

  return {
    GET: (request: NextRequest, context: { params: Promise<Record<string, string>> }) =>
      proxyToApi(request, 'GET', path, { params: withParams(context) }),
    POST: (request: NextRequest, context: { params: Promise<Record<string, string>> }) =>
      proxyToApi(request, 'POST', path, { params: withParams(context) }),
    PATCH: (request: NextRequest, context: { params: Promise<Record<string, string>> }) =>
      proxyToApi(request, 'PATCH', path, { params: withParams(context) }),
    PUT: (request: NextRequest, context: { params: Promise<Record<string, string>> }) =>
      proxyToApi(request, 'PUT', path, { params: withParams(context) }),
    DELETE: (request: NextRequest, context: { params: Promise<Record<string, string>> }) =>
      proxyToApi(request, 'DELETE', path, { params: withParams(context) }),
  };
}
