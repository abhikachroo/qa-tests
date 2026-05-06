import { Page, expect }            from '@playwright/test';
import { SearchResultsPage }       from '@pages/SearchResultsPage';
import { CartPage }                from '@pages/CartPage';
import { CheckoutLogisticsPage }   from '@pages/CheckoutLogisticsPage';
import { CheckoutVerificationPage } from '@pages/CheckoutVerificationPage';
import { OrderConfirmationPage }   from '@pages/OrderConfirmationPage';
import { HomePage }                from '@pages/HomePage';
import { Logger }                  from '@utils/Logger';
import { config }                  from '@config/index';

const DEFAULT_SKU = '6968173';

export class OrderFlowModule {
  private logger: Logger;

  constructor(
    private page:                     Page,
    private homePage:                 HomePage,
    private searchResultsPage:        SearchResultsPage,
    private cartPage:                 CartPage,
    private checkoutLogisticsPage:    CheckoutLogisticsPage,
    private checkoutVerificationPage: CheckoutVerificationPage,
    private orderConfirmationPage:    OrderConfirmationPage,
  ) {
    this.logger = new Logger('OrderFlowModule');
  }

  /**
   * Add a product to cart from the current search-results page.
   * Clicks the "Add to cart" button via SearchResultsPage and waits for
   * the header cart badge to reflect at least 1 item.
   *
   * Precondition: the search results page for the SKU must already be loaded.
   */
  async addProductToCart(sku: string = DEFAULT_SKU): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Adding SKU ${sku} to cart`);
    await this.searchResultsPage.clickAddToCart();
    // Wait for the cart badge to show at least 1 item
    await expect(
      this.homePage.cartButton(),
      'Cart badge should reflect at least 1 item after add-to-cart',
    ).not.toContainText('0');
    this.logger.info(`SKU ${sku} added to cart — cart badge updated`);
  }

  /**
   * Navigate to the cart page via the header cart badge and verify the product is present.
   */
  async navigateToCart(sku: string = DEFAULT_SKU): Promise<void> {
    this.logger.info(`Navigating to cart page for SKU ${sku}`);
    await this.homePage.cartButton().click();
    await this.cartPage.waitForPageLoad();
    await expect(
      this.cartPage.productCard(sku),
      `Product card for SKU ${sku} should be visible in cart`,
    ).toBeVisible();
    this.logger.info('Cart page loaded and product verified');
  }

  /**
   * Proceed from the cart page through the logistics step (1/2).
   * Clicks "Proceed to checkout" → waits for /logistics URL → verifies step indicator
   * → clicks "continue to verification" → waits for /verification URL.
   */
  async proceedThroughLogistics(): Promise<void> {
    this.logger.info('Proceeding through logistics step (1/2)');
    await this.cartPage.clickCheckoutButton();
    await this.page.waitForURL(/\/logistics/);
    await expect(
      this.checkoutLogisticsPage.stepIndicator(),
      'Logistics step indicator "1/2 - Logistics" should be visible',
    ).toBeVisible();
    await this.checkoutLogisticsPage.clickContinueButton();
    await this.page.waitForURL(/\/verification/);
    this.logger.info('Logistics step completed — navigated to verification');
  }

  /**
   * Complete the verification step (2/2) and submit the order.
   * Fills required Purchase Order and Project ID fields, verifies Invoice
   * payment is pre-selected, then clicks "Confirm your order".
   * Waits up to 30s for the confirmation URL to appear.
   */
  async completeVerificationAndConfirm(
    purchaseOrder: string = config.purchaseOrder,
    projectId: string     = config.projectId,
  ): Promise<void> {
    this.logger.info(`Completing verification step (2/2) — PO="${purchaseOrder}", ProjectID="${projectId}"`);
    await expect(
      this.checkoutVerificationPage.stepIndicator(),
      'Verification step indicator "2/2 - Verification" should be visible',
    ).toBeVisible();
    await this.checkoutVerificationPage.fillPurchaseOrder(purchaseOrder);
    await this.checkoutVerificationPage.fillProjectId(projectId);
    await expect(
      this.checkoutVerificationPage.creditLineRadio(),
      'Invoice / Credit Line payment radio should be pre-selected',
    ).toBeChecked();
    this.logger.info('Submitting order');
    await this.checkoutVerificationPage.clickConfirmOrderButton();
    await this.page.waitForURL(/\/checkout\/tunnel\/confirmation\//, { timeout: 30_000 });
    this.logger.info('Order submitted — confirmation page loaded');
  }

  /**
   * Assert the order confirmation page state.
   * Verifies: "Order confirmed!" heading, order reference containing "vanilla-",
   * product line item visible, and cart badge reset to 0.
   */
  async verifyOrderConfirmation(sku: string = DEFAULT_SKU): Promise<void> {
    this.logger.info('Verifying order confirmation page');
    await expect(
      this.orderConfirmationPage.confirmationHeading(),
      '"Order confirmed!" heading should be visible',
    ).toBeVisible();
    await expect(
      this.orderConfirmationPage.orderReferenceText(),
      'Order reference should contain the "vanilla-" prefix',
    ).toContainText('vanilla-');
    await expect(
      this.orderConfirmationPage.lineItemProductLink(),
      `Product line item for SKU ${sku} should be visible on the confirmation page`,
    ).toBeVisible();
    await expect(
      this.orderConfirmationPage.cartBadge(),
      'Cart badge should reset to 0 after order placement',
    ).toContainText('0');
    this.logger.info('Order confirmation verified successfully');
  }
}
