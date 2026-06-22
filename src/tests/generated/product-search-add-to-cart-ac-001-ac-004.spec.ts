import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '170720241509';

test.describe(`@P0 @Smoke @ProductSearchAddToCart Product Search Add to Cart — ${config.displayName} on ${config.environment}`, () => {
  test('@P0 @Smoke @ProductSearchAddToCart TC-001: Complete product search add-to-cart and cart validation flow succeeds', async ({
    page,
    productCartModule,
    productCartPage,
  }) => {
    await test.step('Search for the configured product from the homepage', async () => {
      await productCartModule.searchForProduct(PRODUCT_ID);
      await expect(page).toHaveURL(new RegExp(`/catalog/en-gb/search/${PRODUCT_ID}`));
    });

    await test.step('Add the searched product to the cart from results', async () => {
      await productCartModule.addProductFromSearchResults(PRODUCT_ID);
    });

    await test.step('Verify add-to-cart feedback is displayed', async () => {
      await productCartModule.verifyAddToCartFeedback(PRODUCT_ID);
    });

    await test.step('Open the cart experience from the header cart button', async () => {
      await productCartModule.openCartFromHeader();
    });

    await test.step('Verify the supported cart or checkout experience is loaded', async () => {
      await productCartModule.verifyCartExperienceLoaded();
      await expect(page).not.toHaveURL(/\/cart(?:\/)?$/);
    });

    await test.step('Verify the selected product appears in the cart', async () => {
      await productCartModule.verifyProductPresentInCart(PRODUCT_ID);
      await expect(productCartPage.cartLineItemByProductId(PRODUCT_ID)).toBeVisible();
    });
  });
});
