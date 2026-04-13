import { test } from '@fixtures';
import { config } from '@config/index';

test.describe(`@Search Product Search -- ${config.displayName} on ${config.environment}`, () => {
  /**
   * TC-SEARCH-05: No results state for an unknown keyword
   * Verifies the empty-state UI is shown correctly when no products match.
   */
  test('@P1 @Regression should show no-results message for an unknown keyword', async ({
    searchModule,
  }) => {
    await test.step('Navigate to search results with a non-existent keyword', async () => {
      await searchModule.navigateToSearchResults(config.noResultsKeyword);
    });

    await test.step('Verify no-results message is displayed and no product cards shown', async () => {
      await searchModule.verifyNoResultsDisplayed();
    });
  });
});
