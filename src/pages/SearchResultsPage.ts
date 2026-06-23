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

  addToCartButtonForProduct = (productId: string) =>
    this.productCard(productId).getByRole('button', { name: /add.*cart|add.*basket|ajouter.*panier/i }).first();

  error404Container = () => this.page.getByTestId('Error404');
  error404Text      = () => this.page.getByRole('paragraph').filter({ hasText: /error\s*404/i }).first();

  async clickAddToCart(productId: string): Promise<void> {
    await this.addToCartButtonForProduct(productId).click();
  }
}
