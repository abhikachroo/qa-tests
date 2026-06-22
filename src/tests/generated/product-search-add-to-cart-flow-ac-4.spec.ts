import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '170720241509';
const EXPECTED_CART_LINE_COUNT = 1;

test.describe(`@P1 @ProductSearchAddToCart Product search add-to-cart flow AC-4 — ${config.displayName} on ${config.environment}`, () => {
  test('@P1 @Functional TC-007: Navigate to cart after add-to-cart shows product line item', async ({
    productSearchAddToCartModule,
    cartPage,
  }) => {
    await test.step('Search for the product to add to the cart', async () => {
      await productSearchAddToCartModule.searchForProduct(PRODUCT_ID);
    });

    await test.step('Verify the matching product result is available', async () => {
      await productSearchAddToCartModule.verifySearchResult(PRODUCT_ID);
    });

    await test.step('Open the matching product detail page', async () => {
      await productSearchAddToCartModule.openMatchingProduct(PRODUCT_ID);
    });

    await test.step('Verify the selected product can be purchased', async () => {
      await productSearchAddToCartModule.verifyPurchasableProduct(PRODUCT_ID);
    });

    await test.step('Add the selected product to the cart', async () => {
      await productSearchAddToCartModule.addProductToCart();
    });

    await test.step('Verify the cart reflects the added product', async () => {
      await productSearchAddToCartModule.verifyCartUpdated();
    });

    await test.step('Navigate to the cart after add-to-cart', async () => {
      await productSearchAddToCartModule.navigateToCart();
    });

    await test.step('Verify the cart displays the product line item and no empty state', async () => {
      await productSearchAddToCartModule.verifyProductInCart(PRODUCT_ID);
      await expect(
        cartPage.productLineItems().filter({ hasText: PRODUCT_ID }),
        'Cart should display one line item for the product added once, representing quantity at least 1',
      ).toHaveCount(EXPECTED_CART_LINE_COUNT);
    });
  });

  test('@P1 @Negative TC-009: Empty cart displays empty state before product is added', async ({
    productSearchAddToCartModule,
    cartPage,
  }) => {
    await test.step('Navigate directly to the cart with a clean session', async () => {
      await productSearchAddToCartModule.navigateToCart();
    });

    await test.step('Verify the empty cart message and absence of product line items', async () => {
      await productSearchAddToCartModule.verifyEmptyCart();
    });

    await test.step('Verify checkout is disabled or unavailable for the empty cart', async () => {
      await expect(
        cartPage.checkoutButton(),
        'Checkout should be disabled or absent when the cart is empty',
      ).not.toBeEnabled();
    });
  });
});
