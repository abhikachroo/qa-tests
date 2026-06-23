import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '170720241509';

test.describe(`@P1 @ProductSearch @AddToCart Product Search and Add to Cart — ${config.displayName} on ${config.environment}`, () => {
  test('@P1 @Functional TC-001: Search for product ID 170720241509 from the header displays the product result', async ({
    productCartModule,
  }) => {
    await test.step('Search for the configured product from the header', async () => {
      await productCartModule.searchForProduct(PRODUCT_ID);
    });

    await test.step('Verify the matching product result is displayed without a 404 error', async () => {
      await productCartModule.verifyProductSearchResult(PRODUCT_ID);
    });
  });

  test('@P1 @Regression TC-002: Direct navigation to the current product search route does not show a 404 page', async ({
    page,
    searchResultsPage,
  }) => {
    await test.step('Navigate directly to the product search route', async () => {
      await searchResultsPage.navigate(`${config.searchPath}/${PRODUCT_ID}`);
      await searchResultsPage.waitForPageLoad();
      await searchResultsPage.dismissCookieBannerIfPresent();
    });

    await test.step('Verify the search route resolves to a valid product result', async () => {
      await expect(page, 'Search route should include the requested product ID').toHaveURL(
        new RegExp(`${config.searchPath}/${PRODUCT_ID}`),
      );
      await expect(page, 'Search route should not render a Page not found title').not.toHaveTitle(/page not found/i);
      await expect(searchResultsPage.error404Container(), '404 container should not be visible').not.toBeVisible();
      await expect(searchResultsPage.error404Text(), 'Error 404 text should not be visible').not.toBeVisible();
      await expect(
        searchResultsPage.productIdText(PRODUCT_ID),
        `Product ID ${PRODUCT_ID} should appear on the resolved search page`,
      ).toBeVisible();
    });
  });

  test('@P1 @Negative TC-003: Unknown product search displays a no-results state without product cards', async ({
    searchModule,
  }) => {
    await test.step('Navigate to search results with the configured no-results keyword', async () => {
      await searchModule.navigateToSearchResults(config.noResultsKeyword);
    });

    await test.step('Verify the no-results message is displayed and product cards are absent', async () => {
      await searchModule.verifyNoResultsDisplayed();
    });
  });
});
