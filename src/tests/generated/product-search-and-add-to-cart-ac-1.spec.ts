import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '170720241509';

test.describe(`@P0 @P1 @P2 @Search @ProductSearch Product Search — ${config.displayName} on ${config.environment}`, () => {
  test('@P0 @Smoke @Search TC-001: Submit product ID search displays matching product result', async ({
    searchModule,
    searchResultsPage,
  }) => {
    await test.step('Submit the target product ID from the header search', async () => {
      await searchModule.submitSearch(PRODUCT_ID);
    });

    await test.step('Verify the matching product result is shown', async () => {
      await searchModule.verifySearchResultsPage(PRODUCT_ID);
      await expect(
        searchResultsPage.error404Container(),
        'Search results should not render the 404 error container',
      ).not.toBeVisible();
    });
  });

  test('@P1 @Functional @Search TC-002: Verify product search result displays product count and target product ID', async ({
    searchModule,
    searchResultsPage,
  }) => {
    await test.step('Navigate directly to search results for the target product ID', async () => {
      await searchModule.navigateToSearchResults(PRODUCT_ID);
    });

    await test.step('Verify product count summary and target product card are visible', async () => {
      await expect(
        searchResultsPage.productCountSummary(),
        'Product count summary should be visible for a successful product search',
      ).toBeVisible();
      await expect(
        searchResultsPage.productCard(PRODUCT_ID),
        `Product card containing ${PRODUCT_ID} should be visible`,
      ).toBeVisible();
      await expect(
        searchResultsPage.productIdText(PRODUCT_ID),
        `Product ID ${PRODUCT_ID} should be visible in the result content`,
      ).toBeVisible();
      await expect(
        searchResultsPage.error404Container(),
        'Search results should not render the 404 error container',
      ).not.toBeVisible();
    });
  });

  test('@P1 @Regression @Search TC-003: Search unknown keyword shows no-results state without product cards', async ({
    searchModule,
    searchResultsPage,
  }) => {
    await test.step('Navigate to search results with the configured no-results keyword', async () => {
      await searchModule.navigateToSearchResults(config.noResultsKeyword);
    });

    await test.step('Verify no-results state is displayed without a 404 page', async () => {
      await searchModule.verifyNoResultsDisplayed();
      await expect(
        searchResultsPage.error404Container(),
        'No-results searches should render an empty state instead of a 404 error container',
      ).not.toBeVisible();
    });
  });

  test('@P2 @Negative @Search TC-004: Submit empty search input blocks navigation and shows validation or remains on current page', async ({
    page,
    headerSearchPage,
    searchResultsPage,
  }) => {
    await test.step('Open the header search dialog with an empty query', async () => {
      await headerSearchPage.navigate('/');
      await headerSearchPage.waitForPageLoad();
      await headerSearchPage.dismissCookieBannerIfPresent();
      await headerSearchPage.fillSearchInput('');
    });

    await test.step('Attempt to submit the empty search query', async () => {
      await headerSearchPage.clickSubmitButton();
    });

    await test.step('Verify empty search submission is blocked without showing a 404 page', async () => {
      await expect(
        page,
        'Empty search should not navigate to an empty search results route',
      ).not.toHaveURL(/\/search\/?(?:\?q=)?(?:#.*)?$/);
      await expect(
        searchResultsPage.error404Container(),
        'Empty search should not render the 404 error container',
      ).not.toBeVisible();
    });
  });

  test('@P2 @Functional @Search TC-005: Search submission prevents duplicate submissions while results load', async ({
    page,
    headerSearchPage,
    searchModule,
    searchResultsPage,
  }) => {
    const searchRoutePattern = `**/search/${PRODUCT_ID}**`;
    let searchNavigationRequests = 0;
    let releaseSearchResponse: () => void = () => undefined;
    const searchResponseGate = new Promise<void>((resolve) => {
      releaseSearchResponse = resolve;
    });

    await test.step('Delay search results navigation for the target product ID', async () => {
      await page.route(searchRoutePattern, async (route) => {
        if (route.request().resourceType() === 'document') {
          searchNavigationRequests += 1;
          await searchResponseGate;
        }

        await route.continue();
      });
    });

    await test.step('Submit the target product ID search while the results request is delayed', async () => {
      await headerSearchPage.navigate('/');
      await headerSearchPage.waitForPageLoad();
      await headerSearchPage.dismissCookieBannerIfPresent();
      await headerSearchPage.fillSearchInput(PRODUCT_ID);
      await headerSearchPage.clickSubmitButton();
    });

    await test.step('Attempt a duplicate submission while results are still loading', async () => {
      await page.keyboard.press('Enter');
    });

    await test.step('Release the delayed results response and verify the final product result', async () => {
      releaseSearchResponse();
      await searchModule.verifySearchResultsPage(PRODUCT_ID);
      await expect(
        searchResultsPage.error404Container(),
        'Final search result should not render the 404 error container',
      ).not.toBeVisible();
    });

    await test.step('Verify duplicate search navigation was prevented', async () => {
      expect(
        searchNavigationRequests,
        'Only one document navigation should be issued for a single in-flight product search',
      ).toBeLessThanOrEqual(1);
      await page.unroute(searchRoutePattern);
    });
  });
});
