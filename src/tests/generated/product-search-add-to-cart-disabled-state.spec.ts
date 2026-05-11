import { test, expect } from '@fixtures';
import { config } from '@config/index';

const productId = '6968173';
const expectedPriceMessage = 'Unable to display price, please contact your sales representative';
const expectedCartCount = '0';

test.describe(`@P1 @Smoke @Regression @Search @AddToCart Product Search Add to Cart Disabled State — ${config.displayName} on ${config.environment}`, () => {
  test('@P1 @Smoke TC-001: Search product 6968173 as guest shows disabled Add to Cart in results', async ({
    page,
    searchModule,
    productSearchAddToCartModule,
  }) => {
    await test.step('Search for the product from the guest homepage header', async () => {
      await searchModule.submitSearch(productId);
    });

    await test.step('Verify the guest header and search results route', async () => {
      await productSearchAddToCartModule.verifyGuestHeaderState();
      await expect(page, 'Search results URL should include the product ID').toHaveURL(/\/catalog\/en-gb\/search\/6968173/);
    });

    await test.step('Verify the product is locatable and Add to Cart is disabled on results', async () => {
      await searchModule.verifySearchResultsPage(productId);
      await productSearchAddToCartModule.verifySearchResultAddToCartDisabled(productId);
    });
  });

  test('@P1 @Regression TC-002: Open product 6968173 detail as guest shows disabled Add to Cart in BuyBox', async ({
    page,
    searchModule,
    productSearchAddToCartModule,
  }) => {
    await test.step('Search for the product from the guest homepage header', async () => {
      await searchModule.submitSearch(productId);
    });

    await test.step('Open the product detail page from search results', async () => {
      await productSearchAddToCartModule.openProductDetailFromResults(productId);
    });

    await test.step('Verify product detail page route and disabled Add to Cart in BuyBox', async () => {
      await expect(page, 'PDP URL should include products path and product ID').toHaveURL(/\/catalog\/en-gb\/products\/.*6968173/);
      await productSearchAddToCartModule.verifyProductDetailAddToCartDisabled(productId, expectedPriceMessage);
    });
  });

  test('@P1 @Regression TC-003: Attempting to activate disabled Add to Cart does not add item to cart', async ({
    page,
    searchModule,
    productSearchAddToCartModule,
  }) => {
    await test.step('Navigate to the product detail page through guest search', async () => {
      await searchModule.submitSearch(productId);
      await productSearchAddToCartModule.openProductDetailFromResults(productId);
    });

    await test.step('Verify disabled Add to Cart cannot mutate the guest cart', async () => {
      await productSearchAddToCartModule.verifyProductDetailAddToCartDisabled(productId, expectedPriceMessage);
      await productSearchAddToCartModule.verifyDisabledAddToCartCannotMutateCart(productId, expectedCartCount);
      await expect(page, 'Guest should remain on the product detail page').toHaveURL(/\/catalog\/en-gb\/products\/.*6968173/);
    });
  });
});

test.describe(`@P2 @Regression @Search Product Search Empty Query Guardrail — ${config.displayName} on ${config.environment}`, () => {
  test('@P2 @Regression TC-004: Submit search with empty query keeps search submission disabled', async ({
    page,
    productSearchAddToCartModule,
  }) => {
    await test.step('Navigate to homepage and verify empty search submission is disabled', async () => {
      await productSearchAddToCartModule.verifyEmptySearchSubmissionIsDisabled(productId);
    });

    await test.step('Verify empty search does not navigate to search results', async () => {
      await expect(page, 'Empty search should not navigate to a search results route').not.toHaveURL(/\/catalog\/en-gb\/search\//);
    });
  });
});
