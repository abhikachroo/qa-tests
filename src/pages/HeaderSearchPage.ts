import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HeaderSearchPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Header/root input opens the search dialog when focused.
  searchInput       = () => this.page.getByTestId('volt-search-box-root').getByTestId('search-bar-input');
  dialogSearchInput = () => this.page.getByTestId('volt-search-dialog').getByTestId('search-bar-input');
  searchSubmitButton = () => this.page.getByTestId('volt-search-dialog').getByRole('button', { name: /search|submit/i });

  async fillSearchInput(keyword: string): Promise<void> {
    await this.searchInput().click();
    await this.dialogSearchInput().fill(keyword);
  }

  async clickSubmitButton(): Promise<void> {
    await this.searchSubmitButton().click();
  }

  async waitForSearchNavigation(keyword: string): Promise<void> {
    await this.page.waitForURL(`**/search/${keyword}**`, { timeout: 30_000 });
  }

  async getSearchInputValue(): Promise<string> {
    return (await this.dialogSearchInput().inputValue()) ?? '';
  }
}
