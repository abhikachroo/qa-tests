import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrderListPage extends BasePage {
  constructor(page: Page) { super(page); }

  // --- Orders mega-menu navigation (home page state) ---

  // "Orders" primary nav button — opens the Orders mega-menu dropdown (strategy: role+text)
  ordersNavButton = () => this.page.getByRole('button', { name: 'Orders' });

  // "Orders" sub-link inside mega-menu → /account/en-gb/orders (strategy: id)
  ordersSubLink = () => this.page.locator('#account-orders');

  // --- Order list page elements ---

  // H1 heading on the Orders page — text: "Orders" (strategy: role+level)
  ordersHeading = () => this.page.getByRole('heading', { name: 'Orders', level: 1 });

  // First order row checkbox — generic prefix match across all order IDs (strategy: data-testid prefix)
  firstOrderRow = () => this.page.locator('[data-testid^="order-checkbox-"]').first();

  // Total count toggle — label includes "(4759)" — informational only (strategy: data-testid)
  totalCountToggle = () => this.page.getByTestId('toggle-cumulative-order-total-display');

  // Processing notice banner — informational, NOT an error (strategy: data-testid)
  processingNotice = () => this.page.getByTestId('orders-history-processing-message');

  // --- Simple UI actions ---

  async clickOrdersNavButton(): Promise<void> {
    await this.ordersNavButton().click();
  }

  async clickOrdersSubLink(): Promise<void> {
    await this.ordersSubLink().click();
  }
}
