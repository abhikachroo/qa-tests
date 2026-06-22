import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '170720241509';

test.describe(`@P1 @P2 @Regression @ProductSearchAndAddToCart Add product to cart — ${config.displayName} on ${config.environment}`, () => {
  test('TC-007 @P1 @Functional @ProductSearchAndAddToCart: Add selected product to cart updates cart count and shows confirmation', async ({
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

    await test.step('Verify the cart reflects the added product', async () => {
      await productCartModule.verifyAddToCartSucceeded(PRODUCT_ID);
      await expect(productCartPage.cartButton(), 'Cart button should remain available after add-to-cart').toBeVisible();
      await expect(productCartPage.cartButton(), 'Cart count should increment to at least one item').toContainText(/[1-9]\d*/);
    });

    await test.step('Verify the add-to-cart success confirmation state is shown', async () => {
      await expect(productCartPage.confirmationMessage(), 'Confirmation state should be visible after adding the product to cart').toBeVisible();
      await expect(productCartPage.errorMessage(), 'No error banner should be visible after successful add-to-cart').not.toBeVisible();
    });
  });

  test('TC-008 @P2 @Negative @ProductSearchAndAddToCart: Add-to-cart service failure leaves product out of cart and shows recoverable error', async ({
    productCartModule,
    productCartPage,
  }) => {
    await test.step('Route add-to-cart requests to a controlled service failure', async () => {
      await productCartModule.routeAddToCartFailure();
    });

    await test.step('Open the target product from search results', async () => {
      await productCartModule.searchAndSelectProduct(PRODUCT_ID);
      await productCartModule.verifyProductSelection(PRODUCT_ID);
    });

    await test.step('Attempt to add the selected product to the cart', async () => {
      await productCartModule.addSelectedProductToCart();
    });

    await test.step('Verify the recoverable failure state is displayed', async () => {
      await productCartModule.verifyAddToCartFailure();
      await expect(productCartPage.errorMessage(), 'Recoverable error message should be displayed when add-to-cart fails').toBeVisible();
    });

    await test.step('Verify the failed product is not silently added to the cart', async () => {
      await expect(productCartPage.productIdText(PRODUCT_ID), `Product ID ${PRODUCT_ID} should remain associated with the failed add-to-cart attempt`).toBeVisible();
      await expect(productCartPage.cartButton(), 'Cart count should not increment after the failed add-to-cart request').not.toContainText(/[1-9]\d*/);
      await expect(productCartPage.addToCartButton(), 'User should be able to retry add-to-cart after a recoverable failure').toBeEnabled();
    });
  });
});
