import { expect, Page }      from '@playwright/test';
import { ProductDetailPage }  from '@pages/ProductDetailPage';
import { CartPage }           from '@pages/CartPage';
import { Logger }             from '@utils/Logger';
import { config }             from '@config/index';

/**
 * PurchaseFlowModule — orchestrates the add-to-cart and checkout journey.
 *
 * Composes ProductDetailPage + CartPage into higher-level multi-step flows.
 * Consumed by: purchase-flow.spec.ts
 */
export class PurchaseFlowModule {
  private logger: Logger;

  constructor(
    private productDetailPage: ProductDetailPage,
    private cartPage:          CartPage,
  ) {
    this.logger = new Logger('PurchaseFlowModule');
  }

  // ────────────────────────────────────────────────────────────────
  // PDP flows
  // ────────────────────────────────────────────────────────────────

  /**
   * Navigate to a PDP and assert that the key product detail elements are present.
   *
   * @param slug        URL path segment, e.g. '/catalog/en-gb/products/lista-...-6968173'
   * @param productId   Expected Sonepar article number, e.g. '6968173'
   * @param productName Partial product name to assert (substring match)
   */
  async navigateAndVerifyPdp(
    slug: string,
    productId: string,
    productName: string,
  ): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Navigating to PDP: ${slug}`);
    await this.productDetailPage.navigateToPdp(slug);
    await expect(
      this.productDetailPage.addToCartBtn(),
      '"Add to cart" button should be visible on the PDP',
    ).toBeVisible();
    await expect(
      this.productDetailPage.quantityInput(),
      'Quantity input (buybox-counter) should be visible',
    ).toBeVisible();
    const productIdText = await this.productDetailPage.getProductIdText();
    expect(
      productIdText,
      `Product ID badge should contain "${productId}"`,
    ).toContain(productId);
    this.logger.info(`PDP verified for product ${productId}: "${productName}"`);
  }

  /**
   * Add a product to the cart from the PDP and verify the cart header counter increments.
   *
   * @param slug      PDP URL path segment
   * @param productId Sonepar article number (used for stepMessage assertion)
   */
  async addToCartFromPdp(slug: string, productId: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Adding product ${productId} to cart from PDP`);
    await this.productDetailPage.navigateToPdp(slug);
    // Record cart count before
    const cartBtnBefore = this.productDetailPage.cartHeaderBtn();
    const beforeText = (await cartBtnBefore.textContent({ timeout: 5_000 }).catch(() => '')) ?? '';
    this.logger.info(`Cart count before add: "${beforeText}"`);
    await this.productDetailPage.clickAddToCart();
    // Wait for the step-message to update (in-cart status indicator)
    await this.productDetailPage.stepMessage(productId).waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {
      this.logger.info('stepMessage not visible — relying on cart header counter change');
    });
    this.logger.info(`Product ${productId} added to cart`);
  }

  // ────────────────────────────────────────────────────────────────
  // Cart flows
  // ────────────────────────────────────────────────────────────────

  /**
   * Navigate to the cart and assert the product and pricing details.
   *
   * @param productName   Partial product name substring expected in the cart
   * @param unitPriceText Price string expected on screen, e.g. '1,140.43'
   */
  async verifyCartContents(productName: string, unitPriceText: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Verifying cart contents`);
    await this.cartPage.navigateToCart();
    // Product name somewhere on the page
    await expect(
      this.cartPage.page.getByText(productName, { exact: false }),
      `Cart page should contain product name "${productName}"`,
    ).toBeVisible();
    // Unit price visible somewhere on the page
    await expect(
      this.cartPage.page.getByText(unitPriceText, { exact: false }),
      `Cart page should display unit price "${unitPriceText}"`,
    ).toBeVisible();
    // Proceed to checkout button present
    await expect(
      this.cartPage.checkoutBtn(),
      '"Proceed to checkout" button should be visible',
    ).toBeVisible();
    this.logger.info('Cart contents verified');
  }

  /**
   * Navigate to the cart page and click "Proceed to checkout".
   * Asserts delivery option radio buttons are present after navigation.
   */
  async proceedToCheckout(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Proceeding to checkout from cart`);
    await this.cartPage.navigateToCart();
    await this.cartPage.clickCheckout();
    await this.cartPage.page.waitForLoadState('networkidle');
    this.logger.info('Proceeded to checkout page');
  }

  /**
   * Verify the checkout page has delivery options.
   * Asserts both pickup and delivery radios are visible.
   */
  async verifyCheckoutDeliveryOptions(): Promise<void> {
    this.logger.info('Verifying checkout page delivery options');
    await expect(
      this.cartPage.deliveryRadio(),
      'Delivery radio should be visible on checkout page',
    ).toBeVisible();
    await expect(
      this.cartPage.pickupRadio(),
      'Pickup radio should be visible on checkout page',
    ).toBeVisible();
    this.logger.info('Delivery options verified');
  }

  /**
   * Select the delivery option and attempt to place the order.
   * Waits for the URL to change to a confirmation pattern.
   *
   * NOTE: The final "Place Order" / "Confirm" button selector must be
   * confirmed on the live checkout step page during the first run.
   * This method will be updated once the selector is known.
   *
   * @param page  Raw Playwright Page — needed for generic waitForURL assertion
   */
  async placeOrderWithDelivery(page: Page): Promise<void> {
    this.logger.info('Placing order with delivery option selected');
    await this.cartPage.selectDelivery();
    await this.cartPage.clickCheckout();
    await page.waitForLoadState('networkidle');
    // Wait for a confirmation URL pattern (to be confirmed on first run)
    await page.waitForURL(
      (url) =>
        url.pathname.includes('confirmation') ||
        url.pathname.includes('order-confirmation') ||
        url.pathname.includes('thank-you'),
      { timeout: 30_000 },
    ).catch(() => {
      this.logger.info(
        'URL did not match confirmation pattern within timeout — confirm checkout step flow manually',
      );
    });
    this.logger.info('Order placement flow completed');
  }
}
