import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '170720241509';
const EXPECTED_QUANTITY = '1';

test.describe(`@P1 @ProductSearchAddToCart Product Search and Add to Cart — ${config.displayName} on ${config.environment}`, () => {
  test('@P1 @Functional @ProductSearchAddToCart TC-006: Open the cart after adding product ID 170720241509 displays the product in cart contents', async ({
    productCartModule,
    cartPage,
  }) => {
    await test.step('Search for the product ID', async () => {
      await productCartModule.searchForProduct(PRODUCT_ID);
    });

    await test.step('Verify the matching product is shown in search results', async () => {
      await productCartModule.verifyProductSearchResult(PRODUCT_ID);
    });

    await test.step('Add the matching product to the cart', async () => {
      await productCartModule.addProductFromSearchResults(PRODUCT_ID);
    });

    await test.step('Open the cart from the confirmed cart entry point', async () => {
      await productCartModule.openCart();
    });

    await test.step('Verify the cart displays the added product line item', async () => {
      await productCartModule.verifyProductInCart(PRODUCT_ID);
      await expect(
        cartPage.cartLineItem(PRODUCT_ID),
        `Cart line item for product ID ${PRODUCT_ID} should be visible after adding the product`,
      ).toBeVisible();
      await expect(
        cartPage.cartLineItem(PRODUCT_ID),
        `Cart line item for product ID ${PRODUCT_ID} should include the expected default quantity`,
      ).toContainText(EXPECTED_QUANTITY);
      await expect(
        cartPage.emptyCartState(),
        'Empty-cart state should not be visible when the added product is present in the cart',
      ).not.toBeVisible();
    });
  });

  test('@P1 @Negative @ProductSearchAddToCart TC-007: Empty cart entry point shows an empty-cart state before adding the product', async ({
    productCartModule,
    cartPage,
  }) => {
    await test.step('Open the cart from a fresh empty session', async () => {
      await productCartModule.openCart();
    });

    await test.step('Verify the empty-cart state is displayed', async () => {
      await productCartModule.verifyEmptyCart(PRODUCT_ID);
      await expect(
        cartPage.emptyCartState(),
        'Empty-cart state should be visible before any product is added',
      ).toBeVisible();
    });

    await test.step('Verify the target product is absent from the empty cart', async () => {
      await expect(
        cartPage.cartLineItem(PRODUCT_ID),
        `Product ID ${PRODUCT_ID} should not be listed in an empty cart`,
      ).not.toBeVisible();
    });
  });
});
