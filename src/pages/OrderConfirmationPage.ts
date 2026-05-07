import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrderConfirmationPage extends BasePage {
  constructor(page: Page) { super(page); }

  // "Order confirmed!" H2 heading (strategy: role+text — verified live)
  confirmationHeading     = () => this.page.getByRole('h2', { name: 'Order confirmed!' });
  // Full confirmation page wrapper (strategy: data-testid)
  confirmationPage        = () => this.page.getByTestId('confirmation-page');
  // Order reference text, e.g. "Your order Ref vanilla-735318349396512768 Copy" (strategy: data-testid)
  orderReferenceText      = () => this.page.getByTestId('order-confirmation-text');
  // Go to Order history button (strategy: data-testid)
  goToOrderHistoryButton  = () => this.page.getByTestId('go-to-order-history-button');
  // Email confirmation notice (strategy: data-testid)
  emailConfirmationNotice = () => this.page.getByTestId('order-confirmation-email-notification');
  // Purchase order value echoed back on confirmation page (strategy: data-testid)
  purchaseOrderValue      = () => this.page.getByTestId('orderInfo-purchaseOrder-value');
  // Order info column (strategy: data-testid)
  orderInfoColumn         = () => this.page.getByTestId('orderInfo-column');
}
