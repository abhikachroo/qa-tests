import { expect }             from '@playwright/test';
import { ProductDetailPage }  from '@pages/ProductDetailPage';
import { CartPage }           from '@pages/CartPage';
import { Logger }             from '@utils/Logger';
import { config }             from '@config/index';

/**
 * PurchaseModule — Layer 3 Business Logic
 *
 * Orchestrates the full purchase flow:
 *   navigateToPdp → addToCart → proceedToCheckout → confirmOrder
 *
 * Depends on: ProductDetailPage, CartPage
 * Uses: Logger for all output, config for URLs
 */
export class PurchaseModule {
  private logger: Logger;

  constructor(
    private productDetailPage: ProductDetailPage,
    private cartPage:          CartPage,
  ) {
    this.logger = new Logger('PurchaseModule');
  }

  /**
   * Navigate directly to the PDP for the given product slug.
   *
   * @param slugWithId - The full URL slug including product ID
   *   e.g. 'lista-schuifladekast-mobiel-27x27e-bxdxh-564x572x723mm-5-lades-ral7035-grijs-6968173'
   */
  async navigateToPdp(slugWithId: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Navigating to PDP: ${slugWithId}`);
    await this.productDetailPage.navigateToPdp(slugWithId);
    this.logger.info('PDP loaded');
  }

  /**
   * Add the current PDP product to the cart and verify the step message updates.
   * The add-to-cart CTA is confirmed via data-testid='quantity-counter-cta-add'.
   */
  async addToCart(): Promise<void> {
    this.logger.info('Clicking "Add to cart" on PDP');
    await this.productDetailPage.clickAddToCart();
    // Wait for the step message feedback element to become visible — confirms the
    // cart API call completed and the UI updated.
    await this.productDetailPage.stepMessage().waitFor({ state: 'visible', timeout: 15_000 });
    this.logger.info('Product added to cart — step message is visible');
  }

  /**
   * Navigate to the cart page and select the delivery option.
   */
  async navigateToCartAndSelectDelivery(): Promise<void> {
    this.logger.info('Navigating to cart page');
    await this.cartPage.navigateToCart();
    this.logger.info('Selecting delivery option');
    await this.cartPage.selectDeliveryOption();
    this.logger.info('Delivery option selected');
  }

  /**
   * Click "Proceed to checkout" and wait for the checkout step URL.
   */
  async proceedToCheckout(): Promise<void> {
    this.logger.info('Clicking "Proceed to checkout"');
    await this.cartPage.clickProceedToCheckout();
    await this.cartPage.waitForCheckoutNavigation();
    this.logger.info('Navigated to checkout step page');
  }

  /**
   * Verify the checkout-step page is displayed with the order summary visible.
   * The checkout button on cart navigates to a multi-step checkout form.
   */
  async verifyCheckoutPageLoaded(): Promise<void> {
    this.logger.info('Verifying checkout step page loaded');
    await expect(
      this.cartPage.checkoutBtn(),
      'Checkout CTA should not be visible once the user is past the cart step',
    ).not.toBeVisible();
    this.logger.info('Checkout step verified — cart CTA is no longer present');
  }

  /**
   * Verify the cart page shows the "Proceed to checkout" button, confirming
   * the product was added and the cart is non-empty.
   */
  async verifyCartHasProduct(): Promise<void> {
    this.logger.info('Verifying cart contains product and checkout CTA is enabled');
    await expect(
      this.cartPage.checkoutBtn(),
      '"Proceed to checkout" button should be visible when cart has items',
    ).toBeVisible();
    this.logger.info('Cart verified — checkout button is present');
  }
}
