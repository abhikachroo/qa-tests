import { expect } from '@playwright/test';
import { SearchResultsPage } from '@pages/SearchResultsPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

/**
 * SearchProductModule — Layer 3 (Module)
 *
 * Business-logic workflows for searching products.
 * URL pattern confirmed from live app:
 *   /catalog/en-gb/search/{keyword}?version=1
 *
 * All browser interactions are delegated to SearchResultsPage methods.
 * No direct page.locator() calls in this class.
 */
export class SearchProductModule {
  private logger: Logger;

  constructor(private searchResultsPage: SearchResultsPage) {
    this.logger = new Logger('SearchProductModule');
  }

  /**
   * Navigates directly to the catalog search results page for the given keyword.
   * Uses the live URL pattern (not the legacy /search?q= pattern).
   */
  async navigateToSearchResults(keyword: string): Promise<void> {
    this.logger.info(
      `[${config.opco}][${config.environment}] Navigating to search for: "${keyword}"`,
    );
    await this.searchResultsPage.navigate(
      `/catalog/en-gb/search/${encodeURIComponent(keyword)}?version=1`,
    );
    await this.searchResultsPage.waitForPageLoad();
    await this.searchResultsPage.dismissCookieBannerIfPresent();
    this.logger.info('Search results page loaded');
  }

  /**
   * Asserts that the no-results container is visible (error state).
   */
  async verifyNoResultsContainerVisible(): Promise<void> {
    this.logger.info('Verifying no-results container is visible');
    await expect(
      this.searchResultsPage.noResultsContainer(),
      'No-results container [data-testid="searchNoResultsFound"] must be visible',
    ).toBeVisible();
    this.logger.info('No-results container confirmed visible');
  }

  /**
   * Asserts that the no-results H1 heading contains the searched keyword.
   */
  async verifyNoResultsHeadingContainsKeyword(keyword: string): Promise<void> {
    this.logger.info(`Verifying no-results heading contains keyword: "${keyword}"`);
    await expect(
      this.searchResultsPage.noResultsHeading(),
      `Heading [data-testid="heading"] must contain searched keyword "${keyword}"`,
    ).toContainText(keyword);
    this.logger.info('No-results heading keyword verified');
  }

  /**
   * Asserts that the descriptive paragraph below the heading is visible.
   */
  async verifyNoResultsDescriptionVisible(): Promise<void> {
    this.logger.info('Verifying no-results description paragraph is visible');
    await expect(
      this.searchResultsPage.noResultsDesc(),
      'Description [data-testid="description"] must be visible',
    ).toBeVisible();
    this.logger.info('No-results description confirmed visible');
  }

  /**
   * Asserts that no product cards are rendered — confirming zero results.
   */
  async verifyZeroProductCards(): Promise<void> {
    this.logger.info('Verifying zero product cards are present');
    await expect(
      this.searchResultsPage.productCards(),
      'Product cards [data-testid="product-list-card-container"] must not be present',
    ).toHaveCount(0);
    this.logger.info('Zero product cards confirmed');
  }
}
