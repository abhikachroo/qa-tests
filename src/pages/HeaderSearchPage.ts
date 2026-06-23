import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HeaderSearchPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Header/root search control and dialog submit button.
  searchInput = () => this.page.getByRole('searchbox', { name: /search input/i }).first();
  dialogSearchInput = () => this.page.getByRole('searchbox', { name: /search input/i }).first();

  async fillSearchInput(keyword: string): Promise<void> {
    await this.searchInput().click();
    await this.dialogSearchInput().fill(keyword);
  }

  async clickSubmitButton(): Promise<void> {
    await this.page.getByRole('button', { name: /submit search/i }).click();
  }

  async waitForSearchNavigation(keyword: string): Promise<void> {
    await this.page.waitForURL(`**/search/${keyword}**`, { timeout: 30_000 });
  }

  async getSearchInputValue(): Promise<string> {
    return (await this.dialogSearchInput().inputValue()) ?? '';
  }
}
