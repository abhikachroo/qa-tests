import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '170720241509';
const EXPECTED_DEFAULT_QUANTITY = '1';

test.describe(`@ProductSearchAddToCart Product Search Add To Cart Flow — ${config.displayName} on ${config.environment}`, () => {
  test('@P0 @Smoke @ProductSearchAddToCart TC-001: Search product ID 170720241509 and verify it appears in cart', async ({
    page,
    productSearchAddToCartModule,
  }) => {
    await test.step('Search for the configured product from the homepage header', async () => {
      await productSearchAddToCartModule.searchForProduct(PRODUCT_ID);
    });

    await test.step('Open the matching product result', async () => {
      await productSearchAddToCartModule.openProductFromSearchResults(PRODUCT_ID);
    });

    await test.step('Add the displayed product to the cart', async () => {
      await productSearchAddToCartModule.addDisplayedProductToCart();
    });

    await test.step('Open the supported checkout cart route from the header', async () => {
      await productSearchAddToCartModule.openCartFromHeader();
      await expect(page).toHaveURL(/\/checkout\/en-gb\//);
    });

    await test.step('Verify the checkout cart contains the searched product ID', async () => {
      await productSearchAddToCartModule.verifyCartContainsProduct(PRODUCT_ID);
    });
  });

  test('@P1 @Functional @ProductSearchAddToCart TC-002: Add product ID 170720241509 from search flow and assert cart line item details', async ({
    page,
    searchResultsPage,
    productSearchAddToCartModule,
  }) => {
    await test.step('Search for the configured product from the homepage header', async () => {
      await productSearchAddToCartModule.searchForProduct(PRODUCT_ID);
    });

    await test.step('Verify the matching product ID is visible before adding to cart', async () => {
      await expect(searchResultsPage.productIdText(PRODUCT_ID)).toBeVisible();
    });

    await test.step('Open the matching product result', async () => {
      await productSearchAddToCartModule.openProductFromSearchResults(PRODUCT_ID);
    });

    await test.step('Add the displayed product to the cart', async () => {
      await productSearchAddToCartModule.addDisplayedProductToCart();
    });

    await test.step('Open the supported checkout cart route from the header', async () => {
      await productSearchAddToCartModule.openCartFromHeader();
      await expect(page).toHaveURL(/\/checkout\/en-gb\//);
    });

    await test.step('Verify the cart line item contains the product ID and default quantity', async () => {
      await productSearchAddToCartModule.verifyCartContainsProduct(PRODUCT_ID);
      await productSearchAddToCartModule.verifyDefaultQuantity(PRODUCT_ID, EXPECTED_DEFAULT_QUANTITY);
    });
  });

  test('@P1 @Negative @ProductSearchAddToCart TC-003: Submit empty search from homepage and keep user on searchable state', async ({
    page,
    productSearchAddToCartModule,
  }) => {
    await test.step('Verify empty header search submission is prevented', async () => {
      await productSearchAddToCartModule.verifyEmptySearchCannotSubmit();
    });

    await test.step('Verify the user remains on the homepage instead of product search navigation', async () => {
      await expect(page).toHaveURL(/\/$/);
    });
  });

  test('@P1 @Regression @ProductSearchAddToCart TC-004: Search for an unknown product keyword and verify no-results state remains stable', async ({
    searchResultsPage,
    productSearchAddToCartModule,
  }) => {
    await test.step('Search for the configured no-results keyword from the homepage header', async () => {
      await productSearchAddToCartModule.verifyNoResultsForUnknownKeyword(config.noResultsKeyword);
    });

    await test.step('Verify the deterministic no-results message remains visible', async () => {
      await expect(searchResultsPage.noResultsMessage()).toBeVisible();
    });
  });

  test('@P1 @Negative @ProductSearchAddToCart TC-006: Open checkout cart route from header cart link and handle empty or populated cart state', async ({
    page,
    productSearchAddToCartModule,
  }) => {
    await test.step('Open the supported checkout cart route from the header', async () => {
      await productSearchAddToCartModule.openCartFromHeader();
      await expect(page).toHaveURL(/\/checkout\/en-gb\//);
    });

    await test.step('Verify the checkout cart route is not a not-found page', async () => {
      await productSearchAddToCartModule.verifyCartIsNotNotFound();
    });
  });

  test('@P1 @Negative @ProductSearchAddToCart TC-007: Block or redirect unauthorized add-to-cart when buyer session is required', async ({
    page,
    productSearchAddToCartModule,
  }) => {
    await test.step('Search for the configured product from an unauthenticated homepage session', async () => {
      await productSearchAddToCartModule.searchForProduct(PRODUCT_ID);
    });

    await test.step('Open the matching product result', async () => {
      await productSearchAddToCartModule.openProductFromSearchResults(PRODUCT_ID);
    });

    await test.step('Attempt add-to-cart and verify authorization is required', async () => {
      await productSearchAddToCartModule.verifyUnauthorizedAddToCartIsBlocked();
    });

    await test.step('Verify blocked add-to-cart does not route the user to checkout cart', async () => {
      await expect(page).not.toHaveURL(/\/checkout\/en-gb\//);
    });
  });

  test('@P2 @Functional @ProductSearchAddToCart TC-005: Prevent duplicate search or add-to-cart actions during loading', async ({
    page,
    productSearchAddToCartModule,
  }) => {
    await test.step('Search for the configured product from the homepage header', async () => {
      await productSearchAddToCartModule.searchForProduct(PRODUCT_ID);
    });

    await test.step('Open the matching product result', async () => {
      await productSearchAddToCartModule.openProductFromSearchResults(PRODUCT_ID);
    });

    await test.step('Add the displayed product to the cart once', async () => {
      await productSearchAddToCartModule.addDisplayedProductToCart();
    });

    await test.step('Open the supported checkout cart route from the header', async () => {
      await productSearchAddToCartModule.openCartFromHeader();
      await expect(page).toHaveURL(/\/checkout\/en-gb\//);
    });

    await test.step('Verify the cart resolves to a single deterministic default quantity', async () => {
      await productSearchAddToCartModule.verifyCartContainsProduct(PRODUCT_ID);
      await productSearchAddToCartModule.verifyDefaultQuantity(PRODUCT_ID, EXPECTED_DEFAULT_QUANTITY);
    });
  });

  test('@P2 @Functional @ProductSearchAddToCart TC-008: Complete search add-to-cart flow with keyboard-accessible controls', async ({
    page,
    productSearchAddToCartModule,
  }) => {
    await test.step('Search for the configured product from the homepage header', async () => {
      await productSearchAddToCartModule.searchForProduct(PRODUCT_ID);
    });

    await test.step('Open the matching product result with the keyboard', async () => {
      await productSearchAddToCartModule.openProductFromSearchResultsWithKeyboard(PRODUCT_ID);
    });

    await test.step('Activate add-to-cart with the keyboard', async () => {
      await productSearchAddToCartModule.addDisplayedProductToCartWithKeyboard();
    });

    await test.step('Open the supported checkout cart route from the header with the keyboard', async () => {
      await productSearchAddToCartModule.openCartFromHeaderWithKeyboard();
      await expect(page).toHaveURL(/\/checkout\/en-gb\//);
    });

    await test.step('Verify the checkout cart contains the keyboard-added product ID', async () => {
      await productSearchAddToCartModule.verifyCartContainsProduct(PRODUCT_ID);
    });
  });
});
