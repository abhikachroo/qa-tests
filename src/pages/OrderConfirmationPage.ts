import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrderConfirmationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ─────────────────────────────────────────────────────────────

  // Main confirmation heading (strategy: role+name)
  confirmationHeading = () =>
    this.page.getByRole('heading', { name: 'Order confirmed!' });

  // Order reference in format vanilla-{numericId} (strategy: text regex)
  orderReferenceText = () => this.page.getByText(/vanilla-\d+/);

  // Confirmation body message (strategy: text regex)
  deliveryMessage = () =>
    this.page.getByText(/We are preparing your deliveries/);

  // "Ordered products" section heading (strategy: role+name)
  orderedProductsHeading = () =>
    this.page.getByRole('heading', { name: 'Ordered products' });

  // "Price details" section heading (strategy: role+name)
  priceDetailsHeading = () =>
    this.page.getByRole('heading', { name: 'Price details' });

  // Actions (strategy: data-testid)
  goToOrderHistoryBtn   = () => this.page.getByTestId('go-to-order-history-button');
  printOrDownloadBtn    = () => this.page.getByTestId('print-or-download-button');
  paymentPriceDetails   = () => this.page.getByTestId('payment-priceDetails');
  addAllToFavouritesBtn = () => this.page.getByTestId('add-all-items-to-favorites');

  // Loading indicator — briefly visible while ordered-products section loads
  loadingIndicator = () => this.page.getByText('Loading...');

  // Cart badge in header — should reset to 0 post-order (strategy: data-testid)
  cartButton = () => this.page.getByTestId('cart-button');

  // ── Simple UI actions ────────────────────────────────────────────────────

  async clickGoToOrderHistory(): Promise<void> {
    await this.goToOrderHistoryBtn().click();
  }

  async getOrderReferenceText(): Promise<string> {
    return (await this.orderReferenceText().textContent()) ?? '';
  }

  async waitForConfirmationLoaded(): Promise<void> {
    // Wait for any brief loading state to resolve before asserting products
    await this.loadingIndicator().waitFor({ state: 'hidden', timeout: 30_000 }).catch(() => {
      // Loading indicator may not appear at all — ignore if already gone
    });
  }
}
