import { test, expect } from '@fixtures';
import { config } from '@config/index';

const productId = '170720241509';

test.describe(`@P1 @Cart @ProductSearchAndAddToCart Cart Access — ${config.displayName} on ${config.environment}`, () => {
  test('@P1 @Functional @ProductSearchAndAddToCart TC-004: Open cart after adding product displays product ID', async ({
    cartModule,
    cartPage,
  }) => {
    await test.step('Search for the product and add it to the cart', async () => {
      await cartModule.searchAndAddProductToCart(productId);
    });

    await test.step('Open the cart from the available UI cart entry point', async () => {
      await cartModule.openCartFromUi();
    });

    await test.step('Verify the cart contents area displays the added product', async () => {
      await expect(
        cartPage.cartContents(),
        'Cart contents container should be visible after opening the cart from UI',
      ).toBeVisible();
      await cartModule.verifyCartContainsProduct(productId);
    });
  });

  test('@P1 @Negative @ProductSearchAndAddToCart TC-008: Open cart before adding product shows empty or controlled non-product state', async ({
    cartModule,
  }) => {
    await test.step('Navigate directly to the cart route before adding a product', async () => {
      await cartModule.navigateDirectlyToCartRoute();
    });

    await test.step('Verify the selected product is not present in the pre-add cart state', async () => {
      await cartModule.verifyDirectCartRouteErrorState();
    });
  });
});
