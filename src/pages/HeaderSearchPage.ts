import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class HeaderSearchPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Confirmed selector from live UI inspection: data-testid="search-bar-input"
  searchInput = (): Locator => this.page.getByTestId('search-bar-input');
  // Submit button identified by accessible label
  submitButton = (): Locator => this.page.getByLabel('Submit search');
  loginButton = (): Locator => this.page.getByTestId('login-button');
  cartButton = (): Locator => this.page.getByTestId('cart-button');

  async fillSearchInput(keyword: string): Promise<void> {
    await this.searchInput().click();
    await this.searchInput().fill(keyword);
  }

  async clearSearchInput(): Promise<void> {
    await this.searchInput().click();
    await this.searchInput().fill('');
  }

  async focusSearchInput(): Promise<void> {
    await this.searchInput().focus();
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
