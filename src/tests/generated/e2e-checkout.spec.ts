import { test, expect } from '@fixtures';
import { config }        from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';

/**
 * E2E Add-to-Cart & Checkout Flow
 *
 * TC-001: Complete E2E purchase flow from login to order confirmation for SKU 6968173
 * Priority : P0
 * Type     : Functional (happy path only)
 * AC Ref   : AC-001 (Login), AC-003 (Search), AC-005 (Add to cart), AC-007 (Checkout + Confirmation)
 *
 * Flow:
 *   Login → Search SKU 6968173 → Add to Cart → Cart review →
 *   Logistics step (1/2) → Verification step (2/2) → Order Confirmation
 */
test.describe(
  `@E2E @P0 Add-to-Cart & Checkout — ${config.displayName} on ${config.environment}`,
  () => {
    const SKU = '6968173';

    test.beforeEach(async ({ loginModule, checkoutModule }) => {
      await test.step('Login as configured test user', async () => {
        await loginModule.doLogin();
      });

      await test.step('Clear cart to guarantee clean state before test', async () => {
        await checkoutModule.clearCart();
      });
    });

    test(
      `TC-001: Complete E2E purchase flow from login to order confirmation for SKU ${SKU}`,
      async ({ page, homePage, checkoutModule }) => {
        // Generate unique test data inside the test body to support retries
        const purchaseOrder = `PO-${DataGenerator.randomString(6).toUpperCase()}`;
        const projectId     = `PROJ-${DataGenerator.randomString(6).toUpperCase()}`;

        await test.step('Navigate to home page and search for SKU 6968173', async () => {
          await homePage.navigate('/');
          await homePage.waitForPageLoad();
          await checkoutModule.searchForProduct(SKU);
        });

        await test.step('Add product to cart and verify cart badge increments to 1 item', async () => {
          await checkoutModule.addToCart();
        });

        await test.step('Navigate to cart page and verify 1 product with correct SKU is present', async () => {
          await checkoutModule.verifyCart(SKU);
        });

        await test.step('Proceed to checkout — verify logistics step 1/2 loads with delivery address', async () => {
          await checkoutModule.proceedToLogistics();
        });

        await test.step('Continue to verification — verify step 2/2 loads', async () => {
          await checkoutModule.proceedToVerification();
        });

        await test.step(
          'Fill Purchase Order and Project ID, confirm Credit Line payment is selected, submit order',
          async () => {
            await checkoutModule.completeVerificationAndSubmit(purchaseOrder, projectId);
          },
        );

        await test.step(
          'Verify order confirmation: "Order confirmed!" heading, Ref vanilla-{id} reference, and Go to Order History button',
          async () => {
            await checkoutModule.verifyOrderConfirmation(purchaseOrder);
            await expect(page).toHaveURL(/confirmation/);
          },
        );
      },
    );
  },
);
