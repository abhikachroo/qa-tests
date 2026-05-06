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
   * Strategy:
   *   1. Check whether the Accept button is visible (5 s probe).
   *      If the banner is not present, return immediately — zero latency.
   *   2. Click the Accept button.
   *   3. Forcibly remove #onetrust-consent-sdk from the DOM via page.evaluate().
   *      This is deterministic and immune to CSS animation / transition timing.
   *      The previous Promise.race([...catch, ...catch]) pattern was broken:
   *      waitFor() rejects immediately when the target state doesn't match the
   *      current state (e.g. 'hidden' when the element IS visible), so .catch()
   *      resolved both promises instantly — the race exited with no real wait
   *      and the overlay kept intercepting pointer events.
   *   4. As a belt-and-suspenders guard, also wait for the element to be absent
   *      from the DOM using page.waitForSelector with state:'detached'.
   */
  async dismissCookieBannerIfPresent(): Promise<void> {
    const btn = this.cookieAcceptBtn();

    if (await btn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await btn.click();

      // Deterministically remove the overlay from the DOM so it can no longer
      // intercept pointer events regardless of animation state.
      await this.page.evaluate(() => {
        document.getElementById('onetrust-consent-sdk')?.remove();
      }).catch(() => undefined);

      // Secondary guard: wait for the selector to be fully detached in case
      // the evaluate() resolved before DOM mutation propagated.
      await this.page
        .waitForSelector('#onetrust-consent-sdk', { state: 'detached', timeout: 5_000 })
        .catch(() => undefined);
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
