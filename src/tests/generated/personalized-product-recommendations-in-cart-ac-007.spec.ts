import { test, expect } from '@fixtures';
import { config } from '@config/index';

test.describe(`@P2 @Functional @CartRecommendations Personalized Product Recommendations In Cart — ${config.displayName} on ${config.environment}`, () => {
  test('@P2 @Functional @CartRecommendations TC-009: Remove recommended product resets recommendation card to addable state', async ({
    loginModule,
    cartRecommendationsModule,
    cartRecommendationsPage,
  }) => {
    await test.step('Sign in with configured OPCO credentials', async () => {
      await loginModule.doLogin();
    });

    await test.step('Verify the header cart control is available', async () => {
      await expect(cartRecommendationsPage.headerCartLink()).toBeVisible();
    });

    await test.step('Open the signed-in cart from the header', async () => {
      await cartRecommendationsModule.openCart();
    });

    await test.step('Add the first recommended product and verify the cart updates', async () => {
      await cartRecommendationsModule.addFirstRecommendationAndVerifyCartUpdates();
    });

    await test.step('Remove the recommended product and verify the card is addable again', async () => {
      await cartRecommendationsModule.removeRecommendedProductAndVerifyAddableState();
    });
  });
});
