import { Page } from '@playwright/test';

export abstract class BasePage {
  // Cookie consent banner -- site-wide, appears on first visit
  private cookieAcceptBtn = () => this.page.getByRole('button', { name: /accepter tout/i });

  constructor(protected page: Page) {}

  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async dismissCookieBannerIfPresent(): Promise<void> {
    const btn = this.cookieAcceptBtn();
    if (await btn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await btn.click();
      await btn.waitFor({ state: 'hidden' });
    }
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Wait for the page DOM to be fully parsed.
   * Uses 'domcontentloaded' (not 'networkidle') to remain compatible with SPAs
   * that maintain persistent background XHR connections (analytics, lazy widgets)
   * which would prevent 'networkidle' from ever resolving.
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async takeScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({ fullPage: true, path: `test-results/${name}.png` });
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}
