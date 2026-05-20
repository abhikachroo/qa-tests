import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class OrdersQuotesPage extends BasePage {
  constructor(page: Page) { super(page); }

  // Header navigation — post-login authenticated state (strategy: data-testid)
  userDetailsButton = (): Locator => this.page.getByTestId('user-details-button');

  // Primary navigation menu (strategy: role+text)
  ordersMenuButton = (): Locator => this.page.getByRole('button', { name: 'Orders' });

  // Orders submenu link (strategy: id)
  quotesSubmenuLink = (): Locator => this.page.locator('#account-quotes');

  // Quotes page heading (strategy: role+text)
  quotesHeading = (): Locator => this.page.getByRole('heading', { name: 'Quotes' });

  // Quotes search field (strategy: data-testid)
  quotesSearchField = (): Locator => this.page.getByTestId('search-field');

  // Quotes search button (strategy: data-testid)
  quotesSearchButton = (): Locator => this.page.getByTestId('search-field-search-button');

  // Quote link in Quotes list/results (strategy: role+text)
  quoteLink = (quoteId: string): Locator => this.page.getByRole('link', { name: quoteId });

  async clickOrdersMenu(): Promise<void> {
    await this.ordersMenuButton().click();
  }

  async clickQuotesSubmenuLink(): Promise<void> {
    await this.quotesSubmenuLink().click();
  }

  async fillQuoteSearch(quoteId: string): Promise<void> {
    await this.quotesSearchField().fill(quoteId);
  }

  async clickQuoteSearchButton(): Promise<void> {
    await this.quotesSearchButton().click();
  }
}
