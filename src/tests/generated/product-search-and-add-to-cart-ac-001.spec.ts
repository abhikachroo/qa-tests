import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '170720241509';

test.describe(
  `@ProductSearchAndAddToCart Product Search And Add To Cart — ${config.displayName} on ${config.environment}`,
  () => {
    test('@P0 @Smoke @ProductSearchAndAddToCart TC-001: Search product 170720241509, add it to cart, and verify it appears in cart', async ({
      page,
      searchModule,
      productCartModule,
    }) => {
      await test.step('Submit a header search for the orderable product', async () => {
        await searchModule.submitSearch(PRODUCT_ID);
      });

      await test.step('Verify the matching product appears in search results', async () => {
        await expect(page).toHaveURL(new RegExp(`/search/${PRODUCT_ID}`));
        await searchModule.verifySearchResultsPage(PRODUCT_ID);
      });

      await test.step('Open the matching product result', async () => {
        await productCartModule.openMatchingProduct(PRODUCT_ID);
      });

      await test.step('Add the current product to the cart', async () => {
        await productCartModule.addCurrentProductToCart();
      });

      await test.step('Open the shopping cart', async () => {
        await productCartModule.openCart();
      });

      await test.step('Verify the cart contains the searched product', async () => {
        await productCartModule.verifyProductInCart(PRODUCT_ID);
      });
    });

    test('@P1 @Functional @ProductSearchAndAddToCart TC-002: Complete full product search and add-to-cart flow as a functional test', async ({
      page,
      searchModule,
      productCartModule,
    }) => {
      await test.step('Submit a header search for the configured product ID', async () => {
        await searchModule.submitSearch(PRODUCT_ID);
      });

      await test.step('Verify the search results page displays the matching product', async () => {
        await expect(page).toHaveURL(new RegExp(`/search/${PRODUCT_ID}`));
        await searchModule.verifySearchResultsPage(PRODUCT_ID);
      });

      await test.step('Add the matching result product to the cart', async () => {
        await productCartModule.addMatchingProductFromResults(PRODUCT_ID);
      });

      await test.step('Navigate to the shopping cart', async () => {
        await productCartModule.openCart();
      });

      await test.step('Verify the cart persists the matching product', async () => {
        await productCartModule.verifyProductInCart(PRODUCT_ID);
      });
    });

    test('@P1 @Regression @ProductSearchAndAddToCart TC-003: Preserve existing no-results regression behavior for unknown product searches', async ({
      searchModule,
    }) => {
      await test.step('Navigate to search results with the configured unknown keyword', async () => {
        await searchModule.navigateToSearchResults(config.noResultsKeyword);
      });

      await test.step('Verify the no-results message is displayed and product cards are absent', async () => {
        await searchModule.verifyNoResultsDisplayed();
      });
    });
  },
);
