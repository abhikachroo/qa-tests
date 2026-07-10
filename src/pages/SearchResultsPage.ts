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

  // No-results state varies by localization and routing fallback; keep text alternatives stable.
  noResultsMessage = () => this.page.getByText(/no results|aucun résultat|we couldn't find that page/i).first();

  async clickProductCard(productId: string): Promise<void> {
    await this.productCard(productId).click();
  }

  async pressProductCard(productId: string): Promise<void> {
    await this.productCard(productId).press('Enter');
  }
}
