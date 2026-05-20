import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class OrdersQuotesPage extends BasePage {
  constructor(page: Page) { super(page); }

  accountSettingsButton = (): Locator => this.page.getByTestId('user-details-button');
  ordersButton = (): Locator => this.page.getByRole('button', { name: 'Orders' }); // strategy: role+name
  quotesSubmenuLink = (): Locator => this.page.getByText('Quotes', { exact: true }); // strategy: exact visible text
  quotesHeading = (): Locator => this.page.getByRole('heading', { name: 'Quotes' }); // strategy: role+name
  quoteSearchField = (): Locator => this.page.getByTestId('search-field');
  quoteSearchButton = (): Locator => this.page.getByTestId('search-field-search-button');
  quotesTable = (): Locator => this.page.getByRole('table', { name: 'Quotes' }); // strategy: role+name
  quoteLink = (quoteId: string): Locator => this.page.getByRole('link', { name: quoteId }); // strategy: role+name

  async clickOrdersButton(): Promise<void> {
    await this.ordersButton().click();
  }

  async clickQuotesSubmenuLink(): Promise<void> {
    await this.quotesSubmenuLink().click();
  }

  async fillQuoteSearch(quoteId: string): Promise<void> {
    await this.quoteSearchField().fill(quoteId);
  }

  async clickQuoteSearchButton(): Promise<void> {
    await this.quoteSearchButton().click();
  }
}
