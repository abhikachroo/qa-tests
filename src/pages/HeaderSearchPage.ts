import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HeaderSearchPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Confirmed selector from live UI inspection: data-testid="search-bar-input"
  searchInput  = () => this.page.getByTestId('search-bar-input');
  // Submit button identified by accessible label
  submitButton = () => this.page.getByLabel('Submit search');
  loginLink    = () => this.page.getByTestId('login-button');
  signUpLink   = () => this.page.getByTestId('signup-button');
  cartButton   = () => this.page.getByTestId('cart-button');

  async fillSearchInput(keyword: string): Promise<void> {
    await this.searchInput().click();
    await this.searchInput().fill(keyword);
  }

  async clearSearchInput(): Promise<void> {
    await this.searchInput().clear();
  }

  async pressEnterInSearchInput(): Promise<void> {
    await this.searchInput().press('Enter');
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
}
