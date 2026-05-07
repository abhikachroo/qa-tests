import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutVerificationPage extends BasePage {
  constructor(page: Page) { super(page); }

  // Step indicator "2/2 - Verification" (strategy: data-testid)
  stepIndicator               = () => this.page.getByTestId('cart-tunnel-stepper');
  // Verification container (strategy: data-testid)
  verificationContainer       = () => this.page.getByTestId('verification-container-wrapper');
  // Page title "Verification" (strategy: data-testid)
  verificationPageTitle       = () => this.page.getByTestId('verification_page_title');
  // Purchase Order — required text field (strategy: data-testid)
  purchaseOrderInput          = () => this.page.getByTestId('form-field-purchaseOrder-required');
  // Project ID — required text field (strategy: data-testid)
  projectIdInput              = () => this.page.getByTestId('form-field-projectID-required');
  // Invoice / Credit Line payment radio — pre-selected default (strategy: data-testid)
  creditLineRadio             = () => this.page.getByTestId('cart-payment-creditLine');
  // Credit / Debit Card payment radio (strategy: data-testid)
  creditCardRadio             = () => this.page.getByTestId('cart-payment-creditCard');
  // CMS form wrapper (strategy: data-testid)
  cmsForm                     = () => this.page.getByTestId('cms-form');
  // Order summary sidebar (strategy: data-testid)
  orderCheckoutContainer      = () => this.page.getByTestId('order-checkout-container');
  // "Confirm your order" CTA — checkout-button testid reused (strategy: data-testid)
  confirmOrderButton          = () => this.page.getByTestId('checkout-button').filter({ hasText: /confirm your order/i });

  async fillPurchaseOrder(value: string): Promise<void> {
    await this.purchaseOrderInput().fill(value);
  }

  async fillProjectId(value: string): Promise<void> {
    await this.projectIdInput().fill(value);
  }

  async clickConfirmOrder(): Promise<void> {
    await this.confirmOrderButton().click();
  }
}
