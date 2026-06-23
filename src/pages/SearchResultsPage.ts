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

  // Add-to-cart control exposed as a visible role button on the results list.
  addToCartButton = (productId: string) =>
    this.page.getByRole('button', { name: /^Add to cart$/i }).first();

  // Generic error page locator observed during route extraction.
  errorPageContainer = () => this.page.getByTestId('Error404');

  async clickAddToCart(productId: string): Promise<void> {
    await this.addToCartButton(productId).click();
  }
}
