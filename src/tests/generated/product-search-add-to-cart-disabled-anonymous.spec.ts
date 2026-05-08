import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '6968173';
const MANUFACTURER_REF_ID = '78.491.020';
const PRODUCT_DETAIL_PATH = '/catalog/en-gb/products/lista-schuifladekast-mobiel-27x27e-bxdxh-564x572x723mm-5-lades-ral7035-grijs-6968173';

test.describe(`@P0 @P1 @P2 @Smoke @Regression @Search @AnonymousCart Product Search Anonymous Add to Cart Restriction — ${config.displayName} on ${config.environment}`, () => {

  test('@P0 @Smoke @AnonymousCart TC-003: Anonymous Add to Cart is visible but disabled on search result', async ({
    anonymousProductModule,
  }) => {
    await test.step('Open the anonymous product search results page', async () => {
      await anonymousProductModule.openProductSearchResults(PRODUCT_ID);
    });

    await test.step('Verify the matching product result is displayed', async () => {
      await anonymousProductModule.verifySearchResultIdentity(PRODUCT_ID);
    });

    await test.step('Verify Add to Cart and quantity controls are disabled for anonymous user', async () => {
      await anonymousProductModule.verifySearchResultCartControlsDisabled(PRODUCT_ID);
    });
  });

  test('@P0 @Smoke @AnonymousCart TC-008: Anonymous user cannot add product to cart from disabled controls', async ({
    anonymousProductModule,
  }) => {
    await test.step('Open the anonymous product search results page', async () => {
      await anonymousProductModule.openProductSearchResults(PRODUCT_ID);
    });

    await test.step('Verify Add to Cart is rendered but disabled before any cart attempt', async () => {
      await anonymousProductModule.verifySearchResultCartControlsDisabled(PRODUCT_ID);
    });

    await test.step('Verify cart count remains zero and login link remains visible', async () => {
      await anonymousProductModule.verifyAnonymousCartRemainsEmpty();
    });
  });

  test('@P1 @Regression @Search TC-001: Anonymous storefront exposes search without forcing login', async ({
    anonymousProductModule,
  }) => {
    await test.step('Open the storefront as an anonymous user', async () => {
      await anonymousProductModule.openStorefront();
    });

    await test.step('Verify search, login, and cart controls are available without a login prompt', async () => {
      await anonymousProductModule.verifyAnonymousStorefrontHeader();
    });
  });

  test('@P1 @Regression @AnonymousCart TC-004: Product detail keeps anonymous Add to Cart disabled', async ({
    anonymousProductModule,
  }) => {
    await test.step('Open the product detail page for the matching product', async () => {
      await anonymousProductModule.openProductDetail(PRODUCT_DETAIL_PATH);
    });

    await test.step('Verify product identity on the product detail page', async () => {
      await anonymousProductModule.verifyProductDetailIdentity(PRODUCT_ID, MANUFACTURER_REF_ID);
    });

    await test.step('Verify product detail Add to Cart and quantity controls are disabled', async () => {
      await anonymousProductModule.verifyProductDetailCartControlsDisabled(PRODUCT_ID);
    });
  });

  test('@P1 @Regression @Search TC-005: Empty anonymous search submission is blocked', async ({
    page,
    anonymousProductModule,
  }) => {
    await test.step('Open the storefront as an anonymous user', async () => {
      await anonymousProductModule.openStorefront();
    });

    await test.step('Verify empty search cannot be submitted', async () => {
      await anonymousProductModule.verifyEmptySearchIsBlocked();
    });

    await test.step('Verify browser remains on the storefront route', async () => {
      await expect(page).toHaveURL(/\/$/);
    });
  });

  test('@P2 @Regression @AnonymousCart TC-007: Search transition never ends with enabled Add to Cart', async ({
    page,
    anonymousProductModule,
  }) => {
    await test.step('Open the storefront as an anonymous user', async () => {
      await anonymousProductModule.openStorefront();
    });

    await test.step('Submit product search for the configured catalog product', async () => {
      await anonymousProductModule.submitProductSearch(PRODUCT_ID);
    });

    await test.step('Verify search results route and final disabled cart state', async () => {
      await expect(page).toHaveURL(/\/catalog\/en-gb\/search\/6968173/);
      await anonymousProductModule.verifySearchResultCartControlsDisabled(PRODUCT_ID);
      await anonymousProductModule.verifyAnonymousCartRemainsEmpty();
    });
  });

  test('@P2 @Regression @Search TC-009: Product reference metadata identifies the matching product', async ({
    anonymousProductModule,
  }) => {
    await test.step('Open the product detail page for the matching product', async () => {
      await anonymousProductModule.openProductDetail(PRODUCT_DETAIL_PATH);
    });

    await test.step('Verify product ID, manufacturer reference, and product heading are present', async () => {
      await anonymousProductModule.verifyProductDetailIdentity(PRODUCT_ID, MANUFACTURER_REF_ID);
    });
  });
});
