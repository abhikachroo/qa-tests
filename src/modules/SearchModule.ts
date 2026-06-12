import { expect }           from '@playwright/test';
import { SearchPage }        from '@pages/SearchPage';
import { HeaderSearchPage }  from '@pages/HeaderSearchPage';
import { SearchResultsPage } from '@pages/SearchResultsPage';
import { Logger }            from '@utils/Logger';
import { config }            from '@config/index';

export class SearchModule {
  private logger: Logger;

  constructor(
    private searchPage:        SearchPage,
    private headerSearchPage:  HeaderSearchPage,
    private searchResultsPage: SearchResultsPage,
  ) {
    this.logger = new Logger('SearchModule');
  }

  async navigateToSearchResults(keyword: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Navigating to search results for: "${keyword}"`);
    await this.searchPage.navigate(`${config.searchPath}?q=${encodeURIComponent(keyword)}`);
    await this.searchPage.waitForPageLoad();
    await this.searchPage.dismissCookieBannerIfPresent();
    this.logger.info('Search results page loaded');
  }

  async submitSearch(keyword: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Submitting header search for: "${keyword}"`);
    await this.headerSearchPage.navigate('/');
    await this.headerSearchPage.waitForPageLoad();
    await this.headerSearchPage.dismissCookieBannerIfPresent();
    await this.headerSearchPage.fillSearchInput(keyword);
    await this.headerSearchPage.clickSubmitButton();
    await this.headerSearchPage.waitForSearchNavigation(keyword);
    this.logger.info(`Header search submitted — URL now contains /search/${keyword}`);
  }

  async verifySearchResultsPage(keyword: string): Promise<void> {
    this.logger.info(`Verifying search results page contains results for: "${keyword}"`);
    await expect(
      this.searchResultsPage.productCountSummary(),
      'Product count summary should be visible',
    ).toBeVisible();
    await expect(
      this.searchResultsPage.productIdText(keyword),
      `Product ID "${keyword}" should appear on the results page`,
    ).toBeVisible();
    this.logger.info('Search results page verified');
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

  async openSearchResultByProductId(productId: string): Promise<void> {
    this.logger.info(`Opening search result for product ID: "${productId}"`);
    await expect(
      this.searchResultsPage.productIdText(productId),
      `Product ID "${productId}" should be visible before opening the PDP`,
    ).toBeVisible();
    await this.searchResultsPage.productCard(productId).click();
    this.logger.info('PDP opened from search results');
  }
}
