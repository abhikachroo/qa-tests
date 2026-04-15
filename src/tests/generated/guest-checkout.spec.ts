import { test, expect } from '@fixtures';
import { config } from '@config/index';

/**
 * Guest Checkout — End-to-End Tests
 *
 * Feature: Guest Checkout
 * Application: https://fra-vanilla-preprod.dev.spark.sonepar.com
 * Scope: Happy-path only. Sad paths, edge cases, and payment failure
 *        scenarios are explicitly out of scope per requirements.
 *
 * Key known constraints (discovered during live app browsing):
 * - "Add to cart" is DISABLED on search result cards for unauthenticated users
 *   → Tests add to cart from the Product Detail Page (PDP) only
 * - "Checkout as guest" button lives on the cart page (/checkout/en-gb/)
 *   and is disabled when the cart is empty
 * - Checkout form field labels are approximated — selectors in CheckoutPage
 *   are marked TODO and must be validated against the real preprod form
 * - TC-008 (full E2E order placement) requires a valid preprod test card;
 *   the test is skipped until payment credentials are confirmed by the team
 */

// ─────────────────────────────────────────────────────────────────────────────
// FLOW 1: Search
// ─────────────────────────────────────────────────────────────────────────────

test.describe(`@P0 @Smoke @GuestCheckout Guest Search — ${config.displayName} on ${config.environment}`, () => {

  /**
   * TC-001: Guest user can search for a product without being logged in.
   * Priority: P0 Smoke
   */
  test('TC-001: Guest can perform a product search without logging in', async ({
    searchModule,
    searchPage,
  }) => {
    await test.step('Navigate to search results for a known keyword', async () => {
      await searchModule.navigateToSearchResults('cable');
    });

    await test.step('Verify the search results page loaded successfully', async () => {
      await expect(searchPage['page']).toHaveURL(/\/search/);
    });

    await test.step('Verify no login redirect occurred', async () => {
      await expect(searchPage['page']).not.toHaveURL(/\/login|\/sign-in/);
    });
  });

  /**
   * TC-002: Search results display relevant product cards.
   * Priority: P1 Functional
   */
  test('TC-002: Search results display product cards for a matching keyword', async ({
    searchModule,
    searchPage,
  }) => {
    await test.step('Navigate to search results for "cable"', async () => {
      await searchModule.navigateToSearchResults('cable');
    });

    await test.step('Verify at least one product card is displayed', async () => {
      const count = await searchPage.getProductCount();
      expect(count, 'At least one product card should be visible for a known keyword').toBeGreaterThan(0);
    });
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// FLOW 2: Add to Cart
// ─────────────────────────────────────────────────────────────────────────────

test.describe(`@P0 @Smoke @GuestCheckout Guest Add-to-Cart — ${config.displayName} on ${config.environment}`, () => {

  /**
   * TC-003: Guest can navigate to a product detail page.
   * Priority: P1 Functional
   * Note: Navigation goes directly to a known product URL because
   *       "Add to cart" is disabled on search result cards for guests.
   */
  test('TC-003: Guest can navigate to a product detail page', async ({
    productDetailPage,
  }) => {
    await test.step('Navigate directly to the product detail page', async () => {
      await productDetailPage.navigateToProduct(config.productPath);
      await productDetailPage.waitForPageLoad();
      await productDetailPage.dismissCookieBannerIfPresent();
    });

    await test.step('Verify the PDP loaded and shows a product title', async () => {
      await expect(productDetailPage.productTitle()).toBeVisible();
    });

    await test.step('Verify URL matches the product path', async () => {
      await expect(productDetailPage['page']).toHaveURL(/\/catalog\/en-gb\/products\//);
    });
  });

  /**
   * TC-004: Guest can add a product to the cart from the PDP.
   * Priority: P0 Smoke
   * Note: Add-to-cart is done from PDP — disabled on search result cards for guests.
   */
  test('TC-004: Guest can add a product to the cart from the product detail page', async ({
    cartModule,
    productDetailPage,
  }) => {
    await test.step('Navigate to PDP and add product to cart', async () => {
      await cartModule.addProductToCartFromPdp();
    });

    await test.step('Verify the add-to-cart action was acknowledged', async () => {
      // Either a toast confirmation appears OR the cart badge count increases
      // Both assertions are resilient via auto-retrying expect
      await expect(
        productDetailPage.addToCartConfirmation().or(productDetailPage.cartCountBadge()),
      ).toBeVisible({ timeout: 10_000 });
    });
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// FLOW 3: Cart & Guest Checkout Entry
// ─────────────────────────────────────────────────────────────────────────────

test.describe(`@P1 @GuestCheckout Guest Cart — ${config.displayName} on ${config.environment}`, () => {

  /**
   * TC-005: Cart reflects the added product.
   * Priority: P1 Functional
   * Precondition: Product added to cart in preceding step (independent test — adds own product).
   */
  test('TC-005: Cart page shows the product after it has been added', async ({
    cartModule,
    cartPage,
  }) => {
    await test.step('Add a product to the cart via PDP', async () => {
      await cartModule.addProductToCartFromPdp();
    });

    await test.step('Navigate to cart and verify the item is present', async () => {
      await cartModule.verifyCartHasItem();
    });

    await test.step('Verify the cart page URL is correct', async () => {
      await expect(cartPage['page']).toHaveURL(/\/checkout\/en-gb/);
    });
  });

  /**
   * TC-006: Guest can click "Checkout as guest" from the cart.
   * Priority: P1 Functional
   * Precondition: Cart is non-empty.
   */
  test('TC-006: Guest can click "Checkout as guest" from a non-empty cart', async ({
    cartModule,
    checkoutModule,
  }) => {
    await test.step('Add a product to the cart via PDP', async () => {
      await cartModule.addProductToCartFromPdp();
    });

    await test.step('Navigate to cart page', async () => {
      await cartModule.verifyCartHasItem();
    });

    await test.step('Click "Checkout as guest" and verify navigation to checkout', async () => {
      await cartModule.proceedToGuestCheckout();
      await checkoutModule.verifyOnCheckoutPage();
    });
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// FLOW 4: Checkout Form & Order Placement
// ─────────────────────────────────────────────────────────────────────────────

test.describe(`@P1 @GuestCheckout Guest Checkout Form — ${config.displayName} on ${config.environment}`, () => {

  /**
   * TC-007: Guest checkout form accepts required contact and delivery details.
   * Priority: P1 Functional
   * Note: Test verifies form accepts input — does NOT submit the final order.
   *       Full E2E order placement is TC-008 (skipped pending payment creds).
   */
  test('TC-007: Guest checkout form accepts contact and delivery details', async ({
    cartModule,
    checkoutModule,
    checkoutPage,
  }) => {
    await test.step('Add product and proceed to guest checkout', async () => {
      await cartModule.addProductToCartFromPdp();
      await cartModule.verifyCartHasItem();
      await cartModule.proceedToGuestCheckout();
    });

    await test.step('Fill in guest contact and delivery details', async () => {
      await checkoutModule.fillGuestDetails({
        email: 'guest.tester@qa-automation.test',
        firstName: 'QA',
        lastName: 'GuestUser',
        phone: '0700000001',
        addressLine1: '1 Test Street',
        city: 'Paris',
        postcode: '75001',
      });
    });

    await test.step('Verify the email field contains the entered value', async () => {
      await expect(checkoutPage.emailInput()).toHaveValue('guest.tester@qa-automation.test');
    });

    await test.step('Verify the first name field contains the entered value', async () => {
      await expect(checkoutPage.firstNameInput()).toHaveValue('QA');
    });
  });

  /**
   * TC-008: Guest can complete an end-to-end order placement.
   * Priority: P1 Functional
   *
   * SKIPPED: Requires a valid preprod payment test card (e.g. Stripe test card).
   * Obtain test card credentials from the dev/infra team and update this test.
   * Uncomment and implement the payment step once credentials are available.
   */
  test.skip('TC-008: Guest can complete an end-to-end order placement', async ({
    cartModule,
    checkoutModule,
  }) => {
    // SKIPPED — preprod payment test card credentials are required.
    // Steps to implement once payment creds are available:
    // 1. Add product to cart
    // 2. Proceed to guest checkout
    // 3. Fill contact + delivery details
    // 4. Advance through checkout steps (advanceToNextStep() per step)
    // 5. Enter test card details (add PaymentPage + PaymentModule)
    // 6. Submit order (submitOrder())
    // 7. Verify order confirmation (verifyOrderConfirmation())

    await test.step('Add product to cart and proceed to guest checkout', async () => {
      await cartModule.addProductToCartFromPdp();
      await cartModule.verifyCartHasItem();
      await cartModule.proceedToGuestCheckout();
    });

    await test.step('Fill guest details and advance through checkout', async () => {
      await checkoutModule.fillGuestDetails({
        email: 'guest.tester@qa-automation.test',
        firstName: 'QA',
        lastName: 'GuestUser',
        phone: '0700000001',
        addressLine1: '1 Test Street',
        city: 'Paris',
        postcode: '75001',
      });
      await checkoutModule.advanceToNextStep();
    });

    await test.step('Submit order and verify confirmation', async () => {
      await checkoutModule.submitOrder();
      await checkoutModule.verifyOrderConfirmation();
    });
  });

});
