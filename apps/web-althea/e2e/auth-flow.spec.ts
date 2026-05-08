import { expect, test } from '@playwright/test';
import { API_URL, TEST_USERS, isApiReachable, loginAs, setupApiProxy } from './helpers/auth';

test.describe('auth flow (smoke)', () => {
  test.beforeAll(async () => {
    test.skip(!(await isApiReachable()), 'api-gateway not reachable — skip e2e smoke');
  });

  test('admin login via API + cookie → /admin/dashboard accessible', async ({ page }) => {
    await setupApiProxy(page);
    await loginAs(page, 'admin');
    await page.goto('/admin/dashboard');
    await page.waitForURL(/\/admin\/dashboard/, { timeout: 10000 });
    expect(page.url()).toContain('/admin/dashboard');
  });

  test('wrong password rejected by API', async () => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_USERS.admin, password: 'wrong-password' }),
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  test('unauthenticated / redirects to /login', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(/\/login/, { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });
});
