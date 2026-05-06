import { Page } from '@playwright/test';

export abstract class BasePage {
  // Cookie consent banner -- site-wide, appears on first visit
  private cookieAcceptBtn  = () => this.page.getByRole('button', { name: /accepter tout/i });
  // OneTrust SDK root container -- intercepts pointer events until fully torn down
  private cookieSdkOverlay = () => this.page.locator('#onetrust-consent-sdk');

  constructor(protected page: Page) {}

  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Dismiss the OneTrust cookie consent banner if present.
   *
   * Two-stage wait:
   *   1. Wait for the Accept button itself to become hidden (confirms click was registered).
   *   2. Wait for the #onetrust-consent-sdk root container to detach or become hidden.
   *      This container intercepts pointer events even after the button disappears,
   *      causing downstream clicks (e.g. header search submit) to time out.
   *
   * Both waits use generous timeouts and are wrapped in .catch() so we never hard-fail
   * on environments where the SDK has already been dismissed or is not present.
   */
  async dismissCookieBannerIfPresent(): Promise<void> {
    const btn     = this.cookieAcceptBtn();
    const overlay = this.cookieSdkOverlay();

    if (await btn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await btn.click();
      // Stage 1: wait for the button to disappear
      await btn.waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => undefined);
      // Stage 2: wait for the entire SDK container to detach or become hidden.
      // Resolves as soon as either state is confirmed; swallows the error if
      // the element is already gone.
      await Promise.race([
        overlay.waitFor({ state: 'hidden',   timeout: 10_000 }).catch(() => undefined),
        overlay.waitFor({ state: 'detached', timeout: 10_000 }).catch(() => undefined),
      ]);
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
