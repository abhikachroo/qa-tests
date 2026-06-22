import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '170720241509';

test.describe(`@P1 @ProductSearchAddToCart Product search add-to-cart flow AC-3 — ${config.displayName} on ${config.environment}`, () => {
  test('@P1 @Functional TC-005: Add selected product to cart updates cart confirmation or count', async ({
    productSearchAddToCartModule,
  }) => {
    await test.step('Search for the product to add', async () => {
      await productSearchAddToCartModule.searchForProduct(PRODUCT_ID);
    });

    await test.step('Verify the matching product can be selected', async () => {
      await productSearchAddToCartModule.verifySearchResult(PRODUCT_ID);
    });

    await test.step('Open the matching product detail page', async () => {
      await productSearchAddToCartModule.openMatchingProduct(PRODUCT_ID);
    });

    await test.step('Verify the selected product is purchasable', async () => {
      await productSearchAddToCartModule.verifyPurchasableProduct(PRODUCT_ID);
    });

    await test.step('Add the selected product to the cart', async () => {
      await productSearchAddToCartModule.addProductToCart();
    });

    await test.step('Verify the cart confirmation or count is updated', async () => {
      await productSearchAddToCartModule.verifyCartUpdated();
    });
  });

  test('@P1 @Negative TC-006: Rapid double-click on Add to cart is prevented while request is loading', async ({
    productSearchAddToCartModule,
    cartPage,
  }) => {
    await test.step('Search for the product to add rapidly', async () => {
      await productSearchAddToCartModule.searchForProduct(PRODUCT_ID);
    });

    await test.step('Verify the matching product can be selected', async () => {
      await productSearchAddToCartModule.verifySearchResult(PRODUCT_ID);
    });

    await test.step('Open the matching product detail page', async () => {
      await productSearchAddToCartModule.openMatchingProduct(PRODUCT_ID);
    });

    await test.step('Verify the selected product is ready for add-to-cart', async () => {
      await productSearchAddToCartModule.verifyPurchasableProduct(PRODUCT_ID);
    });

    await test.step('Attempt to add the product twice with a rapid double-click', async () => {
      await productSearchAddToCartModule.attemptRapidDoubleAdd();
    });

    await test.step('Verify the cart records the add-to-cart request completion', async () => {
      await productSearchAddToCartModule.verifyCartUpdated();
    });

    await test.step('Navigate to the cart to inspect the resulting line item state', async () => {
      await productSearchAddToCartModule.navigateToCart();
    });

    await test.step('Verify only one cart line is created for the rapid double-clicked product', async () => {
      await productSearchAddToCartModule.verifyProductInCart(PRODUCT_ID);
      await expect(
        cartPage.productLineItems().filter({ hasText: PRODUCT_ID }),
        'Rapid double-click should not create duplicate cart lines for the same product',
      ).toHaveCount(1);
    });
  });

  test('@P2 @Negative TC-010: Adding the same product twice follows defined duplicate-add behavior', async ({
    productSearchAddToCartModule,
    cartPage,
  }) => {
    await test.step('Search for the product to add twice', async () => {
      await productSearchAddToCartModule.searchForProduct(PRODUCT_ID);
    });

    await test.step('Verify the matching product can be selected', async () => {
      await productSearchAddToCartModule.verifySearchResult(PRODUCT_ID);
    });

    await test.step('Open the matching product detail page', async () => {
      await productSearchAddToCartModule.openMatchingProduct(PRODUCT_ID);
    });

    await test.step('Verify the selected product is purchasable before duplicate add', async () => {
      await productSearchAddToCartModule.verifyPurchasableProduct(PRODUCT_ID);
    });

    await test.step('Add the selected product once', async () => {
      await productSearchAddToCartModule.addProductToCart();
      await productSearchAddToCartModule.verifyCartUpdated();
    });

    await test.step('Add the same product again after the first add completes', async () => {
      await productSearchAddToCartModule.addProductToCart();
      await productSearchAddToCartModule.verifyCartUpdated();
    });

    await test.step('Navigate to the cart to inspect duplicate-add behavior', async () => {
      await productSearchAddToCartModule.navigateToCart();
    });

    await test.step('Verify the duplicate-add result remains consolidated for the product', async () => {
      await productSearchAddToCartModule.verifyProductInCart(PRODUCT_ID);
      await expect(
        cartPage.productLineItems().filter({ hasText: PRODUCT_ID }),
        'Duplicate add should keep the product represented by a single cart line while quantity or messaging defines behavior',
      ).toHaveCount(1);
    });
  });
});
