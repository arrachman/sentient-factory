import { expect, test } from '@playwright/test';
import { type Role, isApiReachable, loginAs, setupApiProxy } from './helpers/auth';

/**
 * Smoke test per role: login → dashboard load → no console error → key UI visible.
 * Catches regressions di middleware route guard, role-aware nav, dan dashboard
 * data fetching.
 */

const ROLES: { role: Role; expectText: RegExp }[] = [
  { role: 'admin', expectText: /dashboard|booking|psikolog|client/i },
  { role: 'psikolog', expectText: /dashboard|sesi|jadwal|klien/i },
  { role: 'owner', expectText: /dashboard|kpi|sesi|revenue|utiliz/i },
  { role: 'resepsionis', expectText: /dashboard|menunggu|berlangsung|check/i },
  { role: 'marketing', expectText: /dashboard|layanan|katalog/i },
  { role: 'intern', expectText: /dashboard|intern|akses/i },
];

test.describe('role dashboards (smoke)', () => {
  test.beforeAll(async () => {
    test.skip(!(await isApiReachable()), 'api-gateway not reachable — skip e2e smoke');
  });

  for (const { role, expectText } of ROLES) {
    test(`${role} dashboard loads`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));

      await setupApiProxy(page);
      await loginAs(page, role);
      await page.goto(`/${role}/dashboard`);
      // domcontentloaded (NOT networkidle) — resepsionis dashboard punya SSE
      // connection yang long-lived; networkidle tidak akan pernah trigger.
      await page.waitForLoadState('domcontentloaded', { timeout: 10000 });

      // Wait for h1 dashboard heading (key marker bahwa role-aware shell render)
      await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible({
        timeout: 5000,
      });

      // At least one role-relevant text should be visible
      const body = await page.locator('body').textContent();
      expect(body).toBeTruthy();
      expect(body!).toMatch(expectText);

      // No uncaught page errors
      expect(errors, `pageerrors: ${errors.join(' | ')}`).toHaveLength(0);
    });
  }
});
