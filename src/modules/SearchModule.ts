import { expect }           from '@playwright/test';
import { SearchPage }        from '@pages/SearchPage';
import { HeaderSearchPage }  from '@pages/HeaderSearchPage';
import { SearchResultsPage } from '@pages/SearchResultsPage';
import { ProductDetailPage } from '@pages/ProductDetailPage';
import { Logger }            from '@utils/Logger';
import { config }            from '@config/index';

export class SearchModule {
  private logger: Logger;

  constructor(
    private searchPage:        SearchPage,
    private headerSearchPage:  HeaderSearchPage,
    private searchResultsPage: SearchResultsPage,
    private productDetailPage?: ProductDetailPage,
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

  async navigateToCatalogSearch(keyword: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Navigating to catalog search for: "${keyword}"`);
    await this.searchResultsPage.navigate(`/catalog/en-gb/search/${encodeURIComponent(keyword)}?version=1`);
    await this.searchResultsPage.waitForPageLoad();
    await this.searchResultsPage.dismissCookieBannerIfPresent();
    this.logger.info('Catalog search results page loaded');
  }

  /**
   * Submit a search via the header search bar UI.
   * Flow: navigate to homepage → fill search input → click Submit → wait for URL redirect.
   * Used by: TC-002
   */
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

  async submitSearchWithEnter(keyword: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Submitting header search with Enter for: "${keyword}"`);
    await this.headerSearchPage.navigate('/');
    await this.headerSearchPage.waitForPageLoad();
    await this.headerSearchPage.dismissCookieBannerIfPresent();
    await this.headerSearchPage.fillSearchInput(keyword);
    await this.headerSearchPage.pressEnterInSearchInput();
    await this.headerSearchPage.waitForSearchNavigation(keyword);
    this.logger.info(`Header search submitted via Enter — URL now contains /search/${keyword}`);
  }

  async navigateToProductDetail(productSlug: string): Promise<void> {
    if (!this.productDetailPage) {
      throw new Error('ProductDetailPage fixture is required for product detail navigation');
    }
    this.logger.info(`[${config.opco}][${config.environment}] Navigating to product detail: "${productSlug}"`);
    await this.productDetailPage.navigateToProduct(productSlug);
    await this.productDetailPage.waitForPageLoad();
    await this.productDetailPage.dismissCookieBannerIfPresent();
    this.logger.info('Product detail page loaded');
  }

  /**
   * Verify that the search results page shows the expected product count summary
   * and that the searched product ID is visible on the page.
   * Used by: TC-002
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

  async verifyProductResultIdentity(productId: string, expectedTitleFragment: string): Promise<void> {
    this.logger.info(`Verifying product result identity for: "${productId}"`);
    await expect(this.searchResultsPage.productCountSummary()).toBeVisible();
    await expect(this.searchResultsPage.productCard(productId)).toBeVisible();
    await expect(this.searchResultsPage.productTitle(productId)).toContainText(expectedTitleFragment);
    await expect(this.searchResultsPage.productIdReference(productId)).toBeVisible();
    this.logger.info('Product result identity verified');
  }

  async verifySearchResultPurchaseControlsDisabled(productId: string, expectedQuantity: string): Promise<void> {
    this.logger.info(`Verifying disabled purchase controls for product result: "${productId}"`);
    await expect(this.searchResultsPage.addToCartButton(productId)).toBeDisabled();
    await expect(this.searchResultsPage.quantityInput(productId)).toBeDisabled();
    await expect(this.searchResultsPage.quantityInput(productId)).toHaveValue(expectedQuantity);
    await expect(this.searchResultsPage.decrementButton(productId)).toBeDisabled();
    await expect(this.searchResultsPage.incrementButton(productId)).toBeDisabled();
    await expect(this.searchResultsPage.priceError(productId)).toBeVisible();
    this.logger.info('Disabled product result purchase controls verified');
  }

  async openProductDetailFromResults(productId: string): Promise<void> {
    this.logger.info(`Opening product detail from results for product: "${productId}"`);
    await this.searchResultsPage.clickProductTitle(productId);
    await this.searchResultsPage.waitForPageLoad();
    this.logger.info('Product detail opened from search result');
  }

  async verifyProductDetailDisabledState(productId: string, expectedTitleFragment: string, expectedQuantity: string): Promise<void> {
    if (!this.productDetailPage) {
      throw new Error('ProductDetailPage fixture is required for product detail assertions');
    }
    this.logger.info(`Verifying product detail disabled state for product: "${productId}"`);
    await expect(this.productDetailPage.productHeading()).toContainText(expectedTitleFragment);
    await expect(this.productDetailPage.productIdReference(productId)).toContainText(productId);
    await expect(this.productDetailPage.addToCartButton()).toBeDisabled();
    await expect(this.productDetailPage.buyboxQuantityInput()).toBeDisabled();
    await expect(this.productDetailPage.buyboxQuantityInput()).toHaveValue(expectedQuantity);
    await expect(this.productDetailPage.decrementButton()).toBeDisabled();
    await expect(this.productDetailPage.incrementButton()).toBeDisabled();
    await expect(this.productDetailPage.priceError(productId)).toBeVisible();
    this.logger.info('Product detail disabled state verified');
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
