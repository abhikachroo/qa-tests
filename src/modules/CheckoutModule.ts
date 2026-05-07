import { expect, Page }              from '@playwright/test';
import { SearchResultsPage }          from '@pages/SearchResultsPage';
import { CartPage }                   from '@pages/CartPage';
import { CheckoutLogisticsPage }      from '@pages/CheckoutLogisticsPage';
import { CheckoutVerificationPage }   from '@pages/CheckoutVerificationPage';
import { OrderConfirmationPage }      from '@pages/OrderConfirmationPage';
import { Logger }                     from '@utils/Logger';
import { config }                     from '@config/index';

/**
 * CheckoutModule — Layer 3: Business logic orchestrating the full purchase funnel.
 *
 * Workflow methods:
 *   clearCart()               — remove all items from cart before test (beforeEach cleanup)
 *   searchAndAddToCart()      — type SKU into search, add product to cart, assert badge
 *   navigateToCart()          — go to /checkout/en-gb/ and assert product present
 *   proceedThroughLogistics() — click "Proceed to checkout", assert logistics step
 *   completeVerification()    — fill PO + ProjectID, assert credit line selected, submit
 *   assertOrderConfirmed()    — assert heading, order ref pattern, and history button
 *   runFullCheckoutFlow()     — convenience: executes all 5 steps in sequence
 */
export class CheckoutModule {
  private logger: Logger;

  constructor(
    private page: Page,
    private searchResultsPage: SearchResultsPage,
    private cartPage: CartPage,
    private logisticsPage: CheckoutLogisticsPage,
    private verificationPage: CheckoutVerificationPage,
    private confirmationPage: OrderConfirmationPage,
  ) {
    this.logger = new Logger('CheckoutModule');
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Cart cleanup (beforeEach)
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Remove all items from the cart before a test run.
   *
   * Navigates to /checkout/en-gb/ and repeatedly clicks the first
   * "remove-from-cart-button" until none remain. Uses a timeout-safe
   * isVisible() check — no waitForTimeout() calls.
   */
  async clearCart(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Clearing cart before test`);
    await this.cartPage.navigate('/checkout/en-gb/');
    await this.cartPage.waitForPageLoad();

    // Poll up to 10 iterations in case multiple items are present
    for (let i = 0; i < 10; i++) {
      const removeBtn = this.cartPage.removeFromCartButton();
      const isPresent = await removeBtn.isVisible({ timeout: 3_000 }).catch(() => false);
      if (!isPresent) break;
      await removeBtn.first().click();
      // Wait for the button count to reduce (element re-renders after removal)
      await this.page.waitForLoadState('networkidle');
      this.logger.info(`Removed cart item ${i + 1}`);
    }
    this.logger.info('Cart cleared');
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Step 1: Search for SKU and add to cart
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Type a SKU into the header search bar, navigate to results,
   * assert the product card is visible, then click "Add to cart".
   * Asserts the cart badge aria-label reflects 1 item after addition.
   *
   * @param sku         Product SKU to search for (e.g. '6968173')
   * @param expectedQty Expected cart item count after adding (default: 1)
   */
  async searchAndAddToCart(sku: string, expectedQty = 1): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Searching for SKU: ${sku}`);

    // Navigate to homepage and fill search bar
    await this.searchResultsPage.navigate('/');
    await this.searchResultsPage.waitForPageLoad();
    await this.searchResultsPage.dismissCookieBannerIfPresent();

    // Fill search input and submit
    const searchInput = this.page.getByTestId('search-bar-input');
    await searchInput.click();
    await searchInput.fill(sku);
    await this.page.keyboard.press('Enter');

    // Wait for search results URL
    await this.page.waitForURL(`**/search/${sku}**`, { timeout: 30_000 });
    this.logger.info(`Search results loaded for SKU: ${sku}`);

    // Assert product card visible
    await expect(
      this.searchResultsPage.productListCard(sku),
      `Product card for SKU ${sku} should be visible on search results`,
    ).toBeVisible();

    // Click "Add to cart"
    await this.searchResultsPage.clickAddToCart();
    this.logger.info(`Clicked add-to-cart for SKU: ${sku}`);

    // Assert cart badge reflects the new quantity
    await expect(
      this.searchResultsPage.cartButton(),
      `Cart badge aria-label should contain "${expectedQty} items" after adding product`,
    ).toHaveAttribute('aria-label', new RegExp(`${expectedQty} items`));
    this.logger.info(`Cart badge updated to ${expectedQty} item(s)`);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Step 2: Navigate to Cart page and assert product
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Navigate to the cart page at /checkout/en-gb/ and assert:
   * - Cart heading "Shopping Cart" is visible
   * - Product count shows "1 product"
   * - The product reference (SKU) is visible in the cart row
   *
   * @param sku Product SKU expected to appear in the cart
   */
  async navigateToCart(sku: string): Promise<void> {
    this.logger.info('Navigating to cart page');
    await this.cartPage.navigate('/checkout/en-gb/');
    await this.cartPage.waitForPageLoad();

    await expect(
      this.cartPage.cartName(),
      'Cart heading should show "Shopping Cart"',
    ).toBeVisible();

    await expect(
      this.cartPage.cartNumberOfProducts(),
      'Cart should contain 1 product',
    ).toHaveText('1 product');

    await expect(
      this.cartPage.productReference(),
      `Product reference should contain SKU ${sku}`,
    ).toContainText(sku);

    this.logger.info(`Cart verified — 1 product (SKU: ${sku}) present`);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Step 3: Cart → Logistics step
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Click "Proceed to checkout" on the cart page, wait for the logistics URL,
   * and assert the step indicator shows "1/2".
   */
  async proceedThroughLogistics(): Promise<void> {
    this.logger.info('Proceeding from cart to logistics step');
    await this.cartPage.clickProceedToCheckout();

    // Wait for logistics URL pattern
    await this.page.waitForURL('**/tunnel/**/logistics**', { timeout: 30_000 });
    this.logger.info('Logistics step URL reached');

    // Assert step indicator
    await expect(
      this.logisticsPage.stepIndicator(),
      'Step indicator should show 1/2 on logistics page',
    ).toContainText('1/2');

    // Assert delivery address is shown (no radio selection needed — pre-selected)
    await expect(
      this.logisticsPage.deliveryAddressBox(),
      'Delivery address box should be visible on logistics step',
    ).toBeVisible();

    // Click "Continue to verification"
    await this.logisticsPage.clickContinueToVerification();
    this.logger.info('Clicked "Continue to verification"');
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Step 4: Verification step
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * On the verification step:
   * - Assert URL matches */verification* and step indicator shows "2/2"
   * - Fill the required Purchase Order and Project ID fields
   * - Assert the Credit Line payment radio is checked (pre-selected default)
   * - Click "Confirm your order"
   *
   * @param purchaseOrder  Value for the Purchase Order field
   * @param projectId      Value for the Project ID field
   */
  async completeVerification(purchaseOrder: string, projectId: string): Promise<void> {
    // Wait for verification URL
    await this.page.waitForURL('**/tunnel/**/verification**', { timeout: 30_000 });
    this.logger.info(`Verification step URL reached`);

    // Assert step indicator
    await expect(
      this.verificationPage.stepIndicator(),
      'Step indicator should show 2/2 on verification page',
    ).toContainText('2/2');

    // Fill required fields
    await this.verificationPage.fillPurchaseOrder(purchaseOrder);
    this.logger.info(`Purchase Order filled: ${purchaseOrder}`);

    await this.verificationPage.fillProjectId(projectId);
    this.logger.info(`Project ID filled: ${projectId}`);

    // Assert Credit Line payment is the checked default (no interaction needed)
    await expect(
      this.verificationPage.creditLinePaymentRadio(),
      'Invoice / Credit Line payment method should be pre-selected',
    ).toBeChecked();

    // Submit order
    await this.verificationPage.clickConfirmOrder();
    this.logger.info('Clicked "Confirm your order"');
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Step 5: Assert order confirmation
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Assert the order confirmation page:
   * - URL matches */confirmation/*
   * - "Order confirmed!" h2 heading is visible
   * - Order reference text matches /Ref vanilla-\d+/
   * - "Go to Order history" button is visible and enabled
   *
   * @param purchaseOrder  The PO value filled in verification — echoed back on confirmation
   */
  async assertOrderConfirmed(purchaseOrder: string): Promise<void> {
    // Wait for confirmation URL
    await this.page.waitForURL('**/confirmation/**', { timeout: 60_000 });
    this.logger.info('Order confirmation URL reached');

    // Assert "Order confirmed!" heading
    await expect(
      this.confirmationPage.confirmationHeading(),
      '"Order confirmed!" heading should be visible',
    ).toBeVisible();

    // Assert order reference matches Ref vanilla-{numericId} pattern
    await expect(
      this.confirmationPage.orderReferenceText(),
      'Order reference should match /Ref vanilla-\\d+/ pattern',
    ).toContainText(/Ref vanilla-\d+/);

    // Assert Go to Order history button is visible and enabled
    await expect(
      this.confirmationPage.goToOrderHistoryButton(),
      '"Go to Order history" button should be visible and enabled',
    ).toBeVisible();

    await expect(
      this.confirmationPage.goToOrderHistoryButton(),
      '"Go to Order history" button should be enabled',
    ).toBeEnabled();

    // Assert Purchase Order echoed back correctly
    await expect(
      this.confirmationPage.purchaseOrderValue(),
      `Purchase Order "${purchaseOrder}" should be displayed in the order info column`,
    ).toHaveText(purchaseOrder);

    this.logger.info('Order confirmed — all assertions passed');
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Convenience: full flow
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Execute the complete checkout flow in sequence:
   *   searchAndAddToCart → navigateToCart → proceedThroughLogistics
   *   → completeVerification → assertOrderConfirmed
   *
   * @param sku           Product SKU to purchase
   * @param purchaseOrder PO reference value for the verification form
   * @param projectId     Project ID value for the verification form
   */
  async runFullCheckoutFlow(
    sku: string,
    purchaseOrder: string,
    projectId: string,
  ): Promise<void> {
    await this.searchAndAddToCart(sku);
    await this.navigateToCart(sku);
    await this.proceedThroughLogistics();
    await this.completeVerification(purchaseOrder, projectId);
    await this.assertOrderConfirmed(purchaseOrder);
  }
}
