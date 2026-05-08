import { expect } from '@playwright/test';
import { HeaderSearchPage } from '@pages/HeaderSearchPage';
import { SearchResultsPage } from '@pages/SearchResultsPage';
import { ProductDetailPage } from '@pages/ProductDetailPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class AnonymousProductModule {
  private logger: Logger;

  constructor(
    private headerSearchPage: HeaderSearchPage,
    private searchResultsPage: SearchResultsPage,
    private productDetailPage: ProductDetailPage,
  ) {
    this.logger = new Logger('AnonymousProductModule');
  }

  async openStorefront(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Opening storefront anonymously`);
    await this.headerSearchPage.navigate('/');
    await this.headerSearchPage.waitForPageLoad();
    await this.headerSearchPage.dismissCookieBannerIfPresent();
  }

  async submitProductSearch(productId: string): Promise<void> {
    this.logger.info(`Searching anonymously for product ${productId}`);
    await this.headerSearchPage.fillSearchInput(productId);
    await this.headerSearchPage.clickSubmitButton();
    await this.headerSearchPage.waitForSearchNavigation(productId);
    await this.searchResultsPage.dismissCookieBannerIfPresent();
  }

  async openProductSearchResults(productId: string): Promise<void> {
    this.logger.info(`Opening anonymous search results for product ${productId}`);
    await this.searchResultsPage.navigateToProductSearch(productId);
    await this.searchResultsPage.waitForPageLoad();
    await this.searchResultsPage.dismissCookieBannerIfPresent();
  }

  async openProductDetail(productDetailPath: string): Promise<void> {
    this.logger.info('Opening anonymous product detail page');
    await this.productDetailPage.navigateToProductDetail(productDetailPath);
    await this.productDetailPage.waitForPageLoad();
    await this.productDetailPage.dismissCookieBannerIfPresent();
  }

  async verifyAnonymousStorefrontHeader(): Promise<void> {
    this.logger.info('Verifying anonymous storefront header controls');
    await expect(this.headerSearchPage.searchInput(), 'Search input should be visible').toBeVisible();
    await expect(this.headerSearchPage.searchInput(), 'Search input should be editable').toBeEditable();
    await expect(this.headerSearchPage.submitButton(), 'Submit search should be disabled for empty input').toBeDisabled();
    await expect(this.headerSearchPage.loginLink(), 'Login link should remain visible for anonymous user').toBeVisible();
    await expect(this.headerSearchPage.cartLink(), 'Cart link should be visible for anonymous user').toBeVisible();
    await expect(this.headerSearchPage.cartLink(), 'Anonymous cart should show zero items').toContainText('0');
  }

  async verifyEmptySearchIsBlocked(): Promise<void> {
    this.logger.info('Verifying empty search cannot be submitted');
    await this.headerSearchPage.clearSearchInput();
    await expect(this.headerSearchPage.searchInput(), 'Search input should be empty').toHaveValue('');
    await expect(this.headerSearchPage.submitButton(), 'Submit search remains disabled for empty search').toBeDisabled();
  }

  async verifySearchResultIdentity(productId: string): Promise<void> {
    this.logger.info(`Verifying search result identity for product ${productId}`);
    await expect(this.searchResultsPage.productCountSummary(), 'Product count summary should be visible').toBeVisible();
    await expect(this.searchResultsPage.productCard(productId), `Product card ${productId} should be visible`).toBeVisible();
    await expect(this.searchResultsPage.productTitle(), 'Product title should be visible').toBeVisible();
    await expect(this.searchResultsPage.productIdText(productId), `Product ID ${productId} should be visible`).toBeVisible();
  }

  async verifySearchResultCartControlsDisabled(productId: string): Promise<void> {
    this.logger.info(`Verifying anonymous cart controls are disabled on search result ${productId}`);
    await expect(this.searchResultsPage.addToCartButton(), 'Add to Cart CTA should be visible on search result').toBeVisible();
    await expect(this.searchResultsPage.addToCartButton(), 'Add to Cart CTA should be disabled for anonymous user').toBeDisabled();
    await expect(this.searchResultsPage.quantityInput(productId), 'Quantity input should be disabled for anonymous user').toBeDisabled();
    await expect(this.searchResultsPage.incrementButton(), 'Increment button should be disabled for anonymous user').toBeDisabled();
    await expect(this.searchResultsPage.decrementButton(), 'Decrement button should be disabled for anonymous user').toBeDisabled();
  }

  async verifyProductDetailIdentity(productId: string, manufacturerRefId: string): Promise<void> {
    this.logger.info(`Verifying product detail identity for product ${productId}`);
    await expect(this.productDetailPage.productHeading(), 'LISTA product heading should be visible').toBeVisible();
    await expect(this.productDetailPage.productIdReference(), 'Product ID reference should be visible').toContainText(productId);
    await expect(this.productDetailPage.manufacturerReference(), 'Manufacturer reference should be visible').toContainText(manufacturerRefId);
  }

  async verifyProductDetailCartControlsDisabled(productId: string): Promise<void> {
    this.logger.info(`Verifying anonymous cart controls are disabled on product detail ${productId}`);
    await expect(this.productDetailPage.priceError(productId), 'Anonymous price restriction message should be visible').toBeVisible();
    await expect(this.productDetailPage.addToCartButton(), 'PDP Add to Cart CTA should be visible').toBeVisible();
    await expect(this.productDetailPage.addToCartButton(), 'PDP Add to Cart CTA should be disabled for anonymous user').toBeDisabled();
    await expect(this.productDetailPage.buyboxQuantityInput(), 'PDP quantity input should be disabled for anonymous user').toBeDisabled();
    await expect(this.productDetailPage.incrementButton(), 'PDP increment button should be disabled for anonymous user').toBeDisabled();
    await expect(this.productDetailPage.decrementButton(), 'PDP decrement button should be disabled for anonymous user').toBeDisabled();
  }

  async verifyAnonymousCartRemainsEmpty(): Promise<void> {
    this.logger.info('Verifying anonymous cart remains empty and user is not logged in');
    await expect(this.headerSearchPage.cartLink(), 'Cart count should remain zero').toContainText('0');
    await expect(this.headerSearchPage.loginLink(), 'Login link should remain visible after blocked cart action').toBeVisible();
  }
}
