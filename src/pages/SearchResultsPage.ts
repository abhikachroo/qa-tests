import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // "1 product" / "N products" count summary visible on results page
  productCountSummary = () => this.page.getByText(/\d+\s+product/i);

  // Product card identified by containing the searched product ID text
  productCard = (productId: string) =>
    this.page.locator('[data-testid="product-card"]').filter({ hasText: productId }).first();

  // Fallback: any visible element containing the product ID string
  productIdText = (productId: string) =>
    this.page.getByText(productId, { exact: false }).first();

  // Product list card by SKU (strategy: data-testid)
  productListCard = (sku: string) => this.page.getByTestId(`product-list-card-${sku}`);

  // Add to cart button — visible on search results for a given product (strategy: data-testid)
  addToCartButton = () => this.page.getByTestId('quantity-counter-cta-add');

  // --- Simple UI actions ---

  async clickAddToCart(): Promise<void> {
    await this.addToCartButton().click();
  }
}
