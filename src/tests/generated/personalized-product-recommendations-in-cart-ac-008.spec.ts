import { test, expect } from '@fixtures';
import { config } from '@config/index';

test.describe(`@P1 @Negative @CartRecommendations Personalized Product Recommendations In Cart — ${config.displayName} on ${config.environment}`, () => {
  test('@P1 @Negative @CartRecommendations TC-011: Keep cart usable when recommendation service fails', async ({
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

    await test.step('Verify the cart remains usable without recommendations', async () => {
      await cartRecommendationsModule.verifyCartUsableWithoutRecommendations();
    });
  });

  test('@P2 @Negative @CartRecommendations TC-010: Hide recommendations section and quick link when recommendation service returns no products', async ({
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

    await test.step('Verify recommendations and the quick link are hidden when unavailable', async () => {
      await cartRecommendationsModule.verifyRecommendationsHiddenWhenUnavailable();
    });
  });
});
