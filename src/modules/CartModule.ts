import { expect } from '@playwright/test';
import { ProductDetailPage } from '@pages/ProductDetailPage';
import { CartPage } from '@pages/CartPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

/**
 * CartModule — Layer 3
 * Business workflows for adding a product to the cart and navigating to checkout.
 * Orchestrates ProductDetailPage and CartPage — never calls page.locator() directly.
 */
export class CartModule {
  private logger: Logger;

  constructor(
    private productDetailPage: ProductDetailPage,
    private cartPage: CartPage,
  ) {
    this.logger = new Logger('CartModule');
  }

  /**
   * Navigate to a product detail page and add it to the cart.
   * Uses the productPath from config (e.g. /catalog/en-gb/products/{slug}).
   */
  async addProductToCartFromPdp(): Promise<void> {
    this.logger.info(
      `[${config.opco}][${config.environment}] Navigating to PDP: ${config.productPath}`,
    );
    await this.productDetailPage.navigateToProduct(config.productPath);
    await this.productDetailPage.waitForPageLoad();
    await this.productDetailPage.dismissCookieBannerIfPresent();
    this.logger.info('PDP loaded — clicking Add to Cart');
    await this.productDetailPage.clickAddToCart();
    await this.productDetailPage.waitForPageLoad();
    this.logger.info('Product added to cart');
  }

  /**
   * Verify the cart page shows the expected product.
   * Navigates to the cart path and asserts at least one item is present.
   */
  async verifyCartHasItem(): Promise<void> {
    this.logger.info(`Navigating to cart: ${config.cartPath}`);
    await this.cartPage.navigateToCart(config.cartPath);
    await this.cartPage.waitForPageLoad();
    await this.cartPage.dismissCookieBannerIfPresent();
    const count = await this.cartPage.getCartItemCount();
    expect(count, 'Cart should contain at least one item').toBeGreaterThan(0);
    this.logger.info(`Cart contains ${count} item(s)`);
  }

  /**
   * Click the "Checkout as guest" CTA from the cart page.
   * Asserts the button is enabled before clicking.
   */
  async proceedToGuestCheckout(): Promise<void> {
    this.logger.info('Clicking "Checkout as guest" button');
    await expect(
      this.cartPage.checkoutAsGuestBtn(),
      '"Checkout as guest" button should be visible',
    ).toBeVisible();
    await expect(
      this.cartPage.checkoutAsGuestBtn(),
      '"Checkout as guest" button should be enabled',
    ).toBeEnabled();
    await this.cartPage.clickCheckoutAsGuest();
    await this.cartPage.waitForPageLoad();
    this.logger.info('Guest checkout flow initiated');
  }
}
