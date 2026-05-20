import { expect } from '@playwright/test';
import { OrdersQuotesPage } from '@pages/OrdersQuotesPage';
import { Logger } from '@utils/Logger';

export class OrdersQuotesModule {
  private logger: Logger;

  constructor(private ordersQuotesPage: OrdersQuotesPage) {
    this.logger = new Logger('OrdersQuotesModule');
  }

  async navigateToQuotes(): Promise<void> {
    this.logger.info('Navigating through Orders menu to Quotes');
    await this.ordersQuotesPage.clickOrdersMenu();
    await this.ordersQuotesPage.clickQuotesSubmenuLink();
    await this.ordersQuotesPage.waitForPageLoad();
    this.logger.info('Quotes page navigation completed');
  }

  async searchQuote(quoteId: string): Promise<void> {
    this.logger.info('Searching for quote in Quotes page');
    await this.ordersQuotesPage.fillQuoteSearch(quoteId);
    await this.ordersQuotesPage.clickQuoteSearchButton();
    await this.ordersQuotesPage.waitForPageLoad();
    this.logger.info('Quote search submitted');
  }

  async verifyAuthenticatedState(): Promise<void> {
    this.logger.info('Verifying authenticated account state');
    await expect(
      this.ordersQuotesPage.userDetailsButton(),
      'Account & settings button should be visible for an authenticated user',
    ).toBeVisible();
  }

  async verifyQuotesPageDisplayed(): Promise<void> {
    this.logger.info('Verifying Quotes page is displayed');
    await expect(
      this.ordersQuotesPage.quotesHeading(),
      'Quotes page heading should be visible',
    ).toBeVisible();
  }

  async verifyQuoteAvailable(quoteId: string): Promise<void> {
    this.logger.info('Verifying target quote is available');
    await expect(
      this.ordersQuotesPage.quoteLink(quoteId),
      `Quote ${quoteId} should be visible in Quotes`,
    ).toBeVisible();
  }
}
