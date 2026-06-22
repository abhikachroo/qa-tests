import { expect } from '@playwright/test';
import { HeaderSearchPage } from '@pages/HeaderSearchPage';
import { SearchResultsPage } from '@pages/SearchResultsPage';
import { CartPage } from '@pages/CartPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class ProductCartModule {
  private logger: Logger;

  constructor(
    private headerSearchPage: HeaderSearchPage,
    private searchResultsPage: SearchResultsPage,
    private cartPage: CartPage,
  ) {
    this.logger = new Logger('ProductCartModule');
  }

  async addVisibleProductToCart(productId: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Adding product to cart: ${productId}`);
    await this.searchResultsPage.clickAddToCart(productId);
    this.logger.info('Add-to-cart action submitted');
  }

  async navigateToCart(): Promise<void> {
    this.logger.info('Navigating to cart from header cart link');
    await this.cartPage.clickHeaderCart();
    await this.cartPage.waitForPageLoad();
  }

  async navigateToDirectCartPath(): Promise<void> {
    this.logger.info('Navigating directly to cart path');
    await this.cartPage.navigateToCartPath();
    await this.cartPage.waitForPageLoad();
  }

  async verifyProductInCart(productId: string): Promise<void> {
    this.logger.info(`Verifying product appears in cart: ${productId}`);
    await expect(
      this.cartPage.cartItemByProductId(productId),
      `Cart should contain product ID ${productId}`,
    ).toBeVisible();
  }

  async verifyNotFoundStateVisible(): Promise<void> {
    this.logger.info('Verifying not-found state is visible');
    await expect(
      this.cartPage.notFoundHeading(),
      'Not-found heading should be visible for unsupported direct route',
    ).toBeVisible();
  }

  async verifyHeaderCartCountUnchanged(expectedCountText: string): Promise<void> {
    this.logger.info(`Verifying header cart count remains: ${expectedCountText}`);
    await expect(this.cartPage.cartLink()).toContainText(expectedCountText);
  }

  async verifyEmptySearchDidNotNavigate(previousUrl: string): Promise<void> {
    this.logger.info('Verifying empty search does not navigate away from the current page');
    await this.headerSearchPage.fillSearchInput('');
    await this.headerSearchPage.clickSubmitButton();
    expect(await this.headerSearchPage.getCurrentUrl()).toBe(previousUrl);
  }
}
