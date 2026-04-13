import { expect } from '@playwright/test';
import { SearchPage } from '@pages/SearchPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class SearchModule {
  private logger: Logger;

  constructor(private searchPage: SearchPage) {
    this.logger = new Logger('SearchModule');
  }

  // ─── Legacy method (kept for backward compatibility) ─────────────────────────
  async navigateToSearchResults(keyword: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Navigating to search results for: "${keyword}"`);
    await this.searchPage.navigate(`${config.searchPath}?q=${encodeURIComponent(keyword)}`);
    await this.searchPage.waitForPageLoad();
    await this.searchPage.dismissCookieBannerIfPresent();
    this.logger.info('Search results page loaded');
  }

  // ─── Legacy assertion (kept for backward compatibility) ──────────────────────
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

  // ─── New methods for invalid-product-search feature ─────────────────────────

  /**
   * Navigates directly to the search results page for the given keyword
   * using the correct URL pattern: /catalog/en-gb/search/{keyword}
   */
  async navigateToInvalidProductSearch(keyword: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Navigating directly to invalid-product search for: "${keyword}"`);
    const url = `${config.baseUrl}/catalog/en-gb/search/${encodeURIComponent(keyword)}`;
    await this.searchPage.navigate(url);
    await this.searchPage.waitForPageLoad();
    await this.searchPage.dismissCookieBannerIfPresent();
    this.logger.info(`Search results page loaded: ${url}`);
  }

  /**
   * Types a search term in the header search bar and submits it.
   */
  async searchViaSearchBar(term: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Searching via search bar for: "${term}"`);
    await this.searchPage.fillSearchInput(term);
    await this.searchPage.clickSubmitSearch();
    await this.searchPage.waitForPageLoad();
    await this.searchPage.dismissCookieBannerIfPresent();
    this.logger.info('Search submitted and results page loaded');
  }

  /**
   * Asserts the H1 heading contains the "Sorry, no result for" message
   * and that the searched term appears within it.
   */
  async verifyNoResultsForTerm(expectedTerm: string): Promise<void> {
    this.logger.info(`Verifying no-results heading for term: "${expectedTerm}"`);
    await expect(
      this.searchPage.noResultsHeading(),
      'No-results H1 heading should be visible',
    ).toBeVisible();
    await expect(
      this.searchPage.noResultsHeading(),
      `Heading should contain "Sorry, no result for"`,
    ).toContainText('Sorry, no result for');
    await expect(
      this.searchPage.noResultsHeading(),
      `Heading should mention the searched term "${expectedTerm}"`,
    ).toContainText(expectedTerm);
    this.logger.info('No-results heading verified');
  }

  /**
   * Asserts the explanatory sub-text paragraph is shown under the heading.
   */
  async verifyNoResultsSubText(): Promise<void> {
    this.logger.info('Verifying no-results sub-text paragraph');
    await expect(
      this.searchPage.noResultsSubText(),
      'No-results sub-text paragraph should be visible',
    ).toBeVisible();
    await expect(
      this.searchPage.noResultsSubText(),
    ).toContainText('We\'re having difficulty finding a match');
    this.logger.info('No-results sub-text verified');
  }

  /**
   * Asserts zero product cards are rendered on the results page.
   */
  async verifyZeroProductCards(): Promise<void> {
    this.logger.info('Verifying no product cards are rendered');
    const count = await this.searchPage.getProductCount();
    expect(count, 'Product cards should not be present when no results').toBe(0);
    this.logger.info(`Product card count confirmed: ${count}`);
  }
}
