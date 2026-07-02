import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

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

  productCardLink = (productId: string): Locator =>
    this.productCard(productId).getByRole('link').first();

  addToCartButton = (): Locator =>
    this.page.getByRole('button', { name: /add.*cart|ajouter.*panier|ajouter/i }).first();

  productCardAddToCartButton = (productId: string): Locator =>
    this.productCard(productId).getByRole('button', { name: /add.*cart|ajouter.*panier|ajouter/i }).first();

  addToCartPendingIndicator = (): Locator =>
    this.page.getByRole('status').or(this.page.getByRole('progressbar'));

  async clickProductCard(productId: string): Promise<void> {
    await this.productCard(productId).click();
  }

  async clickProductCardLink(productId: string): Promise<void> {
    await this.productCardLink(productId).click();
  }

  async clickAddToCartButton(): Promise<void> {
    await this.addToCartButton().click();
  }

  async clickProductCardAddToCartButton(productId: string): Promise<void> {
    await this.productCardAddToCartButton(productId).click();
  }
}
