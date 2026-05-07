import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutLogisticsPage extends BasePage {
  constructor(page: Page) { super(page); }

  // Step indicator showing "1/2 - Logistics" (strategy: data-testid)
  stepIndicator      = () => this.page.getByTestId('cart-tunnel-stepper');
  // Logistics container wrapper (strategy: data-testid)
  logisticsContainer = () => this.page.getByTestId('logistics-container');
  // Page title "Delivery" (strategy: data-testid)
  logisticsTitle     = () => this.page.getByTestId('logistics_page_title');
  // Delivery address box (strategy: data-testid)
  deliveryAddressBox = () => this.page.getByTestId('delivery-address-box');
  // Continue to verification CTA — disambiguated by hasText in module (strategy: data-testid)
  checkoutButton     = () => this.page.getByTestId('checkout-button');

  async clickContinueToVerification(): Promise<void> {
    await this.checkoutButton().filter({ hasText: /continue to verification/i }).click();
  }
}
