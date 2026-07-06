import { test, expect } from '@fixtures';
import { config } from '@config/index';

const matchingProductId = '170720241509';

test.describe(`@ProductSearchAndAddToCart Navigate to cart after add — ${config.displayName} on ${config.environment}`, () => {
  test('@P1 @Functional @ProductSearchAndAddToCart TC-004: Navigate to cart after add loads the cart view', async ({
    searchModule,
    searchResultsPage,
    productCartModule,
    cartPage,
  }) => {
    await test.step('Search for the matching product from the header', async () => {
      await searchModule.submitSearch(matchingProductId);
      await searchModule.verifySearchResultsPage(matchingProductId);
    });

    await test.step('Verify the matching product can be added from search results', async () => {
      await expect(searchResultsPage.productCard(matchingProductId)).toBeVisible();
      await expect(searchResultsPage.addToCartButtonForProduct(matchingProductId)).toBeEnabled();
    });

    await test.step('Add the matching product from search results', async () => {
      await productCartModule.addProductFromSearchResults(matchingProductId);
    });

    await test.step('Verify the add-to-cart confirmation is displayed', async () => {
      await productCartModule.verifyAddToCartConfirmation();
      await expect(searchResultsPage.addToCartConfirmation()).toBeVisible();
    });

    await test.step('Open the cart from supported storefront navigation', async () => {
      await productCartModule.openCartFromSupportedNavigation();
    });

    await test.step('Verify the cart view loads successfully without page-not-found state', async () => {
      await productCartModule.verifyCartViewLoaded();
      await expect(cartPage.notFoundState()).not.toBeVisible();
    });
  });

  test('@P2 @Negative @ProductSearchAndAddToCart TC-008: Direct invalid cart route displays safe not-found state without breaking session', async ({
    searchModule,
    productCartModule,
    cartPage,
  }) => {
    await test.step('Navigate directly to the unsupported cart route', async () => {
      await productCartModule.navigateToDirectCartRoute();
    });

    await test.step('Verify the direct cart route is handled as a safe not-found state', async () => {
      await productCartModule.verifyDirectCartRouteSafeState();
      await expect(cartPage.notFoundState()).toBeVisible();
    });

    await test.step('Return to the storefront home page', async () => {
      await cartPage.navigate('/');
      await cartPage.dismissCookieBannerIfPresent();
    });

    await test.step('Verify storefront search is still usable after route recovery', async () => {
      await searchModule.submitSearch(matchingProductId);
      await searchModule.verifySearchResultsPage(matchingProductId);
    });

    await test.step('Verify the recovered storefront is not showing page-not-found state', async () => {
      await expect(cartPage.notFoundState()).not.toBeVisible();
    });
  });
});
