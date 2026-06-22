import { expect, Page } from '@playwright/test';
import { SearchModule } from '@modules/SearchModule';
import { SearchResultsPage } from '@pages/SearchResultsPage';
import { ProductCartPage } from '@pages/ProductCartPage';
import { Logger } from '@utils/Logger';

export class ProductCartModule {
  private logger: Logger;

  constructor(
    private page: Page,
    private searchModule: SearchModule,
    private searchResultsPage: SearchResultsPage,
    private productCartPage: ProductCartPage,
  ) {
    this.logger = new Logger('ProductCartModule');
  }

  async searchAndSelectProduct(productId: string): Promise<void> {
    this.logger.info(`Searching and selecting product: ${productId}`);
    await this.searchModule.submitSearch(productId);
    await this.searchModule.verifySearchResultsPage(productId);
    await this.searchResultsPage.selectProduct(productId);
    await this.productCartPage.waitForPageLoad();
    this.logger.info(`Product selected: ${productId}`);
  }

  async addSelectedProductToCart(): Promise<void> {
    this.logger.info('Adding selected product to cart');
    await this.productCartPage.clickAddToCart();
    this.logger.info('Add-to-cart action submitted');
  }

  async openCart(): Promise<void> {
    this.logger.info('Opening cart from header');
    await this.productCartPage.openCart();
    await this.productCartPage.waitForPageLoad();
    this.logger.info('Cart view opened');
  }

  async verifyProductSelection(productId: string): Promise<void> {
    await expect(this.searchResultsPage.error404Container(), '404 page should not be shown after selecting product').not.toBeVisible();
    await expect(this.productCartPage.productIdText(productId), `Product ID ${productId} should remain visible`).toBeVisible();
    await expect(this.productCartPage.addToCartButton(), 'Add-to-cart control should be available').toBeVisible();
  }

  async verifyAddToCartSucceeded(productId: string): Promise<void> {
    await expect(this.productCartPage.errorMessage(), 'No add-to-cart error should be shown').not.toBeVisible();
    await expect(this.productCartPage.cartButton(), 'Cart button should be visible after add-to-cart').toBeVisible();
    await expect(this.productCartPage.productIdText(productId), `Product ID ${productId} should stay associated with the action`).toBeVisible();
  }

  async verifyCartContainsProduct(productId: string): Promise<void> {
    await expect(this.productCartPage.error404Container(), 'Cart view should not render the 404 page').not.toBeVisible();
    await expect(this.productCartPage.cartLineItems(), 'Cart should contain at least one line item').not.toHaveCount(0);
    await expect(this.productCartPage.cartLineItemByProductId(productId), `Cart line item should contain product ID ${productId}`).toBeVisible();
  }

  async verifyAddToCartFailure(): Promise<void> {
    await expect(this.productCartPage.errorMessage(), 'Recoverable add-to-cart error should be displayed').toBeVisible();
  }

  async verifyEmptyCartState(): Promise<void> {
    await this.openCart();
    await expect(this.productCartPage.error404Container(), 'Opening cart through app navigation should not show 404').not.toBeVisible();
    await expect(this.productCartPage.emptyCartState(), 'Empty-cart guidance should be visible').toBeVisible();
  }

  async routeAddToCartFailure(): Promise<void> {
    await this.page.route(/cart|basket|order/i, async (route) => {
      await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: 'Add to cart failed' }) });
    });
  }
}
