/* eslint-disable testing-library/prefer-screen-queries */
import { config } from 'dotenv';
import fs from 'fs';
import {
  PangeaMarketLiquidityInsight,
  PangeaMarketsLiquidityResponse,
} from 'lib';
import { chromium, expect, FullConfig, Page } from 'playwright/test';
import { env } from 'process';
import { CCY_RANKS, NO_WALLET_CURRENCY } from './utils/constants';

config({ path: './.env.local' });

const IBRK_USERNAME = env.IBRK_TEST_USERNAME ?? '';
const IBRK_PASSWORD = env.IBRK_TEST_PASSWORD ?? '';
const PANGEA_BASE_URL =
  env.NEXT_PUBLIC_PANGEA_API_URL ||
  (env.NODE_ENV === 'production'
    ? 'https://api.internal.pangea.io'
    : 'https://api.internal.dev.pangea.io');

async function globalSetup(config: FullConfig) {
  console.log('Running Global Setup');

  await Promise.all([getMarketData(), loginUser(config)]);

  console.log('Global Setup Completed');
}

async function loginUser(config: FullConfig): Promise<void> {
  console.log('Logging In User');

  const { baseURL } = config.projects[0].use;

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page: Page = await context.newPage();

  await page.goto(`${baseURL}`);
  expect(page).toHaveTitle(/Pangea - Login/gi);

  const loginForm = page.getByTestId('loginForm');
  expect(loginForm).toBeVisible();

  await page.getByLabel('Email').fill(IBRK_USERNAME);
  await page.getByLabel('Password').fill(IBRK_PASSWORD);

  await loginForm.press('Enter');
  await page.waitForURL('**/dashboard/transactions');
  await expect(page).toHaveURL(/\/dashboard\/transactions$/);
  expect(page.getByTestId('signOutButton')).toBeVisible();

  // Save the state of the webpage
  await page.context().storageState({ path: 'testStates/globalState.json' });
  await browser.close();
}

async function getMarketData(): Promise<void> {
  console.log('Getting Market data');
  const credentials = Buffer.from(`${IBRK_USERNAME}:${IBRK_PASSWORD}`).toString(
    'base64',
  );

  // Make the fetch request with the Authorization header
  try {
    const response = await fetch(
      `${PANGEA_BASE_URL}/api/v2/marketdata/markets-liquidity/`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const marketLiquidityResponse: PangeaMarketsLiquidityResponse =
      await response.json();
    const currencyPairData = marketLiquidityResponse.data
      .filter(({ market, insight_data }: PangeaMarketLiquidityInsight) => {
        const { liquidity_status, market_status } = insight_data[0];
        return (
          liquidity_status &&
          market_status === 'open' &&
          market.length === 6 &&
          market.slice(0, 3) !== market.slice(3, 6) &&
          CCY_RANKS.includes(market.slice(3, 6)) &&
          !NO_WALLET_CURRENCY.includes(market.slice(3, 6))
        );
      })
      .map(
        ({
          market,
          is_ndf,
          fwd_rfq_type,
          insight_data,
        }: PangeaMarketLiquidityInsight) => {
          const { liquidity_status, market_status, time, spread_in_bps } =
            insight_data[0];
          return {
            market,
            sell: market.slice(0, 3),
            buy: market.slice(3, 6),
            is_ndf,
            fwd_rfq_type,
            liquidity: liquidity_status,
            market_status,
            time,
            spread_in_bps,
          };
        },
      );

    // Randomize array before writing, so the tests are randomized for different currencies
    for (let i = currencyPairData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [currencyPairData[i], currencyPairData[j]] = [
        currencyPairData[j],
        currencyPairData[i],
      ];
    }

    fs.writeFileSync(
      'testStates/currencyPairs.json',
      JSON.stringify(currencyPairData),
    );
  } catch (error) {
    console.error('Error:', error);
  }
}

export default globalSetup;
