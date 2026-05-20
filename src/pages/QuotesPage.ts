import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class QuotesPage extends BasePage {
  constructor(page: Page) { super(page); }

  // Home navigation — Orders primary navigation button (strategy: role+text)
  ordersButton = (): Locator => this.page.getByRole('button', { name: 'Orders' });

  // Orders submenu — Quotes link (strategy: id)
  quotesSubmenuLink = (): Locator => this.page.locator('#account-quotes');

  // Quotes page heading (strategy: role+text)
  quotesHeading = (): Locator => this.page.getByRole('heading', { name: 'Quotes', level: 1 });

  // Quotes table (strategy: role+text)
  quotesTable = (): Locator => this.page.getByRole('table', { name: 'Quotes' });

  // Quote search field (strategy: data-testid)
  quoteSearchField = (): Locator => this.page.getByTestId('search-field');

  // Quote search button (strategy: data-testid)
  quoteSearchButton = (): Locator => this.page.getByTestId('search-field-search-button');

  // Filtered result count (strategy: text)
  filteredResultCount = (): Locator => this.page.getByText('1 of 1 quotes');

  // Target quote link (strategy: role+text)
  quoteLink = (quoteId: string): Locator => this.page.getByRole('link', { name: quoteId });

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
