import type { BrowserContext, Page } from '@playwright/test';

export const TEST_PASSWORD = process.env.E2E_PASSWORD ?? 'Test1234!';
export const API_URL = process.env.E2E_API_URL ?? 'http://localhost:3203/api';
export const APP_URL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:3202';

export const TEST_USERS = {
  admin: 'admin@althea.local',
  psikolog: 'psikolog@althea.local',
  owner: 'owner@althea.local',
  resepsionis: 'resepsionis@althea.local',
  marketing: 'marketing@althea.local',
  intern: 'intern@althea.local',
} as const;

export type Role = keyof typeof TEST_USERS;

/**
 * Login via api-gateway langsung (bypass UI form), then inject sf_token cookie
 * ke browser context. Ini lebih reliable than form submit karena:
 *   - Tidak depend ke NEXT_PUBLIC_API_URL config (yang relatif `/api` di .env.local)
 *   - Skip render flicker / toast timing
 *   - Cookie domain match localhost / 127.0.0.1 baseURL
 */
export async function loginAs(page: Page, role: Role): Promise<string> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_USERS[role], password: TEST_PASSWORD }),
  });
  if (!res.ok) {
    throw new Error(`Login API ${res.status}: ${await res.text()}`);
  }
  const json = (await res.json()) as { data: { token: string } };
  const token = json.data.token;

  const url = new URL(APP_URL);
  await setAuthCookie(page.context(), token, url.hostname);
  return token;
}

async function setAuthCookie(ctx: BrowserContext, token: string, hostname: string): Promise<void> {
  // Cookie name harus match TOKEN_COOKIE di shared/auth/constants.ts
  await ctx.addCookies([
    {
      name: 'sf_token',
      value: token,
      domain: hostname,
      path: '/',
      sameSite: 'Lax',
      // Max-Age 7 days
      expires: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    },
  ]);
}

/**
 * Skip test kalau api-gateway tidak reachable. Cek via /health endpoint.
 */
export async function isApiReachable(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * In dev environment .env.local sets `NEXT_PUBLIC_API_URL=/api` (relative — expects
 * NPM reverse proxy). E2E runs without NPM, jadi browser fetch ke `/api/*` 404 di
 * Next.js. Helper ini install Playwright route interceptor yang rewrite
 * `${APP_URL}/api/*` → `${API_URL}/*` (api-gateway absolute).
 *
 * Call ini di awal test SEBELUM page navigate.
 */
export async function setupApiProxy(page: Page): Promise<void> {
  // API_URL ends with /api (e.g. http://localhost:3203/api), we want to forward
  // requests to /api/foo (web origin) → API_URL/foo (api-gateway).
  const apiBase = API_URL.replace(/\/api\/?$/, '');
  await page.route('**/api/**', async (route) => {
    const req = route.request();
    const u = new URL(req.url());
    // Rewrite path: /api/auth/login → ${apiBase}/api/auth/login
    const target = `${apiBase}${u.pathname}${u.search}`;
    const headers = { ...req.headers() };
    delete headers.host; // let fetch derive
    try {
      const fetched = await fetch(target, {
        method: req.method(),
        headers,
        body: req.method() === 'GET' || req.method() === 'HEAD' ? undefined : req.postData() ?? undefined,
      });
      const respHeaders: Record<string, string> = {};
      fetched.headers.forEach((v, k) => {
        respHeaders[k] = v;
      });
      await route.fulfill({
        status: fetched.status,
        headers: respHeaders,
        body: Buffer.from(await fetched.arrayBuffer()),
      });
    } catch (err) {
      await route.fulfill({
        status: 502,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'proxy failed', detail: String(err) }),
      });
    }
  });
}
