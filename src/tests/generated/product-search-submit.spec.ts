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

  /**
   * TC-001: Add to Cart button is disabled for an unauthenticated guest user
   * AC Reference: AC-GUEST-CART-001
   * Priority:     P0 Smoke
   * Type:         Functional
   * Surface:      SRP (Search Results Page)
   *
   * Precondition: No active session — user is browsing as a guest (unauthenticated)
   *
   * Flow:
   *   1. Navigate to homepage as a guest
   *   2. Submit a search for product ID 6968173 via the header search bar
   *   3. Wait for the search results page to load ("1 product" summary confirms render)
   *   4. Assert that the Add to Cart button (data-testid="quantity-counter-cta-add")
   *      carries a native HTML `disabled` attribute
   *
   * Assertion: expect(addToCartBtn).toBeDisabled()
   * Note: Confirmed via live accessibility snapshot — native `disabled` attr present,
   *       NOT aria-disabled — so toBeDisabled() is the correct Playwright assertion.
   */
  test('TC-001: Add to Cart button is disabled for unauthenticated guest user', async ({
    searchModule,
    searchResultsPage,
  }) => {
    const productId = '6968173';

    await test.step(`Navigate to the search results page for product ID ${productId} as a guest`, async () => {
      await searchModule.submitSearch(productId);
    });

    await test.step('Wait for search results to render (product count summary visible)', async () => {
      await expect(
        searchResultsPage.productCountSummary(),
        'Product count summary must be visible before asserting button state',
      ).toBeVisible();
    });

    await test.step('Verify Add to Cart button is disabled for the guest user', async () => {
      await searchModule.verifyAddToCartDisabled();
    });
  });

});
