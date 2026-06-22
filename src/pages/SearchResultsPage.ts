import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // "1 product" / "N products" count summary visible on results page
  productCountSummary = (): Locator => this.page.getByText(/\d+\s+product/i);

  // Product card identified by containing the searched product ID text
  productCard = (productId: string): Locator =>
    this.page.locator('[data-testid="product-card"]').filter({ hasText: productId }).first();

  // Fallback: any visible element containing the product ID string
  productIdText = (productId: string): Locator =>
    this.page.getByText(productId, { exact: false }).first();

  addToCartButtonForProduct = (productId: string): Locator =>
    this.productCard(productId).getByRole('button', { name: /add|cart|panier|ajouter/i });

  firstAddToCartButton = (): Locator =>
    this.page.getByRole('button', { name: /add|cart|panier|ajouter/i }).first();

  async clickAddToCart(productId: string): Promise<void> {
    await this.addToCartButtonForProduct(productId).click();
  }
}
