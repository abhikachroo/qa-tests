import { test }   from '@fixtures';
import { config } from '@config/index';

const targetQuoteId = '739715852528783360';

test.describe(`@P0 @Smoke @Quotes Orders Quotes Quote Availability Verification — ${config.displayName} on ${config.environment}`, () => {

  /**
   * TC-001: Complete E2E login to Orders Quotes and verify target quote availability
   * AC Reference: AC-001, AC-002, AC-003
   * Priority:     P0 Smoke
   * Precondition: Quote 739715852528783360 exists for account SPARK_ID_SINT301.
   */
  test('TC-001: Complete E2E login to Orders Quotes and verify target quote availability', async ({
    loginModule,
    quotesModule,
  }) => {
    await test.step('Log in with configured Spark preprod credentials', async () => {
      await loginModule.doLogin();
    });

    await test.step('Verify the authenticated account state is visible', async () => {
      await loginModule.verifyLoginSuccess();
    });

    await test.step('Open the Orders menu and navigate to Quotes', async () => {
      await quotesModule.navigateToQuotes();
    });

    await test.step('Verify the Quotes page is displayed', async () => {
      await quotesModule.verifyQuotesPageDisplayed();
    });

    await test.step(`Search for quote ${targetQuoteId}`, async () => {
      await quotesModule.searchQuote(targetQuoteId);
    });

    await test.step(`Verify quote ${targetQuoteId} is available in the filtered result`, async () => {
      await quotesModule.verifyQuoteAvailable(targetQuoteId);
    });
  });

});
