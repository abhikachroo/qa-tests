import { Page }     from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutLogisticsPage extends BasePage {
  constructor(page: Page) { super(page); }

  // Step progress indicator text (strategy: getByText)
  stepIndicator    = () => this.page.getByText('1/2 - Logistics');
  // Continue to verification CTA (strategy: data-testid)
  continueButton   = () => this.page.getByTestId('checkout-button');
  // Open shipping-date picker drawer (strategy: data-testid)
  changeDateButton = () => this.page.getByTestId('button-shipping-date-drawer');
  // Back to cart (strategy: data-testid)
  backButton       = () => this.page.getByTestId('back-button');
  // Add comment for receiver (strategy: data-testid)
  addCommentButton = () => this.page.getByTestId('add-comment-button');

  // --- Simple UI actions ---

  async clickContinueButton(): Promise<void> {
    await this.continueButton().click();
  }
}
