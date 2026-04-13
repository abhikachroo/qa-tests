import { expect } from '@playwright/test';
import { SearchPage } from '@pages/SearchPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class SearchModule {
  private logger: Logger;

  constructor(private searchPage: SearchPage) {
    this.logger = new Logger('SearchModule');
  }

  async navigateToSearchResults(keyword: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Navigating to search results for: "${keyword}"`);
    await this.searchPage.navigate(`${config.searchPath}?q=${encodeURIComponent(keyword)}`);
    await this.searchPage.waitForPageLoad();
    await this.searchPage.dismissCookieBannerIfPresent();
    this.logger.info('Search results page loaded');
  }

  async verifyNoResultsDisplayed(): Promise<void> {
    this.logger.info('Verifying no-results state is displayed');
    await expect(
      this.searchPage.noResultsMessage(),
      'No-results message should be visible',
    ).toBeVisible();

    const count = await this.searchPage.getProductCount();
    expect(count, 'Product cards should not be present when no results').toBe(0);
    this.logger.info('No-results state verified');
  }
}
