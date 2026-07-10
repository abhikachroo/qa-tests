import { test, expect } from '@fixtures';
import { config } from '@config/index';

test.describe(`@P1 @Functional @CartRecommendations Personalized Product Recommendations In Cart — ${config.displayName} on ${config.environment}`, () => {
  test('@P1 @Functional @CartRecommendations TC-005: Activate recommendations quick link scrolls to Recommended for you section', async ({
    page,
    loginModule,
    cartRecommendationsModule,
  }) => {
    await test.step('Sign in with configured OPCO credentials', async () => {
      await loginModule.doLogin();
    });

    await test.step('Verify the header cart control is available', async () => {
      await expect(page.getByTestId('cart-button')).toBeVisible();
    });

    await test.step('Open the signed-in cart from the header', async () => {
      await cartRecommendationsModule.openCart();
    });

    await test.step('Activate the recommendations quick link and verify the section is reached', async () => {
      await cartRecommendationsModule.activateQuickLinkAndVerifySection();
    });
  });
});
