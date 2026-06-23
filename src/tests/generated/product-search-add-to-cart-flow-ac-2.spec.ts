import { test, expect } from '@fixtures';
import { config } from '@config/index';
import { DataGenerator } from '@utils/index';

const MATCHING_PRODUCT_ID = '170720241509';

test.describe(`@ProductSearchAddToCart Product Search Add To Cart Flow — ${config.displayName} on ${config.environment}`, () => {
  test('@P1 @Functional @Regression TC-003: Add matching search result to cart and show success confirmation', async ({
    searchModule,
    cartModule,
  }) => {
    await test.step('Submit a search for the matching product', async () => {
      await searchModule.submitSearch(MATCHING_PRODUCT_ID);
    });

    await test.step('Verify the matching product appears in search results', async () => {
      await searchModule.verifySearchResultsPage(MATCHING_PRODUCT_ID);
    });

    await test.step('Add the matching product to the cart', async () => {
      await cartModule.addSearchResultToCart(MATCHING_PRODUCT_ID);
    });

    await test.step('Verify add-to-cart success confirmation is displayed', async () => {
      await cartModule.verifyAddToCartSucceeded();
    });
  });

  test('@P1 @Negative @Regression TC-004: Attempt add-to-cart when cart service fails and show error without updating cart', async ({
    page,
    searchModule,
    cartModule,
    cartPage,
  }) => {
    let cartCountBefore = '';

    await test.step('Submit a search for the matching product', async () => {
      await searchModule.submitSearch(MATCHING_PRODUCT_ID);
    });

    await test.step('Verify the matching product appears in search results', async () => {
      await searchModule.verifySearchResultsPage(MATCHING_PRODUCT_ID);
    });

    await test.step('Capture the current cart count before the failed update', async () => {
      await expect(cartPage.cartCount(), 'Cart count should be visible before add-to-cart failure simulation').toBeVisible();
      cartCountBefore = await cartPage.getCartCountText();
    });

    await test.step('Simulate a cart service failure for add-to-cart requests', async () => {
      await page.route(/cart|basket/i, async route => {
        const request = route.request();
        const isCartMutation = ['POST', 'PUT', 'PATCH'].includes(request.method());

        if (isCartMutation) {
          await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Cart service unavailable' }),
          });
          return;
        }

        await route.continue();
      });
    });

    await test.step('Attempt to add the matching product to the cart', async () => {
      await cartModule.addSearchResultToCart(MATCHING_PRODUCT_ID);
    });

    await test.step('Verify failure message is displayed and cart count is unchanged', async () => {
      await cartModule.verifyAddToCartFailed();
      await expect(
        cartPage.successMessage(),
        'Success confirmation should not be visible when add-to-cart fails',
      ).not.toBeVisible();
      await expect(
        cartPage.cartCount(),
        'Cart count should remain unchanged after failed add-to-cart',
      ).toHaveText(cartCountBefore);
    });
  });

  test('@P2 @Negative @Regression TC-008: Prevent duplicate add-to-cart submissions while cart update is loading', async ({
    page,
    searchModule,
    cartModule,
    searchResultsPage,
  }) => {
    const artificialDelayMs = DataGenerator.randomInt(1000, 3000);
    let addToCartRequestCount = 0;

    await test.step('Submit a search for the matching product', async () => {
      await searchModule.submitSearch(MATCHING_PRODUCT_ID);
    });

    await test.step('Verify the matching product appears in search results', async () => {
      await searchModule.verifySearchResultsPage(MATCHING_PRODUCT_ID);
    });

    await test.step('Delay cart service response for add-to-cart requests', async () => {
      await page.route(/cart|basket/i, async route => {
        const request = route.request();
        const isCartMutation = ['POST', 'PUT', 'PATCH'].includes(request.method());

        if (isCartMutation) {
          addToCartRequestCount += 1;
          await new Promise(resolve => setTimeout(resolve, artificialDelayMs));
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Added to cart', quantity: 1 }),
          });
          return;
        }

        await route.continue();
      });
    });

    await test.step('Submit one add-to-cart request while the cart service is delayed', async () => {
      await cartModule.addSearchResultToCart(MATCHING_PRODUCT_ID);
    });

    await test.step('Verify duplicate add-to-cart submission is prevented during loading', async () => {
      await expect(
        searchResultsPage.addToCartButton(MATCHING_PRODUCT_ID),
        'Add-to-cart button should be disabled while cart update is loading',
      ).toBeDisabled();
      await expect
        .poll(() => addToCartRequestCount, {
          message: 'Only one add-to-cart request should be submitted while loading',
        })
        .toBe(1);
    });
  });
});
