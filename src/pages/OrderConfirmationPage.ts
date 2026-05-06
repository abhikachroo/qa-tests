import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * OrderConfirmationPage — Layer 2: Locators & basic UI actions
 *
 * Covers the order confirmation page reached after a successful checkout.
 *
 * NOTE: This page was NOT visited during live browsing (to preserve test account
 * cart state). Locators below are informed by the test plan's preliminary selectors
 * and must be verified / pinned on the first successful test run.
 * Elements marked // TODO: verify selector must be confirmed on first run.
 */
export class OrderConfirmationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ────────────────────────────────────────────────────────────────

  /**
   * Confirmation heading — strategy: role (heading level 1 first, then any heading
   * containing confirmation language).
   * TODO: verify selector — confirm exact heading text on first run.
   */
  confirmationHeading = () =>
    this.page.getByRole('heading', { level: 1 });

  /**
   * Order reference element — strategy: data-testid (best guess) or text pattern.
   * TODO: verify selector — pin to exact data-testid once first run confirms it.
   */
  orderReference = () =>
    this.page
      .locator('[data-testid*="order-confirmation"], [data-testid*="order-number"], [data-testid*="order-ref"]')
      .first();

  /**
   * Product reference on confirmation — strategy: text match for SKU or product name.
   * TODO: verify selector — confirm product reference is present on first run.
   */
  productReference = (sku: string) =>
    this.page.getByText(sku, { exact: false });

  // ── Simple UI actions ────────────────────────────────────────────────────────

  async getConfirmationHeadingText(): Promise<string> {
    return (await this.confirmationHeading().textContent()) ?? '';
  }
}
