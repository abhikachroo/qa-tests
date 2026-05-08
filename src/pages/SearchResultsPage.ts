import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  productCountSummary = (): Locator => this.page.getByText(/\d+\s+product/i);
  productCard = (productId: string): Locator => this.page.getByTestId(`product-list-card-${productId}`);
  productTitle = (): Locator => this.page.getByTestId('product-list-card-title');
  productIdText = (productId: string): Locator => this.page.getByText(productId, { exact: false }).first();
  quantityInput = (productId: string): Locator => this.page.locator(`#quantity-counter-${productId}`);
  addToCartButton = (): Locator => this.page.getByTestId('quantity-counter-cta-add');
  incrementButton = (): Locator => this.page.getByLabel('Increment');
  decrementButton = (): Locator => this.page.getByLabel('Decrement');

  async navigateToProductSearch(productId: string): Promise<void> {
    await this.navigate(`/catalog/en-gb/search/${productId}?version=1`);
  }
}
