import { test, expect } from '@fixtures';
import { config }       from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';

/**
 * E2E Happy Path — Login → Search → Add to Cart → Checkout → Order Confirmation
 *
 * Feature:   E2E Happy Path
 * App:       https://fra-vanilla-preprod.dev.spark.sonepar.com
 * Scope:     Single test covering the complete B2B purchase flow end-to-end.
 *
 * Test Scenario Mapping (all executed as steps within one test):
 *   Step → TC-001  P0 Smoke      — Login with valid credentials
 *   Step → TC-002  P1 Functional — Search for SKU 6968173
 *   Step → TC-003  P1 Functional — Add product to cart from PDP
 *   Step → TC-004  P0 Functional — Complete 2-step checkout (Logistics + Verification)
 *   Step → TC-005  P1 Functional — Verify order confirmation page
 *
 * NOTE: This test places a real order in the preprod environment.
 * Cart state is consumed on each run. On subsequent runs the checkout module
 * will re-add the product to cart via PDP navigation.
 *
 * TC-005 order confirmation locators are preliminary and must be verified
 * on the first successful run (see OrderConfirmationPage.ts TODO comments).
 */
test.describe(
  `@E2EHappyPath @P0 @Smoke E2E Happy Path — ${config.displayName} on ${config.environment}`,
  () => {
    /**
     * TC-E2E-001: Complete B2B purchase flow — Login → Search → Add to Cart
     *             → Checkout (Logistics + Verification) → Order Confirmation
     *
     * Preconditions:
     *   - User account configured in config.json is active and has invoice payment enabled
     *   - Product SKU 6968173 (LISTA Schuifladekast) is available in the preprod catalogue
     *   - Preprod supports invoice-based order submission without a real payment gateway
     */
    test(
      'TC-E2E-001: @P0 @Smoke Full B2B purchase — login, search SKU 6968173, add to cart, checkout and confirm order',
      async ({
        page,
        loginModule,
        homePage,
        searchModule,
        checkoutModule,
      }) => {
        // ── Unique test-run identifiers for required checkout fields ─────────────
        const purchaseOrder = `PO-${DataGenerator.randomString(6).toUpperCase()}`;
        const projectId     = `PROJ-${DataGenerator.randomString(4).toUpperCase()}`;

        const productSku  = '6968173';
        const productPath =
          '/catalog/en-gb/products/lista-schuifladekast-mobiel-27x27e-bxdxh-564x572x723mm-5-lades-ral7035-grijs-6968173';

        // ── TC-001: Login ─────────────────────────────────────────────────────────
        await test.step('TC-001: Login with valid credentials and verify authenticated state', async () => {
          await loginModule.doLogin();
          await expect(
            page,
            'URL should redirect to the application domain after login',
          ).toHaveURL(/fra-vanilla-preprod\.dev\.spark\.sonepar\.com/);
          await expect(
            homePage.userDetailsButton(),
            'User details button should be visible — confirms authenticated session',
          ).toBeVisible();
          await expect(
            homePage.welcomeHeading(),
            'Welcome heading (H1) should be visible on the authenticated dashboard',
          ).toBeVisible();
        });

        // ── TC-002: Search for SKU ────────────────────────────────────────────────
        await test.step('TC-002: Search for SKU 6968173 and verify results page', async () => {
          await searchModule.submitSearch(productSku);
          await expect(
            page,
            'URL should contain the searched SKU after navigating to results',
          ).toHaveURL(/\/search\/6968173/);
          await searchModule.verifySearchResultsPage(productSku);
        });

        // ── TC-003: Add to cart from PDP ──────────────────────────────────────────
        await test.step('TC-003: Navigate to PDP and add SKU 6968173 to cart', async () => {
          await checkoutModule.addProductToCart(productPath, productSku);
          await expect(
            homePage.cartButton(),
            'Cart button in header should be visible after adding item to cart',
          ).toBeVisible();
        });

        // ── TC-004: Complete 2-step checkout ──────────────────────────────────────
        await test.step('TC-004: Navigate to cart and proceed through checkout', async () => {
          await checkoutModule.proceedToCheckoutFromCart(productSku);
        });

        await test.step('TC-004: Complete Logistics step 1/2 — proceed to Verification', async () => {
          await checkoutModule.completeLogisticsStep();
        });

        await test.step('TC-004: Complete Verification step 2/2 — fill required fields and confirm order', async () => {
          await checkoutModule.completeVerificationAndSubmit(purchaseOrder, projectId);
        });

        // ── TC-005: Verify order confirmation page ────────────────────────────────
        await test.step('TC-005: Verify order confirmation page — heading and product reference are displayed', async () => {
          await checkoutModule.verifyOrderConfirmation(productSku);
          await expect(
            page,
            'URL should not contain "/verification" — must have navigated to confirmation page',
          ).not.toHaveURL(/\/verification/);
        });
      },
    );
  },
);
