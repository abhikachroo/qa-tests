import { test, expect }  from '@fixtures';
import { config }        from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';

/**
 * Add-to-Cart & Checkout E2E Flow
 *
 * Feature:  Add-to-Cart & Checkout
 * App:      https://fra-vanilla-preprod.dev.spark.sonepar.com
 * Modules:  LoginModule, SearchModule (reused), CheckoutModule
 * Pages:    LoginPage, HomePage, HeaderSearchPage, SearchResultsPage,
 *           CartPage, CheckoutLogisticsPage, CheckoutVerificationPage,
 *           OrderConfirmationPage
 *
 * TC-001 P0 — Complete E2E purchase flow: login → search SKU 6968173
 *             → add to cart → checkout (logistics + verification) → order confirmation
 */
test.describe(`@P0 @Smoke @AddToCart @Checkout Add-to-Cart & Checkout — ${config.displayName} on ${config.environment}`, () => {

  const SKU = '6968173';

  /**
   * Clear any residual cart items before each run so the test always
   * starts from an empty cart (server-side state persists across sessions).
   * Login first so the cart page is accessible.
   */
  test.beforeEach(async ({ loginModule, checkoutModule }) => {
    await loginModule.doLogin();
    await checkoutModule.clearCart();
  });

  /**
   * TC-001: Complete E2E purchase flow from login to order confirmation for SKU 6968173
   * Priority:   P0
   * Type:       Functional
   * AC Refs:    AC-001, AC-003, AC-005, AC-007
   *
   * Flow:
   *   1. Login via Azure B2C — verify authenticated home page
   *   2. Search for SKU 6968173 — verify results page and product card
   *   3. Add product to cart — assert cart badge updates to 1 item
   *   4. Navigate to cart page — assert 1 product present, proceed to checkout
   *   5. Logistics step (1/2) — assert stepper 1/2, delivery address visible, continue
   *   6. Verification step (2/2) — fill PO + project ID, confirm payment, submit order
   *   7. Order confirmation — assert heading, /Ref vanilla-\d+/, history button enabled
   */
  test('TC-001: Complete E2E purchase flow from login to order confirmation for SKU 6968173', async ({
    page,
    loginModule,
    searchModule,
    checkoutModule,
  }) => {
    // Generate unique PO and Project ID per run — never hardcoded
    const purchaseOrder = `PO-${DataGenerator.randomString(8).toUpperCase()}`;
    const projectId     = `PROJ-${DataGenerator.randomString(6).toUpperCase()}`;

    // ── Step 1: Login ──────────────────────────────────────────────────────────
    await test.step('Verify authenticated state after login', async () => {
      await loginModule.verifyLoginSuccess();
      await expect(page).toHaveURL(/fra-vanilla-preprod\.dev\.spark\.sonepar\.com/);
    });

    // ── Step 2: Search for SKU ─────────────────────────────────────────────────
    await test.step(`Search for SKU ${SKU} via the header search bar and verify results page`, async () => {
      await searchModule.submitSearch(SKU);
      await expect(page).toHaveURL(new RegExp(`/catalog/en-gb/search/${SKU}`));
      await searchModule.verifySearchResultsPage(SKU);
    });

    // ── Step 3: Add to cart ─────────────────────────────────────────────────────
    await test.step(`Add SKU ${SKU} to cart and assert cart badge updates to 1 item`, async () => {
      await checkoutModule.addSkuToCart(SKU);
      await checkoutModule.assertCartBadgeCount(1);
    });

    // ── Step 4: Cart page ───────────────────────────────────────────────────────
    await test.step('Navigate to cart page, verify 1 product is present, and proceed to checkout', async () => {
      await checkoutModule.verifyCartPage('1 product');
      await checkoutModule.proceedToCheckout();
    });

    // ── Step 5: Logistics step (1/2) ────────────────────────────────────────────
    await test.step('Assert logistics step 1/2 — stepper and delivery address visible, then continue to verification', async () => {
      await checkoutModule.completeLogisticsStep();
    });

    // ── Step 6: Verification step (2/2) ─────────────────────────────────────────
    await test.step('Complete verification step — fill Purchase Order and Project ID, confirm payment method, submit order', async () => {
      await checkoutModule.completeVerificationStep(purchaseOrder, projectId);
    });

    // ── Step 7: Order confirmation ───────────────────────────────────────────────
    await test.step('Assert order confirmation page — "Order confirmed!" heading, order reference format, and history button enabled', async () => {
      await expect(page).toHaveURL(/\/confirmation\//);
      await checkoutModule.assertOrderConfirmation();
    });
  });

});
