import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CheckoutVerificationPage — Layer 2: Locators & basic UI actions
 *
 * Covers checkout step 2/2 — Verification at /checkout/en-gb/tunnel/{cartId}/verification
 * All locators verified via live app browsing.
 */
export class CheckoutVerificationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ────────────────────────────────────────────────────────────────

  /** Invoice (creditLine) payment radio — strategy: data-testid (verified live, pre-selected) */
  invoicePaymentRadio = () => this.page.getByTestId('cart-payment-creditLine');

  /** Credit/debit card payment radio — strategy: data-testid */
  creditCardPaymentRadio = () => this.page.getByTestId('cart-payment-creditCard');

  /** Purchase Order field (REQUIRED) — strategy: data-testid (verified live) */
  purchaseOrderInput = () =>
    this.page.getByTestId('form-field-purchaseOrder-required');

  /** Project ID field (REQUIRED) — strategy: data-testid (verified live) */
  projectIdInput = () =>
    this.page.getByTestId('form-field-projectID-required');

  /** Warehouse name (optional) — strategy: data-testid */
  warehouseNameInput = () => this.page.getByTestId('form-field-warehouseName');

  /** Contact first name (optional) — strategy: data-testid */
  contactFirstNameInput = () =>
    this.page.getByTestId('form-field-contactFirstName');

  /** Contact last name (optional) — strategy: data-testid */
  contactLastNameInput = () =>
    this.page.getByTestId('form-field-contactLastName');

  /** Contact email (optional) — strategy: data-testid */
  contactEmailInput = () => this.page.getByTestId('form-field-contactEmail');

  /** Notes textarea (optional) — strategy: data-testid */
  notesTextarea = () => this.page.getByTestId('form-field-noteText');

  /** Back to logistics — strategy: aria-label */
  backToLogisticsBtn = () => this.page.getByLabel('Back to logistics');

  /** Confirm your order CTA — strategy: data-testid (verified live) */
  confirmOrderBtn = () => this.page.getByTestId('checkout-button');

  // ── Simple UI actions ────────────────────────────────────────────────────────

  async fillPurchaseOrder(value: string): Promise<void> {
    await this.purchaseOrderInput().fill(value);
  }

  async fillProjectId(value: string): Promise<void> {
    await this.projectIdInput().fill(value);
  }

  async clickConfirmOrder(): Promise<void> {
    await this.confirmOrderBtn().click();
  }

  async waitForConfirmationUrl(): Promise<void> {
    // Wait for navigation away from verification — URL pattern TBC on first successful run
    await this.page.waitForURL(
      (url) => !url.pathname.includes('/verification'),
      { timeout: 60_000 },
    );
  }
}
