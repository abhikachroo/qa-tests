import { test, expect } from '@fixtures';
import { config }       from '@config/index';

test.describe(`@P0 @Smoke @Search Product Search — ${config.displayName} on ${config.environment}`, () => {

  /**
   * TC-002: Submit product search via Submit button and verify results page
   * AC Reference: AC-001
   * Priority:     P0 Smoke
   * Precondition: Guest user (no login required), homepage accessible
   *
   * Flow:
   *   1. Navigate to homepage
   *   2. Type product ID into header search bar (data-testid="search-bar-input")
   *   3. Click the "Submit search" button (disabled when empty — fill first)
   *   4. Wait for URL redirect to /catalog/en-gb/search/<productId>
   *   5. Verify product count summary is visible
   *   6. Verify product ID appears on the results page
   */
  test('TC-002: Submit product search via Submit button and verify results page', async ({
    page,
    searchModule,
  }) => {
    const productId = '6968173';

    await test.step(`Type "${productId}" into the header search bar and click Submit`, async () => {
      await searchModule.submitSearch(productId);
    });

    await test.step('Verify URL redirects to the search results page for the product ID', async () => {
      await expect(page).toHaveURL(/\/catalog\/en-gb\/search\/6968173/);
    });

    await test.step('Verify product count summary and product ID are displayed on results page', async () => {
      await searchModule.verifySearchResultsPage(productId);
    });
  });

});
