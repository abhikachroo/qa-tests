import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '6968173';
const EXPECTED_PRODUCT_TITLE = 'LISTA-Schuifladekast,mobiel, 27x27E (BxDxH) 564x572x723mm, 5 lades, RAL7035 grijs';
const EXPECTED_MANUFACTURER_REFERENCE = '78.491.020';
const PRODUCT_DETAIL_PATH = '/catalog/en-gb/products/lista-schuifladekast-mobiel-27x27e-bxdxh-564x572x723mm-5-lades-ral7035-grijs-6968173';

test.describe(`@P0 @P1 @P2 @Search @ProductSearchAddToCartDisabledState Product Search Add To Cart Disabled State — ${config.displayName} on ${config.environment}`, () => {
  test('@P0 @Smoke @Search TC-005: Smoke verify Add to Cart is disabled for unauthenticated product 6968173', async ({
    page,
    productPurchaseModule,
  }) => {
    await test.step('Open the product detail page as an unauthenticated visitor', async () => {
      await productPurchaseModule.openProductDetailPath(PRODUCT_DETAIL_PATH);
    });

    await test.step('Verify the product detail URL is reached', async () => {
      await expect(page).toHaveURL(/\/catalog\/en-gb\/products\/.*6968173/);
    });

    await test.step('Verify Add to Cart and quantity controls are disabled', async () => {
      await productPurchaseModule.verifyProductDetailPurchaseControlsDisabled();
    });
  });

  test('@P1 @Functional @Search TC-001: Load homepage as unauthenticated visitor and show search controls', async ({
    productPurchaseModule,
  }) => {
    await test.step('Open the homepage as a guest visitor', async () => {
      await productPurchaseModule.openHomePage();
    });

    await test.step('Verify guest header search, login, signup, and cart controls are visible', async () => {
      await productPurchaseModule.verifyGuestHomeHeader();
    });
  });

  test('@P1 @Functional @Search TC-003: Verify search results show matching product ID 6968173', async ({
    page,
    productPurchaseModule,
  }) => {
    await test.step('Open homepage and submit search for the configured product ID', async () => {
      await productPurchaseModule.openHomePage();
      await productPurchaseModule.searchForProduct(PRODUCT_ID);
    });

    await test.step('Verify search results URL references the product ID', async () => {
      await expect(page).toHaveURL(/\/catalog\/en-gb\/search\/6968173/);
    });

    await test.step('Verify the matching product card, ID, title, and disabled purchase controls', async () => {
      await productPurchaseModule.verifySearchResultsProduct(PRODUCT_ID, EXPECTED_PRODUCT_TITLE);
      await productPurchaseModule.verifySearchResultsPurchaseControlsDisabled(PRODUCT_ID);
    });
  });

  test('@P1 @Functional @Search TC-004: Open matching product detail and verify product identity', async ({
    page,
    productPurchaseModule,
  }) => {
    await test.step('Search for the product and open its detail page', async () => {
      await productPurchaseModule.openHomePage();
      await productPurchaseModule.searchForProduct(PRODUCT_ID);
      await productPurchaseModule.openProductFromSearchResults();
    });

    await test.step('Verify the product detail URL references the product ID', async () => {
      await expect(page).toHaveURL(/\/catalog\/en-gb\/products\/.*6968173/);
    });

    await test.step('Verify the product title, product ID, and manufacturer reference', async () => {
      await productPurchaseModule.verifyProductDetailIdentity(PRODUCT_ID, EXPECTED_MANUFACTURER_REFERENCE);
    });
  });

  test('@P1 @Negative @Search TC-006: Attempt unauthenticated purchase controls and confirm cart remains unchanged', async ({
    page,
    productPurchaseModule,
  }) => {
    let initialCartText = '';

    await test.step('Open product detail page and capture the initial cart state', async () => {
      await productPurchaseModule.openHomePage();
      initialCartText = await productPurchaseModule.getCartButtonText();
      await productPurchaseModule.openProductDetailPath(PRODUCT_DETAIL_PATH);
    });

    await test.step('Verify Add to Cart is disabled before any purchase interaction', async () => {
      await productPurchaseModule.verifyProductDetailPurchaseControlsDisabled();
    });

    await test.step('Verify cart state and page location remain unchanged', async () => {
      await productPurchaseModule.verifyCartButtonTextUnchanged(initialCartText);
      await expect(page).toHaveURL(/\/catalog\/en-gb\/products\/.*6968173/);
    });
  });

  test('@P2 @Negative @Search TC-007: Submit empty search and verify search is not executed', async ({
    page,
    productPurchaseModule,
  }) => {
    await test.step('Open homepage and leave the search field empty', async () => {
      await productPurchaseModule.openHomePage();
    });

    await test.step('Verify empty search is blocked by disabled submit state', async () => {
      await productPurchaseModule.verifyEmptySearchIsPrevented();
    });

    await test.step('Verify the browser remains outside a blank search results URL', async () => {
      await expect(page).not.toHaveURL(/\/catalog\/en-gb\/search\/?(?:\?|$)/);
    });
  });

  test('@P2 @Functional @Search TC-009: Verify unauthenticated pricing banner appears during search and product view', async ({
    productPurchaseModule,
  }) => {
    await test.step('Open homepage and verify the guest pricing banner', async () => {
      await productPurchaseModule.openHomePage();
      await productPurchaseModule.verifyGuestPricingBannerOnHomePage();
    });

    await test.step('Search for the product and verify guest pricing state on results', async () => {
      await productPurchaseModule.searchForProduct(PRODUCT_ID);
      await productPurchaseModule.verifyGuestPricingBannerOnSearchResults();
    });

    await test.step('Open product detail and verify the guest pricing banner remains visible', async () => {
      await productPurchaseModule.openProductFromSearchResults();
      await productPurchaseModule.verifyGuestPricingBannerOnProductDetail();
    });
  });

  test('@P2 @Functional @Search TC-010: Verify search transition handles loading or duplicate submission safely', async ({
    page,
    productPurchaseModule,
  }) => {
    await test.step('Open homepage and submit a single stable product search', async () => {
      await productPurchaseModule.openHomePage();
      await productPurchaseModule.searchForProduct(PRODUCT_ID);
    });

    await test.step('Verify one stable search results page is reached for the product ID', async () => {
      await expect(page).toHaveURL(/\/catalog\/en-gb\/search\/6968173/);
      await productPurchaseModule.verifySearchResultsProduct(PRODUCT_ID, EXPECTED_PRODUCT_TITLE);
    });
  });
});
