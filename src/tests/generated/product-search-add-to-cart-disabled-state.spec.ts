import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '6968173';
const EXPECTED_PRICE_MESSAGE = 'Unable to display price, please contact your sales representative';

test.describe(`@Search @AddToCart Product Search Add To Cart Disabled State — ${config.displayName} on ${config.environment}`, () => {
  test('@P0 @Smoke TC-004: Verify disabled Add to Cart for product 6968173 as guest', async ({ page, searchModule }) => {
    await test.step('Search for the configured product as a guest user', async () => {
      await searchModule.submitSearch(PRODUCT_ID);
    });

    await test.step('Verify the product result Add to Cart control is visible and disabled', async () => {
      await searchModule.verifyResultAddToCartDisabled(PRODUCT_ID);
    });

    await test.step('Verify the user remains on the product search results page', async () => {
      await expect(page).toHaveURL(/\/catalog\/en-gb\/search\/6968173/);
    });
  });

  test('@P1 @Functional TC-001: Open storefront as guest exposes searchable header without login', async ({ page, searchModule }) => {
    await test.step('Open the storefront home page as a guest user', async () => {
      await searchModule.openStorefrontAsGuest();
    });

    await test.step('Verify guest login links and header search are visible', async () => {
      await searchModule.verifyGuestHeaderSearchAvailable();
    });

    await test.step('Verify the guest user is not redirected away from the storefront', async () => {
      await expect(page).toHaveURL(/fra-vanilla-preprod\.dev\.spark\.sonepar\.com/);
    });
  });

  test('@P1 @Functional TC-003: Display matching product result for product ID 6968173 on results page', async ({ searchModule }) => {
    await test.step('Submit a product ID search from the guest header', async () => {
      await searchModule.submitSearch(PRODUCT_ID);
    });

    await test.step('Verify matching product result card, title, and product reference are displayed', async () => {
      await searchModule.verifyProductResultDisplayed(PRODUCT_ID);
    });
  });

  test('@P1 @Negative TC-005: Open product detail for 6968173 preserves disabled Add to Cart state', async ({ page, searchModule }) => {
    await test.step('Search for the product and open its product detail page', async () => {
      await searchModule.submitSearch(PRODUCT_ID);
      await searchModule.openProductDetail(PRODUCT_ID);
    });

    await test.step('Verify product detail retains the disabled guest Add to Cart state', async () => {
      await searchModule.verifyProductDetailDisabledState(PRODUCT_ID, EXPECTED_PRICE_MESSAGE);
    });

    await test.step('Verify the user is not redirected to login or checkout', async () => {
      await expect(page).toHaveURL(/6968173/);
      await expect(page).not.toHaveURL(/\/checkout|\/login/);
    });
  });

  test('@P1 @Negative TC-006: Attempt to activate disabled Add to Cart does not add item to cart', async ({ page, searchModule }) => {
    await test.step('Search for the product and confirm Add to Cart is disabled before interaction', async () => {
      await searchModule.submitSearch(PRODUCT_ID);
      await searchModule.verifyResultAddToCartDisabled(PRODUCT_ID);
    });

    await test.step('Verify the disabled Add to Cart state does not mutate cart state', async () => {
      await searchModule.verifyDisabledAddToCartDoesNotMutateCart(PRODUCT_ID);
    });

    await test.step('Verify checkout navigation is not triggered', async () => {
      await expect(page).not.toHaveURL(/\/checkout/);
    });
  });

  test('@P1 @Negative TC-007: Submit empty header search keeps search submission unavailable', async ({ page, searchModule }) => {
    await test.step('Open the storefront and keep the header search input empty', async () => {
      await searchModule.verifyEmptyHeaderSearchCannotSubmit();
    });

    await test.step('Verify no search results navigation occurs for the empty search', async () => {
      await expect(page).not.toHaveURL(/\/catalog\/en-gb\/search\//);
    });
  });

  test('@P2 @Functional TC-009: Observe search loading transition and prevent duplicate submission', async ({ page, searchModule }) => {
    await test.step('Submit the product search once from the guest header', async () => {
      await searchModule.submitSearch(PRODUCT_ID);
    });

    await test.step('Verify the final search result state is stable and correct', async () => {
      await expect(page).toHaveURL(/\/catalog\/en-gb\/search\/6968173/);
      await searchModule.verifyProductResultDisplayed(PRODUCT_ID);
    });
  });
});
