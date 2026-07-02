import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class HeaderSearchPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Header/root input opens the search dialog when focused.
  searchInput = (): Locator => this.page.getByTestId('volt-search-box-root').getByTestId('search-bar-input');
  dialogSearchInput = (): Locator => this.page.getByTestId('volt-search-dialog').getByTestId('search-bar-input');
  submitSearchButton = (): Locator => this.page.getByLabel('Submit search');
  cartButton = (): Locator => this.page.getByTestId('cart-button');
  searchLoadingIndicator = (): Locator => this.page.getByRole('status').or(this.page.getByRole('progressbar'));

  async openSearchDialog(): Promise<void> {
    await this.searchInput().click();
  }

  async fillDialogSearchInput(keyword: string): Promise<void> {
    await this.dialogSearchInput().fill(keyword);
  }

  async fillSearchInput(keyword: string): Promise<void> {
    await this.openSearchDialog();
    await this.fillDialogSearchInput(keyword);
  }

  async clickSubmitButton(): Promise<void> {
    await this.submitSearchButton().click();
  }

  async pressEnterToSubmit(): Promise<void> {
    await this.dialogSearchInput().press('Enter');
  }

  async clickCartButton(): Promise<void> {
    await this.cartButton().click();
  }

  async waitForSearchNavigation(keyword: string): Promise<void> {
    await this.page.waitForURL(`**/search/${keyword}**`, { timeout: 30_000 });
  }

  async getSearchInputValue(): Promise<string> {
    return await this.dialogSearchInput().inputValue();
  }
}
