import { expect, Page }                  from '@playwright/test';
import { CartPage }                       from '@pages/CartPage';
import { CheckoutLogisticsPage }          from '@pages/CheckoutLogisticsPage';
import { CheckoutVerificationPage }       from '@pages/CheckoutVerificationPage';
import { OrderConfirmationPage }          from '@pages/OrderConfirmationPage';
import { HeaderSearchPage }              from '@pages/HeaderSearchPage';
import { SearchResultsPage }             from '@pages/SearchResultsPage';
import { Logger }                        from '@utils/Logger';
import { config }                        from '@config/index';

/** SKU used for the E2E order flow — hardcoded by product scope, not test data */
const ORDER_FLOW_SKU = '6968173';

/**
 * OrderFlowModule — orchestrates the full cart → checkout → confirmation flow.
 *
 * Depends on:
 *   - SearchResultsPage: for product card interaction (add to cart)
 *   - HeaderSearchPage: for cart navigation via header badge
 *   - CartPage: cart assertions and proceed to checkout
 *   - CheckoutLogisticsPage: Step 1 logistics
 *   - CheckoutVerificationPage: Step 2 verification + order submission
 *   - OrderConfirmationPage: confirmation page assertions
 */
export class OrderFlowModule {
  private logger: Logger;

  constructor(
    private page:                     Page,
    private searchResultsPage:        SearchResultsPage,
    private headerSearchPage:         HeaderSearchPage,
    private cartPage:                 CartPage,
    private checkoutLogisticsPage:    CheckoutLogisticsPage,
    private checkoutVerificationPage: CheckoutVerificationPage,
    private orderConfirmationPage:    OrderConfirmationPage,
  ) {
    this.logger = new Logger('OrderFlowModule');
  }

  /**
   * Add the product identified by ORDER_FLOW_SKU to the cart from the search results page.
   * Precondition: search results page for SKU 6968173 is already loaded.
   */
  async addProductToCart(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Adding SKU ${ORDER_FLOW_SKU} to cart`);
    await this.searchResultsPage.clickAddToCart();
    this.logger.info('Add to cart clicked — awaiting cart badge increment');
  }

  /**
   * Assert the cart header badge shows the expected item count.
   */
  async verifyCartBadgeCount(expectedCount: number): Promise<void> {
    this.logger.info(`Verifying cart badge shows count: ${expectedCount}`);
    await expect(
      this.headerSearchPage.cartButton(),
      `Cart badge should show ${expectedCount} item(s)`,
    ).toContainText(String(expectedCount));
  }

  /**
   * Navigate from search results to the cart page by clicking the header cart button.
   */
  async navigateToCart(): Promise<void> {
    this.logger.info('Navigating to cart via header cart button');
    await this.headerSearchPage.clickCartButton();
    await this.cartPage.waitForPageLoad();
    this.logger.info('Cart page loaded');
  }

  /**
   * Assert cart contents: product present, quantity = 1, prices correct.
   */
  async verifyCartContents(): Promise<void> {
    this.logger.info('Verifying cart contents for SKU ' + ORDER_FLOW_SKU);
    await expect(
      this.cartPage.productTitle(),
      'Product title should be visible in the cart',
    ).toContainText('Schuifladekast');
    await expect(
      this.cartPage.quantityInput(ORDER_FLOW_SKU),
      'Quantity should be 1',
    ).toHaveValue('1');
  }

  /**
   * Assert the checkout (proceed) button is enabled and click it to enter the tunnel.
   */
  async proceedToCheckout(): Promise<void> {
    this.logger.info('Clicking "Proceed to checkout" from cart');
    await expect(
      this.cartPage.checkoutButton(),
      '"Proceed to checkout" button should be enabled',
    ).toBeEnabled();
    await this.cartPage.clickCheckoutButton();
    await this.checkoutLogisticsPage.waitForLogisticsUrl();
    this.logger.info('Entered checkout tunnel — Logistics step loaded');
  }

  /**
   * Assert Logistics step content and advance to Verification.
   */
  async completeLogisticsStep(): Promise<void> {
    this.logger.info('Verifying Logistics step and advancing to Verification');
    await expect(
      this.checkoutLogisticsPage.lineItemProductLink(),
      'Line item for SKU 6968173 should be visible in Logistics step',
    ).toBeVisible();
    await this.checkoutLogisticsPage.clickContinueToVerification();
    await this.checkoutVerificationPage.waitForVerificationUrl();
    this.logger.info('Verification step loaded');
  }

  /**
   * Fill required Verification fields, confirm payment method, and submit the order.
   *
   * @param purchaseOrder - Purchase Order reference string
   * @param projectId     - Project ID string
   */
  async completeVerificationStep(
    purchaseOrder: string,
    projectId: string,
  ): Promise<void> {
    this.logger.info(`Completing Verification step — PO: ${purchaseOrder}, ProjectID: ${projectId}`);
    await expect(
      this.checkoutVerificationPage.invoicePaymentRadio(),
      'Invoice / Credit Line payment should be pre-selected',
    ).toBeChecked();
    await this.checkoutVerificationPage.fillPurchaseOrder(purchaseOrder);
    await this.checkoutVerificationPage.fillProjectId(projectId);
    this.logger.info('Required fields filled — submitting order');
    await this.checkoutVerificationPage.clickConfirmOrder();
  }

  /**
   * Wait for the Order Confirmation page and assert success indicators.
   *
   * NOTE: Confirmation page locators are UNVERIFIED — see OrderConfirmationPage TODO comments.
   * This method will need to be hardened after the first successful manual run.
   */
  async verifyOrderConfirmation(): Promise<void> {
    this.logger.info('Waiting for Order Confirmation page');
    await this.orderConfirmationPage.waitForConfirmationUrl();
    this.logger.info('Order Confirmation URL reached — verifying success state');
    await expect(
      this.orderConfirmationPage.successHeading(),
      'A success / confirmation heading should be visible',
    ).toBeVisible();
    const orderRef = await this.orderConfirmationPage.getOrderReference();
    this.logger.info(`Order reference number displayed: ${orderRef}`);
  }
}
