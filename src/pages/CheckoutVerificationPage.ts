import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutVerificationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ─────────────────────────────────────────────────────────────

  // Progress indicator text "2/2" (strategy: text match)
  progressIndicator = () => this.page.getByText(/2\/2/);

  // Required form fields (strategy: data-testid)
  purchaseOrderInput = () => this.page.getByTestId('form-field-purchaseOrder-required');
  projectIdInput     = () => this.page.getByTestId('form-field-projectID-required');

  // Optional contact fields (strategy: data-testid)
  warehouseNameInput    = () => this.page.getByTestId('form-field-warehouseName');
  contactFirstNameInput = () => this.page.getByTestId('form-field-contactFirstName');
  contactLastNameInput  = () => this.page.getByTestId('form-field-contactLastName');
  contactPhoneInput     = () => this.page.getByTestId('form-field-contactPhoneNumber');
  contactEmailInput     = () => this.page.getByTestId('form-field-contactEmail');
  notesTextarea         = () => this.page.getByTestId('form-field-noteText');

  // Payment selection radios (strategy: data-testid)
  paymentCreditLineRadio = () => this.page.getByTestId('cart-payment-creditLine');
  paymentCreditCardRadio = () => this.page.getByTestId('cart-payment-creditCard');

  // Primary CTA — "confirm your order" (strategy: data-testid)
  confirmOrderBtn = () => this.page.getByTestId('checkout-button');

  // Back navigation (strategy: aria-label)
  backToLogisticsBtn = () => this.page.getByLabel('Back to logistics');

  // ── Simple UI actions ────────────────────────────────────────────────────

  async fillPurchaseOrder(value: string): Promise<void> {
    await this.purchaseOrderInput().fill(value);
  }

  async fillProjectId(value: string): Promise<void> {
    await this.projectIdInput().fill(value);
  }

  async clickConfirmOrder(): Promise<void> {
    await this.confirmOrderBtn().click();
  }

  async clickBackToLogistics(): Promise<void> {
    await this.backToLogisticsBtn().click();
  }
}
