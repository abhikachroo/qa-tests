import { test, expect } from '@fixtures';
import { config } from '@config/index';

test.describe(`@P2 @Functional @CartRecommendations Personalized Product Recommendations In Cart — ${config.displayName} on ${config.environment}`, () => {
  test('@P2 @Functional @CartRecommendations TC-012: Render configured CMS labels explanatory copy and visual divider for recommendations', async ({
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

    await test.step('Verify the configured CMS copy and visual divider are displayed', async () => {
      await cartRecommendationsModule.verifyCmsCopyAndDivider();
    });
  });
});
