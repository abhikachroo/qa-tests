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

  /**
   * Navigate directly to the search results URL using the legacy query-string approach.
   * Used by: TC-SEARCH-05 (no-results test)
   */
  async navigateToSearchResults(keyword: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Navigating to search results for: "${keyword}"`);
    await this.searchPage.navigate(`${config.searchPath}?q=${encodeURIComponent(keyword)}`);
    await this.searchPage.waitForPageLoad();
    await this.searchPage.dismissCookieBannerIfPresent();
    this.logger.info('Search results page loaded');
  }

  /**
   * Submit a search via the header search bar UI.
   * Flow: navigate to homepage -> dismiss cookie banner -> fill search input -> click Submit
   *       -> wait for URL redirect via waitForSearchNavigation().
   *
   * Note: waitForPageLoad() is intentionally omitted after navigate('/').
   * This SPA maintains persistent background XHR (analytics, lazy widgets) that
   * prevent 'networkidle' from ever resolving. The waitForURL() guard inside
   * waitForSearchNavigation() is sufficient to confirm the search transition.
   *
   * Used by: TC-E2E-001 (TC-002 step)
   */
  async submitSearch(keyword: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Submitting header search for: "${keyword}"`);
    await this.headerSearchPage.navigate('/');
    await this.headerSearchPage.dismissCookieBannerIfPresent();
    await this.headerSearchPage.fillSearchInput(keyword);
    await this.headerSearchPage.clickSubmitButton();
    await this.headerSearchPage.waitForSearchNavigation(keyword);
    this.logger.info(`Header search submitted -- URL now contains /search/${keyword}`);
  }

  /**
   * Verify that the search results page shows the expected product count summary
   * and that the searched product ID is visible on the page.
   * Used by: TC-E2E-001 (TC-002 step)
   */
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

  /**
   * Verify the no-results state for an unknown keyword.
   * Used by: TC-SEARCH-05
   */
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
