import { test, expect } from '@fixtures';
import { config } from '@config/index';

test.describe(`@P1 @Functional @Negative @CartRecommendations Personalized Product Recommendations In Cart — ${config.displayName} on ${config.environment}`, () => {
  test('@P1 @Functional @CartRecommendations TC-008: Add one recommended product updates cart without full page reload', async ({
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

    await test.step('Add the first recommended product and verify the cart updates without a full reload', async () => {
      await cartRecommendationsModule.addFirstRecommendationAndVerifyCartUpdates();
    });
  });

  test('@P1 @Negative @CartRecommendations TC-014: Prevent duplicate add while recommended product add-to-cart request is pending', async ({
    page,
    loginModule,
    cartRecommendationsModule,
    cartRecommendationsPage,
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

    await test.step('Verify the first recommended product add action is initially available', async () => {
      const firstRecommendationCard = cartRecommendationsPage.recommendationCards().first();
      await expect(cartRecommendationsPage.cardAddToCartButton(firstRecommendationCard)).toBeEnabled();
    });

    await test.step('Attempt a duplicate add while the request is pending and verify it is prevented', async () => {
      await cartRecommendationsModule.verifyDuplicateAddPreventedWhilePending();
    });
  });
});
