import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CheckoutLogisticsPage — /checkout/en-gb/tunnel/{cartId}/logistics
 * Step 1/2 of the checkout tunnel.
 * All locators verified via live DOM inspection on 2026-04-29.
 */
export class CheckoutLogisticsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ────────────────────────────────────────────────────────────

  /** "continue to verification" CTA (strategy: data-testid — verified) */
  continueToVerificationButton = () => this.page.getByTestId('checkout-button');

  /** "Back to cart" button (strategy: data-testid — verified) */
  backToCartButton = () => this.page.getByTestId('back-button');

  /** Line item product link for a product in the logistics step (strategy: data-testid — verified) */
  lineItemProductLink = () => this.page.getByTestId('line-item-product-link');

  /** Change delivery date button (strategy: data-testid — verified) */
  changeDeliveryDateButton = () => this.page.getByTestId('button-shipping-date-drawer');

  /** Step indicator text e.g. "1/2" (strategy: text match) */
  stepIndicator = () => this.page.getByText(/1\s*\/\s*2/i);

  /** Order total including VAT in the summary panel (strategy: text match) */
  totalIncludingVat = () => this.page.getByText('1.379,92 €').first();

  // ── Actions ─────────────────────────────────────────────────────────────

  async clickContinueToVerification(): Promise<void> {
    await this.continueToVerificationButton().click();
  }

  async clickBackToCart(): Promise<void> {
    await this.backToCartButton().click();
  }

  async waitForLogisticsPage(): Promise<void> {
    await this.page.waitForURL(/\/logistics/, { timeout: 30_000 });
    await this.waitForPageLoad();
  }
}
