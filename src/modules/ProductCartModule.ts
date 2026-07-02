import { expect } from '@playwright/test';
import { HeaderSearchPage } from '@pages/HeaderSearchPage';
import { ProductCartPage } from '@pages/ProductCartPage';
import { SearchResultsPage } from '@pages/SearchResultsPage';
import { config } from '@config/index';
import { Logger } from '@utils/Logger';

export class ProductCartModule {
  private logger: Logger;

  constructor(
    private headerSearchPage: HeaderSearchPage,
    private searchResultsPage: SearchResultsPage,
    private productCartPage: ProductCartPage,
  ) {
    this.logger = new Logger('ProductCartModule');
  }

  async openMatchingProduct(productId: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Opening product result: ${productId}`);
    await this.searchResultsPage.clickProductCard(productId);
    await this.searchResultsPage.waitForPageLoad();
    this.logger.info(`Product result opened: ${productId}`);
  }

  async addCurrentProductToCart(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Adding current product to cart`);
    await this.searchResultsPage.clickAddToCartButton();
    await this.searchResultsPage.waitForPageLoad();
    this.logger.info('Add-to-cart action completed');
  }

  async addMatchingProductFromResults(productId: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Adding matching product from results: ${productId}`);
    await this.searchResultsPage.clickProductCardAddToCartButton(productId);
    await this.searchResultsPage.waitForPageLoad();
    this.logger.info(`Matching product add-to-cart action completed: ${productId}`);
  }

  async openCart(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Opening shopping cart`);
    await this.headerSearchPage.clickCartButton();
    await this.productCartPage.waitForPageLoad();
    this.logger.info('Shopping cart opened');
  }

  async navigateToUnsupportedSearchRoute(productId: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Navigating to unsupported direct search route: ${productId}`);
    await this.productCartPage.navigateToUnsupportedSearchRoute(productId);
    await this.productCartPage.waitForPageLoad();
    await this.productCartPage.dismissCookieBannerIfPresent();
    this.logger.info('Unsupported direct search route loaded');
  }

  async verifyProductInCart(productId: string): Promise<void> {
    this.logger.info(`Verifying cart contains product: ${productId}`);
    await expect(
      this.productCartPage.cartLineItem(productId),
      `Cart should contain product ID ${productId}`,
    ).toBeVisible();
    this.logger.info(`Cart contains product: ${productId}`);
  }

  async verifyProductNotInCart(productId: string): Promise<void> {
    this.logger.info(`Verifying cart does not contain product: ${productId}`);
    await expect(
      this.productCartPage.cartLineItem(productId),
      `Cart should not contain product ID ${productId}`,
    ).not.toBeVisible();
    this.logger.info(`Cart does not contain product: ${productId}`);
  }

  async verifyEmptyCartState(productId: string): Promise<void> {
    this.logger.info('Verifying empty cart state');
    await expect(
      this.productCartPage.emptyCartMessage(),
      'Empty cart message should be visible',
    ).toBeVisible();
    await expect(
      this.productCartPage.cartLineItem(productId),
      `Empty cart should not contain product ID ${productId}`,
    ).not.toBeVisible();
    this.logger.info('Empty cart state verified');
  }

  async verifyUnsupportedSearchRoute(): Promise<void> {
    this.logger.info('Verifying controlled 404 page for unsupported direct search route');
    await expect(
      this.productCartPage.error404Container(),
      '404 error container should be visible',
    ).toBeVisible();
    await expect(
      this.productCartPage.error404Text(),
      '404 error text should be visible',
    ).toBeVisible();
    await expect(
      this.productCartPage.headerSearchInput(),
      'Header search should remain available on 404 page',
    ).toBeVisible();
    await expect(
      this.productCartPage.cartButton(),
      'Cart button should remain available on 404 page',
    ).toBeVisible();
    await expect(
      this.productCartPage.addToCartControls(),
      '404 page should not expose add-to-cart controls',
    ).toHaveCount(0);
    this.logger.info('Controlled 404 page verified');
  }
}
