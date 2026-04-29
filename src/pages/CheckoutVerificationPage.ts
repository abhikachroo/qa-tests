import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CheckoutVerificationPage — /checkout/en-gb/tunnel/{cartId}/verification
 * Step 2/2 of the checkout tunnel.
 * All locators verified via live DOM inspection on 2026-04-29.
 */
export class CheckoutVerificationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ────────────────────────────────────────────────────────────

  /** "confirm your order" CTA (strategy: data-testid — verified) */
  confirmOrderButton = () => this.page.getByTestId('checkout-button');

  /** Purchase Order required input (strategy: data-testid — verified) */
  purchaseOrderInput = () => this.page.getByTestId('form-field-purchaseOrder-required');

  /** Project ID required input (strategy: data-testid — verified) */
  projectIdInput = () => this.page.getByTestId('form-field-projectID-required');

  /** Invoice / Credit Line payment radio — pre-selected by default (strategy: data-testid — verified) */
  invoicePaymentRadio = () => this.page.getByTestId('cart-payment-creditLine');

  /** Credit card payment radio (strategy: data-testid — verified) */
  creditCardPaymentRadio = () => this.page.getByTestId('cart-payment-creditCard');

  /** Notes textarea — optional (strategy: data-testid — verified) */
  notesTextarea = () => this.page.getByTestId('form-field-noteText');

  /** "Back to cart" button (strategy: data-testid — verified) */
  backToCartButton = () => this.page.getByTestId('back-button');

  /** "Back to logistics" button (strategy: aria-label — verified) */
  backToLogisticsButton = () => this.page.getByLabel('Back to logistics');

  /** Step indicator text e.g. "2/2" (strategy: text match) */
  stepIndicator = () => this.page.getByText(/2\s*\/\s*2/i);

  /** Order total including VAT in the summary panel (strategy: text match) */
  totalIncludingVat = () => this.page.getByText('1.379,92 €').first();

  // ── Actions ─────────────────────────────────────────────────────────────

  async fillPurchaseOrder(value: string): Promise<void> {
    await this.purchaseOrderInput().fill(value);
  }

  async fillProjectId(value: string): Promise<void> {
    await this.projectIdInput().fill(value);
  }

  async clickConfirmOrder(): Promise<void> {
    await this.confirmOrderButton().click();
  }

  async clickBackToLogistics(): Promise<void> {
    await this.backToLogisticsButton().click();
  }

  async waitForVerificationPage(): Promise<void> {
    await this.page.waitForURL(/\/verification/, { timeout: 30_000 });
    await this.waitForPageLoad();
  }
}
