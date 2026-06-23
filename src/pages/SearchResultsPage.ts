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

  // Add-to-cart control scoped to the matching product card. TODO: verify selector once product result route is reachable.
  addToCartButton = (productId: string) =>
    this.productCard(productId).getByRole('button', { name: /add.*cart|add to basket|add/i });

  // Generic error page locator observed during route extraction.
  errorPageContainer = () => this.page.getByTestId('Error404');

  async clickAddToCart(productId: string): Promise<void> {
    await this.addToCartButton(productId).click();
  }
}
