import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HeaderSearchPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Header/root input is the active search field; no dialog is opened for this flow.
  searchInput       = () => this.page.getByRole('searchbox', { name: /search/i }).or(this.page.getByLabel(/search/i)).or(this.page.getByPlaceholder(/search/i)).filter({ visible: true }).first();
  dialogSearchInput = () => this.page.getByRole('searchbox', { name: /search/i }).or(this.page.getByLabel(/search/i)).or(this.page.getByPlaceholder(/search/i)).filter({ visible: true }).first();

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
