import { expect } from '@playwright/test';
import { SearchModule } from '@modules/SearchModule';
import { SearchResultsPage } from '@pages/SearchResultsPage';
import { CartPage } from '@pages/CartPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class ProductCartModule {
  private logger: Logger;

  constructor(
    private searchModule: SearchModule,
    private searchResultsPage: SearchResultsPage,
    private cartPage: CartPage,
  ) {
    this.logger = new Logger('ProductCartModule');
  }

  async searchForProduct(productId: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Searching for product: ${productId}`);
    await this.searchModule.submitSearch(productId);
  }

  async verifyProductSearchResult(productId: string): Promise<void> {
    this.logger.info(`Verifying product search result is visible for: ${productId}`);
    await expect(
      this.searchResultsPage.productCountSummary(),
      'Product count summary should be visible after searching',
    ).toBeVisible();
    await expect(
      this.searchResultsPage.productCard(productId),
      `Product card for ${productId} should be visible`,
    ).toBeVisible();
  }

  async addProductToCart(productId: string): Promise<void> {
    this.logger.info(`Adding product to cart: ${productId}`);
    await this.searchResultsPage.addToCartButton().click();
  }

  async openCartFromHeader(): Promise<void> {
    this.logger.info('Opening cart from header');
    await this.cartPage.clickHeaderCartButton();
  }

  async verifyProductIsInCart(productId: string): Promise<void> {
    this.logger.info(`Verifying product is present in cart: ${productId}`);
    await expect(
      this.cartPage.cartProductText(productId),
      `Product ID ${productId} should be visible in the cart`,
    ).toBeVisible();
  }
}
