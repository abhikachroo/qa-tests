import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HeaderSearchPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  searchInput  = () => this.page.getByTestId('search-bar-input');
  submitButton = () => this.page.getByLabel('Submit search');
  loginLink    = () => this.page.getByTestId('login-button');
  signupLink   = () => this.page.getByTestId('signup-button');

  async fillSearchInput(keyword: string): Promise<void> {
    await this.searchInput().click();
    await this.searchInput().fill(keyword);
  }

  async clearSearchInput(): Promise<void> {
    await this.searchInput().fill('');
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
    return this.searchInput().inputValue();
  }
}
