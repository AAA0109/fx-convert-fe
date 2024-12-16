/* eslint-disable testing-library/prefer-screen-queries */

import test, { expect, Page } from 'playwright/test';

export async function goToBookTransactionPage(page: Page) {
  await test.step('Navigate to Book Transaction Page', async () => {
    await page.goto('/dashboard');
    await page.waitForURL('**/dashboard');
    await expect(page).toHaveURL(/\/dashboard$/);
    await page.getByTestId('manageMoneyButton').click();
    await page.getByRole('menuitem', { name: 'Book Transaction' }).click();
    await page.waitForURL('**/transactions/payments');
    await expect(page).toHaveURL(/\/transactions\/payments$/);
    await expect(
      page.getByRole('heading', { name: 'Book A Transaction' }),
    ).toBeVisible();
  });
}
