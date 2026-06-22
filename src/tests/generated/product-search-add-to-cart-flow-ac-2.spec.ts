import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '170720241509';

test.describe(`@P1 @ProductSearchAddToCart Product search add-to-cart flow AC-2 — ${config.displayName} on ${config.environment}`, () => {
  test('@P1 @Functional TC-004: Open matching product from search results shows purchasable product state', async ({
    productSearchAddToCartModule,
  }) => {
    await test.step('Search for the matching product', async () => {
      await productSearchAddToCartModule.searchForProduct(PRODUCT_ID);
    });

    await test.step('Verify the matching product result is visible', async () => {
      await productSearchAddToCartModule.verifySearchResult(PRODUCT_ID);
    });

    await test.step('Open the matching product from search results', async () => {
      await productSearchAddToCartModule.openMatchingProduct(PRODUCT_ID);
    });

    await test.step('Verify the selected product is purchasable', async () => {
      await productSearchAddToCartModule.verifyPurchasableProduct(PRODUCT_ID);
    });
  });

  test('@P2 @Functional TC-008: Keyboard selects matching search result and preserves visible focus', async ({
    page,
    productSearchAddToCartModule,
    searchResultsPage,
  }) => {
    await test.step('Search for the matching product', async () => {
      await productSearchAddToCartModule.searchForProduct(PRODUCT_ID);
    });

    await test.step('Verify the matching product result is visible', async () => {
      await productSearchAddToCartModule.verifySearchResult(PRODUCT_ID);
    });

    await test.step('Move keyboard focus to the matching product result', async () => {
      const matchingProductLink = searchResultsPage.firstProductLink(PRODUCT_ID);
      await matchingProductLink.focus();
      await expect(matchingProductLink, 'Matching product result should receive keyboard focus before activation').toBeFocused();
    });

    await test.step('Activate the focused matching product result with Enter', async () => {
      await page.keyboard.press('Enter');
    });

    await test.step('Verify keyboard activation opens a purchasable product state', async () => {
      await productSearchAddToCartModule.verifyPurchasableProduct(PRODUCT_ID);
    });
  });
});
