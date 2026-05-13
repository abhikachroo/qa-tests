import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // "1 product" / "N products" count summary visible on results page
  productCountSummary = () => this.page.getByText(/\d+\s+product/i);
  resultsHeading      = (keyword: string) => this.page.getByText(new RegExp(`Results\\s*for\\s*${keyword}`, 'i')).first();

  // Current result cards render product media and details as sibling elements inside a shared container.
  productCard = (productId: string): Locator =>
    this.page.getByTestId('product-list-card-container').filter({ hasText: productId }).first();

  productTitle = (productId: string): Locator => this.productCard(productId).getByTestId('product-list-card-title').first();

  productIdReference = (productId: string): Locator =>
    this.productCard(productId).getByText(new RegExp(`ProductID\\s*${productId}`));

  quantityInput = (productId: string): Locator => this.productCard(productId).locator(`#quantity-counter-${productId}`);
  addToCartButton = (productId: string): Locator => this.productCard(productId).getByTestId('quantity-counter-cta-add');
  decrementButton = (productId: string): Locator => this.productCard(productId).getByLabel('Decrement');
  incrementButton = (productId: string): Locator => this.productCard(productId).getByLabel('Increment');
  priceError = (productId: string): Locator => this.productCard(productId).getByTestId(`price-error-${productId}`);

  // Fallback: any visible element containing the product ID string
  productIdText = (productId: string) => this.page.getByText(productId, { exact: false }).first();

  async clickProductTitle(productId: string): Promise<void> {
    await this.productTitle(productId).click();
  }
}
