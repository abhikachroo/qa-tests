import { test, expect } from '@fixtures';
import { config } from '@config/index';

const invalidProductId = '000000000000';
const unsupportedSearchProductId = '170720241509';

test.describe(
  `@ProductSearchAndAddToCart @Negative Product Search and Add To Cart AC-002 — ${config.displayName} on ${config.environment}`,
  () => {
    test(
      '@P1 @Regression TC-004: Submit a not-found product search and display a clear no-results state',
      async ({ searchModule, searchPage, productCartModule }) => {
        await test.step('Submit a search for a product ID that does not exist', async () => {
          await searchModule.submitSearch(invalidProductId);
        });

        await test.step('Verify clear no-results feedback is displayed', async () => {
          await searchModule.verifyNoResultsDisplayed();
        });

        await test.step('Verify no matching product card or cart entry is shown', async () => {
          await expect(
            searchPage.productCards(),
            `No product cards should be displayed for invalid product ID ${invalidProductId}`,
          ).toHaveCount(0);
          await productCartModule.verifyProductNotInCart(invalidProductId);
        });
      },
    );

    test(
      '@P2 @Regression TC-005: Navigate directly to unsupported search route and show controlled 404 page',
      async ({ productCartModule, productCartPage }) => {
        await test.step('Navigate directly to the unsupported search route', async () => {
          await productCartModule.navigateToUnsupportedSearchRoute(unsupportedSearchProductId);
        });

        await test.step('Verify the controlled 404 page and recovery controls are visible', async () => {
          await productCartModule.verifyUnsupportedSearchRoute();
        });

        await test.step('Verify no false product result or add-to-cart controls are shown', async () => {
          await expect(
            productCartPage.addToCartControls(),
            'Unsupported search route should not display add-to-cart controls',
          ).toHaveCount(0);
          await productCartModule.verifyProductNotInCart(unsupportedSearchProductId);
        });
      },
    );

    test(
      '@P2 @Regression TC-006: Submit empty search and keep the user on a valid recoverable state',
      async ({ searchModule, headerSearchPage }) => {
        await test.step('Submit the header search form without a query', async () => {
          await searchModule.submitEmptySearch();
        });

        await test.step('Verify the empty search state remains recoverable', async () => {
          await searchModule.verifyEmptySearchIsRecoverable();
        });

        await test.step('Verify the search input remains available for a valid product ID', async () => {
          await expect(
            headerSearchPage.dialogSearchInput(),
            'Search input should remain available after empty search submission',
          ).toBeVisible();
          await expect(
            headerSearchPage.dialogSearchInput(),
            'Search input should remain empty and ready for user recovery',
          ).toHaveValue('');
        });
      },
    );
  },
);
