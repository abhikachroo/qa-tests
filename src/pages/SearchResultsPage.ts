import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // "1 product" / "N products" count summary visible on results page
  productCountSummary = (): Locator => this.page.getByText(/\d+\s+product/i);

  // Verified locator: data-testid="product-list-card-<productId>"
  productCard = (productId: string): Locator => this.page.getByTestId(`product-list-card-${productId}`);

  // Verified locator: data-testid="product-list-card-title"
  productTitleLink = (): Locator => this.page.getByTestId('product-list-card-title').first();

  // Verified locator: aria-label="Copy productId <productId>"
  productIdControl = (productId: string): Locator => this.page.getByLabel(`Copy productId ${productId}`);

  // Verified locator: data-testid="quantity-counter-cta-add"
  addToCartButton = (): Locator => this.page.getByTestId('quantity-counter-cta-add').first();

  // Verified locator: id="quantity-counter-<productId>"
  quantityInput = (productId: string): Locator => this.page.locator(`#quantity-counter-${productId}`);

  // Verified locator: data-testid="price-error-<productId>"
  priceError = (productId: string): Locator => this.page.getByTestId(`price-error-${productId}`);

  // Fallback: any visible element containing the product ID string
  productIdText = (productId: string): Locator => this.page.getByText(productId, { exact: false }).first();

  async clickProductTitle(): Promise<void> {
    await this.productTitleLink().click();
  }
}
