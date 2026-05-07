import { test, expect } from '@fixtures';
import { config }        from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';

/**
 * Add-to-Cart & Checkout E2E Flow — TC-001
 *
 * Feature:   Add-to-Cart & Checkout E2E Flow
 * App:       https://fra-vanilla-preprod.dev.spark.sonepar.com
 * AC Ref:    AC-001 (Login), AC-003 (Search), AC-005 (Add to cart), AC-007 (Checkout + Confirmation)
 *
 * Test coverage:
 *   TC-001  P0 Smoke  — Full happy path: login → search SKU 6968173 → add to cart
 *                       → cart review → logistics step → verification step → order confirmed
 *
 * Key design notes:
 *   - Credentials flow via config.username / config.password — nothing hardcoded
 *   - beforeEach clears server-side cart state via CheckoutModule.clearCart()
 *   - 'checkout-button' testid reused across 3 tunnel CTAs — disambiguated in each Page class
 *     via .filter({ hasText: /.../ }) to prevent false matches
 *   - PO and ProjectID generated fresh inside each test body (retry-safe)
 *   - All selectors sourced from the verified LOCATOR_MAP in the test plan artifact
 */

const SKU = '6968173';

test.describe(`@P0 @Smoke @E2E @Checkout Add-to-Cart & Checkout — ${config.displayName} on ${config.environment}`, () => {

  /**
   * beforeEach: Clear any existing cart items to guarantee a clean state.
   * Uses CheckoutModule.clearCart() which polls the remove-from-cart-button
   * until the cart is empty — no waitForTimeout() calls.
   */
  test.beforeEach(async ({ loginModule, checkoutModule }) => {
    // Step 0a: Login first (cart is user-scoped, login needed to access cart)
    await loginModule.doLogin(config.username, config.password);
    // Step 0b: Clear any pre-existing cart items from previous runs
    await checkoutModule.clearCart();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TC-001: Complete E2E purchase flow from login to order confirmation
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * TC-001: Complete E2E purchase flow for SKU 6968173
   * Priority:  P0
   * Type:      Functional (happy path)
   * AC Ref:    AC-001, AC-003, AC-005, AC-007
   *
   * Preconditions:
   *   - preprod app accessible at config.baseUrl
   *   - Test account (config.username / config.password) is active
   *   - SKU 6968173 (LISTA Schuifladekast) is available in the preprod catalog
   *   - Cart is empty (guaranteed by beforeEach)
   *
   * BDD:
   *   GIVEN  the user is authenticated on the preprod B2B portal
   *   WHEN   they search for SKU 6968173 and add it to the cart
   *   AND    they proceed through the checkout tunnel (logistics → verification)
   *   AND    they fill required fields (Purchase Order, Project ID)
   *   AND    they confirm the order
   *   THEN   the order confirmation page displays "Order confirmed!"
   *   AND    the order reference matches the pattern Ref vanilla-{numericId}
   *   AND    the "Go to Order history" button is visible and enabled
   */
  test('TC-001: Complete E2E purchase flow — login → search SKU 6968173 → add to cart → checkout → order confirmed', async ({
    page,
    checkoutModule,
    searchResultsPage,
    cartPage,
    checkoutLogisticsPage,
    checkoutVerificationPage,
    orderConfirmationPage,
  }) => {
    // Generate retry-safe unique values inside the test body
    const purchaseOrder = `PO-E2E-${DataGenerator.randomString(6).toUpperCase()}`;
    const projectId     = `PROJ-E2E-${DataGenerator.randomString(6).toUpperCase()}`;

    // ── GIVEN: User is already authenticated (handled in beforeEach) ────────────

    // ── WHEN: Search for product by SKU and add to cart ──────────────────────────

    await test.step(`Search for SKU ${SKU} via header search bar and verify product card`, async () => {
      // Navigate to homepage and type SKU into search bar
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const searchInput = page.getByTestId('search-bar-input');
      await searchInput.click();
      await searchInput.fill(SKU);
      await page.keyboard.press('Enter');

      // Assert URL redirects to search results
      await expect(page).toHaveURL(/\/catalog\/en-gb\/search\/6968173/);

      // Assert product count shows 1 product
      await expect(
        searchResultsPage.productListCount(),
        'Search results should show "1 product" for SKU 6968173',
      ).toHaveText('1 product');

      // Assert SKU-specific product card is visible
      await expect(
        searchResultsPage.productListCard(SKU),
        `Product card for SKU ${SKU} should be visible on search results page`,
      ).toBeVisible();
    });

    await test.step(`Add SKU ${SKU} to cart and assert cart badge increments to 1`, async () => {
      // Click "Add to cart" — quantity counter defaults to 1
      await searchResultsPage.clickAddToCart();

      // Assert cart badge aria-label reflects 1 item
      await expect(
        searchResultsPage.cartButton(),
        'Cart button aria-label should contain "1 items" after adding product to cart',
      ).toHaveAttribute('aria-label', /1 items/);
    });

    // ── WHEN: Navigate to cart and review contents ───────────────────────────────

    await test.step('Navigate to cart page and assert product is present', async () => {
      await page.goto('/checkout/en-gb/');
      await page.waitForLoadState('networkidle');

      // Assert cart heading
      await expect(
        cartPage.cartName(),
        'Cart heading should be visible',
      ).toBeVisible();

      // Assert product count: "1 product"
      await expect(
        cartPage.cartNumberOfProducts(),
        'Cart should show "1 product"',
      ).toHaveText('1 product');

      // Assert product reference (SKU) visible in cart row
      await expect(
        cartPage.productReference(),
        `Product reference should contain SKU ${SKU}`,
      ).toContainText(SKU);
    });

    await test.step('Click "Proceed to checkout" from cart page', async () => {
      await cartPage.clickProceedToCheckout();

      // Assert navigation to logistics step URL
      await expect(page).toHaveURL(/\/tunnel\/.*\/logistics/);
    });

    // ── WHEN: Complete logistics step ────────────────────────────────────────────

    await test.step('Assert logistics step (1/2) and delivery address, then continue', async () => {
      // Assert step indicator shows 1/2
      await expect(
        checkoutLogisticsPage.stepIndicator(),
        'Step indicator should show "1/2" on the logistics page',
      ).toContainText('1/2');

      // Assert delivery address box is visible (no radio selection needed — pre-selected)
      await expect(
        checkoutLogisticsPage.deliveryAddressBox(),
        'Delivery address box should be visible on logistics step',
      ).toBeVisible();

      // Click "Continue to verification"
      await checkoutLogisticsPage.clickContinueToVerification();

      // Assert navigation to verification step URL
      await expect(page).toHaveURL(/\/tunnel\/.*\/verification/);
    });

    // ── WHEN: Complete verification step ─────────────────────────────────────────

    await test.step(`Fill verification form (PO: ${purchaseOrder}, ProjectID: ${projectId}) and confirm order`, async () => {
      // Assert step indicator shows 2/2
      await expect(
        checkoutVerificationPage.stepIndicator(),
        'Step indicator should show "2/2" on the verification page',
      ).toContainText('2/2');

      // Fill required fields
      await checkoutVerificationPage.fillPurchaseOrder(purchaseOrder);
      await checkoutVerificationPage.fillProjectId(projectId);

      // Assert Credit Line payment is checked (pre-selected default — no click needed)
      await expect(
        checkoutVerificationPage.creditLinePaymentRadio(),
        'Invoice / Credit Line payment method should be pre-selected (checked)',
      ).toBeChecked();

      // Submit order
      await checkoutVerificationPage.clickConfirmOrder();
    });

    // ── THEN: Assert order confirmation ──────────────────────────────────────────

    await test.step('Assert order confirmation page — heading, reference, and history button', async () => {
      // Assert confirmation URL
      await expect(page).toHaveURL(/\/confirmation\//);

      // Assert "Order confirmed!" h2 heading is visible
      await expect(
        orderConfirmationPage.confirmationHeading(),
        '"Order confirmed!" heading should be displayed on the confirmation page',
      ).toBeVisible();

      // Assert order reference matches Ref vanilla-{numericId} pattern
      // Live example: "Your order Ref vanilla-735318349396512768 Copy"
      await expect(
        orderConfirmationPage.orderReferenceText(),
        'Order reference should match the pattern /Ref vanilla-\\d+/',
      ).toContainText(/Ref vanilla-\d+/);

      // Assert Go to Order history button is visible and enabled
      await expect(
        orderConfirmationPage.goToOrderHistoryButton(),
        '"Go to Order history" button should be visible on the confirmation page',
      ).toBeVisible();

      await expect(
        orderConfirmationPage.goToOrderHistoryButton(),
        '"Go to Order history" button should be enabled',
      ).toBeEnabled();

      // Assert Purchase Order value echoed back correctly in order info column
      await expect(
        orderConfirmationPage.purchaseOrderValue(),
        `Purchase Order "${purchaseOrder}" should be displayed in the order info section`,
      ).toHaveText(purchaseOrder);
    });
  });

});
