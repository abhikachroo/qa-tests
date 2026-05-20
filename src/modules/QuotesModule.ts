import { expect }     from '@playwright/test';
import { QuotesPage } from '@pages/QuotesPage';
import { Logger }     from '@utils/Logger';

export class QuotesModule {
  private logger: Logger;

  constructor(private quotesPage: QuotesPage) {
    this.logger = new Logger('QuotesModule');
  }

  async navigateToQuotes(): Promise<void> {
    this.logger.info('Opening Orders menu and navigating to Quotes');
    await this.quotesPage.clickOrdersButton();
    await this.quotesPage.clickQuotesSubmenuLink();
    await this.quotesPage.waitForPageLoad();
  }

  async verifyQuotesPageDisplayed(): Promise<void> {
    this.logger.info('Verifying Quotes page heading and table are displayed');
    await expect(this.quotesPage.quotesHeading()).toBeVisible();
    await expect(this.quotesPage.quotesTable()).toBeVisible();
  }

  async searchQuote(quoteId: string): Promise<void> {
    this.logger.info(`Searching for quote: ${quoteId}`);
    await this.quotesPage.fillQuoteSearch(quoteId);
    await this.quotesPage.clickQuoteSearchButton();
    await this.quotesPage.waitForPageLoad();
  }

  async verifyQuoteAvailable(quoteId: string): Promise<void> {
    this.logger.info(`Verifying quote is available: ${quoteId}`);
    await expect(this.quotesPage.filteredResultCount()).toBeVisible();
    await expect(this.quotesPage.quoteLink(quoteId)).toBeVisible();
  }
}
