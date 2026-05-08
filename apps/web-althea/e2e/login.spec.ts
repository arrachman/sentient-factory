import { expect, test } from '@playwright/test';

/**
 * Slice 0 placeholder e2e — verify dev server load + login page renders.
 * Real login flow tests masuk di slice tersendiri yang implement form login.
 *
 * Skip kalau api-gateway belum siap (E2E_BASE_URL not pointing to live server).
 */

test.describe('login page (Slice 0 smoke)', () => {
  test('loads login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText(/Althea/i).first()).toBeVisible();
  });

  test('redirects unauthenticated user from / to /login', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(/\/login/);
    await expect(page.url()).toContain('/login');
  });
});
