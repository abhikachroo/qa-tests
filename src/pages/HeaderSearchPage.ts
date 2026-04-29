import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HeaderSearchPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Confirmed selector from live UI inspection: data-testid="search-bar-input"
  searchInput  = () => this.page.getByTestId('search-bar-input');

  // Submit button identified by accessible role + name
  submitButton = () => this.page.getByRole('button', { name: 'Submit search' });

  // Cart header button / badge — data-testid confirmed live (strategy: data-testid)
  cartButton   = () => this.page.getByTestId('cart-button');

  async fillSearchInput(keyword: string): Promise<void> {
    await this.searchInput().click();
    await this.searchInput().fill(keyword);
  }

  async clickSubmitButton(): Promise<void> {
    await this.submitButton().click();
  }

  async waitForSearchNavigation(keyword: string): Promise<void> {
    await this.page.waitForURL(`**/search/${keyword}**`, { timeout: 30_000 });
  }

  async getSearchInputValue(): Promise<string> {
    return (await this.searchInput().inputValue()) ?? '';
  }

  async clickCartButton(): Promise<void> {
    await this.cartButton().click();
  }
}
