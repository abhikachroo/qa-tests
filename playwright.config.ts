import { defineConfig, devices } from '@playwright/test';
import { config } from './src/config';

export default defineConfig({
  testDir: './src/tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],
  use: {
    baseURL: config.baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    // ── Browser projects (E2E) ───────────────────────────────────────────────
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    //{ name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    //{ name: 'webkit',   use: { ...devices['Desktop Safari'] } },

    // ── API project ──────────────────────────────────────────────────────────
    {
      name: 'api',
      testMatch: '**/*.api.spec.ts',
      use: {
        // No browser device — API tests do not launch a browser
        baseURL: config.apiUrl,
        extraHTTPHeaders: {
          Accept: 'application/json',
        },
      },
      timeout: 30_000,
      retries: process.env.CI ? 1 : 0,
    },
  ],
});
