import { test, expect } from '@fixtures';
import { config } from '@config/index';

const matchingProductId = '170720241509';

test.describe(`@ProductSearchAndAddToCart Add matching product from search results — ${config.displayName} on ${config.environment}`, () => {
  test('@P1 @ProductSearchAndAddToCart TC-003: Add matching product from search results shows cart confirmation', async ({
    searchModule,
    searchResultsPage,
    productCartModule,
  }) => {
    await test.step('Search for the matching product from the header', async () => {
      await searchModule.submitSearch(matchingProductId);
      await searchModule.verifySearchResultsPage(matchingProductId);
    });

    await test.step('Verify the matching product card is displayed', async () => {
      await expect(searchResultsPage.productCard(matchingProductId)).toBeVisible();
      await expect(searchResultsPage.addToCartButtonForProduct(matchingProductId)).toBeEnabled();
    });

    await test.step('Add the matching product from search results', async () => {
      await productCartModule.addProductFromSearchResults(matchingProductId);
    });

    await test.step('Verify the storefront shows an add-to-cart confirmation signal', async () => {
      await productCartModule.verifyAddToCartConfirmation();
      await expect(searchResultsPage.addToCartConfirmation()).toBeVisible();
      await expect(searchResultsPage.cartCountIndicator()).not.toHaveText('0');
    });
  });

  test('@P2 @ProductSearchAndAddToCart TC-007: Attempt to add product when action is unavailable does not create false cart success', async () => {
    test.skip(
      true,
      'No stable unavailable/non-addable product test data was provided for this environment; scenario is data-dependent and requires an alternate unavailable product ID or mocked state.',
    );
  });
});
