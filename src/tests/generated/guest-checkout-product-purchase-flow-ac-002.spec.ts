import { test, expect } from '@fixtures';
import { config } from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';

const knownProductId = '170720241509';

test.describe(`@P1 @GuestCheckout @Search Guest product search — ${config.displayName} on ${config.environment}`, () => {
  test('TC-003 @P1 @GuestCheckout @Search: Search product ID from header displays matching product result', async ({
    page,
    guestCheckoutModule,
  }) => {
    await test.step('Search for the known product ID from the storefront header', async () => {
      await guestCheckoutModule.searchProductFromHeader(knownProductId);
    });

    await test.step('Verify the search route reflects product search navigation', async () => {
      await expect(
        page,
        `Search should navigate to a search route or product-result URL for product ID ${knownProductId}`,
      ).toHaveURL(new RegExp(`/search|q=.*${knownProductId}|${knownProductId}`));
    });

    await test.step('Verify the matching product result is displayed', async () => {
      await guestCheckoutModule.verifySearchResultContainsProduct(knownProductId);
    });
  });

  test('TC-004 @P1 @GuestCheckout @Search: Search with unknown product ID shows no-results empty state', async ({
    guestCheckoutModule,
    searchModule,
  }) => {
    const unknownKeyword = `unknown-${DataGenerator.randomString(12)}`;

    await test.step('Navigate to search results for an unknown product keyword', async () => {
      await searchModule.navigateToSearchResults(unknownKeyword);
    });

    await test.step('Verify the no-results message and zero product-card state are displayed', async () => {
      await searchModule.verifyNoResultsDisplayed();
    });

    await test.step('Verify guest search remains available after the no-results state', async () => {
      await guestCheckoutModule.verifyStorefrontSearchAvailable();
    });
  });
});
