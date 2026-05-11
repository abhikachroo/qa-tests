import { expect } from '@playwright/test';
import { SearchPage } from '@pages/SearchPage';
import { HeaderSearchPage } from '@pages/HeaderSearchPage';
import { SearchResultsPage } from '@pages/SearchResultsPage';
import { ProductDetailPage } from '@pages/ProductDetailPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class SearchModule {
  private logger: Logger;

  constructor(
    private searchPage: SearchPage,
    private headerSearchPage: HeaderSearchPage,
    private searchResultsPage: SearchResultsPage,
    private productDetailPage: ProductDetailPage,
  ) {
    this.logger = new Logger('SearchModule');
  }

  async openStorefrontAsGuest(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Opening storefront as guest`);
    await this.headerSearchPage.navigate('/');
    await this.headerSearchPage.waitForPageLoad();
    await this.headerSearchPage.dismissCookieBannerIfPresent();
  }

  async verifyGuestHeaderSearchAvailable(): Promise<void> {
    this.logger.info('Verifying guest header search is available');
    await expect(this.headerSearchPage.searchInput()).toBeVisible();
    await expect(this.headerSearchPage.loginLink()).toBeVisible();
    await expect(this.headerSearchPage.signUpLink()).toBeVisible();
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
    await this.openStorefrontAsGuest();
    await this.headerSearchPage.fillSearchInput(keyword);
    await expect(this.headerSearchPage.submitButton()).toBeEnabled();
    await this.headerSearchPage.clickSubmitButton();
    await this.headerSearchPage.waitForSearchNavigation(keyword);
    this.logger.info(`Header search submitted — URL now contains /search/${keyword}`);
  }

  async verifySearchResultsPage(keyword: string): Promise<void> {
    this.logger.info(`Verifying search results page contains results for: "${keyword}"`);
    await expect(this.searchResultsPage.productCountSummary()).toBeVisible();
    await expect(this.searchResultsPage.productIdText(keyword)).toBeVisible();
    this.logger.info('Search results page verified');
  }

  async verifyProductResultDisplayed(productId: string): Promise<void> {
    this.logger.info(`Verifying product result card for: "${productId}"`);
    await expect(this.searchResultsPage.productCountSummary()).toContainText(/\d+\s+product/i);
    await expect(this.searchResultsPage.productCard(productId)).toBeVisible();
    await expect(this.searchResultsPage.productTitleLink(productId)).toBeVisible();
    await expect(this.searchResultsPage.productIdReference(productId)).toBeVisible();
  }

  async verifyResultAddToCartDisabled(productId: string): Promise<void> {
    this.logger.info(`Verifying Add to Cart is disabled on results for: "${productId}"`);
    await expect(this.searchResultsPage.productAddToCartButton(productId)).toBeVisible();
    await expect(this.searchResultsPage.productAddToCartButton(productId)).toBeDisabled();
    await expect(this.searchResultsPage.priceError(productId)).toBeVisible();
    await expect(this.searchResultsPage.cartButton()).toBeVisible();
  }

  async openProductDetail(productId: string): Promise<void> {
    this.logger.info(`Opening product detail page for: "${productId}"`);
    await this.searchResultsPage.clickProductTitle(productId);
    await this.productDetailPage.waitForProductDetailUrl(productId);
    await this.productDetailPage.waitForPageLoad();
  }

  async verifyProductDetailDisabledState(productId: string, expectedPriceMessage: string): Promise<void> {
    this.logger.info(`Verifying product detail disabled Add to Cart state for: "${productId}"`);
    await expect(this.productDetailPage.productIdReference()).toContainText(productId);
    await expect(this.productDetailPage.priceError(productId)).toContainText(expectedPriceMessage);
    await expect(this.productDetailPage.buyboxQuantitySelector()).toBeVisible();
    await expect(this.productDetailPage.addToCartButton()).toBeVisible();
    await expect(this.productDetailPage.addToCartButton()).toBeDisabled();
  }

  async verifyDisabledAddToCartDoesNotMutateCart(productId: string): Promise<void> {
    this.logger.info(`Verifying disabled Add to Cart cannot mutate cart for: "${productId}"`);
    await expect(this.searchResultsPage.productAddToCartButton(productId)).toBeDisabled();
    await expect(this.searchResultsPage.cartButton()).toBeVisible();
    await expect(this.searchResultsPage.cartButton()).not.toContainText(/[1-9]/);
  }

  async verifyEmptyHeaderSearchCannotSubmit(): Promise<void> {
    this.logger.info('Verifying empty header search cannot be submitted');
    await this.openStorefrontAsGuest();
    await this.headerSearchPage.clearSearchInput();
    await expect(this.headerSearchPage.submitButton()).toBeDisabled();
    await this.headerSearchPage.pressEnterInSearchInput();
    await expect(this.headerSearchPage.submitButton()).toBeDisabled();
  }

  async verifyNoResultsDisplayed(): Promise<void> {
    this.logger.info('Verifying no-results state is displayed');
    await expect(this.searchPage.noResultsMessage()).toBeVisible();
    const count = await this.searchPage.getProductCount();
    expect(count, 'Product cards should not be present when no results').toBe(0);
    this.logger.info('No-results state verified');
  }
}
