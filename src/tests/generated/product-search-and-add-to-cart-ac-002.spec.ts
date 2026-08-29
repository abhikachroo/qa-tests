import { test, expect } from '@fixtures';
import { config } from '@config/index';

const productId = '170720241509';

test.describe(`@P1 @ProductSearchAndAddToCart Product Search And Add To Cart — ${config.displayName} on ${config.environment}`, () => {
  test('@P1 @Functional @ProductSearchAndAddToCart TC-003: Add matching product from search results shows successful add-to-cart indication', async ({
    cartModule,
  }) => {
    await test.step('Search for the configured product and add it to the cart', async () => {
      await cartModule.searchAndAddProductToCart(productId);
    });

    await test.step('Verify the add-to-cart action completes successfully', async () => {
      await cartModule.verifyAddToCartCompleted(productId);
    });
  });

  test('@P1 @Negative @ProductSearchAndAddToCart TC-007: Attempt add-to-cart when add request fails shows recoverable error', async ({
    searchModule,
    cartModule,
    cartPage,
  }) => {
    await test.step('Search for the configured product', async () => {
      await searchModule.submitSearch(productId);
    });

    await test.step('Verify the matching product can be submitted to the cart', async () => {
      await searchModule.verifySearchResultsPage(productId);
      await expect(
        cartPage.addToCartButton(productId),
        'Add-to-cart control should be enabled before failure simulation',
      ).toBeEnabled();
    });

    await test.step('Submit the add-to-cart request and verify recoverable failure feedback', async () => {
      await cartPage.clickAddToCart(productId);
      await cartModule.verifyAddToCartFailure(productId);
    });
  });

  test('@P2 @Functional @ProductSearchAndAddToCart TC-009: Add-to-cart action shows disabled state while request is in progress', async ({
    searchModule,
    cartModule,
    cartPage,
  }) => {
    await test.step('Search for the configured product', async () => {
      await searchModule.submitSearch(productId);
    });

    await test.step('Verify the product and add-to-cart control are ready', async () => {
      await searchModule.verifySearchResultsPage(productId);
      await expect(
        cartPage.addToCartButton(productId),
        'Add-to-cart control should be enabled before submission',
      ).toBeEnabled();
    });

    await test.step('Submit the add-to-cart request and verify duplicate submission is guarded', async () => {
      await cartPage.clickAddToCart(productId);
      await cartModule.verifyAddToCartPendingState(productId);
    });
  });
});
