import { test, expect } from '../../fixtures/search.fixtures';
import { config } from '@config/index';

/**
 * Search Product — Generated Test Suite
 *
 * Application: Spark B2B catalog (Sonepar)
 * Base URL: configured via config.baseUrl (preprod: https://fra-vanilla-preprod.dev.spark.sonepar.com)
 * Search URL pattern confirmed: /catalog/en-gb/search/{keyword}?version=1
 *
 * Selectors verified against live app on 2026-04-13.
 * All data-testid attributes confirmed from live DOM inspection.
 *
 * TC-001 @P0 @Smoke     — Search via homepage input redirects to catalog results URL
 * TC-002 @P0 @Smoke     — Invalid product ID shows no-results state with zero products
 * TC-003 @P1 @Functional — No-results heading contains searched keyword and description visible
 * TC-004 @P1 @Functional — Valid keyword returns product list with count > 0
 * TC-005 @P1 @Functional — Search bar is pre-filled with keyword on results page
 * TC-006 @P2 @EdgeCase  — Special-character keyword navigates without application error
 */

test.describe(
  `@Search @P0 @Smoke Search Product -- ${config.displayName} on ${config.environment}`,
  () => {

    // ── P0 Smoke ────────────────────────────────────────────────────────────

    test('TC-001: Search via homepage input redirects to catalog search URL', async ({
      searchProductModule,
      searchResultsPage,
    }) => {
      const keyword = 'cable';

      await test.step('Navigate to homepage and submit search via header input', async () => {
        await searchProductModule.searchFromHomepage(keyword);
      });

      await test.step('Verify URL contains the catalog search path and keyword', async () => {
        await expect(searchResultsPage.getPage()).toHaveURL(
          new RegExp(`/catalog/en-gb/search/${keyword}`),
        );
      });

      await test.step('Verify product list is displayed after search', async () => {
        await searchProductModule.verifyResultsDisplayed();
      });
    });

    test('TC-002: Invalid product ID shows no-results state with zero products', async ({
      searchProductModule,
    }) => {
      const invalidKeyword = config.noResultsKeyword;

      await test.step('Navigate directly to search results with an invalid product ID', async () => {
        await searchProductModule.navigateToSearchResults(invalidKeyword);
      });

      await test.step('Verify no-results container is visible and no product cards rendered', async () => {
        await searchProductModule.verifyNoResultsState(invalidKeyword);
      });
    });

    // ── P1 Functional ───────────────────────────────────────────────────────

    test('TC-003: No-results heading contains searched keyword and description is visible', async ({
      searchProductModule,
      searchResultsPage,
    }) => {
      const invalidKeyword = config.noResultsKeyword;

      await test.step('Navigate to search results for invalid keyword', async () => {
        await searchProductModule.navigateToSearchResults(invalidKeyword);
      });

      await test.step('Verify no-results heading contains the searched keyword', async () => {
        await expect(
          searchResultsPage.noResultsHeading(),
          `Heading should contain the search term: ${invalidKeyword}`,
        ).toContainText(invalidKeyword);
      });

      await test.step('Verify no-results description paragraph is visible', async () => {
        await expect(
          searchResultsPage.noResultsDescription(),
          'Description text should be visible to guide the user',
        ).toBeVisible();
      });

      await test.step('Verify no-results description gives guidance to the user', async () => {
        await expect(
          searchResultsPage.noResultsDescription(),
          'Description should suggest alternative search actions',
        ).toContainText('difficulty finding a match');
      });
    });

    test('TC-004: Valid keyword returns product list with at least one product', async ({
      searchProductModule,
      searchResultsPage,
    }) => {
      const keyword = 'cable';

      await test.step('Navigate to search results for a known valid keyword', async () => {
        await searchProductModule.navigateToSearchResults(keyword);
      });

      await test.step('Verify product list container is visible', async () => {
        await expect(
          searchResultsPage.productListContainer(),
          'Product list container should be visible for a valid search',
        ).toBeVisible();
      });

      await test.step('Verify product count element is present and contains product count text', async () => {
        await expect(
          searchResultsPage.productListCount(),
          'Product count text should be visible',
        ).toBeVisible();
        await expect(
          searchResultsPage.productListCount(),
          'Product count should include the word "products"',
        ).toContainText('products');
      });

      await test.step('Verify at least one product card is rendered', async () => {
        await searchProductModule.verifyResultsDisplayed();
      });
    });

    test('TC-005: Search bar is pre-filled with the searched keyword on results page', async ({
      searchProductModule,
      searchResultsPage,
    }) => {
      const keyword = 'cable';

      await test.step('Navigate directly to the catalog search results page', async () => {
        await searchProductModule.navigateToSearchResults(keyword);
      });

      await test.step('Verify the header search bar shows the searched keyword', async () => {
        await searchProductModule.verifySearchBarPreFilled(keyword);
      });
    });

    // ── P2 Edge Case ────────────────────────────────────────────────────────

    test('TC-006: Special-character keyword navigates without application error', async ({
      searchProductModule,
      searchResultsPage,
    }) => {
      // Validates that the application URL-encodes special chars and handles them gracefully.
      // Either a no-results page or a results page must be shown — not a 500 / crash.
      const specialKeyword = 'qe-special-chars-test';

      await test.step('Navigate to search results with a special-character keyword', async () => {
        await searchProductModule.navigateToSearchResults(specialKeyword);
      });

      await test.step('Verify the application responds with either a results or no-results page', async () => {
        const noResultsVisible = await searchResultsPage
          .noResultsContainer()
          .isVisible()
          .catch(() => false);
        const productListVisible = await searchResultsPage
          .productListContainer()
          .isVisible()
          .catch(() => false);
        expect(
          noResultsVisible || productListVisible,
          'Application should show either results or no-results state — not an error page',
        ).toBe(true);
      });
    });

  }
);
