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
    this.logger.info(`Verifying product search result for: ${productId}`);
    await this.searchModule.verifySearchResultsPage(productId);
    await expect(this.searchResultsPage.error404Container(), '404 container should not be visible').not.toBeVisible();
  }

  async addProductFromSearchResults(productId: string): Promise<void> {
    this.logger.info(`Adding product from search results: ${productId}`);
    await this.searchResultsPage.clickAddToCart(productId);
    await expect(this.cartPage.cartIndicator(), 'Cart indicator should reflect add-to-cart action').toBeVisible();
  }

  async openCart(): Promise<void> {
    this.logger.info('Opening cart from header');
    await this.cartPage.openCartFromHeader();
    await this.cartPage.waitForPageLoad();
  }

  async verifyProductInCart(productId: string): Promise<void> {
    this.logger.info(`Verifying product is present in cart: ${productId}`);
    await expect(this.cartPage.cartLineItem(productId), `Cart line item should contain product ${productId}`).toBeVisible();
  }

  async verifyEmptyCart(productId: string): Promise<void> {
    this.logger.info(`Verifying empty cart state and product absence for: ${productId}`);
    await expect(this.cartPage.emptyCartState(), 'Empty cart state should be visible').toBeVisible();
    await expect(this.cartPage.cartLineItem(productId), `Product ${productId} should be absent from empty cart`).not.toBeVisible();
  }
}
