import { test, expect } from '@fixtures';
import { config } from '@config/index';

const MAX_RECOMMENDATION_CARDS = 10;

test.describe(`@P1 @Functional @CartRecommendations Personalized Product Recommendations In Cart — ${config.displayName} on ${config.environment}`, () => {
  test('@P1 @Functional @CartRecommendations TC-003: Display no more than ten recommendation cards when service returns many products', async ({
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

    await test.step('Verify no more than ten recommendation cards are displayed', async () => {
      await cartRecommendationsModule.verifyRecommendationCardLimit(MAX_RECOMMENDATION_CARDS);
    });
  });
});
