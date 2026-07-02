import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class SearchPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  noResultsMessage = (): Locator => this.page.getByText(/we couldn't find that page|aucun résultat|no results|not found/i);
  productCards = (): Locator => this.page.locator('[data-testid="product-card"], [class*="product-card"], [class*="product-item"]');
  error404Container = (): Locator => this.page.getByTestId('Error404');
  error404Text = (): Locator => this.page.getByRole('paragraph').filter({ hasText: /Error 404/i });

  async getProductCount(): Promise<number> {
    return await this.productCards().count();
  }
}
