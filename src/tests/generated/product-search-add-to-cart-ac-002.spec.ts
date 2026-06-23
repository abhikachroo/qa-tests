import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '170720241509';

test.describe(`@ProductSearchAddToCart Product Search and Add to Cart — ${config.displayName} on ${config.environment}`, () => {
  test('@P0 @Smoke @ProductSearchAddToCart TC-004: Add product ID 170720241509 from search results updates the cart indicator', async ({
    productCartModule,
    searchResultsPage,
    cartPage,
  }) => {
    await test.step('Search for the product ID', async () => {
      await productCartModule.searchForProduct(PRODUCT_ID);
    });

    await test.step('Verify the matching product is shown in search results', async () => {
      await productCartModule.verifyProductSearchResult(PRODUCT_ID);
      await expect(
        searchResultsPage.productIdText(PRODUCT_ID),
        `Product ID ${PRODUCT_ID} should be associated with the visible result`,
      ).toBeVisible();
    });

    await test.step('Add the matching product to the cart', async () => {
      await productCartModule.addProductFromSearchResults(PRODUCT_ID);
    });

    await test.step('Verify the cart indicator reflects the added item', async () => {
      await expect(
        cartPage.cartIndicator(),
        'Cart indicator should be visible after adding an item',
      ).toBeVisible();
      await expect(
        cartPage.cartIndicator(),
        'Cart indicator should not show an empty or zero-item state after adding an item',
      ).not.toContainText(/(^|\D)0(\D|$)|empty|vide/i);
    });
  });

  test('@P2 @Negative @ProductSearchAddToCart TC-005: Repeated add-to-cart click is prevented while the cart update is in progress', async ({
    productCartModule,
    searchResultsPage,
    cartPage,
  }) => {
    await test.step('Search for the product ID', async () => {
      await productCartModule.searchForProduct(PRODUCT_ID);
    });

    await test.step('Verify the matching product is orderable from search results', async () => {
      await productCartModule.verifyProductSearchResult(PRODUCT_ID);
      await expect(
        searchResultsPage.addToCartButtonForProduct(PRODUCT_ID),
        `Add-to-cart control should be enabled for product ${PRODUCT_ID}`,
      ).toBeEnabled();
    });

    await test.step('Start add-to-cart and verify duplicate submission is blocked', async () => {
      const addToCartButton = searchResultsPage.addToCartButtonForProduct(PRODUCT_ID);
      const addToCartAttempt = addToCartButton.click();

      await expect(
        addToCartButton,
        'Add-to-cart control should disable while the cart update is in progress to prevent duplicate submissions',
      ).toBeDisabled();

      await addToCartAttempt;
    });

    await test.step('Verify the blocked duplicate attempt leaves the cart in a valid state', async () => {
      await expect(
        cartPage.cartIndicator(),
        'Cart indicator should remain visible after a duplicate add-to-cart attempt is blocked',
      ).toBeVisible();
      await expect(
        searchResultsPage.error404Container(),
        'No error state should appear after duplicate submission prevention',
      ).not.toBeVisible();
    });
  });
});
