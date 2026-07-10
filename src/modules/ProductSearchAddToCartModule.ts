import { expect } from '@playwright/test';
import { HeaderSearchPage } from '@pages/HeaderSearchPage';
import { SearchResultsPage } from '@pages/SearchResultsPage';
import { ProductDetailsPage } from '@pages/ProductDetailsPage';
import { CartPage } from '@pages/CartPage';
import { SearchModule } from '@modules/SearchModule';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class ProductSearchAddToCartModule {
  private logger: Logger;

  constructor(
    private searchModule: SearchModule,
    private headerSearchPage: HeaderSearchPage,
    private searchResultsPage: SearchResultsPage,
    private productDetailsPage: ProductDetailsPage,
    private cartPage: CartPage,
  ) {
    this.logger = new Logger('ProductSearchAddToCartModule');
  }

  async searchForProduct(productId: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Searching add-to-cart product: ${productId}`);
    await this.searchModule.submitSearch(productId);
    await this.searchModule.verifySearchResultsPage(productId);
  }

  async openProductFromSearchResults(productId: string): Promise<void> {
    this.logger.info(`Opening product from search results: ${productId}`);
    await this.searchResultsPage.clickProductCard(productId);
    await this.productDetailsPage.waitForPageLoad();
  }

  async openProductFromSearchResultsWithKeyboard(productId: string): Promise<void> {
    this.logger.info(`Opening product from search results with keyboard: ${productId}`);
    await this.searchResultsPage.productCard(productId).focus();
    await this.searchResultsPage.pressProductCard(productId);
    await this.productDetailsPage.waitForPageLoad();
  }

  async addDisplayedProductToCart(): Promise<void> {
    this.logger.info('Adding displayed product to cart');
    await this.productDetailsPage.clickAddToCart();
    await this.productDetailsPage.waitForPageLoad();
  }

  async addDisplayedProductToCartWithKeyboard(): Promise<void> {
    this.logger.info('Adding displayed product to cart with keyboard');
    await this.productDetailsPage.addToCartButton().focus();
    await this.productDetailsPage.pressAddToCart();
    await this.productDetailsPage.waitForPageLoad();
  }

  async openCartFromHeader(): Promise<void> {
    this.logger.info('Opening checkout cart from header cart link');
    await this.cartPage.clickHeaderCartLink();
    await this.cartPage.waitForCheckoutRoute();
    await this.cartPage.waitForPageLoad();
  }

  async openCartFromHeaderWithKeyboard(): Promise<void> {
    this.logger.info('Opening checkout cart from header cart link with keyboard');
    await this.cartPage.headerCartLink().focus();
    await this.cartPage.pressHeaderCartLink();
    await this.cartPage.waitForCheckoutRoute();
    await this.cartPage.waitForPageLoad();
  }

  async verifyCartContainsProduct(productId: string): Promise<void> {
    this.logger.info(`Verifying checkout cart contains product: ${productId}`);
    await expect(this.cartPage.productLineItem(productId), `Cart should contain product ${productId}`).toBeVisible();
  }

  async verifyCartIsNotNotFound(): Promise<void> {
    this.logger.info('Verifying checkout cart route is not a 404 page');
    await expect(this.cartPage.notFoundMessage(), 'Checkout cart should not render a 404 page').not.toBeVisible();
  }

  async verifyDefaultQuantity(productId: string, expectedQuantity: string): Promise<void> {
    this.logger.info(`Verifying default quantity for product ${productId}`);
    await expect(this.cartPage.quantityInputForProduct(productId), 'Default quantity should be deterministic').toHaveValue(expectedQuantity);
  }

  async verifyEmptySearchCannotSubmit(): Promise<void> {
    this.logger.info('Verifying empty search submit is prevented');
    await this.headerSearchPage.navigate('/');
    await this.headerSearchPage.waitForPageLoad();
    await this.headerSearchPage.dismissCookieBannerIfPresent();
    await this.headerSearchPage.clearSearchInput();
    await expect(this.headerSearchPage.submitSearchButton(), 'Empty search submit should be disabled').toBeDisabled();
  }

  async verifyNoResultsForUnknownKeyword(keyword: string): Promise<void> {
    this.logger.info(`Verifying no-results state for keyword: ${keyword}`);
    await this.searchModule.submitSearch(keyword);
    await expect(this.searchResultsPage.noResultsMessage(), 'No-results message should be visible').toBeVisible();
    await expect(this.searchResultsPage.productCard(keyword), 'No product cards should match unknown keyword').not.toBeVisible();
  }

  async verifyUnauthorizedAddToCartIsBlocked(): Promise<void> {
    this.logger.info('Verifying unauthorized add-to-cart attempt is blocked or redirected');
    await this.productDetailsPage.clickAddToCart();
    await expect(this.productDetailsPage.authorizationMessage(), 'Authorization or login message should be visible').toBeVisible();
  }
}
