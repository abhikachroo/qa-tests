import { expect } from '@playwright/test';
import { OrdersQuotesPage } from '@pages/OrdersQuotesPage';
import { Logger } from '@utils/Logger';

export class OrdersQuotesModule {
  private logger: Logger;

  constructor(private ordersQuotesPage: OrdersQuotesPage) {
    this.logger = new Logger('OrdersQuotesModule');
  }

  async navigateToQuotes(): Promise<void> {
    this.logger.info('Navigating from Orders menu to Quotes submenu');
    await this.ordersQuotesPage.clickOrdersButton();
    await this.ordersQuotesPage.clickQuotesSubmenuLink();
    await this.ordersQuotesPage.waitForPageLoad();
  }

  async searchQuote(quoteId: string): Promise<void> {
    this.logger.info('Searching for quote in Quotes page');
    await this.ordersQuotesPage.fillQuoteSearch(quoteId);
    await this.ordersQuotesPage.clickQuoteSearchButton();
    await this.ordersQuotesPage.waitForPageLoad();
  }

  async verifyAuthenticatedHeader(): Promise<void> {
    this.logger.info('Verifying authenticated account header is visible');
    await expect(
      this.ordersQuotesPage.accountSettingsButton(),
      'Authenticated account indicator should be visible',
    ).toBeVisible();
  }

  async verifyQuotesPageLoaded(): Promise<void> {
    this.logger.info('Verifying Quotes page heading is visible');
    await expect(
      this.ordersQuotesPage.quotesHeading(),
      'Quotes heading should be visible after submenu navigation',
    ).toBeVisible();
  }

  async verifyQuoteAvailable(quoteId: string): Promise<void> {
    this.logger.info('Verifying quote is available in the Quotes table');
    await expect(
      this.ordersQuotesPage.quotesTable(),
      'Quotes table should be visible after searching',
    ).toBeVisible();
    await expect(
      this.ordersQuotesPage.quoteLink(quoteId),
      `Quote ${quoteId} should be visible in filtered Quotes results`,
    ).toBeVisible();
  }
}
