import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // "1 product" / "N products" count summary (strategy: data-testid)
  productCountSummary = () => this.page.getByTestId('product-list-count');

  // Product card by SKU-specific testid, e.g. product-list-card-6968173 (strategy: data-testid)
  productCardByTestId = (sku: string) => this.page.getByTestId(`product-list-card-${sku}`);

  // Add to cart button (strategy: data-testid — single product on results page)
  addToCartButton = () => this.page.getByTestId('quantity-counter-cta-add');

  // Quantity counter input for a specific SKU (strategy: id)
  quantityInput = (sku: string) => this.page.locator(`#quantity-counter-${sku}`);

  // Fallback: any visible element containing the product ID string
  productIdText = (productId: string) =>
    this.page.getByText(productId, { exact: false }).first();

  async clickAddToCart(): Promise<void> {
    await this.addToCartButton().click();
  }
}
