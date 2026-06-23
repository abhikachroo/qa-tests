import { test, expect } from '@fixtures';
import { config } from '@config/index';

const productId = '170720241509';

test.describe(`@Cart @ProductSearchAndAddToCart Cart Access — ${config.displayName} on ${config.environment}`, () => {
  test('@P1 @Functional TC-007: Open cart after add-to-cart displays cart contents', async ({
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

  test('@P2 @Negative TC-008: Direct unavailable cart route shows controlled error instead of broken state', async ({
    cartModule,
    cartPage,
  }) => {
    await test.step('Navigate directly to the unavailable cart route', async () => {
      await cartModule.navigateDirectlyToCartRoute();
    });

    await test.step('Verify the controlled error state and recovery search are visible', async () => {
      await cartModule.verifyDirectCartRouteErrorState();
    });

    await test.step('Recover from the error state using the route shell search input', async () => {
      await cartPage.routeShellSearchInput().fill(productId);
      await cartPage.routeShellSearchInput().press('Enter');
      await expect(
        cartPage.error404Container(),
        'Submitting a valid search from the error shell should navigate away from the 404 state',
      ).not.toBeVisible();
    });
  });
});
