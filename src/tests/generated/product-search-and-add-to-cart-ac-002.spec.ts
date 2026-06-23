import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '170720241509';
const ADD_TO_CART_LOADING_TIMEOUT_MS = 2_000;

test.describe(`@P1 @ProductSearchAndAddToCart Product Search And Add To Cart — ${config.displayName} on ${config.environment}`, () => {
  test('@P1 @Functional @ProductSearchAndAddToCart TC-005: Add located product to cart shows confirmation', async ({
    cartModule,
  }) => {
    await test.step('Search for the configured product and add it to the cart', async () => {
      await cartModule.searchAndAddProductToCart(PRODUCT_ID);
    });

    await test.step('Open the cart from the UI', async () => {
      await cartModule.openCartFromUi();
    });

    await test.step('Verify the cart contains the added product', async () => {
      await cartModule.verifyCartContainsProduct(PRODUCT_ID);
    });
  });

  test('@P2 @Negative @ProductSearchAndAddToCart TC-006: Add-to-cart request prevents duplicate submission while loading', async ({
    searchModule,
    cartModule,
    cartPage,
  }) => {
    await test.step('Search for the configured product', async () => {
      await searchModule.submitSearch(PRODUCT_ID);
    });

    await test.step('Verify the located product can be submitted to the cart', async () => {
      await searchModule.verifySearchResultsPage(PRODUCT_ID);
      await expect(
        cartPage.addToCartButton(PRODUCT_ID),
        'Add-to-cart control should be enabled before the first submission',
      ).toBeEnabled();
    });

    await test.step('Submit the add-to-cart request once and verify duplicate submission is guarded', async () => {
      await cartPage.clickAddToCart(PRODUCT_ID);
      await expect(
        cartPage.addToCartButton(PRODUCT_ID),
        'Add-to-cart control should be disabled while the request is in flight to prevent duplicate submission',
      ).toBeDisabled({ timeout: ADD_TO_CART_LOADING_TIMEOUT_MS });
    });

    await test.step('Open the cart from the UI after the guarded submission', async () => {
      await cartModule.openCartFromUi();
    });

    await test.step('Verify the cart contains the intended product after duplicate submission is prevented', async () => {
      await cartModule.verifyCartContainsProduct(PRODUCT_ID);
      await expect(
        cartPage.cartLineByProductId(PRODUCT_ID),
        `Cart line should show product ${PRODUCT_ID} after duplicate submission is guarded`,
      ).toContainText(PRODUCT_ID);
    });
  });
});
