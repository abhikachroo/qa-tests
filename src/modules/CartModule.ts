import { expect } from '@playwright/test';
import { CartPage } from '@pages/CartPage';
import { SearchModule } from '@modules/SearchModule';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class CartModule {
  private logger: Logger;

  constructor(
    private cartPage: CartPage,
    private searchModule: SearchModule,
  ) {
    this.logger = new Logger('CartModule');
  }

  async searchAndAddProductToCart(productId: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Adding searched product to cart: ${productId}`);
    await this.searchModule.submitSearch(productId);
    await this.searchModule.verifySearchResultsPage(productId);
    await this.cartPage.clickAddToCart(productId);
    this.logger.info(`Add-to-cart action submitted for product: ${productId}`);
  }

  async verifyAddToCartCompleted(productId: string): Promise<void> {
    this.logger.info(`Verifying add-to-cart completion for product: ${productId}`);
    await expect(
      this.cartPage.addToCartSuccessIndicator().or(this.cartPage.cartEntryPoint()),
      'Success indication or cart entry point should reflect the added product',
    ).toBeVisible();
  }

  async openCartFromUi(): Promise<void> {
    this.logger.info('Opening cart from UI entry point');
    await this.cartPage.clickCartEntryPoint();
    await this.cartPage.waitForPageLoad();
    this.logger.info('Cart view opened');
  }

  async verifyCartContainsProduct(productId: string): Promise<void> {
    this.logger.info(`Verifying cart contains product: ${productId}`);
    await expect(
      this.cartPage.cartLineByProductId(productId),
      `Cart should contain searched product ID ${productId}`,
    ).toBeVisible();
    this.logger.info(`Cart contains product: ${productId}`);
  }

  async navigateDirectlyToCartRoute(): Promise<void> {
    this.logger.info('Navigating directly to /cart to verify controlled error handling');
    await this.cartPage.navigateToCartRoute();
    await this.cartPage.waitForPageLoad();
    await this.cartPage.dismissCookieBannerIfPresent();
  }

  async verifyDirectCartRouteErrorState(): Promise<void> {
    this.logger.info('Verifying direct cart route controlled error state');
    await expect(
      this.cartPage.error404Container(),
      'Direct /cart route should render a controlled 404 error container',
    ).toBeVisible();
    await expect(
      this.cartPage.routeShellSearchInput(),
      'Header search should remain available for recovery from direct route error',
    ).toBeVisible();
  }

  async verifyEmptyCartState(productId: string): Promise<void> {
    this.logger.info(`Verifying empty cart state does not contain product: ${productId}`);
    await expect(
      this.cartPage.emptyCartMessage(),
      'Empty cart messaging should be visible',
    ).toBeVisible();
    await expect(
      this.cartPage.cartLineByProductId(productId),
      `Product ${productId} should not be present before it is added`,
    ).not.toBeVisible();
  }

  async verifyAddToCartFailure(productId: string): Promise<void> {
    this.logger.info(`Verifying recoverable add-to-cart failure for product: ${productId}`);
    await expect(
      this.cartPage.addToCartErrorMessage(),
      'Recoverable add-to-cart error message should be visible',
    ).toBeVisible();
    await expect(
      this.cartPage.addToCartButton(productId),
      'Add-to-cart control should be usable again after failure',
    ).toBeEnabled();
  }

  async verifyAddToCartPendingState(productId: string): Promise<void> {
    this.logger.info(`Verifying pending add-to-cart state for product: ${productId}`);
    await expect(
      this.cartPage.addToCartButton(productId),
      'Add-to-cart control should prevent duplicate submissions while pending',
    ).toBeDisabled();
  }
}
