import { test, expect } from '@fixtures';
import { config } from '@config/index';

const productId = '170720241509';

test.describe(`@ProductSearchAndAddToCart Product search and add to cart — ${config.displayName} on ${config.environment}`, () => {
  test('@P0 @Smoke @ProductSearchAndAddToCart TC-001: Search, add, and verify product in cart succeeds end to end', async ({
    searchModule,
    productCartModule,
    cartPage,
  }) => {
    await test.step('Search for the configured product identifier', async () => {
      await searchModule.submitSearch(productId);
    });

    await test.step('Verify the search results page shows the matching product', async () => {
      await searchModule.verifySearchResultsPage(productId);
    });

    await test.step('Add the matching product from search results', async () => {
      await productCartModule.addProductFromSearchResults(productId);
    });

    await test.step('Verify the add-to-cart confirmation is displayed', async () => {
      await productCartModule.verifyAddToCartConfirmation();
    });

    await test.step('Open the cart through supported navigation', async () => {
      await productCartModule.openCartFromSupportedNavigation();
    });

    await test.step('Verify the cart view is loaded', async () => {
      await productCartModule.verifyCartViewLoaded();
    });

    await test.step('Verify the cart contains the added product identifier', async () => {
      await productCartModule.verifyProductInCart(productId);
      await expect(cartPage.productIdentifier(productId)).toBeVisible();
      await expect(cartPage.emptyCartMessage()).not.toBeVisible();
    });
  });

  test('@P1 @ProductSearchAndAddToCart TC-005: Cart displays added product line item with product identifier', async ({
    searchModule,
    productCartModule,
    cartPage,
  }) => {
    await test.step('Add the configured product to the cart from search results', async () => {
      await searchModule.submitSearch(productId);
      await searchModule.verifySearchResultsPage(productId);
      await productCartModule.addProductFromSearchResults(productId);
      await productCartModule.verifyAddToCartConfirmation();
    });

    await test.step('Open the cart through supported navigation', async () => {
      await productCartModule.openCartFromSupportedNavigation();
    });

    await test.step('Verify the cart view is loaded with contents', async () => {
      await productCartModule.verifyCartViewLoaded();
    });

    await test.step('Verify the added product line item is visible and cart is not empty', async () => {
      await productCartModule.verifyProductInCart(productId);
      await expect(cartPage.cartLineItem(productId)).toBeVisible();
      await expect(cartPage.productIdentifier(productId)).toBeVisible();
      await expect(cartPage.emptyCartMessage()).not.toBeVisible();
    });
  });
});
