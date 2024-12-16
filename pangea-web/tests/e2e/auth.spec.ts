/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await page.route('**/api/v2/**', (route) => route.continue());
    console.log(`Running: ${testInfo.title}`);
    await page.goto('/');
    await page.waitForURL('**/');
  });

  test('Login', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByTestId('signOutButton')).toBeVisible();
  });

  test('Sign Out', async ({ page }) => {
    const signOutButton = page.getByTestId('signOutButton');
    await expect(signOutButton).toBeVisible();
    signOutButton.click();

    await page.goto('/');
    await page.waitForURL('**/login');
    await expect(page).toHaveTitle(/Pangea - Login/gi);
    const loginForm = page.getByTestId('loginForm');
    await expect(loginForm).toBeVisible();
  });
});
