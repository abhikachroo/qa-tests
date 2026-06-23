import { test, expect } from '@fixtures';
import { config } from '@config/index';

const knownProductId = '170720241509';

test.describe(`@ProductSearch @Cart @Regression Product search add-to-cart cart access — ${config.displayName} on ${config.environment}`, () => {
  test('@P0 @Smoke @ProductSearch @Cart TC-005: Open cart after adding product and verify product ID is present', async ({
    searchModule,
    searchResultsPage,
    cartModule,
  }) => {
    await test.step('Search for the known product ID from the header', async () => {
      await searchModule.submitSearch(knownProductId);
    });

    await test.step('Verify the matching product is available for cart addition', async () => {
      await searchModule.verifySearchResultsPage(knownProductId);
      await expect(
        searchResultsPage.errorPageContainer(),
        'Known product search should not render the 404 error page before add-to-cart',
      ).not.toBeVisible();
    });

    await test.step('Add the matching search result to the cart', async () => {
      await cartModule.addSearchResultToCart(knownProductId);
      await cartModule.verifyAddToCartSucceeded();
    });

    await test.step('Open the cart and verify the selected product ID is present', async () => {
      await cartModule.openCart();
      await cartModule.verifyProductInCart(knownProductId);
    });
  });

  test('@P1 @Negative @Cart TC-009: Access cart without required session and show appropriate authorization or empty-session state', async ({
    cartModule,
    cartPage,
  }) => {
    await test.step('Navigate to a clean storefront page without adding products', async () => {
      await cartPage.navigate('/');
      await cartPage.waitForPageLoad();
    });

    await test.step('Open the cart with no authenticated or populated session state', async () => {
      await cartModule.openCart();
    });

    await test.step('Verify the cart shows a session-safe empty or authorization state', async () => {
      await cartModule.verifyCartAccessRequiresSession();
      await expect(
        cartPage.errorPageContainer(),
        'Unauthenticated or empty-session cart access should show a safe state instead of the 404 error page',
      ).not.toBeVisible();
    });
  });

  test('@P1 @Regression @ProductSearch TC-010: Preserve existing no-results behavior for unknown search keywords', async ({
    searchModule,
    searchResultsPage,
  }) => {
    await test.step('Navigate to search results for the configured no-results keyword', async () => {
      await searchModule.navigateToSearchResults(config.noResultsKeyword);
    });

    await test.step('Verify the no-results state is preserved without an error page', async () => {
      await searchModule.verifyNoResultsDisplayed();
      await expect(
        searchResultsPage.errorPageContainer(),
        'Unknown search keyword should preserve no-results behavior instead of rendering the 404 error page',
      ).not.toBeVisible();
    });
  });
});
