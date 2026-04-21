import { Page } from '@playwright/test';

export class WaitHelper {
  constructor(private page: Page) {}

  async waitForCondition(
    condition: () => Promise<boolean>,
    timeout = 30_000,
    interval = 500,
  ): Promise<void> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (await condition()) return;
      await this.page.waitForTimeout(interval);
    }
    throw new Error(`Condition not met within ${timeout}ms`);
  }

  async retry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
    let lastError: Error | undefined;
    for (let i = 0; i < retries; i++) {
      try { return await fn(); } catch (e) {
        lastError = e as Error;
        if (i < retries - 1) await this.page.waitForTimeout(delay);
      }
    }
    throw lastError;
  }

  async waitForNetworkIdle(timeout = 10_000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }
}
