import { test, expect } from '@fixtures';
import { config } from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';

const PRODUCT_ID = '6968173';
const EXPECTED_COUNT = '1 product';
const EXPECTED_TITLE = 'LISTA';

test.describe(`@ProductSearchAddToCart @Smoke @Regression Product Search Add To Cart Disabled State — ${config.displayName} on ${config.environment}`, () => {
  test('TC-003 @P0 @Smoke @ProductSearchAddToCart: Verify Add to Cart is disabled for unauthenticated user on search result', async ({
    productSearchAddToCartModule,
  }) => {
    await test.step('Open search results for the target product as an unauthenticated user', async () => {
      await productSearchAddToCartModule.openSearchResultsDirectly(PRODUCT_ID);
    });

    await test.step('Verify the matching product result is displayed', async () => {
      await productSearchAddToCartModule.verifySearchResults(PRODUCT_ID, EXPECTED_COUNT);
    });

    await test.step('Verify the search-result Add to cart control is visible, disabled, and cart count remains zero', async () => {
      await productSearchAddToCartModule.verifyResultsAddToCartDisabled(PRODUCT_ID);
    });
  });

  test('TC-001 @P1 @Functional @ProductSearchAddToCart: Access preprod homepage unauthenticated displays searchable header', async ({
    productSearchAddToCartModule,
  }) => {
    await test.step('Open the homepage without performing login', async () => {
      await productSearchAddToCartModule.openHomepageUnauthenticated();
    });

    await test.step('Verify searchable header and unauthenticated links are displayed', async () => {
      await productSearchAddToCartModule.verifyHomepageSearchReady();
    });
  });

  test('TC-002 @P1 @Functional @ProductSearchAddToCart: Search product ID 6968173 displays matching product result', async ({
    page,
    productSearchAddToCartModule,
  }) => {
    await test.step('Open the homepage without performing login', async () => {
      await productSearchAddToCartModule.openHomepageUnauthenticated();
    });

    await test.step('Submit the product ID through the header search', async () => {
      await productSearchAddToCartModule.submitProductSearch(PRODUCT_ID);
    });

    await test.step('Verify search URL, result count, and matching product card', async () => {
      await expect(page).toHaveURL(/\/catalog\/en-gb\/search\/6968173/);
      await productSearchAddToCartModule.verifySearchResults(PRODUCT_ID, EXPECTED_COUNT);
    });
  });

  test('TC-004 @P1 @Functional @ProductSearchAddToCart: Open product 6968173 detail page and verify Add to Cart remains disabled', async ({
    page,
    productSearchAddToCartModule,
  }) => {
    await test.step('Search for the target product as an unauthenticated user', async () => {
      await productSearchAddToCartModule.openHomepageUnauthenticated();
      await productSearchAddToCartModule.submitProductSearch(PRODUCT_ID);
    });

    await test.step('Open the product detail page from the search result', async () => {
      await productSearchAddToCartModule.openProductDetailsFromResults(PRODUCT_ID);
    });

    await test.step('Verify product details and disabled Add to cart controls', async () => {
      await expect(page).toHaveURL(/\/catalog\/en-gb\/products\/.*6968173/);
      await productSearchAddToCartModule.verifyProductDetails(PRODUCT_ID, EXPECTED_TITLE);
      await productSearchAddToCartModule.verifyDetailsAddToCartDisabled();
    });
  });

  test('TC-006 @P1 @Negative @ProductSearchAddToCart: Attempt unauthenticated Add to Cart from results does not add item to cart', async ({
    page,
    productSearchAddToCartModule,
  }) => {
    await test.step('Open the product search result directly', async () => {
      await productSearchAddToCartModule.openSearchResultsDirectly(PRODUCT_ID);
    });

    await test.step('Verify disabled result Add to cart prevents cart mutation', async () => {
      await productSearchAddToCartModule.verifyResultsAddToCartDisabled(PRODUCT_ID);
    });

    await test.step('Verify the user remains on search results and is not sent to checkout', async () => {
      await expect(page).toHaveURL(/\/catalog\/en-gb\/search\/6968173/);
      await expect(page).not.toHaveURL(/\/checkout/);
    });
  });

  test('TC-007 @P1 @Negative @ProductSearchAddToCart: Attempt unauthenticated Add to Cart from detail page does not add item to cart', async ({
    page,
    productSearchAddToCartModule,
  }) => {
    await test.step('Open the product detail page directly as an unauthenticated user', async () => {
      await productSearchAddToCartModule.openProductDetailsDirectly(PRODUCT_ID);
    });

    await test.step('Verify product identity and disabled buy-box controls', async () => {
      await productSearchAddToCartModule.verifyProductDetails(PRODUCT_ID, EXPECTED_TITLE);
      await productSearchAddToCartModule.verifyDetailsAddToCartDisabled();
    });

    await test.step('Verify the user remains on product detail and is not sent to checkout', async () => {
      await expect(page).toHaveURL(/\/catalog\/en-gb\/products\/.*6968173/);
      await expect(page).not.toHaveURL(/\/checkout/);
    });
  });

  test('TC-005 @P2 @Negative @ProductSearchAddToCart: Leave search input empty keeps Submit search disabled', async ({
    page,
    productSearchAddToCartModule,
  }) => {
    const unusedSearchTerm = DataGenerator.randomString(6);

    await test.step(`Open the homepage and keep the generated search term unused: ${unusedSearchTerm}`, async () => {
      await productSearchAddToCartModule.openHomepageUnauthenticated();
    });

    await test.step('Clear the search input and press Enter', async () => {
      await productSearchAddToCartModule.clearSearchAndPressEnter();
    });

    await test.step('Verify empty search remains disabled and does not navigate to results', async () => {
      await productSearchAddToCartModule.verifySearchInputRemainsEmpty();
      await expect(page).toHaveURL(/\/$/);
    });
  });

  test('TC-008 @P2 @Functional @ProductSearchAddToCart: Submit product search shows stable transition to results without login redirect', async ({
    productSearchAddToCartModule,
  }) => {
    await test.step('Open the homepage without performing login', async () => {
      await productSearchAddToCartModule.openHomepageUnauthenticated();
    });

    await test.step('Submit the product ID search from the header', async () => {
      await productSearchAddToCartModule.submitProductSearch(PRODUCT_ID);
    });

    await test.step('Verify stable results page without login redirect', async () => {
      await productSearchAddToCartModule.verifyNoLoginRedirectAfterSearch(PRODUCT_ID);
      await productSearchAddToCartModule.verifySearchResults(PRODUCT_ID, EXPECTED_COUNT);
    });
  });
});
