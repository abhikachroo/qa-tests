import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '170720241509';

test.describe(`@P1 @ProductSearchAndAddToCart Product Search And Add To Cart — ${config.displayName} on ${config.environment}`, () => {
  test('@P1 @Functional @ProductSearchAndAddToCart TC-009: Verify cart contains searched product ID after add-to-cart', async ({
    cartModule,
    cartPage,
  }) => {
    await test.step('Search for the configured product and add it to the cart', async () => {
      await cartModule.searchAndAddProductToCart(PRODUCT_ID);
    });

    await test.step('Open the cart from the confirmed UI entry point', async () => {
      await cartModule.openCartFromUi();
    });

    await test.step('Wait for cart contents and verify the searched product line is visible', async () => {
      await expect(
        cartPage.cartContents(),
        'Cart contents should be visible after opening the cart from the UI',
      ).toBeVisible();
      await cartModule.verifyCartContainsProduct(PRODUCT_ID);
    });

    await test.step('Verify the cart line displays the searched product ID', async () => {
      await expect(
        cartPage.cartLineByProductId(PRODUCT_ID),
        `Cart line should display searched product ID ${PRODUCT_ID}`,
      ).toContainText(PRODUCT_ID);
    });
  });

  test('@P2 @Negative @ProductSearchAndAddToCart TC-010: Empty cart before adding product shows empty-state and no searched product', async ({
    cartModule,
    cartPage,
  }) => {
    await test.step('Open the cart from the confirmed UI entry point in a fresh session', async () => {
      await cartModule.openCartFromUi();
    });

    await test.step('Verify empty-cart messaging is displayed before adding the product', async () => {
      await cartModule.verifyEmptyCartState(PRODUCT_ID);
      await expect(
        cartPage.emptyCartMessage(),
        'Empty-cart message should explain that no products are currently in the cart',
      ).toBeVisible();
    });

    await test.step('Verify the searched product ID is absent from the empty cart', async () => {
      await expect(
        cartPage.cartLineByProductId(PRODUCT_ID),
        `Product ${PRODUCT_ID} should be absent from the cart before any add-to-cart action`,
      ).not.toBeVisible();
    });
  });
});
