import { test, expect } from '@fixtures';
import { config } from '@config/index';

const TARGET_QUOTE_ID = '739715852528783360';

test.describe(`@P0 @Smoke @OrdersQuotes Orders Quotes Quote Availability — ${config.displayName} on ${config.environment}`, () => {

  test('TC-001: Login and navigate to Orders Quotes verifies target quote is available', async ({
    page,
    loginModule,
    ordersQuotesModule,
  }) => {
    await test.step('Authenticate with configured preprod credentials', async () => {
      await loginModule.doLogin();
    });

    await test.step('Verify authenticated account state is visible', async () => {
      await ordersQuotesModule.verifyAuthenticatedState();
    });

    await test.step('Open Orders menu and navigate to Quotes', async () => {
      await ordersQuotesModule.navigateToQuotes();
    });

    await test.step('Verify the Quotes page is displayed', async () => {
      await expect(page).toHaveURL(/\/account\/en-gb\/quotes/);
      await ordersQuotesModule.verifyQuotesPageDisplayed();
    });

    await test.step('Search for the target quote ID', async () => {
      await ordersQuotesModule.searchQuote(TARGET_QUOTE_ID);
    });

    await test.step('Verify the target quote is available in Quotes', async () => {
      await ordersQuotesModule.verifyQuoteAvailable(TARGET_QUOTE_ID);
    });
  });

});
