import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CheckoutLogisticsPage — Layer 2: Locators & basic UI actions
 *
 * Covers checkout step 1/2 — Logistics at /checkout/en-gb/tunnel/{cartId}/logistics
 * All locators verified via live app browsing.
 */
export class CheckoutLogisticsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ────────────────────────────────────────────────────────────────

  /** Back to cart button — strategy: data-testid */
  backButton = () => this.page.getByTestId('back-button');

  /** "continue to verification" CTA — strategy: role+text (verified live) */
  continueToVerificationBtn = () =>
    this.page.getByRole('button', { name: 'continue to verification' });

  /** Change date button — strategy: role+text */
  changeDateBtn = () => this.page.getByRole('button', { name: 'Change date' });

  /** Add a comment for the receiver — strategy: role+text */
  addCommentBtn = () =>
    this.page.getByRole('button', { name: 'Add a comment for the receiver' });

  // ── Simple UI actions ────────────────────────────────────────────────────────

  async clickContinueToVerification(): Promise<void> {
    await this.continueToVerificationBtn().click();
  }

  async waitForVerificationUrl(): Promise<void> {
    await this.page.waitForURL('**/tunnel/**/verification', { timeout: 30_000 });
  }
}
