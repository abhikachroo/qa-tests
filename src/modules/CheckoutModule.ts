import { Page, expect } from '@playwright/test';
import { CartPage }                  from '@pages/CartPage';
import { CheckoutLogisticsPage }     from '@pages/CheckoutLogisticsPage';
import { CheckoutVerificationPage }  from '@pages/CheckoutVerificationPage';
import { OrderConfirmationPage }     from '@pages/OrderConfirmationPage';
import { SearchResultsPage }         from '@pages/SearchResultsPage';
import { Logger }                    from '@utils/Logger';

/** Logistic scenario constants — map to data-testid suffixes on the Logistics step */
export const LOGISTIC_SCENARIOS = {
  STANDARD_1_DELIVERY: 'STANDARD_1_DELIVERY',
  STANDARD_2_DELIVERY: 'STANDARD_2_DELIVERY',
  STANDARD_3_DELIVERY: 'STANDARD_3_DELIVERY',
} as const;

export type LogisticScenario = (typeof LOGISTIC_SCENARIOS)[keyof typeof LOGISTIC_SCENARIOS];

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

  // ── Add to Cart ──────────────────────────────────────────────────────────

  /**
   * From a loaded search-results page, verify the product card is visible
   * and click the "Add to cart" button via the SearchResultsPage method.
   */
  async addProductToCart(productId: string): Promise<void> {
    this.logger.info(`Adding product ${productId} to cart`);
    await expect(
      this.searchResultsPage.productCardByTestId(productId),
      `Product card for ${productId} should be visible on search results`,
    ).toBeVisible();
    await this.searchResultsPage.clickAddToCart();
    this.logger.info(`Product ${productId} add-to-cart clicked`);
  }

  /**
   * Navigate to the cart page via the header cart button and wait for URL.
   */
  async navigateToCart(): Promise<void> {
    this.logger.info('Navigating to cart via header cart button');
    await this.cartPage.cartButton().click();
    await this.page.waitForURL('**/checkout/en-gb/**', { timeout: 30_000 });
    this.logger.info('Cart page loaded');
  }

  /**
   * Verify the cart page shows the correct heading and the specified product.
   */
  async verifyCartContainsProduct(productId: string): Promise<void> {
    this.logger.info(`Verifying cart contains product ${productId}`);
    await expect(
      this.cartPage.cartHeading(),
      'Shopping Cart heading should be visible',
    ).toBeVisible();
    await expect(
      this.cartPage.productInCart(productId),
      `Product ${productId} should be listed in the cart`,
    ).toBeVisible();
    this.logger.info('Cart product verification complete');
  }

  // ── Proceed through Checkout Tunnel ──────────────────────────────────────

  /**
   * Click "Proceed to checkout" from the cart page and wait for the Logistics step URL.
   */
  async proceedToCheckout(): Promise<void> {
    this.logger.info('Clicking "Proceed to checkout"');
    await this.cartPage.clickProceedToCheckout();
    await this.page.waitForURL('**/tunnel/**/logistics**', { timeout: 30_000 });
    this.logger.info('Logistics step loaded');
  }

  /**
   * On the Logistics step: assert the progress indicator, select the given scenario,
   * then click "continue to verification".
   *
   * @param scenario - One of LOGISTIC_SCENARIOS constants (default: STANDARD_1_DELIVERY)
   */
  async completeLogisticsStep(
    scenario: LogisticScenario = LOGISTIC_SCENARIOS.STANDARD_1_DELIVERY,
  ): Promise<void> {
    this.logger.info(`Completing Logistics step with scenario: ${scenario}`);
    await expect(
      this.checkoutLogisticsPage.progressIndicator(),
      'Progress indicator should show "1/2" on the Logistics step',
    ).toBeVisible();
    await expect(
      this.checkoutLogisticsPage.logisticScenarioRadio(scenario),
      `Logistic scenario radio "${scenario}" should be visible`,
    ).toBeVisible();
    // The default STANDARD_1_DELIVERY is pre-selected — only click if switching
    if (scenario !== LOGISTIC_SCENARIOS.STANDARD_1_DELIVERY) {
      await this.checkoutLogisticsPage.selectLogisticScenario(scenario);
    }
    await this.checkoutLogisticsPage.clickContinueToVerification();
    await this.page.waitForURL('**/tunnel/**/verification**', { timeout: 30_000 });
    this.logger.info('Verification step loaded');
  }

  /**
   * On the Verification step: assert the progress indicator, fill required fields,
   * assert the invoice payment radio is checked, then click "confirm your order".
   *
   * @param purchaseOrder - Value for the Purchase Order (required) field
   * @param projectId     - Value for the Project ID (required) field
   */
  async completeVerificationStep(
    purchaseOrder: string,
    projectId: string,
  ): Promise<void> {
    this.logger.info(`Completing Verification step — PO: ${purchaseOrder}, ProjectID: ${projectId}`);
    await expect(
      this.checkoutVerificationPage.progressIndicator(),
      'Progress indicator should show "2/2" on the Verification step',
    ).toBeVisible();
    await this.checkoutVerificationPage.fillPurchaseOrder(purchaseOrder);
    await this.checkoutVerificationPage.fillProjectId(projectId);
    await expect(
      this.checkoutVerificationPage.paymentCreditLineRadio(),
      'Invoice / Credit Line payment should be selected by default',
    ).toBeChecked();
    await this.checkoutVerificationPage.clickConfirmOrder();
    await this.page.waitForURL('**/tunnel/confirmation/**', { timeout: 60_000 });
    this.logger.info('Order submitted — confirmation page loaded');
  }

  // ── Order Confirmation ────────────────────────────────────────────────────

  /**
   * On the Order Confirmation page: wait for full load then assert all key elements.
   */
  async verifyOrderConfirmation(): Promise<void> {
    this.logger.info('Verifying Order Confirmation page');
    await this.orderConfirmationPage.waitForConfirmationLoaded();
    await expect(
      this.orderConfirmationPage.confirmationHeading(),
      '"Order confirmed!" heading should be visible',
    ).toBeVisible();
    await expect(
      this.orderConfirmationPage.orderReferenceText(),
      'Order reference (vanilla-{id}) should be visible',
    ).toBeVisible();
    await expect(
      this.orderConfirmationPage.deliveryMessage(),
      'Delivery preparation message should be visible',
    ).toBeVisible();
    await expect(
      this.orderConfirmationPage.goToOrderHistoryBtn(),
      '"Go to Order history" button should be visible',
    ).toBeVisible();
    this.logger.info('Order Confirmation page verified successfully');
  }
}
