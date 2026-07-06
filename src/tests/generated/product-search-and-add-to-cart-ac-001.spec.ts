import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '170720241509';

test.describe(`@P1 @ProductSearchAndAddToCart Search product from header and no-results behavior -- ${config.displayName} on ${config.environment}`, () => {
  /**
   * TC-002: Search product ID from header displays matching product result
   * Verifies header search navigates to results and displays the searched product.
   */
  test('@P1 @Functional @ProductSearchAndAddToCart TC-002: should display matching product result when searching product ID from header', async ({
    page,
    searchModule,
    searchResultsPage,
    cartPage,
  }) => {
    await test.step('Navigate to the storefront home page', async () => {
      await page.goto('/');
    });

    await test.step('Search for the product ID from the header', async () => {
      await searchModule.submitSearch(PRODUCT_ID);
    });

    await test.step('Verify the search results page reflects the product search', async () => {
      await searchModule.verifySearchResultsPage(PRODUCT_ID);
    });

    await test.step('Verify the product count summary is visible', async () => {
      await expect(searchResultsPage.productCountSummary()).toBeVisible();
    });

    await test.step('Verify the searched product ID is visible in results', async () => {
      await expect(searchResultsPage.productIdText(PRODUCT_ID)).toBeVisible();
      await expect(searchResultsPage.productCard(PRODUCT_ID)).toBeVisible();
    });

    await test.step('Verify the page not found state is not displayed', async () => {
      await expect(cartPage.notFoundState()).not.toBeVisible();
    });
  });

  /**
   * TC-006: Search unknown product ID shows no-results state without product cards
   * Verifies configured no-results keyword renders an empty search state safely.
   */
  test('@P1 @Regression @ProductSearchAndAddToCart TC-006: should show no-results state without product cards for unknown product ID', async ({
    searchModule,
  }) => {
    await test.step('Navigate to search results with the configured unknown keyword', async () => {
      await searchModule.navigateToSearchResults(config.noResultsKeyword);
    });

    await test.step('Verify no-results message is displayed and no product cards are shown', async () => {
      await searchModule.verifyNoResultsDisplayed();
    });
  });
});
