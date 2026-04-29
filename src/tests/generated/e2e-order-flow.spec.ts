import { test, expect } from '@fixtures';
import { config }       from '@config/index';

/**
 * E2E Order Flow — Full Happy Path
 *
 * Feature:   E2E Order Flow
 * App:       https://fra-vanilla-preprod.dev.spark.sonepar.com
 * Module:    OrderFlowModule (cart → checkout logistics → verification → confirmation)
 * Reused:    LoginModule (login), SearchModule (search + product assertion)
 *
 * Scenario coverage:
 *   TC-001  P0 E2E  — Full happy path: Login → Search → Add to Cart → Checkout → Confirmation
 *
 * Test data:
 *   SKU: 6968173 (LISTA Schuifladekast)
 *   Purchase Order: PO-TEST-001
 *   Project ID:     PROJ-TEST-001
 *   Prices confirmed on preprod 2026-04-29:
 *     Unit (excl. VAT):  1.140,43 €
 *     Total (incl. VAT): 1.379,92 €
 *
 * IMPORTANT — Order Confirmation step:
 *   The confirmation page URL pattern and element selectors are UNVERIFIED.
 *   On the first manual run, update OrderConfirmationPage.ts with confirmed selectors.
 *   See: src/pages/OrderConfirmationPage.ts — TODO comments.
 */
test.describe(`@P0 @E2E @OrderFlow E2E Order Flow — ${config.displayName} on ${config.environment}`, () => {

  /**
   * TC-001: Complete E2E order flow
   *
   * Priority:     P0 E2E (Full Happy Path)
   * AC Reference: AC-001, AC-004, AC-006, AC-007, AC-008, AC-010, AC-011
   *
   * Preconditions:
   *   - User account: config.username / config.password (preprod AUTH_POC)
   *   - SKU 6968173 in catalog with delivery stock >= 1
   *   - Delivery address pre-configured on account
   *   - Cart starts empty (clean browser state)
   *
   * NOTE: This test places a real order on preprod.
   * Implement an afterEach teardown with an API cancel call once the
   * order management API endpoint is identified.
   */
  test('TC-001: Complete E2E order flow — Login → Search SKU 6968173 → Add to Cart → Checkout → Order Confirmation', async ({
    page,
    loginModule,
    searchModule,
    orderFlowModule,
    cartPage,
    checkoutLogisticsPage,
    checkoutVerificationPage,
    orderConfirmationPage,
  }) => {
    const SKU           = '6968173';
    const PURCHASE_ORDER = 'PO-TEST-001';
    const PROJECT_ID     = 'PROJ-TEST-001';

    // ── Step 1: Login ──────────────────────────────────────────────
    await test.step('Login with valid OPCO credentials via Azure B2C', async () => {
      await loginModule.doLogin(config.username, config.password);
    });

    await test.step('Verify authenticated state — user-details-button is visible', async () => {
      await loginModule.verifyLoginSuccess();
    });

    await test.step('Verify application URL is back on the app domain after login', async () => {
      await expect(page).toHaveURL(/fra-vanilla-preprod\.dev\.spark\.sonepar\.com/);
    });

    // ── Step 2: Search for SKU 6968173 ─────────────────────────────
    await test.step(`Submit header search for SKU ${SKU}`, async () => {
      await searchModule.submitSearch(SKU);
    });

    await test.step('Verify search results URL contains the SKU', async () => {
      await expect(page).toHaveURL(/\/catalog\/en-gb\/search\/6968173/);
    });

    await test.step('Verify product card for SKU 6968173 is visible on results page', async () => {
      await expect(
        page.getByTestId('product-list-card-6968173'),
        'Product card for SKU 6968173 should be visible in search results',
      ).toBeVisible();
    });

    await test.step('Verify product title is visible on the search results card', async () => {
      await expect(
        page.getByTestId('product-list-card-title'),
        'Product title should be visible on the search results card',
      ).toContainText('Schuifladekast');
    });

    // ── Step 3: Add to Cart ────────────────────────────────────────
    await test.step('Click "Add to cart" for SKU 6968173 on the search results page', async () => {
      await orderFlowModule.addProductToCart();
    });

    await test.step('Verify cart header badge increments to 1 after adding the product', async () => {
      await orderFlowModule.verifyCartBadgeCount(1);
    });

    // ── Step 4: Cart page ─────────────────────────────────────────
    await test.step('Navigate to the cart page via the header cart button', async () => {
      await orderFlowModule.navigateToCart();
    });

    await test.step('Verify cart URL is /checkout/en-gb/', async () => {
      await expect(page).toHaveURL(/\/checkout\/en-gb\//);
    });

    await test.step('Verify SKU 6968173 is listed in the cart with quantity 1', async () => {
      await orderFlowModule.verifyCartContents();
    });

    await test.step('Verify "Proceed to checkout" button is enabled', async () => {
      await expect(
        cartPage.checkoutButton(),
        '"Proceed to checkout" button should be enabled when cart has items',
      ).toBeEnabled();
    });

    // ── Step 5: Checkout Step 1 — Logistics ───────────────────────
    await test.step('Click "Proceed to checkout" and wait for Logistics step URL', async () => {
      await orderFlowModule.proceedToCheckout();
    });

    await test.step('Verify URL matches the logistics tunnel pattern', async () => {
      await expect(page).toHaveURL(/\/checkout\/en-gb\/tunnel\/.+\/logistics/);
    });

    await test.step('Verify line item for SKU 6968173 is visible on the Logistics step', async () => {
      await expect(
        checkoutLogisticsPage.lineItemProductLink(),
        'Line item product link should be visible in the Logistics step',
      ).toBeVisible();
    });

    await test.step('Click "continue to verification" to advance to Step 2', async () => {
      await orderFlowModule.completeLogisticsStep();
    });

    // ── Step 6: Checkout Step 2 — Verification ────────────────────
    await test.step('Verify URL matches the verification tunnel pattern', async () => {
      await expect(page).toHaveURL(/\/checkout\/en-gb\/tunnel\/.+\/verification/);
    });

    await test.step('Verify Invoice / Credit Line payment method is pre-selected', async () => {
      await expect(
        checkoutVerificationPage.invoicePaymentRadio(),
        'Invoice payment radio should be checked by default',
      ).toBeChecked();
    });

    await test.step('Fill required Purchase Order and Project ID fields, then confirm the order', async () => {
      await orderFlowModule.completeVerificationStep(PURCHASE_ORDER, PROJECT_ID);
    });

    // ── Step 7: Order Confirmation ────────────────────────────────
    await test.step('Wait for order confirmation URL and verify success heading is visible', async () => {
      await orderFlowModule.verifyOrderConfirmation();
    });

    await test.step('Verify a unique order reference number is displayed on the confirmation page', async () => {
      const orderRef = await orderConfirmationPage.getOrderReference();
      expect(
        orderRef.length,
        'Order reference number should be a non-empty string',
      ).toBeGreaterThan(0);
    });
  });

});
