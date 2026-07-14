import { expect } from '@playwright/test';
import { SearchResultsPage } from '@pages/SearchResultsPage';
import { CartPage } from '@pages/CartPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class CartModule {
  private logger: Logger;

  constructor(
    private searchResultsPage: SearchResultsPage,
    private cartPage: CartPage,
  ) {
    this.logger = new Logger('CartModule');
  }

  async addSearchResultToCart(productId: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Adding search result to cart: "${productId}"`);
    await this.searchResultsPage.clickAddToCart(productId);
    this.logger.info('Add-to-cart action submitted');
  }

  async verifyAddToCartSucceeded(): Promise<void> {
    this.logger.info('Verifying add-to-cart success state');
    await expect(
      this.cartPage.successMessage(),
      'Success confirmation should be visible after add-to-cart',
    ).toBeVisible();
  }

  async verifyAddToCartFailed(): Promise<void> {
    this.logger.info('Verifying add-to-cart failure state');
    await expect(
      this.cartPage.errorMessage(),
      'Error message should be visible when add-to-cart fails',
    ).toBeVisible();
  }

  async openCart(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Opening cart`);
    await this.cartPage.openCart();
    await this.cartPage.waitForPageLoad();
  }

  async verifyProductInCart(productId: string): Promise<void> {
    this.logger.info(`Verifying product appears in cart: "${productId}"`);
    await expect(
      this.cartPage.errorPageContainer(),
      'Cart should not render the observed 404 page',
    ).not.toBeVisible();
    await expect(
      this.cartPage.cartItemByProductId(productId),
      `Product ID "${productId}" should be visible in cart`,
    ).toBeVisible();
  }

  async verifyCartAccessRequiresSession(): Promise<void> {
    this.logger.info('Verifying cart access shows session-safe state');
    await expect(
      this.cartPage.emptyOrSessionMessage(),
      'Cart should show an empty/session/login state for unauthenticated access',
    ).toBeVisible();
  }
}
