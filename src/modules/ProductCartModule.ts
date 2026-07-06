import { expect } from '@playwright/test';
import { SearchResultsPage } from '@pages/SearchResultsPage';
import { CartPage } from '@pages/CartPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class ProductCartModule {
  private logger: Logger;

  constructor(
    private searchResultsPage: SearchResultsPage,
    private cartPage: CartPage,
  ) {
    this.logger = new Logger('ProductCartModule');
  }

  async addProductFromSearchResults(productId: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Adding product from search results`, { productId });
    await expect(this.searchResultsPage.productCard(productId), 'Matching product card should be visible').toBeVisible();
    await this.searchResultsPage.clickAddToCartForProduct(productId);
    this.logger.info('Add-to-cart action submitted');
  }

  async verifyAddToCartConfirmation(): Promise<void> {
    this.logger.info('Verifying add-to-cart confirmation state');
    await expect(
      this.searchResultsPage.addToCartConfirmation().or(this.searchResultsPage.cartCountIndicator()),
      'Add-to-cart confirmation or cart count update should be visible',
    ).toBeVisible();
  }

  async openCartFromSupportedNavigation(): Promise<void> {
    this.logger.info('Opening cart through supported storefront navigation');
    await this.cartPage.openCartFromNavigation();
    await this.cartPage.waitForCartView();
  }

  async verifyCartViewLoaded(): Promise<void> {
    this.logger.info('Verifying cart view loaded');
    await expect(
      this.cartPage.cartHeading().or(this.cartPage.cartContentRegion()),
      'Cart heading or cart content region should be visible',
    ).toBeVisible();
    await expect(this.cartPage.notFoundState(), 'Cart navigation should not show not-found state').not.toBeVisible();
  }

  async verifyProductInCart(productId: string): Promise<void> {
    this.logger.info('Verifying product line item is present in cart', { productId });
    await expect(
      this.cartPage.cartLineItem(productId).or(this.cartPage.productIdentifier(productId)),
      `Cart should contain product ${productId}`,
    ).toBeVisible();
    await expect(this.cartPage.emptyCartMessage(), 'Cart should not be empty after add-to-cart').not.toBeVisible();
  }

  async verifyUnavailableProductState(productId: string): Promise<void> {
    this.logger.info('Verifying unavailable product does not create a success state', { productId });
    await expect(
      this.searchResultsPage.unavailableStateForProduct(productId).or(this.searchResultsPage.addToCartButtonForProduct(productId)),
      'Unavailable label or guarded add-to-cart action should be visible',
    ).toBeVisible();
    await expect(
      this.searchResultsPage.addToCartConfirmation(),
      'Unavailable product should not display add-to-cart success confirmation',
    ).not.toBeVisible();
  }

  async navigateToDirectCartRoute(): Promise<void> {
    this.logger.info('Navigating directly to cart route to document current route behavior');
    await this.cartPage.navigate('/cart');
    await this.cartPage.waitForPageLoad();
  }

  async verifyDirectCartRouteSafeState(): Promise<void> {
    this.logger.info('Verifying direct cart route safe not-found/recoverable state');
    await expect(this.cartPage.notFoundState(), 'Direct unsupported cart route should show safe not-found state').toBeVisible();
  }
}
