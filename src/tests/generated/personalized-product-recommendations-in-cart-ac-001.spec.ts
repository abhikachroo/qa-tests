import { test, expect } from '@fixtures';
import { config } from '@config/index';

test.describe(`@P0 @Smoke @CartRecommendations Personalized Product Recommendations In Cart — ${config.displayName} on ${config.environment}`, () => {
  test('@P0 @Smoke @CartRecommendations TC-001: Open eligible signed-in cart displays Recommended for you section', async ({
    loginModule,
    cartRecommendationsModule,
  }) => {
    await test.step('Sign in with configured OPCO credentials', async () => {
      await loginModule.doLogin();
    });

    await test.step('Open the signed-in cart from the header', async () => {
      await cartRecommendationsModule.openCart();
    });

    await test.step('Verify the recommendations section is visible with product cards', async () => {
      await cartRecommendationsModule.verifyRecommendationsVisible();
    });
  });

  test('@P1 @Functional @CartRecommendations TC-002: Show explanatory copy with recommendation cards in eligible cart', async ({
    loginModule,
    cartRecommendationsModule,
    cartRecommendationsPage,
  }) => {
    await test.step('Sign in with configured OPCO credentials', async () => {
      await loginModule.doLogin();
    });

    await test.step('Open the signed-in cart from the header', async () => {
      await cartRecommendationsModule.openCart();
    });

    await test.step('Verify CMS copy, divider, and recommendation cards are displayed', async () => {
      await cartRecommendationsModule.verifyCmsCopyAndDivider();
      await expect(cartRecommendationsPage.recommendationCards().first()).toBeVisible();
    });
  });
});
