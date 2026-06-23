import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '170720241509';

test.describe(`@ProductSearch @AddToCart Product Search and Add to Cart — ${config.displayName} on ${config.environment}`, () => {
  test('@P0 @Smoke @ProductSearch TC-001: Search for product 170720241509 and verify it is identifiable in results', async ({
    productCartModule,
    searchResultsPage,
    page,
  }) => {
    await test.step('Search for the configured product from the header', async () => {
      await productCartModule.searchAndVerifyProduct(PRODUCT_ID);
    });

    await test.step('Verify the matching product is uniquely identifiable in results', async () => {
      await expect(page, 'Search should not render a Page not found title').not.toHaveTitle(/page not found/i);
      await expect(
        searchResultsPage.productIdText(PRODUCT_ID),
        `Product ID ${PRODUCT_ID} should be visible in search results`,
      ).toBeVisible();
      await productCartModule.verifyProductCardIsVisible(PRODUCT_ID);
    });
  });

  test('@P1 @Functional @ProductSearch TC-002: Submit product search from header and land on a valid search-result route', async ({
    searchModule,
    searchResultsPage,
    page,
  }) => {
    await test.step('Submit the product search from the header search input', async () => {
      await searchModule.submitSearch(PRODUCT_ID);
    });

    await test.step('Verify the search route and result content are valid', async () => {
      await expect(page, 'Search URL should include the configured search path and product ID').toHaveURL(
        new RegExp(`${config.searchPath}/${PRODUCT_ID}`),
      );
      await expect(page, 'Search flow should not land on a generic Page not found view').not.toHaveTitle(
        /page not found/i,
      );
      await searchModule.verifySearchResultsPage(PRODUCT_ID);
      await expect(
        searchResultsPage.productIdText(PRODUCT_ID),
        `Product ID ${PRODUCT_ID} should be visible after header search navigation`,
      ).toBeVisible();
    });
  });

  test('@P1 @Regression @Negative @ProductSearch TC-003: Search with an unknown product ID and verify no-results state', async ({
    searchModule,
    page,
  }) => {
    await test.step('Navigate to search results with the configured no-results keyword', async () => {
      await searchModule.navigateToSearchResults(config.noResultsKeyword);
    });

    await test.step('Verify the no-results state is displayed without a generic application error', async () => {
      await expect(page, 'No-results search should not render a Page not found title').not.toHaveTitle(/page not found/i);
      await searchModule.verifyNoResultsDisplayed();
    });
  });

  // Loading feedback selector/module support is not currently exposed by frameworkConventions or locatorMap.
  test.skip('@P2 @Functional @ProductSearch TC-004: Show loading feedback while product search is in progress', async () => {});
});
