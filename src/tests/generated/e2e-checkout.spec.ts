import { test, expect }        from '@fixtures';
import { config }               from '@config/index';
import { DataGenerator }        from '@utils/DataGenerator';
import { LOGISTIC_SCENARIOS }   from '@modules/CheckoutModule';

/**
 * E2E Checkout Flow — Product Search → Add to Cart → Checkout → Order Confirmation
 *
 * Feature:   Product Search, Add to Cart & Checkout Flow
 * App:        https://fra-vanilla-preprod.dev.spark.sonepar.com (preprod)
 * Module:     CheckoutModule (orchestrates cart → logistics → verification → confirmation)
 * Pages:      LoginPage (Azure B2C), HeaderSearchPage, SearchResultsPage,
 *             CartPage, CheckoutLogisticsPage, CheckoutVerificationPage,
 *             OrderConfirmationPage
 *
 * Scenario coverage:
 *   TC-001  P0 Smoke  — Complete E2E purchase flow: login → search → add to cart
 *                       → checkout logistics → checkout verification → order confirmation
 *
 * AC References: AC-001 (login), AC-004 (search), AC-006 (add to cart),
 *                AC-007 (cart verification), AC-008 (initiate checkout),
 *                AC-009 (complete checkout), AC-010 (order confirmation content)
 *
 * Notes:
 *   - The `checkout-button` data-testid is reused across cart, logistics, and
 *     verification pages with different button text. The CheckoutModule uses
 *     page.waitForURL() between each step to ensure the correct page context
 *     before the next interaction.
 *   - Purchase Order and Project ID are required fields on the Verification step.
 *     Values are generated at runtime using DataGenerator to avoid conflicts.
 *   - Cart state: if the test account has pre-existing cart items, this test
 *     still adds product 6968173 fresh via the search → add-to-cart flow.
 *     The test asserts product presence in the cart without asserting exact quantity.
 */
test.describe(
  `@E2E @Smoke @P0 Product Search, Cart & Checkout — ${config.displayName} on ${config.environment}`,
  () => {
    /**
     * TC-001: Complete E2E purchase flow
     * Priority:    P0 Smoke
     * Type:        E2E
     * Tags:        @P0 @Smoke @E2E
     * AC Refs:     AC-001, AC-004, AC-006, AC-007, AC-008, AC-009, AC-010
     *
     * Preconditions:
     *   - User account (config.username) is active in preprod
     *   - Product 6968173 is in stock and searchable
     *   - Invoice / Credit Line payment is available for this account
     *   - No active session (test starts from unauthenticated state)
     *
     * Flow phases:
     *   Phase 1 — Login (Azure B2C via LoginModule)
     *   Phase 2 — Search for product 6968173 (HeaderSearchPage)
     *   Phase 3 — Add to cart (CheckoutModule → SearchResultsPage)
     *   Phase 4 — Cart verification (CheckoutModule → CartPage)
     *   Phase 5 — Checkout: Logistics step 1/2 (CheckoutModule → CheckoutLogisticsPage)
     *   Phase 6 — Checkout: Verification step 2/2 (CheckoutModule → CheckoutVerificationPage)
     *   Phase 7 — Order Confirmation (CheckoutModule → OrderConfirmationPage)
     */
    test(
      'TC-001: @P0 @Smoke @E2E should complete the full purchase flow from login to order confirmation',
      async ({
        page,
        loginModule,
        headerSearchPage,
        searchResultsPage,
        checkoutModule,
        orderConfirmationPage,
      }) => {
        const PRODUCT_ID    = '6968173';
        const purchaseOrder = `PO-E2E-${DataGenerator.randomString(6).toUpperCase()}`;
        const projectId     = `PROJ-E2E-${DataGenerator.randomString(6).toUpperCase()}`;

        // Build a regex from config.baseUrl so assertions are environment-agnostic
        const baseUrlDomain = new URL(config.baseUrl).hostname.replace(/\./g, '\\.');
        const baseUrlRegex  = new RegExp(baseUrlDomain);

        // ── Phase 1: Login ─────────────────────────────────────────────────

        await test.step('Login with configured credentials via Azure B2C', async () => {
          await loginModule.doLogin();
        });

        await test.step('Verify authenticated state — URL is back on app domain and account button is visible', async () => {
          await expect(page).toHaveURL(baseUrlRegex);
          await loginModule.verifyLoginSuccess();
        });

        // ── Phase 2: Search ────────────────────────────────────────────────

        await test.step(`Type product ID "${PRODUCT_ID}" into the header search bar and submit`, async () => {
          await headerSearchPage.fillSearchInput(PRODUCT_ID);
          await headerSearchPage.clickSubmitButton();
          await headerSearchPage.waitForSearchNavigation(PRODUCT_ID);
        });

        await test.step('Verify search results page loads and product 6968173 is visible', async () => {
          await expect(page).toHaveURL(/\/catalog\/en-gb\/search\/6968173/);
          await expect(
            searchResultsPage.productIdText(PRODUCT_ID),
            `Product ${PRODUCT_ID} should appear on the search results page`,
          ).toBeVisible();
          await expect(
            searchResultsPage.productCardByTestId(PRODUCT_ID),
            'Product card (data-testid="product-list-card-6968173") should be visible',
          ).toBeVisible();
        });

        // ── Phase 3: Add to Cart ───────────────────────────────────────────

        await test.step('Add product 6968173 to cart using the "Add to cart" button', async () => {
          await checkoutModule.addProductToCart(PRODUCT_ID);
        });

        await test.step('Verify the header cart button remains visible after adding item', async () => {
          await expect(
            page.getByTestId('cart-button'),
            'Cart button should be visible in the header after adding item',
          ).toBeVisible();
        });

        // ── Phase 4: Cart Verification ─────────────────────────────────────

        await test.step('Navigate to cart via the header cart button', async () => {
          await checkoutModule.navigateToCart();
        });

        await test.step('Verify shopping cart heading and product 6968173 are displayed in cart', async () => {
          await checkoutModule.verifyCartContainsProduct(PRODUCT_ID);
        });

        // ── Phase 5: Checkout — Logistics step (1/2) ───────────────────────

        await test.step('Click "Proceed to checkout" to enter the checkout tunnel', async () => {
          await checkoutModule.proceedToCheckout();
        });

        await test.step('Verify Logistics step (1/2) URL and delivery scenario radio is visible', async () => {
          await expect(page).toHaveURL(/\/tunnel\/.*\/logistics/);
          await expect(
            page.getByTestId(`logistic-scenario-${LOGISTIC_SCENARIOS.STANDARD_1_DELIVERY}`),
            'Standard 1-delivery scenario radio should be visible on the Logistics step',
          ).toBeVisible();
        });

        await test.step('Accept default logistic scenario and proceed to Verification step', async () => {
          await checkoutModule.completeLogisticsStep(LOGISTIC_SCENARIOS.STANDARD_1_DELIVERY);
        });

        // ── Phase 6: Checkout — Verification step (2/2) ────────────────────

        await test.step('Verify Verification step (2/2) URL and required form fields are visible', async () => {
          await expect(page).toHaveURL(/\/tunnel\/.*\/verification/);
          await expect(
            page.getByTestId('form-field-purchaseOrder-required'),
            'Purchase Order field should be visible on the Verification step',
          ).toBeVisible();
          await expect(
            page.getByTestId('form-field-projectID-required'),
            'Project ID field should be visible on the Verification step',
          ).toBeVisible();
        });

        await test.step('Fill Purchase Order and Project ID, assert Invoice payment, then confirm order', async () => {
          await checkoutModule.completeVerificationStep(purchaseOrder, projectId);
        });

        // ── Phase 7: Order Confirmation ────────────────────────────────────

        await test.step('Verify Order Confirmation page URL and "Order confirmed!" heading', async () => {
          await expect(page).toHaveURL(/\/checkout\/.*\/tunnel\/confirmation\//);
          await expect(
            orderConfirmationPage.confirmationHeading(),
            '"Order confirmed!" heading should be visible on the confirmation page',
          ).toBeVisible();
        });

        await test.step('Verify order reference, delivery message, and "Go to Order history" button', async () => {
          await checkoutModule.verifyOrderConfirmation();
        });

        await test.step('Verify order reference text matches pattern vanilla-{numericId}', async () => {
          const orderRef = await orderConfirmationPage.getOrderReferenceText();
          expect(
            orderRef,
            'Order reference should match pattern vanilla-{numericId}',
          ).toMatch(/vanilla-\d+/);
        });
      },
    );
  },
);
