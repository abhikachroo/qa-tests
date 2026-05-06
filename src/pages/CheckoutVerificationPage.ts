import { Page }     from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutVerificationPage extends BasePage {
  constructor(page: Page) { super(page); }

  // Step progress indicator text (strategy: getByText)
  stepIndicator      = () => this.page.getByText('2/2 - Verification');
  // Required Purchase Order field (strategy: data-testid)
  purchaseOrderInput = () => this.page.getByTestId('form-field-purchaseOrder-required');
  // Required Project ID field (strategy: data-testid)
  projectIdInput     = () => this.page.getByTestId('form-field-projectID-required');
  // Optional warehouse name field (strategy: data-testid)
  warehouseNameInput = () => this.page.getByTestId('form-field-warehouseName');
  // Invoice / Credit Line payment radio (strategy: data-testid)
  creditLineRadio    = () => this.page.getByTestId('cart-payment-creditLine');
  // Credit / debit card payment radio (strategy: data-testid)
  creditCardRadio    = () => this.page.getByTestId('cart-payment-creditCard');
  // Confirm order CTA (strategy: data-testid)
  confirmOrderButton = () => this.page.getByTestId('checkout-button');
  // Back to logistics (strategy: aria-label)
  backToLogisticsBtn = () => this.page.getByLabel('Back to logistics');

  // --- Simple UI actions ---

  async fillPurchaseOrder(value: string): Promise<void> {
    await this.purchaseOrderInput().fill(value);
  }

  async fillProjectId(value: string): Promise<void> {
    await this.projectIdInput().fill(value);
  }

  async clickConfirmOrderButton(): Promise<void> {
    await this.confirmOrderButton().click();
  }
}
