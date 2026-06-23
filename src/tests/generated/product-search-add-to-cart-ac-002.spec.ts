import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '170720241509';
const EXPECTED_SINGLE_CART_MUTATION = 1;
const ADD_TO_CART_FAILURE_STATUS = 500;
const CART_MUTATION_URL_PATTERN = /cart|basket|panier/i;
const CART_MUTATION_METHODS = ['POST', 'PUT', 'PATCH'];
const ADD_TO_CART_ERROR_MESSAGE_PATTERN = /unable|failed|error|erreur|échec|panier/i;

const isCartMutationRequest = (url: string, method: string): boolean =>
  CART_MUTATION_URL_PATTERN.test(url) && CART_MUTATION_METHODS.includes(method);

test.describe(`@P1 @P2 @ProductSearchAddToCart Product Search and Add to Cart — ${config.displayName} on ${config.environment}`, () => {
  test('@P1 @Functional @ProductSearchAddToCart TC-005: Add product 170720241509 to the cart and see confirmation', async ({
    page,
    productCartModule,
    searchResultsPage,
  }) => {
    await test.step('Search for the exact product ID', async () => {
      await productCartModule.searchAndVerifyProduct(PRODUCT_ID);
    });

    await test.step('Identify the matching product in search results', async () => {
      await productCartModule.verifyProductCardIsVisible(PRODUCT_ID);
      await expect(
        searchResultsPage.productCard(PRODUCT_ID),
        `Product card for ${PRODUCT_ID} should be visible before adding to cart`,
      ).toBeVisible();
    });

    await test.step('Add the matching product to the cart', async () => {
      await productCartModule.addVisibleProductToCart(PRODUCT_ID);
    });

    await test.step('Verify add-to-cart confirmation is displayed without an error banner', async () => {
      await productCartModule.verifyAddToCartConfirmation();
      await expect(
        page.getByRole('alert').filter({ hasText: ADD_TO_CART_ERROR_MESSAGE_PATTERN }),
        'No add-to-cart error alert should be visible after a successful add',
      ).not.toBeVisible();
    });
  });

  test('@P1 @Negative @ProductSearchAddToCart TC-007: Show a clear error when add to cart fails', async ({
    page,
    productCartModule,
    cartPage,
  }) => {
    await test.step('Search for the exact product ID', async () => {
      await productCartModule.searchAndVerifyProduct(PRODUCT_ID);
      await productCartModule.verifyProductCardIsVisible(PRODUCT_ID);
    });

    await test.step('Simulate an add-to-cart service failure', async () => {
      await page.route(CART_MUTATION_URL_PATTERN, async (route) => {
        const request = route.request();

        if (!isCartMutationRequest(request.url(), request.method())) {
          await route.continue();
          return;
        }

        await route.fulfill({
          status: ADD_TO_CART_FAILURE_STATUS,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Unable to add product to cart' }),
        });
      });
    });

    await test.step('Attempt to add the product to the cart', async () => {
      const failedCartResponse = page.waitForResponse((response) =>
        isCartMutationRequest(response.url(), response.request().method()) &&
        response.status() === ADD_TO_CART_FAILURE_STATUS,
      );

      await productCartModule.addVisibleProductToCart(PRODUCT_ID);
      await failedCartResponse;
    });

    await test.step('Verify a clear add-to-cart error is shown and the product is not silently added', async () => {
      const errorAlert = page.getByRole('alert').filter({ hasText: ADD_TO_CART_ERROR_MESSAGE_PATTERN }).first();

      await expect(
        errorAlert,
        'An add-to-cart failure should show a visible error alert, toast, or banner',
      ).toBeVisible();
      await expect(
        errorAlert,
        'The add-to-cart failure message should explain that the cart update failed',
      ).toContainText(ADD_TO_CART_ERROR_MESSAGE_PATTERN);
      await expect(
        cartPage.cartLineItem(PRODUCT_ID),
        `Product ${PRODUCT_ID} should not be silently present in the cart after a failed add`,
      ).not.toBeVisible();
    });
  });

  test('@P2 @Negative @ProductSearchAddToCart TC-006: Prevent duplicate add-to-cart submissions while request is pending', async ({
    page,
    productCartModule,
    searchResultsPage,
  }) => {
    let releaseCartMutation: () => void = () => undefined;
    let cartMutationCount = 0;

    await test.step('Search for the exact product ID', async () => {
      await productCartModule.searchAndVerifyProduct(PRODUCT_ID);
      await productCartModule.verifyProductCardIsVisible(PRODUCT_ID);
    });

    await test.step('Hold the add-to-cart request pending for duplicate-submission validation', async () => {
      await page.route(CART_MUTATION_URL_PATTERN, async (route) => {
        const request = route.request();

        if (!isCartMutationRequest(request.url(), request.method())) {
          await route.continue();
          return;
        }

        cartMutationCount += 1;

        await new Promise<void>((resolve) => {
          releaseCartMutation = resolve;
        });

        await route.continue();
      });
    });

    await test.step('Start adding the product to the cart and verify duplicate click is blocked', async () => {
      const pendingCartRequest = page.waitForRequest((request) =>
        isCartMutationRequest(request.url(), request.method()),
      );
      const addToCartButton = searchResultsPage.addToCartButtonForProduct(PRODUCT_ID);
      const addToCartAttempt = productCartModule.addVisibleProductToCart(PRODUCT_ID);

      await pendingCartRequest;

      try {
        await expect(
          addToCartButton,
          'Add-to-cart control should be disabled while the first cart update is pending',
        ).toBeDisabled({ timeout: 5_000 });
      } finally {
        releaseCartMutation();
      }

      await addToCartAttempt;
    });

    await test.step('Verify only one cart mutation completes with one clear confirmation', async () => {
      expect(
        cartMutationCount,
        'Only one add-to-cart mutation should be submitted while the first request is pending',
      ).toBe(EXPECTED_SINGLE_CART_MUTATION);
      await productCartModule.verifyAddToCartConfirmation();
    });
  });
});
