import { Locator, Page } from '@playwright/test';

export abstract class BasePage {
  // Cookie consent banner — site-wide, appears on first visit
  private oneTrustAcceptButton = (): Locator => this.page.locator('#onetrust-accept-btn-handler');
  private cookieAcceptButton = (): Locator =>
    this.page.getByRole('button', {
      name: /(accept all|allow all|accept cookies|accepter tout|tout accepter|continuer sans accepter|j'accepte|i accept)/i,
    });
  private cookieBanner = (): Locator => this.page.locator('#onetrust-banner-sdk');
  private oneTrustSdk = (): Locator => this.page.locator('#onetrust-consent-sdk');
  private oneTrustDarkFilter = (): Locator => this.page.locator('.onetrust-pc-dark-filter.ot-fade-in');
  private oneTrustOverlays = (): Locator =>
    this.page.locator('#onetrust-consent-sdk, .onetrust-pc-dark-filter.ot-fade-in');

  constructor(protected page: Page) {}

  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async dismissCookieBannerIfPresent(): Promise<void> {
    const oneTrustButton = this.oneTrustAcceptButton();
    const roleButton = this.cookieAcceptButton().first();

    if (await oneTrustButton.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await oneTrustButton.click();
    } else if (await roleButton.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await roleButton.click();
    }

    await Promise.all([
      this.cookieBanner().waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => undefined),
      this.oneTrustSdk().waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => undefined),
      this.oneTrustDarkFilter().waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => undefined),
    ]);

    if (await this.oneTrustOverlays().first().isVisible({ timeout: 1_000 }).catch(() => false)) {
      await this.page.evaluate(() => {
        document
          .querySelectorAll('#onetrust-consent-sdk, .onetrust-pc-dark-filter.ot-fade-in')
          .forEach((element) => element.remove());
      });
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
