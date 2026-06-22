import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '170720241509';

test.describe(`@P0 @Smoke @ProductSearch @AddToCart Product Search And Add To Cart — ${config.displayName} on ${config.environment}`, () => {
  test('@P0 @Smoke @ProductSearch @AddToCart TC-001: Complete product search and add-to-cart flow shows product ID in cart', async ({
    page,
    productCartModule,
  }) => {
    await test.step('Search for the configured product from the header search', async () => {
      await productCartModule.searchForProduct(PRODUCT_ID);
    });

    await test.step('Verify the matching product appears in search results', async () => {
      await expect(
        page,
        `Search navigation should include the searched product ID ${PRODUCT_ID}`,
      ).toHaveURL(new RegExp(`/search/${PRODUCT_ID}`));
      await productCartModule.verifyProductSearchResult(PRODUCT_ID);
    });

    await test.step('Add the matching product to the cart', async () => {
      await productCartModule.addProductToCart(PRODUCT_ID);
    });

    await test.step('Open the cart from the header cart control', async () => {
      await productCartModule.openCartFromHeader();
    });

    await test.step('Verify the product ID appears in the cart contents', async () => {
      await productCartModule.verifyProductIsInCart(PRODUCT_ID);
    });
  });
});
