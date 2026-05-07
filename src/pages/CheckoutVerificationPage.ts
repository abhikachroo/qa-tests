import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutVerificationPage extends BasePage {
  constructor(page: Page) { super(page); }

  // Step indicator showing "2/2 - Verification" (strategy: data-testid)
  stepIndicator         = () => this.page.getByTestId('cart-tunnel-stepper');
  // Page title "Verification" (strategy: data-testid)
  verificationTitle     = () => this.page.getByTestId('verification_page_title');
  // Required: Purchase Order input (strategy: data-testid)
  purchaseOrderInput    = () => this.page.getByTestId('form-field-purchaseOrder-required');
  // Required: Project ID input (strategy: data-testid)
  projectIdInput        = () => this.page.getByTestId('form-field-projectID-required');
  // Payment: Invoice/Credit Line radio — pre-selected default (strategy: data-testid)
  invoicePaymentRadio   = () => this.page.getByTestId('cart-payment-creditLine');
  // Confirm order CTA — disambiguated by hasText in module (strategy: data-testid)
  checkoutButton        = () => this.page.getByTestId('checkout-button');
  // Verification container wrapper (strategy: data-testid)
  verificationContainer = () => this.page.getByTestId('verification-container-wrapper');

  async fillPurchaseOrder(value: string): Promise<void> {
    await this.purchaseOrderInput().fill(value);
  }

  async fillProjectId(value: string): Promise<void> {
    await this.projectIdInput().fill(value);
  }

  async clickConfirmOrder(): Promise<void> {
    await this.checkoutButton().filter({ hasText: /confirm your order/i }).click();
  }
}
