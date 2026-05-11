import { expect } from '@playwright/test';
import { HomePage } from '@pages/HomePage';
import { HeaderSearchPage } from '@pages/HeaderSearchPage';
import { SearchResultsPage } from '@pages/SearchResultsPage';
import { ProductDetailPage } from '@pages/ProductDetailPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class ProductPurchaseModule {
  private logger: Logger;

  constructor(
    private homePage: HomePage,
    private headerSearchPage: HeaderSearchPage,
    private searchResultsPage: SearchResultsPage,
    private productDetailPage: ProductDetailPage,
  ) {
    this.logger = new Logger('ProductPurchaseModule');
  }

  async openHomePage(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Opening homepage as guest visitor`);
    await this.homePage.navigate('/');
    await this.homePage.waitForPageLoad();
    await this.homePage.dismissCookieBannerIfPresent();
  }

  async searchForProduct(productId: string): Promise<void> {
    this.logger.info(`Searching for product ID: ${productId}`);
    await this.headerSearchPage.fillSearchInput(productId);
    await this.headerSearchPage.clickSubmitButton();
    await this.headerSearchPage.waitForSearchNavigation(productId);
    await this.searchResultsPage.waitForPageLoad();
    await this.searchResultsPage.dismissCookieBannerIfPresent();
  }

  async openProductFromSearchResults(): Promise<void> {
    this.logger.info('Opening product detail page from search results');
    await this.searchResultsPage.clickProductTitle();
    await this.productDetailPage.waitForPageLoad();
    await this.productDetailPage.dismissCookieBannerIfPresent();
  }

  async openProductDetailPath(productDetailPath: string): Promise<void> {
    this.logger.info(`Opening product detail path: ${productDetailPath}`);
    await this.productDetailPage.navigate(productDetailPath);
    await this.productDetailPage.waitForPageLoad();
    await this.productDetailPage.dismissCookieBannerIfPresent();
  }

  async verifyGuestHomeHeader(): Promise<void> {
    this.logger.info('Verifying guest homepage controls are visible');
    await expect(this.homePage.searchBarInput()).toBeVisible();
    await expect(this.homePage.headerLoginLink()).toBeVisible();
    await expect(this.homePage.signUpLink()).toBeVisible();
    await expect(this.homePage.cartButton()).toBeVisible();
  }

  async verifySearchResultsProduct(productId: string, expectedTitle: string): Promise<void> {
    this.logger.info(`Verifying search result product identity for ${productId}`);
    await expect(this.searchResultsPage.productCard(productId)).toBeVisible();
    await expect(this.searchResultsPage.productIdControl(productId)).toBeVisible();
    await expect(this.searchResultsPage.productTitleLink()).toContainText(expectedTitle);
  }

  async verifyProductDetailIdentity(productId: string, manufacturerReference: string): Promise<void> {
    this.logger.info(`Verifying product detail identity for ${productId}`);
    await expect(this.productDetailPage.productHeading()).toBeVisible();
    await expect(this.productDetailPage.productIdReference()).toContainText(productId);
    await expect(this.productDetailPage.manufacturerReference()).toContainText(manufacturerReference);
  }

  async verifySearchResultsPurchaseControlsDisabled(productId: string): Promise<void> {
    this.logger.info(`Verifying search-results purchase controls are disabled for ${productId}`);
    await expect(this.searchResultsPage.addToCartButton()).toBeVisible();
    await expect(this.searchResultsPage.addToCartButton()).toBeDisabled();
    await expect(this.searchResultsPage.quantityInput(productId)).toBeDisabled();
    await expect(this.searchResultsPage.priceError(productId)).toBeVisible();
  }

  async verifyProductDetailPurchaseControlsDisabled(): Promise<void> {
    this.logger.info('Verifying product-detail purchase controls are disabled for guest visitor');
    await expect(this.productDetailPage.addToCartButton()).toBeVisible();
    await expect(this.productDetailPage.addToCartButton()).toBeDisabled();
    await expect(this.productDetailPage.quantityInput()).toBeDisabled();
    await expect(this.productDetailPage.incrementButton()).toBeDisabled();
    await expect(this.productDetailPage.decrementButton()).toBeDisabled();
  }

  async getCartButtonText(): Promise<string> {
    return await this.homePage.getCartButtonText();
  }

  async verifyCartButtonTextUnchanged(expectedCartText: string): Promise<void> {
    this.logger.info(`Verifying cart text remains unchanged: ${expectedCartText}`);
    await expect(this.productDetailPage.cartButton()).toContainText(expectedCartText);
  }

  async verifyEmptySearchIsPrevented(): Promise<void> {
    this.logger.info('Verifying empty search submission is prevented');
    await this.headerSearchPage.clearSearchInput();
    await expect(this.headerSearchPage.searchInput()).toHaveValue('');
    await expect(this.headerSearchPage.submitButton()).toBeDisabled();
  }

  async verifyGuestPricingBannerOnHomePage(): Promise<void> {
    this.logger.info('Verifying guest pricing banner on homepage');
    await expect(this.homePage.guestPricingBanner()).toBeVisible();
  }

  async verifyGuestPricingBannerOnSearchResults(): Promise<void> {
    this.logger.info('Verifying guest pricing banner on search results');
    await expect(this.searchResultsPage.priceError('6968173')).toBeVisible();
  }

  async verifyGuestPricingBannerOnProductDetail(): Promise<void> {
    this.logger.info('Verifying guest pricing banner on product detail page');
    await expect(this.productDetailPage.guestPricingBanner()).toBeVisible();
  }
}
