import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CheckoutLogisticsPage — /checkout/en-gb/tunnel/{cartId}/logistics
 *
 * Checkout Step 1 of 2. All locators confirmed live via DOM inspection on 2026-04-29.
 * Strategy: data-testid (priority 1) and aria-label (priority 2).
 *
 * Note: The {cartId} segment is dynamic — use waitForURL(/logistics/) for navigation sync.
 */
export class CheckoutLogisticsPage extends BasePage {
  constructor(page: Page) { super(page); }

  // ── CTAs ──────────────────────────────────────────────────────────
  /** "continue to verification" button — same data-testid as cart proceed button */
  continueToVerificationButton = () => this.page.getByTestId('checkout-button');

  /** "Back to cart" button */
  backButton                   = () => this.page.getByTestId('back-button');

  /** "Change delivery date" drawer trigger */
  changeDeliveryDateButton     = () => this.page.getByTestId('button-shipping-date-drawer');

  // ── Content ───────────────────────────────────────────────────────
  /** Line item product link for SKU 6968173 — data-testid confirmed live */
  lineItemProductLink          = () => this.page.getByTestId('line-item-product-link');

  // ── Simple UI actions ─────────────────────────────────────────────

  async clickContinueToVerification(): Promise<void> {
    await this.continueToVerificationButton().click();
  }

  async clickBackButton(): Promise<void> {
    await this.backButton().click();
  }

  async waitForLogisticsUrl(): Promise<void> {
    await this.page.waitForURL(/logistics/, { timeout: 30_000 });
  }
}
