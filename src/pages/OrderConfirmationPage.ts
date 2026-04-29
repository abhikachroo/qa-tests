import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * OrderConfirmationPage — URL pattern unknown (not browsed live).
 *
 * WARNING: All locators in this class are UNVERIFIED.
 * The order confirmation page was not browsed during test plan generation
 * to avoid submitting a real order on preprod.
 *
 * ACTION REQUIRED on first manual run:
 *   1. Complete TC-001 manually and observe the confirmation page URL
 *   2. Inspect the DOM for the success heading and order reference elements
 *   3. Replace the TODO locators below with confirmed data-testid or role-based selectors
 *   4. Update the LOCATOR_MAP in the test plan artifact with confirmed values
 */
export class OrderConfirmationPage extends BasePage {
  constructor(page: Page) { super(page); }

  // ── Confirmation content ─────────────────────────────────────────

  /**
   * Success heading — TODO: verify selector on first run.
   * Attempts role-based match on common confirmation phrases.
   */
  // TODO: verify selector — confirmation page not browsed live
  successHeading = () =>
    this.page.getByRole('heading', { name: /order confirmed|your order|commande confirm/i });

  /**
   * Order reference number element — TODO: verify selector on first run.
   * Attempts a broad data-testid wildcard match on common patterns.
   */
  // TODO: verify selector — confirmation page not browsed live
  orderReferenceNumber = () =>
    this.page.locator(
      '[data-testid*="order-reference"],[data-testid*="order-number"],[data-testid*="confirmation-number"]',
    ).first();

  /**
   * "Continue shopping" / home CTA — TODO: verify selector on first run.
   */
  // TODO: verify selector — confirmation page not browsed live
  continueShoppingLink = () =>
    this.page.getByRole('link', { name: /continue|home|shop|catalogue/i });

  // ── Simple UI actions ─────────────────────────────────────────────

  async getOrderReference(): Promise<string> {
    return (await this.orderReferenceNumber().textContent()) ?? '';
  }

  async waitForConfirmationUrl(): Promise<void> {
    await this.page.waitForURL(/confirmation|order-confirmation|success/i, { timeout: 60_000 });
  }
}
