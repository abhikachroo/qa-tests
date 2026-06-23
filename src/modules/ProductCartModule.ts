import { expect } from '@playwright/test';
import { SearchModule } from '@modules/SearchModule';
import { SearchResultsPage } from '@pages/SearchResultsPage';
import { CartPage } from '@pages/CartPage';
import { Logger } from '@utils/Logger';

export class ProductCartModule {
  private logger: Logger;

  constructor(
    private searchModule: SearchModule,
    private searchResultsPage: SearchResultsPage,
    private cartPage: CartPage,
  ) {
    this.logger = new Logger('ProductCartModule');
  }

  async searchAndVerifyProduct(productId: string): Promise<void> {
    this.logger.info(`Searching for product: ${productId}`);
    await this.searchModule.submitSearch(productId);
    await this.searchModule.verifySearchResultsPage(productId);
  }

  async addVisibleProductToCart(productId: string): Promise<void> {
    this.logger.info(`Adding product to cart: ${productId}`);
    await this.searchResultsPage.clickAddToCart(productId);
  }

  async verifyProductCardIsVisible(productId: string): Promise<void> {
    this.logger.info(`Verifying product card is visible: ${productId}`);
    await expect(this.searchResultsPage.productCard(productId)).toBeVisible();
    await expect(this.searchResultsPage.productIdText(productId)).toBeVisible();
  }

  async verifyAddToCartConfirmation(): Promise<void> {
    this.logger.info('Verifying add-to-cart confirmation');
    await expect(this.cartPage.cartIndicator()).toBeVisible();
  }

  async openCart(): Promise<void> {
    this.logger.info('Opening cart from header');
    await this.cartPage.openCartFromHeader();
    await this.cartPage.waitForPageLoad();
  }

  async verifyProductInCart(productId: string): Promise<void> {
    this.logger.info(`Verifying product is present in cart: ${productId}`);
    await expect(this.cartPage.cartLineItem(productId)).toBeVisible();
  }

  async verifyEmptyCart(): Promise<void> {
    this.logger.info('Verifying empty cart state');
    await this.openCart();
    await expect(this.cartPage.emptyCartState()).toBeVisible();
  }
}
