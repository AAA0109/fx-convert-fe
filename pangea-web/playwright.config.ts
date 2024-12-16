import { PlaywrightTestConfig } from '@playwright/test';
import 'dotenv/config';

const PORT = process.env.PORT || '3000';

const config: PlaywrightTestConfig = {
  globalSetup: './tests/e2e/globalSetup.ts',
  testDir: 'tests/e2e',
  timeout: 120000,
  workers: 4,
  reporter: [
    ['list'],
    ['html', { outputFile: 'playwright-report/index.html' }],
    ['json', { outputFile: 'playwright-report/test-results.json' }],
  ],
  use: {
    headless: true, // should be true by default, chanage to false to debug locally
    bypassCSP: true,
    testIdAttribute: 'data-testid',
    viewport: { width: 1280, height: 1000 },
    baseURL: `http://localhost:${PORT}/`,
    trace: 'on-first-retry',
    storageState: 'testStates/globalState.json',
  },
  webServer: {
    command: process.env.CI ? 'npm run start' : 'npm run dev &',
    port: Number(PORT),
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      PORT,
    },
  },
};

export default config;
