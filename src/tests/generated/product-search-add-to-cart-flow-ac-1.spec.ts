import { test, expect } from '@fixtures';
import { config } from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';

const knownProductId = '170720241509';

test.describe(`@ProductSearch @Regression Product search add-to-cart flow — ${config.displayName} on ${config.environment}`, () => {
  test('@P1 @Functional @ProductSearch TC-001: Search for product ID from header and display matching search result', async ({
    searchModule,
    searchResultsPage,
  }) => {
    await test.step('Submit the product ID search from the header', async () => {
      await searchModule.submitSearch(knownProductId);
    });

    await test.step('Verify the matching product is displayed in search results', async () => {
      await searchModule.verifySearchResultsPage(knownProductId);
      await expect(
        searchResultsPage.errorPageContainer(),
        'Search results should not render the 404 error page for a known product ID',
      ).not.toBeVisible();
    });
  });

  test('@P1 @Functional @ProductSearch TC-002: Search for product ID via direct results URL and show matching product card', async ({
    searchModule,
    searchResultsPage,
  }) => {
    await test.step('Navigate directly to search results for the product ID', async () => {
      await searchModule.navigateToSearchResults(knownProductId);
    });

    await test.step('Verify the product card is visible and the 404 state is absent', async () => {
      await expect(
        searchResultsPage.productCard(knownProductId),
        `Product card for ${knownProductId} should be visible on the direct search results route`,
      ).toBeVisible();
      await expect(
        searchResultsPage.errorPageContainer(),
        'Direct search results route should not display the 404 error page',
      ).not.toBeVisible();
    });
  });

  test('@P1 @Negative @ProductSearch TC-006: Submit malformed product search and display validation or no-results feedback', async ({
    searchModule,
    searchResultsPage,
  }) => {
    const invalidSearchTerm = `bad-product-id-${DataGenerator.randomString(6)}-@@@`;

    await test.step('Submit a malformed product search term from the header', async () => {
      await searchModule.submitSearch(invalidSearchTerm);
    });

    await test.step('Verify malformed search shows safe feedback instead of an error page', async () => {
      await searchModule.verifyNoResultsDisplayed();
      await expect(
        searchResultsPage.errorPageContainer(),
        'Malformed search should show validation or no-results feedback, not the 404 error page',
      ).not.toBeVisible();
    });
  });

  test('@P2 @Negative @ProductSearch TC-007: Search unavailable product ID and display no-results state without add-to-cart action', async ({
    searchModule,
    searchResultsPage,
  }) => {
    await test.step('Navigate to search results for an unavailable product ID', async () => {
      await searchModule.navigateToSearchResults(config.noResultsKeyword);
    });

    await test.step('Verify no-results feedback is displayed without an error page', async () => {
      await searchModule.verifyNoResultsDisplayed();
      await expect(
        searchResultsPage.errorPageContainer(),
        'Unavailable product search should show no-results feedback, not the 404 error page',
      ).not.toBeVisible();
    });
  });
});
