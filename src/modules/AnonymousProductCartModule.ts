import { expect } from '@playwright/test';
import { HeaderSearchPage } from '@pages/HeaderSearchPage';
import { SearchResultsPage } from '@pages/SearchResultsPage';
import { ProductDetailPage } from '@pages/ProductDetailPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class AnonymousProductCartModule {
  private logger: Logger;

  constructor(
    private headerSearchPage: HeaderSearchPage,
    private searchResultsPage: SearchResultsPage,
    private productDetailPage: ProductDetailPage,
  ) {
    this.logger = new Logger('AnonymousProductCartModule');
  }

  async openStorefrontAnonymously(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Opening storefront anonymously`);
    await this.headerSearchPage.navigate('/');
    await this.headerSearchPage.waitForPageLoad();
    await this.headerSearchPage.dismissCookieBannerIfPresent();
  }

  async submitProductSearch(productId: string): Promise<void> {
    this.logger.info(`Submitting anonymous product search for ${productId}`);
    await this.headerSearchPage.fillSearchInput(productId);
    await this.headerSearchPage.clickSubmitButton();
    await this.headerSearchPage.waitForSearchNavigation(productId);
    await this.searchResultsPage.waitForPageLoad();
  }

  async navigateToProductSearch(productId: string): Promise<void> {
    this.logger.info(`Opening anonymous search results for ${productId}`);
    await this.searchResultsPage.navigateToProductSearch(productId);
    await this.searchResultsPage.waitForPageLoad();
    await this.searchResultsPage.dismissCookieBannerIfPresent();
  }

  async openProductDetailFromResults(): Promise<void> {
    this.logger.info('Opening product detail from the matching result card');
    await this.searchResultsPage.clickProductTitle();
    await this.productDetailPage.waitForPageLoad();
  }

  async navigateToProductDetail(): Promise<void> {
    this.logger.info('Opening LISTA product detail page anonymously');
    await this.productDetailPage.navigateToListaProductDetail();
    await this.productDetailPage.waitForPageLoad();
    await this.productDetailPage.dismissCookieBannerIfPresent();
  }

  async verifyStorefrontSearchAvailable(): Promise<void> {
    this.logger.info('Verifying anonymous homepage search controls and header state');
    await expect(this.headerSearchPage.searchInput(), 'Search input should be visible').toBeVisible();
    await expect(this.headerSearchPage.searchInput(), 'Search input should be editable').toBeEditable();
    await expect(this.headerSearchPage.submitButton(), 'Submit search should be disabled while search is empty').toBeDisabled();
    await expect(this.searchResultsPage.loginButton(), 'Login link should be visible for anonymous user').toBeVisible();
    await expect(this.searchResultsPage.cartButton(), 'Cart link should be visible for anonymous user').toBeVisible();
    await expect(this.searchResultsPage.cartButton(), 'Cart should show an empty state for anonymous user').toContainText(/0/);
  }

  async verifySearchResultsContainProduct(productId: string): Promise<void> {
    this.logger.info(`Verifying search results contain product ${productId}`);
    await expect(this.searchResultsPage.productCountSummary(), 'Product count summary should be visible').toBeVisible();
    await expect(this.searchResultsPage.productCard(productId), `Product card for ${productId} should be visible`).toBeVisible();
    await expect(this.searchResultsPage.productIdText(productId), `Product ID ${productId} should be visible`).toBeVisible();
  }

  async verifySearchResultAddToCartDisabled(productId: string): Promise<void> {
    this.logger.info(`Verifying anonymous Add to Cart is disabled on search result ${productId}`);
    await expect(this.searchResultsPage.addToCartButton(productId), 'Add to Cart should be visible on search result').toBeVisible();
    await expect(this.searchResultsPage.addToCartButton(productId), 'Add to Cart should be disabled for anonymous user').toBeDisabled();
    await expect(this.searchResultsPage.quantitySelector(productId), 'Quantity selector should be disabled for anonymous user').toBeDisabled();
    await expect(this.searchResultsPage.incrementButton(productId), 'Increment should be disabled for anonymous user').toBeDisabled();
    await expect(this.searchResultsPage.decrementButton(productId), 'Decrement should be disabled for anonymous user').toBeDisabled();
    await expect(this.searchResultsPage.cartButton(), 'Cart should remain empty').toContainText(/0/);
  }

  async verifyProductDetailIdentity(productId: string, manufacturerRefId: string): Promise<void> {
    this.logger.info(`Verifying product detail identity for ${productId}`);
    await expect(this.productDetailPage.productHeading(), 'LISTA product heading should be visible').toBeVisible();
    await expect(this.productDetailPage.productIdReference(), 'Product ID reference should be visible').toContainText(productId);
    await expect(this.productDetailPage.manufacturerReference(), 'Manufacturer reference should be visible').toContainText(manufacturerRefId);
  }

  async verifyProductDetailAddToCartDisabled(productId: string): Promise<void> {
    this.logger.info(`Verifying anonymous Add to Cart is disabled on PDP for ${productId}`);
    await expect(this.productDetailPage.addToCartButton(), 'PDP Add to Cart should be visible').toBeVisible();
    await expect(this.productDetailPage.addToCartButton(), 'PDP Add to Cart should be disabled for anonymous user').toBeDisabled();
    await expect(this.productDetailPage.buyboxQuantitySelector(), 'PDP quantity selector should be disabled').toBeDisabled();
    await expect(this.productDetailPage.incrementButton(), 'PDP increment should be disabled').toBeDisabled();
    await expect(this.productDetailPage.decrementButton(), 'PDP decrement should be disabled').toBeDisabled();
    await expect(this.productDetailPage.priceError(productId), 'Anonymous price restriction should be shown').toBeVisible();
  }

  async verifyUnauthorizedCartEntryBlocked(productId: string): Promise<void> {
    this.logger.info(`Verifying anonymous user cannot add product ${productId} to cart`);
    await expect(this.productDetailPage.addToCartButton(), 'Disabled Add to Cart should not be actionable').toBeDisabled();
    await expect(this.productDetailPage.cartButton(), 'Cart should still show zero items').toContainText(/0/);
    await expect(this.productDetailPage.loginButton(), 'Login link should remain visible for anonymous user').toBeVisible();
  }
}
