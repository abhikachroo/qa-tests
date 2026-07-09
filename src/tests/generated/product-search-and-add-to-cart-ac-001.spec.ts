import { test, expect } from '@fixtures';
import { config } from '@config/index';

const productId = '170720241509';

test.describe(`@P0 @Search @ProductSearchAndAddToCart Product Search And Add To Cart — ${config.displayName} on ${config.environment}`, () => {
  test('@P0 @Smoke @ProductSearchAndAddToCart TC-001: Open preprod homepage exposes product search capability', async ({
    headerSearchPage,
  }) => {
    await test.step('Open the homepage and prepare the header search control', async () => {
      await headerSearchPage.navigate('/');
      await headerSearchPage.waitForPageLoad();
      await headerSearchPage.dismissCookieBannerIfPresent();
    });

    await test.step('Verify the header search input is visible and focusable', async () => {
      await expect(
        headerSearchPage.searchInput(),
        'Header search input should be visible on the homepage',
      ).toBeVisible();
      await headerSearchPage.searchInput().focus();
      await expect(
        headerSearchPage.searchInput(),
        'Header search input should receive focus',
      ).toBeFocused();
    });
  });

  test('@P1 @Functional @ProductSearchAndAddToCart TC-002: Search by product ID returns matching product result', async ({
    page,
    searchModule,
  }) => {
    await test.step('Submit a valid product search through the header search dialog', async () => {
      await searchModule.submitSearch(productId);
    });

    await test.step('Verify the search results page contains the matching product', async () => {
      await expect(
        page,
        'Product search should navigate to the product search route',
      ).toHaveURL(new RegExp(`/search/${productId}`));
      await searchModule.verifySearchResultsPage(productId);
    });
  });

  test('@P1 @Negative @ProductSearchAndAddToCart TC-005: Submit empty product search shows validation or prevents navigation', async ({
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

  test('@P1 @Regression @ProductSearchAndAddToCart TC-006: Search unknown product keyword shows no-results state with no product cards', async ({
    searchModule,
  }) => {
    await test.step('Navigate to search results for a configured no-results keyword', async () => {
      await searchModule.navigateToSearchResults(config.noResultsKeyword);
    });

    await test.step('Verify the no-results message and empty product-card state', async () => {
      await searchModule.verifyNoResultsDisplayed();
    });
  });
});
