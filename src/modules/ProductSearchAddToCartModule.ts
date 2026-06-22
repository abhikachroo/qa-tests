import { expect } from '@playwright/test';
import { SearchModule } from '@modules/SearchModule';
import { SearchResultsPage } from '@pages/SearchResultsPage';
import { ProductDetailPage } from '@pages/ProductDetailPage';
import { CartPage } from '@pages/CartPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class ProductSearchAddToCartModule {
  private logger: Logger;

  constructor(
    private searchModule: SearchModule,
    private searchResultsPage: SearchResultsPage,
    private productDetailPage: ProductDetailPage,
    private cartPage: CartPage,
  ) {
    this.logger = new Logger('ProductSearchAddToCartModule');
  }

  async searchForProduct(productId: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Searching for product: ${productId}`);
    await this.searchModule.submitSearch(productId);
  }

  async verifySearchResult(productId: string): Promise<void> {
    this.logger.info(`Verifying search result for product: ${productId}`);
    await this.searchModule.verifySearchResultsPage(productId);
    await expect(this.searchResultsPage.productCard(productId), 'Matching product card should be visible').toBeVisible();
  }

  async openMatchingProduct(productId: string): Promise<void> {
    this.logger.info(`Opening matching product card for: ${productId}`);
    await this.searchResultsPage.clickMatchingProduct(productId);
    await this.productDetailPage.waitForPageLoad();
  }

  async verifyPurchasableProduct(productId: string): Promise<void> {
    this.logger.info(`Verifying purchasable state for product: ${productId}`);
    await expect(this.productDetailPage.productIdText(productId), 'Product ID should remain visible').toBeVisible();
    await expect(this.productDetailPage.addToCartButton(), 'Add to cart should be available').toBeVisible();
    await expect(this.productDetailPage.addToCartButton(), 'Add to cart should be enabled').toBeEnabled();
  }

  async addProductToCart(): Promise<void> {
    this.logger.info('Adding selected product to cart');
    await this.productDetailPage.clickAddToCart();
  }

  async attemptRapidDoubleAdd(): Promise<void> {
    this.logger.info('Attempting rapid duplicate add to cart');
    await this.productDetailPage.doubleClickAddToCart();
  }

  async verifyCartUpdated(): Promise<void> {
    this.logger.info('Verifying cart confirmation or count was updated');
    await expect(
      this.productDetailPage.cartConfirmation().or(this.productDetailPage.cartCount()),
      'Cart confirmation or cart count should be visible after add-to-cart',
    ).toBeVisible();
  }

  async openCart(): Promise<void> {
    this.logger.info('Opening cart');
    await this.cartPage.openCart();
  }

  async navigateToCart(): Promise<void> {
    this.logger.info('Navigating directly to cart');
    await this.cartPage.navigateToCart();
  }

  async verifyProductInCart(productId: string): Promise<void> {
    this.logger.info(`Verifying product appears in cart: ${productId}`);
    await expect(this.cartPage.cartProductLineItem(productId), 'Cart line item should include the product ID').toBeVisible();
    await expect(this.cartPage.emptyCartMessage(), 'Cart should not show empty state after add-to-cart').not.toBeVisible();
  }

  async verifyEmptyCart(): Promise<void> {
    this.logger.info('Verifying empty cart state');
    await expect(this.cartPage.emptyCartMessage(), 'Empty cart state should be visible').toBeVisible();
    await expect(this.cartPage.productLineItems(), 'No cart line items should be present').toHaveCount(0);
  }
}
