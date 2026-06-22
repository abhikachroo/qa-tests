import { test, expect } from '@fixtures';
import { config } from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';

const PRODUCT_ID = '170720241509';
const RANDOM_KEYWORD_SUFFIX_LENGTH = 12;

test.describe(`@ProductSearchAddToCart Product search add-to-cart flow — ${config.displayName} on ${config.environment}`, () => {
  test('@P0 @Smoke @ProductSearchAddToCart TC-001: Search product ID 170720241509 returns matching result', async ({
    productSearchAddToCartModule,
  }) => {
    await test.step('Search for the configured product ID from the storefront header', async () => {
      await productSearchAddToCartModule.searchForProduct(PRODUCT_ID);
    });

    await test.step('Verify the matching product result is visible in the search results', async () => {
      await productSearchAddToCartModule.verifySearchResult(PRODUCT_ID);
    });
  });

  test('@P1 @Functional @ProductSearchAddToCart TC-002: Search product ID 170720241509 displays results count and product card', async ({
    searchModule,
    searchResultsPage,
  }) => {
    await test.step('Submit a storefront search for the configured product ID', async () => {
      await searchModule.submitSearch(PRODUCT_ID);
    });

    await test.step('Verify the search results summary and product ID are displayed', async () => {
      await searchModule.verifySearchResultsPage(PRODUCT_ID);
    });

    await test.step('Verify the matching product card is displayed', async () => {
      await expect(
        searchResultsPage.productCard(PRODUCT_ID),
        `Product card for product ID ${PRODUCT_ID} should be visible`,
      ).toBeVisible();
    });
  });

  test('@P1 @Regression @ProductSearchAddToCart TC-003: Search for unknown keyword shows no-results state without product cards', async ({
    searchModule,
  }) => {
    const unknownKeyword = `${config.noResultsKeyword}-${DataGenerator.randomString(RANDOM_KEYWORD_SUFFIX_LENGTH)}`;

    await test.step('Navigate to search results for a generated non-existent keyword', async () => {
      await searchModule.navigateToSearchResults(unknownKeyword);
    });

    await test.step('Verify the no-results message is displayed and product cards are absent', async () => {
      await searchModule.verifyNoResultsDisplayed();
    });
  });
});
