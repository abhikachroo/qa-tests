import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CheckoutVerificationPage — Layer 2: Locators & basic UI actions for Checkout Step 2/2.
 *
 * Route: /checkout/en-gb/tunnel/{cartId}/verification
 * All locators verified live against fra-vanilla-preprod.dev.spark.sonepar.com (2026-05-07).
 * Source: LOCATOR_MAP in e2e-add-to-cart-checkout-test-plan artifact.
 */
export class CheckoutVerificationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Step navigation indicator ──────────────────────────────────────────────

  /**
   * Tunnel stepper showing "2/2 - Verification" progress.
   * (strategy: data-testid)
   */
  stepIndicator = () => this.page.getByTestId('cart-tunnel-stepper');

  // ── Page content ───────────────────────────────────────────────────────────

  /** Verification container wrapper (strategy: data-testid) */
  verificationContainer = () => this.page.getByTestId('verification-container-wrapper');

  /** Page title element: shows "Verification" (strategy: data-testid) */
  verificationPageTitle = () => this.page.getByTestId('verification_page_title');

  /** CMS form wrapper (strategy: data-testid) */
  cmsForm = () => this.page.getByTestId('cms-form');

  /** Order summary container (strategy: data-testid) */
  orderCheckoutContainer = () => this.page.getByTestId('order-checkout-container');

  // ── Required form fields ───────────────────────────────────────────────────

  /**
   * Purchase Order input — REQUIRED field; form will not submit without a value.
   * (strategy: data-testid)
   */
  purchaseOrderInput = () => this.page.getByTestId('form-field-purchaseOrder-required');

  /**
   * Project ID input — REQUIRED field; form will not submit without a value.
   * (strategy: data-testid)
   */
  projectIdInput = () => this.page.getByTestId('form-field-projectID-required');

  // ── Optional form fields ───────────────────────────────────────────────────

  /** Warehouse Name input (strategy: data-testid) */
  warehouseNameInput = () => this.page.getByTestId('form-field-warehouseName');

  /** Contact First Name input (strategy: data-testid) */
  contactFirstNameInput = () => this.page.getByTestId('form-field-contactFirstName');

  /** Contact Last Name input (strategy: data-testid) */
  contactLastNameInput = () => this.page.getByTestId('form-field-contactLastName');

  /** Contact Phone input (strategy: data-testid) */
  contactPhoneInput = () => this.page.getByTestId('form-field-contactPhoneNumber');

  /** Contact Email input (strategy: data-testid) */
  contactEmailInput = () => this.page.getByTestId('form-field-contactEmail');

  /** Order Notes textarea (strategy: data-testid) */
  orderNotesInput = () => this.page.getByTestId('form-field-noteText');

  // ── Payment method radios ──────────────────────────────────────────────────

  /**
   * Invoice / Credit Line radio button — DEFAULT, pre-selected.
   * No action needed unless verifying checked state.
   * (strategy: data-testid)
   */
  creditLinePaymentRadio = () => this.page.getByTestId('cart-payment-creditLine');

  /** Credit / Debit Card radio button (strategy: data-testid) */
  creditCardPaymentRadio = () => this.page.getByTestId('cart-payment-creditCard');

  // ── Section separators (for scrolling / visibility checks) ────────────────

  /** Contact section heading separator (strategy: data-testid) */
  contactSeparator = () => this.page.getByTestId('form-field-contact-separator');

  /** Notes section heading separator (strategy: data-testid) */
  notesSeparator = () => this.page.getByTestId('form-field-notes-separator');

  // ── CTAs ───────────────────────────────────────────────────────────────────

  /**
   * "Confirm your order" submit CTA.
   *
   * NOTE: 'checkout-button' data-testid is shared across all tunnel steps.
   * Disambiguated by filtering on button text.
   * (strategy: data-testid + text filter)
   */
  confirmOrderButton = () =>
    this.page.getByTestId('checkout-button').filter({ hasText: /confirm your order/i });

  // ── Simple UI actions ──────────────────────────────────────────────────────

  async fillPurchaseOrder(value: string): Promise<void> {
    await this.purchaseOrderInput().fill(value);
  }

  async fillProjectId(value: string): Promise<void> {
    await this.projectIdInput().fill(value);
  }

  async clickConfirmOrder(): Promise<void> {
    await this.confirmOrderButton().click();
  }

  async getStepIndicatorText(): Promise<string> {
    return (await this.stepIndicator().textContent()) ?? '';
  }

  async getVerificationTitleText(): Promise<string> {
    return (await this.verificationPageTitle().textContent()) ?? '';
  }
}
