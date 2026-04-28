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

  // Product card by exact product ID data-testid (strategy: data-testid)
  productCardByTestId = (productId: string) =>
    this.page.getByTestId(`product-list-card-${productId}`);

  // Product title link (strategy: data-testid)
  productTitleLink = () => this.page.getByTestId('product-list-card-title');

  // "Add to cart" button — visible on the product card (strategy: data-testid)
  addToCartBtn = () => this.page.getByTestId('quantity-counter-cta-add');

  // Simple UI actions
  async clickAddToCart(): Promise<void> {
    await this.addToCartBtn().click();
  }
}
