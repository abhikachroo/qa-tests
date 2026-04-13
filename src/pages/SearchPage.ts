import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  noResultsMessage = () => this.page.getByText(/we couldn't find that page/i);
  productCards     = () => this.page.locator('[data-testid="product-card"], [class*="product-card"], [class*="product-item"]');

  async getProductCount(): Promise<number> {
    return this.productCards().count();
  }
}
