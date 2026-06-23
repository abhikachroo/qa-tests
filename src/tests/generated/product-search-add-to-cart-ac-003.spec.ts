import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '170720241509';

test.describe(`@P1 @P2 @ProductSearchAddToCart Cart verification — ${config.displayName} on ${config.environment}`, () => {
  test('@P1 @Functional @ProductSearchAddToCart TC-008: Navigate to cart after adding product 170720241509 and verify product row', async ({
    productCartModule,
    cartPage,
    page,
  }) => {
    await test.step('Search for the target product', async () => {
      await productCartModule.searchAndVerifyProduct(PRODUCT_ID);
    });

    await test.step('Add the matching product to the cart', async () => {
      await productCartModule.addVisibleProductToCart(PRODUCT_ID);
    });

    await test.step('Verify the cart confirmation shows at least one item', async () => {
      await productCartModule.verifyAddToCartConfirmation();
      await expect(
        cartPage.cartIndicator(),
        'Cart indicator should reflect at least one item after adding the product',
      ).toContainText(/[1-9]\d*/);
    });

    await test.step('Open the cart from the cart entry point', async () => {
      await productCartModule.openCart();
    });

    await test.step('Verify the cart opens with contents instead of an empty state', async () => {
      await expect(page, 'Cart navigation should not render a Page not found view').not.toHaveTitle(/page not found/i);
      await expect(
        cartPage.emptyCartState(),
        'Empty-cart state should not be visible after adding the target product',
      ).not.toBeVisible();
    });

    await test.step('Verify the cart item contains the target product ID', async () => {
      await productCartModule.verifyProductInCart(PRODUCT_ID);
      await expect(
        cartPage.cartLineItem(PRODUCT_ID),
        `Cart line item should include product ID ${PRODUCT_ID}`,
      ).toContainText(PRODUCT_ID);
    });
  });

  test('@P2 @Negative @ProductSearchAddToCart TC-009: Show empty cart state when cart has no products', async ({
    productCartModule,
    cartPage,
  }) => {
    await test.step('Open an isolated empty cart and verify the empty state', async () => {
      await productCartModule.verifyEmptyCart();
    });

    await test.step('Verify the target product is absent from the empty cart', async () => {
      await expect(
        cartPage.cartLineItem(PRODUCT_ID),
        `Product ID ${PRODUCT_ID} should not be listed in an empty cart`,
      ).not.toBeVisible();
    });

    await test.step('Verify empty-cart guidance remains visible', async () => {
      await expect(
        cartPage.emptyCartState(),
        'Empty-cart guidance should be visible when no products are in the cart',
      ).toBeVisible();
    });
  });
});
