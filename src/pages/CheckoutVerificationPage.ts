import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CheckoutVerificationPage — /checkout/en-gb/tunnel/{cartId}/verification
 *
 * Checkout Step 2 of 2. All locators confirmed live via DOM inspection on 2026-04-29.
 * Strategy: data-testid (priority 1) and aria-label (priority 2).
 *
 * Required fields: purchaseOrder and projectID must be filled before order submission.
 */
export class CheckoutVerificationPage extends BasePage {
  constructor(page: Page) { super(page); }

  // ── Payment method radios ─────────────────────────────────────────
  /** Invoice / Credit Line radio (pre-selected by default) — data-testid confirmed live */
  invoicePaymentRadio       = () => this.page.getByTestId('cart-payment-creditLine');

  /** Credit / debit card payment radio */
  creditCardPaymentRadio    = () => this.page.getByTestId('cart-payment-creditCard');

  // ── Required form fields ──────────────────────────────────────────
  /** Purchase Order — required — data-testid confirmed live */
  purchaseOrderInput        = () => this.page.getByTestId('form-field-purchaseOrder-required');

  /** Project ID — required — data-testid confirmed live */
  projectIdInput            = () => this.page.getByTestId('form-field-projectID-required');

  // ── Optional form fields ──────────────────────────────────────────
  /** Warehouse name (optional) */
  warehouseNameInput        = () => this.page.getByTestId('form-field-warehouseName');

  /** Contact first name (optional) */
  contactFirstNameInput     = () => this.page.getByTestId('form-field-contactFirstName');

  /** Notes textarea (optional) */
  notesTextarea             = () => this.page.getByTestId('form-field-noteText');

  // ── CTAs ──────────────────────────────────────────────────────────
  /** "confirm your order" button — same data-testid pattern as previous checkout steps */
  confirmOrderButton        = () => this.page.getByTestId('checkout-button');

  /** Back to logistics link */
  backToLogisticsButton     = () => this.page.getByLabel('Back to logistics');

  /** Back button */
  backButton                = () => this.page.getByTestId('back-button');

  // ── Simple UI actions ─────────────────────────────────────────────

  async fillPurchaseOrder(value: string): Promise<void> {
    await this.purchaseOrderInput().fill(value);
  }

  async fillProjectId(value: string): Promise<void> {
    await this.projectIdInput().fill(value);
  }

  async clickConfirmOrder(): Promise<void> {
    await this.confirmOrderButton().click();
  }

  async waitForVerificationUrl(): Promise<void> {
    await this.page.waitForURL(/verification/, { timeout: 30_000 });
  }
}
