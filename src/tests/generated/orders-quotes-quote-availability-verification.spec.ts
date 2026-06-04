import { test, expect } from '@fixtures';
import { config } from '@config/index';

const quoteId = '739715852528783360';

test.describe(`@P0 @Smoke @OrdersQuotes Orders Quotes Quote Availability Verification — ${config.displayName} on ${config.environment}`, () => {

  test('TC-001: Verify authenticated user can navigate Orders to Quotes and find quote 739715852528783360', async ({
    page,
    loginModule,
    ordersQuotesModule,
  }) => {
    await test.step('Login with configured preprod test credentials', async () => {
      await loginModule.doLogin();
    });

    await test.step('Verify authenticated account header is displayed', async () => {
      await ordersQuotesModule.verifyAuthenticatedHeader();
    });

    await test.step('Open the Orders menu and select Quotes', async () => {
      await ordersQuotesModule.navigateToQuotes();
    });

    await test.step('Verify the Quotes page is displayed', async () => {
      await ordersQuotesModule.verifyQuotesPageLoaded();
    });

    await test.step(`Search for quote ${quoteId}`, async () => {
      await ordersQuotesModule.searchQuote(quoteId);
    });

    await test.step('Verify the filtered Quotes URL contains the quote search query', async () => {
      await expect(page).toHaveURL(new RegExp(`searchQuery=${quoteId}`));
    });

    await test.step(`Verify quote ${quoteId} is available in the Quotes table`, async () => {
      await ordersQuotesModule.verifyQuoteAvailable(quoteId);
    });
  });

});
