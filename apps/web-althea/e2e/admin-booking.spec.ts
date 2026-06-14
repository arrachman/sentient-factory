import { expect, test } from '@playwright/test';
import { isApiReachable, loginAs, setupApiProxy } from './helpers/auth';

/**
 * Smoke admin booking pages — verify navigation + list load.
 * Tidak full happy-path create/cancel (terlalu brittle untuk smoke).
 */

test.describe('admin booking pages (smoke)', () => {
  test.beforeAll(async () => {
    test.skip(!(await isApiReachable()), 'api-gateway not reachable — skip e2e smoke');
  });

  test('booking list loads', async ({ page }) => {
    await setupApiProxy(page);
    await loginAs(page, 'admin');
    await page.goto('/admin/daftar-jadwal');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    // Either bookings ada / "Belum ada booking" message muncul
    const body = await page.locator('body').textContent();
    expect(body).toMatch(/booking|tambah|jadwal/i);
  });

  test('schedule grid loads', async ({ page }) => {
    await setupApiProxy(page);
    await loginAs(page, 'admin');
    await page.goto('/admin/jadwal');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    const body = await page.locator('body').textContent();
    expect(body).toMatch(/jadwal|psikolog|schedule/i);
  });

  test('master data psikolog loads', async ({ page }) => {
    await setupApiProxy(page);
    await loginAs(page, 'admin');
    await page.goto('/admin/psikolog');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: /psikolog/i }).first()).toBeVisible();
  });

  test('clients list loads', async ({ page }) => {
    await setupApiProxy(page);
    await loginAs(page, 'admin');
    await page.goto('/admin/clients');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    const body = await page.locator('body').textContent();
    expect(body).toMatch(/klien|client/i);
  });

  test('WA notif page loads', async ({ page }) => {
    await setupApiProxy(page);
    await loginAs(page, 'admin');
    await page.goto('/admin/notif-wa');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    const body = await page.locator('body').textContent();
    expect(body).toMatch(/whatsapp|template|wa|notif/i);
  });
});
