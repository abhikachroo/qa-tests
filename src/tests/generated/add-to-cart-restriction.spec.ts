import { test, expect } from '@fixtures';
import { config }       from '@config/index';

/**
 * Add-to-Cart Restriction — P0 Smoke
 *
 * Feature:     Product Search & Add-to-Cart Restriction
 * AC Reference: AC-004
 * Application:  https://fra-vanilla-preprod.dev.spark.sonepar.com
 * Environment:  preprod
 * Auth:         Guest/anonymous user (no login required)
 *
 * Verified locators (live inspection 2026-05-05):
 *   - Add-to-Cart: data-testid='quantity-counter-cta-add'  — disabled=true (HTML attr)
 *   - Price error: data-testid='price-error-6968173'        — visible on search results page
 *   - Product card: data-testid='product-list-card-6968173'
 */
test.describe(`@P0 @Smoke @Search @AddToCart Add-to-Cart Restriction — ${config.displayName} on ${config.environment}`, () => {

  /**
   * TC-001: Search for product 6968173 and verify Add-to-Cart is disabled with price restriction
   *
   * Priority:     P0 Smoke
   * AC Reference: AC-004
   * Precondition: Guest user, no login required
   *
   * Flow:
   *   1. Navigate to homepage and submit search for product 6968173
   *   2. Verify URL redirects to the search results page
   *   3. Assert Add-to-Cart button is present and disabled (HTML disabled attribute)
   *   4. Assert price restriction message is visible
   */
  test('TC-001: Search for product 6968173 — Add-to-Cart button is disabled and price restriction is shown', async ({
    page,
    searchModule,
    productDetailPage,
  }) => {
    const productId = '6968173';

    await test.step(`Navigate to homepage and submit search for product "${productId}"`, async () => {
      await searchModule.submitSearch(productId);
    });

    await test.step('Verify URL redirects to the search results page for the product', async () => {
      await expect(page).toHaveURL(/\/catalog\/en-gb\/search\/6968173/);
    });

    await test.step('Verify product card is visible in search results', async () => {
      await expect(productDetailPage.productListCard(productId)).toBeVisible();
    });

    await test.step('Assert Add-to-Cart button is present and disabled', async () => {
      await expect(
        productDetailPage.addToCartButton(),
        'Add-to-Cart button must be visible — restriction uses HTML disabled, not display:none',
      ).toBeVisible();
      await expect(
        productDetailPage.addToCartButton(),
        'Add-to-Cart button must be disabled via HTML disabled attribute for product 6968173',
      ).toBeDisabled();
    });

    await test.step('Assert price restriction message is visible for the product', async () => {
      await expect(
        productDetailPage.priceError(productId),
        'Price restriction element must be visible for product 6968173',
      ).toBeVisible();
      await expect(
        productDetailPage.priceError(productId),
        'Price restriction text must mention inability to display price',
      ).toContainText('Unable to display price');
    });
  });

});
