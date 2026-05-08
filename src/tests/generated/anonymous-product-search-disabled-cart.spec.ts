import { test, expect } from '@fixtures';
import { config } from '@config/index';

const productId = '6968173';
const manufacturerRefId = '78.491.020';

test.describe(`@P0 @Smoke @Search @AnonymousCart Anonymous Product Search Disabled Cart — ${config.displayName} on ${config.environment}`, () => {
  test('TC-003: Verify anonymous Add to Cart is visible but disabled on search result', async ({
    anonymousProductCartModule,
  }) => {
    await test.step('Open product search results anonymously', async () => {
      await anonymousProductCartModule.navigateToProductSearch(productId);
    });

    await test.step('Verify matching product appears in results', async () => {
      await anonymousProductCartModule.verifySearchResultsContainProduct(productId);
    });

    await test.step('Verify Add to Cart and quantity controls are disabled on search result', async () => {
      await anonymousProductCartModule.verifySearchResultAddToCartDisabled(productId);
    });
  });

  test('TC-008: Attempt unauthorized cart entry and verify anonymous user cannot add product', async ({
    anonymousProductCartModule,
  }) => {
    await test.step('Open product detail page anonymously', async () => {
      await anonymousProductCartModule.navigateToProductDetail();
    });

    await test.step('Verify product identity before cart authorization check', async () => {
      await anonymousProductCartModule.verifyProductDetailIdentity(productId, manufacturerRefId);
    });

    await test.step('Verify disabled Add to Cart prevents anonymous cart entry', async () => {
      await anonymousProductCartModule.verifyUnauthorizedCartEntryBlocked(productId);
    });
  });
});

test.describe(`@P1 @Functional @Negative @Search @AnonymousCart Anonymous Product Search Coverage — ${config.displayName} on ${config.environment}`, () => {
  test('TC-001: Open storefront anonymously and verify search interface is available', async ({
    anonymousProductCartModule,
  }) => {
    await test.step('Open storefront with a clean anonymous browser session', async () => {
      await anonymousProductCartModule.openStorefrontAnonymously();
    });

    await test.step('Verify anonymous header search, login, and cart controls', async () => {
      await anonymousProductCartModule.verifyStorefrontSearchAvailable();
    });
  });

  test('TC-004: Open matching product detail and verify anonymous Add to Cart remains disabled', async ({
    anonymousProductCartModule,
  }) => {
    await test.step('Open the product detail page anonymously', async () => {
      await anonymousProductCartModule.navigateToProductDetail();
    });

    await test.step('Verify product identity metadata on the detail page', async () => {
      await anonymousProductCartModule.verifyProductDetailIdentity(productId, manufacturerRefId);
    });

    await test.step('Verify Add to Cart and quantity controls remain disabled on product detail', async () => {
      await anonymousProductCartModule.verifyProductDetailAddToCartDisabled(productId);
    });
  });

  test('TC-005: Submit empty search and verify submission is blocked', async ({ page, anonymousProductCartModule, headerSearchPage }) => {
    await test.step('Open the storefront anonymously', async () => {
      await anonymousProductCartModule.openStorefrontAnonymously();
    });

    await test.step('Verify empty search cannot be submitted', async () => {
      await expect(headerSearchPage.searchInput(), 'Search input should remain empty').toHaveValue('');
      await expect(headerSearchPage.submitButton(), 'Submit search should be disabled for empty input').toBeDisabled();
      await expect(page, 'Empty search should not navigate away from the storefront').not.toHaveURL(/\/catalog\/en-gb\/search\//);
    });
  });
});

test.describe(`@P2 @Functional @Search @AnonymousCart Anonymous Product Search Edge Coverage — ${config.displayName} on ${config.environment}`, () => {
  test('TC-007: Verify search loading transition does not expose enabled Add to Cart', async ({
    anonymousProductCartModule,
  }) => {
    await test.step('Open storefront anonymously', async () => {
      await anonymousProductCartModule.openStorefrontAnonymously();
    });

    await test.step('Submit product search through the header search control', async () => {
      await anonymousProductCartModule.submitProductSearch(productId);
    });

    await test.step('Verify final result state keeps anonymous Add to Cart disabled', async () => {
      await anonymousProductCartModule.verifySearchResultAddToCartDisabled(productId);
    });
  });

  test('TC-009: Verify product ID copy and reference metadata is present for matching product', async ({
    anonymousProductCartModule,
  }) => {
    await test.step('Open product detail page anonymously', async () => {
      await anonymousProductCartModule.navigateToProductDetail();
    });

    await test.step('Verify ProductID, ManufacturerRefID, and LISTA heading identify the product', async () => {
      await anonymousProductCartModule.verifyProductDetailIdentity(productId, manufacturerRefId);
    });
  });
});
