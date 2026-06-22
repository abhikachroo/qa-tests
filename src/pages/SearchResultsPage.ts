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

  firstProductLink = (productId: string): Locator =>
    this.productCard(productId).getByRole('link').first(); // TODO: verify selector against product card markup

  async clickMatchingProduct(productId: string): Promise<void> {
    await this.firstProductLink(productId).click();
  }
}
