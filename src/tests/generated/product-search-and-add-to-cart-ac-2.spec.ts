import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '170720241509';

test.describe(`@P1 @Functional @ProductSearchAndAddToCart Open/select product — ${config.displayName} on ${config.environment}`, () => {
  test('TC-006 @P1 @Functional @ProductSearchAndAddToCart: Select matching search result opens product detail or selected product state', async ({
    productCartModule,
    productCartPage,
    searchResultsPage,
  }) => {
    await test.step('Search for the target product and select the matching result', async () => {
      await productCartModule.searchAndSelectProduct(PRODUCT_ID);
    });

    await test.step('Verify the selected product state is displayed without a 404 error', async () => {
      await productCartModule.verifyProductSelection(PRODUCT_ID);
      await expect(searchResultsPage.error404Container(), '404 page should not be displayed after selecting the product').not.toBeVisible();
    });

    await test.step('Verify product details and add-to-cart control are available', async () => {
      await expect(productCartPage.productIdText(PRODUCT_ID), `Product ID ${PRODUCT_ID} should remain visible after selection`).toBeVisible();
      await expect(productCartPage.addToCartButton(), 'Add-to-cart control should be enabled for the selected product').toBeEnabled();
    });
  });
});
