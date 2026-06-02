import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HeaderSearchPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Scoped to the header/root search box to avoid matching the search dialog input.
  searchInput  = () => this.page.getByTestId('volt-search-box-root').getByTestId('search-bar-input');
  // Submit button identified by accessible role + name
  submitButton = () => this.page.getByRole('button', { name: 'Submit search' });

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
}
