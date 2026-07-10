import { test, expect } from '@fixtures';
import { config } from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';

const PRODUCT_ID = '170720241509';

test.describe(`@P1 @GuestCheckout Guest Checkout — ${config.displayName} on ${config.environment}`, () => {
  test('@P1 @Functional TC-001: Search for product ID 170720241509 displays matching product result', async ({
    guestCheckoutModule,
    searchResultsPage,
  }) => {
    await test.step('Search for the configured guest checkout product from the storefront header', async () => {
      await guestCheckoutModule.searchForProduct(PRODUCT_ID);
    });

    await test.step('Verify the matching product appears in search results', async () => {
      await guestCheckoutModule.verifyProductVisible(PRODUCT_ID);
      await expect(
        searchResultsPage.productCard(PRODUCT_ID),
        `Product card for ${PRODUCT_ID} should expose a selectable add-to-cart path`,
      ).toBeVisible();
    });
  });

  test('@P1 @Regression TC-002: Search for an unknown product keyword shows no-results state without product cards', async ({
    searchModule,
    searchResultsPage,
  }) => {
    const unavailableKeyword = config.noResultsKeyword || `qa-no-results-${DataGenerator.randomString(12)}`;

    await test.step('Search for an unavailable catalogue keyword from the storefront header', async () => {
      await searchModule.submitSearch(unavailableKeyword);
    });

    await test.step('Verify no-results message is displayed and product cards are absent', async () => {
      await searchModule.verifyNoResultsDisplayed();
      await expect(
        searchResultsPage.productCard(unavailableKeyword),
        `No product card should be displayed for unavailable keyword "${unavailableKeyword}"`,
      ).toHaveCount(0);
    });
  });
});
