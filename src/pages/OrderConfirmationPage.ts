import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrderConfirmationPage extends BasePage {
  constructor(page: Page) { super(page); }

  // Full page wrapper (strategy: data-testid)
  confirmationPage          = () => this.page.getByTestId('confirmation-page');
  // Confirmation container (strategy: data-testid)
  confirmationContainer     = () => this.page.getByTestId('confirmation-container');
  // "Order confirmed!" h2 heading (strategy: role+text — verified live)
  confirmedHeading          = () => this.page.getByRole('heading', { name: 'Order confirmed!', level: 2 });
  // Order reference text e.g. "Your order Ref vanilla-735318349396512768 Copy" (strategy: data-testid)
  orderReferenceText        = () => this.page.getByTestId('order-confirmation-text');
  // Go to Order history button (strategy: data-testid)
  goToOrderHistoryButton    = () => this.page.getByTestId('go-to-order-history-button');
  // Email notification block (strategy: data-testid)
  emailNotification         = () => this.page.getByTestId('order-confirmation-email-notification');
  // Order info column — shows Purchase Order echoed back (strategy: data-testid)
  orderInfoColumn           = () => this.page.getByTestId('orderInfo-column');
  // Purchase Order value echoed (strategy: data-testid)
  orderInfoPurchaseOrder    = () => this.page.getByTestId('orderInfo-purchaseOrder-value');
  // Payment heading on confirmation (strategy: data-testid)
  paymentHeading            = () => this.page.getByTestId('payment-heading');

  async getOrderReferenceText(): Promise<string> {
    return (await this.orderReferenceText().textContent()) ?? '';
  }

  async clickGoToOrderHistory(): Promise<void> {
    await this.goToOrderHistoryButton().click();
  }
}
