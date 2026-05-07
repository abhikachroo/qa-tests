import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutLogisticsPage extends BasePage {
  constructor(page: Page) { super(page); }

  // Step indicator "1/2 - Logistics" (strategy: data-testid)
  stepIndicator              = () => this.page.getByTestId('cart-tunnel-stepper');
  // Logistics container (strategy: data-testid)
  logisticsContainer         = () => this.page.getByTestId('logistics-container');
  // Page title "Delivery" (strategy: data-testid)
  logisticsPageTitle         = () => this.page.getByTestId('logistics_page_title');
  // Delivery address box (strategy: data-testid)
  deliveryAddressBox         = () => this.page.getByTestId('delivery-address-box');
  // Order summary sidebar (strategy: data-testid)
  orderCheckoutContainer     = () => this.page.getByTestId('order-checkout-container');
  // "Continue to verification" CTA — checkout-button testid reused (strategy: data-testid)
  continueToVerificationBtn  = () => this.page.getByTestId('checkout-button').filter({ hasText: /continue to verification/i });

  async clickContinueToVerification(): Promise<void> {
    await this.continueToVerificationBtn().click();
  }
}
