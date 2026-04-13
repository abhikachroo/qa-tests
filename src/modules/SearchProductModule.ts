import { expect } from '@playwright/test';
import { SearchResultsPage } from '@pages/SearchResultsPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

/**
 * SearchProductModule — Layer 3 (Business logic workflows)
 *
 * Orchestrates search product user flows using SearchResultsPage methods.
 * URL pattern used: /catalog/en-gb/search/{keyword}?version=1
 *
 * NOTE: The config.searchPath (/search) does not match the actual Spark catalog
 * search URL. This module uses the confirmed URL structure from the live app.
 */
export class SearchProductModule {
  private readonly logger: Logger;
  /** Base path for catalog search on Spark. Derived from live app inspection. */
  private readonly catalogSearchPath = '/catalog/en-gb/search';

  constructor(private readonly searchResultsPage: SearchResultsPage) {
    this.logger = new Logger('SearchProductModule');
  }

  /**
   * Navigate to the homepage and perform a search via the header search bar.
   * @param keyword - The search term to enter
   */
  async searchFromHomepage(keyword: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Navigating to homepage`);
    await this.searchResultsPage.navigate('/');
    await this.searchResultsPage.waitForPageLoad();
    await this.searchResultsPage.dismissCookieBannerIfPresent();
    this.logger.info(`Filling search input with: "${keyword}"`);
    await this.searchResultsPage.fillSearchInput(keyword);
    await this.searchResultsPage.submitSearch();
    await this.searchResultsPage.waitForPageLoad();
    this.logger.info(`Search submitted — URL: ${this.searchResultsPage.getCurrentUrl}`);
  }

  /**
   * Navigate directly to the search results page by URL.
   * @param keyword - The search term to navigate to
   */
  async navigateToSearchResults(keyword: string): Promise<void> {
    const encodedKeyword = encodeURIComponent(keyword);
    const path = `${this.catalogSearchPath}/${encodedKeyword}?version=1`;
    this.logger.info(`[${config.opco}][${config.environment}] Navigating to search URL: ${path}`);
    await this.searchResultsPage.navigate(path);
    await this.searchResultsPage.waitForPageLoad();
    await this.searchResultsPage.dismissCookieBannerIfPresent();
    this.logger.info("Search results page loaded");
  }

  /**
   * Verify the no-results state is correctly displayed.
   * Asserts: container visible, heading contains keyword, description visible.
   * @param keyword - The keyword that was searched (used to verify heading text)
   */
  async verifyNoResultsState(keyword: string): Promise<void> {
    this.logger.info(`Verifying no-results state for keyword: "${keyword}"`);
    await expect(
      this.searchResultsPage.noResultsContainer(),
      'No-results container should be visible'
    ).toBeVisible();
    await expect(
      this.searchResultsPage.noResultsHeading(),
      `No-results heading should mention the searched keyword`
    ).toContainText(keyword);
    await expect(
      this.searchResultsPage.noResultsDescription(),
      'No-results description should be visible'
    ).toBeVisible();
    const count = await this.searchResultsPage.getProductCount();
    expect(count, 'No product cards should be shown in no-results state').toBe(0);
    this.logger.info("No-results state verified successfully");
  }

  /**
   * Verify valid search results are displayed.
   * Asserts: product list visible, product count > 0, product count text present.
   */
  async verifyResultsDisplayed(): Promise<void> {
    this.logger.info("Verifying search results are displayed");
    await expect(
      this.searchResultsPage.productListContainer(),
      'Product list container should be visible'
    ).toBeVisible();
    await expect(
      this.searchResultsPage.productListCount(),
      'Product list count element should be visible'
    ).toBeVisible();
    const count = await this.searchResultsPage.getProductCount();
    expect(count, 'At least one product card should be present').toBeGreaterThan(0);
    this.logger.info(`Results verified — ${count} product cards displayed`);
  }

  /**
   * Verify the search bar in the header is pre-filled with the searched keyword.
   * @param keyword - Expected value of the search input
   */
  async verifySearchBarPreFilled(keyword: string): Promise<void> {
    this.logger.info(`Verifying search bar is pre-filled with: "${keyword}"`);
    await expect(
      this.searchResultsPage.searchBarInput(),
      `Search bar should contain the search term: ${keyword}`
    ).toHaveValue(keyword);
    this.logger.info("Search bar pre-fill verified");
  }
}
