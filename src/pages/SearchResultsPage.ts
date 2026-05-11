import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  resultsHeading = (): Locator => this.page.getByTestId('results-for-heading');

  // "1 product" / "N products" count summary visible on results page
  productCountSummary = (): Locator => this.page.getByText(/\d+\s+product/i);

  productList = (): Locator => this.page.getByTestId('product-list');

  // Verified live UI selector: data-testid="product-list-card-<productId>"
  productCard = (productId: string): Locator => this.page.getByTestId(`product-list-card-${productId}`);

  productTitleLink = (productId: string): Locator =>
    this.productCard(productId).getByTestId('product-list-card-title');

  productIdCopyControl = (productId: string): Locator =>
    this.productCard(productId).getByLabel(`Copy productId ${productId}`);

  resultQuantityInput = (productId: string): Locator =>
    this.productCard(productId).locator(`#quantity-counter-${productId}`);

  resultAddToCartButton = (productId: string): Locator =>
    this.productCard(productId).getByTestId('quantity-counter-cta-add');

  resultPriceError = (productId: string): Locator =>
    this.productCard(productId).getByTestId(`price-error-${productId}`);

  // Fallback: any visible element containing the product ID string
  productIdText = (productId: string): Locator =>
    this.page.getByText(productId, { exact: false }).first();

  async openProductResult(productId: string): Promise<void> {
    await this.productTitleLink(productId).click();
  }
}
