import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '170720241509';

test.describe(`@P1 @P2 @Regression @ProductSearchAndAddToCart Verify product in cart — ${config.displayName} on ${config.environment}`, () => {
  test('TC-009 @P1 @Functional @ProductSearchAndAddToCart: Navigate to cart after add-to-cart lists product ID 170720241509', async ({
    productCartModule,
    productCartPage,
  }) => {
    await test.step('Open the target product from search results', async () => {
      await productCartModule.searchAndSelectProduct(PRODUCT_ID);
      await productCartModule.verifyProductSelection(PRODUCT_ID);
    });

    await test.step('Add the selected product to the cart', async () => {
      await productCartModule.addSelectedProductToCart();
    });

    await test.step('Open the cart through application navigation', async () => {
      await productCartModule.openCart();
    });

    await test.step('Verify the cart opens without a 404 error and contains line items', async () => {
      await expect(productCartPage.error404Container(), 'Cart view should not render the 404 page').not.toBeVisible();
      await expect(productCartPage.cartLineItems(), 'Cart should contain at least one line item after add-to-cart').not.toHaveCount(0);
    });

    await test.step('Verify the cart line item contains the target product and default quantity', async () => {
      await productCartModule.verifyCartContainsProduct(PRODUCT_ID);
      await expect(productCartPage.cartLineItemByProductId(PRODUCT_ID), `Cart line item should include product ID ${PRODUCT_ID}`).toContainText(PRODUCT_ID);
      await expect(productCartPage.cartLineItemByProductId(PRODUCT_ID), 'Cart line item should show quantity 1 or the default selected quantity').toContainText(/\b1\b/);
    });
  });

  test('TC-010 @P2 @Negative @ProductSearchAndAddToCart: Empty cart view shows empty-state guidance before any item is added', async ({
    context,
    page,
    productCartModule,
    productCartPage,
  }) => {
    await test.step('Prepare an empty cart browser session', async () => {
      await context.clearCookies();
      await context.clearPermissions();
      await page.goto(config.baseUrl);
      await page.evaluate(() => {
        window.localStorage.clear();
        window.sessionStorage.clear();
      });
      await page.reload();
    });

    await test.step('Open the empty cart through application navigation', async () => {
      await productCartModule.verifyEmptyCartState();
    });

    await test.step('Verify the empty cart guidance is displayed without a 404 error', async () => {
      await expect(productCartPage.error404Container(), 'Opening an empty cart through app navigation should not show 404').not.toBeVisible();
      await expect(productCartPage.emptyCartState(), 'Empty-cart guidance or next-step action should be visible').toBeVisible();
    });

    await test.step('Verify the cart count does not show any added items', async () => {
      await expect(productCartPage.cartButton(), 'Cart count should remain empty or zero before adding any item').not.toContainText(/[1-9]\d*/);
    });
  });
});
