import { expect } from '@playwright/test';
import { ProductCartPage } from '@pages/ProductCartPage';
import { SearchModule } from '@modules/SearchModule';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class ProductCartModule {
  private logger: Logger;

  constructor(
    private productCartPage: ProductCartPage,
    private searchModule: SearchModule,
  ) {
    this.logger = new Logger('ProductCartModule');
  }

  async searchForProduct(productId: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Searching for product: ${productId}`);
    await this.searchModule.submitSearch(productId);
    await this.searchModule.verifySearchResultsPage(productId);
  }

  async addProductFromSearchResults(productId: string): Promise<void> {
    this.logger.info(`Adding product to cart from search results: ${productId}`);
    await expect(
      this.productCartPage.productCard(productId),
      `Product card for ${productId} should be visible before adding to cart`,
    ).toBeVisible();
    await this.productCartPage.clickAddToCart(productId);
  }

  async verifyAddToCartFeedback(productId: string): Promise<void> {
    this.logger.info(`Verifying add-to-cart feedback for product: ${productId}`);
    await expect(
      this.productCartPage.addToCartFeedback(productId),
      `Add-to-cart feedback for ${productId} should be visible`,
    ).toBeVisible();
  }

  async openCartFromHeader(): Promise<void> {
    this.logger.info('Opening the supported cart experience from the header cart button');
    await expect(
      this.productCartPage.headerCartButton(),
      'Header cart button should be visible',
    ).toBeVisible();
    await this.productCartPage.clickHeaderCart();
    await this.productCartPage.waitForCartExperience();
  }

  async verifyCartExperienceLoaded(): Promise<void> {
    this.logger.info('Verifying supported cart or checkout experience loaded');
    await expect(
      this.productCartPage.cartPageNotFoundContainer(),
      'Header cart navigation should not land on the unsupported not-found cart page',
    ).not.toBeVisible();
  }

  async verifyProductPresentInCart(productId: string): Promise<void> {
    this.logger.info(`Verifying product is present in cart: ${productId}`);
    await expect(
      this.productCartPage.cartLineItemByProductId(productId),
      `Cart should contain product ${productId}`,
    ).toBeVisible();
  }
}
