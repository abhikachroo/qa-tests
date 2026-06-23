import { test, expect } from '@fixtures';
import { config } from '@config/index';

const productId = '170720241509';

test.describe(`@Search @ProductSearchAndAddToCart Product Search And Add To Cart — ${config.displayName} on ${config.environment}`, () => {
  test('@P0 @Smoke TC-001: Search for product ID via header displays expected product as smoke coverage', async ({
    searchModule,
  }) => {
    await test.step('Submit the product ID search from the header', async () => {
      await searchModule.submitSearch(productId);
    });

    await test.step('Verify the expected product appears in search results', async () => {
      await searchModule.verifySearchResultsPage(productId);
    });
  });

  test('@P1 @Functional TC-002: Submit valid product search through header redirects to search results', async ({
    searchModule,
  }) => {
    await test.step('Submit a valid product search through the header search dialog', async () => {
      await searchModule.submitSearch(productId);
    });

    await test.step('Verify the search results page contains the matching product', async () => {
      await searchModule.verifySearchResultsPage(productId);
    });
  });

  test('@P1 @Regression TC-004: Unknown keyword search shows no-results regression state', async ({
    searchModule,
  }) => {
    await test.step('Navigate to search results for a configured no-results keyword', async () => {
      await searchModule.navigateToSearchResults(config.noResultsKeyword);
    });

    await test.step('Verify the no-results message and empty product-card state', async () => {
      await searchModule.verifyNoResultsDisplayed();
    });
  });

  test('@P2 @Negative TC-003: Submit empty search does not navigate to invalid results', async ({
    page,
    headerSearchPage,
  }) => {
    await test.step('Open the header search dialog without entering a search term', async () => {
      await headerSearchPage.navigate('/');
      await headerSearchPage.waitForPageLoad();
      await headerSearchPage.dismissCookieBannerIfPresent();
      await headerSearchPage.searchInput().click();
    });

    await test.step('Attempt to submit the empty search term', async () => {
      await headerSearchPage.dialogSearchInput().press('Enter');
    });

    await test.step('Verify empty search is blocked and the search dialog remains available', async () => {
      await expect(
        page,
        'Empty search should not navigate to an invalid search results route',
      ).not.toHaveURL(/\/search\/?$/);
      await expect(
        headerSearchPage.dialogSearchInput(),
        'Search input should remain available so the user can enter a valid term',
      ).toBeVisible();
    });
  });
});
