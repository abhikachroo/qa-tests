import { Page, expect } from '@playwright/test';
import { CartPage }                 from '@pages/CartPage';
import { CheckoutLogisticsPage }    from '@pages/CheckoutLogisticsPage';
import { CheckoutVerificationPage } from '@pages/CheckoutVerificationPage';
import { OrderConfirmationPage }    from '@pages/OrderConfirmationPage';
import { HeaderSearchPage }         from '@pages/HeaderSearchPage';
import { SearchResultsPage }        from '@pages/SearchResultsPage';
import { HomePage }                 from '@pages/HomePage';
import { Logger }                   from '@utils/Logger';
import { config }                   from '@config/index';

export class CheckoutModule {
  private logger: Logger;

  constructor(
    private page: Page,
    private homePage: HomePage,
    private headerSearchPage: HeaderSearchPage,
    private searchResultsPage: SearchResultsPage,
    private cartPage: CartPage,
    private logisticsPage: CheckoutLogisticsPage,
    private verificationPage: CheckoutVerificationPage,
    private confirmationPage: OrderConfirmationPage,
  ) {
    this.logger = new Logger('CheckoutModule');
  }

  /**
   * Clears the cart by navigating to /checkout/en-gb/ and removing
   * any existing items. Safe to call even if cart is already empty.
   */
  async clearCart(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Clearing cart before test`);
    await this.cartPage.navigateToCart();
    const removeBtn = this.cartPage.removeFromCartButton();
    while (await removeBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await removeBtn.first().click();
      await this.cartPage.waitForPageLoad();
      this.logger.info('Removed one cart item');
    }
    this.logger.info('Cart cleared');
  }

  /**
   * Searches for a product by SKU using the header search bar and
   * verifies the product card is visible on the search results page.
   */
  async searchForProduct(sku: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Searching for SKU: ${sku}`);
    await this.headerSearchPage.fillSearchInput(sku);
    await this.headerSearchPage.clickSubmitButton();
    await this.headerSearchPage.waitForSearchNavigation(sku);
    await expect(
      this.searchResultsPage.productCardByTestId(sku),
      `Product card for SKU ${sku} should be visible on search results`,
    ).toBeVisible();
    this.logger.info(`Product card for SKU ${sku} is visible`);
  }

  /**
   * Adds the product to cart via the search results page and
   * verifies the cart button aria-label increments to 1 item.
   */
  async addToCart(): Promise<void> {
    this.logger.info('Adding product to cart');
    await this.searchResultsPage.clickAddToCart();
    await expect(
      this.homePage.cartButton(),
      'Cart button aria-label should reflect 1 item after add-to-cart',
    ).toHaveAttribute('aria-label', /1 items/);
    this.logger.info('Cart badge updated to 1 item — add-to-cart successful');
  }

  /**
   * Navigates to the cart page and verifies product count and SKU reference.
   */
  async verifyCart(sku: string): Promise<void> {
    this.logger.info('Navigating to cart page for verification');
    await this.cartPage.navigateToCart();
    await expect(
      this.cartPage.cartNumberOfProducts(),
      'Cart should show 1 product',
    ).toHaveText('1 product');
    await expect(
      this.cartPage.productReference(),
      `Cart should contain SKU reference ${sku}`,
    ).toContainText(sku);
    this.logger.info(`Cart verified: 1 product containing SKU ${sku}`);
  }

  /**
   * Clicks "Proceed to checkout" from the cart page and
   * verifies the logistics step loads with step indicator "1/2".
   */
  async proceedToLogistics(): Promise<void> {
    this.logger.info('Clicking Proceed to checkout — expecting logistics step');
    await this.cartPage.clickProceedToCheckout();
    await this.page.waitForURL('**/logistics**', { timeout: 30_000 });
    await expect(
      this.logisticsPage.stepIndicator(),
      'Stepper should show step 1/2 on logistics page',
    ).toContainText('1/2');
    await expect(
      this.logisticsPage.deliveryAddressBox(),
      'Delivery address box should be visible on logistics step',
    ).toBeVisible();
    this.logger.info('Logistics step 1/2 loaded and verified');
  }

  /**
   * Clicks "Continue to verification" and verifies the verification step
   * loads with step indicator "2/2".
   */
  async proceedToVerification(): Promise<void> {
    this.logger.info('Clicking Continue to verification — expecting verification step');
    await this.logisticsPage.clickContinueToVerification();
    await this.page.waitForURL('**/verification**', { timeout: 30_000 });
    await expect(
      this.verificationPage.stepIndicator(),
      'Stepper should show step 2/2 on verification page',
    ).toContainText('2/2');
    this.logger.info('Verification step 2/2 loaded and verified');
  }

  /**
   * Fills the required Purchase Order and Project ID fields,
   * asserts the Invoice/Credit Line payment radio is checked,
   * then clicks "Confirm your order" to submit.
   */
  async completeVerificationAndSubmit(purchaseOrder: string, projectId: string): Promise<void> {
    this.logger.info(`Filling verification form — PO: ${purchaseOrder}, ProjectID: ${projectId}`);
    await this.verificationPage.fillPurchaseOrder(purchaseOrder);
    await this.verificationPage.fillProjectId(projectId);
    await expect(
      this.verificationPage.invoicePaymentRadio(),
      'Invoice/Credit Line payment radio should be checked by default',
    ).toBeChecked();
    await this.verificationPage.clickConfirmOrder();
    this.logger.info('Order submitted — awaiting confirmation redirect');
  }

  /**
   * Waits for the confirmation URL, then asserts:
   * - "Order confirmed!" heading is visible
   * - Order reference matches format /Ref vanilla-\d+/
   * - Purchase Order value is echoed back correctly
   * - "Go to Order history" button is visible
   */
  async verifyOrderConfirmation(purchaseOrder: string): Promise<void> {
    this.logger.info('Verifying order confirmation page');
    await this.page.waitForURL('**/confirmation/**', { timeout: 60_000 });
    await expect(
      this.confirmationPage.confirmationHeading(),
      '"Order confirmed!" heading should be visible on confirmation page',
    ).toBeVisible();
    await expect(
      this.confirmationPage.orderReferenceText(),
      'Order reference should match format: Ref vanilla-{numericId}',
    ).toContainText(/Ref vanilla-\d+/);
    await expect(
      this.confirmationPage.purchaseOrderValue(),
      `Purchase order "${purchaseOrder}" should be echoed back on confirmation page`,
    ).toHaveText(purchaseOrder);
    await expect(
      this.confirmationPage.goToOrderHistoryButton(),
      '"Go to Order history" button should be visible and enabled',
    ).toBeVisible();
    this.logger.info(`Order confirmation verified — PO ${purchaseOrder} confirmed`);
  }
}
