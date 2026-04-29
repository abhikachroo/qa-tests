import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * OrderConfirmationPage — terminal success page after order submission.
 *
 * ⚠️  WARNING: This page was NOT browsed live during test plan generation.
 * All locators below are approximations based on accessibility-tree best-practice
 * patterns. They MUST be confirmed on the first manual run of the complete flow
 * and updated with the verified selectors.
 *
 * Run the flow once manually, inspect the confirmation page DOM, then:
 *  1. Replace the `// TODO: verify selector` locators with confirmed ones.
 *  2. Update the LOCATOR_MAP section in the e2e-order-flow-test-plan artifact.
 */
export class OrderConfirmationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ────────────────────────────────────────────────────────────

  /**
   * Success heading or confirmation message.
   * TODO: verify selector — run manually and confirm the exact heading text.
   */
  successHeading = () =>
    this.page.getByRole('heading', { name: /order confirmed|your order|commande/i }); // TODO: verify selector

  /**
   * Order reference number element.
   * Tries common data-testid patterns used in Sonepar/Spark apps.
   * TODO: verify selector — confirm the exact data-testid on first run.
   */
  orderReferenceNumber = () =>
    this.page
      .locator(
        '[data-testid*="order-reference"],[data-testid*="order-number"],[data-testid*="confirmation"]',
      )
      .first(); // TODO: verify selector

  /**
   * Continue shopping / home CTA on confirmation page.
   * TODO: verify selector — confirm visible link text on first run.
   */
  continueShoppingLink = () =>
    this.page.getByRole('link', { name: /continue|home|shop|catalogue/i }); // TODO: verify selector

  // ── Actions ─────────────────────────────────────────────────────────────

  async waitForConfirmationPage(): Promise<void> {
    await this.page.waitForURL(/confirmation|order-confirmation|success/i, { timeout: 60_000 });
    await this.waitForPageLoad();
  }

  async getOrderReferenceText(): Promise<string> {
    return (await this.orderReferenceNumber().textContent()) ?? '';
  }
}
