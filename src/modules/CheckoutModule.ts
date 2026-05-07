import { Page, expect }                    from '@playwright/test';
import { SearchResultsPage }               from '@pages/SearchResultsPage';
import { CartPage }                        from '@pages/CartPage';
import { CheckoutLogisticsPage }           from '@pages/CheckoutLogisticsPage';
import { CheckoutVerificationPage }        from '@pages/CheckoutVerificationPage';
import { OrderConfirmationPage }           from '@pages/OrderConfirmationPage';
import { Logger }                          from '@utils/Logger';
import { config }                          from '@config/index';

export class CheckoutModule {
  private logger: Logger;

  constructor(
    private page:                     Page,
    private searchResultsPage:        SearchResultsPage,
    private cartPage:                 CartPage,
    private checkoutLogisticsPage:    CheckoutLogisticsPage,
    private checkoutVerificationPage: CheckoutVerificationPage,
    private orderConfirmationPage:    OrderConfirmationPage,
  ) {
    this.logger = new Logger('CheckoutModule');
  }

  /**
   * Add a product to the cart from the search results page and assert the product card is visible.
   * @param sku - The product SKU to add (e.g. '6968173')
   */
  async addSkuToCart(sku: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Adding SKU ${sku} to cart`);
    await expect(
      this.searchResultsPage.productCardBySku(sku),
      `Product card for SKU ${sku} should be visible before adding to cart`,
    ).toBeVisible();
    await this.searchResultsPage.clickAddToCart();
    this.logger.info(`SKU ${sku} add-to-cart clicked — awaiting badge update`);
  }

  /**
   * Assert the cart badge aria-label reflects the expected item count.
   * @param expectedCount - Number of items expected (e.g. 1)
   */
  async assertCartBadgeCount(expectedCount: number): Promise<void> {
    this.logger.info(`Asserting cart badge count = ${expectedCount}`);
    await expect(
      this.searchResultsPage.cartButton(),
      `Cart button aria-label should contain "${expectedCount} items"`,
    ).toHaveAttribute('aria-label', new RegExp(`${expectedCount} items`));
    this.logger.info('Cart badge count verified');
  }

  /**
   * Navigate to the cart page and assert it shows the expected product count.
   * @param expectedProductLabel - e.g. '1 product'
   */
  async verifyCartPage(expectedProductLabel: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Navigating to cart page`);
    await this.cartPage.navigate('/checkout/en-gb/');
    await this.cartPage.waitForPageLoad();
    this.logger.info('Cart page loaded — verifying product count');
    await expect(
      this.cartPage.cartNumberOfProducts(),
      `Cart should show "${expectedProductLabel}"`,
    ).toHaveText(expectedProductLabel);
  }

  /**
   * Click "Proceed to checkout" from the cart page and wait for the logistics step URL.
   */
  async proceedToCheckout(): Promise<void> {
    this.logger.info('Clicking "Proceed to checkout"');
    await this.cartPage.clickProceedToCheckout();
    await this.page.waitForURL('**/logistics**', { timeout: 30_000 });
    this.logger.info('Navigated to logistics step');
  }

  /**
   * Assert the logistics step stepper indicator and key elements, then continue to verification.
   */
  async completeLogisticsStep(): Promise<void> {
    this.logger.info('Verifying logistics step and continuing to verification');
    await expect(
      this.checkoutLogisticsPage.stepIndicator(),
      'Step indicator should show 1/2 - Logistics',
    ).toContainText('1/2');
    await expect(
      this.checkoutLogisticsPage.deliveryAddressBox(),
      'Delivery address box should be visible on logistics step',
    ).toBeVisible();
    await this.checkoutLogisticsPage.clickContinueToVerification();
    await this.page.waitForURL('**/verification**', { timeout: 30_000 });
    this.logger.info('Navigated to verification step');
  }

  /**
   * Complete the verification step: fill required fields and submit order.
   * @param purchaseOrder - Purchase Order reference string
   * @param projectId     - Project ID string
   */
  async completeVerificationStep(purchaseOrder: string, projectId: string): Promise<void> {
    this.logger.info(`Completing verification step — PO: ${purchaseOrder}, ProjectID: ${projectId}`);
    await expect(
      this.checkoutVerificationPage.stepIndicator(),
      'Step indicator should show 2/2 - Verification',
    ).toContainText('2/2');
    await this.checkoutVerificationPage.fillPurchaseOrder(purchaseOrder);
    await this.checkoutVerificationPage.fillProjectId(projectId);
    await expect(
      this.checkoutVerificationPage.creditLineRadio(),
      'Invoice / Credit Line payment should be pre-selected',
    ).toBeChecked();
    await this.checkoutVerificationPage.clickConfirmOrder();
    await this.page.waitForURL('**/confirmation/**', { timeout: 30_000 });
    this.logger.info('Order submitted — navigated to confirmation page');
  }

  /**
   * Assert the order confirmation page: heading, order reference regex, history button.
   */
  async assertOrderConfirmation(): Promise<void> {
    this.logger.info('Asserting order confirmation page');
    await expect(
      this.orderConfirmationPage.confirmedHeading(),
      '"Order confirmed!" heading should be visible',
    ).toBeVisible();
    await expect(
      this.orderConfirmationPage.orderReferenceText(),
      'Order reference should match /Ref vanilla-\\d+/',
    ).toContainText(/Ref vanilla-\d+/);
    await expect(
      this.orderConfirmationPage.goToOrderHistoryButton(),
      '"Go to Order history" button should be visible',
    ).toBeVisible();
    await expect(
      this.orderConfirmationPage.goToOrderHistoryButton(),
      '"Go to Order history" button should be enabled',
    ).toBeEnabled();
    this.logger.info('Order confirmation verified');
  }

  /**
   * Clear the cart by navigating to the cart page and clicking remove-from-cart
   * for each item present. Safe to call when cart is already empty.
   */
  async clearCart(): Promise<void> {
    this.logger.info('Clearing cart before test');
    await this.cartPage.navigate('/checkout/en-gb/');
    await this.cartPage.waitForPageLoad();
    let attempts = 0;
    while (await this.cartPage.isRemoveFromCartVisible() && attempts < 10) {
      await this.cartPage.clickRemoveFromCart();
      attempts++;
      await this.cartPage.waitForPageLoad();
    }
    this.logger.info(`Cart cleared — removed ${attempts} item(s)`);
  }
}
