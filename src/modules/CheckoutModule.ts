import { expect, Page } from '@playwright/test';
import { ProductDetailPage }       from '@pages/ProductDetailPage';
import { CartPage }                 from '@pages/CartPage';
import { CheckoutLogisticsPage }    from '@pages/CheckoutLogisticsPage';
import { CheckoutVerificationPage } from '@pages/CheckoutVerificationPage';
import { OrderConfirmationPage }    from '@pages/OrderConfirmationPage';
import { Logger }                   from '@utils/Logger';
import { config }                   from '@config/index';

/**
 * CheckoutModule — Layer 3: Business logic workflows
 *
 * Orchestrates the full checkout flow:
 *   1. Navigate to PDP and add product to cart
 *   2. Navigate to cart and proceed to checkout
 *   3. Complete Logistics step (Step 1/2)
 *   4. Complete Verification step (Step 2/2) and submit order
 *   5. Verify order confirmation page
 */
export class CheckoutModule {
  private logger: Logger;

  constructor(
    private page:                     Page,
    private productDetailPage:        ProductDetailPage,
    private cartPage:                 CartPage,
    private checkoutLogisticsPage:    CheckoutLogisticsPage,
    private checkoutVerificationPage: CheckoutVerificationPage,
    private orderConfirmationPage:    OrderConfirmationPage,
  ) {
    this.logger = new Logger('CheckoutModule');
  }

  /**
   * Navigate to a product's PDP and add it to the cart.
   *
   * @param pdpPath  - Relative path to the PDP, e.g. '/catalog/en-gb/products/...'
   * @param sku      - Product SKU for error-area assertion
   */
  async addProductToCart(pdpPath: string, sku: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Navigating to PDP: ${pdpPath}`);
    await this.productDetailPage.navigate(pdpPath);
    await this.productDetailPage.waitForPageLoad();
    await this.productDetailPage.dismissCookieBannerIfPresent();
    this.logger.info(`PDP loaded — asserting product heading is visible`);
    await expect(
      this.productDetailPage.productHeading(),
      'Product H1 heading should be visible on PDP',
    ).toBeVisible();
    this.logger.info(`Clicking Add to Cart for SKU: ${sku}`);
    await this.productDetailPage.clickAddToCart();
    await this.productDetailPage.waitForPageLoad();
    this.logger.info(`SKU ${sku} added to cart`);
  }

  /**
   * Navigate to the cart page and proceed to checkout.
   * Verifies the target SKU is present before clicking checkout.
   *
   * @param sku - SKU to confirm is in the cart
   */
  async proceedToCheckoutFromCart(sku: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Navigating to cart`);
    await this.cartPage.navigate('/checkout/en-gb/');
    await this.cartPage.waitForPageLoad();
    await this.cartPage.dismissCookieBannerIfPresent();
    this.logger.info(`Cart page loaded — verifying SKU ${sku} is present`);
    await expect(
      this.cartPage.quantityCounter(sku),
      `Cart should contain SKU ${sku}`,
    ).toBeVisible();
    this.logger.info('Clicking Proceed to checkout');
    await this.cartPage.clickCheckoutButton();
    await this.cartPage.waitForLogisticsUrl();
    this.logger.info('Navigated to Logistics step');
  }

  /**
   * Complete the Logistics step (Step 1/2) of the checkout tunnel.
   * Verifies the step is loaded, then advances to Verification.
   */
  async completeLogisticsStep(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Completing Logistics step 1/2`);
    await this.checkoutLogisticsPage.waitForPageLoad();
    await expect(
      this.checkoutLogisticsPage.continueToVerificationBtn(),
      '"continue to verification" button should be visible on Logistics step',
    ).toBeVisible();
    this.logger.info('Clicking "continue to verification"');
    await this.checkoutLogisticsPage.clickContinueToVerification();
    await this.checkoutLogisticsPage.waitForVerificationUrl();
    this.logger.info('Navigated to Verification step');
  }

  /**
   * Complete the Verification step (Step 2/2) and submit the order.
   * Fills required Purchase Order and Project ID fields.
   * Asserts Invoice payment is pre-selected.
   * Clicks confirm and waits for navigation away from verification page.
   *
   * @param purchaseOrder - Value for the required Purchase Order field
   * @param projectId     - Value for the required Project ID field
   */
  async completeVerificationAndSubmit(
    purchaseOrder: string,
    projectId: string,
  ): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Completing Verification step 2/2`);
    await this.checkoutVerificationPage.waitForPageLoad();
    this.logger.info('Asserting Invoice payment radio is pre-selected');
    await expect(
      this.checkoutVerificationPage.invoicePaymentRadio(),
      'Invoice (creditLine) payment should be pre-selected',
    ).toBeChecked();
    this.logger.info(`Filling Purchase Order: ${purchaseOrder}`);
    await this.checkoutVerificationPage.fillPurchaseOrder(purchaseOrder);
    this.logger.info(`Filling Project ID: ${projectId}`);
    await this.checkoutVerificationPage.fillProjectId(projectId);
    this.logger.info('Clicking "confirm your order"');
    await this.checkoutVerificationPage.clickConfirmOrder();
    await this.checkoutVerificationPage.waitForConfirmationUrl();
    this.logger.info('Order submitted — navigated away from verification page');
  }

  /**
   * Verify the order confirmation page is displayed with expected content.
   * Checks heading, and product SKU reference.
   *
   * @param sku - Product SKU expected to appear on the confirmation page
   */
  async verifyOrderConfirmation(sku: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Verifying order confirmation page`);
    await expect(
      this.orderConfirmationPage.confirmationHeading(),
      'Order confirmation heading (H1) should be visible',
    ).toBeVisible();
    this.logger.info('Verifying product SKU reference is present on confirmation page');
    await expect(
      this.orderConfirmationPage.productReference(sku),
      `Product SKU ${sku} should appear on the order confirmation page`,
    ).toBeVisible();
    this.logger.info('Order confirmation page verified successfully');
  }
}
