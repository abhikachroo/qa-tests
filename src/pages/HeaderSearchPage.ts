import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HeaderSearchPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Header/root input opens the search dialog when focused.
  searchInput       = () => this.page.getByRole('textbox', { name: /search/i });
  dialogSearchInput = () => this.page.getByRole('textbox', { name: /search/i });

  async fillSearchInput(keyword: string): Promise<void> {
    await this.searchInput().click();
    await this.dialogSearchInput().fill(keyword);
  }

  async clickSubmitButton(): Promise<void> {
    await this.dialogSearchInput().press('Enter');
  }

  async waitForSearchNavigation(keyword: string): Promise<void> {
    await this.page.waitForURL(`**/search/${keyword}**`, { timeout: 30_000 });
  }

  async getSearchInputValue(): Promise<string> {
    return (await this.dialogSearchInput().inputValue()) ?? '';
  }
}
