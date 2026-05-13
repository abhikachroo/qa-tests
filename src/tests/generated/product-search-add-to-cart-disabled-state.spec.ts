import { test, expect } from '@fixtures';
import { config } from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';

const productId = '6968173';
const expectedResultTitleFragment = 'Schuifladekast,mobiel';
const expectedDetailTitleFragment = 'LISTA - Schuifladekast,mobiel';
const expectedQuantity = '1';
const productDetailSlug = 'lista-schuifladekast-mobiel-27x27e-bxdxh-564x572x723mm-5-lades-ral7035-grijs-6968173';

test.describe(`@ProductSearchAddToCartDisabled Product Search Add-to-Cart Disabled State — ${config.displayName} on ${config.environment}`, () => {
  test('@P0 @Smoke TC-001: Complete anonymous search for 6968173 shows disabled Add to cart', async ({
    page,
    searchModule,
  }) => {
    await test.step('Search for the configured product ID as an anonymous user', async () => {
      await searchModule.submitSearch(productId);
    });

    await test.step('Verify the matching product result is displayed', async () => {
      await expect(page).toHaveURL(new RegExp(`/catalog/en-gb/search/${productId}`));
      await searchModule.verifyProductResultIdentity(productId, expectedResultTitleFragment);
    });

    await test.step('Verify Add to cart is disabled for the matching product result', async () => {
      await searchModule.verifySearchResultPurchaseControlsDisabled(productId, expectedQuantity);
    });
  });

  test('@P1 @Functional TC-002: Load anonymous landing page exposes search entry point without authentication', async ({
    headerSearchPage,
  }) => {
    await test.step('Navigate to the anonymous landing page', async () => {
      await headerSearchPage.navigate('/');
      await headerSearchPage.waitForPageLoad();
      await headerSearchPage.dismissCookieBannerIfPresent();
    });

    await test.step('Verify anonymous header search and account actions are visible', async () => {
      await expect(headerSearchPage.searchInput()).toBeVisible();
      await expect(headerSearchPage.loginLink()).toBeVisible();
      await expect(headerSearchPage.signUpLink()).toBeVisible();
    });

    await test.step('Verify Submit search is disabled before text entry', async () => {
      await expect(headerSearchPage.submitButton()).toBeDisabled();
    });
  });

  test('@P1 @Functional TC-003: Submit product ID 6968173 from header navigates to matching results', async ({
    page,
    headerSearchPage,
    searchModule,
  }) => {
    await test.step('Navigate to the landing page and enter the product ID', async () => {
      await headerSearchPage.navigate('/');
      await headerSearchPage.waitForPageLoad();
      await headerSearchPage.dismissCookieBannerIfPresent();
      await headerSearchPage.fillSearchInput(productId);
    });

    await test.step('Verify Submit search becomes enabled and submit the search', async () => {
      await expect(headerSearchPage.submitButton()).toBeEnabled();
      await headerSearchPage.clickSubmitButton();
      await headerSearchPage.waitForSearchNavigation(productId);
    });

    await test.step('Verify the results route and result heading reference the product ID', async () => {
      await expect(page).toHaveURL(new RegExp(`/catalog/en-gb/search/${productId}`));
      await searchModule.verifySearchResultsPage(productId);
    });
  });

  test('@P1 @Functional TC-004: Inspect search result for 6968173 shows product identity and purchase area', async ({
    searchModule,
    searchResultsPage,
  }) => {
    await test.step('Navigate directly to catalog search results for the product ID', async () => {
      await searchModule.navigateToCatalogSearch(productId);
    });

    await test.step('Verify product identity and result summary are visible', async () => {
      await searchModule.verifyProductResultIdentity(productId, expectedResultTitleFragment);
    });

    await test.step('Verify the purchase area and price state are present near the result', async () => {
      await expect(searchResultsPage.addToCartButton(productId)).toBeVisible();
      await expect(searchResultsPage.quantityInput(productId)).toBeVisible();
      await expect(searchResultsPage.priceError(productId)).toBeVisible();
    });
  });

  test('@P1 @Negative TC-005: Verify Add to cart and quantity controls are disabled in search results', async ({
    searchModule,
  }) => {
    await test.step('Navigate directly to catalog search results for the product ID', async () => {
      await searchModule.navigateToCatalogSearch(productId);
    });

    await test.step('Verify result page purchase controls are disabled', async () => {
      await searchModule.verifySearchResultPurchaseControlsDisabled(productId, expectedQuantity);
    });
  });

  test('@P1 @Functional TC-006: Open product detail for 6968173 shows disabled Add to cart in buybox', async ({
    page,
    searchModule,
  }) => {
    await test.step('Navigate to the search result and open the product detail page', async () => {
      await searchModule.navigateToCatalogSearch(productId);
      await searchModule.openProductDetailFromResults(productId);
    });

    await test.step('Verify product detail route and disabled buybox state', async () => {
      await expect(page).toHaveURL(new RegExp(`/catalog/en-gb/products/.*${productId}`));
      await searchModule.verifyProductDetailDisabledState(productId, expectedDetailTitleFragment, expectedQuantity);
    });
  });

  test('@P1 @Negative TC-007: Attempt to activate disabled Add to cart does not change anonymous cart state', async ({
    page,
    headerSearchPage,
    productDetailPage,
    searchModule,
  }) => {
    await test.step('Navigate directly to the product detail page and record cart state', async () => {
      await searchModule.navigateToProductDetail(productDetailSlug);
      await expect(headerSearchPage.cartButton()).toContainText('0');
    });

    await test.step('Verify Add to cart cannot be activated', async () => {
      await searchModule.verifyProductDetailDisabledState(productId, expectedDetailTitleFragment, expectedQuantity);
      await expect(productDetailPage.addToCartButton()).toBeDisabled();
    });

    await test.step('Verify anonymous cart state and route remain unchanged', async () => {
      await expect(headerSearchPage.cartButton()).toContainText('0');
      await expect(page).toHaveURL(new RegExp(`/catalog/en-gb/products/.*${productId}`));
    });
  });

  test('@P2 @Negative TC-008: Submit empty search remains blocked by disabled Submit search', async ({
    page,
    headerSearchPage,
  }) => {
    await test.step('Navigate to the landing page with an empty search input', async () => {
      await headerSearchPage.navigate('/');
      await headerSearchPage.waitForPageLoad();
      await headerSearchPage.dismissCookieBannerIfPresent();
      await headerSearchPage.clearSearchInput();
    });

    await test.step('Verify empty search cannot be submitted', async () => {
      await expect(headerSearchPage.submitButton()).toBeDisabled();
      await headerSearchPage.pressEnterInSearchInput();
    });

    await test.step('Verify the user remains outside the search results route', async () => {
      await expect(page).not.toHaveURL(/\/catalog\/en-gb\/search\/$/);
      await expect(headerSearchPage.searchInput()).toBeVisible();
    });
  });

  test('@P2 @Regression TC-009: Search unknown keyword shows established no-results state', async ({
    headerSearchPage,
    searchModule,
  }) => {
    const unknownKeyword = config.noResultsKeyword || `no-results-qa-${DataGenerator.randomString(8)}`;

    await test.step('Navigate to search results with an unknown keyword', async () => {
      await searchModule.navigateToSearchResults(unknownKeyword);
    });

    await test.step('Verify no-results state is displayed', async () => {
      await searchModule.verifyNoResultsDisplayed();
    });

    await test.step('Verify header search remains available for recovery', async () => {
      await expect(headerSearchPage.searchInput()).toBeVisible();
    });
  });

  test('@P2 @Functional TC-010: Search request shows transition before results render', async ({
    page,
    searchModule,
  }) => {
    await test.step('Submit the product search through the header search input', async () => {
      await searchModule.submitSearchWithEnter(productId);
    });

    await test.step('Verify navigation completes on the product search route', async () => {
      await expect(page).toHaveURL(new RegExp(`/catalog/en-gb/search/${productId}`));
    });

    await test.step('Verify final product results render successfully', async () => {
      await searchModule.verifyProductResultIdentity(productId, expectedResultTitleFragment);
    });
  });
});
