import { expect, test } from '@playwright/test';

/**
 * Slice 1 e2e — admin login → /psikolog → list rendered.
 *
 * Skip kalau api-gateway tidak running (E2E_BASE_URL not pointing to live).
 * Real run: jalankan api-gateway + web-althea dulu.
 */

test.describe('Admin Psikolog page (Slice 1)', () => {
  test('renders psikolog list for admin', async ({ page }) => {
    // Note: ini placeholder. Real e2e butuh login flow ter-implement
    // (Slice tersendiri di luar Slice 1). Untuk sekarang skip kalau tidak ada session.
    test.skip(
      !process.env.E2E_ADMIN_TOKEN,
      'E2E_ADMIN_TOKEN env not set — skip e2e (provide token to run)',
    );

    // Set cookie sf_token sebelum navigate
    if (process.env.E2E_ADMIN_TOKEN) {
      await page.context().addCookies([
        {
          name: 'sf_token',
          value: process.env.E2E_ADMIN_TOKEN,
          domain: 'localhost',
          path: '/',
        },
      ]);
    }

    await page.goto('/psikolog');
    await expect(page.getByRole('heading', { name: 'Psikolog' })).toBeVisible();
    // Header text "Tambah" button
    await expect(page.getByRole('button', { name: /Tambah/i })).toBeVisible();
  });
});
