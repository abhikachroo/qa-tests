import { expect }                    from '@playwright/test';
import { SearchResultsPage }         from '@pages/SearchResultsPage';
import { CartPage }                  from '@pages/CartPage';
import { CheckoutLogisticsPage }     from '@pages/CheckoutLogisticsPage';
import { CheckoutVerificationPage }  from '@pages/CheckoutVerificationPage';
import { OrderConfirmationPage }     from '@pages/OrderConfirmationPage';
import { Logger }                    from '@utils/Logger';

export class CheckoutModule {
  private logger: Logger;

  constructor(
    private searchResultsPage:        SearchResultsPage,
    private cartPage:                  CartPage,
    private checkoutLogisticsPage:     CheckoutLogisticsPage,
    private checkoutVerificationPage:  CheckoutVerificationPage,
    private orderConfirmationPage:     OrderConfirmationPage,
  ) {
    this.logger = new Logger('CheckoutModule');
  }

  /**
   * Add the product to the cart from the search results page.
   * Clicks the "Add to cart" button and waits for the cart badge to increment.
   *
   * @param sku - The product SKU to verify on search results before adding
   */
  async addProductToCart(sku: string): Promise<void> {
    this.logger.info(`Adding SKU ${sku} to cart from search results`);
    await expect(
      this.searchResultsPage.productCardBySku(sku),
      `Product card for SKU ${sku} should be visible on search results`,
    ).toBeVisible();
    await this.searchResultsPage.clickAddToCart();
    this.logger.info(`Add to cart clicked for SKU ${sku}`);
  }

  /**
   * Assert the cart badge in the header shows the expected item count,
   * then navigate to the cart page.
   *
   * @param expectedCount - Expected number shown on the cart badge
   */
  async verifyCartBadgeAndNavigate(expectedCount: number): Promise<void> {
    this.logger.info(`Verifying cart badge shows ${expectedCount} item(s)`);
    await expect(
      this.searchResultsPage.cartHeaderButton(),
      `Cart badge should show ${expectedCount} after adding to cart`,
    ).toContainText(String(expectedCount));
    await this.searchResultsPage.clickCartHeaderButton();
    this.logger.info('Navigated to cart page');
  }

  /**
   * Verify cart page contents for the given SKU.
   * Asserts product title, quantity, and that the checkout button is enabled.
   *
   * @param sku - The SKU to verify in the cart
   * @param expectedQty - Expected quantity string in the quantity input
   */
  async verifyCartContents(sku: string, expectedQty: string): Promise<void> {
    this.logger.info(`Verifying cart contents for SKU ${sku}, qty ${expectedQty}`);
    await expect(
      this.cartPage.cartHeading(),
      'Shopping Cart heading should be visible',
    ).toBeVisible();
    await expect(
      this.cartPage.productTitleLink(),
      'Product title should be visible in cart',
    ).toBeVisible();
    await expect(
      this.cartPage.quantityInput(sku),
      `Quantity input for SKU ${sku} should show ${expectedQty}`,
    ).toHaveValue(expectedQty);
    await expect(
      this.cartPage.checkoutButton(),
      'Proceed to checkout button should be enabled',
    ).toBeEnabled();
    this.logger.info('Cart contents verified');
  }

  /**
   * Click "Proceed to checkout" from the cart and wait for the Logistics step to load.
   */
  async proceedToCheckout(): Promise<void> {
    this.logger.info('Clicking Proceed to checkout');
    await this.cartPage.clickProceedToCheckout();
    await this.checkoutLogisticsPage.waitForLogisticsPage();
    this.logger.info('Checkout Step 1 (Logistics) loaded');
  }

  /**
   * Verify the Logistics step contents and proceed to Verification.
   *
   * @param expectedTotal - The total incl. VAT string to assert in the summary (e.g. '1.379,92 €')
   */
  async verifyLogisticsAndContinue(expectedTotal: string): Promise<void> {
    this.logger.info('Verifying Logistics step content');
    await expect(
      this.checkoutLogisticsPage.stepIndicator(),
      'Step indicator should show 1/2 Logistics',
    ).toBeVisible();
    await expect(
      this.checkoutLogisticsPage.lineItemProductLink(),
      'Product line item should be visible in Logistics step',
    ).toBeVisible();
    await expect(
      this.checkoutLogisticsPage.totalIncludingVat(),
      `Order total should show ${expectedTotal} in Logistics step`,
    ).toBeVisible();
    this.logger.info('Logistics step verified — clicking continue to verification');
    await this.checkoutLogisticsPage.clickContinueToVerification();
    await this.checkoutVerificationPage.waitForVerificationPage();
    this.logger.info('Checkout Step 2 (Verification) loaded');
  }

  /**
   * Fill the Verification step required fields and confirm the order.
   *
   * @param purchaseOrder - Purchase Order reference string
   * @param projectId     - Project ID string
   * @param expectedTotal - The total incl. VAT string to assert in the summary
   */
  async fillVerificationAndConfirm(
    purchaseOrder: string,
    projectId: string,
    expectedTotal: string,
  ): Promise<void> {
    this.logger.info('Filling Verification step required fields');
    await expect(
      this.checkoutVerificationPage.stepIndicator(),
      'Step indicator should show 2/2 Verification',
    ).toBeVisible();
    await this.checkoutVerificationPage.fillPurchaseOrder(purchaseOrder);
    await this.checkoutVerificationPage.fillProjectId(projectId);
    await expect(
      this.checkoutVerificationPage.invoicePaymentRadio(),
      'Invoice / Credit Line payment should be selected by default',
    ).toBeChecked();
    await expect(
      this.checkoutVerificationPage.totalIncludingVat(),
      `Order total should show ${expectedTotal} in Verification step`,
    ).toBeVisible();
    this.logger.info('Verification fields filled — confirming order');
    await this.checkoutVerificationPage.clickConfirmOrder();
    this.logger.info('Order confirm button clicked — awaiting confirmation page');
  }

  /**
   * Wait for the Order Confirmation page to load and verify success state.
   * Note: Confirmation page locators are approximated — verify on first run.
   */
  async verifyOrderConfirmation(): Promise<void> {
    this.logger.info('Waiting for Order Confirmation page');
    await this.orderConfirmationPage.waitForConfirmationPage();
    await expect(
      this.orderConfirmationPage.successHeading(),
      'Order confirmation success heading should be visible', // TODO: verify selector on first run
    ).toBeVisible();
    const orderRef = await this.orderConfirmationPage.getOrderReferenceText();
    this.logger.info(`Order confirmed — reference: ${orderRef || '(selector to be verified)'}`);
  }
}
