import { expect, test } from '@playwright/test';

test('renders delivery dashboard and captures screenshot', async ({ page }, testInfo) => {
  await page.context().addCookies([
    {
      name: 'sf_token',
      value: 'dummy-token',
      domain: '127.0.0.1',
      path: '/',
      httpOnly: false,
      sameSite: 'Lax',
    },
  ]);

  await page.goto('/app/dashboard/delivery');
  await expect(page.getByText('Dashboard Delivery')).toBeVisible();
  await expect(page.getByText('Total Delivery Order', { exact: false }).first()).toBeVisible();
  await expect(page.getByText('Timeseries Delivery Order')).toBeVisible();
  await expect(page.getByText('Lead Time Delivery')).toBeVisible();

  await page.setViewportSize({ width: 1440, height: 2200 });
  await page.screenshot({
    path: testInfo.outputPath('delivery-dashboard-full.png'),
    fullPage: true,
  });
});
