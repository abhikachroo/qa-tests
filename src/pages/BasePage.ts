import { Locator, Page } from '@playwright/test';

export abstract class BasePage {
  // Cookie consent banner — site-wide, appears on first visit
  private cookieAcceptBtn = (): Locator =>
    this.page
      .getByRole('button', { name: /(accept all|allow all|accept cookies|accepter tout|tout accepter|j'accepte|i accept)/i })
      .or(this.page.locator('#onetrust-accept-btn-handler'));

  private cookieBanner = (): Locator => this.page.locator('#onetrust-banner-sdk');

  constructor(protected page: Page) {}

  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async dismissCookieBannerIfPresent(): Promise<void> {
    const btn = this.cookieAcceptBtn().first();
    if (await btn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await btn.click();
      await this.cookieBanner().waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => undefined);
      await btn.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => undefined);
    }
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({ fullPage: true, path: `test-results/${name}.png` });
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}
