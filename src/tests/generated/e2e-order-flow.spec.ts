import { test, expect } from '@fixtures';
import { config }       from '@config/index';

/**
 * E2E Order Flow Test Suite
 *
 * Feature:   E2E Order Flow — Login → Search → Cart → Checkout → Confirmation
 * App:       https://fra-vanilla-preprod.dev.spark.sonepar.com
 * Modules:   LoginModule, SearchModule, OrderFlowModule
 * Pages:     LoginPage, HomePage, HeaderSearchPage, SearchResultsPage,
 *            CartPage, CheckoutLogisticsPage, CheckoutVerificationPage, OrderConfirmationPage
 *
 * Scenario coverage:
 *   TC-001  P0 Smoke — Full E2E happy path: login → search → add to cart → checkout → confirm order
 */
test.describe(`@P0 @Smoke @OrderFlow E2E Order Flow — ${config.displayName} on ${config.environment}`, () => {

  const PRODUCT_SKU = '6968173';

  /**
   * TC-001: Full E2E happy path
   * Priority:     P0 Smoke
   * AC Reference: AC-001, AC-002, AC-003, AC-004, AC-005
   *
   * Preconditions:
   *   - User NOT logged in (fresh browser context, no stored session state)
   *   - Test account (config.username) active, Credit Line payment method enabled
   *   - SKU 6968173 is in stock and purchasable
   *   - Cart is empty at test start
   *   - config.purchaseOrder and config.projectId populated in config.json
   *
   * Note: This test places a real order on preprod.
   *       Coordinate with the team that preprod order placement is acceptable.
   */
  test('TC-001: Full E2E happy path — login → search → add to cart → checkout → confirm order', async ({
    page,
    loginModule,
    searchModule,
    orderFlowModule,
  }) => {

    // ── Step 1: Login ─────────────────────────────────────────────────────────
    await test.step('Login with configured OPCO credentials via Azure B2C', async () => {
      await loginModule.doLogin();
    });

    await test.step('Verify authenticated state — Account & settings button is visible', async () => {
      await loginModule.verifyLoginSuccess();
    });

    // ── Step 2: Product Search ────────────────────────────────────────────────
    await test.step(`Search for product SKU ${PRODUCT_SKU} via the header search bar`, async () => {
      await searchModule.submitSearch(PRODUCT_SKU);
    });

    await test.step('Verify search results URL and product card are displayed', async () => {
      await expect(page).toHaveURL(/\/catalog\/en-gb\/search\/6968173/);
      await searchModule.verifySearchResultsPage(PRODUCT_SKU);
    });

    // ── Step 3: Add to Cart ───────────────────────────────────────────────────
    await test.step(`Add SKU ${PRODUCT_SKU} to cart from the search results page`, async () => {
      await orderFlowModule.addProductToCart(PRODUCT_SKU);
    });

    // ── Step 4: Navigate to Cart ──────────────────────────────────────────────
    await test.step('Navigate to the cart page via cart badge and verify product is present', async () => {
      await orderFlowModule.navigateToCart(PRODUCT_SKU);
    });

    await test.step('Verify cart page URL (/checkout/en-gb/)', async () => {
      await expect(page).toHaveURL(/\/checkout\/en-gb\//);
    });

    // ── Step 5: Checkout Logistics (1/2) ──────────────────────────────────────
    await test.step('Proceed through the logistics step (1/2) and continue to verification', async () => {
      await orderFlowModule.proceedThroughLogistics();
    });

    await test.step('Verify navigation reached the verification page URL', async () => {
      await expect(page).toHaveURL(/\/verification/);
    });

    // ── Step 6: Checkout Verification (2/2) + Order Submission ────────────────
    await test.step('Complete verification — fill Purchase Order and Project ID, then confirm order', async () => {
      await orderFlowModule.completeVerificationAndConfirm(
        config.purchaseOrder,
        config.projectId,
      );
    });

    await test.step('Verify URL navigated to the order confirmation page', async () => {
      await expect(page).toHaveURL(/\/checkout\/tunnel\/confirmation\//);
    });

    // ── Step 7: Order Confirmation ────────────────────────────────────────────
    await test.step('Verify order confirmation — heading, order reference, product line item, and cart reset to 0', async () => {
      await orderFlowModule.verifyOrderConfirmation(PRODUCT_SKU);
    });

  });

});
