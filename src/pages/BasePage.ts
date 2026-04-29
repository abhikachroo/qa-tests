import { Page } from '@playwright/test';

export abstract class BasePage {
  // Cookie consent banner — site-wide, appears on first visit
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
   * Wait for the page to finish loading.
   *
   * HEALED (Round 1): Changed from 'networkidle' to 'load'.
   * The Orders page makes continuous background API polling that prevents
   * 'networkidle' from ever firing, even though the page has fully rendered.
   * Both 'domcontentloaded' and 'load' events fire reliably on all pages tested.
   * Affected: TC-003-OL, TC-009, TC-012.
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('load');
  }

  async takeScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({ fullPage: true, path: `test-results/${name}.png` });
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}
