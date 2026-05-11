import { test, expect } from '@fixtures';
import { config }       from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';

const PRODUCT_ID = '6968173';
const EXPECTED_PRODUCT_COUNT_TEXT = '1 product';
const EXPECTED_CART_COUNT = '0';
const EXPECTED_PRICE_ERROR = 'Unable to display price';

test.describe(`@P0 @Smoke @Search @ProductSearchAddToCartDisabled Product Search Add to Cart Disabled — ${config.displayName} on ${config.environment}`, () => {
  test('@P0 @Smoke @Regression TC-001: Complete anonymous product search shows product 6968173 and disabled Add to Cart', async ({
    page,
    searchModule,
    searchResultsPage,
  }) => {
    await test.step('Submit the product ID search from the anonymous homepage', async () => {
      await searchModule.submitSearch(PRODUCT_ID);
    });

    await test.step('Verify the search results page and matching product identity are displayed', async () => {
      await expect(page).toHaveURL(/\/catalog\/en-gb\/search\/6968173/);
      await expect(searchResultsPage.productCountSummary()).toContainText(EXPECTED_PRODUCT_COUNT_TEXT);
      await expect(searchResultsPage.productCard(PRODUCT_ID)).toBeVisible();
      await expect(searchResultsPage.productIdControl(PRODUCT_ID)).toBeVisible();
      await expect(searchResultsPage.productTitleLink(PRODUCT_ID)).toContainText(/LISTA - Schuifladekast/i);
    });

    await test.step('Verify Add to Cart is disabled and the cart count remains unchanged', async () => {
      await expect(searchResultsPage.addToCartButton(PRODUCT_ID)).toBeVisible();
      await expect(searchResultsPage.addToCartButton(PRODUCT_ID)).toBeDisabled();
      await expect(searchResultsPage.cartButton()).toContainText(EXPECTED_CART_COUNT);
    });
  });

  test('@P1 @Regression TC-003: Verify search results show matching product 6968173 with product count', async ({
    page,
    searchModule,
    searchResultsPage,
  }) => {
    await test.step('Navigate to search results for product 6968173', async () => {
      await searchModule.submitSearch(PRODUCT_ID);
    });

    await test.step('Verify result count, product card, product ID, and product title are visible', async () => {
      await expect(page).toHaveURL(/\/catalog\/en-gb\/search\/6968173/);
      await expect(searchResultsPage.productCountSummary()).toContainText(EXPECTED_PRODUCT_COUNT_TEXT);
      await expect(searchResultsPage.productCard(PRODUCT_ID)).toBeVisible();
      await expect(searchResultsPage.productIdControl(PRODUCT_ID)).toBeVisible();
      await expect(searchResultsPage.productTitleLink(PRODUCT_ID)).toContainText(/LISTA - Schuifladekast/i);
    });
  });

  test('@P1 @Negative @Regression TC-004: Verify Add to Cart is disabled on product 6968173 search result card', async ({
    searchModule,
    searchResultsPage,
  }) => {
    await test.step('Navigate to the product search results page', async () => {
      await searchModule.submitSearch(PRODUCT_ID);
    });

    await test.step('Verify product purchase controls are present but disabled', async () => {
      await expect(searchResultsPage.productCard(PRODUCT_ID)).toBeVisible();
      await expect(searchResultsPage.quantityInput(PRODUCT_ID)).toHaveValue('1');
      await expect(searchResultsPage.decrementButton(PRODUCT_ID)).toBeDisabled();
      await expect(searchResultsPage.incrementButton(PRODUCT_ID)).toBeDisabled();
      await expect(searchResultsPage.addToCartButton(PRODUCT_ID)).toBeDisabled();
    });

    await test.step('Verify price error is shown and cart count remains zero', async () => {
      await expect(searchResultsPage.priceError(PRODUCT_ID)).toContainText(EXPECTED_PRICE_ERROR);
      await expect(searchResultsPage.cartButton()).toContainText(EXPECTED_CART_COUNT);
    });
  });

  test('@P1 @Negative @Regression TC-005: Open product 6968173 detail page and verify Add to Cart remains disabled', async ({
    page,
    searchModule,
    searchResultsPage,
    productDetailPage,
  }) => {
    await test.step('Navigate to search results and open the product detail page', async () => {
      await searchModule.submitSearch(PRODUCT_ID);
      await searchResultsPage.clickProductTitle(PRODUCT_ID);
      await productDetailPage.waitForProductDetail(PRODUCT_ID);
    });

    await test.step('Verify product detail identity and price error message', async () => {
      await expect(page).toHaveURL(/\/catalog\/en-gb\/products\/.*6968173/);
      await expect(productDetailPage.productTitleHeading()).toBeVisible();
      await expect(productDetailPage.productId()).toContainText(PRODUCT_ID);
      await expect(productDetailPage.priceError(PRODUCT_ID)).toContainText(EXPECTED_PRICE_ERROR);
    });

    await test.step('Verify detail page Add to Cart remains disabled', async () => {
      await expect(productDetailPage.quantityInput()).toHaveValue('1');
      await expect(productDetailPage.addToCartButton()).toBeVisible();
      await expect(productDetailPage.addToCartButton()).toBeDisabled();
    });
  });

  test('@P2 @Negative @Regression TC-006: Submit empty header search keeps search submission disabled', async ({
    page,
    headerSearchPage,
  }) => {
    await test.step('Navigate to the anonymous homepage with a fresh empty search field', async () => {
      await headerSearchPage.navigate('/');
      await headerSearchPage.waitForPageLoad();
      await headerSearchPage.dismissCookieBannerIfPresent();
      await headerSearchPage.searchInput().fill('');
    });

    await test.step('Verify submit search is disabled while the input is empty', async () => {
      await expect(headerSearchPage.searchInput()).toHaveValue('');
      await expect(headerSearchPage.submitButton()).toBeDisabled();
    });

    await test.step('Verify the user remains on the homepage and no search results route is loaded', async () => {
      await expect(page).not.toHaveURL(/\/catalog\/en-gb\/search\//);
    });
  });

  test('@P2 @Regression TC-007: Search unknown keyword displays no-results state without product cards', async ({
    searchModule,
  }) => {
    const unknownKeyword = `${config.noResultsKeyword}-${DataGenerator.randomString(6)}`;

    await test.step('Navigate to search results with an unknown generated keyword', async () => {
      await searchModule.navigateToSearchResults(unknownKeyword);
    });

    await test.step('Verify no-results message is displayed and no product cards are shown', async () => {
      await searchModule.verifyNoResultsDisplayed();
    });
  });
});
